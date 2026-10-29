import * as fs from "node:fs";
import * as path from "node:path";
import { spawn } from "node:child_process";
import type { ChildProcess } from "node:child_process";
import { splitOnly } from "../harness/ids.ts";
import { fixtureOfId } from "../harness/scenario.ts";
import { getFixture } from "../fixtures/index.ts";
import { getExtraFixtures } from "../fixtures/extra.ts";
import { extraScenarioIds } from "../scenarios/index.ts";
import { readEnv } from "../harness/node/env.ts";
import { resolveCoreDir, checkBuildFresh, checkBuildExists, runnerRoot, coreBuildHint } from "../harness/node/build.ts";
import { headCommit } from "../harness/node/git.ts";
import { machineInfo } from "../harness/node/machine.ts";
import { dependencyInfo } from "../harness/node/deps.ts";
import { buildPart, resultFilePath, writeJsonAtomic } from "../harness/node/result.ts";
import { sha1, fixtureHashes } from "../harness/node/fixture-hash.ts";
import type { ResultFile, ResultEntry } from "../harness/node/result.ts";

// The core suite (02): every core scenario in its own fresh `node --expose-gc` process, in a fixed order sorted by
// id, against the target build (PERF_CORE_DIR, default the runner's). It writes one result file.
// A guard against a hung process, below the 10-minute suite budget. On master the longest process takes about 80 s;
// on survey-core 3.2.0 complexLogic/answer/next10 takes 7 minutes, and load/design and output/dispose do not finish.
const scenarioTimeoutMs = 300000;
const processScript = path.join(runnerRoot, "perf", "core", "scenario-process.ts");

const env = readEnv();
const core = resolveCoreDir();
const mainFile = path.join(core.dir, "fesm", "survey-core.mjs");
const german = path.join(core.dir, "fesm", "i18n", "german.mjs");
if (!env.coreDir) {
  checkBuildFresh(["src", "entries"].map((d: string) => path.join(runnerRoot, "packages", "survey-core", d)), [mainFile, german], coreBuildHint);
} else {
  checkBuildExists([mainFile, german]);
  const version = JSON.parse(fs.readFileSync(path.join(core.dir, "package.json"), "utf8")).version;
  console.log("PERF_CORE_DIR " + core.dir + ": survey-core " + version + ", built " + new Date(fs.statSync(mainFile).mtimeMs).toISOString());
}

const split = splitOnly(env.only, "core");
let ids = split.run.filter((id: string) => id.indexOf("extra/") !== 0);
const extras = getExtraFixtures(env.extraJson || "");
extras.forEach((f: any) => extraScenarioIds(f.key).forEach((id: string) => {
  if (!env.only || env.only.indexOf(id) > -1) ids.push(id);
}));
const unknownExtra = split.run.filter((id: string) => id.indexOf("extra/") === 0 && ids.indexOf(id) < 0);
if (unknownExtra.length > 0) throw new Error("PERF_ONLY names extra/ ids with no PERF_EXTRA_JSON file: " + unknownExtra.join(", "));
ids = ids.sort();

const fixtures: ResultFile["fixtures"] = {};
Array.from(new Set(ids.map(fixtureOfId))).sort().forEach((key: string) => {
  if (key.indexOf("extra/") === 0) {
    const extra = extras.filter((f: any) => f.key === key)[0];
    fixtures[key] = { hash: sha1(JSON.stringify(extra.json)), options: { path: path.basename(extra.path) } };
    return;
  }
  const f = getFixture(key);
  fixtures[key] = Object.assign(fixtureHashes(f), { options: f.options });
});

// The target's build dependencies: the worktree the build sits in, when it is a survey-library checkout.
const targetRoot = path.resolve(core.dir, "..", "..", "..");
const depsDirs = fs.existsSync(path.join(targetRoot, "packages", "survey-core", "package.json")) ? [targetRoot, path.join(targetRoot, "packages", "survey-core")] : [];
const runnerCommit = headCommit(runnerRoot);
const date = new Date();
const result: ResultFile = {
  schema: 1, suite: "core", kind: env.kind, label: env.label, ref: env.ref, commit: runnerCommit, previousCommit: env.previousCommit,
  date: date.toISOString(),
  requested: { only: env.only, notInSuite: split.notInSuite },
  incomplete: null,
  build: { core: buildPart(core.dir, "fesm/survey-core.mjs", env.targetCommit || (core.isRunnerBuild ? runnerCommit : null)), deps: dependencyInfo(depsDirs) },
  machine: machineInfo({ extra: env.machineExtra }),
  environment: null,
  fixtures: fixtures,
  skipped: [],
  failed: [],
  results: []
};
const file = resultFilePath(env, "core", date);

