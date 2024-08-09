"use strict";
const webpackCommonConfig = require("./webpack.config");
const path = require("path");
const fs = require("fs");

const { merge } = require("webpack-merge");
var packageJson = require("./package.json");

const config = {
  entry: {
    "survey-core.i18n": path.resolve(__dirname, "./entries/i18n.ts"),
  },
  externals: {
    "survey-core": {
      root: "Survey",
      commonjs2: "survey-core",
      commonjs: "survey-core",
      amd: "survey-core"
    }
  }
};

function patchEntries() {
  fs.readdirSync(path.resolve(__dirname, "./src/localization")).forEach(file => {
    var extension = path.extname(file);
    if (extension.toLowerCase() === ".ts") {
      config.entry[path.basename(file, extension)] = (path.resolve(__dirname, "./src/localization") + "/" + file);
    }
  });
  config.entry.index = path.resolve(__dirname, "./entries/i18n.ts");
}

function patchFilename(options) {
  config.output = {};
  const isProductionBuild = options.buildType === "prod";
  config.output.filename = (pathData) => {
    return (pathData.chunk.name == "survey-core.i18n" ? "[name]" : "i18n/[name]") + (isProductionBuild ? ".min" : "") + ".js";
  };
}

module.exports = function (options) {
  options.platform = "i18n";
  options.libraryName = "SurveyLocales";
  options.tsConfigFile = path.resolve(__dirname, "tsconfig.i18n.json");
  patchEntries();
  patchFilename(options);
  const mainConfig = webpackCommonConfig(options);
  delete mainConfig.entry[packageJson.name];
  mainConfig.plugins.shift();
  return merge(mainConfig, config);
};