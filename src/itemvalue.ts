import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { JsonObject } from "./jsonobject";
import { Helpers } from "./helpers";
import { ConditionRunner } from "./conditions";

/**
 * Array of ItemValue is used in checkox, dropdown and radiogroup choices, matrix columns and rows.
 * It has two main properties: value and text. If text is empty, value is used for displaying.
 * The text property is localizable and support markdown.
 */
export class ItemValue {
  public static Separator = "|";
  public static createArray(locOwner: ILocalizableOwner): Array<ItemValue> {
    var items: Array<ItemValue> = [];
    ItemValue.setupArray(items, locOwner);
    return items;
  }
  public static setupArray(
    items: Array<ItemValue>,
    locOwner: ILocalizableOwner
  ) {
    items.push = function(value): number {
      var result = Array.prototype.push.call(this, value);
      value.locOwner = locOwner;
      return result;
    };
    items.unshift = function(value): number {
      var result = Array.prototype.unshift.call(this, value);
      value.locOwner = locOwner;
      return result;
    };
    items.splice = function(
      start?: number,
      deleteCount?: number,
      ...items: ItemValue[]
    ): ItemValue[] {
      var result = Array.prototype.splice.call(
        this,
        start,
        deleteCount,
        ...items
      );
      if (!items) items = [];
      for (var i = 0; i < items.length; i++) {
        items[i].locOwner = locOwner;
      }
      return result;
    };
  }
  public static setData(items: Array<ItemValue>, values: Array<any>) {
    items.length = 0;
    for (var i = 0; i < values.length; i++) {
      var value = values[i];
      var item;
      if (typeof value.getType === "function") {
        item = new ItemValue(null, undefined, value.getType());
      } else {
        item = new ItemValue(null);
      }
      item.setData(value);
      items.push(item);
    }
  }
  public static getData(items: Array<ItemValue>): any {
    var result = new Array();
    for (var i = 0; i < items.length; i++) {
      result.push(items[i].getData());
    }
    return result;
  }
  public static getItemByValue(items: Array<ItemValue>, val: any): ItemValue {
    for (var i = 0; i < items.length; i++) {
      if (Helpers.isTwoValueEquals(items[i].value, val)) return items[i];
    }
    return null;
  }
  public static getTextOrHtmlByValue(
    items: Array<ItemValue>,
    val: any
  ): string {
    var item = ItemValue.getItemByValue(items, val);
    return item !== null ? item.locText.textOrHtml : "";
  }
  public static locStrsChanged(items: Array<ItemValue>) {
    for (var i = 0; i < items.length; i++) {
      items[i].locText.strChanged();
    }
  }
  public static runConditionsForItems(
    items: Array<ItemValue>,
    filteredItems: Array<ItemValue>,
    runner: ConditionRunner,
    values: any,
    properties: any
  ): boolean {
    if (!values) {
      values = {};
    }
    var itemValue = values["item"];
    var choiceValue = values["choice"];
    var hasChanded = false;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      values["item"] = item.value;
      values["choice"] = item.value;
      var itemRunner = !!item.getConditionRunner
        ? item.getConditionRunner()
        : false;
      if (!itemRunner) {
        itemRunner = runner;
      }
      var vis = true;
      if (itemRunner) {
        vis = itemRunner.run(values, properties);
        if (vis) {
          filteredItems.push(item);
        }
      } else {
        filteredItems.push(item);
      }
      if (vis != item.isVisible) {
        hasChanded = true;
        if (!!item.setIsVisible) item.setIsVisible(vis);
      }
    }
    if (itemValue) {
      values["item"] = itemValue;
    } else {
      delete values["item"];
    }
    if (choiceValue) {
      values["choice"] = choiceValue;
    } else {
      delete values["choice"];
    }
    return hasChanded;
  }
  private static itemValueProp = [
    "text",
    "value",
    "visibleIfValue",
    "visibleIf",
    "hasText",
    "locOwner",
    "locText",
    "isValueEmpty",
    "isVisible",
    "isVisibleValue",
    "locTextValue",
    "conditionRunner",
    "pos",
    "survey"
  ];
  private visibleIfValue: string = "";
  private itemValue: any;
  private locTextValue: LocalizableString;
  private isVisibleValue: boolean = true;
  private conditionRunner: ConditionRunner;

  constructor(value: any, text: string = null, typeName = "itemvalue") {
    this.getType = () => typeName;
    this.locTextValue = new LocalizableString(null, true);
    this.locTextValue.onGetTextCallback = txt => {
      return txt ? txt : !this.isValueEmpty ? this.value.toString() : null;
    };
    if (text) this.locText.text = text;
    this.value = value;
  }
  public getType: () => string;
  public get locText(): LocalizableString {
    return this.locTextValue;
  }
  setLocText(locText: LocalizableString) {
    this.locTextValue = locText;
  }
  public get locOwner(): ILocalizableOwner {
    return this.locText.owner;
  }
  public set locOwner(value: ILocalizableOwner) {
    this.locText.owner = value;
  }
  public get value(): any {
    return this.itemValue;
  }
  public set value(newValue: any) {
    this.itemValue = newValue;
    if (!this.itemValue) return;
    var str: string = this.itemValue.toString();
    var index = str.indexOf(ItemValue.Separator);
    if (index > -1) {
      this.itemValue = str.slice(0, index);
      this.text = str.slice(index + 1);
    } else if (!this.hasText) {
      this.locText.onChanged();
    }
  }
  public get hasText(): boolean {
    return this.locText.pureText ? true : false;
  }
  public get text(): string {
    return this.locText.text;
  }
  public set text(newText: string) {
    this.locText.text = newText;
  }
  public getData(): any {
    var customAttributes = this.getCustomAttributes();
    var textJson = this.locText.getJson();
    if (!customAttributes && !textJson && !this.visibleIf) return this.value;
    var value = this.value;
    if (value && value["pos"]) delete value["pos"];
    var result = { value: value };
    if (textJson) (<any>result)["text"] = textJson;
    if (this.visibleIf) (<any>result)["visibleIf"] = this.visibleIf;
    if (customAttributes) {
      for (var key in customAttributes) {
        (<any>result)[key] = customAttributes[key];
      }
    }
    return result;
  }
  public setData(value: any) {
    if (typeof value.value !== "undefined") {
      var exception = null;
      if (this.isObjItemValue(value)) {
        value.itemValue = value.itemValue;
        this.locText.setJson(value.locText.getJson());
        if (value.visibleIf) this.visibleIf = value.visibleIf;
        exception = ItemValue.itemValueProp;
      }
      this.copyAttributes(value, exception);
    } else {
      this.value = value;
    }
  }
  public get visibleIf(): string {
    return this.visibleIfValue;
  }
  public set visibleIf(val: string) {
    this.visibleIfValue = val;
  }
  public get isVisible() {
    return this.isVisibleValue;
  }
  public setIsVisible(val: boolean) {
    this.isVisibleValue = val;
  }
  public getConditionRunner(): ConditionRunner {
    if (!this.visibleIf) return null;
    if (!this.conditionRunner)
      this.conditionRunner = new ConditionRunner(this.visibleIf);
    this.conditionRunner.expression = this.visibleIf;
    return this.conditionRunner;
  }
  private get isValueEmpty() {
    return !this.itemValue && this.itemValue !== 0 && this.itemValue !== false;
  }
  private isObjItemValue(obj: any) {
    return typeof obj.getType !== "undefined" && obj.getType() == "itemvalue";
  }
  private copyAttributes(src: any, exceptons: Array<string>) {
    for (var key in src) {
      if (typeof src[key] == "function") continue;
      if (exceptons && exceptons.indexOf(key) > -1) continue;
      if (key === "text") {
        this.locText.setJson(src[key]);
      } else {
        if (
          ["locText", "hasText", "isVisible", "isValueEmpty"].indexOf(key) ===
          -1
        ) {
          (<any>this)[key] = src[key];
        }
      }
    }
  }
  private getCustomAttributes(): any {
    var result = null;
    for (var key in this) {
      if (
        typeof this[key] === "function" ||
        ItemValue.itemValueProp.indexOf(key) > -1 ||
        key === "itemValue"
      )
        continue;
      if (result == null) result = {};
      (<any>result)[key] = this[key];
    }
    return result;
  }
}

JsonObject.metaData.addClass("itemvalue", [
  "!value",
  {
    name: "text",
    onGetValue: function(obj: any) {
      return obj.locText.pureText;
    }
  },
  { name: "visibleIf:condition", visible: false }
]);
