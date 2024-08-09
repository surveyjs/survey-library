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
      "react-dom": "preact/compat",
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
};

module.exports = function (options) {
  options.platform = "js-ui";
  options.libraryName = "SurveyUI";
  options.tsConfigFile = path.resolve(__dirname, "./tsconfig.json")
  return merge(webpackCommonConfigCreator(options, packageJson, "survey-js-ui"), config);
}
