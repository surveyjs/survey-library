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
import { IObjectValueContext, IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo, IValueGetterItem, PropertyGetterContext } from "./conditionProcessValue";

export class ItemValueGetterContext implements IValueGetterContext {
  constructor (protected item: ItemValue) {}
  public getObj(): Base { return this.item; }
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    const name = path.length > 0 ? path[0].name.toLocaleLowerCase() : "";
    const expVar = settings.expressionVariables;
    const isItemVar = [expVar.item, expVar.choice, expVar.self].indexOf(name) > -1;
    if (path.length === 1 && isItemVar) {
      return { isFound: true, value: this.item.value, context: this };
    }
    if (params.isProperty && path.length > 1 && isItemVar) {
      params.path = path.slice(1);
      return new PropertyGetterContext(this.item).getValue(params);
    }
    const owner: any = this.item.locOwner;
    if (owner && owner.getValueGetterContext) {
      return owner.getValueGetterContext().getValue(params);
    }
    return undefined;
  }
  getRootObj(): IObjectValueContext {
    const owner: any = this.item.locOwner;
    if (owner && owner.getValueGetterContext) return owner;
    return <any>this.item.getSurvey();
  }
  getTextValue(name: string, value: any, isDisplayValue: boolean): string {
    if (isDisplayValue && value === this.item.value) return this.item.textOrHtml;
    return value !== undefined && value !== null ? value.toString() : "";
  }
}

/**
 * Array of ItemValue is used in checkbox, dropdown and radiogroup choices, matrix columns and rows.
 * It has two main properties: value and text. If text is empty, value is used for displaying.
 * The text property is localizable and support markdown.
 */
export class ItemValue extends BaseAction implements ILocalizableOwner, IShortcutText {
  [index: string]: any;

