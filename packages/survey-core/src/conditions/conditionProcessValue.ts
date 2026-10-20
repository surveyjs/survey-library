import { IQuestion } from "../base-interfaces";
import { Helpers, HashTable } from "../helpers";
import { settings } from "../settings";
import { isBuiltInVariableName } from "./builtInVariables";

export interface IValueGetterItem {
  name: string;
  index?: number;
  // where the name sits in the parsed text, set only when parseValuePath is asked for positions
  from?: number;
  to?: number;
}
export interface IValueGetterInfo {
  obj?: IObjectValueContext;
  propObj?: any;
  propName?: string;
  context?: IValueGetterContext;
  requireStrictCompare?: boolean;
  isFound?: boolean;
  value?: any;
}
export interface IObjectValueContext {
  getValueGetterContext(): IValueGetterContext;
}
export interface IValueGetterContextGetValueParams {
  path: Array<IValueGetterItem>;
  isRoot: boolean;
  index: number;
  createObjects?: boolean;
  isProperty?: boolean;
  isOriginalValue?: boolean;
  // The reader holds no object of its own: a records question answers with a row or a panel it already has, and builds none for the read.
  existingObjectsOnly?: boolean;
}
export interface IValueGetterContext {
  getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo;
  getTextValue?(name: string, value: any, isDisplayValue: boolean): string;
  getObj?(): any;
  getRootObj?(): IObjectValueContext;
  getQuestion?(): IQuestion;
  getContextKeys?(keys?: any): { [key: string]: any };
}
export interface IValueInfoParams {
  name: string;
  context: IValueGetterContext;
  isText?: boolean;
  isDisplayValue?: boolean;
  createObjects?: boolean;
  isOriginalValue?: boolean;
}
export interface IReturnValue {
  isFound: boolean;
  value: any;
  question?: IQuestion;
  propObj?: any;
  propName?: string;
  strictCompare?: boolean;
}
// The changed-keys objects are keyed by value names, so a question named "hasOwnProperty" shadows
// the method: always check own keys through Object.prototype (Bug#11858)
function hasOwnKey(obj: any, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
export class ValueGetter {
  public constructor() {
  }
  public getValueInfo(params: IValueInfoParams): IReturnValue {
    const res = this.getValueInfoCore(params);
    if (!res.isFound && res.value === undefined && params.name.endsWith(".length")) {
      res.isFound = true;
      res.value = 0;
    }
    return res;
  }
  private getValueInfoCore(params: IValueInfoParams): IReturnValue {
    const name = params.name;
    const cxt = params.context;
    let info = this.run(params.name, cxt, params.createObjects, params.isOriginalValue);
    if ((!info || !info.isFound) && cxt && cxt.getRootObj) {
      const obj = cxt.getRootObj();
      if (!!obj) {
        params.context = obj.getValueGetterContext();
        return this.getValueInfo(params);
      }
    }
    const res: IReturnValue = { isFound: false, value: undefined };
    if (!info || !info.isFound) return res;
    res.isFound = true;
    res.value = info.value;
    res.strictCompare = info.requireStrictCompare;
    res.propObj = info.propObj;
    res.propName = info.propName;
    if (info.context) {
      if (params.isText && info.context.getTextValue) {
        res.value = info.context.getTextValue(name, res.value, params.isDisplayValue);
      }
      if (info.context.getQuestion) {
        res.question = info.context.getQuestion();
      }
    }
    return res;
  }
  public getValue(name: string, context: IValueGetterContext, isText?: boolean, isDisplayValue?: boolean): any {
    const res = this.getValueInfo({ name: name, context: context, isText: isText, isDisplayValue: isDisplayValue });
    return res.isFound ? res.value : undefined;
  }
  public getDisplayValue(name: string, context: IValueGetterContext, isDisplayValue: boolean = true): string {
    return this.getValue(name, context, true, isDisplayValue);
  }
  // isClearedKeyChanged: a path under a key whose value has been cleared ({m.row1} for a cleared m)
  // counts as changed. Elements leave it off: a matrix cell expression re-run while a handler clears
  // the matrix writes its result back into the cleared rows.
  public isAnyKeyChanged(keys: any, usedNames: string[], isClearedKeyChanged?: boolean): boolean {
    const propPrefix = settings.expressionElementPropertyPrefix;
    // Names are case-insensitive in expressions ({age} reads the question "Age"), so the keys are
    // matched by their lower-case form, in both directions. Built when the first name needs it.
    let lowerKeys: HashTable<Array<string>>;
    for (var i = 0; i < usedNames.length; i++) {
      const name = usedNames[i];
      if (!name) continue;
      // An element property reference ({$q1.isVisible}) can change without any value key change
      if (!!propPrefix && name[0] === propPrefix) return true;
      const path = this.getPath(name);
      // A built-in variable ({pageno}, {correctanswers}, ...) is never a key, but its value can change
      // in any value-change run. It resolves for a one-item path only, the way the survey reads it.
      if (path.length === 1 && isBuiltInVariableName(path[0].name)) return true;
      if (!lowerKeys) lowerKeys = this.getLowerCaseKeys(keys);
      const lowerName = name.toLowerCase();
      if (!!lowerKeys[lowerName]) return true;
      if (this.isUnwrappedNameChanged(lowerKeys, path)) return true;
      const prefix = this.getFirstNameByKeys(lowerKeys, path);
      if (!prefix) continue;
      if (lowerName === prefix) return true;
      const keyNames = lowerKeys[prefix];
      for (let j = 0; j < keyNames.length; j++) {
        if (this.isKeyValueChanged(keys, keyNames[j], name, isClearedKeyChanged)) return true;
      }
    }
    return false;
  }
  // Every key under its lower-case form. Two keys that differ in case only share one entry.
  private getLowerCaseKeys(keys: any): HashTable<Array<string>> {
    const res: HashTable<Array<string>> = Object.create(null);
    for (const key in keys) {
      if (!hasOwnKey(keys, key)) continue;
      const lowerKey = key.toLowerCase();
      if (!res[lowerKey]) res[lowerKey] = [];
      res[lowerKey].push(key);
    }
    return res;
  }
  // Whether the part of the key's value that the name points to ({m.row1} in the key "m") changed.
  // The key's own oldValue/newValue are read, whatever the letter case of the name.
  private isKeyValueChanged(keys: any, keyName: string, name: string, isClearedKeyChanged: boolean): boolean {
    const keyValue = keys[keyName];
    if (keyValue == undefined) return !!isClearedKeyChanged;
    if (
      !hasOwnKey(keyValue, "oldValue") ||
      !hasOwnKey(keyValue, "newValue")
    )
      return true;
    const v: any = {};
    v[keyName] = keyValue["oldValue"];
    var oldValue = this.getValueFromObject(v, name);
    v[keyName] = keyValue["newValue"];
    var newValue = this.getValueFromObject(v, name);
    return !Helpers.isTwoValueEquals(oldValue, newValue, false, false, false);
  }
  private isUnwrappedNameChanged(lowerKeys: HashTable<Array<string>>, path: Array<IValueGetterItem>): boolean {
    const postfix = settings.expressionVariables.unwrapPostfix;
    if (!postfix) return false;
    const first = path[0].name;
    if (!first.endsWith(postfix)) return false;
    const baseName = first.substring(0, first.length - postfix.length);
    return !!lowerKeys[baseName.toLowerCase()];
  }
  // The shortest path prefix ("m" for "m.row1") that is a key, in lower case
  private getFirstNameByKeys(lowerKeys: HashTable<Array<string>>, path: Array<IValueGetterItem>): string {
    let res = "";
    for (let i = 0; i < path.length; i++) {
      res += (i > 0 ? "." : "") + path[i].name.toLowerCase();
      if (!!lowerKeys[res]) return res;
    }
    return "";
  }
  private getValueFromObject(obj: any, fullName: string): any {
    const res = this.getValueInfo({ name: fullName, context: new VariableGetterContext(obj) });
    return res.isFound ? res.value : undefined;
  }
  private run(name: string, context: IValueGetterContext, createObjects: boolean, isOriginalValue?: boolean): any {
    if (!context) return undefined;
    let path = this.getPath(name);
    const propPrefix = settings.expressionElementPropertyPrefix;
    const isProperty = !!propPrefix && path.length > 0 && path[0].name[0] === propPrefix;
    if (isProperty) {
      path[0].name = path[0].name.substring(1);
    }
    const info = context.getValue({ path, isRoot: true, index: -1, createObjects, isProperty, isOriginalValue });
    return info?.isFound ? info : undefined;
  }
  public getPath(name: string): Array<IValueGetterItem> {
    return parseValuePath(name);
  }
}
function getValueItem(name: string): IValueGetterItem {
  let index: number | undefined = undefined;
  if (name.lastIndexOf("]") === name.length - 1) {
    const ind = name.lastIndexOf("[");
    if (ind > -1) {
      const indexStr = name.substring(ind + 1, name.length - 1);
      index = Helpers.getNumber(indexStr);
      if (isNaN(index)) {
        index = undefined;
      }
      if (index !== undefined) {
        name = name.substring(0, ind);
      }
    }
  }
  const res: IValueGetterItem = { name: name };
  if (index !== undefined) {
    res.index = index;
  }
  return res;
}
// The path a reference names: one item per dot-separated part, a trailing "[n]" being the item's
// index. withPositions also records where each item's name sits in the text (from/to, the "[n]"
// left out). Exported so that a tool editing the reference text locates its parts the way the
// runtime splits them (survey-core/linter).
export function parseValuePath(name: string, withPositions?: boolean): Array<IValueGetterItem> {
  const path: Array<IValueGetterItem> = [];
  const names = name.split(".");
  let pos = 0;
  for (let i = 0; i < names.length; i++) {
    const item = getValueItem(names[i]);
    if (withPositions) {
      item.from = pos;
      item.to = pos + item.name.length;
    }
    path.push(item);
    pos += names[i].length + 1;
  }
  return path;
}
function getNameByPath(path: Array<IValueGetterItem>, start: number, end: number): string {
  let name = "";
  for (let i = start; i < end; i++) {
    if (i > start) name += ".";
    name += path[i].name;
  }
  return name;
}
function getMaxIndexByPath(path: Array<IValueGetterItem>, start: number): number {
  let index = start;
  while(index < path.length) {
    if (path[index].index !== undefined) break;
    index++;
  }
  return index < path.length ? index : path.length - 1;
}
// A name may itself contain dots ("address.city"), so the path items from start are joined back
// into progressively longer names until isFound accepts one. The join stops at the first item
// with an index - "[n]" walks into the value. isRevert tries the longest name first. Answers the
// index of the last item the found name spans, or -1. Exported so that a tool reading the JSON
// resolves dotted names the way the runtime does (survey-core/linter).
export function findNameByPath(path: Array<IValueGetterItem>, start: number, isRevert: boolean,
  isFound: (name: string) => boolean): number {
  const endIndex = getMaxIndexByPath(path, start);
  let index = isRevert ? endIndex : start;
  while(index <= endIndex && index >= start) {
    if (isFound(getNameByPath(path, start, index + 1))) return index;
    index += isRevert ? -1 : 1;
  }
  return -1;
}
export class ValueGetterContextCore implements IValueGetterContext {
  constructor() {}
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    let pIndex = 0;
    const path = params.path;
    const res: IValueGetterInfo = { isFound: false, value: this.getInitialvalue(), context: this };
    while(pIndex < path.length) {
      pIndex = this.checkValueByPath(path, pIndex, res);
      if (!res.isFound) return undefined;
      if (params.isProperty) {
        if (!!res.obj) return new PropertyGetterContext(res.obj).getValue({ path: path.slice(1), isRoot: false, index: -1, isProperty: true });
        if (!res.context) return undefined;
      }
      const item = path[pIndex];
      pIndex++;
      if (res.context !== this && !!res.context) {
        return res.context.getValue({ path: path.slice(pIndex), isRoot: false, index: item.index, createObjects: params.createObjects, isProperty: params.isProperty, isOriginalValue: params.isOriginalValue });
      }
      if (item.index !== undefined) {
        this.updateItemByIndex(item.index, res);
        if (!res.isFound) return undefined;
      }
    }
    return res;
  }
  protected isSearchNameRevert(): boolean { return false; }
  private checkValueByPath(path: Array<IValueGetterItem>, pIndex: number, res: IValueGetterInfo): number {
    res.isFound = false;
    return findNameByPath(path, pIndex, this.isSearchNameRevert(), name => {
      this.updateValueByItem(name, res);
      return res.isFound;
    });
  }
  public getTextValue(name: string, value: any, isDisplayValue: boolean): string {
    if (!isDisplayValue) return value;
    if (value === undefined || value === null) return "";
    return value.toString();
  }
  protected getInitialvalue(): any { return undefined; }
  protected updateValueByItem(name: string, res: IValueGetterInfo): void {}
  protected updateItemByIndex(index: number, res: IValueGetterInfo): void {}
}

