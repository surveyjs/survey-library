const fs = require('fs');

var filePath = process.argv[2];
var moduleName = process.argv[3];
var importName = process.argv[4];

var content = "\ndeclare module '" + moduleName + "' { import main = require('" + importName + "'); export = main; }";
console.log(content);

fs.writeFile(filePath, content, { flag: 'a' }, err => { if(err) { console.error(err); } });