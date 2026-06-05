#!/usr/bin/env node
// Deploy the assembled Next.js standalone bundle to the cPanel host over WebDAV
// (Web Disk, HTTPS :2078). This is the ONLY remote-write channel this host allows
// from outside — FTP passive ports are firewalled and SSH/SFTP sessions are killed.
// It must be run from a machine whose IP the host permits on :2078 (the owner's
// residential machine — cloud/CI IPs are blocked).
//
// What it does, idempotently:
//   1. Walks .next/standalone (run `node scripts/assemble-standalone.mjs` first).
//   2. Creates every directory on the server (MKCOL, parent-first).
//   3. For every file, compares the SERVER size (PROPFIND — reliable here; HEAD is
//      not, this host returns Content-Length: 0 to HEAD) to the local size and
//      re-uploads (PUT) anything missing or truncated, then re-verifies via PROPFIND.
//   4. Never touches server-owned files: app.js (cPanel startup) and .env (secrets).
//   5. Touches tmp/restart.txt so Passenger respawns.
//
// Credentials come from env (never commit them):
//   WEBDISK_URL   e.g. https://yogmandu.com:2078
//   WEBDISK_USER  e.g. deploy@yogmandu.com
//   WEBDISK_PASS  the Web Disk account password
// A gitignored scripts/.deploy.env (KEY=value lines) is loaded if present.

import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const pexec = promisify(execFile);
const ROOT = ".next/standalone";
const SKIP = new Set(["app.js", ".env"]); // server-owned, never overwrite
const CONCURRENCY = 8;

// ---- load creds ----------------------------------------------------------
const envFile = join("scripts", ".deploy.env");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!(k in process.env)) process.env[k] = v;
  }
}
const URL = (process.env.WEBDISK_URL || "").replace(/\/+$/, "");
const USER = process.env.WEBDISK_USER || "";
const PASS = process.env.WEBDISK_PASS || "";
if (!URL || !USER || !PASS) {
  console.error("Missing WEBDISK_URL / WEBDISK_USER / WEBDISK_PASS (env or scripts/.deploy.env).");
  process.exit(2);
}
if (!existsSync(ROOT)) {
  console.error(`${ROOT} not found. Run: npm run build && node scripts/assemble-standalone.mjs`);
  process.exit(2);
}

const AUTH = `${USER}:${PASS}`;
const curl = (args) => pexec("curl", ["-sS", "-k", "-u", AUTH, ...args], { maxBuffer: 64 * 1024 * 1024 });

// reliable remote size via PROPFIND (returns -1 if missing)
async function remoteSize(remotePath) {
  try {
    const { stdout } = await curl(["-X", "PROPFIND", "-H", "Depth: 0", `${URL}/${remotePath}`]);
    const m = stdout.match(/<a:getcontentlength[^>]*>(\d+)/);
    return m ? parseInt(m[1], 10) : -1;
  } catch {
    return -1;
  }
}
async function mkcol(remotePath) {
  try { await curl(["-o", "/dev/null", "-X", "MKCOL", `${URL}/${remotePath}`]); } catch { /* 405 already-exists is fine */ }
}
async function put(localPath, remotePath) {
  await curl(["-o", "/dev/null", "-T", localPath, `${URL}/${remotePath}`]);
}

// ---- walk local tree -----------------------------------------------------
const files = [];
const dirs = [];
(function walk(dir) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, name.name);
    const rel = relative(ROOT, abs);
    if (name.isDirectory()) { dirs.push(rel); walk(abs); }
    else if (name.isFile() && !SKIP.has(rel)) files.push({ rel, size: statSync(abs).size, abs });
  }
})(ROOT);

console.log(`Local: ${files.length} files, ${dirs.length} dirs → ${URL}`);

// ---- ensure directories (parent-first, parallel within each depth) --------
// Run a bounded pool but keep depth ordering so parents are created before
// children. MKCOL on an existing collection returns 405 and is ignored.
dirs.sort((a, b) => a.split("/").length - b.split("/").length);
{
  let di = 0;
  const dirWorker = async () => {
    while (di < dirs.length) {
      const d = dirs[di++];
      await mkcol(d.split("/").map(encodeURIComponent).join("/"));
    }
  };
  // group by depth so a deeper level never starts before its parents finish
  const byDepth = new Map();
  for (const d of dirs) {
    const k = d.split("/").length;
    if (!byDepth.has(k)) byDepth.set(k, []);
    byDepth.get(k).push(d);
  }
  for (const depth of [...byDepth.keys()].sort((a, b) => a - b)) {
    const group = byDepth.get(depth);
    let gi = 0;
    const w = async () => { while (gi < group.length) { const d = group[gi++]; await mkcol(d.split("/").map(encodeURIComponent).join("/")); } };
    await Promise.all(Array.from({ length: CONCURRENCY }, w));
  }
}
console.log(`Directories ensured (${dirs.length}).`);

// ---- sync files with bounded concurrency ---------------------------------
let uploaded = 0, ok = 0, failed = [];
let idx = 0;
async function worker() {
  while (idx < files.length) {
    const { rel, size, abs } = files[idx++];
    const remote = rel.split("/").map(encodeURIComponent).join("/");
    let rs = await remoteSize(remote);
    if (rs === size) { ok++; continue; }
    // missing or size mismatch → upload, then verify
    await put(abs, remote);
    rs = await remoteSize(remote);
    if (rs === size) { uploaded++; }
    else {
      // one retry
      await put(abs, remote);
      rs = await remoteSize(remote);
      if (rs === size) uploaded++; else failed.push({ rel, want: size, got: rs });
    }
    if ((uploaded + failed.length) % 25 === 0) process.stdout.write(`\r  uploaded ${uploaded} … `);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
process.stdout.write("\n");

console.log(`Already correct: ${ok}`);
console.log(`Uploaded/fixed:  ${uploaded}`);
if (failed.length) {
  console.log(`FAILED (${failed.length}):`);
  for (const f of failed) console.log(`  ${f.rel}  want=${f.want} got=${f.got}`);
  process.exit(1);
}

// ---- request Passenger restart ------------------------------------------
const stamp = `restart ${process.env.GITHUB_SHA || "local"} ${new Date().toISOString()}\n`;
const tmpRestart = "/tmp/yog-restart.txt";
const { writeFileSync } = await import("node:fs");
writeFileSync(tmpRestart, stamp);
await mkcol("tmp");
await put(tmpRestart, "tmp/restart.txt");
console.log("✅ All files verified on server. Touched tmp/restart.txt.");
console.log("   If the app was wedged, click Restart in cPanel → Setup Node.js App.");