export class VariableGetterContext extends ValueGetterContextCore {
  constructor(private variables: HashTable<any>) {
    super();
  }
  protected getInitialvalue(): any { return this.variables; }
  protected isSearchNameRevert(): boolean { return true; }
  protected updateValueByItem(name: string, res: IValueGetterInfo): void {
    const val = this.getValueByItemCore(res.value, name);
    res.isFound = val !== undefined;
    if (res.isFound) {
      res.value = val;
    }
  }
  protected updateItemByIndex(index: number, res: IValueGetterInfo): void {
    const v = res.value;
    res.isFound = false;
    if (Array.isArray(v)) {
      if (index < 0) {
        index = v.length + index;
      }
      if (index > -1 && index < v.length) {
        res.value = v[index];
        res.isFound = true;
      }
    }
  }
  protected getValueByItemCore(obj: any, name: string): any {
    if (!obj || !name) return undefined;
    const nameInLow = name.toLowerCase();
    if (name === "length" && (Array.isArray(obj) || typeof obj === "string")) return obj.length;
    if (typeof obj !== "object") return undefined;
    let a = nameInLow[0];
    let A = name[0].toLocaleUpperCase();
    for (var key in obj) {
      var first = key[0];
      if (first === a || first === A) {
        var keyName = key.toLowerCase();
        if (keyName == nameInLow) return obj[key];
      }
    }
    return undefined;
  }
}
export class PropertyGetterContext extends VariableGetterContext {
  private lastObj: any;
  private lastName: string;
  constructor(private obj: any) {
    super(obj);
  }
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    this.lastObj = undefined;
    this.lastName = undefined;
    const res = super.getValue(params);
    if (res?.isFound) {
      res.propObj = this.lastObj;
      res.propName = this.lastName;
    }
    return res;
  }
  protected getValueByItemCore(obj: any, name: string): any {
    if (!obj || !name) return undefined;
    this.lastObj = obj;
    this.lastName = name;
    return obj[name];
  }
}
export class VariableGetterContextEx extends VariableGetterContext {
  constructor(variables: HashTable<any>, private second: IValueGetterContext) {
    super(variables);
  }
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const res = super.getValue(params);
    return !this.second || res?.isFound ? res : this.second.getValue(params);
  }
}

