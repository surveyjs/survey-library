"use strict";

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

// fs.readdirSync(path.resolve(__dirname, "../../src/localization")).forEach(file => {
//   var extension = path.extname(file);
//   if (extension.toLowerCase() === ".ts") {
//     config.entry[path.basename(file, extension)] = (path.resolve(__dirname, "../../src/localization") + "\\" + file);
//     // console.log(path.basename(file, extension));
//     // console.log(path.resolve(__dirname, "../../src/localization") + "\\" + file);
//   }
// });


module.exports = function (options) {
  options.platform = "i18n";
  options.libraryName = "SurveyLocales";
  return merge(webpackCommonConfigCreator(options, packageJson, "survey.i18n"), config);
};
