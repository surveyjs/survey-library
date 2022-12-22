"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const { merge } = require("webpack-merge");
var FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const DtsGeneratorPlugin = require("../webpack-dts-generator");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var path = require("path");
const arrayOptions = [{ 
  tsConfigPath: "./build-scripts/survey-core/tsconfig.plugins.bootstrap.theme.typing.json",
  filePath: "build/survey-core/plugins/survey-bootstrap-theme.d.ts",
  moduleName: "survey-core/plugins/survey-bootstrap-theme",
  importName: "bootstrap/index"
},
{        
  tsConfigPath: "./build-scripts/survey-core/tsconfig.plugins.bootstrapmaterial.theme.typing.json",
  filePath: "build/survey-core/plugins/survey-bootstrapmaterial-theme.d.ts",
  moduleName: "survey-core/plugins/survey-bootstrapmaterial-theme",
  importName: "bootstrapmaterial/index"
}];

const config = {
  entry: {
    ["survey-bootstrap-theme"]: path.resolve(__dirname, "../../src/plugins/themes/bootstrap/index.ts"),
    ["survey-bootstrapmaterial-theme"]: path.resolve(__dirname, "../../src/plugins/themes/bootstrapmaterial/index.ts"),
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
  if(options.buildType !== "prod") {
    config.plugins.push(new DtsGeneratorPlugin({arrayOptions: arrayOptions}));
  }

  return merge(webpackCommonConfigCreator(options, { "name": "survey-plugins" }, "survey.plugins", "survey-core/plugins"), config);
};
