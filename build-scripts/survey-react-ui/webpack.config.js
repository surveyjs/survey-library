"use strict";

const webpackCommonConfigCreator = require("../webpack.common");
const DtsGeneratorPlugin = require("../webpack-dts-generator");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");

const config = {
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
      tsConfigPath: "./build-scripts/survey-react-ui/tsconfig.typing.react-ui.json",
      filePath: "build/survey-react-ui/survey-react-ui.d.ts",
      moduleName: "survey-react-ui",
      importName: "entries/react-ui-model"
    }),
  ],
};

module.exports = function (options) {
  options.platform = "react-ui";
  options.libraryName = "SurveyReact";
  return merge(webpackCommonConfigCreator(options, packageJson), config);
}
