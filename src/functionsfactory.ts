import { HashTable } from "./helpers";

export class FunctionFactory {
  public static Instance: FunctionFactory = new FunctionFactory();
  private functionHash: HashTable<(params: any[]) => any> = {};
  private isAsyncHash: HashTable<boolean> = {};

  public register(
    name: string,
    func: (params: any[]) => any,
    isAsync: boolean = false
  ) {
    this.functionHash[name] = func;
    if (isAsync) this.isAsyncHash[name] = true;
  }
  public unregister(name: string) {
    delete this.functionHash[name];
    delete this.isAsyncHash[name];
  }
  public hasFunction(name: string): boolean {
    return !!this.functionHash[name];
  }
  public isAsyncFunction(name: string): boolean {
    return !!this.isAsyncHash[name];
  }

  public clear() {
    this.functionHash = {};
  }
  public getAll(): Array<string> {
    var result = [];
    for (var key in this.functionHash) {
      result.push(key);
    }
    return result.sort();
  }
  public run(
    name: string,
    params: any[],
    properties: HashTable<any> = null
  ): any {
    var func = this.functionHash[name];
    if (!func) return null;
    let classRunner = {
      func: func,
    };

    if (properties) {
      for (var key in properties) {
        (<any>classRunner)[key] = properties[key];
      }
    }
    return classRunner.func(params);
  }
}

export var registerFunction = FunctionFactory.Instance.register;

function getParamsAsArray(value: any, arr: any[]) {
  if (value === undefined || value === null) return;
  if (Array.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      getParamsAsArray(value[i], arr);
    }
  } else {
    arr.push(value);
  }
}

function sum(params: any[]): any {
  var arr: any[] = [];
  getParamsAsArray(params, arr);
  var res = 0;
  for (var i = 0; i < arr.length; i++) {
    res += arr[i];
  }
  return res;
}
FunctionFactory.Instance.register("sum", sum);

function min_max(params: any[], isMin: boolean): any {
  var arr: any[] = [];
  getParamsAsArray(params, arr);
  var res = undefined;
  for (var i = 0; i < arr.length; i++) {
    if (res === undefined) {
      res = arr[i];
    }
    if (isMin) {
      if (res > arr[i]) res = arr[i];
    } else {
      if (res < arr[i]) res = arr[i];
    }
  }
  return res;
}

function min(params: any[]): any {
  return min_max(params, true);
}
FunctionFactory.Instance.register("min", min);

function max(params: any[]): any {
  return min_max(params, false);
}
FunctionFactory.Instance.register("max", max);

function count(params: any[]): any {
  var arr: any[] = [];
  getParamsAsArray(params, arr);
  return arr.length;
}
FunctionFactory.Instance.register("count", count);

function avg(params: any[]): any {
  var arr: any[] = [];
  getParamsAsArray(params, arr);
  var res = 0;
  for (var i = 0; i < arr.length; i++) {
    res += arr[i];
  }
  return arr.length > 0 ? res / arr.length : 0;
}
FunctionFactory.Instance.register("avg", avg);

function getInArrayParams(params: any[]): any {
  if (params.length != 2) return null;
  var arr = params[0];
  if (!arr) return null;
  if (!Array.isArray(arr) && !Array.isArray(Object.keys(arr))) return null;
  var name = params[1];
  if (typeof name !== "string" && !(name instanceof String)) return null;
  return { data: arr, name: name };
}

function calcInArray(
  params: any[],
  func: (res: number, val: number) => number
): any {
  var v = getInArrayParams(params);
  if (!v) return undefined;
  var res = undefined;
  if (Array.isArray(v.data)) {
    for (var i = 0; i < v.data.length; i++) {
      var item = v.data[i];
      if (!!item && item[<string>v.name]) {
        res = func(res, item[<string>v.name]);
      }
    }
  } else {
    for (var key in v.data) {
      var item = v.data[key];
      if (!!item && item[<string>v.name]) {
        res = func(res, item[<string>v.name]);
      }
    }
  }
  return res;
}

function sumInArray(params: any[]): any {
  var res = calcInArray(params, function (res: number, val: number): number {
    if (res == undefined) res = 0;
    return +res + +val;
  });
  return res !== undefined ? res : 0;
}
FunctionFactory.Instance.register("sumInArray", sumInArray);

function minInArray(params: any[]): any {
  return calcInArray(params, function (res: number, val: number): number {
    if (res == undefined) return val;
    return res < val ? res : val;
  });
}
FunctionFactory.Instance.register("minInArray", minInArray);

function maxInArray(params: any[]): any {
  return calcInArray(params, function (res: number, val: number): number {
    if (res == undefined) return val;
    return res > val ? res : val;
  });
}
FunctionFactory.Instance.register("maxInArray", maxInArray);

function countInArray(params: any[]): any {
  var res = calcInArray(params, function (res: number, val: number): number {
    if (res == undefined) res = 0;
    return res + 1;
  });
  return res !== undefined ? res : 0;
}
FunctionFactory.Instance.register("countInArray", countInArray);

function avgInArray(params: any[]): any {
  var count = countInArray(params);
  if (count == 0) return 0;
  return sumInArray(params) / count;
}
FunctionFactory.Instance.register("avgInArray", avgInArray);

function iif(params: any[]): any {
  if (!params && params.length !== 3) return "";
  return params[0] ? params[1] : params[2];
}
FunctionFactory.Instance.register("iif", iif);

function getDate(params: any[]): any {
  if (!params && params.length < 1) return null;
  if (!params[0]) return null;
  return new Date(params[0]);
}
FunctionFactory.Instance.register("getDate", getDate);

function age(params: any[]): any {
  if (!params && params.length < 1) return null;
  if (!params[0]) return null;
  var birthDay = new Date(params[0]);
  var ageDifMs = Date.now() - birthDay.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
FunctionFactory.Instance.register("age", age);

function isContainerReady(params: any[]): any {
  if (!params && params.length < 1) return false;
  if (!params[0] || !this.survey) return false;
  var name = params[0];
  var container = this.survey.getPageByName(name);
  if (!container) container = this.survey.getPanelByName(name);
  if (!container) return false;
  var questions = container.questions;
  for (var i = 0; i < questions.length; i++) {
    if (questions[i].hasErrors(false)) return false;
  }
  return true;
}
FunctionFactory.Instance.register("isContainerReady", isContainerReady);

function isDisplayMode() {
  return this.survey && this.survey.isDisplayMode;
}
FunctionFactory.Instance.register("isDisplayMode", isDisplayMode);

function currentDate() {
  return new Date();
}
FunctionFactory.Instance.register("currentDate", currentDate);
