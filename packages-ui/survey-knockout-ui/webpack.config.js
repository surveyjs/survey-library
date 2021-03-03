"use strict";

const webpackCommonConfigCreator = require("./webpack.common");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");

const config = {
  externals: {
    knockout: {
      root: "ko",
      commonjs2: "knockout",
      commonjs: "knockout",
      amd: "knockout"
    },
    "survey-core": {
      root: "SurveyCore",
      commonjs2: "SurveyCore",
      commonjs: "SurveyCore",
      amd: "SurveyCore"
    }
  }
};

module.exports = function (options) {
  options.platform = "knockout-ui";
  options.libraryName = "SurveyKnockout";
  return merge(webpackCommonConfigCreator(options, packageJson), config);
}
