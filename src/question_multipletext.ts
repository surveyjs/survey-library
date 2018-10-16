import {
  Base,
  ISurveyData,
  ISurveyImpl,
  ISurvey,
  IPanel,
  IElement,
  ITextProcessor
} from "./base";
import { SurveyValidator, IValidatorOwner, ValidatorRunner } from "./validator";
import { Question } from "./question";
import { QuestionTextModel } from "./question_text";
import { JsonObject } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { SurveyError } from "./base";
import { AnswerRequiredError } from "./error";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { Helpers } from "./helpers";

export interface IMultipleTextData extends ILocalizableOwner, IPanel {
  getSurvey(): ISurvey;
  getTextProcessor(): ITextProcessor;
  getAllValues(): any;
  getMultipleTextValue(name: string): any;
  setMultipleTextValue(name: string, value: any): any;
  getIsRequiredText(): string;
}

export class MultipleTextItemModel extends Base
  implements IValidatorOwner, ISurveyData, ISurveyImpl {
  private editorValue: QuestionTextModel;
  private data: IMultipleTextData;

  valueChangedCallback: (newValue: any) => void;
  validators: Array<SurveyValidator> = new Array<SurveyValidator>();

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
  /**
   * The item name.
   */
  public get name(): string {
    return this.editor.name;
  }
  public set name(val: string) {
    this.editor.name = val;
  }
  public get editor(): QuestionTextModel {
    return this.editorValue;
  }
  protected createEditor(name: string): QuestionTextModel {
    return new QuestionTextModel(name);
  }
  public locStrsChanged() {
    super.locStrsChanged();
    this.editor.locStrsChanged();
  }
  setData(data: IMultipleTextData) {
    this.data = data;
    if (data) {
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
   * The maximim text length. If it is -1, defaul value, then the survey maxTextLength property will be used.
   * If it is 0, then the value is unlimited
   * @see SurveyModel.maxTextLength
   */
  public get maxLength(): number {
    return this.getPropertyValue("maxLength", -1);
  }
  public set maxLength(val: number) {
    this.setPropertyValue("maxLength", val);
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
    return Helpers.isValueEmpty(this.value);
  }
  public onValueChanged(newValue: any) {
    if (this.valueChangedCallback) this.valueChangedCallback(newValue);
  }
  //ISurveyImpl
  geSurveyData(): ISurveyData {
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
  colCountChangedCallback: () => void;
  constructor(public name: string) {
    super(name);
    var self = this;
    this.items = this.createNewArray("items", function(item: any) {
      item.setData(self);
    });
    this.registerFunctionOnPropertyValueChanged("items", function() {
      self.fireCallback(self.colCountChangedCallback);
    });
    this.registerFunctionOnPropertyValueChanged("colCount", function() {
      self.fireCallback(self.colCountChangedCallback);
    });
  }
  public getType(): string {
    return "multipletext";
  }
  public setSurveyImpl(value: ISurveyImpl) {
    super.setSurveyImpl(value);
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].setData(this);
    }
  }
  public get isAllowTitleLeft(): boolean {
    return false;
  }
  onSurveyLoad() {
    super.onSurveyLoad();
    this.callEditorFunction("onSurveyLoad");
    this.fireCallback(this.colCountChangedCallback);
  }
  onReadOnlyChanged() {
    super.onReadOnlyChanged();
    this.callEditorFunction("onReadOnlyChanged");
  }
  onSurveyValueChanged(newValue: any) {
    super.onSurveyValueChanged(newValue);
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if (item.editor) item.editor.onSurveyValueChanged(item.value);
    }
  }
  private callEditorFunction(funcName: string) {
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if (item.editor && (<any>item).editor[funcName]) {
        (<any>item).editor[funcName]();
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
  public addConditionNames(names: Array<string>) {
    for (var i = 0; i < this.items.length; i++) {
      names.push(this.name + "." + this.items[i].name);
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
    return this.getPropertyValue("colCount", 1);
  }
  public set colCount(val: number) {
    if (val < 1 || val > 4) return;
    this.setPropertyValue("colCount", val);
  }
  /**
   * The default text input size.
   */
  public get itemSize(): number {
    return this.getPropertyValue("itemSize", 25);
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
  protected runValidators(): SurveyError {
    var error = super.runValidators();
    if (error != null) return error;
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].isEmpty()) continue;
      error = new ValidatorRunner().run(this.items[i]);
      if (error != null) return error;
    }
    return null;
  }
  protected onCheckForErrors(errors: Array<SurveyError>) {
    super.onCheckForErrors(errors);
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      if (item.isRequired && Helpers.isValueEmpty(item.value)) {
        errors.push(new AnswerRequiredError());
      }
    }
  }
  //IMultipleTextData
  getMultipleTextValue(name: string) {
    if (!this.value) return null;
    return this.value[name];
  }
  setMultipleTextValue(name: string, value: any) {
    this.isMultipleItemValueChanging = true;
    var newValue = this.value;
    if (!newValue) {
      newValue = {};
    }
    newValue[name] = value;
    this.setNewValue(newValue);
    this.isMultipleItemValueChanging = false;
  }
  getSurvey(): ISurvey {
    return this.survey;
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
  elementWidthChanged(el: IElement) {}
}

JsonObject.metaData.addClass(
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
        "week"
      ]
    },
    { name: "title", serializationProperty: "locTitle" },
    { name: "maxLength:number", default: -1 },
    {
      name: "validators:validators",
      baseClassName: "surveyvalidator",
      classNamePart: "validator"
    }
  ],
  function() {
    return new MultipleTextItemModel("");
  }
);

JsonObject.metaData.addClass(
  "multipletext",
  [
    { name: "!items:textitems", className: "multipletextitem" },
    { name: "itemSize:number", default: 25 },
    { name: "colCount:number", default: 1, choices: [1, 2, 3, 4] }
  ],
  function() {
    return new QuestionMultipleTextModel("");
  },
  "question"
);

QuestionFactory.Instance.registerQuestion("multipletext", name => {
  var q = new QuestionMultipleTextModel(name);
  q.addItem("text1");
  q.addItem("text2");
  return q;
});
