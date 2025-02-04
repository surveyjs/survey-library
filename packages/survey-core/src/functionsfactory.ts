import { HashTable, Helpers, createDate } from "./helpers";
import { settings } from "./settings";
import { ConsoleWarnings } from "./console-warnings";
import { ConditionRunner } from "./conditions";

export class FunctionFactory {
  public static Instance: FunctionFactory = new FunctionFactory();
  private functionHash: HashTable<(params: any[], originalParams?: any[]) => any> = {};
  private isAsyncHash: HashTable<boolean> = {};

  public register(
    name: string,
    func: (params: any[], originalParams?: any[]) => any,
    isAsync: boolean = false
  ): void {
    this.functionHash[name] = func;
    if (isAsync) this.isAsyncHash[name] = true;
  }
  public unregister(name: string): void {
    delete this.functionHash[name];
    delete this.isAsyncHash[name];
  }
  public hasFunction(name: string): boolean {
    return !!this.functionHash[name];
  }
  public isAsyncFunction(name: string): boolean {
    return !!this.isAsyncHash[name];
  }

  public clear(): void {
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
    properties: HashTable<any> = null,
    originalParams: any[]
  ): any {
    var func = this.functionHash[name];
    if (!func) {
      ConsoleWarnings.warn("Unknown function name: " + name);
      return null;
    }
    let classRunner = {
      func: func,
    };

    if (properties) {
      for (var key in properties) {
        (<any>classRunner)[key] = properties[key];
      }
    }
    return classRunner.func(params, originalParams);
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
    if (Helpers.isNumber(value)) {
      value = Helpers.getNumber(value);
    }
    arr.push(value);
  }
}

