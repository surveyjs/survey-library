import { settings } from "./settings";

export interface HashTable<T> {
  [key: string]: T;
}

export class Helpers {
  /**
   * A static methods that returns true if a value undefined, null, empty string or empty array.
   * @param value
   */
  public static isValueEmpty(value: any) {
    if (Array.isArray(value) && value.length === 0) return true;
    if (!!value && typeof value === "object" && value.constructor === Object) {
      for (var key in value) {
        if (!Helpers.isValueEmpty(value[key])) return false;
      }
      return true;
    }
    return !value && value !== 0 && value !== false;
  }
  public static isArrayContainsEqual(x: any, y: any): boolean {
    if (!Array.isArray(x) || !Array.isArray(y)) return false;
    if (x.length !== y.length) return false;
    for (var i = 0; i < x.length; i++) {
      var j = 0;
      for (; j < y.length; j++) {
        if (Helpers.isTwoValueEquals(x[i], y[j])) break;
      }
      if (j === y.length) return false;
    }
    return true;
  }
  public static isArraysEqual(
    x: any,
    y: any,
    ignoreOrder: boolean = false,
    caseSensitive?: boolean,
    trimStrings? : boolean
  ): boolean {
    if (!Array.isArray(x) || !Array.isArray(y)) return false;
    if (x.length !== y.length) return false;
    if (ignoreOrder) {
      var xSorted = [];
      var ySorted = [];
      for (var i = 0; i < x.length; i++) {
        xSorted.push(x[i]);
        ySorted.push(y[i]);
      }
      xSorted.sort();
      ySorted.sort();
      x = xSorted;
      y = ySorted;
    }
    for (var i = 0; i < x.length; i++) {
      if (!Helpers.isTwoValueEquals(x[i], y[i], ignoreOrder, caseSensitive, trimStrings)) return false;
    }
    return true;
  }
  public static isTwoValueEquals(
    x: any,
    y: any,
    ignoreOrder: boolean = false,
    caseSensitive?: boolean,
    trimStrings? : boolean
  ): boolean {
    if (x === y) return true;

    if (Array.isArray(x) && x.length === 0 && typeof y === "undefined")
      return true;
    if (Array.isArray(y) && y.length === 0 && typeof x === "undefined")
      return true;
    if ((x === undefined || x === null) && y === "") return true;
    if ((y === undefined || y === null) && x === "") return true;
    if(trimStrings === undefined) trimStrings = settings.comparator.trimStrings;
    if(caseSensitive === undefined) caseSensitive = settings.comparator.caseSensitive;

    if(typeof x === "string" && typeof y === "string") {
      if(trimStrings) {
        x = x.trim();
        y = y.trim();
      }
      if(!caseSensitive) {
        x = x.toLowerCase();
        y = y.toLowerCase();
      }
      return x === y;
    }

    if (Helpers.isConvertibleToNumber(x) && Helpers.isConvertibleToNumber(y)) {
      if (parseInt(x) === parseInt(y) && parseFloat(x) === parseFloat(y)) {
        return true;
      }
    }

    if (
      (!Helpers.isValueEmpty(x) && Helpers.isValueEmpty(y)) ||
      (Helpers.isValueEmpty(x) && !Helpers.isValueEmpty(y))
    )
      return false;
    if ((x === true || x === false) && typeof y == "string") {
      return x.toString() === y.toLocaleLowerCase();
    }
    if ((y === true || y === false) && typeof x == "string") {
      return y.toString() === x.toLocaleLowerCase();
    }
    if (!(x instanceof Object) && !(y instanceof Object)) return x == y;
    if (!(x instanceof Object) || !(y instanceof Object)) return false;
    if (x["equals"]) return x.equals(y);
    if (!!x.toJSON && !!y.toJSON && !!x.getType && !!y.getType) {
      if (x.isDiposed || y.isDiposed) return false;
      if (x.getType() !== y.getType()) return false;
      if (!!x.name && x.name !== y.name) return false;
      return this.isTwoValueEquals(x.toJSON(), y.toJSON(), ignoreOrder, caseSensitive, trimStrings);
    }
    if (Array.isArray(x) && Array.isArray(y))
      return Helpers.isArraysEqual(x, y, ignoreOrder, caseSensitive, trimStrings);

    for (var p in x) {
      if (!x.hasOwnProperty(p)) continue;
      if (!y.hasOwnProperty(p)) return false;
      if (x[p] === y[p]) continue;
      if (typeof x[p] !== "object") return false;
      if (!this.isTwoValueEquals(x[p], y[p])) return false;
    }
    for (p in y) {
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
    }
    return true;
  }
  public static randomizeArray<T>(array: Array<T>): Array<T> {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  public static getUnbindValue(value: any): any {
    if (!!value && value instanceof Object) {
      //do not return the same object instance!!!
      return JSON.parse(JSON.stringify(value));
    }
    return value;
  }
  public static createCopy(obj: any) {
    var res: any = {};
    if (!obj) return res;
    for (var key in obj) {
      res[key] = obj[key];
    }
    return res;
  }
  public static isConvertibleToNumber(value: any): boolean {
    return (
      value !== undefined &&
      value !== null &&
      !Array.isArray(value) &&
      !isNaN(value)
    );
  }
  public static isNumber(value: any): boolean {
    if (
      typeof value == "string" &&
      !!value &&
      value.indexOf("0x") == 0 &&
      value.length > 32
    )
      return false;
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  public static getMaxLength(maxLength: number, surveyLength: number): any {
    if (maxLength < 0) {
      maxLength = surveyLength;
    }
    return maxLength > 0 ? maxLength : null;
  }
  public static getNumberByIndex(index: number, startIndexStr: string): string {
    if (index < 0) return "";
    var startIndex = 1;
    var prefix = "";
    var postfix = ".";
    var isNumeric = true;
    var strIndex = "A";
    var str = "";
    if (!!startIndexStr) {
      str = startIndexStr;
      var ind = str.length - 1;
      var hasDigit = false;
      for (var i = 0; i < str.length; i++) {
        if (Helpers.isCharDigit(str[i])) {
          hasDigit = true;
          break;
        }
      }
      var checkLetter = function() {
        return (
          (hasDigit && !Helpers.isCharDigit(str[ind])) ||
          Helpers.isCharNotLetterAndDigit(str[ind])
        );
      };
      while (ind >= 0 && checkLetter()) ind--;
      var newPostfix = "";
      if (ind < str.length - 1) {
        newPostfix = str.substr(ind + 1);
        str = str.substr(0, ind + 1);
      }
      ind = str.length - 1;
      while (ind >= 0) {
        if (checkLetter()) break;
        ind--;
        if (!hasDigit) break;
      }
      strIndex = str.substr(ind + 1);
      prefix = str.substr(0, ind + 1);
      if (parseInt(strIndex)) startIndex = parseInt(strIndex);
      else if (strIndex.length == 1) isNumeric = false;
      if (!!newPostfix || !!prefix) {
        postfix = newPostfix;
      }
    }
    if (isNumeric) return prefix + (index + startIndex).toString() + postfix;
    return (
      prefix + String.fromCharCode(strIndex.charCodeAt(0) + index) + postfix
    );
  }
  public static isCharNotLetterAndDigit(ch: string): boolean {
    return ch.toUpperCase() == ch.toLowerCase() && !Helpers.isCharDigit(ch);
  }
  public static isCharDigit(ch: string): boolean {
    return ch >= "0" && ch <= "9";
  }
  private static countDecimals(value: number): number {
    if (Helpers.isNumber(value) && Math.floor(value) !== value) {
      const strs = value.toString().split(".");
      return strs.length > 1 && strs[1].length || 0;
    }
    return 0;
  }
  public static correctAfterPlusMinis(a: number, b: number, res: number): number {
    const digitsA = Helpers.countDecimals(a);
    const digitsB = Helpers.countDecimals(b);
    if(digitsA > 0 || digitsB > 0) {
      const digits = Math.max(digitsA, digitsB);
      res = parseFloat(res.toFixed(digits));
    }
    return res;
  }
  public static correctAfterMultiple(a: number, b: number, res: number): number {
    const digits = Helpers.countDecimals(a) + Helpers.countDecimals(b);
    if(digits > 0) {
      res = parseFloat(res.toFixed(digits));
    }
    return res;
  }
}
if (!(<any>String.prototype)["format"]) {
  (<any>String.prototype)["format"] = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match: any, number: any) {
      return typeof args[number] != "undefined" ? args[number] : match;
    });
  };
}
