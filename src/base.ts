import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { HashTable, Helpers } from "./helpers";
import {
  CustomPropertiesCollection,
  JsonObject,
  Serializer,
} from "./jsonobject";
import { settings } from "./settings";
import { ItemValue } from "./itemvalue";

export interface ISurveyData {
  getValue(name: string): any;
  setValue(
    name: string,
    newValue: any,
    locNotification: any,
    allowNotifyValueChanged?: boolean
  ): any;
  getVariable(name: string): any;
  setVariable(name: string, newValue: any): void;
  getComment(name: string): string;
  setComment(name: string, newValue: string, locNotification: any): any;
  getAllValues(): any;
  getFilteredValues(): any;
  getFilteredProperties(): any;
}
export interface ITextProcessor {
  processText(text: string, returnDisplayValue: boolean): string;
  processTextEx(
    text: string,
    returnDisplayValue: boolean,
    doEncoding: boolean
  ): any;
}
export interface ISurveyErrorOwner extends ILocalizableOwner {
  getErrorCustomText(text: string, error: SurveyError): string;
}

export interface ISurvey extends ITextProcessor, ISurveyErrorOwner {
  currentPage: IPage;
  pages: Array<IPage>;
  getCss(): any;
  isPageStarted(page: IPage): boolean;
  pageVisibilityChanged(page: IPage, newValue: boolean): any;
  panelVisibilityChanged(panel: IPanel, newValue: boolean): any;
  questionVisibilityChanged(question: IQuestion, newValue: boolean): any;
  questionsOrder: string;
  questionCreated(question: IQuestion): any;
  questionAdded(
    question: IQuestion,
    index: number,
    parentPanel: any,
    rootPanel: any
  ): any;
  panelAdded(
    panel: IElement,
    index: number,
    parentPanel: any,
    rootPanel: any
  ): any;
  questionRemoved(question: IQuestion): any;
  panelRemoved(panel: IElement): any;
  questionRenamed(
    question: IQuestion,
    oldName: string,
    oldValueName: string
  ): any;
  validateQuestion(question: IQuestion): SurveyError;
  validatePanel(panel: IPanel): SurveyError;
  hasVisibleQuestionByValueName(valueName: string): boolean;
  questionCountByValueName(valueName: string): number;
  processHtml(html: string): string;
  getSurveyMarkdownHtml(element: Base, text: string): string;
  isDisplayMode: boolean;
  isDesignMode: boolean;
  areInvisibleElementsShowing: boolean;
  areEmptyElementsHidden: boolean;
  isLoadingFromJson: boolean;
  isUpdateValueTextOnTyping: boolean;

  state: string;
  cancelPreviewByPage(panel: IPanel): any;

  requiredText: string;
  beforeSettingQuestionErrors(
    question: IQuestion,
    errors: Array<SurveyError>
  ): void;
  questionTitlePattern: string;
  getUpdatedQuestionTitle(question: IQuestion, title: string): string;

  questionStartIndex: string;
  questionTitleLocation: string;
  questionDescriptionLocation: string;
  questionErrorLocation: string;
  storeOthersAsComment: boolean;

  maxTextLength: number;
  maxOthersLength: number;
  clearValueOnDisableItems: boolean;

  uploadFiles(
    question: IQuestion,
    name: string,
    files: File[],
    uploadingCallback: (status: string, data: any) => any
  ): any;
  downloadFile(
    name: string,
    content: string,
    callback: (status: string, data: any) => any
  ): any;
  clearFiles(
    name: string,
    value: any,
    fileName: string,
    clearCallback: (status: string, data: any) => any
  ): any;
  updateChoicesFromServer(
    question: IQuestion,
    choices: Array<any>,
    serverResult: any
  ): Array<any>;
  updateQuestionCssClasses(question: IQuestion, cssClasses: any): any;
  updatePanelCssClasses(panel: IPanel, cssClasses: any): any;
  updatePageCssClasses(panel: IPanel, cssClasses: any): any;
  afterRenderQuestion(question: IQuestion, htmlElement: any): any;
  afterRenderQuestionInput(question: IQuestion, htmlElement: any): any;
  afterRenderPanel(panel: IElement, htmlElement: any): any;
  afterRenderPage(htmlElement: any): any;

