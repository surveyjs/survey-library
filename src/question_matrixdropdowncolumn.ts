import { JsonObject, JsonObjectProperty, Serializer, property } from "./jsonobject";
import { Question } from "./question";
import { Base } from "./base";
import { ISurvey, IWrapperObject } from "./base-interfaces";
import { ItemValue } from "./itemvalue";
import { QuestionSelectBase } from "./question_baseselect";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { SurveyValidator } from "./validator";
import { getCurrecyCodes } from "./question_expression";
import { settings } from "./settings";
import { MatrixDropdownRowModelBase, QuestionMatrixDropdownModelBase } from "./question_matrixdropdownbase";

export interface IMatrixColumnOwner extends ILocalizableOwner {
  getRequiredText(): string;
  onColumnPropertyChanged(
    column: MatrixDropdownColumn,
    name: string,
    newValue: any
  ): void;
  onColumnItemValuePropertyChanged(
    column: MatrixDropdownColumn,
    propertyName: string,
    obj: ItemValue,
    name: string,
    newValue: any,
    oldValue: any
  ): void;
  onShowInMultipleColumnsChanged(column: MatrixDropdownColumn): void;
  getCellType(): string;
  getCustomCellType(column: MatrixDropdownColumn, row: MatrixDropdownRowModelBase, cellType: string): string;
  onColumnCellTypeChanged(column: MatrixDropdownColumn): void;
}

function onUpdateSelectBaseCellQuestion(
  cellQuestion: QuestionSelectBase,
  column: MatrixDropdownColumn,
  question: QuestionMatrixDropdownModelBase,
  data: any
) {
  cellQuestion.storeOthersAsComment = !!question
    ? question.storeOthersAsComment
    : false;
  if (
    (!cellQuestion.choices || cellQuestion.choices.length == 0) &&
    cellQuestion.choicesByUrl.isEmpty
  ) {
    cellQuestion.choices = question.choices;
  }
  if (!cellQuestion.choicesByUrl.isEmpty) {
    cellQuestion.choicesByUrl.run(data.getTextProcessor());
  }
}
export var matrixDropdownColumnTypes = {
  dropdown: {
    properties: [
      "choices",
      "choicesOrder",
      "choicesByUrl",
      "optionsCaption",
      "otherText",
      "choicesVisibleIf",
    ],
    onCellQuestionUpdate: (
      cellQuestion: any,
      column: any,
      question: any,
      data: any
    ) => {
      onUpdateSelectBaseCellQuestion(cellQuestion, column, question, data);
      if (
        !!cellQuestion.locOptionsCaption &&
        cellQuestion.locOptionsCaption.isEmpty &&
        !question.locOptionsCaption.isEmpty
      ) {
        cellQuestion.optionsCaption = question.optionsCaption;
      }
    },
  },
  checkbox: {
    properties: [
      "choices",
      "choicesOrder",
      "choicesByUrl",
      "otherText",
      "choicesVisibleIf",
      "hasSelectAll",
      "hasNone",
    ],
    onCellQuestionUpdate: (
      cellQuestion: any,
      column: any,
      question: any,
      data: any
    ) => {
      onUpdateSelectBaseCellQuestion(cellQuestion, column, question, data);
      cellQuestion.colCount =
        column.colCount > -1 ? column.colCount : question.columnColCount;
    },
  },
  radiogroup: {
    properties: [
      "choices",
      "choicesOrder",
      "choicesByUrl",
      "otherText",
      "choicesVisibleIf",
    ],
    onCellQuestionUpdate: (
      cellQuestion: any,
      column: any,
      question: any,
      data: any
    ) => {
      onUpdateSelectBaseCellQuestion(cellQuestion, column, question, data);
      cellQuestion.colCount =
        column.colCount > -1 ? column.colCount : question.columnColCount;
    },
  },
  text: {
    properties: ["placeHolder", "inputType", "maxLength", "min", "max", "step"],
    onCellQuestionUpdate: (
      cellQuestion: any,
      column: any,
      question: any,
      data: any
    ) => { },
  },
  comment: {
    properties: ["placeHolder", "rows", "maxLength"],
    onCellQuestionUpdate: (
      cellQuestion: any,
      column: any,
      question: any,
      data: any
    ) => { },
  },
  boolean: {
    properties: ["renderAs", "defaultValue"],
    onCellQuestionUpdate: (
      cellQuestion: any,
      column: any,
      question: any,
      data: any
    ) => {
      cellQuestion.showTitle = true;
      cellQuestion.renderAs = column.renderAs;
    },
  },
  expression: {
    properties: ["expression", "displayStyle", "currency"],
    onCellQuestionUpdate: (
      cellQuestion: any,
      column: any,
      question: any,
      data: any
    ) => { },
  },
  rating: {
    properties: ["rateValues"],
  },
};

