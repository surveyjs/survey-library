"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const { merge } = require("webpack-merge");
var FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const DtsGeneratorPlugin = require("../webpack-dts-generator");
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
  plugins: [
    new FixStyleOnlyEntriesPlugin(),
    new DtsGeneratorPlugin({
      arrayOptions: [{ 
        tsConfigPath: "./build-scripts/survey-core/tsconfig.plugins.default.theme.typing.json",
        filePath: "build/survey-core/plugins/survey-default-theme.d.ts",
        moduleName: "survey-core/plugins/survey-default-theme",
        importName: "legacy-default/standard"
      },
      {
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
      },
      {        
        tsConfigPath: "./build-scripts/survey-core/tsconfig.plugins.modern.theme.typing.json",
        filePath: "build/survey-core/plugins/survey-modern-theme.d.ts",
        moduleName: "survey-core/plugins/survey-modern-theme",
        importName: "modern/index"
      },
      {        
        tsConfigPath: "./build-scripts/survey-core/tsconfig.plugins.orange.theme.typing.json",
        filePath: "build/survey-core/plugins/survey-orange-theme.d.ts",
        moduleName: "survey-core/plugins/survey-orange-theme",
        importName: "legacy-default/orange"
      },
      {        
        tsConfigPath: "./build-scripts/survey-core/tsconfig.plugins.darkblue.theme.typing.json",
        filePath: "build/survey-core/plugins/survey-darkblue-theme.d.ts",
        moduleName: "survey-core/plugins/survey-darkblue-theme",
        importName: "legacy-default/darkblue"
      },
      {        
        tsConfigPath: "./build-scripts/survey-core/tsconfig.plugins.darkrose.theme.typing.json",
        filePath: "build/survey-core/plugins/survey-darkrose-theme.d.ts",
        moduleName: "survey-core/plugins/survey-darkrose-theme",
        importName: "legacy-default/darkrose"
      },
      {        
        tsConfigPath: "./build-scripts/survey-core/tsconfig.plugins.stone.theme.typing.json",
        filePath: "build/survey-core/plugins/survey-stone-theme.d.ts",
        moduleName: "survey-core/plugins/survey-stone-theme",
        importName: "legacy-default/stone"
      },
      {        
        tsConfigPath: "./build-scripts/survey-core/tsconfig.plugins.winter.theme.typing.json",
        filePath: "build/survey-core/plugins/survey-winter-theme.d.ts",
        moduleName: "survey-core/plugins/survey-winter-theme",
        importName: "legacy-default/winter"
      },
      {        
        tsConfigPath: "./build-scripts/survey-core/tsconfig.plugins.winterstone.theme.typing.json",
        filePath: "build/survey-core/plugins/survey-winterstone-theme.d.ts",
        moduleName: "survey-core/plugins/survey-winterstone-theme",
        importName: "legacy-default/winterstone"
      }]
    }),
  ],
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
