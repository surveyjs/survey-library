import { Helpers, HashTable } from "./helpers";

export interface ValueCore {
  hasValue: boolean;
  value: any;
}

export class ProcessValue {
  public values: HashTable<any> = null;
  public properties: HashTable<any> = null;
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
  public setValue(obj: any, text: string, value: any) {
    if (!text) return;
    var nonNestedObj = this.getNonNestedObject(obj, text);
    if (!nonNestedObj) return;
    obj = nonNestedObj.value;
    text = nonNestedObj.text;
    if (!!obj && !!text) {
      obj[text] = value;
    }
  }
  public getValue(text: string, values: HashTable<any> = null): any {
    if (!values) values = this.values;
    var res = this.getValueCore(text, values);
    return res.value;
  }
  private getValueCore(text: string, values: any): any {
    var res: ValueCore = { hasValue: false, value: null };
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
    var nonNestedObj = this.getNonNestedObject(curValue, text);
    if (!nonNestedObj) return res;
    res.value = !!nonNestedObj.text
      ? this.getObjectValue(nonNestedObj.value, nonNestedObj.text)
      : nonNestedObj.value;
    res.hasValue = !Helpers.isValueEmpty(res.value);
    return res;
  }
  private getNonNestedObject(obj: any, text: string): any {
    var curName = this.getFirstPropertyName(text, obj);
    while (text != curName && !!obj) {
      var isArray = text[0] == "[";
      if (!isArray) {
        if (!curName && text == this.getFirstName(text))
          return { value: obj, text: text };
        obj = this.getObjectValue(obj, curName);
        if (Helpers.isValueEmpty(obj)) return null;
        text = text.substr(curName.length);
      } else {
        var objInArray = this.getObjInArray(obj, text);
        if (!objInArray) return null;
        obj = objInArray.value;
        text = objInArray.text;
      }
      if (!!text && text[0] == ".") {
        text = text.substr(1);
      }
      curName = this.getFirstPropertyName(text, obj);
    }
    return { value: obj, text: text };
  }
  private getObjInArray(curValue: any, text: string): any {
    if (!Array.isArray(curValue)) return null;
    var index = 1;
    var str = "";
    while (index < text.length && text[index] != "]") {
      str += text[index];
      index++;
    }
    text = index < text.length ? text.substr(index + 1) : "";
    index = this.getIntValue(str);
    if (index < 0 || index >= curValue.length) return null;
    return { value: curValue[index], text: text };
  }
  private getFirstPropertyName(name: string, obj: any): string {
    if (!name) return name;
    if (obj.hasOwnProperty(name)) return name;
    name = name.toLowerCase();
    var A = name[0];
    var a = A.toUpperCase();
    for (var key in obj) {
      var first = key[0];
      if (first === a || first === A) {
        var keyName = key.toLowerCase();
        if (keyName == name) return key;
        if (name.length <= keyName.length) continue;
        var ch = name[keyName.length];
        if (ch != "." && ch != "[") continue;
        if (keyName == name.substr(0, keyName.length)) return key;
      }
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
