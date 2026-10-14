import { HashTable, Helpers, createDate } from "./helpers";
import { settings } from "./settings";
import { ConsoleWarnings } from "./console-warnings";
import { getQuestionErrorText } from "./expressions/expressionError";
import { ConditionRunner } from "./conditions/conditionRunner";

export interface IFunctionCachedResult {
  result: any;
}
interface IFunctionInfo {
  func: (params: any[], originalParams: any[]) => any;
  name: string;
  isAsync: boolean;
  useCache: boolean;
  originalValueParams?: Array<number>;
  description?: string;
  parameters?: Array<IFunctionParameter>;
  returnType?: string;
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

  public register(info: IFunctionRegistration): void;
  public register(name: string, func: (params: any[], originalParams?: any[]) => any, isAsync?: boolean, useCache?: boolean): void;
  public register(nameOrInfo: string | IFunctionRegistration, func?: (params: any[], originalParams?: any[]) => any, isAsync?: boolean, useCache?: boolean): void {
    const info: IFunctionRegistration = typeof nameOrInfo === "object" ? nameOrInfo : { name: nameOrInfo, func: func!, isAsync: isAsync, useCache: useCache };
    let useCacheValue = info.useCache;
    if (info.isAsync && useCacheValue === undefined) {
      useCacheValue = true;
    }
    this.clearCache(info.name);
    this.functionHash[info.name] = {
      name: info.name, func: info.func, isAsync: !!info.isAsync, useCache: !!useCacheValue, originalValueParams: info.originalValueParams,
      description: info.description, parameters: info.parameters, returnType: info.returnType,
    };
  }
  // Returns the indexes of the parameters that must receive the original (unfiltered) value.
  public getOriginalValueParams(name: string): Array<number> {
    const funcInfo = this.functionHash[name];
    return !!funcInfo && Array.isArray(funcInfo.originalValueParams) ? funcInfo.originalValueParams : [];
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
  public getRegistrations(): Array<IFunctionRegistration> {
    return this.getAll().map((name: string): IFunctionRegistration => {
      const info = this.functionHash[name];
      const res: IFunctionRegistration = {
        name: info.name, func: info.func, isAsync: info.isAsync, useCache: info.useCache,
      };
      if (Array.isArray(info.originalValueParams)) {
        res.originalValueParams = info.originalValueParams.slice();
      }
      if (info.description !== undefined) res.description = info.description;
      if (Array.isArray(info.parameters)) res.parameters = info.parameters.map(param => ({ ...param }));
      if (info.returnType !== undefined) res.returnType = info.returnType;
      return res;
    });
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
    if (!Array.isArray(surveyValues) || !Array.isArray(objectValues)) return;
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
    return "Unknown function name: '" + name + "'." + getQuestionErrorText(properties);
  }
}
export interface IFunctionRegistration {
  name: string;
  func: (params: any[], originalParams: any[]) => any;
  isAsync?: boolean;
  useCache?: boolean;
  // Indexes of the parameters that must receive the original (unfiltered) value instead of the
  // default unwrapped value - e.g. the *InArray functions operate on the array of objects.
  originalValueParams?: Array<number>;
  // What the function does, its parameters and the type it returns. The runtime does not read
  // them: they are for tools that explain expressions or write them - documentation, an AI
  // assistant in Survey Creator. Types are "number", "string", "boolean", "date", "array",
  // "condition" (an expression evaluated as a filter), "any", or several joined by "|".
  description?: string;
  parameters?: Array<IFunctionParameter>;
  returnType?: string;
}
export interface IFunctionParameter {
  name: string;
  type?: string;
  optional?: boolean;
  // the parameter takes any number of values: sum(1, 2, 3)
  isRest?: boolean;
  description?: string;
}
export function registerFunction(info: IFunctionRegistration): void {
  FunctionFactory.Instance.register(info);
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
FunctionFactory.Instance.register({
  name: "sum", func: sum,
  description: "Returns the sum of the passed numbers. Arrays are flattened.",
  parameters: [
    { name: "values", type: "number|array", description: "Numbers to add", isRest: true },
  ],
  returnType: "number",
});

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
FunctionFactory.Instance.register({
  name: "min", func: min,
  description: "Returns the smallest of the passed numbers. Arrays are flattened.",
  parameters: [
    { name: "values", type: "number|array", description: "Numbers to compare", isRest: true },
  ],
  returnType: "number",
});

function max(params: any[]): any {
  return min_max(params, false);
}
FunctionFactory.Instance.register({
  name: "max", func: max,
  description: "Returns the largest of the passed numbers. Arrays are flattened.",
  parameters: [
    { name: "values", type: "number|array", description: "Numbers to compare", isRest: true },
  ],
  returnType: "number",
});

function count(params: any[]): any {
  var arr: any[] = [];
  getParamsAsArray(params, arr);
  return arr.length;
}
FunctionFactory.Instance.register({
  name: "count", func: count,
  description: "Returns how many values are passed. Arrays are flattened; empty values are not counted.",
  parameters: [
    { name: "values", type: "any", description: "Values to count", isRest: true },
  ],
  returnType: "number",
});

function avg(params: any[]): any {
  var arr: any[] = [];
  getParamsAsArray(params, arr);
  const res = sum(params);
  return arr.length > 0 ? res / arr.length : 0;
}
FunctionFactory.Instance.register({
  name: "avg", func: avg,
  description: "Returns the average of the passed numbers. Arrays are flattened.",
  parameters: [
    { name: "values", type: "number|array", description: "Numbers to average", isRest: true },
  ],
  returnType: "number",
});

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
FunctionFactory.Instance.register({
  name: "round", func: round,
  description: "Rounds a number to a given number of decimal places, or to an integer when the precision is omitted.",
  parameters: [
    { name: "num", type: "number" },
    { name: "precision", type: "number", description: "Decimal places", optional: true },
  ],
  returnType: "number",
});

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
FunctionFactory.Instance.register({
  name: "trunc", func: trunc,
  description: "Truncates a number to a given number of decimal places, or to its integer part when the precision is omitted.",
  parameters: [
    { name: "num", type: "number" },
    { name: "precision", type: "number", description: "Decimal places", optional: true },
  ],
  returnType: "number",
});

// Whether the third argument of an inArray function names a column rather than being the
// condition: exported so that a tool reading the JSON splits the arguments the way the
// runtime does (survey-core/linter).
export function isReturnColumnParam(param: string, operand: any): boolean {
  if (!operand || !operand.getType || operand.getType() !== "const") return false;
  return typeof param === "string" && !/[{}><=!]/.test(param);
}
function getInArrayParams(params: any[], originalParams: any[]): any {
  if (params.length < 2 || params.length > 4) return null;
  const arr = params[0];
  if (!arr) return null;
  if (!Array.isArray(arr) && !Array.isArray(Object.keys(arr))) return null;
  const name = params[1];
  if (typeof name !== "string" && !(name instanceof String)) return null;
  let returnName: string = name as string;
  let expressionIndex = 2;
  if (params.length > 2) {
    const operand = Array.isArray(originalParams) && originalParams.length > 2 ? originalParams[2] : undefined;
    if (isReturnColumnParam(params[2], operand)) {
      returnName = params[2] as string;
      expressionIndex = 3;
    }
  }
  let expression = params.length > expressionIndex ? params[expressionIndex] : undefined;
  if (typeof expression !== "string" && !(expression instanceof String)) {
    expression = undefined;
  }
  if (!expression) {
    const operand = Array.isArray(originalParams) && originalParams.length > expressionIndex ? originalParams[expressionIndex] : undefined;
    if (operand && !!operand.toString()) {
      expression = operand.toString();
    }
  }
  return { data: arr, name: name, expression: expression, returnName: returnName };
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
FunctionFactory.Instance.register({
  name: "sumInArray", func: sumInArray,
  originalValueParams: [0],
  description: "Returns the sum of a field over the items of an array value.",
  parameters: [
    { name: "question", type: "array", description: "The value of a multi-select matrix, a dynamic matrix or a dynamic panel: {matrix}" },
    { name: "dataFieldName", type: "string", description: "The column or template question name, quoted: 'total'" },
    { name: "filter", type: "condition", description: "Only the items for which this condition holds are used; it reads the item's own fields: {price} > 0", optional: true },
  ],
  returnType: "number",
});

function calcMinMaxInArray(properties: any, params: any[], originalParams: any[],
  isMin: boolean
): any {
  var v = getInArrayParams(params, originalParams);
  if (!v) return undefined;
  let condition = !!v.expression ? new ConditionRunner(v.expression) : undefined;
  if (condition && condition.isAsync) {
    condition = undefined;
  }
  var bestVal: number = undefined;
  var bestItem: any = undefined;
  const items = Array.isArray(v.data) ? v.data : Object.keys(v.data).map(key => v.data[key]);
  for (var i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item || Helpers.isValueEmpty(item[v.name])) continue;
    if (condition && !condition.runValues(item, properties)) continue;
    const val = convertToNumber(item[v.name]);
    if (val == undefined || val == null) continue;
    if (bestVal == undefined || (isMin ? val < bestVal : val > bestVal)) {
      bestVal = val;
      bestItem = item;
    }
  }
  if (!bestItem) return undefined;
  if (v.returnName !== v.name) return bestItem[v.returnName];
  return bestVal;
}

function minInArray(params: any[], originalParams: any[]): any {
  return calcMinMaxInArray(getProperties(this), params, originalParams, true);
}
FunctionFactory.Instance.register({
  name: "minInArray", func: minInArray,
  originalValueParams: [0],
  description: "Returns the smallest value of a field over the items of an array value, or another field of the item that holds it.",
  parameters: [
    { name: "question", type: "array", description: "The value of a multi-select matrix, a dynamic matrix or a dynamic panel: {matrix}" },
    { name: "valueField", type: "string", description: "The field compared, quoted: 'price'" },
    { name: "returnFieldOrFilter", type: "string|condition", description: "A field to return from the item with the smallest value, or a filter", optional: true },
    { name: "filter", type: "condition", description: "Only the items for which this condition holds are used; it reads the item's own fields: {price} > 0", optional: true },
  ],
  returnType: "number|string",
});

function maxInArray(params: any[], originalParams: any[]): any {
  return calcMinMaxInArray(getProperties(this), params, originalParams, false);
}
FunctionFactory.Instance.register({
  name: "maxInArray", func: maxInArray,
  originalValueParams: [0],
  description: "Returns the largest value of a field over the items of an array value, or another field of the item that holds it.",
  parameters: [
    { name: "question", type: "array", description: "The value of a multi-select matrix, a dynamic matrix or a dynamic panel: {matrix}" },
    { name: "valueField", type: "string", description: "The field compared, quoted: 'price'" },
    { name: "returnFieldOrFilter", type: "string|condition", description: "A field to return from the item with the largest value, or a filter", optional: true },
    { name: "filter", type: "condition", description: "Only the items for which this condition holds are used; it reads the item's own fields: {price} > 0", optional: true },
  ],
  returnType: "number|string",
});

function countInArray(params: any[], originalParams: any[]): any {
  var res = calcInArray(getProperties(this), params, originalParams, function(res: number, val: number): number {
    if (res == undefined) res = 0;
    if (val == undefined || val == null) return res;
    return res + 1;
  }, false);
  return res !== undefined ? res : 0;
}
FunctionFactory.Instance.register({
  name: "countInArray", func: countInArray,
  originalValueParams: [0],
  description: "Returns the number of items of an array value whose field has a value.",
  parameters: [
    { name: "question", type: "array", description: "The value of a multi-select matrix, a dynamic matrix or a dynamic panel: {matrix}" },
    { name: "valueField", type: "string", description: "The field checked, quoted: 'quantity'" },
    { name: "filter", type: "condition", description: "Only the items for which this condition holds are used; it reads the item's own fields: {price} > 0", optional: true },
  ],
  returnType: "number",
});

function avgInArray(params: any[], originalParams: any[]): any {
  const properties = getProperties(this);
  const funcCall = (name: string): any => FunctionFactory.Instance.run(name, params, properties, originalParams);
  const count = funcCall("countInArray");
  if (count == 0) return 0;
  return funcCall("sumInArray") / count;
}
FunctionFactory.Instance.register({
  name: "avgInArray", func: avgInArray,
  originalValueParams: [0],
  description: "Returns the average of a field over the items of an array value.",
  parameters: [
    { name: "question", type: "array", description: "The value of a multi-select matrix, a dynamic matrix or a dynamic panel: {matrix}" },
    { name: "valueField", type: "string", description: "The field averaged, quoted: 'quantity'" },
    { name: "filter", type: "condition", description: "Only the items for which this condition holds are used; it reads the item's own fields: {price} > 0", optional: true },
  ],
  returnType: "number",
});

function iif(params: any[]): any {
  if (!Array.isArray(params) || params.length < 2) return null;
  const va2 = params.length > 2 ? params[2] : undefined;
  return params[0] ? params[1] : va2;
}
FunctionFactory.Instance.register({
  name: "iif", func: iif,
  description: "Returns the second argument when the condition holds, otherwise the third.",
  parameters: [
    { name: "condition", type: "condition" },
    { name: "valueIfTrue", type: "any" },
    { name: "valueIfFalse", type: "any" },
  ],
  returnType: "any",
});

function getDate(params: any[]): any {
  if (!Array.isArray(params) || params.length < 1 || !params[0]) return null;
  return createDate("function-getDate", params[0]);
}
FunctionFactory.Instance.register({
  name: "getDate", func: getDate,
  description: "Converts a value to a date.",
  parameters: [
    { name: "value", type: "any", description: "A date question or a date string" },
  ],
  returnType: "date",
});

// owner carries the clock of the survey the expression belongs to: an age() with one parameter
// measures it against the current moment, and that moment is the survey's, not the machine's.
function dateDiffMonths(date1Param: any, date2Param: any, type: string, owner?: any): number {
  if (type === "days") return diffDays([date1Param, date2Param]);
  const date1 = createDate("function-dateDiffMonths", date1Param, owner);
  const date2 = createDate("function-dateDiffMonths", date2Param, owner);
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
  return dateDiffMonths(params[0], undefined, (params.length > 1 ? params[1] : "") || "years", this?.survey);
}
FunctionFactory.Instance.register({
  name: "age", func: age,
  description: "Returns the age in full years for a birth date.",
  parameters: [
    { name: "birthdate", type: "date" },
  ],
  returnType: "number",
});

function dateDiff(params: any[]): any {
  if (!Array.isArray(params) || params.length < 2 || !params[0] || !params[1]) return null;
  const type = (params.length > 2 ? params[2] : "") || "days";
  if (type === "hours" || type === "minutes" || type === "seconds") {
    const date1: any = createDate("function-dateDiffMonths", params[0], this?.survey);
    const date2: any = createDate("function-dateDiffMonths", params[1], this?.survey);
    const diffMs = Math.abs(date2 - date1);
    if (type === "hours") return Math.ceil(diffMs / (1000 * 60 * 60));
    if (type === "minutes") return Math.ceil(diffMs / (1000 * 60));
    return Math.ceil(diffMs / 1000);
  }
  return dateDiffMonths(params[0], params[1], type, this?.survey);
}
FunctionFactory.Instance.register({
  name: "dateDiff", func: dateDiff,
  description: "Returns the difference between two dates in a given unit.",
  parameters: [
    { name: "fromDate", type: "date" },
    { name: "toDate", type: "date" },
    { name: "interval", type: "string", description: "'days' (default), 'hours', 'minutes', 'seconds', 'months' or 'years'", optional: true },
  ],
  returnType: "number",
});

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

FunctionFactory.Instance.register({
  name: "dateAdd", func: dateAdd,
  description: "Adds a number of units to a date; a negative number subtracts.",
  parameters: [
    { name: "date", type: "date" },
    { name: "numberToAdd", type: "number" },
    { name: "interval", type: "string", description: "'days' (default), 'hours', 'minutes', 'seconds', 'months' or 'years'", optional: true },
  ],
  returnType: "date",
});

function isContainerReadyCore(container: any): boolean {
  if (!container) return false;
  var questions = container.questions;
  for (var i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (Array.isArray(q.panels)) {
      for (let j = 0; j < q.panels.length; j++) {
        if (!isContainerReadyCore(q.panels[j])) return false;
      }
    } else {
      if (!q.validate(false)) return false;
    }
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
FunctionFactory.Instance.register({
  name: "isContainerReady", func: isContainerReady,
  description: "Returns true when every question of a panel or a page has valid input.",
  parameters: [
    { name: "nameOfPanelOrPage", type: "string", description: "Quoted: 'page1'" },
  ],
  returnType: "boolean",
});

function isDisplayMode() {
  return this.survey && this.survey.isDisplayMode;
}
FunctionFactory.Instance.register({
  name: "isDisplayMode", func: isDisplayMode,
  description: "Returns true when the survey is shown in display (read-only) or preview mode.",
  parameters: [],
  returnType: "boolean",
});

// The functions that mean "now" read the clock of the survey the expression runs in. this.survey is
// the same object isDisplayMode() and isContainerReady() read, and it is absent only when an
// expression is run outside a survey - then the machine clock answers, as it always did.
function currentDate() {
  return createDate("function-currentDate", undefined, this?.survey);
}
FunctionFactory.Instance.register({
  name: "currentDate", func: currentDate,
  description: "Returns the current date and time.",
  parameters: [],
  returnType: "date",
});

function today(params: any[]) {
  var res = createDate("function-today", undefined, this?.survey);
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
FunctionFactory.Instance.register({
  name: "today", func: today,
  description: "Returns today's date at midnight, optionally shifted by a number of days.",
  parameters: [
    { name: "daysToAdd", type: "number", description: "today(-1) is yesterday", optional: true },
  ],
  returnType: "date",
});

function getYear(params: any[]) {
  if (params.length !== 1 || !params[0]) return undefined;
  return createDate("function-getYear", params[0]).getFullYear();
}
FunctionFactory.Instance.register({
  name: "getYear", func: getYear,
  description: "Returns the year of a date.",
  parameters: [
    { name: "date", type: "date" },
  ],
  returnType: "number",
});

function currentYear() {
  return createDate("function-currentYear", undefined, this?.survey).getFullYear();
}
FunctionFactory.Instance.register({
  name: "currentYear", func: currentYear,
  description: "Returns the current year.",
  parameters: [],
  returnType: "number",
});

function diffDays(params: any[]) {
  if (!Array.isArray(params) || params.length !== 2) return 0;
  if (!params[0] || !params[1]) return 0;
  const date1: any = createDate("function-diffDays", params[0]);
  const date2: any = createDate("function-diffDays", params[1]);
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.ceil(Math.abs(utc2 - utc1) / (1000 * 60 * 60 * 24));
}
FunctionFactory.Instance.register({
  name: "diffDays", func: diffDays,
  description: "Returns the number of days between two dates, regardless of their order.",
  parameters: [
    { name: "fromDate", type: "date" },
    { name: "toDate", type: "date" },
  ],
  returnType: "number",
});

// Called through .call() so that the survey the function is running in reaches today(): a plain call
// would lose it, and year() with no parameter means "the current year of this survey".
function dateFromFirstParameterOrToday(name: string, params: any[]) {
  let date = today.call(this, undefined);
  if (params && params[0]) {
    date = createDate("function-" + name, params[0], this?.survey);
  }
  return date;
}

function year(params: any[]): any {
  let date = dateFromFirstParameterOrToday.call(this, "year", params);
  return date.getFullYear();
}
FunctionFactory.Instance.register({
  name: "year", func: year,
  description: "Returns the year of a date, or of today when the date is omitted.",
  parameters: [
    { name: "date", type: "date", optional: true },
  ],
  returnType: "number",
});

function month(params: any[]): any {
  let date = dateFromFirstParameterOrToday.call(this, "month", params);
  return date.getMonth() + 1;
}
FunctionFactory.Instance.register({
  name: "month", func: month,
  description: "Returns the month of a date from 1 (January) to 12 (December), or of today when the date is omitted.",
  parameters: [
    { name: "date", type: "date", optional: true },
  ],
  returnType: "number",
});

function day(params: any[]): any {
  let date = dateFromFirstParameterOrToday.call(this, "day", params);
  return date.getDate();
}
FunctionFactory.Instance.register({
  name: "day", func: day,
  description: "Returns the day of the month (1 to 31) of a date, or of today when the date is omitted.",
  parameters: [
    { name: "date", type: "date", optional: true },
  ],
  returnType: "number",
});

function weekday(params: any[]): any {
  let date = dateFromFirstParameterOrToday.call(this, "weekday", params);
  return date.getDay();
}
FunctionFactory.Instance.register({
  name: "weekday", func: weekday,
  description: "Returns the day of the week from 0 (Sunday) to 6 (Saturday) of a date, or of today when the date is omitted.",
  parameters: [
    { name: "date", type: "date", optional: true },
  ],
  returnType: "number",
});

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
FunctionFactory.Instance.register({
  name: "displayValue", func: displayValue,
  isAsync: true, useCache: false,
  description: "Returns the display text of a question's value, or of a given value of that question.",
  parameters: [
    { name: "questionName", type: "string", description: "Quoted: 'q1'" },
    { name: "value", type: "any", optional: true },
  ],
  returnType: "any",
});

function propertyValue(params: any[]): any {
  if (params.length !== 2 || !params[0] || !params[1]) return undefined;
  const q = getQuestionValueByContext(this, params[0]);
  return q ? q[params[1]] : undefined;
}
FunctionFactory.Instance.register({
  name: "propertyValue", func: propertyValue,
  description: "Obsolete: write {$q1.visible} instead. Returns a property value of a question.",
  parameters: [
    { name: "questionName", type: "string", description: "Quoted: 'q1'" },
    { name: "propertyName", type: "string", description: "Quoted: 'visible'" },
  ],
  returnType: "any",
});
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
FunctionFactory.Instance.register({
  name: "substring", func: substring_,
  description: "Returns the part of a text from a start index up to, not including, an end index.",
  parameters: [
    { name: "text", type: "string" },
    { name: "start", type: "number" },
    { name: "end", type: "number", optional: true },
  ],
  returnType: "string",
});

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
FunctionFactory.Instance.register({
  name: "getComment", func: getComment,
  description: "Returns the comment a respondent entered for a question: the one of a given choice, or of the 'Other' item and the question comment.",
  parameters: [
    { name: "questionName", type: "string", description: "Quoted: 'q1'" },
    { name: "choiceValue", type: "any", optional: true },
  ],
  returnType: "string",
});

export function expressionSurveyCachedValue(name: string, value: any, isVariable?: boolean): void {
  FunctionFactory.Instance.addSurveyCachedValue(name, value, isVariable);
}
export function expressionObjectCachedValue(obj: any, name: string, value: any): void {
  FunctionFactory.Instance.addObjectCachedValue(obj, name, value);
}