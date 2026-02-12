import { resolve, dirname, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync } from "fs";
import { createEsmConfig, createUmdConfig } from "../../rollup.helpers.mjs";
import process from "process";
import pkg from "./package.json" assert { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");

function getEntries() {
  return readdirSync(resolve(__dirname, "src", "themes"))
    .filter(e => extname(e).toLowerCase() === ".ts")
    .reduce((acc, file) => {
      const key = `themes/${basename(file, extname(file))}`;
      acc[key] = resolve(__dirname, "src", "themes", file);
      return acc;
    }, {});
}

export default () => {
  return [
    createEsmConfig({
      input: { "themes/index": resolve(__dirname, "./src/themes/index.ts") },
      dir: resolve(buildPath, "fesm"),
      external: ["survey-core"],
      tsconfig: resolve(__dirname, "tsconfig.themes.json"),
      version: pkg.version
    }),
    ...Object.entries(getEntries()).map(([name, path]) => createUmdConfig({
      input: { [name]: path },
      tsconfig: resolve(__dirname, "tsconfig.themes.json"),
      external: ["survey-core"],
      dir: resolve(buildPath),
      emitMinified: process.env.emitMinified === "true",
      globalName: name == "themes/index" ? "SurveyTheme" : "SurveyTheme." + name.split("/").pop().split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(""),
      exports: name == "themes/index" ? "named" : "default",
      globals: { "survey-core": "Survey" },
      version: pkg.version
    }))
  ];
};