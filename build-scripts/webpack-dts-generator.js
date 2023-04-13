'use strict';
const webpack = require("webpack");
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const legacyModules = ["survey-angular", "survey-jquery", "survey-knockout", "survey-react", "survey-vue"];

module.exports = function DtsGeneratorProgressPlugin(options) {
  return new webpack.ProgressPlugin(function (progress) {
    if (progress === 1) {
      console.log("typings start");
      console.log("typescript start");
      const tsConfigPath = options.tsConfigPath || "tsconfig.typing.json";
      const tsCommand = options.tsCommand || "tsc --p";
      let command = tsCommand + " " + tsConfigPath + " --outDir " + path.dirname(options.filePath) + "/typings/";
      if (legacyModules.indexOf(options.moduleName) !== -1) {
        command = tsCommand + " " + tsConfigPath + " --outFile " + options.filePath;
      }
      console.log("tsc command is \"" + command + "\"");
      child_process.execSync(command);
      console.log("typescript end");

      let content = "\nexport * from \"./typings/" + options.importName + "\";";
      if (legacyModules.indexOf(options.moduleName) !== -1) {
        content = "\ndeclare module \"" + options.moduleName + "\" { import main = require(\"" + options.importName + "\"); export = main; }";
      }
      console.log("\"" + content + "\"");
      console.log(options.filePath);
      if (legacyModules.indexOf(options.moduleName) !== -1) {
        fs.writeFile(options.filePath, content, { flag: 'a' }, err => { if (err) { console.error(err); } });
      } else {
        fs.writeFile(options.filePath, content, { flag: 'w' }, err => { if (err) { console.error(err); } });
      }
      console.log("typings end");
    }
  });
};
