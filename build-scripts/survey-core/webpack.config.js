"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
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
    defaultV2: path.resolve(__dirname, "../../packages/survey-core/src/defaultV2-theme/defaultV2.scss"),
    "defaultV2.fontless": path.resolve(__dirname, "../../packages/survey-core/src/defaultV2-theme/defaultV2.fontless.scss")
  },
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
  ],
};

module.exports = function (options) {
  options.platform = "core";
  options.libraryName = "Survey";
  options.tsConfigFile = path.resolve(__dirname, "./tsconfig.json")
  return merge(webpackCommonConfigCreator(options, packageJson, "survey.core"), config);
};
