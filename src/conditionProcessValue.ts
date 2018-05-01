import { Helpers, HashTable } from "./helpers";

export class ProcessValue {
  public values: HashTable<any> = null;
  public properties: HashTable<any> = null;
  constructor() {}
  public getFirstName(text: string): string {
    if (!text) return text;
    var res = "";
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
    return res.value;
  }
  private getValueCore(text: string, values: any): any {
    var res = { hasValue: false, value: null };
    var curValue = values;
    if (!curValue) return res;
    var isFirst = true;
    while (text && text.length > 0) {
      var isArray = !isFirst && text[0] == "[";
      if (!isArray) {
        if (!isFirst) text = text.substr(1);
        var curName = this.getFirstName(text);
        if (!curName) return res;
        if (Helpers.isValueEmpty(curValue[curName])) return res;
        curValue = curValue[curName];
        text = text.substr(curName.length);
      } else {
        if (!Array.isArray(curValue)) return res;
        var index = 1;
        var str = "";
        while (index < text.length && text[index] != "]") {
          str += text[index];
          index++;
        }
        text = index < text.length ? text.substr(index + 1) : "";
        index = this.getIntValue(str);
        if (index < 0 || index >= curValue.length) return res;
        curValue = curValue[index];
      }
      isFirst = false;
    }
    res.value = curValue;
    res.hasValue = true;
    return res;
  }
  private getIntValue(str: any) {
    if (str == "0" || ((str | 0) > 0 && str % 1 == 0)) return Number(str);
    return -1;
  }
}
