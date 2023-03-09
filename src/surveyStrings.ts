import { englishStrings } from "./localization/english";

export var surveyLocalization = {
  currentLocaleValue: "",
  defaultLocaleValue: "en",
  locales: <{ [index: string]: any }>{},
  localeNames: <{ [index: string]: any }>{},
  supportedLocales: <Array<any>>[],
  get currentLocale() {
    return this.currentLocaleValue === this.defaultLocaleValue ? "" : this.currentLocaleValue;
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
  getString: function (strName: string, requestedLocale: string = null) {
    const rawOptions = [requestedLocale, this.currentLocale, this.defaultLocale, "en"];

    for (let locale of rawOptions) {
      if (!!locale) {
        // Try exact locale
        if (!!this.locales?.[locale]?.[strName]) {
          return this.locales[locale][strName];
        }
        // Try parent locale
        const parts = locale.split("-");
        if (parts.length > 1 && !!this.locales?.[parts[0]]?.[strName]) {
          return this.locales[parts[0]][strName];
        }
      }
    }
    return this.onGetExternalString(strName, requestedLocale);
  },
  getLocales: function (removeDefaultLoc: boolean = false): Array<string> {
    var res = [];
    res.push("");
    var locs = this.locales;
    if (this.supportedLocales && this.supportedLocales.length > 0) {
      locs = {};
      for (var i = 0; i < this.supportedLocales.length; i++) {
        locs[this.supportedLocales[i]] = true;
      }
    }
    for (var key in locs) {
      if (removeDefaultLoc && key == this.defaultLocale) continue;
      res.push(key);
    }
    var locName = (loc: string): string => {
      if (!loc) return "";
      var res = (<any>surveyLocalization).localeNames[loc];
      if (!res) res = loc;
      return res.toLowerCase();
    };
    res.sort((a, b): number => {
      var str1 = locName(a);
      var str2 = locName(b);
      if (str1 === str2) return 0;
      return str1 < str2 ? -1 : 1;
    });
    return res;
  },
  onGetExternalString: function (name: string, locale: string): string { return undefined; }
};

export var surveyStrings = englishStrings;
(<any>surveyLocalization).locales["en"] = englishStrings;
(<any>surveyLocalization).localeNames["en"] = "english";
