import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import {
  JsonObject,
  JsonObjectProperty,
  Serializer,
  CustomPropertiesCollection,
  property,
} from "./jsonobject";
import { Helpers } from "./helpers";
import { ConditionRunner } from "./conditions";
import { Base, ComputedUpdater } from "./base";
import { IShortcutText, ISurvey } from "./base-interfaces";
import { settings } from "./settings";
import { BaseAction } from "./actions/action";
import { Question } from "./question";

/**
 * Array of ItemValue is used in checkbox, dropdown and radiogroup choices, matrix columns and rows.
 * It has two main properties: value and text. If text is empty, value is used for displaying.
 * The text property is localizable and support markdown.
 */
export class ItemValue extends BaseAction implements ILocalizableOwner, IShortcutText {
  [index: string]: any;

  public getMarkdownHtml(text: string, name: string): string {
    return !!this.locOwner ? this.locOwner.getMarkdownHtml(text, name) : undefined;
  }
  public getRenderer(name: string): string {
    return !!this.locOwner ? this.locOwner.getRenderer(name) : null;
  }
  public getRendererContext(locStr: LocalizableString): any {
    return !!this.locOwner ? this.locOwner.getRendererContext(locStr) : locStr;
  }
  public getProcessedText(text: string): string {
    return this.locOwner ? this.locOwner.getProcessedText(text) : text;
  }

