/**
 * Packages the Next.js standalone build into a single tarball for cPanel.
 *
 *   npm run build && node scripts/package-cpanel.mjs
 *
 * Produces /tmp/yogmandu-deploy.tar.gz — upload to the `yogmandu-next`
 * folder in cPanel File Manager, Extract into `yogmandu-next`, then
 * Restart the Node.js app. The .env and app.js already on the server are
 * preserved (this archive does not overwrite them).
 */
import { execSync } from "node:child_process";
import { existsSync, cpSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");

if (!existsSync(standalone)) {
  console.error("❌ No standalone build found. Run `npm run build` first.");
  process.exit(1);
}

// Copy static assets + public into the standalone tree (Next doesn't do this automatically)
console.log("→ Copying .next/static and public into standalone…");
rmSync(join(standalone, ".next", "static"), { recursive: true, force: true });
cpSync(join(root, ".next", "static"), join(standalone, ".next", "static"), { recursive: true });
rmSync(join(standalone, "public"), { recursive: true, force: true });
cpSync(join(root, "public"), join(standalone, "public"), { recursive: true });

// Package everything EXCEPT app.js and .env (those live on the server, don't clobber them)
const out = "/tmp/yogmandu-deploy.tar.gz";
console.log(`→ Creating ${out}…`);
execSync(
  `tar --exclude=./app.js --exclude=./.env -czf ${out} -C ${standalone} .`,
  { stdio: "inherit" }
);

console.log(`\n✅ Done: ${out}`);
console.log("   Upload to the `yogmandu-next` folder in cPanel → Extract → Restart Node.js app.");
console.log("   (app.js and .env on the server are NOT touched.)");
