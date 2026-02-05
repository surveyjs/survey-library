import { resolve, extname, basename, dirname } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { readdirSync } from "fs";
import pkg from "./package.json" with { type: "json" };

import pluginTypescript from "@rollup/plugin-typescript";
import pluginNodeResolve from "@rollup/plugin-node-resolve";
import pluginReplace from "@rollup/plugin-replace";
import pluginBanner from "rollup-plugin-license";

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");

function getEntries() {

  const inputs = {
    "survey.i18n": resolve(__dirname, "./entries/i18n.ts")
  };

  readdirSync(resolve(__dirname, "./src/localization")).forEach(file => {
    var extension = extname(file);
    if (extension.toLowerCase() === ".ts") {
      inputs[`i18n/${basename(file, extension)}`] = (resolve(__dirname, "./src/localization") + "/" + file);
    }
  });
  inputs["i18n/index"] = resolve(__dirname, "./entries/i18n.ts");

  return inputs;
}

const banner = [
  "surveyjs - Survey JavaScript library v" + pkg.version,
  "Copyright (c) 2015-" + new Date().getFullYear() + " Devsoft Baltic OÜ  - http://surveyjs.io/", // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");

export default () => {

  const inputs = getEntries();

  const config = [{
    context: "this",
    input: inputs,
    external: ["survey-core"],
    output: [
      {
        dir: resolve(buildPath, "fesm"),
        entryFileNames: "[name].mjs",
        format: "esm",
        exports: "named",
        sourcemap: true,
      },
      // {
      //   dir: buildPath,
      //   entryFileNames: "[name].js",
      //   format: "umd",
      //   exports: "named",
      //   sourcemap: true,
      // }
    ],
    plugins: [
      pluginNodeResolve(),
      pluginTypescript({
        inlineSources: true,
        sourceMap: true,
        tsconfig: fileURLToPath(new URL("./tsconfig.json", import.meta.url)),
        compilerOptions: {
          declaration: false,
          declarationDir: null
        }
      }),
      pluginReplace({
        preventAssignment: false,
        values: {
          "process.env.RELEASE_DATE": JSON.stringify(new Date().toISOString().slice(0, 10)),
          "process.env.VERSION": JSON.stringify(pkg.version),
        }
      }),
      pluginBanner({
        banner: {
          content: banner,
          commentStyle: "ignored",
        }
      })
    ],
  }];

  for (const [name, path] of Object.entries(inputs)) {

    // console.info(`Processing ${name}... ${path} `);
  }

  // console.info(config);
  // process.exit(0);
  return config;
};