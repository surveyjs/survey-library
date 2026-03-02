import { resolve, dirname } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { createEsmConfig, createUmdConfig } from "../../rollup.helpers.mjs";
import alias from "@rollup/plugin-alias";
import fs from "fs-extra";
import process from "process";
import pkg from "./package.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");

const preactAlias = alias({
  entries: {
    "react": resolve(__dirname, "node_modules/preact/compat"),
    "react-dom/test-utils": resolve(__dirname, "node_modules/preact/test-utils"),
    "react-dom": resolve(__dirname, "node_modules/preact/compat"),
    "react/jsx-runtime": resolve(__dirname, "node_modules/preact/jsx-runtime"),
  },
});

const buildPlatformJson = {
  name: pkg.name,
  version: pkg.version,
  license: "MIT",
  author: "DevSoft Baltic OU <info@devsoftbaltic.com>",
  homepage: "https://surveyjs.io/",
  description: "A free MIT-licensed UI component that renders dynamic, interactive JSON-based forms and surveys in apps built with HTML, CSS, and JavaScript. You can use it to collect responses from users and send them to your own database.",
  keywords: [
    "vanilla",
    "vanilla-js",
    "survey",
    "form",
    "surveyjs",
    "survey-library",
    "form-component",
    "form-rendering",
    "survey-renderer",
    "dynamic-form",
    "interactive-form",
    "form-library",
    "form-management",
    "questionnaire",
    "data-collection",
    "data-validation",
    "form-validation",
    "input-validation",
    "ui-component",
    "json",
    "json-schema",
    "schema-form",
    "survey-renderer",
    "client-side",
    "frontend",
    "javascript",
    "typescript",
  ],
  files: [
    "**/*",
  ],
  repository: {
    type: "git",
    url: "https://github.com/surveyjs/surveyjs.git",
  },
  main: "survey-js-ui.js",
  module: "fesm/survey-js-ui.mjs",
  typings: "./typings/entries/index.d.ts",
  exports: {
    ".": {
      types: "./typings/entries/index.d.ts",
      import: "./fesm/survey-js-ui.mjs",
      require: "./survey-js-ui.js",
    },
  },
  dependencies: {},
  peerDependencies: {
    "survey-core": pkg.version,
    "@types/react-dom": "*",
    "@types/react": "*",
  },
};

if (process.env.emitNonSourceFiles === "true") {
  fs.copySync("./README.md", resolve(buildPath, "README.md"));
  fs.copySync("./index.html", resolve(buildPath, "index.html"));
  fs.writeJsonSync(
    resolve(buildPath, "package.json"),
    buildPlatformJson,
    { spaces: 2 }
  );
}

export default (options = {}) => {
  const esmConfig = createEsmConfig({
    input: {
      "survey-js-ui": resolve("./entries/index.ts"),
    },
    tsconfig: resolve("./tsconfig.json"),
    filterRoot: false,
    external: [
      "survey-core",
    ],
    dir: resolve(buildPath, "./fesm"),
    version: pkg.version,
  });
  esmConfig.plugins.unshift(preactAlias);

  const umdConfig = createUmdConfig({
    input: {
      "survey-js-ui": resolve("./entries/index.ts"),
    },
    tsconfig: fileURLToPath(new URL("./tsconfig.json", import.meta.url)),
    filterRoot: false,
    external: [
      "survey-core",
      "jquery",
    ],
    declarationDir: resolve(buildPath, "./typings"),
    dir: resolve(buildPath),
    emitMinified: process.env.emitMinified === "true",
    globalName: "SurveyUI",
    globals: {
      "survey-core": "Survey",
      "jquery": "jQuery",
    },
    version: pkg.version,
  });
  umdConfig.plugins.unshift(preactAlias);

  return [esmConfig, umdConfig];
};