export class MatrixDropdownColumn extends Base
  implements ILocalizableOwner, IWrapperObject {
  public static getColumnTypes(): Array<string> {
    var res = [];
    for (var key in matrixDropdownColumnTypes) {
      res.push(key);
    }
    return res;
  }
  private templateQuestionValue: Question;
  private colOwnerValue: IMatrixColumnOwner = null;
  private indexValue = -1;
  private _isVisible = true;
  private _hasVisibleCell = true;

  constructor(name: string, title: string = null) {
    super();
    var self = this;
    this.createLocalizableString("totalFormat", this);
    this.registerFunctionOnPropertyValueChanged(
      "showInMultipleColumns",
      function () {
        self.doShowInMultipleColumnsChanged();
      }
    );
    this.updateTemplateQuestion();
    this.name = name;
    if (title) {
      this.title = title;
    } else {
      this.templateQuestion.locTitle.strChanged();
    }
  }
  public getOriginalObj(): Base {
    return this.templateQuestion;
  }
  getClassNameProperty(): string {
    return "cellType";
  }
  public getSurvey(live: boolean = false): ISurvey {
    return !!this.colOwner ? (<any>this.colOwner).survey : null;
  }
  endLoadingFromJson() {
    super.endLoadingFromJson();
    this.templateQuestion.endLoadingFromJson();
    this.templateQuestion.onGetSurvey = () => {
      return this.getSurvey();
    };
  }
  getDynamicPropertyName(): string {
    return "cellType";
  }
  getDynamicType(): string {
    return this.calcCellQuestionType(null);
  }
  public get colOwner(): IMatrixColumnOwner {
    return this.colOwnerValue;
  }
  public set colOwner(value: IMatrixColumnOwner) {
    this.colOwnerValue = value;
    if (!!value) {
      this.updateTemplateQuestion();
    }
  }
  public locStrsChanged() {
    super.locStrsChanged();
    this.locTitle.strChanged();
  }
  public addUsedLocales(locales: Array<string>) {
    super.addUsedLocales(locales);
    this.templateQuestion.addUsedLocales(locales);
  }
  public get index() {
    return this.indexValue;
  }
  public setIndex(val: number) {
    this.indexValue = val;
  }
  public getType() {
    return "matrixdropdowncolumn";
  }
  public get cellType(): string {
    return this.getPropertyValue("cellType");
  }
  public set cellType(val: string) {
    val = val.toLocaleLowerCase();
    this.setPropertyValue("cellType", val);
    this.updateTemplateQuestion();
    if (!!this.colOwner) {
      this.colOwner.onColumnCellTypeChanged(this);
    }
  }
  public get templateQuestion() {
    return this.templateQuestionValue;
  }
  public get value() {
    return this.templateQuestion.name;
  }
  public get isVisible() {
    return this._isVisible;
  }
  public setIsVisible(newVal: boolean) {
    this._isVisible = newVal;
  }
  public get hasVisibleCell() {
    return this._hasVisibleCell;
  }
  public set hasVisibleCell(newVal: boolean) {
    this._hasVisibleCell = newVal;
  }
  public get name() {
    return this.templateQuestion.name;
  }
  public set name(val: string) {
    this.templateQuestion.name = val;
  }
  public get title(): string {
    return this.templateQuestion.title;
  }
  public set title(val: string) {
    this.templateQuestion.title = val;
  }
  public get locTitle() {
    return this.templateQuestion.locTitle;
  }
  public get fullTitle(): string {
    return this.locTitle.textOrHtml;
  }
  public get isRequired(): boolean {
    return this.templateQuestion.isRequired;
  }
  public set isRequired(val: boolean) {
    this.templateQuestion.isRequired = val;
  }
  public get requiredText(): string {
    return this.templateQuestion.requiredText;
  }
  public get requiredErrorText(): string {
    return this.templateQuestion.requiredErrorText;
  }
  public set requiredErrorText(val: string) {
    this.templateQuestion.requiredErrorText = val;
  }
  get locRequiredErrorText(): LocalizableString {
    return this.templateQuestion.locRequiredErrorText;
  }
  public get readOnly(): boolean {
    return this.templateQuestion.readOnly;
  }
  public set readOnly(val: boolean) {
    this.templateQuestion.readOnly = val;
  }
  public get hasOther(): boolean {
    return this.templateQuestion.hasOther;
  }
  public set hasOther(val: boolean) {
    this.templateQuestion.hasOther = val;
  }
  public get visibleIf(): string {
    return this.templateQuestion.visibleIf;
  }
  public set visibleIf(val: string) {
    this.templateQuestion.visibleIf = val;
  }
  public get enableIf(): string {
    return this.templateQuestion.enableIf;
  }
  public set enableIf(val: string) {
    this.templateQuestion.enableIf = val;
  }
  public get requiredIf(): string {
    return this.templateQuestion.requiredIf;
  }
  public set requiredIf(val: string) {
    this.templateQuestion.requiredIf = val;
  }
  public get isUnique(): boolean {
    return this.getPropertyValue("isUnique");
  }
  public set isUnique(val: boolean) {
    this.setPropertyValue("isUnique", val);
  }
  public get showInMultipleColumns(): boolean {
    return this.getPropertyValue("showInMultipleColumns", false);
  }
  public set showInMultipleColumns(val: boolean) {
    this.setPropertyValue("showInMultipleColumns", val);
  }
  public get isSupportMultipleColumns(): boolean {
    return ["checkbox", "radiogroup"].indexOf(this.cellType) > -1;
  }
  public get isShowInMultipleColumns(): boolean {
    return this.showInMultipleColumns && this.isSupportMultipleColumns;
  }
  public get validators(): Array<SurveyValidator> {
    return this.templateQuestion.validators;
  }
  public set validators(val: Array<SurveyValidator>) {
    this.templateQuestion.validators = val;
  }
  public get totalType(): string {
    return this.getPropertyValue("totalType");
  }
  public set totalType(val: string) {
    this.setPropertyValue("totalType", val);
  }
  public get totalExpression(): string {
    return this.getPropertyValue("totalExpression");
  }
  public set totalExpression(val: string) {
    this.setPropertyValue("totalExpression", val);
  }
  public get hasTotal(): boolean {
    return this.totalType != "none" || !!this.totalExpression;
  }
  public get totalFormat(): string {
    return this.getLocalizableStringText("totalFormat", "");
  }
  public set totalFormat(val: string) {
    this.setLocalizableStringText("totalFormat", val);
  }
  get locTotalFormat(): LocalizableString {
    return this.getLocalizableString("totalFormat");
  }
  public get renderAs(): string {
    return this.getPropertyValue("renderAs");
  }
  public set renderAs(val: string) {
    this.setPropertyValue("renderAs", val);
  }
  public get totalMaximumFractionDigits(): number {
    return this.getPropertyValue("totalMaximumFractionDigits");
  }
  public set totalMaximumFractionDigits(val: number) {
    if (val < -1 || val > 20) return;
    this.setPropertyValue("totalMaximumFractionDigits", val);
  }
  public get totalMinimumFractionDigits(): number {
    return this.getPropertyValue("totalMinimumFractionDigits");
  }
  public set totalMinimumFractionDigits(val: number) {
    if (val < -1 || val > 20) return;
    this.setPropertyValue("totalMinimumFractionDigits", val);
  }
  public get totalDisplayStyle(): string {
    return this.getPropertyValue("totalDisplayStyle");
  }
  public set totalDisplayStyle(val: string) {
    this.setPropertyValue("totalDisplayStyle", val);
  }
  public get totalCurrency(): string {
    return this.getPropertyValue("totalCurrency");
  }
  public set totalCurrency(val: string) {
    if (getCurrecyCodes().indexOf(val) < 0) return;
    this.setPropertyValue("totalCurrency", val);
  }
  public get minWidth(): string {
    return this.getPropertyValue("minWidth", "");
  }
  public set minWidth(val: string) {
    this.setPropertyValue("minWidth", val);
  }
  public get width(): string {
    return this.getPropertyValue("width", "");
  }
  public set width(val: string) {
    this.setPropertyValue("width", val);
  }
  public get colCount(): number {
    return this.getPropertyValue("colCount");
  }
  public set colCount(val: number) {
    if (val < -1 || val > 4) return;
    this.setPropertyValue("colCount", val);
  }
  public getLocale(): string {
    return this.colOwner ? this.colOwner.getLocale() : "";
  }
  public getMarkdownHtml(text: string, name: string): string {
    return this.colOwner ? this.colOwner.getMarkdownHtml(text, name) : null;
  }
  public getRenderer(name: string): string {
    return !!this.colOwner ? this.colOwner.getRenderer(name) : null;
  }
  public getRendererContext(locStr: LocalizableString): any {
    return !!this.colOwner ? this.colOwner.getRendererContext(locStr) : locStr;
  }
  public getProcessedText(text: string): string {
    return this.colOwner ? this.colOwner.getProcessedText(text) : text;
  }
  public createCellQuestion(row: MatrixDropdownRowModelBase): Question {
    var qType = this.calcCellQuestionType(row);
    var cellQuestion = <Question>this.createNewQuestion(qType);
    this.callOnCellQuestionUpdate(cellQuestion, row);
    return cellQuestion;
  }
  public updateCellQuestion(
    cellQuestion: Question,
    data: any,
    onUpdateJson: (json: any) => any = null
  ) {
    this.setQuestionProperties(cellQuestion, onUpdateJson);
    this.callOnCellQuestionUpdate(cellQuestion, data);
  }
  private callOnCellQuestionUpdate(cellQuestion: Question, data: any) {
    var qType = cellQuestion.getType();
    var qDefinition = (<any>matrixDropdownColumnTypes)[qType];
    if (qDefinition && qDefinition["onCellQuestionUpdate"]) {
      qDefinition["onCellQuestionUpdate"](
        cellQuestion,
        this,
        this.colOwner,
        data
      );
    }
  }
  defaultCellTypeChanged() {
    this.updateTemplateQuestion();
  }
  protected calcCellQuestionType(row: MatrixDropdownRowModelBase): string {
    let cellType = this.getDefaultCellQuestionType();
    if (!!row && !!this.colOwner) {
      cellType = this.colOwner.getCustomCellType(this, row, cellType);
    }
    return cellType;
  }
  private getDefaultCellQuestionType(): string {
    if (this.cellType !== "default") return this.cellType;
    if (this.colOwner) return this.colOwner.getCellType();
    return settings.matrixDefaultCellType;
  }
  protected updateTemplateQuestion() {
    var prevCellType = this.templateQuestion
      ? this.templateQuestion.getType()
      : "";
    var curCellType = this.calcCellQuestionType(null);
    if (curCellType === prevCellType) return;
    if (this.templateQuestion) {
      this.removeProperties(prevCellType);
    }
    this.templateQuestionValue = this.createNewQuestion(curCellType);
    this.templateQuestion.locOwner = this;
    this.addProperties(curCellType);
    this.templateQuestion.onPropertyChanged.add((sender, options) => {
      this.propertyValueChanged(
        options.name,
        options.oldValue,
        options.newValue
      );
    });
    this.templateQuestion.onItemValuePropertyChanged.add((sender, options) => {
      this.doItemValuePropertyChanged(
        options.propertyName,
        options.obj,
        options.name,
        options.newValue,
        options.oldValue
      );
    });
    this.templateQuestion.isContentElement = true;
    if (!this.isLoadingFromJson) {
      this.templateQuestion.onGetSurvey = () => {
        return this.getSurvey();
      };
    }
    this.templateQuestion.locTitle.strChanged();
  }
  protected createNewQuestion(cellType: string): Question {
    var question = <Question>Serializer.createClass(cellType);
    if (!question) {
      question = <Question>Serializer.createClass("text");
    }
    question.loadingOwner = this;
    question.isEditableTemplateElement = true;
    this.setQuestionProperties(question);
    return question;
  }
  protected setQuestionProperties(
    question: Question,
    onUpdateJson: (json: any) => any = null
  ) {
    if (this.templateQuestion) {
      var json = new JsonObject().toJsonObject(this.templateQuestion, true);
      if (onUpdateJson) {
        onUpdateJson(json);
      }
      json.type = question.getType();
      new JsonObject().toObject(json, question);
      question.isContentElement = this.templateQuestion.isContentElement;
    }
  }
  protected propertyValueChanged(name: string, oldValue: any, newValue: any) {
    super.propertyValueChanged(name, oldValue, newValue);
    if (!Serializer.hasOriginalProperty(this, name)) return;
    if (this.colOwner != null && !this.isLoadingFromJson) {
      this.colOwner.onColumnPropertyChanged(this, name, newValue);
    }
  }
  private doItemValuePropertyChanged(
    propertyName: string,
    obj: ItemValue,
    name: string,
    newValue: any,
    oldValue: any
  ) {
    if (!Serializer.hasOriginalProperty(obj, name)) return;
    if (this.colOwner != null && !this.isLoadingFromJson) {
      this.colOwner.onColumnItemValuePropertyChanged(
        this,
        propertyName,
        obj,
        name,
        newValue,
        oldValue
      );
    }
  }

  private doShowInMultipleColumnsChanged() {
    if (this.colOwner != null && !this.isLoadingFromJson) {
      this.colOwner.onShowInMultipleColumnsChanged(this);
    }
  }
  private getProperties(curCellType: string): Array<JsonObjectProperty> {
    return Serializer.getDynamicPropertiesByObj(this, curCellType);
  }
  private removeProperties(curCellType: string) {
    var properties = this.getProperties(curCellType);
    for (var i = 0; i < properties.length; i++) {
      var prop = properties[i];
      delete (<any>this)[prop.name];
      if (prop.serializationProperty) {
        delete (<any>this)[prop.serializationProperty];
      }
    }
  }
  private addProperties(curCellType: string) {
    var question = this.templateQuestion;
    var properties = this.getProperties(curCellType);
    for (var i = 0; i < properties.length; i++) {
      var prop = properties[i];
      this.addProperty(question, prop.name, false);
      if (prop.serializationProperty) {
        this.addProperty(question, prop.serializationProperty, true);
      }
    }
  }
  private addProperty(
    question: Question,
    propName: string,
    isReadOnly: boolean
  ) {
    var desc = {
      configurable: true,
      get: function () {
        return (<any>question)[propName];
      },
    };
    if (!isReadOnly) {
      (<any>desc)["set"] = function (v: any) {
        (<any>question)[propName] = v;
      };
    }
    Object.defineProperty(this, propName, desc);
  }
}

