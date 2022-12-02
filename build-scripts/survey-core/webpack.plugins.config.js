"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const { merge } = require("webpack-merge");
var FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var path = require("path");

const config = {
  entry: {
    ["survey-bootstrap-theme"]: path.resolve(__dirname, "../../src/plugins/themes/bootstrap/index.ts"),
    ["survey-bootstrapmaterial-theme"]: path.resolve(__dirname, "../../src/plugins/themes/bootstrapmaterial/index.ts"),
    ["survey-modern-theme"]: path.resolve(__dirname, "../../src/plugins/themes/modern/index.ts"),
    ["survey-default-theme"]: path.resolve(__dirname, "../../src/plugins/themes/legacy-default/standard.ts"),
    ["survey-orange-theme"]: path.resolve(__dirname, "../../src/plugins/themes/legacy-default/orange.ts"),
    ["survey-darkblue-theme"]: path.resolve(__dirname, "../../src/plugins/themes/legacy-default/darkblue.ts"),
    ["survey-darkrose-theme"]: path.resolve(__dirname, "../../src/plugins/themes/legacy-default/darkrose.ts"),
    ["survey-stone-theme"]: path.resolve(__dirname, "../../src/plugins/themes/legacy-default/stone.ts"),
    ["survey-winter-theme"]: path.resolve(__dirname, "../../src/plugins/themes/legacy-default/winter.ts"),
    ["survey-winterstone-theme"]: path.resolve(__dirname, "../../src/plugins/themes/legacy-default/winterstone.ts"),
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
  options.libraryName = "[camelname]";
  return merge(webpackCommonConfigCreator(options, { "name": "survey-plugins" }, "survey.plugins", "survey-core/plugins"), config);
};
