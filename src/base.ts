import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { HashTable, Helpers } from "./helpers";
import { CustomPropertiesCollection, JsonObject } from "./jsonobject";

export interface ISurveyData {
  getValue(name: string): any;
  setValue(name: string, newValue: any): any;
  getComment(name: string): string;
  setComment(name: string, newValue: string): any;
  getAllValues(): any;
  getFilteredValues(): any;
  getFilteredProperties(): any;
}
export interface ITextProcessor {
  processText(text: string, returnDisplayValue: boolean): string;
  processTextEx(text: string, returnDisplayValue: boolean): any;
}
export interface ISurvey extends ITextProcessor {
  currentPage: IPage;
  pages: Array<IPage>;
  isPageStarted(page: IPage): boolean;
  pageVisibilityChanged(page: IPage, newValue: boolean): any;
  panelVisibilityChanged(panel: IPanel, newValue: boolean): any;
  questionVisibilityChanged(question: IQuestion, newValue: boolean): any;
  questionsOrder: string;
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
  isLoadingFromJson: boolean;

  requiredText: string;
  getQuestionTitleTemplate(): string;
  getUpdatedQuestionTitle(question: IQuestion, title: string): string;

  questionStartIndex: string;
  questionTitleLocation: string;
  questionErrorLocation: string;
  storeOthersAsComment: boolean;

  maxTextLength: number;
  maxOthersLength: number;
  clearValueOnDisableItems: boolean;

  uploadFiles(
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
  afterRenderQuestion(question: IQuestion, htmlElement: any): any;
  afterRenderPanel(panel: IElement, htmlElement: any): any;
  afterRenderPage(htmlElement: any): any;
  matrixRowAdded(question: IQuestion): any;
  matrixBeforeRowAdded(options: {
    question: IQuestion;
    canAddRow: boolean;
  }): any;
  matrixRowRemoved(question: IQuestion, rowIndex: number, row: any): any;
  matrixCellCreated(question: IQuestion, options: any): any;
  matrixAfterCellRender(question: IQuestion, options: any): any;
  matrixCellValueChanged(question: IQuestion, options: any): any;
  matrixCellValidate(question: IQuestion, options: any): SurveyError;
  dynamicPanelAdded(question: IQuestion): any;
  dynamicPanelRemoved(question: IQuestion, panelIndex: number): any;
  dynamicPanelItemValueChanged(question: IQuestion, options: any): any;
  dragAndDropAllow(options: any): boolean;
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
  isPage: boolean;
  setSurveyImpl(value: ISurveyImpl): any;
  onSurveyLoad(): any;
  onFirstRendering(): any;
  getType(): string;
  setVisibleIndex(value: number): number;
  locStrsChanged(): any;
}
export interface IElement extends IConditionRunner, ISurveyElement {
  visible: boolean;
  parent: IPanel;
  renderWidth: string;
  width: string;
  rightIndent: number;
  startWithNewLine: boolean;
  isPanel: boolean;
  getPanel(): IPanel;
  removeElement(el: IElement): boolean;
  onAnyValueChanged(name: string): any;
  updateCustomWidgets(): any;
  clearIncorrectValues(): any;
}

export interface IQuestion extends IElement {
  hasTitle: boolean;
  isEmpty(): boolean;
  onSurveyValueChanged(newValue: any): any;
  supportGoNextPageAutomatic(): boolean;
  clearUnusedValues(): any;
  getDisplayValue(keysAsText: boolean): any;
  getValueName(): string;
  clearValue(): any;
  clearValueIfInvisible(): any;
  isAnswerCorrect(): boolean;
  updateValueWithDefaults(): any;
  value: any;
}
export interface IParentElement {
  addElement(element: IElement, index: number): any;
  removeElement(element: IElement): boolean;
  isReadOnly: boolean;
}

export interface IPanel extends ISurveyElement, IParentElement {
  getQuestionTitleLocation(): string;
  parent: IPanel;
  elementWidthChanged(el: IElement): any;
}
export interface IPage extends IPanel, IConditionRunner {}
/**
 * The base class for SurveyJS objects.
 */
export class Base {
  public static commentPrefix: string = "-Comment";
  public static createItemValue: (item: any) => any;
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
  public onPropertyChanged: Event<
    (sender: Base, options: any) => any,
    any
  > = new Event<(sender: Base, options: any) => any, any>();

  getPropertyValueCoreHandler: (propertiesHash: any, name: string) => any;

  setPropertyValueCoreHandler: (
    propertiesHash: any,
    name: string,
    val: any
  ) => void;

