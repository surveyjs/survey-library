import { resolve, dirname } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { createEsmConfig, createUmdConfig, createCssConfig } from "../../rollup.helpers.mjs";
import fs from "fs-extra";
import process from "process";
import pkg from "./package.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");

// survey-core/collaboration consumes survey-core as an external dependency, the same way
// the linter and the icon adapters do: the plugin drives the caller's SurveyModel, so it
// must share one module closure - one Serializer, one settings object, one Base identity.
// Inlining a second copy would produce a plugin that decorates a survey nobody is rendering,
// and it would do so without a single error message.
//
// It stays a separate entry point so that a form which does not collaborate pays nothing for
// it, neither JS nor CSS.
//
// REQUIRES a prior "npm run build": tsconfig.collaboration.json resolves the "survey-core"
// types through paths -> ./build, and ./build/package.json is only written by the main config
// (under emitNonSourceFiles). Running this config on a clean checkout fails with TS2307.

// typings stub for consumers on classic (moduleResolution: node) resolution, which ignores
// the exports map and resolves survey-core/collaboration by directory. The Angular client is
// exactly such a consumer.
fs.outputFileSync(
  resolve(buildPath, "collaboration", "index.d.ts"),
  "export * from \"../typings/entries/collaboration\";"
);

export default (options = {}) => {
  return [
    createEsmConfig({
      input: {
        "collaboration/index": resolve("./entries/collaboration.ts")
      },
      sharedFileName: "collaboration/index-shared.mjs",
      tsconfig: fileURLToPath(new URL("./tsconfig.collaboration.json", import.meta.url)),
      external: ["survey-core"],
      dir: resolve(buildPath, "./fesm"),
      version: pkg.version,
      noEmitOnError: !options.watch,
    }),
    createUmdConfig({
      input: {
        "collaboration/index": resolve("./entries/collaboration.ts")
      },
      tsconfig: fileURLToPath(new URL("./tsconfig.collaboration.json", import.meta.url)),
      external: ["survey-core"],
      declarationDir: resolve(buildPath, "./typings"),
      dir: resolve(buildPath),
      emitMinified: process.env.emitMinified === "true",
      globalName: "SurveyCollaboration",
      globals: { "survey-core": "Survey" },
      version: pkg.version,
      noEmitOnError: !options.watch,
    }),
    createCssConfig({
      input: {
        "collaboration": resolve("./src/default-theme/collaboration.scss"),
      },
      dir: buildPath,
      emitMinified: process.env.emitMinified === "true",
      version: pkg.version,
    })
  ];
};
