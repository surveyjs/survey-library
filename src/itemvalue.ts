import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { JsonObject, JsonObjectProperty } from "./jsonobject";
import { Helpers } from "./helpers";
import { ConditionRunner } from "./conditions";
import { Base } from "./base";

/**
 * Array of ItemValue is used in checkox, dropdown and radiogroup choices, matrix columns and rows.
 * It has two main properties: value and text. If text is empty, value is used for displaying.
 * The text property is localizable and support markdown.
 */
export class ItemValue extends Base {
  [index: string]: any;
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
  private visibleIfValue: string = "";
  private itemValue: any;
  private locTextValue: LocalizableString;
  private isVisibleValue: boolean = true;
  private conditionRunner: ConditionRunner;

  constructor(value: any, text: string = null, private typeName = "itemvalue") {
    super();
    this.locTextValue = new LocalizableString(null, true);
    this.locTextValue.onGetTextCallback = txt => {
      return txt ? txt : !this.isValueItemEmpty ? this.value.toString() : null;
    };
    if (text) this.locText.text = text;
    if (!!value && typeof value === "object") {
      this.setData(value);
    } else {
      this.value = value;
    }
  }
  public getType(): string {
    return this.typeName;
  }
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
    var json = this.toJSON();
    if (!!json["value"] && !!json["value"]["pos"]) {
      delete json["value"]["pos"];
    }
    if (Object.keys(json).length == 1 && !Helpers.isValueEmpty(json["value"]))
      return this.value;
    return json;
  }
  public toJSON(): any {
    var res = {};
    var properties = JsonObject.metaData.getProperties(this.getType());
    if (!properties || properties.length == 0) {
      properties = JsonObject.metaData.getProperties("itemvalue");
    }
    var jsoObj = new JsonObject();
    for (var i = 0; i < properties.length; i++) {
      jsoObj.valueToJson(this, res, properties[i]);
    }
    return res;
  }
  public setData(value: any) {
    if (typeof value.value !== "undefined") {
      var json = null;
      if (typeof value.toJSON === "function") {
        json = (<Base>value).toJSON();
      } else {
        new JsonObject().toObject(value, this);
      }
      for (var key in json) {
        this[key] = json[key];
      }
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
  private get isValueItemEmpty() {
    return !this.itemValue && this.itemValue !== 0 && this.itemValue !== false;
  }
}

Base.createItemValue = function(dest: any): any {
  var item = null;
  if (typeof dest.getType === "function") {
    item = new ItemValue(null, undefined, dest.getType());
  } else {
    item = new ItemValue(null);
  }
  item.setData(dest);
  return item;
};
Base.itemValueLocStrChanged = function(arr: Array<any>): void {
  ItemValue.locStrsChanged(arr);
};
JsonObjectProperty.getItemValuesDefaultValue = function(val: any): any {
  var res = new Array<ItemValue>();
  ItemValue.setData(res, val || []);
  return res;
};

JsonObject.metaData.addClass(
  "itemvalue",
  [
    "value",
    {
      name: "text",
      serializationProperty: "locText"
    },
    { name: "visibleIf:condition", visible: false }
  ],
  (value: any) => new ItemValue(value)
);
