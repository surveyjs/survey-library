"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const DtsGeneratorPlugin = require("../webpack-dts-generator");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");
var FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var path = require("path");

const config = {
  entry: {
    survey: path.resolve(__dirname, "../../src/main.scss"),
    modern: path.resolve(__dirname, "../../src/modern.scss"),
    "modern.fontless": path.resolve(__dirname, "../../src/modern.fontless.scss"),
    defaultV2: path.resolve(__dirname, "../../src/defaultV2-theme/defaultV2.scss"),
    "defaultV2.fontless": path.resolve(__dirname, "../../src/defaultV2-theme/defaultV2.fontless.scss")
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new DtsGeneratorPlugin({
      tsConfigPath: "./build-scripts/survey-core/tsconfig.typing.json",
      filePath: "build/survey-core/survey.core.d.ts",
      moduleName: "survey-core",
      importName: "entries/core"
    }),
  ],
};

module.exports = function (options) {
  options.platform = "core";
  options.libraryName = "Survey";
  return merge(webpackCommonConfigCreator(options, packageJson, "survey.core"), config);
};
