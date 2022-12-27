"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const { merge } = require("webpack-merge");
var FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const DtsGeneratorPlugin = require("../webpack-dts-generator");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var path = require("path");

const config = {
  entry: {
    ["bootstrap-material-integration"]: path.resolve(__dirname, "../../src/plugins/themes/bootstrapmaterial/index.ts"),
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
  if (options.buildType !== "prod") {
    config.plugins.push(new DtsGeneratorPlugin({
      tsConfigPath: "./build-scripts/survey-core/tsconfig.plugins.bootstrapmaterial.theme.typing.json",
      filePath: "build/survey-core/plugins/bootstrap-material-integration.d.ts",
      moduleName: "survey-core/plugins/bootstrap-material-integration",
      importName: "bootstrapmaterial/index"
    }));
  }

  return merge(webpackCommonConfigCreator(options, { "name": "survey-plugins" }, "survey.plugins", "survey-core/plugins"), config);
};
