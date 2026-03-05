import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";
import pkg from "./package.json" assert { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  input: resolve(__dirname, "tests/entries/test.ts"),
  context: "this",
  output: {
    file: resolve(__dirname, "tests/bundle/test.js"),
    format: "iife",
    sourcemap: "inline",
    name: "SurveyTests",
  },
  plugins: [
    {
      name: "survey-core-alias",
      resolveId(source) {
        if (source === "survey-core") {
          return resolve(__dirname, "entries/index.ts");
        }
        return null;
      },
    },
    nodeResolve({ extensions: [".ts", ".js"] }),
    typescript({
      tsconfig: resolve(__dirname, "tsconfig.tests.json"),
      compilerOptions: {
        declaration: false,
        declarationDir: null,
        sourceMap: true,
        inlineSources: true,
      },
    }),
    replace({
      preventAssignment: false,
      values: {
        "process.env.RELEASE_DATE": JSON.stringify(new Date().toISOString().slice(0, 10)),
        "process.env.VERSION": JSON.stringify(pkg.version),
      },
    }),
  ],
};
