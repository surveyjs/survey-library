import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createEsmConfig, createUmdConfig } from "../../rollup.helpers.mjs";
import process from "process";
import pkg from "./package.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");

const inputs = {
  "tester": resolve(__dirname, "entries", "tester.ts")
};

// This bundle must not carry a second copy of the library: a SurveyModel built by a second copy is not
// the caller's SurveyModel, and the two would not share the serializer, the settings or the class
// identity. src/tester/** therefore reaches the rest of the library through the "survey-core" package
// specifier, the same way src/linter/** does, and both outputs declare it external - the UMD build
// reads it off the "Survey" global.

// build/tester.js and build/typings/entries/tester.d.ts are emitted by two different tools, and a
// consumer that writes `import ... from "survey-core/tester"` looks for the declarations next to the
// bundle. This file is that link; tsc -p tsconfig.tester.json writes what it points at.
function pluginEmitTypesEntry() {
  return {
    name: "tester-types-entry",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "tester.d.ts",
        source: "export * from \"./typings/entries/tester\";\n"
      });
    }
  };
}

export default () => {
  const emitMinified = process.env.emitMinified === "true";

  return [
    createEsmConfig({
      input: inputs,
      dir: resolve(buildPath, "fesm"),
      external: ["survey-core"],
      tsconfig: resolve(__dirname, "tsconfig.tester.json"),
      useEsbuild: true,
      sourceMap: false,
      version: pkg.version
    }),
    createUmdConfig({
      input: inputs,
      tsconfig: resolve(__dirname, "tsconfig.tester.json"),
      external: ["survey-core"],
      globals: { "survey-core": "Survey" },
      globalName: "SurveyTester",
      dir: buildPath,
      emitMinified: emitMinified,
      useEsbuild: true,
      extraPlugins: [pluginEmitTypesEntry()],
      sourceMap: false,
      version: pkg.version
    })
  ];
};
