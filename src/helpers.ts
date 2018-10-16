export interface HashTable<T> {
  [key: string]: T;
}

export class Helpers {
  /**
   * A static methods that returns true if a value underfined, null, empty string or empty array.
   * @param value
   */
  public static isValueEmpty(value: any) {
    if (Array.isArray(value) && value.length === 0) return true;
    if (value && (typeof value === "string" || value instanceof String)) {
      value = value.trim();
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
    ignoreOrder: boolean = false
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
      if (!Helpers.isTwoValueEquals(x[i], y[i])) return false;
    }
    return true;
  }
  public static isTwoValueEquals(
    x: any,
    y: any,
    ignoreOrder: boolean = false
  ): boolean {
    if (x === y) return true;
    if ((x && !y) || (!x && y)) return false;
    if (!(x instanceof Object) && !(y instanceof Object)) return x == y;
    if (!(x instanceof Object) || !(y instanceof Object)) return false;
    if (x["equals"]) return x.equals(y);
    if (Array.isArray(x) && Array.isArray(y))
      return Helpers.isArraysEqual(x, y, ignoreOrder);
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
    if (value && value instanceof Object) {
      //do not return the same object instance!!!
      return JSON.parse(JSON.stringify(value));
    }
    return value;
  }
  public static getMaxLength(maxLength: number, surveyLength: number): any {
    if (maxLength < 0) {
      maxLength = surveyLength;
    }
    return maxLength > 0 ? maxLength : null;
  }
}
if (!(<any>String.prototype)["format"]) {
  (<any>String.prototype)["format"] = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match:any, number:any) {
      return typeof args[number] != "undefined" ? args[number] : match;
    });
  };
}
