// The report of this script is its output: it runs in CI, and what it prints is the whole finding.
/* eslint-disable no-console */
import console from "node:console";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import process from "node:process";

// Run after "npm run build:all". Two guarantees are checked here, both of them requirements of
// issue #11692: the tester must not reach the bundle of an application that only renders a survey,
// and that bundle must not grow unnoticed.
//
//   node tests/bundle-size/checkBundles.mjs

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(scriptDir, "..", "..");
const buildDir = join(packageRoot, "build");
const baselinePath = join(scriptDir, "baseline.json");

// Identifying strings of the tester. A minifier renames locals, so these are chosen among the names
// it cannot touch: an exported class name and an issue code, which is a string literal.
const TESTER_SYMBOLS = ["SurveyTestRunner", "SurveyTestCommandFactory", "reservedTargetName"];
const CORE_BUNDLE = "survey.core.min.js";
const TESTER_BUNDLE = "tester.js";
// A budget in bytes would have to be moved on every real change; a percentage moves only when the
// bundle actually grows.
const TOLERANCE = 0.01;

const failures = [];

function fail(message) {
  failures.push(message);
}

function readBundle(name) {
  const path = join(buildDir, name);
  if (!existsSync(path)) {
    fail("build/" + name + " does not exist. Run \"npm run build:all\" before this check.");
    return undefined;
  }
  return readFileSync(path);
}

function getGzipSize(content) {
  return gzipSync(content, { level: 9 }).length;
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(1) + " kB (" + bytes + " bytes)";
}

function checkNoTesterInCore(content) {
  const text = content.toString("utf-8");
  const found = TESTER_SYMBOLS.filter(symbol => text.indexOf(symbol) > -1);
  if (found.length === 0) {
    console.log("OK   " + CORE_BUNDLE + " contains no tester symbol.");
    return;
  }
  fail(CORE_BUNDLE + " contains the tester symbol(s) " + found.join(", ") +
    ". survey-core/tester is a separate entry point and must not be reachable from entries/index.ts.");
}

function checkCoreSize(content) {
  const size = getGzipSize(content);
  if (!existsSync(baselinePath)) {
    fail("tests/bundle-size/baseline.json does not exist. Create it with " +
      JSON.stringify({ [CORE_BUNDLE]: { gzipBytes: size } }) + ".");
    return;
  }
  const baseline = JSON.parse(readFileSync(baselinePath, "utf-8"));
  const expected = !!baseline[CORE_BUNDLE] ? baseline[CORE_BUNDLE].gzipBytes : undefined;
  if (typeof expected !== "number") {
    fail("tests/bundle-size/baseline.json has no numeric \"" + CORE_BUNDLE + "\".gzipBytes.");
    return;
  }
  const limit = Math.floor(expected * (1 + TOLERANCE));
  const growth = ((size - expected) / expected) * 100;
  const change = (growth >= 0 ? "+" : "") + growth.toFixed(2) + "%";
  if (size > limit) {
    fail(CORE_BUNDLE + " is " + formatBytes(size) + " gzipped, " + change + " over the baseline of " +
      formatBytes(expected) + " (the limit is " + formatBytes(limit) + "). If the growth is intended, " +
      "set \"" + CORE_BUNDLE + "\".gzipBytes to " + size + " in tests/bundle-size/baseline.json in the same change.");
    return;
  }
  console.log("OK   " + CORE_BUNDLE + " is " + formatBytes(size) + " gzipped, " + change + " against the baseline.");
}

// No budget on the tester: it is opt-in, and a number nobody is allowed to exceed would only invite
// someone to raise it. It is reported so that a jump is visible in the CI log.
function reportTesterSize(content) {
  console.log("INFO " + TESTER_BUNDLE + " is " + formatBytes(getGzipSize(content)) + " gzipped (opt-in, no budget).");
}

const core = readBundle(CORE_BUNDLE);
if (!!core) {
  checkNoTesterInCore(core);
  checkCoreSize(core);
}
const tester = readBundle(TESTER_BUNDLE);
if (!!tester) {
  reportTesterSize(tester);
}

if (failures.length > 0) {
  failures.forEach(message => console.error("FAIL " + message));
  process.exitCode = 1;
}
