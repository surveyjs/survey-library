"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const DtsGeneratorPlugin = require("../webpack-dts-generator");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");
var path = require("path");

const config = {
  entry: {
    survey: path.resolve(__dirname, "../../src/main.scss"),
    modern: path.resolve(__dirname, "../../src/modern.scss"),
    defaultV2: path.resolve(__dirname, "../../src/defaultV2-theme/defaultV2.scss")
  },
  externals: {
    vue: {
      root: "Vue",
      commonjs2: "vue",
      commonjs: "vue",
      amd: "vue"
    }
  },
  plugins: [
    new DtsGeneratorPlugin({
      tsCommand: "vue-tsc --project",
      tsConfigPath: "./build-scripts/survey-vue/tsconfig.typing.vue.json",
      filePath: "build/survey-vue/survey.vue.d.ts",
      moduleName: "survey-vue",
      importName: "entries/vue"
    }),
  ],
};

module.exports = function (options) {
  options.platform = "vue";
  options.libraryName = "Survey";
  return merge(webpackCommonConfigCreator(options, packageJson, "survey.vue"), config);
}
