'use strict';
const webpack = require("webpack");
const fs = require('fs');
const child_process = require('child_process');

module.exports = function DtsGeneratorProgressPlugin(options) {
  return new webpack.ProgressPlugin(function(progress) {
    if (progress === 1) {
      const tsConfigPath = opt.tsConfigPath || "tsconfig.typing.json";
      console.log("typescript start " + tsConfigPath);
      const tsCommand = opt.tsCommand || "tsc --p";
      const command = tsCommand + " " + tsConfigPath;
      console.log("tsc command is \"" + command + "\"");
      child_process.execSync(command);
      console.log("typescript end");

      const content = "\ndeclare module \"" + opt.moduleName + "\" { import main = require(\"" + opt.importName + "\"); export = main; }";
      console.log("\"" + content + "\"");
      fs.writeFile(opt.filePath, content, { flag: 'a' }, err => { if (err) { console.error(err); } });
    }
  });
};