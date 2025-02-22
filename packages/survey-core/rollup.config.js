const typescript = require("@rollup/plugin-typescript");
const nodeResolve = require("@rollup/plugin-node-resolve");
const injectProcessEnv = require("rollup-plugin-inject-process-env");
const path = require("path");
const VERSION = require("./package.json").version;
const input = { "survey-core": path.resolve(__dirname, "./entries/index.ts") };
module.exports = (options) => {
  options = options ?? {};
  if(!options.tsconfig) {
    options.tsconfig = path.resolve(__dirname, "./tsconfig.fesm.json");
  }
  if(!options.dir) {
    options.dir = path.resolve(__dirname, "./build/fesm");
  }
  return {
    input,
    context: "this",

    plugins: [nodeResolve(), typescript({ tsconfig: options.tsconfig, compilerOptions: {
      declaration: false,
      declarationDir: null
    } }),
    injectProcessEnv({
      VERSION,
      RELEASE_DATE: JSON.stringify(new Date().toISOString().slice(0, 10)),
    })],
    output: [
      {
        dir: options.dir,
        format: "esm",
        exports: "named",
        sourcemap: true,
      },
    ],
  };
};