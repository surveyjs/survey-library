"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");

const config = {
  externals: {
      vue: {
        root: "Vue",
        commonjs2: "vue",
        commonjs: "vue",
        amd: "vue"
      },
      "survey-core": {
        root: "Survey",
        commonjs2: "survey-core",
        commonjs: "survey-core",
        amd: "survey-core"
      }
  }
};

module.exports = function (options) {
  options.platform = "vue-ui";
  options.libraryName = "SurveyVue";
  return merge(webpackCommonConfigCreator(options, packageJson), config);
}
