/* eslint no-use-before-define: 0 */
/**
 * Auto translate strings using ms api translate service
 * Example of translating un-translated string in french.ts:
 * node ms_translation french <ms-tranlation-key-32-symbols>
 */
// eslint-disable-next-line no-undef
const axios = require("axios").default;
// eslint-disable-next-line no-undef
const crypto = require("crypto");
// eslint-disable-next-line no-undef
const fs = require("fs");
// eslint-disable-next-line no-undef
const utils = require("./translation_utils");

const unsupportedName = "unsupported";

// eslint-disable-next-line no-undef
let arg = process.argv;
if(!Array.isArray(arg)) return;
if(arg.length < 4) {
  utils.reportMessage("You should pass file name as parameter and ms-translation-key");
  return;
}
let parameter = arg[2].toLocaleLowerCase();
if(parameter === "english") {
  utils.reportMessage("You can't update english translation");
  return;
}
let translationKey = arg[3];
const endpoint = "https://api.cognitive.microsofttranslator.com";
const resource_region = "southcentralus";
const englishJSON = utils.readJson("english");
if(parameter === "all") {
  fs.readdir(".", function (err, files) {
    if (err) {
      utils.reportMessage("Unable to scan directory: " + err);
      return;
    }
    files.forEach(function (file) {
      if(file.indexOf(".ts") > 0 && file !== "english.ts") {
        translateLanguage(file);
      }
    });
  });
} else {
  if(!utils.isTranslationExists(parameter)) {
    utils.reportMessage("There is no translation file: " + utils.getTranslationFileName(parameter));
    return;
  }
  translateLanguage(parameter);
}

function getMSTranslationLocale(name) {
  const locale = utils.getLocale(name);
  if(locale === "gr") return "el";
  if(locale === "ua") return "uk";
  if(locale === "tel") return "te";
  if(locale === "rs") return "sr-Latn";
  if(locale === "tg") return unsupportedName;
  return locale;
}
function translateLanguage(name) {
  const locale = getMSTranslationLocale(name);
  if(!locale) return;
  if(locale === "en") {
    return;
  }
  if(locale === unsupportedName) {
    utils.reportMessage("MS translator doesn't support: " + name + ".");
    return;
  }
  const json = utils.readJson(name);
  if(!json) return;
  const stringsToTranslate = [];
  for(let key in englishJSON) {
    let hasValue = !!json[key];
    if(!hasValue) {
      stringsToTranslate.push({ key: key, english: englishJSON[key] });
    }
  }
  if(stringsToTranslate.length === 0) {
    utils.reportMessage("File name: " + name + ". There is nothing to translate.");
    return;
  }
  translateStrings(locale, stringsToTranslate, (dic) => {
    updateFileWithTranslatedText(name, json, dic, stringsToTranslate);
  });
}
function updateFileWithTranslatedText(name, json, dic, stringsToTranslate) {
  const lines = [];
  for(let key in englishJSON) {
    let hasValue = !!json[key];
    let value = hasValue ? json[key] : dic[key];
    let line = key + ": " + JSON.stringify(value);
    lines.push(line);
  }
  const text = utils.convertLinesToText(lines);
  utils.replaceText(name, text, 0, stringsToTranslate);
  utils.reportMessage("Updated file: " + utils.getTranslationFileName(name));
}
function translateStrings(locale, stringsToTranslate, callback) {
  const dataToTranslate = [];
  for(let i = 0; i < stringsToTranslate.length; i ++) {
    dataToTranslate.push({ text: stringsToTranslate[i].english });
  }
  axios({
    baseURL: endpoint,
    url: "/translate",
    method: "post",
    headers: {
      "Ocp-Apim-Subscription-Key": translationKey,
      "Ocp-Apim-Subscription-Region": resource_region,
      "Content-type": "application/json",
      "X-ClientTraceId": UUIDGenerator()
    },
    params: {
      "api-version": "3.0",
      "from": "en",
      "to": locale
    },
    data: dataToTranslate,
    responseType: "json"
  }).then(function(response) {
    const dic = {};
    for(let i = 0; i < response.data.length; i ++) {
      const item = response.data[i];
      const tr_item = stringsToTranslate[i];
      tr_item.translation = item.translations[0].text;
      dic[tr_item.key] = tr_item.translation;
    }
    callback(dic);
  }).catch(function (error) {
    utils.reportMessage("Error to translate: " + locale + ". Error: " + JSON.stringify(error.toJSON(), null, 2));
  });
}
function UUIDGenerator() {
  return crypto.randomBytes(16).toString("hex");
}