  getQuestionByValueNameFromArray(
    valueName: string,
    name: string,
    index: number
  ): IQuestion;
  matrixRowAdded(question: IQuestion, row: any): any;
  matrixBeforeRowAdded(options: {
    question: IQuestion;
    canAddRow: boolean;
  }): any;
  matrixRowRemoved(question: IQuestion, rowIndex: number, row: any): any;
  matrixAllowRemoveRow(
    question: IQuestion,
    rowIndex: number,
    row: any
  ): boolean;
  matrixCellCreated(question: IQuestion, options: any): any;
  matrixAfterCellRender(question: IQuestion, options: any): any;
  matrixCellValueChanged(question: IQuestion, options: any): any;
  matrixCellValueChanging(question: IQuestion, options: any): any;
  matrixCellValidate(question: IQuestion, options: any): SurveyError;
  dynamicPanelAdded(question: IQuestion): any;
  dynamicPanelRemoved(
    question: IQuestion,
    panelIndex: number,
    panel: IPanel
  ): any;
  dynamicPanelItemValueChanged(question: IQuestion, options: any): any;

  dragAndDropAllow(options: any): boolean;

  scrollElementToTop(
    element: ISurveyElement,
    question: IQuestion,
    page: IPage,
    id: string
  ): any;
}
export interface ISurveyImpl {
  geSurveyData(): ISurveyData;
  getSurvey(): ISurvey;
  getTextProcessor(): ITextProcessor;
}
export interface IConditionRunner {
  runCondition(values: HashTable<any>, properties: HashTable<any>): any;
}
export interface ISurveyElement {
  name: string;
  isVisible: boolean;
  isReadOnly: boolean;
  isPage: boolean;
  isPanel: boolean;
  containsErrors: boolean;
  setSurveyImpl(value: ISurveyImpl): any;
  onSurveyLoad(): any;
  onFirstRendering(): any;
  getType(): string;
  setVisibleIndex(value: number): number;
  locStrsChanged(): any;
  delete(): any;
}
export interface IElement extends IConditionRunner, ISurveyElement {
  visible: boolean;
  parent: IPanel;
  renderWidth: string;
  width: string;
  minWidth?: string;
  maxWidth?: string;
  rightIndent: number;
  startWithNewLine: boolean;
  getPanel(): IPanel;
  getLayoutType(): string;
  isLayoutTypeSupported(layoutType: string): boolean;
  removeElement(el: IElement): boolean;
  onAnyValueChanged(name: string): any;
  updateCustomWidgets(): any;
  clearIncorrectValues(): any;
  clearErrors(): any;
  dispose(): void;
}

export interface IQuestion extends IElement, ISurveyErrorOwner {
  hasTitle: boolean;
  isEmpty(): boolean;
  onSurveyValueChanged(newValue: any): any;
  updateValueFromSurvey(newValue: any): any;
  updateCommentFromSurvey(newValue: any): any;
  supportGoNextPageAutomatic(): boolean;
  clearUnusedValues(): any;
  getDisplayValue(keysAsText: boolean, value: any): any;
  getValueName(): string;
  clearValue(): any;
  clearValueIfInvisible(): any;
  isAnswerCorrect(): boolean;
  updateValueWithDefaults(): any;
  getQuestionFromArray(name: string, index: number): IQuestion;
  value: any;
  survey: any;
}
export interface IParentElement {
  addElement(element: IElement, index: number): any;
  removeElement(element: IElement): boolean;
  isReadOnly: boolean;
}

export interface IPanel extends ISurveyElement, IParentElement {
  getChildrenLayoutType(): string;
  getQuestionTitleLocation(): string;
  getQuestionStartIndex(): string;
  parent: IPanel;
  elementWidthChanged(el: IElement): any;
  indexOf(el: IElement): number;
  elements: Array<IElement>;
}
export interface IPage extends IPanel, IConditionRunner {
  isStarted: boolean;
}
/**
 * The base class for SurveyJS objects.
 */
export class Base {
  public static get commentPrefix(): string {
    return settings.commentPrefix;
  }
  public static set commentPrefix(val: string) {
    settings.commentPrefix = val;
  }
  public static createItemValue: (item: any, type?: string) => any;
  public static itemValueLocStrChanged: (arr: Array<any>) => void;
  /**
   * A static methods that returns true if a value underfined, null, empty string or empty array.
   * @param value
   */
  public isValueEmpty(value: any): boolean {
    return Helpers.isValueEmpty(value);
  }
  protected IsPropertyEmpty(value: any): boolean {
    return value !== "" && this.isValueEmpty(value);
  }

