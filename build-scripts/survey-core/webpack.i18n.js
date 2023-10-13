"use strict";
const fs = require("fs");
const path = require("path");
const webpackCommonConfigCreator = require("../webpack.common");
const { merge } = require("webpack-merge");
var packageJson = require("./package.json");

const config = {
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
  config.entry = {};
  fs.readdirSync(path.resolve(__dirname, "../../src/localization")).forEach(file => {
    var extension = path.extname(file);
    if (extension.toLowerCase() === ".ts") {
      config.entry[path.basename(file, extension)] = (path.resolve(__dirname, "../../src/localization") + "/" + file);
    }
  });
  config.entry.index = path.resolve(__dirname, "../../src/entries/i18n.ts");
}

function patchFilename(options) {
  config.output = {};
  const isProductionBuild = options.buildType === "prod";
  config.output.filename = (pathData) => {
    return (pathData.chunk.name == "survey.i18n" ? "[name]" : "i18n/[name]") + (isProductionBuild ? ".min" : "") + ".js";
  }
}

module.exports = function (options) {
  options.platform = "i18n";
  options.libraryName = "SurveyLocales";
  patchEntries();
  patchFilename(options);
  return merge(webpackCommonConfigCreator(options, packageJson, "survey.i18n"), config);
};

