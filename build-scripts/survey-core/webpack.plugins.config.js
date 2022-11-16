"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const { merge } = require("webpack-merge");
var FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var path = require("path");

const config = {
  entry: {
    ["bootstrap-theme"]: path.resolve(__dirname, "../../src/plugins/themes/bootstrap/index.ts"),
    ["bootstrapmaterial-theme"]: path.resolve(__dirname, "../../src/plugins/themes/bootstrapmaterial/index.ts"),
    ["legacy-default-theme"]: path.resolve(__dirname, "../../src/plugins/themes/legacy-default/index.ts"),
    ["legacy-orange-theme"]: path.resolve(__dirname, "../../src/plugins/themes/legacy-default/orange.ts"),
    ["legacy-darkblue-theme"]: path.resolve(__dirname, "../../src/plugins/themes/legacy-default/darkblue.ts"),
    ["legacy-darkrose-theme"]: path.resolve(__dirname, "../../src/plugins/themes/legacy-default/darkrose.ts"),
    ["legacy-stone-theme"]: path.resolve(__dirname, "../../src/plugins/themes/legacy-default/stone.ts"),
    ["legacy-winter-theme"]: path.resolve(__dirname, "../../src/plugins/themes/legacy-default/winter.ts"),
    ["legacy-winterstone-theme"]: path.resolve(__dirname, "../../src/plugins/themes/legacy-default/winterstone.ts"),
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
  options.libraryName = "SurveyThemes";
  return merge(webpackCommonConfigCreator(options, { "name": "survey-plugins" }, "survey.plugins", "survey-core/plugins"), config);
};
