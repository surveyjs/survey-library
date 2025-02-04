import { Base } from "./base";
import { ITextProcessor, IQuestion, ISurvey } from "./base-interfaces";
import { ItemValue } from "./itemvalue";
import { Serializer, JsonObjectProperty } from "./jsonobject";
import { WebRequestError, WebRequestEmptyError } from "./error";
import { settings } from "./settings";
import { SurveyError } from "./survey-error";

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
 * Configures access to a RESTful service that returns choices for [Checkbox](https://surveyjs.io/Examples/Library?id=questiontype-checkbox), [Dropdown](https://surveyjs.io/Examples/Library?id=questiontype-dropdown), [Radiogroup](https://surveyjs.io/Examples/Library?id=questiontype-radiogroup), and other multiple-choice question types.
 *
 * Use the following properties to configure this object:
 *
 * ```js
 * {
 *   url: "http://...", // A RESTful service's URL.
 *   valueName: "value", // Specifies which field contains choice values.
 *   titleName: "title", // Specifies which field contains display texts for choice values.
 *   imageLinkName: "imageUrl", // Specifies which field contains image URLs. Used in Image Picker questions.
 *   // Path to the array of choices. Specify `path` only if the array of choices is nested within the object returned by the service.
 *   // The following path separators are allowed: semicolon `;`, comma `,`.
 *   path: "myNestedArray"
 * }
 * ```
 *
 * Typically, you should assign this object to a question's [`choicesByUrl`](https://surveyjs.io/Documentation/Library?id=QuestionSelectBase#choicesByUrl) property. You can also specify additional application-wide settings using the [`settings.web`](https://surveyjs.io/form-library/documentation/api-reference/settings#web) object.
 */
export class ChoicesRestful extends Base {
  private static cacheText = "{CACHE}";
  private static noCacheText = "{NOCACHE}";
  public static get EncodeParameters(): boolean {
    return settings.web.encodeUrlParams;
  }
  public static set EncodeParameters(val: boolean) {
    settings.web.encodeUrlParams = val;
  }
  public static clearCache() {
    ChoicesRestful.itemsResult = {};
    ChoicesRestful.sendingSameRequests = {};
  }
  private static itemsResult: { [index: string]: any } = {};
  private static sendingSameRequests: {
    [index: string]: Array<ChoicesRestful>,
  } = {};
  private static addSameRequest(obj: ChoicesRestful): boolean {
    if (!obj.isUsingCache) return false;
    var hash = obj.objHash;
    var res = ChoicesRestful.sendingSameRequests[hash];
    if (!res) {
      ChoicesRestful.sendingSameRequests[obj.objHash] = [];
      return false;
    }
    res.push(obj);
    obj.isRunningValue = true;
    return true;
  }
  private static unregisterSameRequests(obj: ChoicesRestful, items: any) {
    if (!obj.isUsingCache) return;
    var res = ChoicesRestful.sendingSameRequests[obj.objHash];
    delete ChoicesRestful.sendingSameRequests[obj.objHash];
    if (!res) return;
    for (var i = 0; i < res.length; i++) {
      res[i].isRunningValue = false;
      if (!!res[i].getResultCallback) {
        res[i].getResultCallback(items);
      }
    }
  }
  public static get onBeforeSendRequest(): (
    sender: ChoicesRestful,
    options: { request: XMLHttpRequest }
  ) => void {
    return settings.web.onBeforeRequestChoices;
  }
  public static set onBeforeSendRequest(
    val: (sender: ChoicesRestful, options: { request: XMLHttpRequest }) => void
  ) {
    settings.web.onBeforeRequestChoices = val;
  }
  private static getCachedItemsResult(obj: ChoicesRestful): boolean {
    var hash = obj.objHash;
    var res = ChoicesRestful.itemsResult[hash];
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
  private isUsingCacheFromUrl: boolean = undefined;
  public onProcessedUrlCallback: (url: string, path: string) => void;
  public getResultCallback: (items: Array<ItemValue>) => void;
  public beforeSendRequestCallback: () => void;
  public updateResultCallback: (
    items: Array<ItemValue>,
    serverResult: any
  ) => Array<ItemValue>;
  public getItemValueCallback: (item: any) => any;
  public error: SurveyError = null;
  public owner: IQuestion;
  public createItemValue = (value: any): ItemValue => {
    return new ItemValue(value);
  };
  constructor() {
    super();
    this.registerPropertyChangedHandlers(["url"], () => {
      if(this.owner) (<Base><any>this.owner).setPropertyValue("isUsingRestful", !!this.url);
    });
  }
  public getSurvey(live: boolean = false): ISurvey {
    return !!this.owner ? this.owner.survey : null;
  }
  public run(textProcessor: ITextProcessor = null) {
    if (!this.url || !this.getResultCallback) return;
    this.processedText(textProcessor);
    if (!this.processedUrl) {
      this.doEmptyResultCallback({});
      this.lastObjHash = this.objHash;
      return;
    }
    if (this.lastObjHash === this.objHash) return;
    this.lastObjHash = this.objHash;
    this.error = null;
    if (this.useChangedItemsResults()) return;
    if (ChoicesRestful.addSameRequest(this)) return;
    this.sendRequest();
  }
  public get isUsingCache(): boolean {
    if (this.isUsingCacheFromUrl === true) return true;
    if (this.isUsingCacheFromUrl === false) return false;
    return settings.web.cacheLoadedChoices;
  }
  public get isRunning(): boolean {
    return this.getIsRunning();
  }
  protected getIsRunning(): boolean {
    return this.isRunningValue;
  }

  public get isWaitingForParameters() {
    return this.url && !this.processedUrl;
  }
  protected useChangedItemsResults(): boolean {
    return ChoicesRestful.getCachedItemsResult(this);
  }
  private doEmptyResultCallback(serverResult: any) {
    var items: Array<any> = [];
    if (this.updateResultCallback) {
      items = this.updateResultCallback(items, serverResult);
    }
    this.getResultCallback(items);
  }
  private processedText(textProcessor: ITextProcessor) {
    var urlText = this.url;
    if (!!urlText) {
      urlText = urlText
        .replace(ChoicesRestful.cacheText, "")
        .replace(ChoicesRestful.noCacheText, "");
    }
    if (textProcessor) {
      var pUrl = textProcessor.processTextEx({ text: urlText, runAtDesign: true });
      var pPath = textProcessor.processTextEx({ text: this.path, runAtDesign: true });
      if (!pUrl.hasAllValuesOnLastRun || !pPath.hasAllValuesOnLastRun) {
        this.processedUrl = "";
        this.processedPath = "";
      } else {
        this.processedUrl = pUrl.text;
        this.processedPath = pPath.text;
      }
    } else {
      this.processedUrl = urlText;
      this.processedPath = this.path;
    }
    if (this.onProcessedUrlCallback) {
      this.onProcessedUrlCallback(this.processedUrl, this.processedPath);
    }
  }
  protected parseResponse(response: any) {
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
          .map((s: any) => s.trim(" "))
          .filter((s: any) => !!s);
      }
    }
    return parsedResponse;
  }
  protected sendRequest() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.processedUrl);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var self = this;
    var loadingObjHash = this.objHash;
    xhr.onload = function () {
      self.beforeLoadRequest();
      if (xhr.status === 200) {
        self.onLoad(self.parseResponse(xhr.response), loadingObjHash);
      } else {
        self.onError(xhr.statusText, xhr.responseText);
      }
    };
    var options = { request: xhr };
    if (!!settings.web.onBeforeRequestChoices) {
      settings.web.onBeforeRequestChoices(this, options);
    }
    this.beforeSendRequest();
    options.request.send();
  }
  public getType(): string {
    return "choicesByUrl";
  }
  public get isEmpty(): boolean {
    return !this.url && !this.path;
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
    var properties = Serializer.getProperties(this.itemValueType);
    var res = [];
    for (var i = 0; i < properties.length; i++) {
      if (
        properties[i].name === "value" ||
        properties[i].name === "text" ||
        properties[i].name === "visibleIf" ||
        properties[i].name === "enableIf"
      )
        continue;
      res.push(properties[i]);
    }
    return res;
  }
  private getAllPropertiesNames(): Array<string> {
    const res = new Array<string>();
    Serializer.getPropertiesByObj(this).forEach(prop => res.push(prop.name));
    this.getCustomPropertiesNames().forEach(prop => res.push(prop));
    return res;
  }
  public setData(json: any): void {
    if(!json) json = {};
    this.getAllPropertiesNames().forEach(name => {
      (<any>this)[name] = json[name];
    });
  }
  public getData(): any {
    const res: any = {};
    let hasValue = false;
    this.getAllPropertiesNames().forEach(name => {
      const val = (<any>this)[name];
      if(!this.isValueEmpty(val) && val !== this.getDefaultPropertyValue(name)) {
        res[name] = val;
        hasValue = true;
      }
    });
    return hasValue ? res : null;
  }
  /**
   * A RESTful service's URL.
   *
   * This property supports [dynamic URLs](https://surveyjs.io/Documentation/Library?id=design-survey-conditional-logic#dynamic-texts). For example, the URL below depends on the `region` question's value. When the value changes, the survey automatically loads a new dataset that corresponds to the selected region.
   *
   * ```js
   * url: "https://surveyjs.io/api/CountriesExample?region={region}"
   * ```
   *
   * [View Demo](https://surveyjs.io/Examples/Library/?id=questiontype-dropdownrestfull (linkStyle))
   * @see path
   * @see valueName
   * @see titleName
   */
  public get url(): string {
    return this.getPropertyValue("url") || "";
  }
  public set url(val: string) {
    this.setPropertyValue("url", val);
    this.isUsingCacheFromUrl = undefined;
    if (!val) return;
    if (val.indexOf(ChoicesRestful.cacheText) > -1) {
      this.isUsingCacheFromUrl = true;
    } else {
      if (val.indexOf(ChoicesRestful.noCacheText) > -1) {
        this.isUsingCacheFromUrl = false;
      }
    }
  }
  /**
   * Path to the array of choices. The following path separators are allowed: semicolon `;`, comma `,`.
   *
   * Specify this property only if the array of choices is nested within the object returned by the service. For example, the service returns the following object:
   *
   * ```js
   * {
   *   countries: [ ... ],
   *   capitals: [ ... ]
   * }
   * ```
   *
   * To populate choices with values from the `countries` array, set the `path` property to `"countries"`. To use the `capitals` array, set this property to `"capitals"`.
   * @see url
   * @see valueName
   * @see titleName
   */

  public get path(): string {
    return this.getPropertyValue("path") || "";
  }
  public set path(val: string) {
    this.setPropertyValue("path", val);
  }
  /**
   * Specifies which property in the obtained data object contains choice values.
   *
   * [View Demo](https://surveyjs.io/Examples/Library/?id=questiontype-dropdownrestfull (linkStyle))
   *
   * @see url
   * @see path
   * @see titleName
   */

  public get valueName(): string {
    return this.getPropertyValue("valueName", "");
  }
  public set valueName(val: string) {
    this.setPropertyValue("valueName", val);
  }
  /**
   * Specifies which property in the obtained data object contains display texts for choices.
   *
   * @see url
   * @see path
   * @see valueName
   */

  public get titleName(): string {
    return this.getPropertyValue("titleName", "");
  }
  public set titleName(val: string) {
    this.setPropertyValue("titleName", val);
  }

  /**
   * Specifies which property in the obtained data object contains image URLs. Used only in [Image Picker](https://surveyjs.io/Examples/Library?id=questiontype-imagepicker) questions.
   *
   * @see url
   * @see path
   * @see valueName
   */
  public get imageLinkName(): string {
    return this.getPropertyValue("imageLinkName", "");
  }
  public set imageLinkName(val: string) {
    this.setPropertyValue("imageLinkName", val);
  }
  /**
   * Specifies whether the service is allowed to return an empty response or an empty array in a response.
   *
   * Default value: `false`
   */
  public get allowEmptyResponse(): boolean {
    return this.getPropertyValue("allowEmptyResponse");
  }
  public set allowEmptyResponse(val: boolean) {
    this.setPropertyValue("allowEmptyResponse", val);
  }
  public get attachOriginalItems(): boolean {
    return this.getPropertyValue("attachOriginalItems");
  }
  public set attachOriginalItems(val: boolean) {
    this.setPropertyValue("attachOriginalItems", val);
  }
  public get itemValueType(): string {
    if (!this.owner) return "itemvalue";
    var prop = Serializer.findProperty(this.owner.getType(), "choices");
    if (!prop) return "itemvalue";
    if (prop.type == "itemvalue[]") return "itemvalue";
    return prop.type;
  }
  public clear(): void {
    this.setData(undefined);
  }
  protected beforeSendRequest() {
    this.isRunningValue = true;
    if (!!this.beforeSendRequestCallback) {
      this.beforeSendRequestCallback();
    }
  }
  protected beforeLoadRequest() {
    this.isRunningValue = false;
  }
  protected onLoad(result: any, loadingObjHash: string = null) {
    if (!loadingObjHash) {
      loadingObjHash = this.objHash;
    }
    var items = new Array<ItemValue>();
    var updatedResult = this.getResultAfterPath(result);
    if (updatedResult && updatedResult["length"]) {
      for (var i = 0; i < updatedResult.length; i++) {
        var itemValue = updatedResult[i];
        if (!itemValue) continue;
        var value = !!this.getItemValueCallback
          ? this.getItemValueCallback(itemValue)
          : this.getValue(itemValue);
        var item = this.createItemValue(value);
        this.setTitle(item, itemValue);
        this.setCustomProperties(item, itemValue);
        if (this.attachOriginalItems) {
          item.originalItem = itemValue;
        }
        var imageLink = this.getImageLink(itemValue);
        if (!!imageLink) {
          item.imageLink = imageLink;
        }
        items.push(item);
      }
    } else {
      if (!this.allowEmptyResponse) {
        this.error = new WebRequestEmptyError(null, this.owner);
      }
    }
    if (this.updateResultCallback) {
      items = this.updateResultCallback(items, result);
    }
    if (this.isUsingCache) {
      ChoicesRestful.itemsResult[loadingObjHash] = items;
    }
    this.callResultCallback(items, loadingObjHash);
    ChoicesRestful.unregisterSameRequests(this, items);
  }
  protected callResultCallback(
    items: Array<ItemValue>,
    loadingObjHash: string
  ) {
    if (loadingObjHash != this.objHash) return;
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
    this.error = new WebRequestError(status, response, this.owner);
    this.doEmptyResultCallback(response);
    ChoicesRestful.unregisterSameRequests(this, []);
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
    } else if (this.processedPath.indexOf(",") > -1) {
      pathes = this.processedPath.split(",");
    } else {
      pathes = this.processedPath.split(".");
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
  private setTitle(item: ItemValue, itemValue: any): any {
    var title = this.titleName ? this.titleName : "title";
    var val = this.getValueCore(itemValue, title);
    if (!val) return;
    if (typeof val === "string") {
      item.text = val;
    } else {
      item.locText.setJson(val);
    }
  }
  private getImageLink(item: any): any {
    var imageLink = this.imageLinkName ? this.imageLinkName : "imageLink";
    return this.getValueCore(item, imageLink);
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
      this.titleName +
      ";" +
      this.imageLinkName
    );
  }
}

