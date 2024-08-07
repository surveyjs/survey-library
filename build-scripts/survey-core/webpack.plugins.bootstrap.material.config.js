"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const { merge } = require("webpack-merge");
var FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
var path = require("path");

const config = {
  entry: {
    ["index"]: path.resolve(__dirname, "../../src/plugins/themes/bootstrap-material-integration/index.ts"),
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
  options.libraryName = "SurveyBootstrapMaterial";

  options.tsConfigFile = path.resolve(__dirname, "./tsconfig.plugins.bootstrapmaterial.json")

  return merge(webpackCommonConfigCreator(options, { "name": "survey-plugins" }, "survey.plugins", "survey-core/plugins/bootstrap-material-integration"), config);
};