  private propertyHash: { [index: string]: any } = {};
  private localizableStrings: { [index: string]: LocalizableString };
  private arraysInfo: { [index: string]: any };
  private onPropChangeFunctions: Array<{
    name: string;
    func: (...args: any[]) => void;
    key: string;
  }>;
  protected isLoadingFromJsonValue: boolean = false;
  public loadingOwner: Base = null;
  /**
   * Event that raise on property change of the sender object
   * sender - the object that owns the property
   * options.name - the property name that has been changed
   * options.oldValue - old value. Please note, it equals to options.newValue if property is an array
   * options.newValue - new value.
   */
  public onPropertyChanged: Event<
    (sender: Base, options: any) => any,
    any
  > = new Event<(sender: Base, options: any) => any, any>();
  /**
   * Event that raised on changing property of the ItemValue object.
   * sender - the object that owns the property
   * options.propertyName - the property name to which ItemValue array is belong. It can be "choices" for dropdown question
   * options.obj - the instance of ItemValue object which property has been changed
   * options.name - the property of ItemObject that has been changed
   * options.oldValue - old value
   * options.newValue - new value
   */
  public onItemValuePropertyChanged: Event<
    (sender: Base, options: any) => any,
    any
  > = new Event<(sender: Base, options: any) => any, any>();

  getPropertyValueCoreHandler: (propertiesHash: any, name: string) => any;

  setPropertyValueCoreHandler: (
    propertiesHash: any,
    name: string,
    val: any
  ) => void;
  createArrayCoreHandler: (propertiesHash: any, name: string) => Array<any>;

  public constructor() {
    CustomPropertiesCollection.createProperties(this);
    this.onBaseCreating();
  }
  protected onBaseCreating() {}
  /**
   * Returns the type of the object as a string as it represents in the json. It should be in lowcase.
   */
  public getType(): string {
    return "base";
  }
  /**
   * Returns the element template name without prefix. Typically it equals to getType().
   * @see getType
   */
  public getTemplate(): string {
    return this.getType();
  }
  /**
   * Returns true if the object is loading from Json at the current moment.
   */
  public get isLoadingFromJson(): boolean {
    return this.getIsLoadingFromJson();
  }
  protected getIsLoadingFromJson(): boolean {
    if (!!this.loadingOwner && this.loadingOwner.isLoadingFromJson) return true;
    return this.isLoadingFromJsonValue;
  }

