import { resolve, dirname } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { createEsmConfig, createUmdConfig, createCssConfig } from "./rollup.helpers.mjs";
import fs from "fs-extra";
import pkg from "./package.json" assert { type: "json" };
import process from "process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");

var buildPlatformJson = {
  "name": pkg.name,
  "version": pkg.version,
  "license": "MIT",
  "homepage": "https://surveyjs.io/",
  "author": "DevSoft Baltic OU <info@devsoftbaltic.com>",
  "description": "A framework-independent core of the SurveyJS Form Library that works with rendering packages. Use it to integrate dynamic, interactive JSON-based forms and surveys into your app, collect user responses, and send them to your own database.",
  "keywords": [
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
    "typescript"
  ],
  "files": [
    "**/*"
  ],
  "module": "fesm/survey-core.mjs",
  "main": "survey.core.js",
  "exports": {
    ".": {
      "types": "./typings/entries/index.d.ts",
      "import": "./fesm/survey-core.mjs",
      "require": "./survey.core.js"
    },
    "./*.css": "./*.css",
    "./survey.i18n": {
      "import": "./fesm/survey.i18n.mjs",
      "require": "./survey.i18n.js"
    },
    "./i18n": {
      "import": "./fesm/i18n/index.mjs",
      "require": "./i18n/index.js"
    },
    "./i18n/*": {
      "import": "./fesm/i18n/*.mjs",
      "require": "./i18n/*.js"
    },
    "./themes": {
      "types": "./themes/index.d.ts",
      "import": "./fesm/themes/index.mjs",
      "require": "./themes/index.js"
    },
    "./themes/index": {
      "types": "./themes/index.d.ts",
      "import": "./fesm/themes/index.mjs",
      "require": "./themes/index.js"
    },
    "./themes/*": {
      "types": "./themes/*.d.ts",
      "require": "./themes/*.js"
    },
    "./icons/*": {
      "types": "./icons/*.d.ts",
      "import": "./fesm/icons/*.mjs",
      "require": "./icons/*.js"
    }
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/surveyjs/surveyjs.git"
  },
  "typings": "./typings/entries/index.d.ts"
};

if (process.env.emitNonSourceFiles === "true") {
  fs.copySync("./README.md", resolve(buildPath, "README.md"));
  fs.writeJsonSync(
    resolve(buildPath, "package.json"),
    buildPlatformJson,
    { spaces: 2 }
  );
}

export default (options = {}) => {

  const configs = [
    createEsmConfig({
      input: {
        "survey-core": resolve("./entries/index.ts")
      },
      sharedFileName: "survey.core-shared.mjs",
      tsconfig: fileURLToPath(new URL("./tsconfig.json", import.meta.url)),
      external: [],
      dir: resolve(buildPath, "./fesm"),
    }),
    createUmdConfig({
      input: {
        "survey.core": resolve("./entries/index.ts")
      },
      tsconfig: fileURLToPath(new URL("./tsconfig.json", import.meta.url)),
      external: [],
      declarationDir: resolve(buildPath, "./typings"),
      dir: resolve(buildPath),
      emitMinified: process.env.emitMinified === "true",
      globalName: "Survey",
      globals: {},
    }),
    createCssConfig({
      input: {
        "survey-core": resolve("./src/default-theme/default.scss"),
      },
      dir: buildPath,
      emitMinified: process.env.emitMinified === "true",
    }),
    createCssConfig({
      input: {
        "survey-core.fontless": resolve("./src/default-theme/default.fontless.scss"),
      },
      dir: buildPath,
      emitMinified: process.env.emitMinified === "true",
    })
  ];

  return configs;
};
