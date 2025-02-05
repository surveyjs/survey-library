"use strict";
const webpackCommonConfig = require("./webpack.config");
const { merge } = require("webpack-merge");
var FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
var path = require("path");

const config = {
  output: {
    path: __dirname + "/build"
  },
  entry: {
    "icons/iconsV1": path.resolve(__dirname, "./src/iconsV1.ts"),
    "icons/iconsV2": path.resolve(__dirname, "./src/iconsV2.ts"),
  },
  plugins: [new FixStyleOnlyEntriesPlugin()],
};

module.exports = function (options) {
  options.platform = "";
  options.tsConfigFile = path.resolve(__dirname, "./tsconfig.icons.json");
  const mainConfig = webpackCommonConfig(options);
  mainConfig.entry = {};
  return merge(mainConfig, config);
};