function sum(params: any[]): any {
  var arr: any[] = [];
  getParamsAsArray(params, arr);
  var res = 0;
  for (var i = 0; i < arr.length; i++) {
    res = Helpers.correctAfterPlusMinis(res, arr[i], res + arr[i]);
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
  const res = sum(params);
  return arr.length > 0 ? res / arr.length : 0;
}
FunctionFactory.Instance.register("avg", avg);

function getInArrayParams(params: any[], originalParams: any[]): any {
  if (params.length < 2 || params.length > 3) return null;
  const arr = params[0];
  if (!arr) return null;
  if (!Array.isArray(arr) && !Array.isArray(Object.keys(arr))) return null;
  const name = params[1];
  if (typeof name !== "string" && !(name instanceof String)) return null;
  let expression = params.length > 2 ? params[2] : undefined;
  if (typeof expression !== "string" && !(expression instanceof String)) {
    expression = undefined;
  }
  if(!expression) {
    const operand = Array.isArray(originalParams) && originalParams.length > 2 ? originalParams[2] : undefined;
    if(operand && !!operand.toString()) {
      expression = operand.toString();
    }
  }
  return { data: arr, name: name, expression: expression };
}

function convertToNumber(val: any): number {
  if(typeof val === "string") return Helpers.isNumber(val) ? Helpers.getNumber(val) : undefined;
  return val;
}
function processItemInArray(item: any, name: string, res: number,
  func: (res: number, val: number) => number, needToConvert: boolean, condition: ConditionRunner): number {
  if(!item || Helpers.isValueEmpty(item[name])) return res;
  if(condition && !condition.run(item)) return res;
  const val = needToConvert ? convertToNumber(item[name]) : 1;
  return func(res, val);
}
function calcInArray(
  params: any[], originalParams: any[],
  func: (res: number, val: number) => number, needToConvert: boolean = true
): any {
  var v = getInArrayParams(params, originalParams);
  if (!v) return undefined;
  let condition = !!v.expression ? new ConditionRunner(v.expression) : undefined;
  if(condition && condition.isAsync) {
    condition = undefined;
  }
  var res = undefined;
  if (Array.isArray(v.data)) {
    for (var i = 0; i < v.data.length; i++) {
      res = processItemInArray(v.data[i], v.name, res, func, needToConvert, condition);
    }
  } else {
    for (var key in v.data) {
      res = processItemInArray(v.data[key], v.name, res, func, needToConvert, condition);
    }
  }
  return res;
}

function sumInArray(params: any[], originalParams: any[]): any {
  var res = calcInArray(params, originalParams, function(res: number, val: number): number {
    if (res == undefined) res = 0;
    if(val == undefined || val == null) return res;
    return Helpers.correctAfterPlusMinis(res, val, res + val);
  });
  return res !== undefined ? res : 0;
}
FunctionFactory.Instance.register("sumInArray", sumInArray);

function minInArray(params: any[], originalParams: any[]): any {
  return calcInArray(params, originalParams, function(res: number, val: number): number {
    if (res == undefined) return val;
    if(val == undefined || val == null) return res;
    return res < val ? res : val;
  });
}
FunctionFactory.Instance.register("minInArray", minInArray);

function maxInArray(params: any[], originalParams: any[]): any {
  return calcInArray(params, originalParams, function(res: number, val: number): number {
    if (res == undefined) return val;
    if(val == undefined || val == null) return res;
    return res > val ? res : val;
  });
}
FunctionFactory.Instance.register("maxInArray", maxInArray);

function countInArray(params: any[], originalParams: any[]): any {
  var res = calcInArray(params, originalParams, function(res: number, val: number): number {
    if (res == undefined) res = 0;
    if(val == undefined || val == null) return res;
    return res + 1;
  }, false);
  return res !== undefined ? res : 0;
}
FunctionFactory.Instance.register("countInArray", countInArray);

function avgInArray(params: any[], originalParams: any[]): any {
  var count = countInArray(params, originalParams);
  if (count == 0) return 0;
  return sumInArray(params, originalParams) / count;
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
  return createDate("function-getDate", params[0]);
}
FunctionFactory.Instance.register("getDate", getDate);

function dateDiffMonths(date1Param: any, date2Param: any, type: string): number {
  if(type === "days") return diffDays([date1Param, date2Param]);
  const date1 = createDate("function-dateDiffMonths", date1Param);
  const date2 = createDate("function-dateDiffMonths", date2Param);
  const age = date2.getFullYear() - date1.getFullYear();
  type = type || "years";
  let ageInMonths = age * 12 + date2.getMonth() - date1.getMonth();
  if (date2.getDate() < date1.getDate()) {
    ageInMonths -= 1;
  }
  return type === "months" ? ageInMonths : ~~(ageInMonths / 12);
}
function age(params: any[]): number {
  if(!Array.isArray(params) || params.length < 1 || !params[0]) return null;
  return dateDiffMonths(params[0], undefined, (params.length > 1 ? params[1] : "") || "years");
}
FunctionFactory.Instance.register("age", age);

function dateDiff(params: any[]): any {
  if(!Array.isArray(params) || params.length < 2 || !params[0] || !params[1]) return null;
  return dateDiffMonths(params[0], params[1], (params.length > 2 ? params[2] : "") || "days");
}
FunctionFactory.Instance.register("dateDiff", dateDiff);

function dateAdd(params: any[]): any {
  if(!Array.isArray(params) || params.length < 2 || !params[0] || !params[1]) return null;
  const date = createDate("function-dateAdd", params[0]);
  const valToAdd = params[1];
  const interval = params[2] || "days";
  if (interval === "days") {
    date.setDate(date.getDate() + valToAdd);
  }
  if (interval === "months") {
    date.setMonth(date.getMonth() + valToAdd);
  }
  if (interval === "years") {
    date.setFullYear(date.getFullYear() + valToAdd);
  }
  return date;
}

FunctionFactory.Instance.register("dateAdd", dateAdd);

function isContainerReadyCore(container: any): boolean {
  if (!container) return false;
  var questions = container.questions;
  for (var i = 0; i < questions.length; i++) {
    if (!questions[i].validate(false)) return false;
  }
  return true;
}
function isContainerReady(params: any[]): any {
  if (!params && params.length < 1) return false;
  if (!params[0] || !this.survey) return false;
  const name = params[0];
  let container = this.survey.getPageByName(name);
  if (!container) container = this.survey.getPanelByName(name);
  if(!container) {
    const question = this.survey.getQuestionByName(name);
    if(!question || !Array.isArray(question.panels)) return false;
    if(params.length > 1) {
      if(params[1] < question.panels.length) {
        container = question.panels[params[1]];
      }
    } else {
      for(let i = 0; i < question.panels.length; i ++) {
        if(!isContainerReadyCore(question.panels[i])) return false;
      }
      return true;
    }
  }
  return isContainerReadyCore(container);
}
FunctionFactory.Instance.register("isContainerReady", isContainerReady);

function isDisplayMode() {
  return this.survey && this.survey.isDisplayMode;
}
FunctionFactory.Instance.register("isDisplayMode", isDisplayMode);

function currentDate() {
  return createDate("function-currentDate");
}
FunctionFactory.Instance.register("currentDate", currentDate);

function today(params: any[]) {
  var res = createDate("function-today");
  if(settings.localization.useLocalTimeZone) {
    res.setHours(0, 0, 0, 0);
  } else {
    res.setUTCHours(0, 0, 0, 0);
  }
  if (Array.isArray(params) && params.length == 1) {
    res.setDate(res.getDate() + params[0]);
  }
  return res;
}
FunctionFactory.Instance.register("today", today);

function getYear(params: any[]) {
  if(params.length !== 1 || !params[0]) return undefined;
  return createDate("function-getYear", params[0]).getFullYear();
}
FunctionFactory.Instance.register("getYear", getYear);

function currentYear() {
  return createDate("function-currentYear").getFullYear();
}
FunctionFactory.Instance.register("currentYear", currentYear);

function diffDays(params: any[]) {
  if (!Array.isArray(params) || params.length !== 2) return 0;
  if (!params[0] || !params[1]) return 0;
  const date1: any = createDate("function-diffDays", params[0]);
  const date2: any = createDate("function-diffDays", params[1]);
  const diffTime = Math.abs(date2 - date1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
FunctionFactory.Instance.register("diffDays", diffDays);

function dateFromFirstParameterOrToday(name: string, params: any[]) {
  let date = today(undefined);
  if (params && params[0]) {
    date = createDate("function-" + name, params[0]);
  }
  return date;
}

function year(params: any[]): any {
  let date = dateFromFirstParameterOrToday("year", params);
  return date.getFullYear();
}
FunctionFactory.Instance.register("year", year);

function month(params: any[]): any {
  let date = dateFromFirstParameterOrToday("month", params);
  return date.getMonth() + 1;
}
FunctionFactory.Instance.register("month", month);

function day(params: any[]): any {
  let date = dateFromFirstParameterOrToday("day", params);
  return date.getDate();
}
FunctionFactory.Instance.register("day", day);

function weekday(params: any[]): any {
  let date = dateFromFirstParameterOrToday("weekday", params);
  return date.getDay();
}
FunctionFactory.Instance.register("weekday", weekday);

function getQuestionValueByContext(context: any, name: string): any {
  if(!context || !name) return undefined;
  let q = context.question;
  while(q && q.parent) {
    const res = q.parent.getQuestionByName(name);
    if(!!res) return res;
    q = q.parentQuestion;
  }
  const keys = ["row", "panel", "survey"];
  for(let i = 0; i < keys.length; i ++) {
    const ctx = context[keys[i]];
    if(ctx && ctx.getQuestionByName) {
      const res = ctx.getQuestionByName(name);
      if(res) return res;
    }
  }
  return null;
}
function getDisplayValueReturnResult(q: any, params: any[]): string {
  if(params.length > 1 && !Helpers.isValueEmpty(params[1])) return q.getDisplayValue(true, params[1]);
  return q.displayValue;
}
function displayValue(params: any[]): any {
  const q = getQuestionValueByContext(this, params[0]);
  if(!q) return "";
  if(q.isReady) {
    this.returnResult(getDisplayValueReturnResult(q, params));
  } else {
    const displayValueOnReadyChanged = (sender: any, options: any) => {
      if(sender.isReady) {
        sender.onReadyChanged.remove(displayValueOnReadyChanged);
        this.returnResult(getDisplayValueReturnResult(sender, params));
      }
    };
    q.onReadyChanged.add(displayValueOnReadyChanged);
  }
  return undefined;
}
FunctionFactory.Instance.register("displayValue", displayValue, true);

function propertyValue(params: any[]): any {
  if(params.length !== 2 || !params[0] || !params[1]) return undefined;
  const q = getQuestionValueByContext(this, params[0]);
  return q ? q[params[1]] : undefined;
}
FunctionFactory.Instance.register("propertyValue", propertyValue);
function substring_(params: any[]): any {
  if(params.length < 2) return "";
  const s = params[0];
  if(!s || typeof s !== "string") return "";
  const start = params[1];
  if(!Helpers.isNumber(start)) return "";
  const end = params.length > 2 ? params[2] : undefined;
  if(!Helpers.isNumber(end)) return s.substring(start);
  return s.substring(start, end);
}
FunctionFactory.Instance.register("substring", substring_);