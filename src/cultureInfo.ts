import { englishCulture } from "./culture/english";

export var cultureInfo = {
  currentCultureValue: "",
  defaultCultureValue: "en",
  cultures: <{[index: string]: any}>{},
  cultureNames: <{[index: string]: any}>{},
  supportedCultures: <Array<any>>[],
  get currentCulture() {
    return this.currentCultureValue === this.defaultCultureValue
      ? ""
      : this.currentCultureValue;
  },
  set currentCulture(val: string) {
    this.currentCultureValue = val;
  },
  get defaultCulture() {
    return this.defaultCultureValue;
  },
  set defaultCulture(val: string) {
    this.defaultLocaleValue = val;
  },
  getCulture: function (cultureName: string = "") {
    let actualCultureName = cultureName || this.currentCultureValue || this.defaultCultureValue;
    return this.cultures[actualCultureName];
  },
  getCultures: function(): Array<string> {
    var res = [];
    res.push("");
    if (this.supportedCultures && this.supportedCultures.length > 0) {
      for (var i = 0; i < this.supportedCultures.length; i++) {
        res.push(this.supportedCultures[i]);
      }
    } else {
      for (var key in this.cultures) {
        res.push(key);
      }
    }
    res.sort();
    return res;
  }
};

export var surveyCulture = englishCulture;
(<any>cultureInfo).cultures["en"] = englishCulture;
(<any>cultureInfo).cultureNames["en"] = "english";
