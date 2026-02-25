import { HashTable, Helpers, createDate } from "./helpers";
import { settings } from "./settings";
import { ConsoleWarnings } from "./console-warnings";
import { ConditionRunner, ExpressionExecutor } from "./conditions";

export interface IFunctionCachedResult {
  result: any;
}
interface IFunctionInfo {
  func: (params: any[], originalParams?: any[]) => any;
  name: string;
  isAsync: boolean;
  useCache: boolean;
}
interface IFunctionCachedSurveyValue {
  name: string;
  value: any;
  isVariable: boolean;
}
interface IFunctionCachedObjectValue {
  obj: any;
  name: string;
  value: any;
}
interface IFunctionCachedInfo {
  parameters: any[];
  surveyValues: IFunctionCachedSurveyValue[];
  objectValues: IFunctionCachedObjectValue[];
  result: any;
}
export class FunctionFactory {
  public static Instance: FunctionFactory = new FunctionFactory();
  private functionHash: HashTable<IFunctionInfo> = {};
  private functionCache: HashTable<Array<IFunctionCachedInfo>> = {};

  public register(name: string, func: (params: any[], originalParams?: any[]) => any, isAsync?: boolean, useCache?: boolean): void {
    if (isAsync && useCache === undefined) {
      useCache = true;
    }
    this.clearCache(name);
    this.functionHash[name] = { name, func, isAsync: !!isAsync, useCache: !!useCache };
  }
  public unregister(name: string): void {
    delete this.functionHash[name];
  }
  public hasFunction(name: string): boolean {
    return !!this.functionHash[name];
  }
  public isAsyncFunction(name: string): boolean {
    const funcInfo = this.functionHash[name];
    return !!funcInfo && funcInfo.isAsync;
  }
  public clear(): void {
    this.functionHash = {};
    this.clearCache();
  }
  public clearCache(functionName?: string): void {
    if (functionName) {
      delete this.functionCache[functionName];
    } else {
      this.functionCache = {};
    }
  }
  public getAll(): Array<string> {
    var result = [];
    for (var key in this.functionHash) {
      result.push(key);
    }
    return result.sort();
  }
  public run(name: string, params: any[], properties: HashTable<any>, originalParams: any[]): any {
    if (!properties) {
      properties = {};
    }
    const funcInfo = this.functionHash[name];
    if (!funcInfo) {
      ConsoleWarnings.warn(this.getUnknownFunctionErrorText(name, properties));
      return null;
    }
    const cachedRes = this.getCachedValue(funcInfo, params, properties.survey);
    if (cachedRes) {
      const res = cachedRes.result;
      if (!!properties.returnResult) {
        properties.returnResult(res);
      }
      return res;
    }
    const classRunner = { func: funcInfo.func };
    for (var key in properties) {
      if (key === "returnResult" && funcInfo.useCache) {
        const self = this;
        classRunner[key] = (res: any) => {
          self.addToCache(funcInfo, params, properties, res);
          properties.returnResult(res);
        };
      } else {
        (<any>classRunner)[key] = properties[key];
      }
    }
    this.surveyCachedValues = funcInfo.useCache ? [] : undefined;
    this.objsCachedValues = funcInfo.useCache ? [] : undefined;
    const res = classRunner.func(params, originalParams);
    properties.surveyCachedValues = this.surveyCachedValues;
    properties.objsCachedValues = this.objsCachedValues;
    this.surveyCachedValues = undefined;
    this.objsCachedValues = undefined;
    if (!funcInfo.isAsync) {
      this.addToCache(funcInfo, params, properties, res);
    }
    return res;
  }
  public addSurveyCachedValue(name: string, value: any, isVariable?: boolean): void {
    if (!this.surveyCachedValues) return;
    this.surveyCachedValues.push({ name, value, isVariable: !!isVariable });
  }
  public addObjectCachedValue(obj: any, name: string, value: any): void {
    if (!this.objsCachedValues) return;
    if (!this.isSurveyObjectValue(value)) {
      this.objsCachedValues.push({ obj, name, value });
    }
  }
  private isSurveyObjectValue(value: any): boolean {
    const checkedValue = Array.isArray(value) && value.length > 0 ? value[0] : value;
    return !!checkedValue && typeof checkedValue === "object" && typeof checkedValue.getType === "function";
  }
  private surveyCachedValues: IFunctionCachedSurveyValue[];
  private objsCachedValues: IFunctionCachedObjectValue[];
  private addToCache(funcInfo: IFunctionInfo, params: any[], properties: HashTable<any>, result: any): void {
    if (!funcInfo.useCache) return;
    const surveyValues = properties.surveyCachedValues;
    const objectValues = properties.objsCachedValues;
    if (params.length === 0 && surveyValues.length === 0 && objectValues.length === 0) return;
    let cachedList = this.functionCache[funcInfo.name];
    if (!Array.isArray(cachedList)) {
      cachedList = [];
      this.functionCache[funcInfo.name] = cachedList;
    }
    cachedList.push({ parameters: params, result: result, surveyValues: surveyValues, objectValues: objectValues });
  }
  private getCachedValue(funcInfo: IFunctionInfo, params: any[], survey: any): IFunctionCachedResult | undefined {
    if (funcInfo && !funcInfo.useCache) return undefined;
    const cachedList = this.functionCache[funcInfo.name];
    if (!Array.isArray(cachedList)) return undefined;
    for (let i = cachedList.length - 1; i >= 0; i--) {
      const item = cachedList[i];
      if (this.hasDisposedObj(item.objectValues)) {
        cachedList.splice(i, 1);
        continue;
      }
      if (this.isCachedItemValid(item, params, survey)) {
        return { result: item.result };
      }
    }
    return undefined;
  }
  private isCachedItemValid(item: IFunctionCachedInfo, params: any[], survey: any): boolean {
    if (!Helpers.isTwoValueEquals(item.parameters, params)) return false;
    const sValues = item.surveyValues;
    if (Array.isArray(sValues) && sValues.length > 0) {
      if (!survey) return false;
      for (let i = 0; i < sValues.length; i++) {
        const item = sValues[i];
        const name = item.name;
        const value = item.value;
        const newValue = item.isVariable ? survey.getVariable(name) : survey.getValue(name);
        if (!Helpers.isTwoValueEquals(newValue, value)) return false;
      }
    }
    const objsValues = item.objectValues;
    if (Array.isArray(objsValues) && objsValues.length > 0) {
      for (let i = 0; i < objsValues.length; i++) {
        const item = objsValues[i];
        const obj = item.obj;
        const name = item.name;
        const newValue = obj.getPropertyValueWithoutDefault(name);
        if (!Helpers.isTwoValueEquals(newValue, item.value) &&
          (item.value !== undefined || newValue !== obj.getDefaultPropertyValue(name))) return false;
      }
    }
    return true;
  }
  private hasDisposedObj(objectValues: IFunctionCachedObjectValue[]): boolean {
    if (!Array.isArray(objectValues)) return false;
    for (let i = 0; i < objectValues.length; i++) {
      const obj = objectValues[i].obj;
      if (obj.isDisposed === true) return true;
    }
    return false;
  }
  private getUnknownFunctionErrorText(name: string, properties: HashTable<any>): string {
    return "Unknown function name: '" + name + "'." + ExpressionExecutor.getQuestionErrorText(properties);
  }
}
export interface IFunctionRegistration {
  name: string;
  func: (params: any[], originalParams?: any[]) => any;
  isAsync?: boolean;
  useCache?: boolean;
}
export function registerFunction(info: IFunctionRegistration): void {
  FunctionFactory.Instance.register(info.name, info.func, info.isAsync, info.useCache);
}
export function unregisterFunction(name: string): void {
  FunctionFactory.Instance.unregister(name);
}

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

