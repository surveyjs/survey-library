"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");
var path = require("path");

const config = {
  entry: {
    modern: path.resolve(__dirname, "../../src/modern.scss"),
  },
  externals: {
  }
};

module.exports = function (options) {
  options.platform = "angular";
  options.libraryName = "Survey";
  return merge(webpackCommonConfigCreator(options, packageJson, "survey.angular"), config);
}
