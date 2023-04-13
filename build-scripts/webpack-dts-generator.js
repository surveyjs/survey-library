'use strict';
const webpack = require("webpack");
const fs = require('fs');
const child_process = require('child_process');

module.exports = function DtsGeneratorProgressPlugin(options) {
  return new webpack.ProgressPlugin(function (progress) {
    if (progress === 1) {
      console.log("typescript start");
      const tsConfigPath = options.tsConfigPath || "tsconfig.typing.json";
      const tsCommand = options.tsCommand || "tsc --p";
      const command = tsCommand + " " + tsConfigPath + " --outFile " + options.filePath;
      console.log("tsc command is \"" + command + "\"");
      child_process.execSync(command);
      console.log("typescript end");

      const content = "\ndeclare module \"" + options.moduleName + "\" { import main = require(\"" + options.importName + "\"); export = main; }";
      console.log("\"" + content + "\"");
      fs.writeFile(options.filePath, content, { flag: 'a' }, err => { if (err) { console.error(err); } });
    }
  });
};
