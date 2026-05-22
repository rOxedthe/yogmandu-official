#!/usr/bin/env node
/**
 * debug-patch.mjs
 *
 * Post-build patch: exposes the real runtime error in the HTTP response body
 * instead of "Internal Server Error", so we can diagnose the production 500.
 *
 * REMOVE this script once the root cause is identified and fixed.
 */

import { readFileSync, writeFileSync } from 'fs';

const workerPath = '.open-next/assets/_worker.js';
let content = readFileSync(workerPath, 'utf-8');
let patched = false;

// ── Patch 1: expose the actual error at the Next.js last-resort handler ──────
// Line: this.logError((0, _iserror.getProperError)(err)), res.statusCode = 500, res.body("Internal Server Error").send();
const OLD1 = `this.logError((0, _iserror.getProperError)(err)), res.statusCode = 500, res.body("Internal Server Error").send()`;
const NEW1 = `const __e1 = (0, _iserror.getProperError)(err); this.logError(__e1), res.statusCode = 500, res.body("DEBUG-ERR: " + (__e1?.stack || __e1?.message || String(__e1))).send()`;

if (content.includes(OLD1)) {
  content = content.replace(OLD1, NEW1);
  console.log('✅ Patch 1 applied: Next.js error handler now exposes real error');
  patched = true;
} else {
  console.error('❌ Patch 1 failed: target string not found');
}

// ── Patch 2: also expose errors at the OpenNext level (the other 500 path) ──
// Line: res.statusCode = 500, res.setHeader("Content-Type", "application/json"), res.end(JSON.stringify({ message: "Server failed to respond.", details: e }, null, 2));
const OLD2 = `res.statusCode = 500, res.setHeader("Content-Type", "application/json"), res.end(JSON.stringify({ message: "Server failed to respond.", details: e }, null, 2))`;
const NEW2 = `res.statusCode = 500, res.setHeader("Content-Type", "application/json"), res.end(JSON.stringify({ message: "Server failed to respond.", details: e, stack: e?.stack, message_str: String(e?.message || e) }, null, 2))`;

if (content.includes(OLD2)) {
  content = content.replace(OLD2, NEW2);
  console.log('✅ Patch 2 applied: OpenNext error handler now includes error stack');
  patched = true;
}

// ── Patch 3: enable openNextDebug globally ────────────────────────────────────
// This adds X-OpenNext-Version and X-OpenNext-RequestId headers
const DEBUG_FALSE_COUNT = (content.match(/globalThis\.openNextDebug = false/g) || []).length;
if (DEBUG_FALSE_COUNT > 0) {
  content = content.replaceAll('globalThis.openNextDebug = false', 'globalThis.openNextDebug = true');
  console.log(`✅ Patch 3 applied: enabled openNextDebug (${DEBUG_FALSE_COUNT} occurrences)`);
  patched = true;
}

if (patched) {
  writeFileSync(workerPath, content);
  console.log('\n📝 Worker patched for debugging. Visit the site to see the actual error.');
  console.log('   Look for "DEBUG-ERR: ..." in the response body.');
} else {
  console.error('\n❌ No patches applied - worker structure may have changed');
  process.exit(1);
}
