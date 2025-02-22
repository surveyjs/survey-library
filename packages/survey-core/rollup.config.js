const typescript = require("@rollup/plugin-typescript");
const nodeResolve = require("@rollup/plugin-node-resolve");
const path = require("path");
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
    plugins: [nodeResolve(), typescript({ tsconfig: options.tsconfig, compilerOptions: {
      declaration: false,
      declarationDir: null
    } })],
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