  public constructor() {
    CustomPropertiesCollection.createProperties(this);
  }
  /**
   * Returns the type of the object as a string as it represents in the json. It should be in lowcase.
   */
  public getType(): string {
    return "base";
  }
  /**
   * Returns the element template name without prefix. Typically it equals to getType()
   * @see getType
   */
  public getTemplate(): string {
    return this.getType();
  }
  /**
   * Returns true if the object is loading from Json at the current moment.
   */
  public get isLoadingFromJson() {
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
   */
  public toJSON(): any {
    return new JsonObject().toJsonObject(this);
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
    if (this.IsPropertyEmpty(res) && defaultValue != null) return defaultValue;
    return res;
  }
  protected getPropertyValueCore(propertiesHash: any, name: string) {
    if (this.getPropertyValueCoreHandler)
      return this.getPropertyValueCoreHandler(propertiesHash, name);
    else return propertiesHash[name];
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
    keys.forEach(key => func(this.propertyHash, key));
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
        oldValue,
        val,
        arrayInfo ? arrayInfo.isItemValues : false,
        arrayInfo ? arrayInfo.onPush : null
      );
      this.propertyValueChanged(name, oldValue, oldValue);
    } else {
      this.setPropertyValueCore(this.propertyHash, name, val);
      if (!this.isTwoValueEquals(oldValue, val)) {
        this.propertyValueChanged(name, oldValue, val);
      }
    }
  }
  protected propertyValueChanged(name: string, oldValue: any, newValue: any) {
    if (this.isLoadingFromJson) return;
    this.onPropertyChanged.fire(this, {
      name: name,
      oldValue: oldValue,
      newValue: newValue
    });
    if (!this.onPropChangeFunctions) return;
    for (var i = 0; i < this.onPropChangeFunctions.length; i++) {
      if (this.onPropChangeFunctions[i].name == name)
        this.onPropChangeFunctions[i].func(newValue);
    }
  }
  /**
   * Register a function that will be called on a property value changed.
   * @param name the property name
   * @param func the function with no parameters that will be called on property changed.
   * @param key an optional parameter. If there is already a registered function for this property witht the same key, it will be overwritten.
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
   * @param key an optional parameter. If there is already a registered function for this property witht the same key, it will be overwritten.
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
  protected createItemValues(name: string): Array<any> {
    var self = this;
    var result = this.createNewArray(name, function(item: any) {
      item.locOwner = self;
    });
    this.arraysInfo[name].isItemValues = true;
    return result;
  }
  private notifyArrayChanged(ar: any) {
    !!ar.onArrayChanged && ar.onArrayChanged();
  }
  protected createNewArray(
    name: string,
    onPush: any = null,
    onRemove: any = null
  ): Array<any> {
    var newArray = new Array<any>();
    this.setPropertyValueCore(this.propertyHash, name, newArray);
    if (!this.arraysInfo) {
      this.arraysInfo = {};
    }
    this.arraysInfo[name] = { onPush: onPush, isItemValues: false };
    var self = this;
    newArray.push = function(value): number {
      var result = Object.getPrototypeOf(newArray).push.call(newArray, value);
      if (onPush) onPush(value, newArray.length - 1);
      self.propertyValueChanged(name, newArray, newArray);
      self.notifyArrayChanged(newArray);
      return result;
    };
    newArray.pop = function(): number {
      var result = Object.getPrototypeOf(newArray).pop.call(newArray);
      if (onRemove) onRemove(result);
      self.propertyValueChanged(name, newArray, newArray);
      self.notifyArrayChanged(newArray);
      return result;
    };
    newArray.splice = function(
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
      self.propertyValueChanged(name, newArray, newArray);
      self.notifyArrayChanged(newArray);
      return result;
    };

    return newArray;
  }
  protected setArray(
    src: any[],
    dest: any[],
    isItemValues: boolean,
    onPush: any
  ) {
    Object.getPrototypeOf(src).splice.call(src, 0, src.length);
    //src.splice(0, src.length);
    //    src.length = 0;
    if (!dest) {
      this.notifyArrayChanged(src);
      return;
    }
    for (var i = 0; i < dest.length; i++) {
      var item = dest[i];
      if (isItemValues) {
        if (!!Base.createItemValue) {
          item = Base.createItemValue(item);
        }
      }
      Object.getPrototypeOf(src).push.call(src, item);
      //src["origionalPush"].apply(src, [item]);
      if (onPush) onPush(src[i]);
    }
    this.notifyArrayChanged(src);
  }
  protected isTwoValueEquals(x: any, y: any): boolean {
    return Helpers.isTwoValueEquals(x, y);
  }
}
export class SurveyError {
  private locTextValue: LocalizableString;
  constructor(public text: string = null, locOwner: ILocalizableOwner = null) {
    this.locTextValue = new LocalizableString(locOwner, true);
    this.locText.text = this.getText();
  }
  public get locText() {
    return this.locTextValue;
  }
  public getText(): string {
    var res = this.text;
    if (!res) res = this.getDefaultText();
    return res;
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

  public static ScrollElementToTop(elementId: string): boolean {
    if (!elementId) return false;
    var el = document.getElementById(elementId);
    if (!el || !el.scrollIntoView) return false;
    var elemTop = el.getBoundingClientRect().top;
    if (elemTop < 0) el.scrollIntoView();
    return elemTop < 0;
  }
  public static GetFirstNonTextElement(elements: any) {
    if (!elements || !elements.length) return;
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
  constructor(name: string) {
    super();
    this.name = name;
    this.createNewArray("errors");
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
    return this.surveyValue;
  }
  /**
   * Returns true if the question in design mode right now.
   */
  public get isDesignMode(): boolean {
    return !!this.survey && this.survey.isDesignMode;
  }
  public get areInvisibleElementsShowing(): boolean {
    return !!this.survey && this.survey.areInvisibleElementsShowing;
  }
  public get isVisible(): boolean {
    return true;
  }
  public get isLoadingFromJson() {
    if (this.survey) return this.survey.isLoadingFromJson;
    return this.isLoadingFromJsonValue;
  }
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
  protected setPage(parent: IPanel, val: IPage) {
    var oldPage = this.getPage(parent);
    if (oldPage === val) return;
    if (parent) parent.removeElement(<IElement>(<any>this));
    if (val) {
      val.addElement(<IElement>(<any>this), -1);
    }
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
}

export class Event<T extends Function, Options> {
  private callbacks: Array<T>;
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
    if (this.callbacks == null) return;
    var index = this.callbacks.indexOf(func, 0);
    if (index != undefined) {
      this.callbacks.splice(index, 1);
    }
  }
  public hasFunc(func: T): boolean {
    if (this.callbacks == null) return false;
    return this.callbacks.indexOf(func, 0) > -1;
  }
}
