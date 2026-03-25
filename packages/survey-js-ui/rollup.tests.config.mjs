import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, readFileSync } from "node:fs";
import alias from "@rollup/plugin-alias";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import pkg from "./package.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const snapshotsDir = resolve(__dirname, "../../tests/markup/snapshots");

function htmlSnapshotsPlugin() {
  return {
    name: "html-snapshots",
    transform(code, id) {
      if (!id.endsWith("tests/markup.ts") && !id.endsWith("tests\\markup.ts")) {
        return null;
      }
      const files = readdirSync(snapshotsDir).filter(f => f.endsWith(".snap.html"));
      const map = {};
      for (const file of files) {
        const name = file.replace(".snap.html", "");
        map[name] = readFileSync(resolve(snapshotsDir, file), "utf8");
      }
      code = code.replace(
        /require\("\.\.\/\.\.\/\.\.\/tests\/markup\/snapshots\/" \+ snapshot \+ "\.snap\.html"\)/,
        "(__html_snapshots__[snapshot])"
      );
      code = `var __html_snapshots__ = ${JSON.stringify(map)};\n${code}`;
      return { code, map: null };
    },
  };
}

function surveyCoreAlias() {
  return {
    name: "survey-core-alias",
    resolveId(importee, importer) {
      if (importee === "survey-core" && importer) {
        return this.resolve(importee, resolve(__dirname, "tests/markup.ts"), { skipSelf: true });
      }
      return null;
    },
  };
}

export default {
  input: resolve(__dirname, "tests/markup.ts"),
  context: "this",
  output: {
    file: resolve(__dirname, "tests/bundle/test.js"),
    format: "iife",
    sourcemap: "inline",
    name: "SurveyJsUITests",
  },
  plugins: [
    surveyCoreAlias(),
    alias({
      entries: {
        "react": resolve(__dirname, "node_modules/preact/compat"),
        "react-dom/test-utils": resolve(__dirname, "node_modules/preact/test-utils"),
        "react-dom": resolve(__dirname, "node_modules/preact/compat"),
        "react/jsx-runtime": resolve(__dirname, "node_modules/preact/jsx-runtime"),
      },
    }),
    nodeResolve({ extensions: [".ts", ".tsx", ".js", ".jsx"] }),
    typescript({
      tsconfig: resolve(__dirname, "tsconfig.tests.json"),
      filterRoot: false,
      compilerOptions: {
        declaration: false,
        declarationDir: null,
        sourceMap: true,
        inlineSources: true,
      },
    }),
    htmlSnapshotsPlugin(),
    replace({
      preventAssignment: false,
      values: {
        "process.env.RELEASE_DATE": JSON.stringify(new Date().toISOString().slice(0, 10)),
        "process.env.VERSION": JSON.stringify(pkg.version),
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
    }),
  ],
};
