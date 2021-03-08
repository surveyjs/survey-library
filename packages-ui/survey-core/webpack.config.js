"use strict";

const webpackCommonConfigCreator = require("./webpack.common");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");
var FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
var path = require("path");

const config = {
  entry: {
    "survey-core": path.resolve(__dirname, "../../src/entries/core-ui.ts"),
    modern: path.resolve(__dirname, "../../src/modern.scss"),
  },
  plugins: [new FixStyleOnlyEntriesPlugin()],
};

module.exports = function (options) {
  options.platform = "core";
  options.libraryName = "SurveyCore";
  return merge(webpackCommonConfigCreator(options, packageJson), config);
};
