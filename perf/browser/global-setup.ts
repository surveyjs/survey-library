import * as fs from "node:fs";
import * as path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { runnerRoot, checkBuildFresh, checkBuildExists } from "../harness/node/build.ts";
import { browserDir, cacheDir, react19Dir, vue3Dir, angularDir, suiteOf, coreDirOf, uiDirOf, uiPackage } from "./paths.ts";

// Before a browser suite (03): the stale-build check, the suite's pinned framework installed and bundled (React 19,
// Vue 3, or the Angular app with survey-angular-ui linked in), the page harness bundled with survey-core external.
const require = createRequire(import.meta.url);

function esbuild(): any {
  try {
    return require(require.resolve("esbuild", { paths: [runnerRoot] }));
  } catch(e) {
    throw new Error("esbuild is missing from the root node_modules (a transitive dependency of rollup-plugin-esbuild): run npm install at the root");
  }
}

// Installs the exact pins of a perf/<framework> folder unless they are installed already.
export function ensurePinned(dir: string): void {
  const pins = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8")).dependencies;
  const installed = (name: string): string | undefined => {
    const file = path.join(dir, "node_modules", name, "package.json");
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")).version : undefined;
  };
  if (Object.keys(pins).every((name: string) => installed(name) === pins[name])) return;
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  execFileSync(npm, ["install", "--prefix", dir, "--no-package-lock", "--no-audit", "--no-fund"], { stdio: "inherit", shell: process.platform === "win32" });
}

export async function bundleReact19(): Promise<void> {
  const entry = "import * as React from \"react\";\nimport * as ReactDOM from \"react-dom\";\nimport * as ReactDOMClient from \"react-dom/client\";\n" +
    "window.React = React;\nwindow.ReactDOM = ReactDOM;\nwindow.ReactDOMClient = ReactDOMClient;\n";
  await esbuild().build({ stdin: { contents: entry, resolveDir: react19Dir, loader: "js" }, bundle: true, minify: true, format: "iife",
    platform: "browser", define: { "process.env.NODE_ENV": "\"production\"" }, outfile: path.join(cacheDir, "react19.js"), logLevel: "error" });
}

export function copyVue3(): void {
  fs.copyFileSync(path.join(vue3Dir, "node_modules", "vue", "dist", "vue.global.prod.js"), path.join(cacheDir, "vue3.js"));
}

// The Angular page app: perf/browser/angular-entry.ts with the pinned Angular of perf/angular, production mode. The
// survey-angular-ui build is partial-Ivy (ng-packagr), so it and the Angular packages go through Angular's linker.
// Every @angular/*, rxjs, tslib and zone.js import resolves to perf/angular, the survey-angular-ui build's own
// node_modules included. survey-core is window.Survey, the build the page loads from /core; its icons come from the
// same build, as the React and survey-js-ui builds bundle them.
export async function bundleAngular(coreDir: string, uiDir: string): Promise<void> {
  const ngRequire = createRequire(path.join(angularDir, "package.json"));
  const babel = ngRequire("@babel/core");
  const linker = (await import(pathToFileURL(ngRequire.resolve("@angular/compiler-cli/linker/babel")).href)).default;
  const plugin = {
    name: "perf-angular",
    setup(build: any): void {
      build.onResolve({ filter: /^survey-core$/ }, () => ({ path: "survey-core", namespace: "perf-global" }));
      build.onLoad({ filter: /.*/, namespace: "perf-global" }, () => ({ contents: "module.exports = window.Survey;", loader: "js" }));
      build.onResolve({ filter: /^survey-core\/icons\/[\w-]+$/ }, (a: any) => ({ path: path.join(coreDir, a.path.substring("survey-core/".length) + ".js") }));
      build.onResolve({ filter: /^survey-angular-ui$/ }, () => ({ path: path.join(uiDir, uiPackage.angular.file) }));
      build.onResolve({ filter: /^(@angular\/|rxjs|tslib$|zone\.js)/ }, (a: any) => {
        if (a.pluginData === "pinned") return undefined;
        return build.resolve(a.path, { kind: a.kind, resolveDir: angularDir, pluginData: "pinned" });
      });
      build.onLoad({ filter: /\.m?js$/ }, async(a: any) => {
        const code = fs.readFileSync(a.path, "utf8");
        if (code.indexOf("\u0275\u0275ngDeclare") < 0) return undefined;
        const res = await babel.transformAsync(code, { filename: a.path, configFile: false, babelrc: false, compact: false, sourceMaps: false,
          plugins: [[linker, { linkerJitMode: false }]] });
        return { contents: res.code, loader: "js" };
      });
    }
  };
  // es2016: zone.js cannot see a native await, so async functions are lowered to generators as the Angular CLI does.
  await esbuild().build({ entryPoints: [path.join(browserDir, "angular-entry.ts")], bundle: true, format: "iife", platform: "browser", minify: true,
    target: "es2016", conditions: ["es2020", "es2015"], mainFields: ["es2020", "es2015", "browser", "module", "main"],
    define: { ngDevMode: "false", ngJitMode: "false", ngI18nClosureMode: "false" }, outfile: path.join(cacheDir, "angular-app.js"), logLevel: "error",
    plugins: [plugin] });
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
    ensurePinned(react19Dir);
    await bundleReact19();
  }
  if (suite === "vue3") {
    ensurePinned(vue3Dir);
    copyVue3();
  }
  if (suite === "angular") {
    ensurePinned(angularDir);
    await bundleAngular(core, ui);
  }
  await bundlePage();
}
