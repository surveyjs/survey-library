import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createEsmConfig, createUmdConfig } from "../../rollup.helpers.mjs";
import fs from "fs-extra";
import process from "process";
import pkg from "./package.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");

const aliases = {
  "react": resolve(__dirname, "./node_modules/preact/compat"),
  "react-dom/test-utils": resolve(__dirname, "./node_modules/preact/test-utils"),
  "react-dom": resolve(__dirname, "./node_modules/preact/compat"),
  "react/jsx-runtime": resolve(__dirname, "./node_modules/preact/jsx-runtime"),
  "survey-core/icons/iconsV1": resolve(__dirname, "./node_modules/survey-core/icons/iconsV1"),
  "survey-core/icons/iconsV2": resolve(__dirname, "./node_modules/survey-core/icons/iconsV2"),
};

const buildPlatformJson = {
  "name": pkg.name,
  "version": pkg.version,
  "license": "MIT",
  "description": "Framework-free renderer for dynamic JSON-driven SurveyJS forms in HTML/CSS/JavaScript apps, with jQuery support.",
  "homepage": "https://surveyjs.io/",
  "author": "DevSoft Baltic OU <info@devsoftbaltic.com>",
  "keywords": [
    "vanilla",
    "vanilla-js",
    "jquery",
    "html",
    "survey",
    "form",
    "surveyjs",
    "survey-library",
    "form-library",
    "form-component",
    "survey-renderer",
    "form-rendering",
    "ui-component",
    "dynamic-form",
    "json-schema",
    "schema-form",
    "form-validation",
    "conditional-logic",
    "questionnaire",
    "quiz",
    "poll",
    "data-collection",
    "localization",
    "theming",
    "design-tokens",
    "css-variables",
    "bootstrap",
    "bootswatch",
    "tailwind",
    "svelte",
    "javascript",
    "typescript"
  ],
  "files": [
    "**/*"
  ],
  "main": "survey-js-ui.js",
  "module": "fesm/survey-js-ui.mjs",
  "typings": "./typings/survey-js-ui/entries/index.d.ts",
  "exports": {
    ".": {
      "types": "./typings/survey-js-ui/entries/index.d.ts",
      "import": "./fesm/survey-js-ui.mjs",
      "require": "./survey-js-ui.js"
    }
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/surveyjs/surveyjs.git"
  },
  "dependencies": {},
  "peerDependencies": {
    "survey-core": pkg.version,
    "@types/react-dom": "*",
    "@types/react": "*"
  }
};

if (process.env.emitNonSourceFiles === "true") {
  fs.mkdirSync(buildPath, { recursive: true });
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
        "survey-js-ui": resolve("./entries/index.ts"),
      },
      aliases,
      tsconfig: resolve("./tsconfig.json"),
      external: [
        "survey-core",
      ],
      resolve: {
        dedupe: [
          "survey-core/icons/iconsV1",
          "survey-core/icons/iconsV2",
          "preact/compat",
          "preact/jsx-runtime",
          "preact/test-utils"
        ]
      },
      dir: resolve(buildPath, "./fesm"),
      version: pkg.version,
      noEmitOnError: !options.watch,
    }),
    createUmdConfig({
      input: {
        "survey-js-ui": resolve("./entries/index.ts"),
      },
      aliases,
      tsconfig: resolve("./tsconfig.json"),
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
      noEmitOnError: !options.watch,
    })
  ];
};
