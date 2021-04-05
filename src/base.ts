import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { HashTable, Helpers } from "./helpers";
import {
  CustomPropertiesCollection,
  JsonObject,
  JsonObjectProperty,
  property,
  Serializer,
} from "./jsonobject";
import { settings } from "./settings";
import { ItemValue } from "./itemvalue";
import { RendererFactory } from "./rendererFactory";
import { IActionBarItem } from "./action-bar";
import {
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase,
} from "./question_matrixdropdownbase";

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
  getQuestionByName(name: string): IQuestion;
  pageVisibilityChanged(page: IPage, newValue: boolean): any;
  panelVisibilityChanged(panel: IPanel, newValue: boolean): any;
  questionVisibilityChanged(question: IQuestion, newValue: boolean): any;
  isEditingSurveyElement: boolean;
  isClearValueOnHidden: boolean;
  isClearValueOnHiddenContainer: boolean;
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
  getSurveyMarkdownHtml(element: Base, text: string, name: string): string;
  getRendererForString(element: Base, name: string): string;
  isDisplayMode: boolean;
  isDesignMode: boolean;
  areInvisibleElementsShowing: boolean;
  areEmptyElementsHidden: boolean;
  isLoadingFromJson: boolean;
  isUpdateValueTextOnTyping: boolean;

  state: string;
  isLazyRendering: boolean;
  cancelPreviewByPage(panel: IPanel): any;

  requiredText: string;
  beforeSettingQuestionErrors(
    question: IQuestion,
    errors: Array<SurveyError>
  ): void;
  beforeSettingPanelErrors(question: IPanel, errors: Array<SurveyError>): void;
  questionTitlePattern: string;
  getUpdatedQuestionTitle(question: IQuestion, title: string): string;
  getUpdatedQuestionNo(question: IQuestion, no: string): string;
  getUpdatedQuestionTitleActions(
    question: IQuestion,
    titleActions: Array<IActionBarItem>
  ): Array<IActionBarItem>;
  getUpdatedPanelTitleActions(
    question: IPanel,
    titleActions: Array<IActionBarItem>
  ): Array<IActionBarItem>;
  getUpdatedPageTitleActions(
    question: IPage,
    titleActions: Array<IActionBarItem>
  ): Array<IActionBarItem>;
  getUpdatedMatrixRowActions(
    question: QuestionMatrixDropdownModelBase,
    row: MatrixDropdownRowModelBase,
    actions: Array<IActionBarItem>
  ): Array<IActionBarItem>;
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
    question: IQuestion,
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
  afterRenderQuestion(question: IQuestion, htmlElement: HTMLElement): any;
  afterRenderQuestionInput(question: IQuestion, htmlElement: HTMLElement): any;
  afterRenderPanel(panel: IElement, htmlElement: HTMLElement): any;
  afterRenderPage(htmlElement: HTMLElement): any;

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
  isValidateOnValueChanging: boolean;
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
  runExpression(expression: string): any;
  renderTitleActions(element: ISurveyElement): boolean;
  elementContentVisibilityChanged(element: ISurveyElement): void;
}
export interface ISurveyImpl {
  getSurveyData(): ISurveyData;
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
  parent: IPanel;
  setSurveyImpl(value: ISurveyImpl): any;
  onSurveyLoad(): any;
  onFirstRendering(): any;
  getType(): string;
  setVisibleIndex(value: number): number;
  locStrsChanged(): any;
  delete(): any;
  toggleState(): void;
  stateChangedCallback(): void;
  getTitleActions(): Array<any>;
}
export interface IElement extends IConditionRunner, ISurveyElement {
  visible: boolean;
  renderWidth: string;
  width: string;
  minWidth?: string;
  maxWidth?: string;
  isExpanded: boolean;
  isCollapsed: boolean;
  rightIndent: number;
  startWithNewLine: boolean;
  registerFunctionOnPropertyValueChanged(
    name: string,
    func: any,
    key: string
  ): void;
  unRegisterFunctionOnPropertyValueChanged(name: string, key: string): void;
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
  ensureRowsVisibility(): void;
}
export interface IPage extends IPanel, IConditionRunner {
  isStarted: boolean;
}
export interface ITitleOwner {
  name: string;
  no: string;
  requiredText: string;
  isRequireTextOnStart: boolean;
  isRequireTextBeforeTitle: boolean;
  isRequireTextAfterTitle: boolean;
  locTitle: LocalizableString;
}
export interface IProgressInfo {
  questionCount: number;
  answeredQuestionCount: number;
  requiredQuestionCount: number;
  requiredAnsweredQuestionCount: number;
}

