"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const DtsGeneratorPlugin = require("../webpack-dts-generator");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");
var path = require("path");

const config = {
  resolve: {
    alias: {
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",     // Must be below test-utils
      "react/jsx-runtime": "preact/jsx-runtime"
    },
    extensions: ['.ts', '.tsx']
  },
  externals: {
    jquery: {
      root: "jQuery",
      commonjs2: "jquery",
      commonjs: "jquery",
      amd: "jquery"
    },
    "survey-core": {
      root: "Survey",
      commonjs2: "survey-core",
      commonjs: "survey-core",
      amd: "survey-core"
    }
  },
  plugins: [
    new DtsGeneratorPlugin({
      tsConfigPath: "./build-scripts/survey-jquery-ui/tsconfig.typing.jquery-ui.json",
      filePath: "build/survey-jquery-ui/survey-jquery-ui.d.ts",
      moduleName: "survey-jquery-ui",
      importName: "src/entries/jquery-ui"
    }),
  ],
};

module.exports = function (options) {
  options.platform = "jquery-ui";
  options.libraryName = "SurveyJquery";
  return merge(webpackCommonConfigCreator(options, packageJson, "survey-jquery-ui"), config);
}
