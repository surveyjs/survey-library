import { resolve, dirname } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { createEsmConfig, createUmdConfig } from "../../rollup.helpers.mjs";
import fs from "fs-extra";
import process from "process";
import pkg from "./package.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");

// survey-core/linter consumes survey-core as an external dependency, the same way
// survey-react-ui and the icon adapters do: the linter is meaningless without the
// core, and sharing one module closure is what lets it see the settings and the
// FunctionFactory the application customized.
//
// REQUIRES a prior "npm run build": tsconfig.linter.json resolves the "survey-core"
// types through paths -> ./build, and ./build/package.json is only written by the
// main config (under emitNonSourceFiles). Running this config on a clean checkout
// fails with TS2307 "Cannot find module 'survey-core'".
//
// It stays a separate entry point so it is never pulled into the bundle of an
// application that only renders a survey.

// typings stub for consumers on classic (moduleResolution: node) resolution,
// which ignores the exports map and resolves survey-core/linter by directory
fs.outputFileSync(
  resolve(buildPath, "linter", "index.d.ts"),
  "export * from \"../typings/entries/linter\";"
);

export default (options = {}) => {
  return [
    createEsmConfig({
      input: {
        "linter/index": resolve("./entries/linter.ts")
      },
      sharedFileName: "linter/index-shared.mjs",
      tsconfig: fileURLToPath(new URL("./tsconfig.linter.json", import.meta.url)),
      external: ["survey-core"],
      dir: resolve(buildPath, "./fesm"),
      version: pkg.version,
      noEmitOnError: !options.watch,
    }),
    createUmdConfig({
      input: {
        "linter/index": resolve("./entries/linter.ts")
      },
      tsconfig: fileURLToPath(new URL("./tsconfig.linter.json", import.meta.url)),
      external: ["survey-core"],
      declarationDir: resolve(buildPath, "./typings"),
      dir: resolve(buildPath),
      emitMinified: process.env.emitMinified === "true",
      globalName: "SurveyLinter",
      globals: { "survey-core": "Survey" },
      version: pkg.version,
      noEmitOnError: !options.watch,
    }),
  ];
};