export interface IWrapperObject {
  getOriginalObj(): Base;
  getClassNameProperty(): string;
}

export class Bindings {
  private properties: Array<JsonObjectProperty> = null;
  private values: any = null;
  constructor(private obj: Base) {}
  public getType(): string {
    return "bindings";
  }
  public getNames(): Array<string> {
    var res: Array<string> = [];
    this.fillProperties();
    for (var i = 0; i < this.properties.length; i++) {
      if (this.properties[i].isVisible("", this.obj)) {
        res.push(this.properties[i].name);
      }
    }
    return res;
  }
  public getProperties(): Array<JsonObjectProperty> {
    var res: Array<JsonObjectProperty> = [];
    this.fillProperties();
    for (var i = 0; i < this.properties.length; i++) {
      res.push(this.properties[i]);
    }
    return res;
  }
  public setBinding(propertyName: string, valueName: string) {
    if (!this.values) this.values = {};
    if (!!valueName) {
      this.values[propertyName] = valueName;
    } else {
      delete this.values[propertyName];
      if (Object.keys(this.values).length == 0) {
        this.values = null;
      }
    }
  }
  public clearBinding(propertyName: string) {
    this.setBinding(propertyName, "");
  }
  public isEmpty(): boolean {
    return !this.values;
  }
  public getValueNameByPropertyName(propertyName: string): string {
    if (!this.values) return undefined;
    return this.values[propertyName];
  }
  public getPropertiesByValueName(valueName: string): Array<string> {
    if (!this.values) return [];
    var res: Array<string> = [];
    for (var key in this.values) {
      if (this.values[key] == valueName) {
        res.push(key);
      }
    }
    return res;
  }
  public getJson(): any {
    if (this.isEmpty()) return null;
    var res: any = {};
    for (var key in this.values) {
      res[key] = this.values[key];
    }
    return res;
  }
  public setJson(value: any) {
    this.values = null;
    if (!value) return;
    this.values = {};
    for (var key in value) {
      this.values[key] = value[key];
    }
  }
  private fillProperties() {
    if (this.properties !== null) return;
    this.properties = [];
    var objProperties = Serializer.getPropertiesByObj(this.obj);
    for (var i = 0; i < objProperties.length; i++) {
      if (objProperties[i].isBindable) {
        this.properties.push(objProperties[i]);
      }
    }
  }
}
/**
 * The base class for SurveyJS objects.
 */
export class Base {
  public static isSurveyElement(val: any): boolean {
    if (!val) return false;
    if (Array.isArray(val)) {
      if (val.length == 0) return false;
      return Base.isSurveyElement(val[0]);
    }
    return !!val.getType && !!val.onPropertyChanged;
  }
  public static get commentPrefix(): string {
    return settings.commentPrefix;
  }
  public static set commentPrefix(val: string) {
    settings.commentPrefix = val;
  }
  public static createItemValue: (item: any, type?: string) => any;
  public static itemValueLocStrChanged: (arr: Array<any>) => void;
  /**
   * Returns true if a value underfined, null, empty string or empty array.
   *
   * @param value
   * @param trimString a boolean parameter, default value true. If true then it trims the string and functions returns true for a string that contains white spaces only.
   */
  public isValueEmpty(value: any, trimString: boolean = true): boolean {
    if (trimString) {
      value = this.trimValue(value);
    }
    return Helpers.isValueEmpty(value);
  }
  protected trimValue(value: any): any {
    if (!!value && (typeof value === "string" || value instanceof String))
      return value.trim();
    return value;
  }
  protected IsPropertyEmpty(value: any): boolean {
    return value !== "" && this.isValueEmpty(value);
  }

  private propertyHash: { [index: string]: any } = {};
  private localizableStrings: { [index: string]: LocalizableString };
  private arraysInfo: { [index: string]: any };
  private eventList: Array<EventBase<any>> = [];
  private bindingsValue: Bindings;
  private isDisposedValue: boolean;
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
  public onPropertyChanged: EventBase<Base> = this.addEvent<Base>();
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
  > = this.addEvent<Base>();

  getPropertyValueCoreHandler: (propertiesHash: any, name: string) => any;

  setPropertyValueCoreHandler: (
    propertiesHash: any,
    name: string,
    val: any
  ) => void;
  createArrayCoreHandler: (propertiesHash: any, name: string) => Array<any>;

  private isCreating = true;

