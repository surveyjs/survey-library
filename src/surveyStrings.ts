import { englishStrings } from "./localization/english";

export var surveyLocalization = {
  currentLocaleValue: "",
  defaultLocaleValue: "en",
  locales: <{ [index: string]: any }>{},
  localeNames: <{ [index: string]: any }>{},
  supportedLocales: <Array<any>>[],
  get currentLocale() {
    return this.currentLocaleValue === this.defaultLocaleValue
      ? ""
      : this.currentLocaleValue;
  },
  set currentLocale(val: string) {
    if (val === "cz") val = "cs";
    this.currentLocaleValue = val;
  },
  get defaultLocale() {
    return this.defaultLocaleValue;
  },
  set defaultLocale(val: string) {
    if (val === "cz") val = "cs";
    this.defaultLocaleValue = val;
  },
  getLocaleStrings(loc: string): any {
    return this.locales[loc];
  },
  getCurrentStrings(): any {
    var loc = this.currentLocale
      ? this.locales[this.currentLocale]
      : this.locales[this.defaultLocale];
    if (!loc) loc = this.locales[this.defaultLocale];
    return loc;
  },
  getString: function (strName: string) {
    var loc = this.getCurrentStrings();
    if (!loc[strName]) loc = this.locales[this.defaultLocale];
    var result = loc[strName];
    if (result === undefined) {
      result = this.locales["en"][strName];
    }
    return result;
  },
  getLocales: function (): Array<string> {
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
  },
};

export var surveyStrings = englishStrings;
(<any>surveyLocalization).locales["en"] = englishStrings;
(<any>surveyLocalization).localeNames["en"] = "english";
