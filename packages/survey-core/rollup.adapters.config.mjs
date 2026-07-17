import { resolve, dirname, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, readFileSync } from "fs";
import { createEsmConfig, createUmdConfig, createCssConfig } from "../../rollup.helpers.mjs";
import process from "process";
import pkg from "./package.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = resolve(__dirname, "build");
const adaptersDir = resolve(__dirname, "src", "themes", "adapters");

// shadcn.scss, bootstrap.scss and bootstrap-bootswatch.scss are shared bases imported by the other
// shadcn-*.scss / bootstrap-*.scss files, they are not standalone entries.
const cssSharedPartials = ["shadcn", "bootstrap", "bootstrap-bootswatch"];

function getCssEntries() {
  return readdirSync(adaptersDir)
    .filter(e => extname(e).toLowerCase() === ".scss")
    .map(e => basename(e, extname(e)))
    .filter(name => !cssSharedPartials.includes(name));
}

const iconEntries = [
  ["mui", resolve(adaptersDir, "icons", "mui.ts")],
  ["lucide", resolve(adaptersDir, "icons", "lucide.ts")],
];

// Resolves and inlines `*.svg?raw` imports as their raw string contents.
function pluginSvgRaw() {
  const suffix = ".svg?raw";
  return {
    name: "svg-raw",
    resolveId(source, importer) {
      if (source.endsWith(suffix) && importer) {
        const filePath = resolve(dirname(importer), source.slice(0, -"?raw".length));
        return filePath + "?raw";
      }
      return null;
    },
    load(id) {
      if (id.endsWith(suffix)) {
        const filePath = id.slice(0, -"?raw".length);
        const content = readFileSync(filePath, "utf-8");
        return `export default ${JSON.stringify(content)};`;
      }
      return null;
    }
  };
}

export default () => {
  const emitMinified = process.env.emitMinified === "true";

  return [
    // SCSS adapters -> build/themes/adapters/*.css (+ *.min.css)
    ...getCssEntries().map(name => createCssConfig({
      input: { [`themes/adapters/${name}`]: resolve(adaptersDir, `${name}.scss`) },
      dir: buildPath,
      emitMinified,
      version: pkg.version
    })),

    // Icon adapters (UMD) -> build/themes/adapters/icons/*.js (+ *.min.js)
    ...iconEntries.map(([name, path]) => createUmdConfig({
      input: { [`themes/adapters/icons/${name}`]: path },
      tsconfig: resolve(__dirname, "tsconfig.adapters.json"),
      external: ["survey-core"],
      globals: { "survey-core": "Survey" },
      globalName: "Survey",
      exports: "none",
      dir: buildPath,
      emitMinified,
      useEsbuild: true,
      extraPlugins: [pluginSvgRaw()],
      version: pkg.version
    })),

    // Icon adapters (FESM) -> build/fesm/themes/adapters/icons/*.mjs
    createEsmConfig({
      input: iconEntries.reduce((acc, [name, path]) => {
        acc[name] = path;
        return acc;
      }, {}),
      dir: resolve(buildPath, "fesm", "themes", "adapters", "icons"),
      external: ["survey-core"],
      tsconfig: resolve(__dirname, "tsconfig.adapters.json"),
      useEsbuild: true,
      extraPlugins: [pluginSvgRaw()],
      version: pkg.version
    })
  ];
};
