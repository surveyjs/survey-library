import { englishStrings } from "./localization/english";

export var surveyLocalization = {
  currentLocale: "",
  defaultLocale: "en",
  locales: {},
  localeNames: {},
  supportedLocales: [],
  getString: function(strName: string) {
    var loc = this.currentLocale
      ? this.locales[this.currentLocale]
      : this.locales[this.defaultLocale];
    if (!loc || !loc[strName]) loc = this.locales[this.defaultLocale];
    return loc[strName];
  },
  getLocales: function(): Array<string> {
    var res = [];
    res.push("");
    if (this.supportedLocales && this.supportedLocales.length > 0) {
      for (var i = 0; i < this.supportedLocales.length; i++) {
        res.push(this.supportedLocales[i]);
      }
    } else {
      for (var key in this.locales) {
        res.push(key);
      }
    }
    res.sort();
    return res;
  }
};

export var surveyStrings = englishStrings;
surveyLocalization.locales["en"] = englishStrings;
surveyLocalization.localeNames["en"] = "english";
