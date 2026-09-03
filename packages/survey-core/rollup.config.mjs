import { resolve, dirname } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { createEsmConfig, createUmdConfig, createCssConfig } from "../../rollup.helpers.mjs";
import fs from "fs-extra";
import process from "process";
import pkg from "./package.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");

const buildPlatformJson = {
  "name": pkg.name,
  "version": pkg.version,
  "license": "MIT",
  "homepage": "https://surveyjs.io/",
  "author": "DevSoft Baltic OU <info@devsoftbaltic.com>",
  "description": "Framework-independent core of SurveyJS Form Library. Provides the form model and logic used by survey-react-ui, survey-angular-ui, survey-vue3-ui, and survey-js-ui to render dynamic, JSON-based forms and collect responses.",
  "keywords": [
    "survey",
    "form",
    "surveyjs",
    "survey-library",
    "form-rendering",
    "survey-renderer",
    "dynamic-form",
    "interactive-form",
    "form-library",
    "questionnaire",
    "data-collection",
    "data-validation",
    "form-validation",
    "input-validation",
    "ui-component",
    "json",
    "json-schema",
    "javascript",
    "typescript",
    "schema-form",
    "conditional-logic",
    "quiz",
    "poll",
    "localization",
    "css",
    "shadcn",
    "mui",
    "material-ui",
    "bootstrap",
    "bootswatch"
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
    "./linter": {
      "types": "./typings/entries/linter.d.ts",
      "import": "./fesm/linter/index.mjs",
      "require": "./linter/index.js"
    },
    "./*.css": "./*.css",
    "./fonts/*": "./fonts/*",
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
    "./tester": {
      "types": "./typings/entries/tester.d.ts",
      "import": "./fesm/tester.mjs",
      "require": "./tester.js"
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
    "./themes/adapters/*.css": "./themes/adapters/*.css",
    "./themes/adapters/icons/*": {
      "import": "./fesm/themes/adapters/icons/*.mjs",
      "require": "./themes/adapters/icons/*.js"
    },
    "./themes/*": {
      "types": "./themes/*.d.ts",
      "import": "./themes/*.js",
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

// The stylesheets reference these as url(fonts/...) instead of inlining them, so the
// files have to sit next to the emitted CSS. Copied unconditionally: a dev build needs
// them just as much as a release one. The Open Sans subsets ship with their license.
fs.copySync(resolve(__dirname, "src/fonts"), resolve(buildPath, "fonts"));

if (process.env.emitNonSourceFiles === "true") {
  fs.mkdirSync(buildPath, { recursive: true });
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
      version: pkg.version,
      noEmitOnError: !options.watch,
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
      version: pkg.version,
      noEmitOnError: !options.watch,
    }),
    createCssConfig({
      input: {
        "survey-core": resolve("./src/default-theme/default.scss"),
      },
      dir: buildPath,
      emitMinified: process.env.emitMinified === "true",
      version: pkg.version,
    }),
    createCssConfig({
      input: {
        "survey-core.fontless": resolve("./src/default-theme/default.fontless.scss"),
      },
      dir: buildPath,
      emitMinified: process.env.emitMinified === "true",
      version: pkg.version,
    })
  ];

  return configs;
};
