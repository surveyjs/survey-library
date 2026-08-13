import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createEsmConfig, createUmdConfig } from "../../rollup.helpers.mjs";
import process from "process";
import pkg from "./package.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");
const testerDir = toPosix(resolve(__dirname, "src", "tester")) + "/";

const inputs = {
  "tester": resolve(__dirname, "entries", "tester.ts")
};

function toPosix(path) {
  return path.replace(/\\/g, "/");
}

// src/tester/** reaches the rest of the library through relative imports, and this bundle must not
// carry a second copy of it: a SurveyModel built by a second copy of the library is not the caller's
// SurveyModel, and the two would not share the serializer, the settings or the class identity. Every
// relative import that leaves src/tester/ is therefore redirected to the "survey-core" package, which
// the output declares external and the UMD build reads off the "Survey" global.
function pluginExternalSurveyCore() {
  return {
    name: "tester-external-survey-core",
    resolveId(source, importer) {
      if (!importer || source.charAt(0) !== ".") return null;
      const id = toPosix(resolve(dirname(importer), source));
      if (id.indexOf(testerDir) === 0) return null;
      return { id: "survey-core", external: true };
    }
  };
}

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
      extraPlugins: [pluginExternalSurveyCore()],
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
      extraPlugins: [pluginExternalSurveyCore(), pluginEmitTypesEntry()],
      sourceMap: false,
      version: pkg.version
    })
  ];
};