  public getMarkdownHtml(text: string, name: string, item?: any): string {
    return !!this.locOwner ? this.locOwner.getMarkdownHtml(text, name, item || this) : undefined;
  }
  public getRenderer(name: string): string {
    return !!this.locOwner ? this.locOwner.getRenderer(name, this) : null;
  }
  public getRendererContext(locStr: LocalizableString): any {
    return !!this.locOwner ? this.locOwner.getRendererContext(locStr, this) : locStr;
  }
  public getProcessedText(text: string): string {
    return this.locOwner ? this.locOwner.getProcessedText(text, this) : text;
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
      if (!!value.data) {
        item.data = value.data;
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
    return item !== null ? item.textOrHtml : "";
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
    properties: any,
    useItemExpression: boolean = true,
    onItemCallBack?: (item: ItemValue, val: boolean) => boolean
  ): boolean {
    return ItemValue.runConditionsForItemsCore(
      items,
      filteredItems,
      runner,
      properties,
      true,
      useItemExpression,
      onItemCallBack
    );
  }
  public static runEnabledConditionsForItems(
    items: Array<ItemValue>,
    runner: ConditionRunner,
    properties: any,
    onItemCallBack?: (item: ItemValue, val: boolean) => boolean
  ): boolean {
    return ItemValue.runConditionsForItemsCore(
      items,
      null,
      runner,
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
    properties: any,
    isVisible: boolean,
    useItemExpression: boolean = true,
    onItemCallBack?: (item: ItemValue, val: boolean) => boolean
  ): boolean {
    var hasChanded = false;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var itemRunner =
        useItemExpression && !!item.getConditionRunner
          ? item.getConditionRunner(isVisible)
          : false;
      if (!itemRunner) {
        itemRunner = runner;
      }
      var newValue = true;
      if (itemRunner) {
        newValue = itemRunner.runContext(item.getValueGetterContext(), properties);
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
    return hasChanded;
  }
  public ownerPropertyName: string = "";
  private locTextValue: LocalizableString;
  private visibleConditionRunner: ConditionRunner;
  private enableConditionRunner: ConditionRunner;

  constructor(value: any, text?: string, protected typeName?: string) {
    super();
    if (text)this.locText.text = text;
    if (!!value && typeof value === "object") {
      this.setData(value, true);
    } else {
      this.setValue(value, true);
    }
    if (this.getType() != this.getBaseType()) {
      CustomPropertiesCollection.createProperties(this);
    }
    this.onCreating();
  }

  public onCreating(): any { }
  public getType(): string {
    return this.typeName || this.getBaseType();
  }
  protected getBaseType(): string { return "itemvalue"; }
  public getSurvey(live: boolean = false): ISurvey {
    return !!this.locOwner && !!(<any>this.locOwner)["getSurvey"]
      ? (<any>this.locOwner).getSurvey()
      : null;
  }
  public getLocale(): string {
    return !!this.locOwner && this.locOwner.getLocale ? this.locOwner.getLocale() : "";
  }
  public getLocalizableString(name: string): LocalizableString {
    if (name === "text") return this.locText;
    return super.getLocalizableString(name);
  }
  public getValueGetterContext(): IValueGetterContext {
    return new ItemValueGetterContext(this);
  }
  public isGhost: boolean;
  protected get isInternal(): boolean {
    return this.isGhost === true;
  }
  private createLocText(): LocalizableString {
    const res = new LocalizableString(this, true, "text");
    res.onStrChanged = (oldValue: string, newValue: string) => {
      this.propertyValueChanged("text", oldValue, newValue);
    };
    res.onGetTextCallback = (txt) => {
      return this.onGetText(txt);
    };
    return res;
  }
  protected onGetText(text:string):string {
    return text || this.getValueText();
  }
  private getValueText(): string {
    const val = this.value;
    return !Helpers.isValueEmpty(val) ? val.toString() : null;
  }
  public get locText(): LocalizableString {
    return this.getLocText();
  }
  protected getLocText(): LocalizableString {

    if (!this.locTextValue) {
      this.locTextValue = this.createLocText();
    }
    return this.locTextValue;
  }
  setLocText(locText: LocalizableString): void {
    this.locTextValue = locText;
  }
  private _locOwner: ILocalizableOwner;

  public get locOwner(): ILocalizableOwner {
    return this._locOwner;
  }
  public set locOwner(value: ILocalizableOwner) {
    this._locOwner = value;
    this.onLocOwnerChanged();
  }
  protected onLocOwnerChanged(): void {}
  public get value(): any {
    return this.getPropertyValue("value");
  }
  public set value(newValue: any) {
    this.setValue(newValue, false);
  }
  private setValue(newValue: any, newItem: boolean): void {
    let text: string = undefined;
    newValue = this.getCorrectValue(newValue);
    const sep = settings.itemValueSeparator;
    if (!!sep && !Helpers.isValueEmpty(newValue)) {
      var str: string = newValue.toString();
      var index = str.indexOf(sep);
      if (index > -1) {
        newValue = str.slice(0, index);
        text = str.slice(index + 1);
      }
    }
    if (newItem) {
      this.setPropertyValueDirectly("value", newValue);
    } else {
      this.setPropertyValue("value", newValue);
    }
    if (!!text) {
      this.text = text;
    }
    this.id = this.value;
  }
  protected getCorrectValue(value: any): any {
    return value;
  }
  public get hasText(): boolean {
    return this.pureText ? true : false;
  }
  public get pureText(): string {
    return this.locTextValue?.pureText || "";
  }
  public set pureText(val: string) {
    this.text = val;
  }
  public get text(): string {
    return this.calculatedText; //TODO: it will be correct to use this.locText.text, however it would require a lot of rewriting in Creator
  }
  public set text(newText: string) {
    this.locText.text = newText;
  }
  public get textOrHtml(): string {
    if (this.locTextValue) return this.locText.textOrHtml;
    return this.getValueText();
  }
  public get calculatedText(): string {
    if (this.locTextValue) return this.locText.calculatedText;
    return this.getValueText();
  }
  public get shortcutText(): string {
    return this.text;
  }
  private canSerializeValue(): boolean {
    const val = this.value;
    if (val === undefined || val === null) return false;
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
      properties = Serializer.getProperties(this.getBaseType());
    }
    var jsoObj = new JsonObject();
    for (var i = 0; i < properties.length; i++) {
      const prop = properties[i];
      if (this.canAddPpropertyToJSON(prop)) {
        jsoObj.valueToJson(this, res, prop);
      }
    }
    return res;
  }
  protected canAddPpropertyToJSON(prop: JsonObjectProperty): boolean {
    if (prop.name === "text" && (!this.locTextValue || !this.locTextValue.hasNonDefaultText() &&
      Helpers.isTwoValueEquals(this.value, this.locTextValue.getLocaleText(""), false, true, false))) {
      return false;
    }
    return true;
  }
  public setData(value: any, isNewItem?: boolean): void {
    if (Helpers.isValueEmpty(value)) return;
    if (typeof value.value === "undefined" && typeof value.text !== "undefined" && Object.keys(value).length === 1) {
      value.value = value.text;
    }
    if (typeof value.value !== "undefined") {
      let json;
      if (typeof value.toJSON === "function") {
        json = (<Base>value).toJSON();
      } else {
        if (Array.isArray(value.elements)) {
          json = {};
          for (var key in value) {
            if (key !== "elements") {
              json[key] = value[key];
            }
          }
        } else {
          json = value;
        }
      }
      new JsonObject().toObject(json, this);
    } else {
      this.setValue(value, isNewItem);
    }
    if (!isNewItem) {
      this.locTextValue?.strChanged();
    }
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
    if (this.locTextValue) {
      this.AddLocStringToUsedLocales(this.locTextValue, locales);
    }
  }
  public locStrsChanged(): void {
    super.locStrsChanged();
    this.locTextValue?.strChanged();
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    if (name === "value" && !this.hasText) {
      this.locTextValue?.strChanged();
    }
    var funcName = "itemValuePropertyChanged";
    if (!this.locOwner || !(<any>this.locOwner)[funcName]) return;
    (<any>this.locOwner)[funcName](this, name, oldValue, newValue);
  }
  protected getConditionRunner(isVisible: boolean): ConditionRunner {
    if (isVisible) return this.getVisibleConditionRunner();
    return this.getEnableConditionRunner();
  }
  private getVisibleConditionRunner(): ConditionRunner {
    const expression = this.getExpressionFromSurvey("visibleIf");
    if (!expression) return null;
    if (!this.visibleConditionRunner)
      this.visibleConditionRunner = new ConditionRunner(expression);
    this.visibleConditionRunner.expression = expression;
    return this.visibleConditionRunner;
  }
  private getEnableConditionRunner(): ConditionRunner {
    const expression = this.getExpressionFromSurvey("enableIf");
    if (!expression) return null;
    if (!this.enableConditionRunner)
      this.enableConditionRunner = new ConditionRunner(expression);
    this.enableConditionRunner.expression = expression;
    return this.enableConditionRunner;
  }
  public originalItem: any;

  //base action
  @property() selectedValue: boolean;
  public get selected(): boolean {
    const locOwner = this._locOwner;
    if (locOwner instanceof Question && locOwner.isItemSelected && this.selectedValue === undefined) {
      this.selectedValue = <boolean><unknown>(new ComputedUpdater<boolean>(() => locOwner.isItemSelected(this)));
    }
    return this.selectedValue;
  }
  private componentValue: string;
  public getComponent(): string {
    if (this._locOwner instanceof Question) {
      return this.componentValue || this._locOwner.itemComponent;
    }
    return this.componentValue;
  }
  public setComponent(val: string): void {
    this.componentValue = val;
  }
  private _htmlElement: HTMLElement;
  public setRootElement(val: HTMLElement): void {
    this._htmlElement = val;
  }
  public getRootElement(): HTMLElement {
    return this._htmlElement;
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
    if (this.visible !== val) {
      this._visible = val;
    }
  }
  private get _visible(): boolean { return this.getPropertyValue("visible", true); }
  private set _visible(val: boolean) { this.setPropertyValue("visible", val); }

  protected getLocTitle(): LocalizableString {
    return this.locText;
  }
  protected getTitle(): string {
    return this.text;
  }
  protected setLocTitle(val: LocalizableString): void {}
  protected setTitle(val: string): void {}
  public get icon(): string { return this.getPropertyValue("icon", ""); }
  public set icon(val: string) { this.setPropertyValue("icon", val); }
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
    { name: "visibleIf:condition", locationInTable: "detail" },
    {
      name: "enableIf:condition", locationInTable: "detail",
      visibleIf: (obj: ItemValue): boolean => {
        return !obj || obj.ownerPropertyName !== "rateValues";
      },
    }
  ],
  (value: any) => new ItemValue(value)
);