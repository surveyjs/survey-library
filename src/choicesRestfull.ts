import { Base, SurveyError, ITextProcessor } from "./base";
import { ItemValue } from "./itemvalue";
import { JsonObject, JsonObjectProperty } from "./jsonobject";
import { surveyLocalization } from "./surveyStrings";
import { CustomError } from "./error";

class XmlParser {
  private parser = new DOMParser();
  public assignValue(target: any, name: string, value: any) {
    if (Array.isArray(target[name])) {
      target[name].push(value);
    } else if (target[name] !== undefined) {
      target[name] = [target[name]].concat(value);
    } else if (
      typeof value === "object" &&
      Object.keys(value).length === 1 &&
      Object.keys(value)[0] === name
    ) {
      target[name] = value[name];
    } else {
      target[name] = value;
    }
  }
  public xml2Json(xmlNode: any, result: any) {
    if (xmlNode.children && xmlNode.children.length > 0) {
      for (let i = 0; i < xmlNode.children.length; i++) {
        let childNode = xmlNode.children[i];
        let childObject = {};
        this.xml2Json(childNode, childObject);
        this.assignValue(result, childNode.nodeName, childObject);
      }
    } else {
      this.assignValue(result, xmlNode.nodeName, xmlNode.textContent);
    }
  }
  public parseXmlString(xmlString: string) {
    let xmlRoot = this.parser.parseFromString(xmlString, "text/xml");
    let json = {};
    this.xml2Json(xmlRoot, json);
    return json;
  }
}

/**
 * A definition for filling choices for checkbox, dropdown and radiogroup questions from resfull services.
 * The run method call a restfull service and results can be get on getResultCallback.
 */
