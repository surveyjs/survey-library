import * as fs from "node:fs";
import * as path from "node:path";
import { splitOnly } from "../harness/ids.ts";
import { fixtureOfId } from "../harness/scenario.ts";
import { getFixture } from "../fixtures/index.ts";
import { readEnv } from "../harness/node/env.ts";
import { runnerRoot, resolveCoreDir } from "../harness/node/build.ts";
import { headCommit } from "../harness/node/git.ts";
import { machineInfo } from "../harness/node/machine.ts";
import { dependencyInfo } from "../harness/node/deps.ts";
import { fixtureHashes } from "../harness/node/fixture-hash.ts";
import { buildPart, resultFilePath, writeJsonAtomic } from "../harness/node/result.ts";
import type { ResultFile } from "../harness/node/result.ts";
import { suiteOf, uiDirOf, uiPackage, react19Dir } from "./paths.ts";

// Collects each test's "perf-result" attachment and writes one result file of 02's format in onEnd, or on SIGTERM
// (05 stops a suite over its budget) with incomplete: { reason, unrun }.
export default class PerfReporter {
  private result: ResultFile;
  private file: string;
  private ids: Array<string>;
  private done = new Set<string>();
  private written = false;
  private unrun: Array<string> = [];
  private setupError: string | undefined;

  constructor() {
    const suite = suiteOf();
    const env = readEnv();
    const split = splitOnly(env.only, suite);
    this.ids = split.run;
    const core = resolveCoreDir();
    const uiDir = uiDirOf(suite);
    const runnerCommit = headCommit(runnerRoot);
    const fixtures: ResultFile["fixtures"] = {};
    Array.from(new Set(this.ids.map(fixtureOfId))).sort().forEach((key: string) => {
      const f = getFixture(key);
      fixtures[key] = Object.assign(fixtureHashes(f), { options: f.options });
    });
    const targetRoot = path.resolve(core.dir, "..", "..", "..");
    const isCheckout = fs.existsSync(path.join(targetRoot, "packages", "survey-core", "package.json"));
    const depsDirs = isCheckout ? [targetRoot, path.join(targetRoot, "packages", "survey-core"), path.join(targetRoot, "packages", uiPackage[suite].pkg)] : [];
    const commit = env.targetCommit || (core.isRunnerBuild ? runnerCommit : null);
    const uiCommit = env.targetCommit || (!process.env.PERF_UI_DIR ? runnerCommit : null);
    const date = new Date();
    this.result = {
      schema: 1, suite: suite, kind: env.kind, label: env.label, ref: env.ref, commit: runnerCommit, previousCommit: env.previousCommit,
      date: date.toISOString(), requested: { only: env.only, notInSuite: split.notInSuite }, incomplete: null,
      build: { core: buildPart(core.dir, "survey.core.min.js", commit), ui: buildPart(uiDir, uiPackage[suite].file, uiCommit), deps: dependencyInfo(depsDirs) },
      machine: machineInfo({ extra: env.machineExtra }), environment: null, fixtures: fixtures, skipped: [], failed: [], results: []
    };
    this.file = resultFilePath(env, suite, date);
    const stop = (): void => {
      this.result.incomplete = { reason: "timeout", unrun: this.ids.filter((id: string) => !this.done.has(id)) };
      this.write();
      process.exit(143);
    };
    process.on("SIGTERM", stop);
  }

  private write(): void {
    if (this.written) return;
    this.written = true;
    writeJsonAtomic(this.file, this.result);
  }

  onTestEnd(test: any, result: any): void {
    const id = test.title;
    const browserInfo = result.attachments.filter((a: any) => a.name === "perf-browser")[0];
    if (browserInfo)this.result.machine = machineInfo({ chromium: JSON.parse(browserInfo.body.toString()).chromium, extra: readEnv().machineExtra });
    if (id === "environment" && result.status !== "passed") {
      this.result.failed.push({ id: "environment", error: (result.errors || []).map((e: any) => e.message || String(e)).join("\n").substring(0, 2000) || result.status });
    }
    const env = result.attachments.filter((a: any) => a.name === "perf-environment")[0];
    if (env) {
      const info = JSON.parse(env.body.toString());
      this.result.machine = machineInfo({ chromium: info.chromium, extra: readEnv().machineExtra });
      const framework: { [name: string]: string } = {};
      if (info.framework.react) framework.react = info.framework.react;
      if (!info.framework.react) framework.preact = this.preactVersion();
      if (this.result.build.ui)this.result.build.ui.framework = framework;
      return;
    }
    if (id === "environment" || !test.title || this.ids.indexOf(id) < 0) return;
    // F5: a test that never ran (after a worker crash, or interrupted) is unrun, not failed.
    if ((result.status === "skipped" || result.status === "interrupted") && !result.attachments.some((a: any) => a.name === "perf-result")) {
      this.unrun.push(id);
      return;
    }
    this.done.add(id);
    const att = result.attachments.filter((a: any) => a.name === "perf-result")[0];
    const res = att ? JSON.parse(att.body.toString()) : undefined;
    if (res && res.skipped)this.result.skipped.push({ id: id, reason: res.skipped });
    else if (res && res.entry && result.status === "passed")this.result.results.push(res.entry);
    else this.result.failed.push({ id: id, error: (result.errors || []).map((e: any) => e.message || String(e)).join("\n").substring(0, 2000) || result.status });
  }

  // survey-js-ui bundles Preact; the version is the one its package installs, when the served build is the runner's.
  private preactVersion(): string {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(runnerRoot, "packages", "survey-js-ui", "node_modules", "preact", "package.json"), "utf8"));
      return process.env.PERF_UI_DIR ? "bundled (runner: " + pkg.version + ")" : pkg.version;
    } catch(e) {
      return "bundled";
    }
  }

  onError(error: any): void {
    this.setupError = this.setupError || String((error && (error.message || error.stack)) || error).substring(0, 2000);
  }

  onEnd(result: any): void {
    const unrun = this.ids.filter((id: string) => !this.done.has(id)).concat(this.unrun.filter((id: string) => this.done.has(id) === false));
    const notRun = Array.from(new Set(unrun));
    if (notRun.length > 0)this.result.incomplete = { reason: "killed", unrun: notRun };
    if (this.done.size === 0 && result && result.status !== "passed") {
      this.result.failed.push({ id: "setup", error: this.setupError || "the run ended " + result.status + " before any scenario ran" });
    }
    if (this.result.suite === "react") {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(react19Dir, "node_modules", "react", "package.json"), "utf8"));
        if (this.result.build.ui)this.result.build.ui.framework = Object.assign({ react: pkg.version }, this.result.build.ui.framework || {});
      } catch(e) {
        // React 19 is not installed: globalSetup failed, and the run has no results.
      }
    }
    this.result.results.sort((a: any, b: any) => (a.id < b.id ? -1 : 1));
    this.write();
    console.log(this.result.suite + ": " + this.result.results.length + " measured, " + this.result.skipped.length + " skipped, " +
      this.result.failed.length + " failed; " + this.file);
  }

  printsToStdio(): boolean {
    return true;
  }
}