Serializer.addClass(
  "matrixdropdowncolumn",
  [
    { name: "!name", isUnique: true },
    { name: "title", serializationProperty: "locTitle" },
    {
      name: "cellType",
      default: "default",
      choices: () => {
        var res = MatrixDropdownColumn.getColumnTypes();
        res.splice(0, 0, "default");
        return res;
      },
    },
    { name: "colCount", default: -1, choices: [-1, 0, 1, 2, 3, 4] },
    "isRequired:boolean",
    "isUnique:boolean",
    {
      name: "requiredErrorText:text",
      serializationProperty: "locRequiredErrorText",
    },
    "readOnly:boolean",
    "minWidth",
    "width",
    "visibleIf:condition",
    "enableIf:condition",
    "requiredIf:condition",
    {
      name: "showInMultipleColumns:boolean",
      dependsOn: "cellType",
      visibleIf: function (obj: any) {
        if (!obj) return false;
        return obj.isSupportMultipleColumns;
      },
    },
    {
      name: "validators:validators",
      baseClassName: "surveyvalidator",
      classNamePart: "validator",
    },
    {
      name: "totalType",
      default: "none",
      choices: ["none", "sum", "count", "min", "max", "avg"],
    },
    "totalExpression:expression",
    { name: "totalFormat", serializationProperty: "locTotalFormat" },
    {
      name: "totalDisplayStyle",
      default: "none",
      choices: ["none", "decimal", "currency", "percent"],
    },
    {
      name: "totalCurrency",
      choices: () => {
        return getCurrecyCodes();
      },
      default: "USD",
    },
    { name: "totalMaximumFractionDigits:number", default: -1 },
    { name: "totalMinimumFractionDigits:number", default: -1 },
    { name: "renderAs", default: "default", visible: false },
  ],
  function () {
    return new MatrixDropdownColumn("");
  }
);