/**
 * @deprecated Use `ChoicesRestful` instead.
 */
export class ChoicesRestfull extends ChoicesRestful {
  public static get EncodeParameters(): boolean {
    return ChoicesRestful.EncodeParameters;
  }
  public static set EncodeParameters(val: boolean) {
    ChoicesRestful.EncodeParameters = val;
  }
  public static clearCache() {
    ChoicesRestful.clearCache();
  }
  public static get onBeforeSendRequest(): (
    sender: ChoicesRestful,
    options: { request: XMLHttpRequest }
  ) => void {
    return settings.web.onBeforeRequestChoices;
  }
  public static set onBeforeSendRequest(
    val: (sender: ChoicesRestful, options: { request: XMLHttpRequest }) => void
  ) {
    settings.web.onBeforeRequestChoices = val;
  }
}

Serializer.addClass(
  "choicesByUrl",
  [
    "url",
    "path",
    "valueName",
    "titleName",
    {
      name: "imageLinkName",
      visibleIf: function (obj: any) {
        return !!obj && !!obj.owner && obj.owner.getType() == "imagepicker";
      },
    },
    { name: "allowEmptyResponse:boolean" },
    { name: "attachOriginalItems:boolean", visible: false },
  ],
  function () {
    return new ChoicesRestful();
  }
);