function round(params: any[]): any {
  var arr: any[] = [];
  getParamsAsArray(params, arr);
  if (arr.length > 0) {
    const num = arr[0];
    const precision = arr[1] || 0;
    if (Helpers.isNumber(num) && Helpers.isNumber(precision)) {
      const p = Math.pow(10, precision);
      const n = (num * p) * (1 + Number.EPSILON);
      return Math.round(n) / p;
    }
  }
  return NaN;
}
FunctionFactory.Instance.register("round", round);

function trunc(params: any[]): any {
  var arr: any[] = [];
  getParamsAsArray(params, arr);
  if (arr.length > 0) {
    const num = arr[0];
    const precision = arr[1] || -1;
    if (Helpers.isNumber(num) && Helpers.isNumber(precision)) {
      const regexp = new RegExp("^-?\\d+(?:.\\d{0," + precision + "})?");
      return Number(num.toString().match(regexp)[0]);
    }
  }
  return NaN;
}
FunctionFactory.Instance.register("trunc", trunc);

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
  if (!expression) {
    const operand = Array.isArray(originalParams) && originalParams.length > 2 ? originalParams[2] : undefined;
    if (operand && !!operand.toString()) {
      expression = operand.toString();
    }
  }
  return { data: arr, name: name, expression: expression };
}