let child: ChildProcess | undefined;
let stopping = false;
const done = new Set<string>();

// Every write before the end says what is still unrun, so a run killed without a chance to write (SIGKILL, out of
// memory) leaves a file that 04 reads as incomplete, not as complete with scenarios missing.
function write(final?: boolean): void {
  if (!final && !result.incomplete) {
    writeJsonAtomic(file, Object.assign({}, result, { incomplete: { reason: "killed", unrun: ids.filter((id: string) => !done.has(id)) } }));
    return;
  }
  writeJsonAtomic(file, result);
}

// SIGTERM (05 stops a suite over its budget): write what was collected, with the rest as unrun.
const stop = (reason: "timeout" | "killed"): void => {
  if (stopping) return;
  stopping = true;
  if (child) child.kill();
  result.incomplete = { reason: reason, unrun: ids.filter((id: string) => !done.has(id)) };
  write(true);
  console.log("stopped (" + reason + "): " + result.incomplete.unrun.length + " scenarios not run; " + file);
  process.exit(143);
};
process.on("SIGTERM", () => stop("timeout"));
process.on("SIGINT", () => stop("killed"));

function runOne(id: string): Promise<any> {
  return new Promise((resolve: (v: any) => void) => {
    let out = "";
    let err = "";
    const proc = spawn(process.execPath, ["--expose-gc", processScript, id], { cwd: runnerRoot, env: process.env, stdio: ["ignore", "pipe", "pipe"] });
    child = proc;
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; proc.kill(); }, scenarioTimeoutMs);
    proc.stdout.on("data", (d: Buffer) => { out += d.toString(); });
    proc.stderr.on("data", (d: Buffer) => { err += d.toString(); });
    proc.on("close", (code: number | null) => {
      clearTimeout(timer);
      child = undefined;
      const line = out.trim().split("\n").filter((l: string) => l.charAt(0) === "{").pop();
      let msg: any;
      try {
        msg = line ? JSON.parse(line) : undefined;
      } catch(e) {
        msg = undefined;
      }
      // Child processes print nothing on stderr: anything there fails the scenario.
      if (err.trim()) msg = { type: "failed", id: id, error: "stderr: " + err.trim().substring(0, 2000) };
      if (timedOut) msg = { type: "failed", id: id, error: "killed after " + scenarioTimeoutMs / 1000 + " s" };
      if (!msg) msg = { type: "failed", id: id, error: "no result (exit code " + code + ")" + (out ? ": " + out.substring(0, 500) : "") };
      resolve(msg);
    });
  });
}

async function main(): Promise<void> {
  const start = Date.now();
  write();
  console.log("core: " + ids.length + " scenarios" + (split.notInSuite.length ? ", " + split.notInSuite.length + " not in this suite" : "") + " -> " + file);
  for (const id of ids) {
    if (stopping) return;
    const t0 = Date.now();
    const msg = await runOne(id);
    done.add(id);
    const sec = ((Date.now() - t0) / 1000).toFixed(1);
    if (msg.type === "entry") {
      const e: ResultEntry = msg.entry;
      result.results.push(e);
      console.log(id.padEnd(46) + String(e.median).padStart(10) + " ms  n=" + e.samples.length + "  cal " + e.calibration.median + "  (" + sec + " s)");
    } else if (msg.type === "skipped") {
      result.skipped.push({ id: id, reason: msg.reason });
      console.log(id.padEnd(46) + "   skipped: " + msg.reason);
    } else {
      result.failed.push({ id: id, error: msg.error });
      console.log(id.padEnd(46) + "   FAILED: " + String(msg.error).split("\n")[0]);
    }
    write();
  }
  write(true);
  console.log("core: done in " + ((Date.now() - start) / 1000).toFixed(0) + " s; " + result.results.length + " measured, " + result.skipped.length +
    " skipped, " + result.failed.length + " failed; " + file);
  if (result.failed.length > 0) process.exitCode = 1;
}

main().catch((e: any) => {
  console.error(e && e.stack ? e.stack : e);
  process.exitCode = 1;
});
