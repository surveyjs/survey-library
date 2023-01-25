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
    jquery: {
      root: "jQuery",
      commonjs2: "jquery",
      commonjs: "jquery",
      amd: "jquery"
    }
  },
  plugins: [
    new DtsGeneratorPlugin({
      tsConfigPath: "./build-scripts/survey-jquery/tsconfig.typing.jquery.json",
      filePath: "build/survey-jquery/survey.jquery.d.ts",
      moduleName: "survey-jquery",
      importName: "entries/jquery"
    }),
  ],
};

module.exports = function (options) {
  options.platform = "jquery";
  options.libraryName = "Survey";
  return merge(webpackCommonConfigCreator(options, packageJson, "survey.jquery"), config);
}
