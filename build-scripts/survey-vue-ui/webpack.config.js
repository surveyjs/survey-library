"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const DtsGeneratorPlugin = require("../webpack-dts-generator");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");

const config = {
  externals: {
      vue: {
        root: "Vue",
        commonjs2: "vue",
        commonjs: "vue",
        amd: "vue"
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
      tsCommand: "vue-tsc --project",
      tsConfigPath: "./build-scripts/survey-vue-ui/tsconfig.typing.vue-ui.json",
      filePath: "build/survey-vue-ui/survey-vue-ui.d.ts",
      moduleName: "survey-vue-ui",
      importName: "entries/vue-ui-model"
    }),
  ],
};

module.exports = function (options) {
  options.platform = "vue-ui";
  options.libraryName = "SurveyVue";
  return merge(webpackCommonConfigCreator(options, packageJson), config);
}
