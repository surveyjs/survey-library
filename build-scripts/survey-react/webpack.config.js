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
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react"
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom"
    }
  },
  plugins: [
    new DtsGeneratorPlugin({
      tsConfigPath: "./build-scripts/survey-react/tsconfig.typing.react.json",
      filePath: "build/survey-react/survey.react.d.ts",
      moduleName: "survey-react",
      importName: "entries/react"
    }),
  ],
};

module.exports = function (options) {
  options.platform = "react";
  options.libraryName = "Survey";
  return merge(webpackCommonConfigCreator(options, packageJson, "survey.react"), config);
}
