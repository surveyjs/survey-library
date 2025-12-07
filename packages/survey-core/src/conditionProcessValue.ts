import { IQuestion } from "./base-interfaces";
import { Helpers, HashTable } from "./helpers";

export interface IValueGetterItem {
  name: string;
  index?: number;
}
export interface IValueGetterInfo {
  obj?: IObjectValueContext;
  context?: IValueGetterContext;
  requireStrictCompare?: boolean;
  isFound?: boolean;
  value?: any;
}
export interface IObjectValueContext {
  getValueGetterContext(isUnwrapped?: boolean): IValueGetterContext;
}
export interface IValueGetterContextGetValueParams {
  path: Array<IValueGetterItem>;
  isRoot: boolean;
  index: number;
  createObjects?: boolean;
  isProperty?: boolean;
}
export interface IValueGetterContext {
  getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo;
  getTextValue?(name: string, value: any, isDisplayValue: boolean): string;
  getRootObj?(): IObjectValueContext;
  getQuestion?(): IQuestion;
}
export interface IValueInfoParams {
  name: string;
  context: IValueGetterContext;
  isText?: boolean;
  isDisplayValue?: boolean;
  createObjects?: boolean;
}
export interface IReturnValue {
  isFound: boolean;
  value: any;
  question?: IQuestion;
  strictCompare?: boolean;
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
    let info = this.run(params.name, cxt, params.createObjects);
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
  public isAnyKeyChanged(keys: any, usedNames: string[]): boolean {
    for (var i = 0; i < usedNames.length; i++) {
      const name = usedNames[i];
      if (!name) continue;
      const lowerName = name.toLowerCase();
      if (keys.hasOwnProperty(name)) return true;
      if (name !== lowerName && keys.hasOwnProperty(lowerName)) return true;
      const firstName = this.getFirstNameByKeys(keys, name);
      if (!firstName) continue;
      if (name === firstName) return true;
      const keyValue = keys[firstName];
      if (keyValue == undefined) continue;
      if (
        !keyValue.hasOwnProperty("oldValue") ||
        !keyValue.hasOwnProperty("newValue")
      )
        return true;
      const v: any = {};
      v[firstName] = keyValue["oldValue"];
      var oldValue = this.getValueFromObject(v, name);
      v[firstName] = keyValue["newValue"];
      var newValue = this.getValueFromObject(v, name);
      if (!Helpers.isTwoValueEquals(oldValue, newValue, false, false, false)) return true;
    }
    return false;
  }
  private getFirstNameByKeys(keys: any, name: string): string {
    const path = this.getPath(name);
    let res = "";
    for (let i = 0; i < path.length; i++) {
      res += (i > 0 ? "." : "") + path[i].name;
      if (keys.hasOwnProperty(res)) return res;
    }
    return "";
  }
  private getValueFromObject(obj: any, fullName: string): any {
    const res = this.getValueInfo({ name: fullName, context: new VariableGetterContext(obj) });
    return res.isFound ? res.value : undefined;
  }
  private run(name: string, context: IValueGetterContext, createObjects: boolean): any {
    if (!context) return undefined;
    let path = this.getPath(name);
    const isProperty = path.length > 0 && path[0].name[0] === "$";
    if (isProperty) {
      path[0].name = path[0].name.substring(1);
    }
    const info = context.getValue({ path, isRoot: true, index: -1, createObjects, isProperty });
    return !!info && info.isFound ? info : undefined;
  }
  public getPath(name: string): Array<IValueGetterItem> {
    const path: Array<IValueGetterItem> = [];
    const names = name.split(".");
    for (let i = 0; i < names.length; i++) {
      path.push(this.getValueItem(names[i]));
    }
    return path;
  }
  private getValueItem(name: string): IValueGetterItem {
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
        if (!!res.obj) return new PropertyGetterContext(res.obj).getValue({ path: path.slice(1), isRoot: false, index: -1 });
        if (!res.context) return undefined;
      }
      const item = path[pIndex];
      pIndex++;
      if (res.context !== this && !!res.context) {
        return res.context.getValue({ path: path.slice(pIndex), isRoot: false, index: item.index, createObjects: params.createObjects, isProperty: params.isProperty });
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
    const isRevert = this.isSearchNameRevert();
    const initialIndex = pIndex;
    const endIndex = this.getMaxIndexByPath(path, pIndex);
    res.isFound = false;
    if (isRevert) {
      pIndex = endIndex;
    }
    while(!res.isFound && pIndex <= endIndex && pIndex >= initialIndex) {
      const name = this.getNameByPath(path, initialIndex, pIndex + 1);
      this.updateValueByItem(name, res);
      if (res.isFound) break;
      pIndex += isRevert ? -1 : 1;
    }
    return pIndex;
  }
  private getNameByPath(path: Array<IValueGetterItem>, start: number, end: number): string {
    let name = "";
    for (let i = start; i < end; i++) {
      if (i > start) name += ".";
      name += path[i].name;
    }
    return name;
  }
  private getMaxIndexByPath(path: Array<IValueGetterItem>, start: number): number {
    let index = start;
    while(index < path.length) {
      if (path[index].index !== undefined) break;
      index++;
    }
    return index < path.length ? index : path.length - 1;
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
  constructor(private obj: any) {
    super(obj);
  }
  protected getValueByItemCore(obj: any, name: string): any {
    if (!obj || !name) return undefined;
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
  private getValueInfoByContext(text: string): any {
    return new ValueGetter().getValueInfo(
      { name: text, context: this.context, isText: false }
    );
  }
  public getValueInfo(valueInfo: any) {
    if (!!this.context) {
      const cRes = this.getValueInfoByContext(valueInfo.name);
      valueInfo.value = cRes.value;
      valueInfo.hasValue = cRes.isFound;
      valueInfo.strictCompare = cRes.strictCompare;
      return;
    }
    return { hasValue: false };
  }
}
