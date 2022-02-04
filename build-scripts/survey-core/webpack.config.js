"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");
var FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
var path = require("path");

const config = {
  entry: {
    modern: path.resolve(__dirname, "../../src/modern.scss"),
    defaultV2: path.resolve(__dirname, "../../src/defaultV2-theme/defaultV2.scss")
  },
  plugins: [new FixStyleOnlyEntriesPlugin()],
};

module.exports = function (options) {
  options.platform = "core";
  options.libraryName = "Survey";
  return merge(webpackCommonConfigCreator(options, packageJson, "survey.core"), config);
};
