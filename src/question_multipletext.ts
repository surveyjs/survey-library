import { Base } from "./base";
import {
  ISurveyData,
  ISurveyImpl,
  ISurvey,
  IPanel,
  IElement,
  ITextProcessor,
  IProgressInfo
} from "./base-interfaces";
import { SurveyElement } from "./survey-element";
import { SurveyValidator, IValidatorOwner } from "./validator";
import { Question, IConditionObject } from "./question";
import { QuestionTextModel } from "./question_text";
import { JsonObject, Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { SurveyError } from "./survey-error";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { Helpers } from "./helpers";
import { CssClassBuilder } from "./utils/cssClassBuilder";

export interface IMultipleTextData extends ILocalizableOwner, IPanel {
  getSurvey(): ISurvey;
  getTextProcessor(): ITextProcessor;
  getAllValues(): any;
  getMultipleTextValue(name: string): any;
  setMultipleTextValue(name: string, value: any): any;
  getItemDefaultValue(name: string): any;
  getIsRequiredText(): string;
}

export class MultipleTextItemModel extends Base
  implements IValidatorOwner, ISurveyData, ISurveyImpl {
  private editorValue: QuestionTextModel;
  private data: IMultipleTextData;

  valueChangedCallback: (newValue: any) => void;

  constructor(name: any = null, title: string = null) {
    super();
    this.editorValue = this.createEditor(name);
    this.editor.questionTitleTemplateCallback = function() {
      return "";
    };
    this.editor.titleLocation = "left";
    if (title) {
      this.title = title;
    }
  }
  public getType(): string {
    return "multipletextitem";
  }
  public get id(): string {
    return this.editor.id;
  }
  public getOriginalObj(): Base {
    return this.editor;
  }
  /**
   * The item name.
   */
  public get name(): string {
    return this.editor.name;
  }
  public set name(val: string) {
    this.editor.name = val;
  }
  public get question(): Question {
    return <Question>(<any>this.data);
  }
  public get editor(): QuestionTextModel {
    return this.editorValue;
  }
  protected createEditor(name: string): QuestionTextModel {
    return new QuestionTextModel(name);
  }
  public addUsedLocales(locales: Array<string>) {
    super.addUsedLocales(locales);
    this.editor.addUsedLocales(locales);
  }
  public locStrsChanged() {
    super.locStrsChanged();
    this.editor.locStrsChanged();
  }
  setData(data: IMultipleTextData) {
    this.data = data;
    if (!!data) {
      this.editor.defaultValue = data.getItemDefaultValue(this.name);
      this.editor.setSurveyImpl(this);
      this.editor.parent = data;
    }
  }
  /**
   * Set this property to true, to make the item a required. If a user doesn't fill the item then a validation error will be generated.
   */
  public get isRequired(): boolean {
    return this.editor.isRequired;
  }
  public set isRequired(val: boolean) {
    this.editor.isRequired = val;
  }
  /**
   * Use this property to change the default input type.
   */
  public get inputType(): string {
    return this.editor.inputType;
  }
  public set inputType(val: string) {
    this.editor.inputType = val;
  }
  /**
   * Item title. If it is empty, the item name is rendered as title. This property supports markdown.
   * @see name
   */
  public get title(): string {
    return this.editor.title;
  }
  public set title(val: string) {
    this.editor.title = val;
  }
  get locTitle() {
    return this.editor.locTitle;
  }
  /**
   * Returns the text or html for rendering the title.
   */
  public get fullTitle(): string {
    return this.editor.fullTitle;
  }
  /**
   * The maximum text length. If it is -1, defaul value, then the survey maxTextLength property will be used.
   * If it is 0, then the value is unlimited
   * @see SurveyModel.maxTextLength
   */
  public get maxLength(): number {
    return this.editor.maxLength;
  }
  public set maxLength(val: number) {
    this.editor.maxLength = val;
  }
  public getMaxLength(): any {
    var survey = this.getSurvey();
    return Helpers.getMaxLength(
      this.maxLength,
      survey ? survey.maxTextLength : -1
    );
  }
  /**
   * The input place holder.
   */
  public get placeHolder(): string {
    return this.editor.placeHolder;
  }
  public set placeHolder(val: string) {
    this.editor.placeHolder = val;
  }
  get locPlaceHolder(): LocalizableString {
    return this.editor.locPlaceHolder;
  }
  /**
   * The custom text that will be shown on required error. Use this property, if you do not want to show the default text.
   */
  public get requiredErrorText(): string {
    return this.editor.requiredErrorText;
  }
  public set requiredErrorText(val: string) {
    this.editor.requiredErrorText = val;
  }
  get locRequiredErrorText(): LocalizableString {
    return this.editor.locRequiredErrorText;
  }
  /**
   * The input size.
   */
  public get size(): number {
    return this.editor.size;
  }
  public set size(val: number) {
    this.editor.size = val;
  }
  /**
   * The list of question validators.
   */
  public get validators(): Array<SurveyValidator> {
    return this.editor.validators;
  }
  public set validators(val: Array<SurveyValidator>) {
    this.editor.validators = val;
  }
  public getValidators(): Array<SurveyValidator> {
    return this.validators;
  }
  /**
   * The item value.
   */
  public get value() {
    return this.data ? this.data.getMultipleTextValue(this.name) : null;
  }
  public set value(value: any) {
    if (this.data != null) {
      this.data.setMultipleTextValue(this.name, value);
    }
  }
  public isEmpty() {
    return this.editor.isEmpty();
  }
  public onValueChanged(newValue: any) {
    if (this.valueChangedCallback) this.valueChangedCallback(newValue);
  }
  //ISurveyImpl
  getSurveyData(): ISurveyData {
    return this;
  }
  getSurvey(): ISurvey {
    return this.data ? this.data.getSurvey() : null;
  }
  getTextProcessor(): ITextProcessor {
    return this.data ? this.data.getTextProcessor() : null;
  }
  //ISurveyData
  getValue(name: string): any {
    if (!this.data) return null;
    return this.data.getMultipleTextValue(name);
  }
  setValue(name: string, value: any) {
    if (this.data) {
      this.data.setMultipleTextValue(name, value);
    }
  }
  getVariable(name: string): any {
    return undefined;
  }
  setVariable(name: string, newValue: any) {}
  getComment(name: string): string {
    return null;
  }
  setComment(name: string, newValue: string) {}
  getAllValues(): any {
    if (this.data) return this.data.getAllValues();
    return this.value;
  }
  getFilteredValues(): any {
    return this.getAllValues();
  }
  getFilteredProperties(): any {
    return { survey: this.getSurvey() };
  }
  //IValidatorOwner
  getValidatorTitle(): string {
    return this.title;
  }
  get validatedValue(): any {
    return this.value;
  }
  set validatedValue(val: any) {
    this.value = val;
  }
  getDataFilteredValues(): any {
    return this.getFilteredValues();
  }
  getDataFilteredProperties(): any {
    return this.getFilteredProperties();
  }
}

/**
 * A Model for a multiple text question.
 */
export class QuestionMultipleTextModel extends Question
  implements IMultipleTextData, IPanel {
  public static addDefaultItems(question: QuestionMultipleTextModel) {
    var names = QuestionFactory.DefaultMutlipleTextItems;
    for (var i = 0; i < names.length; i++) question.addItem(names[i]);
  }

  colCountChangedCallback: () => void;
  constructor(name: string) {
    super(name);
    this.createNewArray("items", (item: any) => {
      item.setData(this);
    });
    this.registerFunctionOnPropertyValueChanged("items", () => {
      this.fireCallback(this.colCountChangedCallback);
    });
    this.registerFunctionOnPropertyValueChanged("colCount", () => {
      this.fireCallback(this.colCountChangedCallback);
    });
    this.registerFunctionOnPropertyValueChanged("itemSize", () => {
      this.updateItemsSize();
    });
  }
  public getType(): string {
    return "multipletext";
  }
  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean) {
    super.setSurveyImpl(value, isLight);
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].setData(this);
    }
  }
  public get isAllowTitleLeft(): boolean {
    return false;
  }
  public get hasSingleInput(): boolean {
    return false;
  }
  onSurveyLoad() {
    this.editorsOnSurveyLoad();
    super.onSurveyLoad();
    this.fireCallback(this.colCountChangedCallback);
  }
  setQuestionValue(newValue: any, updateIsAnswered: boolean = true) {
    super.setQuestionValue(newValue, updateIsAnswered);
    this.performForEveryEditor((item: MultipleTextItemModel): void => {
      item.editor.updateValueFromSurvey(item.value);
    });
    this.updateIsAnswered();
  }
  onSurveyValueChanged(newValue: any) {
    super.onSurveyValueChanged(newValue);
    this.performForEveryEditor((item: MultipleTextItemModel): void => {
      item.editor.onSurveyValueChanged(item.value);
    });
  }
  private updateItemsSize() {
    this.performForEveryEditor((item: MultipleTextItemModel): void => {
      item.editor.updateInputSize();
    });
  }
  private editorsOnSurveyLoad() {
    this.performForEveryEditor((item: MultipleTextItemModel): void => {
      item.editor.onSurveyLoad();
    });
  }
  private performForEveryEditor(func: (item: MultipleTextItemModel) => void) {
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if (item.editor) {
        func(item);
      }
    }
  }
  /**
   * The list of input items.
   */
  public get items(): Array<MultipleTextItemModel> {
    return this.getPropertyValue("items");
  }
  public set items(val: Array<MultipleTextItemModel>) {
    this.setPropertyValue("items", val);
  }
  /**
   * Add a new text item.
   * @param name a item name
   * @param title a item title (optional)
   */
  public addItem(name: string, title: string = null): MultipleTextItemModel {
    var item = this.createTextItem(name, title);
    this.items.push(item);
    return item;
  }
  public getItemByName(name: string): MultipleTextItemModel {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].name == name) return this.items[i];
    }
    return null;
  }
  public addConditionObjectsByContext(
    objects: Array<IConditionObject>,
    context: any
  ) {
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      objects.push({
        name: this.getValueName() + "." + item.name,
        text: this.processedTitle + "." + item.fullTitle,
        question: this,
      });
    }
  }
  public getConditionJson(operator: string = null, path: string = null): any {
    if (!path) return super.getConditionJson();
    var item = this.getItemByName(path);
    if (!item) return null;
    var json = new JsonObject().toJsonObject(item);
    json["type"] = "text";
    return json;
  }
  public locStrsChanged() {
    super.locStrsChanged();
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].locStrsChanged();
    }
  }
  supportGoNextPageAutomatic() {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].isEmpty()) return false;
    }
    return true;
  }
  /**
   * The number of columns. Items are rendred in one line if the value is 0.
   */
  public get colCount(): number {
    return this.getPropertyValue("colCount");
  }
  public set colCount(val: number) {
    if (val < 1 || val > 5) return;
    this.setPropertyValue("colCount", val);
  }
  /**
   * The default text input size.
   */
  public get itemSize(): number {
    return this.getPropertyValue("itemSize");
  }
  public set itemSize(val: number) {
    this.setPropertyValue("itemSize", val);
  }
  /**
   * Returns the list of rendered rows.
   */
  public getRows(): Array<any> {
    var colCount = this.colCount;
    var items = this.items;
    var rows = [];
    var index = 0;
    for (var i = 0; i < items.length; i++) {
      if (index == 0) {
        rows.push([]);
      }
      rows[rows.length - 1].push(items[i]);
      index++;
      if (index >= colCount) {
        index = 0;
      }
    }
    return rows;
  }
  private isMultipleItemValueChanging = false;
  protected onValueChanged() {
    super.onValueChanged();
    this.onItemValueChanged();
  }
  protected createTextItem(name: string, title: string): MultipleTextItemModel {
    return new MultipleTextItemModel(name, title);
  }
  protected onItemValueChanged() {
    if (this.isMultipleItemValueChanging) return;
    for (var i = 0; i < this.items.length; i++) {
      var itemValue = null;
      if (this.value && this.items[i].name in this.value) {
        itemValue = this.value[this.items[i].name];
      }
      this.items[i].onValueChanged(itemValue);
    }
  }
  protected getIsRunningValidators(): boolean {
    if (super.getIsRunningValidators()) return true;
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].editor.isRunningValidators) return true;
    }
    return false;
  }
  public hasErrors(fireCallback: boolean = true, rec: any = null): boolean {
    var res = false;
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].editor.onCompletedAsyncValidators = (
        hasErrors: boolean
      ) => {
        this.raiseOnCompletedAsyncValidators();
      };
      if (
        !!rec &&
        rec.isOnValueChanged === true &&
        this.items[i].editor.isEmpty()
      )
        continue;
      res = this.items[i].editor.hasErrors(fireCallback, rec) || res;
    }
    return super.hasErrors(fireCallback) || res;
  }
  public getAllErrors(): Array<SurveyError> {
    var result = super.getAllErrors();
    for (var i = 0; i < this.items.length; i++) {
      var errors = this.items[i].editor.getAllErrors();
      if (errors && errors.length > 0) {
        result = result.concat(errors);
      }
    }
    return result;
  }
  public clearErrors() {
    super.clearErrors();
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].editor.clearErrors();
    }
  }
  protected getContainsErrors(): boolean {
    var res = super.getContainsErrors();
    if (res) return res;
    var items = this.items;
    for (var i = 0; i < items.length; i++) {
      if (items[i].editor.containsErrors) return true;
    }
    return false;
  }
  protected getIsAnswered(): boolean {
    if (!super.getIsAnswered()) return false;
    for (var i = 0; i < this.items.length; i++) {
      var editor = this.items[i].editor;
      if (editor.isVisible && !editor.isAnswered) return false;
    }
    return true;
  }
  public getProgressInfo(): IProgressInfo {
    var elements = [];
    for (var i = 0; i < this.items.length; i++) {
      elements.push(this.items[i].editor);
    }
    return SurveyElement.getProgressInfoByElements(elements, this.isRequired);
  }
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    if (!value) return value;
    var res = {};
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      var val = value[item.name];
      if (Helpers.isValueEmpty(val)) continue;
      var itemName = item.name;
      if (keysAsText && !!item.title) {
        itemName = item.title;
      }
      (<any>res)[itemName] = item.editor.getDisplayValue(keysAsText, val);
    }
    return res;
  }
  //IMultipleTextData
  getMultipleTextValue(name: string) {
    if (!this.value) return null;
    return this.value[name];
  }
  setMultipleTextValue(name: string, value: any) {
    this.isMultipleItemValueChanging = true;
    if (this.isValueEmpty(value)) {
      value = undefined;
    }
    var newValue = this.value;
    if (!newValue) {
      newValue = {};
    }
    newValue[name] = value;
    this.setNewValue(newValue);
    this.isMultipleItemValueChanging = false;
  }
  getItemDefaultValue(name: string): any {
    return !!this.defaultValue ? this.defaultValue[name] : null;
  }
  getTextProcessor(): ITextProcessor {
    return this.textProcessor;
  }
  getAllValues() {
    return this.data ? this.data.getAllValues() : null;
  }
  getIsRequiredText(): string {
    return this.survey ? this.survey.requiredText : "";
  }
  //IPanel
  addElement(element: IElement, index: number) {}
  removeElement(element: IElement): boolean {
    return false;
  }
  getQuestionTitleLocation(): string {
    return "left";
  }
  getQuestionStartIndex(): string {
    return this.getStartIndex();
  }
  getChildrenLayoutType(): string {
    return "row";
  }
  elementWidthChanged(el: IElement) {}
  get elements(): Array<IElement> {
    return [];
  }
  indexOf(el: IElement): number {
    return -1;
  }
  ensureRowsVisibility(): void {
    // do nothing
  }
  public getItemLabelCss(item: MultipleTextItemModel): string {
    return new CssClassBuilder().append(this.cssClasses.itemLabel).append(this.cssClasses.itemLabelOnError, item.editor.errors.length > 0).toString();
  }
  public getItemCss(): string {
    return new CssClassBuilder().append(this.cssClasses.item).toString();
  }
  public getItemTitleCss(): string {
    return new CssClassBuilder().append(this.cssClasses.itemTitle).toString();
  }
}

