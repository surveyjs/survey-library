import * as fs from "node:fs";
import * as path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { runnerRoot, checkBuildFresh, checkBuildExists } from "../harness/node/build.ts";
import { browserDir, cacheDir, react19Dir, suiteOf, coreDirOf, uiDirOf, uiPackage } from "./paths.ts";

// Before a browser suite (03): the stale-build check, React 19 installed and bundled (react suite), the page
// harness bundled with survey-core external.
const require = createRequire(import.meta.url);

function esbuild(): any {
  try {
    return require(require.resolve("esbuild", { paths: [runnerRoot] }));
  } catch(e) {
    throw new Error("esbuild is missing from the root node_modules (a transitive dependency of rollup-plugin-esbuild): run npm install at the root");
  }
}

export function ensureReact19(): void {
  const pins = JSON.parse(fs.readFileSync(path.join(react19Dir, "package.json"), "utf8")).dependencies;
  const installed = (name: string): string | undefined => {
    const file = path.join(react19Dir, "node_modules", name, "package.json");
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")).version : undefined;
  };
  if (Object.keys(pins).every((name: string) => installed(name) === pins[name])) return;
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  execFileSync(npm, ["install", "--prefix", react19Dir, "--no-package-lock", "--no-audit", "--no-fund"], { stdio: "inherit", shell: process.platform === "win32" });
}

export async function bundleReact19(): Promise<void> {
  const entry = "import * as React from \"react\";\nimport * as ReactDOM from \"react-dom\";\nimport * as ReactDOMClient from \"react-dom/client\";\n" +
    "window.React = React;\nwindow.ReactDOM = ReactDOM;\nwindow.ReactDOMClient = ReactDOMClient;\n";
  await esbuild().build({ stdin: { contents: entry, resolveDir: react19Dir, loader: "js" }, bundle: true, minify: true, format: "iife",
    platform: "browser", define: { "process.env.NODE_ENV": "\"production\"" }, outfile: path.join(cacheDir, "react19.js"), logLevel: "error" });
}

export async function bundlePage(): Promise<void> {
  const out = path.join(cacheDir, "perf-page.js");
  await esbuild().build({ entryPoints: [path.join(browserDir, "page-entry.ts")], bundle: true, format: "iife", platform: "browser",
    external: ["survey-core"], outfile: out, logLevel: "error" });
  const text = fs.readFileSync(out, "utf8");
  if (/surveyjs - Survey JavaScript library|class SurveyModel\b/.test(text)) throw new Error("perf-page.js contains survey-core code");
}

export default async function globalSetup(): Promise<void> {
  const suite = suiteOf();
  const core = coreDirOf();
  const ui = uiDirOf(suite);
  const coreFiles = ["survey.core.min.js", "survey.i18n.min.js", "survey-core.min.css"].map((f: string) => path.join(core, f));
  const uiFiles = [path.join(ui, uiPackage[suite].file)];
  if (!process.env.PERF_CORE_DIR) {
    checkBuildFresh(["src", "entries"].map((d: string) => path.join(runnerRoot, "packages", "survey-core", d)), coreFiles, "npm run build && npm run build:i18n (in packages/survey-core)");
  } else checkBuildExists(coreFiles);
  if (!process.env.PERF_UI_DIR) {
    checkBuildFresh(uiPackage[suite].src.map((d: string) => path.join(runnerRoot, "packages", d)), uiFiles, "npm run build (in packages/" + uiPackage[suite].pkg + ")");
  } else checkBuildExists(uiFiles);
  fs.mkdirSync(cacheDir, { recursive: true });
  if (suite === "react") {
    ensureReact19();
    await bundleReact19();
  }
  await bundlePage();
}
