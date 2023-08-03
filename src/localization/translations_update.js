/* eslint no-use-before-define: 0 */
/**
 * Finds missed (untranslated) strings in translation
 * Add missed strings as comments in translation
 * Example of running to update french.ts  and all translation files:
 * node update_translation french
 * node update_translation all
 */
// eslint-disable-next-line no-undef
const fs = require("fs");
// eslint-disable-next-line no-undef
const utils = require("./translation_utils");

// eslint-disable-next-line no-undef
let arg = process.argv;
if(!Array.isArray(arg)) return;
if(arg.length < 3) {
  utils.reportMessage("You should pass file name as parameter or 'all'");
  return;
}
let parameter = arg[2].toLocaleLowerCase();
if(parameter === "english") {
  utils.reportMessage("You can't update english translation");
  return;
}
const englishJSON = utils.readJson("english");
const languages = [];
if(parameter === "all") {
  fs.readdir(".", function (err, files) {
    if (err) {
      utils.reportMessage("Unable to scan directory: " + err);
      return;
    }
    files.forEach(function (file) {
      if(file.indexOf(".ts") > 0 && file !== "english.ts") {
        updateTranslation(file);
      }
    });
  });
} else {
  if(!utils.isTranslationExists(parameter)) {
    utils.reportMessage("There is no translation file: " + utils.getTranslationFileName(parameter));
    return;
  }
  updateTranslation(parameter);
}
function updateTranslation(name) {
  const json = utils.readJson(name);
  if(!json) return;
  const lines = [];
  let missedKeys = 0;
  for(let key in englishJSON) {
    let hasValue = !!json[key];
    let value = hasValue ? json[key] : englishJSON[key];
    let line = key + ": " + JSON.stringify(value);
    if(!hasValue) {
      line = "// " + line;
      missedKeys ++;
    }
    lines.push(line);
  }
  const text = utils.convertLinesToText(lines);
  if(missedKeys > 0) {
    utils.replaceText(name, text, missedKeys);
    utils.reportMessage("Updated file: " + utils.getTranslationFileName(name));
  } else {
    utils.reportMessage("All strings are translated in file: " + utils.getTranslationFileName(name));
  }
}