Serializer.addClass(
  "multipletextitem",
  [
    "name",
    "isRequired:boolean",
    { name: "placeHolder", serializationProperty: "locPlaceHolder" },
    {
      name: "inputType",
      default: "text",
      choices: [
        "color",
        "date",
        "datetime",
        "datetime-local",
        "email",
        "month",
        "number",
        "password",
        "range",
        "tel",
        "text",
        "time",
        "url",
        "week",
      ],
    },
    { name: "title", serializationProperty: "locTitle" },
    { name: "maxLength:number", default: -1 },
    { name: "size:number", minValue: 0 },
    {
      name: "requiredErrorText:text",
      serializationProperty: "locRequiredErrorText",
    },
    {
      name: "validators:validators",
      baseClassName: "surveyvalidator",
      classNamePart: "validator",
    },
  ],
  function() {
    return new MultipleTextItemModel("");
  }
);

Serializer.addClass(
  "multipletext",
  [
    { name: "!items:textitems", className: "multipletextitem" },
    { name: "itemSize:number", minValue: 0 },
    { name: "colCount:number", default: 1, choices: [1, 2, 3, 4, 5] },
  ],
  function() {
    return new QuestionMultipleTextModel("");
  },
  "question"
);

QuestionFactory.Instance.registerQuestion("multipletext", (name) => {
  var q = new QuestionMultipleTextModel(name);
  QuestionMultipleTextModel.addDefaultItems(q);
  return q;
});