  public static get Separator() {
    return settings.itemValueSeparator;
  }
  public static set Separator(val: string) {
    settings.itemValueSeparator = val;
  }
  /**
   * Resets the input array and fills it with values from the values array
   */
  public static setData(items: Array<ItemValue>, values: Array<any>, type?: string): void {
    items.length = 0;
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const itemType = !!value && typeof value.getType === "function" ? value.getType() : (type ?? "itemvalue");
      const item = Serializer.createClass(itemType);
      item.setData(value);
      if (!!value.originalItem) {
        item.originalItem = value.originalItem;
      }
      items.push(item);
    }
  }
  public static getData(items: Array<ItemValue>): any {
    var result = [];
    for (var i = 0; i < items.length; i++) {
      result.push(items[i].getData());
    }
    return result;
  }
  public static getItemByValue(items: Array<ItemValue>, val: any): ItemValue {
    if (!Array.isArray(items)) return null;
    const valIsEmpty = Helpers.isValueEmpty(val);
    for (var i = 0; i < items.length; i++) {
      if (valIsEmpty && Helpers.isValueEmpty(items[i].value)) return items[i];
      if (Helpers.isTwoValueEquals(items[i].value, val, false, true, false)) return items[i];
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
      items[i].locStrsChanged();
    }
  }
  public static runConditionsForItems(
    items: Array<ItemValue>,
    filteredItems: Array<ItemValue>,
    runner: ConditionRunner,
    values: any,
    properties: any,
    useItemExpression: boolean = true,
    onItemCallBack?: (item: ItemValue, val: boolean) => boolean
  ): boolean {
    return ItemValue.runConditionsForItemsCore(
      items,
      filteredItems,
      runner,
      values,
      properties,
      true,
      useItemExpression,
      onItemCallBack
    );
  }
  public static runEnabledConditionsForItems(
    items: Array<ItemValue>,
    runner: ConditionRunner,
    values: any,
    properties: any,
    onItemCallBack?: (item: ItemValue, val: boolean) => boolean
  ): boolean {
    return ItemValue.runConditionsForItemsCore(
      items,
      null,
      runner,
      values,
      properties,
      false,
      true,
      onItemCallBack
    );
  }
  private static runConditionsForItemsCore(
    items: Array<ItemValue>,
    filteredItems: Array<ItemValue>,
    runner: ConditionRunner,
    values: any,
    properties: any,
    isVisible: boolean,
    useItemExpression: boolean = true,
    onItemCallBack?: (item: ItemValue, val: boolean) => boolean
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
      var itemRunner =
        useItemExpression && !!item.getConditionRunner
          ? item.getConditionRunner(isVisible)
          : false;
      if (!itemRunner) {
        itemRunner = runner;
      }
      var newValue = true;
      if (itemRunner) {
        newValue = itemRunner.run(values, properties);
      }
      if (!!onItemCallBack) {
        newValue = onItemCallBack(item, newValue);
      }
      if (!!filteredItems && newValue) {
        filteredItems.push(item);
      }
      var oldValue = isVisible ? item.isVisible : item.isEnabled;
      if (newValue != oldValue) {
        hasChanded = true;
        if (isVisible) {
          if (!!item.setIsVisible) item.setIsVisible(newValue);
        } else {
          if (!!item.setIsEnabled) item.setIsEnabled(newValue);
        }
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
  public ownerPropertyName: string = "";
  //private itemValue: any;
  @property({ defaultValue: true }) private _visible: boolean;
  private locTextValue: LocalizableString;
  private visibleConditionRunner: ConditionRunner;
  private enableConditionRunner: ConditionRunner;

  constructor(
    value: any,
    text: string = null,
    protected typeName = "itemvalue"
  ) {
    super();
    this.locTextValue = new LocalizableString(this, true, "text");
    this.locTextValue.onStrChanged = (oldValue: string, newValue: string) => {
      if (newValue == this.value) {
        newValue = undefined;
      }
      this.propertyValueChanged("text", oldValue, newValue);
    };
    this.locTextValue.onGetTextCallback = (txt) => {
      return txt
        ? txt
        : !Helpers.isValueEmpty(this.value)
          ? this.value.toString()
          : null;
    };
    if (text) this.locText.text = text;
    if (!!value && typeof value === "object") {
      this.setData(value);
    } else {
      this.value = value;
    }
    if (this.getType() != "itemvalue") {
      CustomPropertiesCollection.createProperties(this);
    }
    this.data = this;
    this.onCreating();
  }

  public onCreating(): any { }
  public getType(): string {
    return !!this.typeName ? this.typeName : "itemvalue";
  }
  public getSurvey(live: boolean = false): ISurvey {
    return !!this.locOwner && !!(<any>this.locOwner)["getSurvey"]
      ? (<any>this.locOwner).getSurvey()
      : null;
  }
  public getLocale(): string {
    return !!this.locOwner && this.locOwner.getLocale ? this.locOwner.getLocale() : "";
  }
  public isGhost: boolean;
  protected get isInternal(): boolean {
    return this.isGhost === true;
  }
  public get locText(): LocalizableString {
    return this.locTextValue;
  }
  setLocText(locText: LocalizableString) {
    this.locTextValue = locText;
  }
  private _locOwner: ILocalizableOwner;

  public get locOwner(): ILocalizableOwner {
    return this._locOwner;
  }
  public set locOwner(value: ILocalizableOwner) {
    this._locOwner = value;
  }

  public get value(): any {
    return this.getPropertyValue("value");
  }
  public set value(newValue: any) {
    var text: string = undefined;
    if (!Helpers.isValueEmpty(newValue)) {
      var str: string = newValue.toString();
      var index = str.indexOf(settings.itemValueSeparator);
      if (index > -1) {
        newValue = str.slice(0, index);
        text = str.slice(index + 1);
      }
    }
    this.setPropertyValue("value", newValue);
    if (!!text) {
      this.text = text;
    }
    this.id = this.value;
  }
  public get hasText(): boolean {
    return this.locText.pureText ? true : false;
  }
  public get pureText(): string {
    return this.locText.pureText;
  }
  public set pureText(val: string) {
    this.text = val;
  }
  public get text(): string {
    return this.locText.calculatedText; //TODO: it will be correct to use this.locText.text, however it would require a lot of rewriting in Creator
  }
  public set text(newText: string) {
    this.locText.text = newText;
  }
  public get calculatedText() {
    return this.locText.calculatedText;
  }
  public get shortcutText(): string {
    return this.text;
  }
  private canSerializeValue(): boolean {
    const val = this.value;
    if(val === undefined || val === null) return false;
    return !Array.isArray(val) && typeof val !== "object";
  }
  public getData(): any {
    var json = this.toJSON();
    if (!!json["value"] && !!json["value"]["pos"]) {
      delete json["value"]["pos"];
    }
    if (Helpers.isValueEmpty(json.value)) return json;
    const canSerializeVal = this.canSerializeValue();
    const canSerializeAsContant = !canSerializeVal || !settings.serialization.itemValueSerializeAsObject && !settings.serialization.itemValueSerializeDisplayText;
    if (canSerializeAsContant && Object.keys(json).length == 1)
      return this.value;
    if (settings.serialization.itemValueSerializeDisplayText && json.text === undefined && canSerializeVal) {
      json.text = this.value.toString();
    }
    return json;
  }
  public toJSON(): any {
    var res = {};
    var properties = Serializer.getProperties(this.getType());
    if (!properties || properties.length == 0) {
      properties = Serializer.getProperties("itemvalue");
    }
    var jsoObj = new JsonObject();
    for (var i = 0; i < properties.length; i++) {
      const prop = properties[i];
      if (prop.name === "text" && !this.locText.hasNonDefaultText() &&
        Helpers.isTwoValueEquals(this.value, this.text, false, true, false)) continue;
      jsoObj.valueToJson(this, res, prop);
    }
    return res;
  }
  public setData(value: any): void {
    if (Helpers.isValueEmpty(value)) return;
    if(typeof value.value === "undefined" && typeof value.text !== "undefined" && Object.keys(value).length === 1) {
      value.value = value.text;
    }
    if (typeof value.value !== "undefined") {
      let json;
      if (typeof value.toJSON === "function") {
        json = (<Base>value).toJSON();
      } else {
        json = value;
      }
      new JsonObject().toObject(json, this);
    } else {
      this.value = value;
    }
    this.locText.strChanged();
  }
  public get visibleIf(): string {
    return this.getPropertyValueWithoutDefault("visibleIf") || "";
  }
  public set visibleIf(val: string) {
    this.setPropertyValue("visibleIf", val);
  }
  public get enableIf(): string {
    return this.getPropertyValueWithoutDefault("enableIf") || "";
  }
  public set enableIf(val: string) {
    this.setPropertyValue("enableIf", val);
  }
  public get isVisible(): boolean {
    const res = this.getPropertyValueWithoutDefault("isVisible");
    return res !== undefined ? res : true;
  }
  public setIsVisible(val: boolean): void {
    this.setPropertyValue("isVisible", val);
  }
  public get isEnabled(): boolean {
    const res = this.getPropertyValueWithoutDefault("isEnabled");
    return res !== undefined ? res : true;
  }
  public setIsEnabled(val: boolean): void {
    this.setPropertyValue("isEnabled", val);
  }
  public addUsedLocales(locales: Array<string>): void {
    this.AddLocStringToUsedLocales(this.locTextValue, locales);
  }
  public locStrsChanged(): void {
    super.locStrsChanged();
    this.locText.strChanged();
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any) {
    if (name === "value" && !this.hasText) {
      this.locText.strChanged();
    }
    var funcName = "itemValuePropertyChanged";
    if (!this.locOwner || !(<any>this.locOwner)[funcName]) return;
    (<any>this.locOwner)[funcName](this, name, oldValue, newValue);
  }
  protected getConditionRunner(isVisible: boolean) {
    if (isVisible) return this.getVisibleConditionRunner();
    return this.getEnableConditionRunner();
  }
  private getVisibleConditionRunner(): ConditionRunner {
    if (!this.visibleIf) return null;
    if (!this.visibleConditionRunner)
      this.visibleConditionRunner = new ConditionRunner(this.visibleIf);
    this.visibleConditionRunner.expression = this.visibleIf;
    return this.visibleConditionRunner;
  }
  private getEnableConditionRunner(): ConditionRunner {
    if (!this.enableIf) return null;
    if (!this.enableConditionRunner)
      this.enableConditionRunner = new ConditionRunner(this.enableIf);
    this.enableConditionRunner.expression = this.enableIf;
    return this.enableConditionRunner;
  }
  public originalItem: any;

  //base action
  @property() selectedValue: boolean;
  public get selected(): boolean {
    const locOwner = this._locOwner;
    if(locOwner instanceof Question && locOwner.isItemSelected && this.selectedValue === undefined) {
      this.selectedValue = <boolean><unknown>(new ComputedUpdater<boolean>(() => locOwner.isItemSelected(this)));
    }
    return this.selectedValue;
  }
  private componentValue: string;
  public getComponent(): string {
    if(this._locOwner instanceof Question) {
      return this.componentValue || this._locOwner.itemComponent;
    }
    return this.componentValue;
  }
  public setComponent(val: string): void {
    this.componentValue = val;
  }

  protected getEnabled(): boolean {
    return this.isEnabled;
  }
  protected setEnabled(val: boolean): void {
    this.setIsEnabled(val);
  }
  protected getVisible(): boolean {
    const isVisible = this.isVisible === undefined ? true : this.isVisible;
    const visible = this._visible === undefined ? true : this._visible;
    return isVisible && visible;
  }
  protected setVisible(val: boolean): void {
    this._visible = val;
  }
  protected getLocTitle(): LocalizableString {
    return this.locText;
  }
  protected getTitle(): string {
    return this.text;
  }
  protected setLocTitle(val: LocalizableString): void {}
  protected setTitle(val: string): void {}

  @property() icon: string;
}

Base.createItemValue = function (source: any, type?: string): any {
  var item = null;
  if (!!type) {
    item = JsonObject.metaData.createClass(type, {});
  } else if (typeof source.getType === "function") {
    item = new ItemValue(null, undefined, source.getType());
  } else {
    item = new ItemValue(null);
  }
  item.setData(source);
  return item;
};
Base.itemValueLocStrChanged = function (arr: Array<any>): void {
  ItemValue.locStrsChanged(arr);
};

JsonObjectProperty.getItemValuesDefaultValue = (val: any, type: string): Array<ItemValue> => {
  const res = new Array<ItemValue>();
  ItemValue.setData(res, Array.isArray(val) ? val : [], type);
  return res;
};

Serializer.addClass(
  "itemvalue",
  [
    { name: "!value", isUnique: true },
    {
      name: "text",
      serializationProperty: "locText",
    },
    { name: "visibleIf:condition", showMode: "form" },
    {
      name: "enableIf:condition",
      showMode: "form",
      visibleIf: (obj: ItemValue): boolean => {
        return !obj || obj.ownerPropertyName !== "rateValues";
      },
    }
  ],
  (value: any) => new ItemValue(value)
);