function convertToNumber(val: any): number {
  if (typeof val === "string") return Helpers.isNumber(val) ? Helpers.getNumber(val) : undefined;
  return val;
}
function processItemInArray(item: any, name: string, res: number,
  func: (res: number, val: number) => number, needToConvert: boolean, condition: ConditionRunner, properties: any): number {
  if (!item || Helpers.isValueEmpty(item[name])) return res;
  if (condition && !condition.runValues(item, properties)) return res;
  const val = needToConvert ? convertToNumber(item[name]) : 1;
  return func(res, val);
}
function calcInArray(properties: any,
  params: any[], originalParams: any[],
  func: (res: number, val: number) => number, needToConvert: boolean = true
): any {
  var v = getInArrayParams(params, originalParams);
  if (!v) return undefined;
  let condition = !!v.expression ? new ConditionRunner(v.expression) : undefined;
  if (condition && condition.isAsync) {
    condition = undefined;
  }
  var res = undefined;
  if (Array.isArray(v.data)) {
    for (var i = 0; i < v.data.length; i++) {
      res = processItemInArray(v.data[i], v.name, res, func, needToConvert, condition, properties);
    }
  } else {
    for (var key in v.data) {
      res = processItemInArray(v.data[key], v.name, res, func, needToConvert, condition, properties);
    }
  }
  return res;
}
function getProperties(self: any): any {
  return {
    survey: self.survey,
    question: self.question,
    context: self.survey?.getValueGetterContext()
  };
}
function sumInArray(params: any[], originalParams: any[]): any {
  var res = calcInArray(getProperties(this), params, originalParams, function(res: number, val: number): number {
    if (res == undefined) res = 0;
    if (val == undefined || val == null) return res;
    return Helpers.correctAfterPlusMinis(res, val, res + val);
  });
  return res !== undefined ? res : 0;
}
FunctionFactory.Instance.register("sumInArray", sumInArray);

function minInArray(params: any[], originalParams: any[]): any {
  return calcInArray(getProperties(this), params, originalParams, function(res: number, val: number): number {
    if (res == undefined) return val;
    if (val == undefined || val == null) return res;
    return res < val ? res : val;
  });
}
FunctionFactory.Instance.register("minInArray", minInArray);

function maxInArray(params: any[], originalParams: any[]): any {
  return calcInArray(getProperties(this), params, originalParams, function(res: number, val: number): number {
    if (res == undefined) return val;
    if (val == undefined || val == null) return res;
    return res > val ? res : val;
  });
}
FunctionFactory.Instance.register("maxInArray", maxInArray);

function countInArray(params: any[], originalParams: any[]): any {
  var res = calcInArray(getProperties(this), params, originalParams, function(res: number, val: number): number {
    if (res == undefined) res = 0;
    if (val == undefined || val == null) return res;
    return res + 1;
  }, false);
  return res !== undefined ? res : 0;
}
FunctionFactory.Instance.register("countInArray", countInArray);

function avgInArray(params: any[], originalParams: any[]): any {
  const properties = getProperties(this);
  const funcCall = (name: string): any => FunctionFactory.Instance.run(name, params, properties, originalParams);
  const count = funcCall("countInArray");
  if (count == 0) return 0;
  return funcCall("sumInArray") / count;
}
FunctionFactory.Instance.register("avgInArray", avgInArray);

function iif(params: any[]): any {
  if (!Array.isArray(params) || params.length < 2) return null;
  const va2 = params.length > 2 ? params[2] : undefined;
  return params[0] ? params[1] : va2;
}
FunctionFactory.Instance.register("iif", iif);

function getDate(params: any[]): any {
  if (!Array.isArray(params) || params.length < 1 || !params[0]) return null;
  return createDate("function-getDate", params[0]);
}
FunctionFactory.Instance.register("getDate", getDate);

function dateDiffMonths(date1Param: any, date2Param: any, type: string): number {
  if (type === "days") return diffDays([date1Param, date2Param]);
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
  if (!Array.isArray(params) || params.length < 1 || !params[0]) return null;
  return dateDiffMonths(params[0], undefined, (params.length > 1 ? params[1] : "") || "years");
}
FunctionFactory.Instance.register("age", age);

