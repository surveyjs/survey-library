import { resolve, dirname } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { createEsmConfigs, createUmdConfigs, createCssConfig } from "./rollup.helpers.mjs";
import fs from "fs-extra";
import rollupResolve from "@rollup/plugin-node-resolve";
import rollupReplace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import svg from "rollup-plugin-svg";
import rollupPluginLicense from "rollup-plugin-license";
import terser from "@rollup/plugin-terser";
import pkg from "./package.json" assert { type: "json" };
import process from "process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");

const banner = [
  "surveyjs - Survey JavaScript library v" + pkg.version,
  "Copyright (c) 2015-" + new Date().getFullYear() + " Devsoft Baltic OÜ  - http://surveyjs.io/", // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");

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

function emitNonSourceFiles() {
  fs.copySync("./README.md", resolve(buildPath, "README.md"));
  fs.writeJsonSync(
    resolve(buildPath, "package.json"),
    buildPlatformJson,
    { spaces: 2 }
  );
}

const external = [];
const umdGlobals = {};
const globalName = "Survey";

if (process.env.emitNonSourceFiles === "true") {
  emitNonSourceFiles();
}

export default (options = {}) => {

  const configs = [
    ...createEsmConfigs({
      sharedFileName: "survey.core-shared.mjs",
      tsconfig: fileURLToPath(new URL("./tsconfig.json", import.meta.url)),
      external: external,
      dir: resolve(buildPath, "./fesm"),
      input: {
        "survey.core": resolve("./entries/index.ts")
      }
    }),
    ...createUmdConfigs({
      tsconfig: fileURLToPath(new URL("./tsconfig.json", import.meta.url)),
      external: external,
      declarationDir: resolve(buildPath, "./typings"),
      dir: resolve(buildPath),
      emitMinified: process.env.emitMinified === "true",
      globalName: globalName,
      globals: umdGlobals,
      input: {
        "survey.core": resolve("./entries/index.ts")
      },
    }),
    ...createCssConfig({
      inputs: {
        "survey-core": resolve("./src/default-theme/default.scss"),
        "survey-core.fontless": resolve("./src/default-theme/default.fontless.scss"),
      },
      output: buildPath,
      minified: process.env.emitMinified === "true",
    })
  ];

  return configs;
};
