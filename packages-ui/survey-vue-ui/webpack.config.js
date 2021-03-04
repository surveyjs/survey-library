"use strict";

const webpackCommonConfigCreator = require("./webpack.common");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
          options: {
            esModule: true
          }
        }
      }
    ],
  },
  externals: {
      vue: {
        root: "Vue",
        commonjs2: "vue",
        commonjs: "vue",
        amd: "vue"
      },
      "survey-core": {
        root: "SurveyCore",
        commonjs2: "SurveyCore",
        commonjs: "SurveyCore",
        amd: "SurveyCore"
      }
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};

module.exports = function (options) {
  options.platform = "vue-ui";
  options.libraryName = "SurveyVue";
  return merge(webpackCommonConfigCreator(options, packageJson), config);
}
