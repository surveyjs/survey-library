// eslint-disable-next-line no-undef
const fs = require("fs");

const startStr = " = {";
const endStr = "};";
// eslint-disable-next-line no-undef
module.exports = {
  isTranslationExists: function (fileName) {
    return fs.existsSync(this.getTranslationFileName(fileName));
  },
  getTranslationFileName: function(name) {
    if(name.indexOf(".ts") < 0) {
      name += ".ts";
    }
    return name;
  },
  readFile: function(fileName) {
    return fs.readFileSync(this.getTranslationFileName(fileName), "utf8");
  },
  readJson: function(name) {
    const text = this.readFile(name);
    const start = text.indexOf(startStr);
    const end = text.lastIndexOf(endStr);
    if(start < 0 || end < 0) return undefined;
    const content = text.substring(start + startStr.length, end);
    return eval("({" + content + "})");
  },
  getLocale: function(name) {
    const text = this.readFile(name);
    let subStr = "localeCode: \"";
    let index = text.indexOf(subStr);
    if(index < 0) return undefined;
    index += subStr.length;
    const endIndex = text.indexOf("\"", index);
    if(endIndex < 0) return undefined;
    return text.substring(index, endIndex);
  },
  convertLinesToText: function(lines) {
    for(let i = 0; i < lines.length; i ++) {
      let line = lines[i];
      if(i < lines.length - 1) {
        line = line + ",";
      }
      line = "\r\n  " + line;
      lines[i] = line;
    }
    lines.push("\r\n");
    return lines.join("");
  },
  replaceText: function(name, newText, missedKeys, translatedKeys) {
    const text = this.readFile(name);
    const start = text.indexOf(startStr);
    const end = text.lastIndexOf(endStr);
    let content = text.substring(0, start + startStr.length) +
      newText + text.substring(end);
    let missedKeysStr = "";
    let translatedKeysStr = "";
    if(missedKeys > 0) {
      missedKeysStr = "// This dictionary contains " + missedKeys + " untranslated or inherited localization strings.\n// These strings are commented out. Uncomment and edit them if you want to add your translations.\n";
    }
    if(Array.isArray(translatedKeys)) {
      let keys = [];
      if(text.indexOf("// The following strings have") < 0) {
        keys.push("");
        keys.push("// The following strings have been translated by a machine translation service");
        keys.push("// Remove those strings that you have corrected manually");
      }
      for(let i = 0; i < translatedKeys.length; i ++) {
        const item = translatedKeys[i];
        keys.push("// " + item.key + ": " + JSON.stringify(item.english) + " => " + JSON.stringify(item.translation));
      }
      translatedKeysStr = keys.join("\n");
    }
    const importIndex = content.indexOf("import {");
    if(importIndex > 0) {
      content = content.substring(importIndex);
    }
    fs.writeFileSync(this.getTranslationFileName(name), missedKeysStr + content + translatedKeysStr);
  },
  reportMessage: function(msg) {
    // eslint-disable-next-line no-console
    console.log(msg);
  }
};