  startLoadingFromJson() {
    this.isLoadingFromJsonValue = true;
  }
  endLoadingFromJson() {
    this.isLoadingFromJsonValue = false;
  }
  /**
   * Deserialized the current object into JSON
   * @see fromJSON
   */
  public toJSON(): any {
    return new JsonObject().toJsonObject(this);
  }
  /**
   * Load object properties and elements. It doesn't reset properties that was changed before and they are not defined in the json parameter.
   * @param json the object JSON definition
   * @see toJSON
   */
  public fromJSON(json: any) {
    return new JsonObject().toObject(json, this);
  }
  /**
   * Make a clone of the existing object. Create a new object of the same type and load all properties into it.
   */
  public clone(): Base {
    var clonedObj = <Base>Serializer.createClass(this.getType());
    clonedObj.fromJSON(this.toJSON());
    return clonedObj;
  }
  public locStrsChanged() {
    if (!!this.arraysInfo) {
      for (let key in this.arraysInfo) {
        let item = this.arraysInfo[key];
        if (item && item.isItemValues) {
          var arr = this.getPropertyValue(key);
          if (arr && !!Base.itemValueLocStrChanged)
            Base.itemValueLocStrChanged(arr);
        }
      }
    }
    if (!!this.localizableStrings) {
      for (let key in this.localizableStrings) {
        let item = this.getLocalizableString(key);
        if (item) item.strChanged();
      }
    }
  }
  /**
   * Returns the property value by name
   * @param name property name
   */
  public getPropertyValue(name: string, defaultValue: any = null): any {
    var res = this.getPropertyValueCore(this.propertyHash, name);
    if (this.IsPropertyEmpty(res)) {
      if (defaultValue != null) return defaultValue;
      var prop = Serializer.findProperty(this.getType(), name);
      var serValue = !!prop && !prop.isCustom ? prop.defaultValue : null;
      if (!this.IsPropertyEmpty(serValue)) return serValue;
    }
    return res;
  }
  protected getPropertyValueCore(propertiesHash: any, name: string) {
    if (this.getPropertyValueCoreHandler)
      return this.getPropertyValueCoreHandler(propertiesHash, name);
    else return propertiesHash[name];
  }
  public geValueFromHash(): any {
    return this.propertyHash["value"];
  }
  protected setPropertyValueCore(propertiesHash: any, name: string, val: any) {
    if (this.setPropertyValueCoreHandler)
      this.setPropertyValueCoreHandler(propertiesHash, name, val);
    else propertiesHash[name] = val;
  }
  public iteratePropertiesHash(func: (hash: any, key: any) => void) {
    var keys: any[] = [];
    for (var key in this.propertyHash) {
      keys.push(key);
    }
    keys.forEach((key) => func(this.propertyHash, key));
  }
  /**
   * set property value
   * @param name property name
   * @param val new property value
   */
  public setPropertyValue(name: string, val: any) {
    var oldValue = this.getPropertyValue(name);
    if (oldValue && Array.isArray(oldValue)) {
      if (this.isTwoValueEquals(oldValue, val)) return;
      var arrayInfo = this.arraysInfo[name];
      this.setArray(
        name,
        oldValue,
        val,
        arrayInfo ? arrayInfo.isItemValues : false,
        arrayInfo ? arrayInfo.onPush : null
      );
      //this.propertyValueChanged(name, oldValue, oldValue);
    } else {
      this.setPropertyValueCore(this.propertyHash, name, val);
      if (!this.isTwoValueEquals(oldValue, val)) {
        this.propertyValueChanged(name, oldValue, val);
      }
    }
  }
  public onPropertyValueChangedCallback(
    name: string,
    oldValue: any,
    newValue: any,
    sender: Base,
    arrayChanges: ArrayChanges
  ) {}
  public itemValuePropertyChanged(
    item: ItemValue,
    name: string,
    oldValue: any,
    newValue: any
  ) {
    this.onItemValuePropertyChanged.fire(this, {
      obj: item,
      name: name,
      oldValue: oldValue,
      newValue: newValue,
      propertyName: item.ownerPropertyName,
    });
  }
  protected onPropertyValueChanged(
    name: string,
    oldValue: any,
    newValue: any
  ) {}
  protected propertyValueChanged(
    name: string,
    oldValue: any,
    newValue: any,
    arrayChanges?: ArrayChanges,
    target?: Base
  ) {
    if (this.isLoadingFromJson) return;
    this.onPropertyValueChanged(name, oldValue, newValue);
    this.onPropertyChanged.fire(this, {
      name: name,
      oldValue: oldValue,
      newValue: newValue,
    });

    this.doPropertyValueChangedCallback &&
      this.doPropertyValueChangedCallback(
        name,
        oldValue,
        newValue,
        arrayChanges,
        this
      );

    if (!this.onPropChangeFunctions) return;
    for (var i = 0; i < this.onPropChangeFunctions.length; i++) {
      if (this.onPropChangeFunctions[i].name == name)
        this.onPropChangeFunctions[i].func(newValue);
    }
  }

  private doPropertyValueChangedCallback(
    name: string,
    oldValue: any,
    newValue: any,
    arrayChanges?: ArrayChanges,
    target?: Base
  ) {
    if (!target) target = this;
    let parentBase = this.getOwnerForPropertyChanged();
    if (!!parentBase) {
      parentBase.doPropertyValueChangedCallback(
        name,
        oldValue,
        newValue,
        arrayChanges,
        target
      );
    } else {
      this.onPropertyValueChangedCallback(
        name,
        oldValue,
        newValue,
        target,
        arrayChanges
      );
    }
  }
  private getOwnerForPropertyChanged(): Base {
    var testProps = ["colOwner", "locOwner", "survey", "owner", "errorOwner"];
    for (var i = 0; i < testProps.length; i++) {
      var prop = testProps[i];
      var testObj = (<any>this)[prop];
      if (!!testObj && !!testObj.doPropertyValueChangedCallback) return testObj;
    }
    return null;
  }