  public constructor() {
    this.bindingsValue = new Bindings(this);
    CustomPropertiesCollection.createProperties(this);
    this.onBaseCreating();
    this.isCreating = false;
  }
  public dispose() {
    for (var i = 0; i < this.eventList.length; i++) {
      this.eventList[i].clear();
    }
    this.isDisposedValue = true;
  }
  public get isDisposed() {
    return this.isDisposedValue === true;
  }
  protected addEvent<T>(): EventBase<T> {
    var res = new EventBase<T>();
    this.eventList.push(res);
    return res;
  }
  protected onBaseCreating() {}
  /**
   * Returns the type of the object as a string as it represents in the json. It should be in lowcase.
   */
  public getType(): string {
    return "base";
  }
  public getSurvey(isLive: boolean = false): ISurvey {
    return null;
  }
  /**
   * Returns true if the object is inluded into survey, otherwise returns false.
   */
  public get inSurvey(): boolean {
    return !!this.getSurvey(true);
  }
  public get bindings(): Bindings {
    return this.bindingsValue;
  }
  checkBindings(valueName: string, value: any) {}
  protected updateBindings(propertyName: string, value: any) {
    var valueName = this.bindings.getValueNameByPropertyName(propertyName);
    if (!!valueName) {
      this.updateBindingValue(valueName, value);
    }
  }
  protected updateBindingValue(valueName: string, value: any) {}
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
  public getProgressInfo(): IProgressInfo {
    return SurveyElement.createProgressInfo();
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
      if (!!prop && (!prop.isCustom || !this.isCreating)) {
        if (
          !this.IsPropertyEmpty(prop.defaultValue) &&
          !Array.isArray(prop.defaultValue)
        )
          return prop.defaultValue;
        if (prop.type == "boolean" || prop.type == "switch") return false;
        if (prop.isCustom && !!prop.onGetValue) return prop.onGetValue(this);
      }
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
    if (this.setPropertyValueCoreHandler && !this.isDisposedValue)
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
        name,
        oldValue,
        val,
        arrayInfo ? arrayInfo.isItemValues : false,
        arrayInfo ? arrayInfo.onPush : null
      );
    } else {
      this.setPropertyValueCore(this.propertyHash, name, val);
      if (!this.isDisposedValue && !this.isTwoValueEquals(oldValue, val)) {
        this.propertyValueChanged(name, oldValue, val);
      }
    }
  }
  protected clearPropertyValue(name: string) {
    this.setPropertyValueCore(this.propertyHash, name, null);
    delete this.propertyHash[name];
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
    this.updateBindings(name, newValue);
    this.onPropertyValueChanged(name, oldValue, newValue);
    this.onPropertyChanged.fire(this, {
      name: name,
      oldValue: oldValue,
      newValue: newValue,
    });

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
  protected get isInternal(): boolean {
    return false;
  }
  private doPropertyValueChangedCallback(
    name: string,
    oldValue: any,
    newValue: any,
    arrayChanges?: ArrayChanges,
    target?: Base
  ) {
    if (this.isInternal) return;
    if (!target) target = this;
    var notifier: any = this.getSurvey();
    if (!notifier) notifier = this;
    if (!!notifier.doPropertyValueChangedCallback) {
      notifier.onPropertyValueChangedCallback(
        name,
        oldValue,
        newValue,
        target,
        arrayChanges
      );
    }
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
    var locStr = new LocalizableString(owner, useMarkDown, name);
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
    var result = this.createNewArray(name, function(item: any) {
      item.locOwner = self;
      item.ownerPropertyName = name;
    });
    this.arraysInfo[name].isItemValues = true;
    return result;
  }
  private notifyArrayChanged(ar: any, arrayChanges: ArrayChanges) {
    !!ar.onArrayChanged && ar.onArrayChanged(arrayChanges);
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
  protected ensureArray(
    name: string,
    onPush: any = null,
    onRemove: any = null
  ) {
    if (this.arraysInfo && this.arraysInfo[name]) {
      return;
    }

    return this.createNewArray(name, onPush, onRemove);
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
    newArray.push = function(value): number {
      var result = Object.getPrototypeOf(newArray).push.call(newArray, value);
      if (!self.isDisposedValue) {
        if (onPush) onPush(value, newArray.length - 1);
        const arrayChanges = new ArrayChanges(
          newArray.length - 1,
          0,
          [value],
          []
        );
        self.propertyValueChanged(name, newArray, newArray, arrayChanges);
        self.notifyArrayChanged(newArray, arrayChanges);
      }
      return result;
    };
    newArray.unshift = function(value): number {
      var result = Object.getPrototypeOf(newArray).unshift.call(
        newArray,
        value
      );
      if (!self.isDisposedValue) {
        if (onPush) onPush(value, newArray.length - 1);
        const arrayChanges = new ArrayChanges(0, 0, [value], []);
        self.propertyValueChanged(name, newArray, newArray, arrayChanges);
        self.notifyArrayChanged(newArray, arrayChanges);
      }
      return result;
    };
    newArray.pop = function(): number {
      var result = Object.getPrototypeOf(newArray).pop.call(newArray);
      if (!self.isDisposedValue) {
        if (onRemove) onRemove(result);
        const arrayChanges = new ArrayChanges(newArray.length - 1, 1, [], []);
        self.propertyValueChanged(name, newArray, newArray, arrayChanges);
        self.notifyArrayChanged(newArray, arrayChanges);
      }
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
      if (!self.isDisposedValue) {
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
        const arrayChanges = new ArrayChanges(
          start,
          deleteCount,
          items,
          result
        );
        self.propertyValueChanged(name, newArray, newArray, arrayChanges);
        self.notifyArrayChanged(newArray, arrayChanges);
      }
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
    this.notifyArrayChanged(src, arrayChanges);
  }
  protected isTwoValueEquals(
    x: any,
    y: any,
    caseInSensitive: boolean = false,
    trimString: boolean = false
  ): boolean {
    if (caseInSensitive) {
      x = this.getValueInLowCase(x);
      y = this.getValueInLowCase(y);
    }
    if (trimString) {
      x = this.trimValue(x);
      y = this.trimValue(y);
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

/**
 * Base class of SurveyJS Elements.
 */
export class SurveyElement extends Base implements ISurveyElement {
  protected titleActions: any[] = [];
  stateChangedCallback: () => void;
  public static createProgressInfo(): IProgressInfo {
    return {
      questionCount: 0,
      answeredQuestionCount: 0,
      requiredQuestionCount: 0,
      requiredAnsweredQuestionCount: 0,
    };
  }
  public static getProgressInfoByElements(
    children: Array<SurveyElement>,
    isRequired: boolean
  ): IProgressInfo {
    var info = SurveyElement.createProgressInfo();
    for (var i = 0; i < children.length; i++) {
      if (!children[i].isVisible) continue;
      var childInfo = children[i].getProgressInfo();
      info.questionCount += childInfo.questionCount;
      info.answeredQuestionCount += childInfo.answeredQuestionCount;
      info.requiredQuestionCount += childInfo.requiredQuestionCount;
      info.requiredAnsweredQuestionCount +=
        childInfo.requiredAnsweredQuestionCount;
    }
    if (isRequired && info.questionCount > 0) {
      if (info.requiredQuestionCount == 0) info.requiredQuestionCount = 1;
      if (info.answeredQuestionCount > 0)
        info.requiredAnsweredQuestionCount = 1;
    }
    return info;
  }
  private surveyImplValue: ISurveyImpl;
  private surveyDataValue: ISurveyData;
  private surveyValue: ISurvey;
  private textProcessorValue: ITextProcessor;
  private selectedElementInDesignValue: SurveyElement = this;
  public readOnlyChangedCallback: () => void;

  public static ScrollElementToTop(elementId: string): boolean {
    if (!elementId || typeof document === "undefined") return false;
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
    if (!elementId || typeof document === "undefined") return false;
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
    this.registerFunctionOnPropertyValueChanged("isReadOnly", () => {
      this.onReadOnlyChanged();
    });
    this.registerFunctionOnPropertyValueChanged("state", () => {
      if (this.stateChangedCallback) this.stateChangedCallback();
    });
    this.registerFunctionOnPropertyValueChanged("errors", () => {
      this.updateVisibleErrors();
    });
  }
  /**
   * Set this property to "collapsed" to render only Panel title and expanded button and to "expanded" to render the collapsed button in the Panel caption
   */
  public get state(): string {
    return this.getPropertyValue("state");
  }
  public set state(val: string) {
    this.setPropertyValue("state", val);
    this.notifyStateChanged();
  }
  private notifyStateChanged() {
    if (this.survey) {
      this.survey.elementContentVisibilityChanged(this);
    }
  }
  /**
   * Returns true if the Element is in the collapsed state
   * @see state
   * @see collapse
   * @see isExpanded
   */
  public get isCollapsed() {
    if (this.isDesignMode) return;
    return this.state == "collapsed";
  }
  /**
   * Returns true if the Element is in the expanded state
   * @see state
   * @see expand
   * @see isCollapsed
   */
  public get isExpanded() {
    return this.state == "expanded";
  }
  /**
   * Collapse the Element
   * @see state
   */
  public collapse() {
    if (this.isDesignMode) return;
    this.state = "collapsed";
  }
  /**
   * Expand the Element
   * @see state
   */
  public expand() {
    this.state = "expanded";
  }
  /**
   * Toggle element's state
   * @see state
   */
  public toggleState() {
    if (this.isCollapsed) {
      this.expand();
      return;
    }
    if (this.isExpanded) {
      this.collapse();
      return;
    }
  }

  public getTitleActions(): Array<any> {
    this.titleActions = [];
    var expandAction: any = {
      title: "",
      action: () => {
        this.toggleState();
      },
    };
    Object.defineProperties(expandAction, {
      innerCss: {
        get: () => {
          var css = "sv-expand-action";
          if (this.isExpanded) css += " sv-expand-action--expanded";
          return css;
        },
      },
      visible: {
        get: () => {
          return this.isExpanded || this.isCollapsed;
        },
      },
    });

    this.titleActions.push(expandAction);
    return this.titleActions;
  }

  public getTitleComponentName(): string {
    var componentName = "default";
    if (this.survey.renderTitleActions(this)) {
      componentName = RendererFactory.Instance.getRenderer(
        "element",
        "title-actions"
      );
    }
    if (componentName == "default") {
      return "sv-default-title";
    }
    return componentName;
  }

  public setSurveyImpl(value: ISurveyImpl) {
    this.surveyImplValue = value;
    if (!this.surveyImplValue) {
      this.surveyValue = null;
    } else {
      this.surveyDataValue = this.surveyImplValue.getSurveyData();
      this.surveyValue = this.surveyImplValue.getSurvey();
      this.textProcessorValue = this.surveyImplValue.getTextProcessor();
      this.onSetData();
    }
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
    return this.getSurvey();
  }
  public getSurvey(live: boolean = false): ISurvey {
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
  protected get isInternal(): boolean {
    return this.isContentElement;
  }
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
    this.setPropertyValue("name", this.getValidName(val));
    if (!this.isLoadingFromJson && !!oldValue) {
      this.onNameChanged(oldValue);
    }
  }
  protected getValidName(name: string): string {
    return name;
  }
  protected onNameChanged(oldValue: string) {}
  protected updateBindingValue(valueName: string, value: any) {
    if (
      !!this.data &&
      !Helpers.isTwoValueEquals(value, this.data.getValue(valueName))
    ) {
      this.data.setValue(valueName, value, false);
    }
  }
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
  @property({ defaultValue: false }) hasVisibleErrors: boolean;
  private updateVisibleErrors() {
    var counter = 0;
    for (var i = 0; i < this.errors.length; i++) {
      if (this.errors[i].visible) counter++;
    }
    this.hasVisibleErrors = counter > 0;
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
  public get parent(): IPanel {
    return this.getPropertyValue("parent", null);
  }
  public set parent(val: IPanel) {
    this.setPropertyValue("parent", val);
  }

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
  public onCallbacksChanged: () => void;
  protected callbacks: Array<T>;
  public get isEmpty(): boolean {
    return !this.callbacks || this.callbacks.length == 0;
  }
  public fire(sender: any, options: Options) {
    if (!this.callbacks) return;
    for (var i = 0; i < this.callbacks.length; i++) {
      this.callbacks[i](sender, options);
      if (!this.callbacks) return;
    }
  }
  public clear() {
    this.callbacks = undefined;
  }
  public add(func: T) {
    if (this.hasFunc(func)) return;
    if (!this.callbacks) {
      this.callbacks = new Array<T>();
    }
    this.callbacks.push(func);
    this.fireCallbackChanged();
  }
  public remove(func: T) {
    if (this.hasFunc(func)) {
      var index = this.callbacks.indexOf(func, 0);
      this.callbacks.splice(index, 1);
      this.fireCallbackChanged();
    }
  }
  public hasFunc(func: T): boolean {
    if (this.callbacks == null) return false;
    return this.callbacks.indexOf(func, 0) > -1;
  }
  private fireCallbackChanged() {
    if (!!this.onCallbacksChanged) {
      this.onCallbacksChanged();
    }
  }
}

export class EventBase<T> extends Event<
  (sender: T, options: any) => any,
  any
> {}
