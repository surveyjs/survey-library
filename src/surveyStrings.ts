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
  getString: function (strName: string, locale: string = null) {
    const locs = new Array<any>();
    const addLocaleCore = (locName: string): void => {
      const strs = this.locales[locName];
      if(!!strs) locs.push(strs);
    };
    const addLocale = (locName: string): void => {
      if(!locName) return;
      addLocaleCore(locName);
      const index = locName.indexOf("-");
      if(index < 1) return;
      locName = locName.substring(0, index);
      addLocaleCore(locName);
    };
    addLocale(locale);
    addLocale(this.currentLocale);
    addLocale(this.defaultLocale);
    if(this.defaultLocale !== "en") {
      addLocaleCore("en");
    }
    for(let i = 0; i < locs.length; i ++) {
      const res = locs[i][strName];
      if(res !== undefined) return res;
    }
    return this.onGetExternalString(strName, locale);
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