  /**
   * Register a function that will be called on a property value changed.
   * @param name the property name
   * @param func the function with no parameters that will be called on property changed.
   * @param key an optional parameter. If there is already a registered function for this property with the same key, it will be overwritten.
   */
  public registerFunctionOnPropertyValueChanged(
    name: string,
    func: any,
    key: string = null
  ) {
    if (!this.onPropChangeFunctions) {
      this.onPropChangeFunctions = [];
    }
    if (key) {
      for (var i = 0; i < this.onPropChangeFunctions.length; i++) {
        var item = this.onPropChangeFunctions[i];
        if (item.name == name && item.key == key) {
          item.func = func;
          return;
        }
      }
    }
    this.onPropChangeFunctions.push({ name: name, func: func, key: key });
  }
  /**
   * Register a function that will be called on a property value changed from the names list.
   * @param names the list of properties names
   * @param func the function with no parameters that will be called on property changed.
   * @param key an optional parameter. If there is already a registered function for this property with the same key, it will be overwritten.
   */
  public registerFunctionOnPropertiesValueChanged(
    names: Array<string>,
    func: any,
    key: string = null
  ) {
    for (var i = 0; i < names.length; i++) {
      this.registerFunctionOnPropertyValueChanged(names[i], func, key);
    }
  }
  /**
   * Unregister notification on property value changed
   * @param name the property name
   * @param key the key with which you have registered the notification for this property. It can be null.
   */
  public unRegisterFunctionOnPropertyValueChanged(
    name: string,
    key: string = null
  ) {
    if (!this.onPropChangeFunctions) return;
    for (var i = 0; i < this.onPropChangeFunctions.length; i++) {
      var item = this.onPropChangeFunctions[i];
      if (item.name == name && item.key == key) {
        this.onPropChangeFunctions.splice(i, 1);
        return;
      }
    }
  }
  /**
   * Unregister notification on property value changed for all properties in the names list.
   * @param names the list of properties names
   * @param key the key with which you have registered the notification for this property. It can be null.
   */
  public unRegisterFunctionOnPropertiesValueChanged(
    names: Array<string>,
    key: string = null
  ) {
    for (var i = 0; i < names.length; i++) {
      this.unRegisterFunctionOnPropertyValueChanged(names[i], key);
    }
  }
  public createCustomLocalizableObj(name: string) {
    var locStr = this.getLocalizableString(name);
    if (locStr || !(<any>this).getLocale) return;
    this.createLocalizableString(name, <ILocalizableOwner>(<any>this));
  }
  protected createLocalizableString(
    name: string,
    owner: ILocalizableOwner,
    useMarkDown: boolean = false
  ): LocalizableString {
    var locStr = new LocalizableString(owner, useMarkDown);
    if (!this.localizableStrings) {
      this.localizableStrings = {};
    }
    this.localizableStrings[name] = locStr;
    return locStr;
  }
  public getLocalizableString(name: string): LocalizableString {
    return !!this.localizableStrings ? this.localizableStrings[name] : null;
  }
  public getLocalizableStringText(
    name: string,
    defaultStr: string = ""
  ): string {
    var locStr = this.getLocalizableString(name);
    if (!locStr) return "";
    var res = locStr.text;
    return res ? res : defaultStr;
  }
  public setLocalizableStringText(name: string, value: string) {
    var locStr = this.getLocalizableString(name);
    if (!locStr) return;
    var oldValue = locStr.text;
    if (oldValue === value) return;
    locStr.text = value;
    this.propertyValueChanged(name, oldValue, value);
  }
  public addUsedLocales(locales: Array<string>) {
    if (!!this.localizableStrings) {
      for (let key in this.localizableStrings) {
        let item = this.getLocalizableString(key);
        if (item) this.AddLocStringToUsedLocales(item, locales);
      }
    }
    if (!!this.arraysInfo) {
      for (let key in this.arraysInfo) {
        let items = this.getPropertyValue(key);
        if (!items || !items.length) continue;
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          if (item && item.addUsedLocales) {
            item.addUsedLocales(locales);
          }
        }
      }
    }
  }
  protected AddLocStringToUsedLocales(
    locStr: LocalizableString,
    locales: Array<string>
  ) {
    var locs = locStr.getLocales();
    for (var i = 0; i < locs.length; i++) {
      if (locales.indexOf(locs[i]) < 0) {
        locales.push(locs[i]);
      }
    }
  }
  protected createItemValues(name: string): Array<any> {
    var self = this;
    var result = this.createNewArray(name, function (item: any) {
      item.locOwner = self;
      item.ownerPropertyName = name;
    });
    this.arraysInfo[name].isItemValues = true;
    return result;
  }
  private notifyArrayChanged(ar: any) {
    !!ar.onArrayChanged && ar.onArrayChanged();
  }
  protected createNewArrayCore(name: string): Array<any> {
    var res = null;
    if (!!this.createArrayCoreHandler) {
      res = this.createArrayCoreHandler(this.propertyHash, name);
    }
    if (!res) {
      res = new Array<any>();
      this.setPropertyValueCore(this.propertyHash, name, res);
    }
    return res;
  }
  protected createNewArray(
    name: string,
    onPush: any = null,
    onRemove: any = null
  ): Array<any> {
    var newArray = this.createNewArrayCore(name);
    if (!this.arraysInfo) {
      this.arraysInfo = {};
    }
    this.arraysInfo[name] = { onPush: onPush, isItemValues: false };
    var self = this;
    newArray.push = function (value): number {
      var result = Object.getPrototypeOf(newArray).push.call(newArray, value);
      if (onPush) onPush(value, newArray.length - 1);
      const arrayChanges = new ArrayChanges(
        newArray.length - 1,
        0,
        [value],
        []
      );
      self.propertyValueChanged(name, newArray, newArray, arrayChanges);
      self.notifyArrayChanged(newArray);
      return result;
    };
    newArray.unshift = function (value): number {
      var result = Object.getPrototypeOf(newArray).unshift.call(
        newArray,
        value
      );
      if (onPush) onPush(value, newArray.length - 1);
      const arrayChanges = new ArrayChanges(0, 0, [value], []);
      self.propertyValueChanged(name, newArray, newArray, arrayChanges);
      self.notifyArrayChanged(newArray);
      return result;
    };
    newArray.pop = function (): number {
      var result = Object.getPrototypeOf(newArray).pop.call(newArray);
      if (onRemove) onRemove(result);
      const arrayChanges = new ArrayChanges(newArray.length - 1, 1, [], []);
      self.propertyValueChanged(name, newArray, newArray, arrayChanges);
      self.notifyArrayChanged(newArray);
      return result;
    };
    newArray.splice = function (
      start?: number,
      deleteCount?: number,
      ...items: any[]
    ): any[] {
      if (!start) start = 0;
      if (!deleteCount) deleteCount = 0;
      var result = Object.getPrototypeOf(newArray).splice.call(
        newArray,
        start,
        deleteCount,
        ...items
      );
      if (!items) items = [];
      if (onRemove && result) {
        for (var i = 0; i < result.length; i++) {
          onRemove(result[i]);
        }
      }
      if (onPush) {
        for (var i = 0; i < items.length; i++) {
          onPush(items[i], start + i);
        }
      }

      const arrayChanges = new ArrayChanges(start, deleteCount, items, result);
      self.propertyValueChanged(name, newArray, newArray, arrayChanges);
      self.notifyArrayChanged(newArray);
      return result;
    };

    return newArray;
  }
  protected getItemValueType(): string {
    return undefined;
  }
  protected setArray(
    name: string,
    src: any[],
    dest: any[],
    isItemValues: boolean,
    onPush: any
  ) {
    var deletedItems = [].concat(src);
    Object.getPrototypeOf(src).splice.call(src, 0, src.length);
    if (!!dest) {
      for (var i = 0; i < dest.length; i++) {
        var item = dest[i];
        if (isItemValues) {
          if (!!Base.createItemValue) {
            item = Base.createItemValue(item, this.getItemValueType());
          }
        }
        Object.getPrototypeOf(src).push.call(src, item);
        if (onPush) onPush(src[i]);
      }
    }
    const arrayChanges = new ArrayChanges(
      0,
      deletedItems.length,
      src,
      deletedItems
    );
    this.propertyValueChanged(name, deletedItems, src, arrayChanges);
    this.notifyArrayChanged(src);
  }
  protected isTwoValueEquals(
    x: any,
    y: any,
    caseInSensitive: boolean = false
  ): boolean {
    if (caseInSensitive) {
      x = this.getValueInLowCase(x);
      y = this.getValueInLowCase(y);
    }
    return Helpers.isTwoValueEquals(x, y);
  }
  private static copyObject(dst: any, src: any) {
    for (var key in src) {
      var source = src[key];
      if (typeof source === "object") {
        source = {};
        this.copyObject(source, src[key]);
      }
      dst[key] = source;
    }
  }
  protected copyCssClasses(dest: any, source: any) {
    if (!source) return;
    if (typeof source === "string" || source instanceof String) {
      dest["root"] = source;
    } else {
      SurveyElement.copyObject(dest, source);
    }
  }
  private getValueInLowCase(val: any): any {
    if (!!val && typeof val == "string") return val.toLowerCase();
    return val;
  }
}

