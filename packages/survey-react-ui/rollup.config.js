const typescript = require("@rollup/plugin-typescript");
const nodeResolve = require("@rollup/plugin-node-resolve");
const replace = require("@rollup/plugin-replace");
const bannerPlugin = require("rollup-plugin-license");
const path = require("path");
const VERSION = require("./package.json").version;

const banner = [
  "surveyjs - Survey JavaScript library v" + VERSION,
  "Copyright (c) 2015-" + new Date().getFullYear() + " Devsoft Baltic OÜ  - http://surveyjs.io/",
  "License: MIT (http://www.opensource.org/licenses/mit-license.php)",
].join("\n");
const input = { "survey-react-ui": path.resolve(__dirname, "./entries/index.ts") };
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

    plugins: [
      nodeResolve(),
      typescript({ inlineSources: true, sourceMap: true, tsconfig: options.tsconfig, compilerOptions: {
        declaration: false,
        declarationDir: null
      } }),
      replace({
        preventAssignment: false,
        values: {
          "process.env.RELEASE_DATE": JSON.stringify(new Date().toISOString().slice(0, 10)),
          "process.env.VERSION": JSON.stringify(VERSION)
        }
      }),
      bannerPlugin({
        banner: {
          content: banner,
          commentStyle: "ignored",
        }
      })
    ],
    external: [
      "react",
      "react-dom",
      "survey-core"
    ],
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