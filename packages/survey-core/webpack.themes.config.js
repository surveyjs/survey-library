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
    "themes/default-light": path.resolve(__dirname, "./src/themes/default-light.ts"),
    "themes/default-dark": path.resolve(__dirname, "./src/themes/default-dark.ts"),
    "themes/default-light-panelless": path.resolve(__dirname, "./src/themes/default-light-panelless.ts"),
    "themes/default-dark-panelless": path.resolve(__dirname, "./src/themes/default-dark-panelless.ts"),
    "themes/sharp-light": path.resolve(__dirname, "./src/themes/sharp-light.ts"),
    "themes/sharp-dark": path.resolve(__dirname, "./src/themes/sharp-dark.ts"),
    "themes/sharp-light-panelless": path.resolve(__dirname, "./src/themes/sharp-light-panelless.ts"),
    "themes/sharp-dark-panelless": path.resolve(__dirname, "./src/themes/sharp-dark-panelless.ts"),
    "themes/borderless-light": path.resolve(__dirname, "./src/themes/borderless-light.ts"),
    "themes/borderless-dark": path.resolve(__dirname, "./src/themes/borderless-dark.ts"),
    "themes/borderless-light-panelless": path.resolve(__dirname, "./src/themes/borderless-light-panelless.ts"),
    "themes/borderless-dark-panelless": path.resolve(__dirname, "./src/themes/borderless-dark-panelless.ts"),
    "themes/flat-light": path.resolve(__dirname, "./src/themes/flat-light.ts"),
    "themes/flat-dark": path.resolve(__dirname, "./src/themes/flat-dark.ts"),
    "themes/flat-light-panelless": path.resolve(__dirname, "./src/themes/flat-light-panelless.ts"),
    "themes/flat-dark-panelless": path.resolve(__dirname, "./src/themes/flat-dark-panelless.ts"),
    "themes/plain-light": path.resolve(__dirname, "./src/themes/plain-light.ts"),
    "themes/plain-dark": path.resolve(__dirname, "./src/themes/plain-dark.ts"),
    "themes/plain-light-panelless": path.resolve(__dirname, "./src/themes/plain-light-panelless.ts"),
    "themes/plain-dark-panelless": path.resolve(__dirname, "./src/themes/plain-dark-panelless.ts"),
    "themes/doubleborder-light": path.resolve(__dirname, "./src/themes/doubleborder-light.ts"),
    "themes/doubleborder-dark": path.resolve(__dirname, "./src/themes/doubleborder-dark.ts"),
    "themes/doubleborder-light-panelles": path.resolve(__dirname, "./src/themes/doubleborder-light-panelless.ts"),
    "themes/doubleborder-dark-panelless": path.resolve(__dirname, "./src/themes/doubleborder-dark-panelless.ts"),
    "themes/layered-light": path.resolve(__dirname, "./src/themes/layered-light.ts"),
    "themes/layered-dark": path.resolve(__dirname, "./src/themes/layered-dark.ts"),
    "themes/layered-light-panelless": path.resolve(__dirname, "./src/themes/layered-light-panelless.ts"),
    "themes/layered-dark-panelless": path.resolve(__dirname, "./src/themes/layered-dark-panelless.ts"),
    "themes/solid-light": path.resolve(__dirname, "./src/themes/solid-light.ts"),
    "themes/solid-dark": path.resolve(__dirname, "./src/themes/solid-dark.ts"),
    "themes/solid-light-panelless": path.resolve(__dirname, "./src/themes/solid-light-panelless.ts"),
    "themes/solid-dark-panelless": path.resolve(__dirname, "./src/themes/solid-dark-panelless.ts"),
    "themes/three-dimensional-light": path.resolve(__dirname, "./src/themes/threedimensional-light.ts"),
    "themes/three-dimensional-dark": path.resolve(__dirname, "./src/themes/threedimensional-dark.ts"),
    "themes/three-dimensional-light-panelless": path.resolve(__dirname, "./src/themes/threedimensional-light-panelless.ts"),
    "themes/three-dimensional-dark-panelless": path.resolve(__dirname, "./src/themes/threedimensional-dark-panelless.ts"),
    "themes/contrast-light": path.resolve(__dirname, "./src/themes/contrast-light.ts"),
    "themes/contrast-dark": path.resolve(__dirname, "./src/themes/contrast-dark.ts"),
    "themes/contrast-light-panelless": path.resolve(__dirname, "./src/themes/contrast-light-panelless.ts"),
    "themes/contrast-dark-panelless": path.resolve(__dirname, "./src/themes/contrast-dark-panelless.ts"),
    "themes/index": path.resolve(__dirname, "./src/themes/index.ts"),
  },
  plugins: [new FixStyleOnlyEntriesPlugin()],
};

module.exports = function (options) {
  options.platform = "";
  options.libraryName = "SurveyTheme";
  options.tsConfigFile = path.resolve(__dirname, "./tsconfig.themes.json");
  const mainConfig = webpackCommonConfig(options);
  mainConfig.entry = {};
  return merge(mainConfig, config);
};
