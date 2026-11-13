import { resolve, dirname } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { createEsmConfig, createUmdConfig, createCssConfig } from "../../rollup.helpers.mjs";
import fs from "fs-extra";
import process from "process";
import pkg from "./package.json" with { type: "json" };
import svgo from "rollup-plugin-svgo";

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");

function svgPlugin() {
  return svgo({
    plugins: [
      { name: "removeDimensions", active: true },
      { name: "removeTitle", active: true },
      { name: "removeDesc", active: true },
      { name: "removeUselessDefs", active: true },
      { name: "removeXMLNS", active: false },
    ]
  });
}

// survey-core/rich-text consumes survey-core as an external dependency, the same way
// the collaboration plugin does: one Serializer, one settings object, one Base identity.
//
// REQUIRES a prior "npm run build": tsconfig.rich-text.json resolves the "survey-core"
// types through paths -> ./build, and ./build/package.json is only written by the main config.

// typings stub for consumers on classic (moduleResolution: node) resolution, which ignores
// the exports map and resolves survey-core/rich-text by directory.
fs.outputFileSync(
  resolve(buildPath, "rich-text", "index.d.ts"),
  "export * from \"../typings/entries/rich-text\";"
);

export default (options = {}) => {
  return [
    createEsmConfig({
      input: {
        "rich-text/index": resolve("./entries/rich-text.ts")
      },
      sharedFileName: "rich-text/index-shared.mjs",
      tsconfig: fileURLToPath(new URL("./tsconfig.rich-text.json", import.meta.url)),
      external: ["survey-core"],
      dir: resolve(buildPath, "./fesm"),
      version: pkg.version,
      noEmitOnError: !options.watch,
      extraPlugins: [svgPlugin()],
    }),
    createUmdConfig({
      input: {
        "rich-text/index": resolve("./entries/rich-text.ts")
      },
      tsconfig: fileURLToPath(new URL("./tsconfig.rich-text.json", import.meta.url)),
      external: ["survey-core"],
      declarationDir: resolve(buildPath, "./typings"),
      dir: resolve(buildPath),
      emitMinified: process.env.emitMinified === "true",
      globalName: "SurveyRichText",
      globals: { "survey-core": "Survey" },
      version: pkg.version,
      noEmitOnError: !options.watch,
      extraPlugins: [svgPlugin()],
    }),
    createCssConfig({
      input: {
        "rich-text": resolve("./src/default-theme/rich-text.scss"),
      },
      dir: buildPath,
      emitMinified: process.env.emitMinified === "true",
      version: pkg.version,
    })
  ];
};
