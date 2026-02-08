import { resolve, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync } from "fs";
import { createEsmConfigs, createUmdConfigs } from "./rollup.helpers.mjs";
import process from "process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");

function getEntries() {

  const inputs = {
    "survey.i18n": resolve(__dirname, "entries", "i18n.ts")
  };

  readdirSync(resolve(__dirname, "src", "localization")).forEach(file => {
    var extension = extname(file);
    if (extension.toLowerCase() === ".ts") {
      inputs[`i18n/${basename(file, extension)}`] = resolve(__dirname, "src", "localization", file);
    }
  });
  inputs["i18n/index"] = resolve(__dirname, "entries", "i18n.ts");

  return inputs;
}

export default () => {

  const inputs = getEntries();

  const config = [
    ...createEsmConfigs({
      input: inputs,
      dir: resolve(buildPath, "fesm"),
      external: ["survey-core"],
      tsconfig: resolve(__dirname, "tsconfig.i18n.json"),
    }),
    ...Object.entries(inputs).map(([k, v]) => createUmdConfigs({
      input: { [k]: v },
      tsconfig: resolve(__dirname, "tsconfig.i18n.json"),
      external: ["survey-core"],
      dir: resolve(buildPath),
      emitMinified: process.env.emitMinified === "true",
      globalName: k,
      globals: { "survey-core": "Survey" },
    })).flat()
  ];

  return config;
};