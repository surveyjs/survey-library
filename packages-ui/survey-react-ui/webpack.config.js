"use strict";

const webpackCommonConfigCreator = require("./webpack.common");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");

const config = {
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react"
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom"
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
  options.platform = "react-ui";
  options.libraryName = "SurveyReact";
  return merge(webpackCommonConfigCreator(options, packageJson), config);
}
