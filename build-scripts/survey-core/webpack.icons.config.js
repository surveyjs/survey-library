"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const { merge } = require("webpack-merge");
var FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
var path = require("path");

const config = {
  entry: {
    "iconsV1": path.resolve(__dirname, "../../packages/survey-core/src/iconsV1.ts"),
    "iconsV2": path.resolve(__dirname, "../../packages/survey-core/src/iconsV2.ts"),
  },
  plugins: [new FixStyleOnlyEntriesPlugin()],
  externals: {
    "survey-core": {
      root: "Survey",
      commonjs2: "survey-core",
      commonjs: "survey-core",
      amd: "survey-core"
    }
  }
};

module.exports = function (options) {
  options.platform = "";
  options.libraryName = "SurveyIcons";
  options.tsConfigFile = path.resolve(__dirname, "./tsconfig.icons.json")

  return merge(webpackCommonConfigCreator(options, { "name": "survey-icons" }, "survey.icons", "survey-core/icons"), config);
};
