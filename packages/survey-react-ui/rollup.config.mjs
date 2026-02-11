import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import bannerPlugin from "rollup-plugin-license";
import path from "path";
import { resolve, dirname } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { createEsmConfig, createUmdConfig, createCssConfig } from "./rollup.helpers.mjs";
import fs from "fs-extra";
import process from "process";
import pkg from "./package.json" assert { type: "json" };
const VERSION = pkg.version;

const banner = [
  "surveyjs - Survey JavaScript library v" + pkg.version,
  "Copyright (c) 2015-" + new Date().getFullYear() + " Devsoft Baltic OÜ  - http://surveyjs.io/", // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");

const buildPlatformJson = {
  name: pkg.name,
  version: pkg.version,
  license: "MIT",
  author: "DevSoft Baltic OU <info@devsoftbaltic.com>",
  homepage: "https://surveyjs.io/",
  description: "A free MIT-licensed React UI component that renders dynamic, interactive JSON-based forms and surveys. You can use it to collect responses from users and send them to your own database.",
  keywords: [
    "react",
    "survey",
    "form",
    "surveyjs",
    "survey-library",
    "react-component",
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
    "react-schema-form",
    "survey-renderer",
    "client-side",
    "frontend",
    "javascript",
    "typescript"
  ],
  "files": [
    "**/*"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/surveyjs/surveyjs.git"
  },
  "main": "survey-react-ui.js",
  "module": "fesm/survey-react-ui.mjs",
  "typings": "./typings/entries/index.d.ts",
  "exports": {
    ".": {
      "types": "./typings/entries/index.d.ts",
      "import": "./fesm/survey-react-ui.mjs",
      "require": "./survey-react-ui.js"
    }
  },
  "peerDependencies": {
    "survey-core": pkg.version,
    "react": "^16.5.0 || ^17.0.1 || ^18.1.0 || ^19.0.0",
    "react-dom": "^16.5.0 || ^17.0.1 || ^18.1.0 || ^19.0.0",
  }
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

  return [
    createEsmConfig({
      input: {
        "survey-react-ui": resolve("./entries/index.ts")
      },
      sharedFileName: "survey.core-shared.mjs",
      tsconfig: resolve("./tsconfig.json"),
      external: [
        "react",
        "react-dom",
        "survey-core"
      ],
      dir: resolve(buildPath, "./fesm"),
    }),
    createUmdConfig({
      input: {
        "survey-react-ui": resolve("./entries/index.ts")
      },
      tsconfig: fileURLToPath(new URL("./tsconfig.json", import.meta.url)),
      external: [
        "react",
        "react-dom",
        "survey-core"
      ],
      declarationDir: resolve(buildPath, "./typings"),
      dir: resolve(buildPath),
      emitMinified: process.env.emitMinified === "true",
      globalName: "SurveyReact",
      globals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "survey-core": "Survey"
      },
    }),
  ];
};