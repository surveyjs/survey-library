"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const DtsGeneratorPlugin = require("../webpack-dts-generator");
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
      root: "Survey",
      commonjs2: "survey-core",
      commonjs: "survey-core",
      amd: "survey-core"
    }
  },
  plugins: [
    new DtsGeneratorPlugin({
      tsConfigPath: "./build-scripts/survey-knockout-ui/tsconfig.typing.ko-ui.json",
      filePath: "build/survey-knockout-ui/survey-knockout-ui.d.ts",
      moduleName: "survey-knockout-ui",
      importName: "entries/knockout-ui-model"
    }),
  ],
};

module.exports = function (options) {
  options.platform = "knockout-ui";
  options.libraryName = "SurveyKnockout";
  return merge(webpackCommonConfigCreator(options, packageJson), config);
}