export class ChoicesRestfull extends Base {
  private static itemsResult:{ [index: string]: any } = {};
  public static onBeforeSendRequest: (
    sender: ChoicesRestfull,
    options: { request: XMLHttpRequest }
  ) => void;
  private static getCachedItemsResult(obj: ChoicesRestfull): boolean {
    var hash = obj.objHash;
    var res = ChoicesRestfull.itemsResult[hash];
    if (!res) return false;
    if (obj.getResultCallback) {
      obj.getResultCallback(res);
    }
    return true;
  }
  private lastObjHash: string = "";
  private isRunningValue: boolean = false;
  protected processedUrl: string = "";
  protected processedPath: string = "";
  public getResultCallback: (items: Array<ItemValue>) => void;
  public updateResultCallback: (
    items: Array<ItemValue>,
    serverResult: any
  ) => Array<ItemValue>;
  public error: SurveyError = null;
  public owner: Base;
  constructor() {
    super();
  }
  public run(textProcessor: ITextProcessor = null) {
    if (!this.url || !this.getResultCallback) return;
    this.processedText(textProcessor);
    if (!this.processedUrl) {
      this.doEmptyResultCallback({});
      return;
    }
    if (this.lastObjHash == this.objHash) return;
    this.lastObjHash = this.objHash;
    if (this.useChangedItemsResults()) return;
    this.error = null;
    this.sendRequest();
  }
  public get isRunning() {
    return this.isRunningValue;
  }
  public get isWaitingForParameters() {
    return this.url && !this.processedUrl;
  }
  protected useChangedItemsResults(): boolean {
    return ChoicesRestfull.getCachedItemsResult(this);
  }
  private doEmptyResultCallback(serverResult: any) {
    var items: Array<any> = [];
    if (this.updateResultCallback) {
      items = this.updateResultCallback(items, serverResult);
    }
    this.getResultCallback(items);
  }
  private processedText(textProcessor: ITextProcessor) {
    if (textProcessor) {
      var pUrl = textProcessor.processTextEx(this.url, false);
      var pPath = textProcessor.processTextEx(this.path, false);
      if (!pUrl.hasAllValuesOnLastRun || !pPath.hasAllValuesOnLastRun) {
        this.processedUrl = "";
        this.processedPath = "";
      } else {
        this.processedUrl = pUrl.text;
        this.processedPath = pPath.text;
      }
    } else {
      this.processedUrl = this.url;
      this.processedPath = this.path;
    }
  }
  protected parseResponse(response:any) {
    let parsedResponse;
    if (
      !!response &&
      typeof response.indexOf === "function" &&
      response.indexOf("<") === 0
    ) {
      var parser = new XmlParser();
      parsedResponse = parser.parseXmlString(response);
    } else {
      try {
        parsedResponse = JSON.parse(response);
      } catch {
        parsedResponse = (response || "")
          .split("\n")
          .map((s:any) => s.trim(" "))
          .filter((s:any) => !!s);
      }
    }
    return parsedResponse;
  }
  protected sendRequest() {
    this.isRunningValue = true;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.processedUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var self = this;
    xhr.onload = function() {
      self.isRunningValue = false;
      if (xhr.status === 200) {
        self.onLoad(self.parseResponse(xhr.response));
      } else {
        self.onError(xhr.statusText, xhr.responseText);
      }
    };
    var options = { request: xhr };
    if (!!ChoicesRestfull.onBeforeSendRequest) {
      ChoicesRestfull.onBeforeSendRequest(this, options);
    }
    options.request.send();
  }
  public getType(): string {
    return "choicesByUrl";
  }
  public get isEmpty(): boolean {
    return !this.url && !this.path && !this.valueName && !this.titleName;
  }
  public getCustomPropertiesNames(): Array<string> {
    var properties = this.getCustomProperties();
    var res = new Array<string>();
    for (var i = 0; i < properties.length; i++) {
      res.push(this.getCustomPropertyName(properties[i].name));
    }
    return res;
  }
  private getCustomPropertyName(propertyName: string): string {
    return propertyName + "Name";
  }
  private getCustomProperties(): Array<JsonObjectProperty> {
    var properties = JsonObject.metaData.getProperties(this.itemValueType);
    var res = [];
    for (var i = 0; i < properties.length; i++) {
      if (
        properties[i].name === "value" ||
        properties[i].name === "text" ||
        properties[i].name === "visibleIf"
      )
        continue;
      res.push(properties[i]);
    }
    return res;
  }
  public setData(json: any) {
    this.clear();
    if (json.url) this.url = json.url;
    if (json.path) this.path = json.path;
    if (json.valueName) this.valueName = json.valueName;
    if (json.titleName) this.titleName = json.titleName;
    var properties = this.getCustomPropertiesNames();
    for (var i = 0; i < properties.length; i++) {
      if (json[properties[i]]) (<any>this)[properties[i]] = json[properties[i]];
    }
  }
  public getData(): any {
    if (this.isEmpty) return null;
    var res: any = {};
    if (this.url) res["url"] = this.url;
    if (this.path) res["path"] = this.path;
    if (this.valueName) res["valueName"] = this.valueName;
    if (this.titleName) res["titleName"] = this.titleName;
    var properties = this.getCustomPropertiesNames();
    for (var i = 0; i < properties.length; i++) {
      if ((<any>this)[properties[i]]) res[properties[i]] = (<any>this)[properties[i]];
    }
    return res;
  }
  public get url(): string {
    return this.getPropertyValue("url", "");
  }
  public set url(val: string) {
    this.setPropertyValue("url", val);
  }
  public get path(): string {
    return this.getPropertyValue("path", "");
  }
  public set path(val: string) {
    this.setPropertyValue("path", val);
  }
  public get valueName(): string {
    return this.getPropertyValue("valueName", "");
  }
  public set valueName(val: string) {
    this.setPropertyValue("valueName", val);
  }
  public get titleName(): string {
    return this.getPropertyValue("titleName", "");
  }
  public set titleName(val: string) {
    this.setPropertyValue("titleName", val);
  }
  public get itemValueType(): string {
    if (!this.owner) return "itemvalue";
    var prop = JsonObject.metaData.findProperty(
      this.owner.getType(),
      "choices"
    );
    if (!prop) return "itemvalue";
    if (prop.type == "itemvalues") return "itemvalue";
    return prop.type;
  }
  public clear() {
    this.url = "";
    this.path = "";
    this.valueName = "";
    this.titleName = "";
    var properties = this.getCustomPropertiesNames();
    for (var i = 0; i < properties.length; i++) {
      if ((<any>this)[properties[i]]) (<any>this)[properties[i]] = "";
    }
  }
  protected onLoad(result: any) {
    var items = [];
    var updatedResult = this.getResultAfterPath(result);
    if (updatedResult && updatedResult["length"]) {
      for (var i = 0; i < updatedResult.length; i++) {
        var itemValue = updatedResult[i];
        if (!itemValue) continue;
        var value = this.getValue(itemValue);
        var title = this.getTitle(itemValue);
        var item = new ItemValue(value, title);
        this.setCustomProperties(item, itemValue);
        items.push(item);
      }
    } else {
      this.error = new CustomError(
        surveyLocalization.getString("urlGetChoicesError")
      );
    }
    if (this.updateResultCallback) {
      items = this.updateResultCallback(items, result);
    }
    ChoicesRestfull.itemsResult[this.objHash] = items;
    this.getResultCallback(items);
  }
  private setCustomProperties(item: ItemValue, itemValue: any) {
    var properties = this.getCustomProperties();
    for (var i = 0; i < properties.length; i++) {
      var prop = properties[i];
      var val = this.getValueCore(
        itemValue,
        this.getPropertyBinding(prop.name)
      );
      if (!this.isValueEmpty(val)) {
        (<any>item)[prop.name] = val;
      }
    }
  }
  private getPropertyBinding(propertyName: string) {
    if ((<any>this)[this.getCustomPropertyName(propertyName)])
      return (<any>this)[this.getCustomPropertyName(propertyName)];
    if ((<any>this)[propertyName]) return (<any>this)[propertyName];
    return propertyName;
  }
  private onError(status: string, response: string) {
    this.error = new CustomError(
      surveyLocalization
        .getString("urlRequestError")
        ["format"](status, response)
    );
    this.doEmptyResultCallback(response);
  }
  private getResultAfterPath(result: any) {
    if (!result) return result;
    if (!this.processedPath) return result;
    var pathes = this.getPathes();
    for (var i = 0; i < pathes.length; i++) {
      result = result[pathes[i]];
      if (!result) return null;
    }
    return result;
  }
  private getPathes(): Array<string> {
    var pathes = [];
    if (this.processedPath.indexOf(";") > -1) {
      pathes = this.path.split(";");
    } else {
      pathes = this.processedPath.split(",");
    }
    if (pathes.length == 0) pathes.push(this.processedPath);
    return pathes;
  }
  private getValue(item: any): any {
    if (!item) return null;
    if (this.valueName) return this.getValueCore(item, this.valueName);
    if (!(item instanceof Object)) return item;
    var len = Object.keys(item).length;
    if (len < 1) return null;
    return item[Object.keys(item)[0]];
  }
  private getTitle(item: any): any {
    var title = this.titleName ? this.titleName : "title";
    return this.getValueCore(item, title);
  }
  private getValueCore(item: any, property: string): any {
    if (!item) return null;
    if (property.indexOf(".") < 0) return item[property];
    var properties = property.split(".");
    for (var i = 0; i < properties.length; i++) {
      item = item[properties[i]];
      if (!item) return null;
    }
    return item;
  }
  private get objHash() {
    return (
      this.processedUrl +
      ";" +
      this.processedPath +
      ";" +
      this.valueName +
      ";" +
      this.titleName
    );
  }
}
JsonObject.metaData.addClass(
  "choicesByUrl",
  ["url", "path", "valueName", "titleName"],
  function() {
    return new ChoicesRestfull();
  }
);
