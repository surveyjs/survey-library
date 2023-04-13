'use strict';
const webpack = require("webpack");
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

module.exports = function DtsGeneratorProgressPlugin(options) {
  return new webpack.ProgressPlugin(function (progress) {
    if (progress === 1) {
      console.log("typings start");
      console.log("typescript start");
      const tsConfigPath = options.tsConfigPath || "tsconfig.typing.json";
      const tsCommand = options.tsCommand || "tsc --p";
      const command = tsCommand + " " + tsConfigPath + " --outDir " + path.dirname(options.filePath) + "/typings/";
      console.log("tsc command is \"" + command + "\"");
      child_process.execSync(command);
      console.log("typescript end");

      // const content = "\ndeclare module \"" + options.moduleName + "\" { import main = require(\"./typings/" + options.importName + "\"); export = main; }";
      const content = "\nexport * from \"./typings/" + options.importName + "\";";
      console.log("\"" + content + "\"");
      console.log(options.filePath);
      fs.writeFile(options.filePath, content, { flag: 'w' }, err => { if (err) { console.error(err); } });
      console.log("typings end");
    }
  });
};