export class ProcessValue {
  private contextValue: IValueGetterContext;
  public properties: HashTable<any> = null;
  public asyncValues: HashTable<any> = {};
  public onCompleteAsyncFunc: (op: any) => void;
  constructor(context: IValueGetterContext) {
    this.contextValue = context;
  }
  public get context(): IValueGetterContext {
    return this.contextValue;
  }
  public hasValue(text: string): boolean {
    if (!!this.context) return this.getValueInfoByContext(text).isFound;
    return false;
  }
  public getValue(text: string): any {
    if (!!this.context) return this.getValueInfoByContext(text).value;
    return undefined;
  }
  private getValueInfoByContext(text: string, isOriginalValue?: boolean): any {
    return new ValueGetter().getValueInfo(
      { name: text, context: this.context, isText: false, isOriginalValue: isOriginalValue }
    );
  }
  public getValueInfo(valueInfo: any) {
    if (!!this.context) {
      const cRes = this.getValueInfoByContext(valueInfo.name, valueInfo.isOriginalValue);
      if (cRes.isFound) {
        const obj = this.context.getObj ? this.context.getObj() : null;
        if (!!obj && !!cRes.propObj) {
          obj.addPropertyDependency(cRes.propObj, cRes.propName);
        }
      }
      valueInfo.value = cRes.value;
      valueInfo.hasValue = cRes.isFound;
      valueInfo.strictCompare = cRes.strictCompare;
      return;
    }
    return { hasValue: false };
  }
}