function dateDiff(params: any[]): any {
  if (!Array.isArray(params) || params.length < 2 || !params[0] || !params[1]) return null;
  const type = (params.length > 2 ? params[2] : "") || "days";
  const isHours = type === "hours" || type === "minutes" || type === "seconds";
  const dType = isHours ? "days" : type;
  let days = dateDiffMonths(params[0], params[1], dType);
  if (isHours) {
    const date1 = createDate("function-dateDiffMonths", params[0]);
    const date2 = createDate("function-dateDiffMonths", params[1]);
    if (date2.getHours() > date1.getHours() || (type !== "hours" && date2.getHours() === date1.getHours() && date2.getMinutes() > date1.getMinutes())) {
      days -= 1;
    }
    let hours = days * 24 + date2.getHours() - date1.getHours();
    if (type === "hours") return hours;
    if (date2.getMinutes() < date1.getMinutes()) {
      hours -= 1;
    }
    const minutes = hours * 60 + date2.getMinutes() - date1.getMinutes();
    if (type === "minutes") return minutes;
    return minutes * 60 + date2.getSeconds() - date1.getSeconds();
  }
  return days;
}
FunctionFactory.Instance.register("dateDiff", dateDiff);

function dateAdd(params: any[]): any {
  if (!Array.isArray(params) || params.length < 2 || !params[0] || !params[1]) return null;
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
  if (interval === "hours") {
    date.setHours(date.getHours() + valToAdd);
  }
  if (interval === "minutes") {
    date.setMinutes(date.getMinutes() + valToAdd);
  }
  if (interval === "seconds") {
    date.setSeconds(date.getSeconds() + valToAdd);
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
  if (!container) {
    const question = this.survey.getQuestionByName(name);
    if (!question || !Array.isArray(question.panels)) return false;
    if (params.length > 1) {
      if (params[1] < question.panels.length) {
        container = question.panels[params[1]];
      }
    } else {
      for (let i = 0; i < question.panels.length; i ++) {
        if (!isContainerReadyCore(question.panels[i])) return false;
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
  if (!settings.storeUtcDates) {
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
  if (params.length !== 1 || !params[0]) return undefined;
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
  if (!context || !name) return undefined;
  let q = context.question;
  while(q && q.parent) {
    const res = q.parent.getQuestionByName(name);
    if (!!res) return res;
    q = q.parentQuestion;
  }
  const keys = ["row", "panel", "survey"];
  for (let i = 0; i < keys.length; i ++) {
    const ctx = context[keys[i]];
    if (ctx && ctx.getQuestionByName) {
      const res = ctx.getQuestionByName(name);
      if (res) return res;
    }
  }
  return null;
}
function getDisplayValueReturnResult(q: any, params: any[]): string {
  if (params.length > 1 && !Helpers.isValueEmpty(params[1])) return q.getDisplayValue(true, params[1]);
  return q.displayValue;
}
function displayValue(params: any[]): any {
  const q = getQuestionValueByContext(this, params[0]);
  if (!q) {
    this.returnResult(undefined);
    return undefined;
  }
  if (q.isReady) {
    this.returnResult(getDisplayValueReturnResult(q, params));
  } else {
    const displayValueOnReadyChanged = (sender: any, options: any) => {
      if (sender.isReady) {
        sender.onReadyChanged.remove(displayValueOnReadyChanged);
        this.returnResult(getDisplayValueReturnResult(sender, params));
      }
    };
    q.onReadyChanged.add(displayValueOnReadyChanged);
  }
  return undefined;
}
FunctionFactory.Instance.register("displayValue", displayValue, true, false);

function propertyValue(params: any[]): any {
  if (params.length !== 2 || !params[0] || !params[1]) return undefined;
  const q = getQuestionValueByContext(this, params[0]);
  return q ? q[params[1]] : undefined;
}
FunctionFactory.Instance.register("propertyValue", propertyValue);
function substring_(params: any[]): any {
  if (params.length < 2) return "";
  const s = params[0];
  if (!s || typeof s !== "string") return "";
  const start = params[1];
  if (!Helpers.isNumber(start)) return "";
  const end = params.length > 2 ? params[2] : undefined;
  if (!Helpers.isNumber(end)) return s.substring(start);
  return s.substring(start, end);
}
FunctionFactory.Instance.register("substring", substring_);

function getComment(params: any[]): any {
  if (params.length < 1 || !params[0] || !this.survey) return undefined;
  const question = this.survey.getQuestionByName(params[0]);
  if (!question) return "";
  const val = params.length > 1 ? params[1] : undefined;
  if (val !== undefined && val !== null) {
    const item = question.getItemByValue(val);
    return !!item ? question.getCommentValue(item) : undefined;
  }
  return question.getCommentValue(question.otherItem) || question.comment;
}
FunctionFactory.Instance.register("getComment", getComment);