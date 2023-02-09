"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const DtsGeneratorPlugin = require("../webpack-dts-generator");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");
var path = require("path");

const config = {
  entry: {
    survey: path.resolve(__dirname, "../../src/main.scss"),
    modern: path.resolve(__dirname, "../../src/modern.scss"),
    defaultV2: path.resolve(__dirname, "../../src/defaultV2-theme/defaultV2.scss")
  },
  externals: {
    knockout: {
      root: "ko",
      commonjs2: "knockout",
      commonjs: "knockout",
      amd: "knockout"
    }
  },
  plugins: [
    new DtsGeneratorPlugin({
      tsConfigPath: "./build-scripts/survey-knockout/tsconfig.typing.ko.json",
      filePath: "build/survey-knockout/survey.ko.d.ts",
      moduleName: "survey-knockout",
      importName: "entries/knockout"
    }),
  ],
};

module.exports = function (options) {
  options.platform = "knockout";
  options.libraryName = "Survey";
  return merge(webpackCommonConfigCreator(options, packageJson, "survey.ko"), config);
}
