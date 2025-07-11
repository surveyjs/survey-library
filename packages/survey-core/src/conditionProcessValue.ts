import { Helpers, HashTable } from "./helpers";

export interface IValueGetterItem {
  name: string;
  index?: number;
}
export interface IValueGetterInfo {
  context?: IValueGetterContext;
  isFound?: boolean;
  value?: any;
}
export interface IValueGetterContext {
  getValue(path: Array<IValueGetterItem>, isRoot: boolean, index?: number): IValueGetterInfo;
  getDisplayValue(value: any): string;
  getRootObj?(): any;
}
export class ValueGetter {
  public constructor() {
  }
  public getValueInfo(name: string, context: IValueGetterContext, isDisplay: boolean): { isFound: boolean, value: any } {
    let info = this.run(name, context);
    if ((!info || !info.isFound) && context.getRootObj) {
      const obj = context.getRootObj();
      if (!!obj) return this.getValueInfo(name, obj.getValueGetterContext(), isDisplay);
    }
    const res = { isFound: false, value: undefined };
    if (!info || !info.isFound) return res;
    res.isFound = true;
    res.value = info.value;
    if (isDisplay && info.context) {
      res.value = info.context.getDisplayValue(res.value);
    }
    return res;
  }
  public getValue(name: string, context: IValueGetterContext, isDisplay?: boolean): any {
    const res = this.getValueInfo(name, context, isDisplay);
    return res.isFound ? res.value : undefined;
  }
  public getDisplayValue(name: string, context: IValueGetterContext): string {
    return this.getValue(name, context, true);
  }
  private run(name: string, context: IValueGetterContext): any {
    if (!context) return undefined;
    let path = this.getPath(name);
    const info = context.getValue(path, true);
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
    name = name.trim();
    let index: number | undefined = undefined;
    if (name.lastIndexOf("]") === name.length - 1) {
      const ind = name.lastIndexOf("[");
      if (ind > -1) {
        const indexStr = name.substring(ind + 1, name.length - 1);
        index = Helpers.getNumber(indexStr);
        if (isNaN(index) || index < 0) {
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
  public getValue(path: Array<IValueGetterItem>, isRoot: boolean, index?: number): IValueGetterInfo {
    let pIndex = 0;
    const res: IValueGetterInfo = { isFound: false, value: this.getInitialvalue(), context: this };
    while(pIndex < path.length) {
      let item = path[pIndex];
      let name = item.name;
      this.updateValueByItem(name, res);
      while(!res.isFound && pIndex < path.length - 1) {
        pIndex++;
        item = path[pIndex];
        name += "." + item.name;
        this.updateValueByItem(name, res);
        if (item.index !== undefined) break;
      }
      if (!res.isFound) return undefined;
      pIndex++;
      if (res.context !== this && !!res.context) {
        return res.context.getValue([].concat(path.slice(pIndex)), false, item.index);
      }
      if (item.index !== undefined) {
        this.updateItemByIndex(item.index, res);
        if (!res.isFound) return undefined;
      }
    }
    return res;
  }
  public getDisplayValue(value: any): string {
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
  protected updateValueByItem(name: string, res: IValueGetterInfo): void {
    const val = this.getValueByItemCore(res.value, name);
    res.isFound = val !== undefined;
    if (res.isFound) {
      res.value = val;
    }
  }
  protected updateItemByIndex(index: number, res: IValueGetterInfo): void {
    const v = res.value;
    if (Array.isArray(v) && index < v.length) {
      res.value = v[index];
      res.isFound = true;
    } else {
      res.isFound = false;
    }
  }
  private getValueByItemCore(obj: any, name: string): any {
    if (!obj || !name) return undefined;
    const nameInLow = name.toLowerCase();
    if (Array.isArray(obj) && name === "length") return obj.length;
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

const surveyBuiltInVarible: string = "@survey";
export class ProcessValue {
  public values: HashTable<any> = null;
  public properties: HashTable<any> = null;
  public asyncValues: HashTable<any> = {};
  public onCompleteAsyncFunc: (op: any) => void;
  constructor() {}
  public getFirstName(text: string, obj: any = null): string {
    if (!text) return text;
    var res = "";
    if (!!obj) {
      res = this.getFirstPropertyName(text, obj);
      if (!!res) return res;
    }
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch == "." || ch == "[") break;
      res += ch;
    }
    return res;
  }
  public hasValue(text: string, values: HashTable<any> = null): boolean {
    if (!values) values = this.values;
    var res = this.getValueCore(text, values);
    return res.hasValue;
  }
  public getValue(text: string, values: HashTable<any> = null): any {
    if (!values) values = this.values;
    var res = this.getValueCore(text, values);
    return res.onProcessValue ? res.onProcessValue(res.value) : res.value;
  }
  public setValue(obj: any, text: string, value: any) {
    if (!text) return;
    var nonNestedObj = this.getNonNestedObject(obj, text, true);
    if (!nonNestedObj) return;
    obj = nonNestedObj.value;
    text = nonNestedObj.text;
    if (!!obj && !!text) {
      obj[text] = value;
    }
  }
  public getValueInfo(valueInfo: any) {
    if (!!valueInfo.path) {
      valueInfo.value = this.getValueFromPath(valueInfo.path, this.values);
      valueInfo.hasValue =
        valueInfo.value !== null && !Helpers.isValueEmpty(valueInfo.value);
      if (
        !valueInfo.hasValue &&
        valueInfo.path.length > 1 &&
        valueInfo.path[valueInfo.path.length - 1] == "length"
      ) {
        valueInfo.hasValue = true;
        valueInfo.value = 0;
      }
      return;
    }
    var res = this.getValueCore(valueInfo.name, this.values);
    valueInfo.value = res.value;
    valueInfo.hasValue = res.hasValue;
    valueInfo.path = res.hasValue ? res.path : null;
    valueInfo.onProcessValue = res.onProcessValue;
    valueInfo.sctrictCompare = res.sctrictCompare;
  }
  public isAnyKeyChanged(keys: any, usedNames: string[]): boolean {
    for (var i = 0; i < usedNames.length; i++) {
      const name = usedNames[i];
      if (!name) continue;
      const lowerName = name.toLowerCase();
      if (keys.hasOwnProperty(name)) return true;
      if (name !== lowerName && keys.hasOwnProperty(lowerName)) return true;
      var firstName = this.getFirstName(name);
      if (!keys.hasOwnProperty(firstName)) continue;
      if (name === firstName) return true;
      var keyValue = keys[firstName];
      if (keyValue == undefined) continue;
      if (
        !keyValue.hasOwnProperty("oldValue") ||
        !keyValue.hasOwnProperty("newValue")
      )
        return true;
      var v: any = {};
      v[firstName] = keyValue["oldValue"];
      var oldValue = this.getValue(name, v);
      v[firstName] = keyValue["newValue"];
      var newValue = this.getValue(name, v);
      if (!Helpers.isTwoValueEquals(oldValue, newValue, false, false, false)) return true;
    }
    return false;

  }
  private getValueFromPath(path: Array<string | number>, values: any): any {
    if (path.length === 2 && path[0] === surveyBuiltInVarible) {
      return this.getValueFromSurvey(<string>path[1]);
    }
    var index = 0;
    while(!!values && index < path.length) {
      var ind_name = path[index];
      if (
        Helpers.isNumber(ind_name) &&
        Array.isArray(values) &&
        (ind_name as number) >= values.length
      )
        return null;
      values = values[ind_name];
      index++;
    }
    return values;
  }
  private getValueCore(text: string, values: any): any {
    const question = this.getQuestionDirectly(text);
    if (question) {
      return { hasValue: true, value: question.value, onProcessValue: (val: any): any => question.getExpressionValue(val), path: [text], sctrictCompare: question.requireStrictCompare };
    }
    const res = this.getValueFromValues(text, values);
    if (!!text && !res.hasValue) {
      const val = this.getValueFromSurvey(text);
      if (val !== undefined) {
        res.hasValue = true;
        res.value = val;
        res.path = [surveyBuiltInVarible, text];
      }
    }
    return res;
  }
  private getQuestionDirectly(name: string): any {
    if (!!this.properties && !!this.properties.survey)
      return this.properties.survey.getQuestionByValueName(name);
    return undefined;
  }
  private getValueFromSurvey(name: string): any {
    if (!!this.properties && !!this.properties.survey)
      return this.properties.survey.getBuiltInVariableValue(name.toLocaleLowerCase());
    return undefined;
  }
  private getValueFromValues(text: string, values: any): any {
    var res: any = { hasValue: false, value: null, path: null };
    var curValue = values;
    if (!curValue && curValue !== 0 && curValue !== false) return res;
    if (
      text &&
      text.lastIndexOf(".length") > -1 &&
      text.lastIndexOf(".length") === text.length - ".length".length
    ) {
      res.value = 0;
      res.hasValue = true;
    }
    var obj = this.getNonNestedObject(curValue, text, false);
    if (!obj) return res;
    res.path = obj.path;
    res.value = !!obj.text ? this.getObjectValue(obj.value, obj.text) : obj.value;
    res.hasValue = !Helpers.isValueEmpty(res.value);
    return res;
  }
  private getNonNestedObject(obj: any, text: string, createPath: boolean): any {
    let curName = this.getFirstPropertyName(text, obj, createPath);
    let curObj = obj;
    const path = !!curName ? [curName] : null;
    let curText = text;
    while(curText != curName && !!curObj) {
      var isArray = curText[0] == "[";
      if (!isArray) {
        if (!curName && curText === this.getFirstName(curText))
          return { value: obj, text: text, path: path };
        curObj = this.getObjectValue(curObj, curName);
        if (Helpers.isValueEmpty(curObj) && !createPath) return null;
        curText = curText.substring(curName.length);
      } else {
        var objInArray = this.getObjInArray(curObj, curText);
        if (!objInArray) return null;
        curObj = objInArray.value;
        curText = objInArray.text;
        path.push(objInArray.index);
      }
      if (!!curText && curText[0] == ".") {
        curText = curText.substring(1);
      }
      curName = this.getFirstPropertyName(curText, curObj, createPath);
      if (!!curName) {
        path.push(curName);
      }
    }
    return { value: curObj, text: curText, path: path };
  }
  private getObjInArray(curValue: any, text: string): any {
    if (!Array.isArray(curValue)) return null;
    var index = 1;
    var str = "";
    while(index < text.length && text[index] != "]") {
      str += text[index];
      index++;
    }
    text = index < text.length ? text.substring(index + 1) : "";
    index = this.getIntValue(str);
    if (index < 0 || index >= curValue.length) return null;
    return { value: curValue[index], text: text, index: index };
  }
  private getFirstPropertyName(name: string, obj: any, createProp: boolean = false): string {
    if (!name) return "";
    if (!obj) obj = {};
    if (obj.hasOwnProperty(name)) return name;
    let nameInLow = name.toLowerCase();
    const A = nameInLow[0];
    const a = A.toUpperCase();
    let keyWithDot = "";
    for (var key in obj) {
      var first = key[0];
      if (first === a || first === A) {
        var keyName = key.toLowerCase();
        if (keyName == nameInLow) return key;
        if (nameInLow.length <= keyName.length) continue;
        var ch = nameInLow[keyName.length];
        if (ch != "." && ch != "[") continue;
        if (keyName == nameInLow.substring(0, keyName.length)) {
          if (keyWithDot.length < key.length) {
            keyWithDot = key;
          }
        }
      }
    }
    if (keyWithDot) return keyWithDot;
    if (createProp && name[0] !== "[") {
      const ind = name.indexOf(".");
      if (ind > -1) {
        name = name.substring(0, ind);
        obj[name] = {};
      }
      return name;
    }
    return "";
  }
  private getObjectValue(obj: any, name: string): any {
    if (!name) return null;
    return obj[name];
  }
  private getIntValue(str: any) {
    if (str == "0" || ((str | 0) > 0 && str % 1 == 0)) return Number(str);
    return -1;
  }
}