export class ArrayChanges {
  constructor(
    public index: number,
    public deleteCount: number,
    public itemsToAdd: any[],
    public deletedItems: any[]
  ) {}
}

export class SurveyError {
  private locTextValue: LocalizableString;
  public visible: boolean = true;
  constructor(
    public text: string = null,
    protected errorOwner: ISurveyErrorOwner = null
  ) {}
  public get locText() {
    if (!this.locTextValue) {
      this.locTextValue = new LocalizableString(this.errorOwner, true);
      this.locTextValue.text = this.getText();
    }
    return this.locTextValue;
  }
  public getText(): string {
    var res = this.text;
    if (!res) res = this.getDefaultText();
    if (!!this.errorOwner) {
      res = this.errorOwner.getErrorCustomText(res, this);
    }
    return res;
  }
  public getErrorType(): string {
    return "base";
  }
  protected getDefaultText(): string {
    return "";
  }
}

export class SurveyElement extends Base implements ISurveyElement {
  private surveyImplValue: ISurveyImpl;
  private surveyDataValue: ISurveyData;
  private surveyValue: ISurvey;
  private textProcessorValue: ITextProcessor;
  private selectedElementInDesignValue: SurveyElement = this;
  public readOnlyChangedCallback: () => void;

  public static ScrollElementToTop(elementId: string): boolean {
    if (!elementId) return false;
    var el = document.getElementById(elementId);
    if (!el || !el.scrollIntoView) return false;
    var elemTop = el.getBoundingClientRect().top;
    if (elemTop < 0) el.scrollIntoView();
    return elemTop < 0;
  }
  public static GetFirstNonTextElement(
    elements: any,
    removeSpaces: boolean = false
  ) {
    if (!elements || !elements.length || elements.length == 0) return null;
    if (removeSpaces) {
      var tEl = elements[0];
      if (tEl.nodeName === "#text") tEl.data = "";
      tEl = elements[elements.length - 1];
      if (tEl.nodeName === "#text") tEl.data = "";
    }
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].nodeName != "#text" && elements[i].nodeName != "#comment")
        return elements[i];
    }
    return null;
  }
  public static FocusElement(elementId: string): boolean {
    if (!elementId) return false;
    var el = document.getElementById(elementId);
    if (el) {
      el.focus();
      return true;
    }
    return false;
  }
  public static CreateDisabledDesignElements: boolean = false;
  public disableDesignActions: boolean =
    SurveyElement.CreateDisabledDesignElements;
  constructor(name: string) {
    super();
    this.name = name;
    this.createNewArray("errors");
    var self = this;
    this.registerFunctionOnPropertyValueChanged("isReadOnly", function () {
      self.onReadOnlyChanged();
    });
  }
  public setSurveyImpl(value: ISurveyImpl) {
    this.surveyImplValue = value;
    if (!this.surveyImplValue) return;
    this.surveyDataValue = this.surveyImplValue.geSurveyData();
    this.surveyValue = this.surveyImplValue.getSurvey();
    this.textProcessorValue = this.surveyImplValue.getTextProcessor();
    this.onSetData();
  }
  protected get surveyImpl() {
    return this.surveyImplValue;
  }
  public get data(): ISurveyData {
    return this.surveyDataValue;
  }
  /**
   * Returns the survey object.
   */
  public get survey(): ISurvey {
    if (!!this.surveyValue) return this.surveyValue;
    if (!!this.surveyImplValue) {
      this.surveyValue = this.surveyImplValue.getSurvey();
    }
    return this.surveyValue;
  }
  /**
   * Returns true if the question in design mode right now.
   */
  public get isDesignMode(): boolean {
    return !!this.survey && this.survey.isDesignMode;
  }
  public isContentElement: boolean = false;
  public get areInvisibleElementsShowing(): boolean {
    return (
      !!this.survey &&
      this.survey.areInvisibleElementsShowing &&
      !this.isContentElement
    );
  }
  public get isVisible(): boolean {
    return true;
  }
  public get isReadOnly(): boolean {
    return false;
  }
  /**
   * Set it to true to make an element question/panel/page readonly.
   * Please note, this property is hidden for question without input, for example html question.
   * @see enableIf
   * @see isReadOnly
   */
  public get readOnly(): boolean {
    return this.getPropertyValue("readOnly", false);
  }
  public set readOnly(val: boolean) {
    if (this.readOnly == val) return;
    this.setPropertyValue("readOnly", val);
    if (!this.isLoadingFromJson) {
      this.setPropertyValue("isReadOnly", this.isReadOnly);
    }
  }
  protected onReadOnlyChanged() {
    if (!!this.readOnlyChangedCallback) {
      this.readOnlyChangedCallback();
    }
  }
  public updateElementCss() {}
  protected getIsLoadingFromJson(): boolean {
    if (super.getIsLoadingFromJson()) return true;
    return this.survey ? this.survey.isLoadingFromJson : false;
  }
  /**
   * This is the identifier of a survey element - question or panel.
   * @see valueName
   */
  public get name(): string {
    return this.getPropertyValue("name", "");
  }
  public set name(val: string) {
    var oldValue = this.name;
    this.setPropertyValue("name", val);
    if (!this.isLoadingFromJson && !!oldValue) {
      this.onNameChanged(oldValue);
    }
  }
  protected onNameChanged(oldValue: string) {}
  /**
   * The list of errors. It is created by callig hasErrors functions
   * @see hasErrors
   */
  public get errors(): Array<SurveyError> {
    return this.getPropertyValue("errors");
  }
  public set errors(val: Array<SurveyError>) {
    this.setPropertyValue("errors", val);
  }
  /**
   * Returns true if a question or a container (panel/page) or their chidren have an error.
   * The value can be out of date. hasErrors function should be called to get the correct value.
   */
  public get containsErrors(): boolean {
    return this.getPropertyValue("containsErrors", false);
  }
  public updateContainsErrors() {
    this.setPropertyValue("containsErrors", this.getContainsErrors());
  }
  protected getContainsErrors(): boolean {
    return this.errors.length > 0;
  }
  public getElementsInDesign(includeHidden: boolean = false): Array<IElement> {
    return [];
  }
  public get selectedElementInDesign(): SurveyElement {
    return this.selectedElementInDesignValue;
  }
  public set selectedElementInDesign(val: SurveyElement) {
    this.selectedElementInDesignValue = val;
  }
  public updateCustomWidgets() {}

  public onSurveyLoad() {}
  public onFirstRendering() {}
  endLoadingFromJson() {
    super.endLoadingFromJson();
    if (!this.survey) {
      this.onSurveyLoad();
    }
  }
  public setVisibleIndex(index: number): number {
    return 0;
  }
  public get isPage() {
    return false;
  }
  /**
   * Return false if it is not panel.
   */
  public get isPanel() {
    return false;
  }
  public delete() {}
  protected removeSelfFromList(list: Array<any>) {
    if (!list || !Array.isArray(list)) return;
    var index = list.indexOf(this);
    if (index > -1) {
      list.splice(index, 1);
    }
  }
  protected get textProcessor(): ITextProcessor {
    return this.textProcessorValue;
  }
  protected getProcessedHtml(html: string): string {
    if (!html || !this.textProcessor) return html;
    return this.textProcessor.processText(html, true);
  }
  protected onSetData() {}
  protected getPage(parent: IPanel): IPage {
    while (parent && parent.parent) parent = parent.parent;
    if (parent && parent.getType() == "page") return <IPage>(<any>parent);
    return null;
  }
  protected moveToBase(
    parent: IPanel,
    container: IPanel,
    insertBefore: any = null
  ): boolean {
    if (!container) return false;
    parent.removeElement(<IElement>(<any>this));
    var index = -1;
    if (Helpers.isNumber(insertBefore)) {
      index = parseInt(insertBefore);
    }
    if (index == -1 && !!insertBefore && !!insertBefore.getType) {
      index = container.indexOf(insertBefore);
    }
    container.addElement(<IElement>(<any>this), index);
    return true;
  }

  protected setPage(parent: IPanel, val: IPage) {
    var oldPage = this.getPage(parent);
    if (oldPage === val) return;
    if (parent) parent.removeElement(<IElement>(<any>this));
    if (val) {
      val.addElement(<IElement>(<any>this), -1);
    }
  }
}

export class Event<T extends Function, Options> {
  protected callbacks: Array<T>;
  public get isEmpty(): boolean {
    return this.callbacks == null || this.callbacks.length == 0;
  }
  public fire(sender: any, options: Options) {
    if (this.callbacks == null) return;
    for (var i = 0; i < this.callbacks.length; i++) {
      var callResult = this.callbacks[i](sender, options);
    }
  }
  public clear() {
    this.callbacks = [];
  }
  public add(func: T) {
    if (this.hasFunc(func)) return;
    if (this.callbacks == null) {
      this.callbacks = new Array<T>();
    }
    this.callbacks.push(func);
  }
  public remove(func: T) {
    if (this.hasFunc(func)) {
      var index = this.callbacks.indexOf(func, 0);
      this.callbacks.splice(index, 1);
    }
  }
  public hasFunc(func: T): boolean {
    if (this.callbacks == null) return false;
    return this.callbacks.indexOf(func, 0) > -1;
  }
}
