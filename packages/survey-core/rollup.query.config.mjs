import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createEsmConfig, createUmdConfig } from "../../rollup.helpers.mjs";
import process from "process";
import pkg from "./package.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");

const inputs = {
  "query": resolve(__dirname, "entries", "query.ts")
};

// This bundle must not carry a second copy of the library: the renderers read the caller's settings.comparator
// and build the tree with the caller's FunctionFactory, where the application registers its custom functions.
// src/query/** therefore reaches the rest of the library through the "survey-core" package specifier, the same
// way src/tester/** does, and both outputs declare it external - the UMD build reads it off the "Survey" global.

// The declarations are written by tsc -p tsconfig.query.json into build/typings/, and the "./query"
// entry of the exports map points straight at them. Nothing is emitted next to the bundle itself, so
// the subpath is only typed for consumers on a modern moduleResolution - the classic "node" one
// ignores the exports map and would find no declarations.

export default () => {
  const emitMinified = process.env.emitMinified === "true";

  return [
    createEsmConfig({
      input: inputs,
      dir: resolve(buildPath, "fesm"),
      external: ["survey-core"],
      tsconfig: resolve(__dirname, "tsconfig.query.json"),
      useEsbuild: true,
      sourceMap: false,
      version: pkg.version
    }),
    createUmdConfig({
      input: inputs,
      tsconfig: resolve(__dirname, "tsconfig.query.json"),
      external: ["survey-core"],
      globals: { "survey-core": "Survey" },
      globalName: "SurveyQuery",
      dir: buildPath,
      emitMinified: emitMinified,
      useEsbuild: true,
      sourceMap: false,
      version: pkg.version
    })
  ];
};
