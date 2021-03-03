"use strict";

const webpackCommonConfigCreator = require("./webpack.common");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");

const config = {};

module.exports = function (options) {
  options.platform = "core";
  options.libraryName = "SurveyCore";
  return merge(webpackCommonConfigCreator(options, packageJson), config);
}
