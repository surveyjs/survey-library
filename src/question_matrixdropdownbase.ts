import {
  JsonObject,
  CustomPropertiesCollection,
  JsonObjectProperty,
  Serializer
} from "./jsonobject";
import { QuestionMatrixBaseModel } from "./martixBase";
import { Question } from "./question";
import { HashTable, Helpers } from "./helpers";
import {
  Base,
  IQuestion,
  ISurveyData,
  ISurvey,
  ISurveyImpl,
  ITextProcessor,
  SurveyError
} from "./base";
import { TextPreProcessor, TextPreProcessorValue } from "./textPreProcessor";
import { ProcessValue } from "./conditionProcessValue";
import { ItemValue } from "./itemvalue";
import { surveyLocalization } from "./surveyStrings";
import { QuestionSelectBase } from "./question_baseselect";
import { QuestionFactory } from "./questionfactory";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { SurveyValidator } from "./validator";
import { getCurrecyCodes } from "./question_expression";
import { FunctionFactory } from "./functionsfactory";
import { settings } from "./settings";

export interface IMatrixDropdownData {
  value: any;
  onRowChanged(
    row: MatrixDropdownRowModelBase,
    columnName: string,
    newRowValue: any,
    isDeletingValue: boolean
  ): void;
  onRowChanging(
    row: MatrixDropdownRowModelBase,
    columnName: string,
    rowValue: any
  ): any;
  getRowIndex(row: MatrixDropdownRowModelBase): number;
  validateCell(
    row: MatrixDropdownRowModelBase,
    columnName: string,
    rowValue: any
  ): SurveyError;
  columns: Array<MatrixDropdownColumn>;
  createQuestion(
    row: MatrixDropdownRowModelBase,
    column: MatrixDropdownColumn
  ): Question;
  getLocale(): string;
  getMarkdownHtml(text: string): string;
  getProcessedText(text: string): string;
  getSharedQuestionByName(
    columnName: string,
    row: MatrixDropdownRowModelBase
  ): Question;
  onTotalValueChanged(): any;
  getSurvey(): ISurvey;
}

export interface IMatrixColumnOwner extends ILocalizableOwner {
  getRequiredText(): string;
  onColumnPropertiesChanged(column: MatrixDropdownColumn): void;
  getCellType(): string;
}

function onUpdateSelectBaseCellQuestion(
  cellQuestion: QuestionSelectBase,
  column: MatrixDropdownColumn,
  question: QuestionMatrixDropdownModelBase,
  data: any
) {
  if (cellQuestion.hasOther) {
    cellQuestion.storeOthersAsComment = false;
  }
  if (
    (!cellQuestion.choices || cellQuestion.choices.length == 0) &&
    cellQuestion.choicesByUrl.isEmpty
  ) {
    cellQuestion.choices = question.choices;
  }
  if (!cellQuestion.choicesByUrl.isEmpty) {
    cellQuestion.choicesByUrl.run(data);
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
      "choicesVisibleIf"
    ],
    onCellQuestionUpdate: (
      cellQuestion: any,
      column: any,
      question: any,
      data: any
    ) => {
      onUpdateSelectBaseCellQuestion(cellQuestion, column, question, data);
      if (
        cellQuestion.locOptionsCaption.isEmpty &&
        !question.locOptionsCaption.isEmpty
      ) {
        cellQuestion.optionsCaption = question.optionsCaption;
      }
    }
  },
  checkbox: {
    properties: [
      "choices",
      "choicesOrder",
      "choicesByUrl",
      "otherText",
      "choicesVisibleIf"
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
    }
  },
  radiogroup: {
    properties: [
      "choices",
      "choicesOrder",
      "choicesByUrl",
      "otherText",
      "choicesVisibleIf"
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
    }
  },
  text: {
    properties: ["placeHolder", "inputType", "maxLength"],
    onCellQuestionUpdate: (
      cellQuestion: any,
      column: any,
      question: any,
      data: any
    ) => {}
  },
  comment: {
    properties: ["placeHolder", "rows", "maxLength"],
    onCellQuestionUpdate: (
      cellQuestion: any,
      column: any,
      question: any,
      data: any
    ) => {}
  },
  boolean: {
    properties: ["defaultValue"],
    onCellQuestionUpdate: (
      cellQuestion: any,
      column: any,
      question: any,
      data: any
    ) => {
      cellQuestion.showTitle = true;
    }
  },
  expression: {
    properties: ["expression", "displayStyle", "currency"],
    onCellQuestionUpdate: (
      cellQuestion: any,
      column: any,
      question: any,
      data: any
    ) => {}
  },
  rating: {
    properties: ["rateValues"]
  }
};

export class MatrixDropdownColumn extends Base implements ILocalizableOwner {
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
    this.registerFunctionOnPropertiesValueChanged(
      [
        "totalType",
        "totalExpression",
        "totalFormat",
        "totalCurrency",
        "totalDisplayStyle",
        "totalMaximumFractionDigits",
        "totalMinimumFractionDigits"
      ],
      function() {
        self.doColumnPropertiesChanged();
      }
    );
    this.updateTemplateQuestion();
    this.name = name;
    if (title) this.title = title;
  }
  getDynamicPropertyName(): string {
    return "cellType";
  }
  getDynamicType(): string {
    return this.calcCellQuestionType();
  }
  getDynamicProperties(): Array<string> {
    var qType = this.calcCellQuestionType();
    var qDefinition = (<any>matrixDropdownColumnTypes)[qType];
    if (qDefinition) return qDefinition.properties;
    return [];
  }
  public get colOwner(): IMatrixColumnOwner {
    return this.colOwnerValue;
  }
  public set colOwner(value: IMatrixColumnOwner) {
    this.colOwnerValue = value;
    this.updateTemplateQuestion();
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
  public get hasCondition(): boolean {
    return (
      !!this.visibleIf ||
      !!this.enableIf ||
      !!this.requiredIf ||
      this.cellType === "expression"
    );
  }
  public get validators(): Array<SurveyValidator> {
    return this.templateQuestion.validators;
  }
  public set validators(val: Array<SurveyValidator>) {
    this.templateQuestion.validators = val;
  }
  public get totalType(): string {
    return this.getPropertyValue("totalType", "none");
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
  public get totalMaximumFractionDigits(): number {
    return this.getPropertyValue("totalMaximumFractionDigits", -1);
  }
  public set totalMaximumFractionDigits(val: number) {
    if (val < -1 || val > 20) return;
    this.setPropertyValue("totalMaximumFractionDigits", val);
  }
  public get totalMinimumFractionDigits(): number {
    return this.getPropertyValue("totalMinimumFractionDigits", -1);
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
    return this.getPropertyValue("colCount", -1);
  }
  public set colCount(val: number) {
    if (val < -1 || val > 4) return;
    this.setPropertyValue("colCount", val);
  }
  public getLocale(): string {
    return this.colOwner ? this.colOwner.getLocale() : "";
  }
  public getMarkdownHtml(text: string): string {
    return this.colOwner ? this.colOwner.getMarkdownHtml(text) : null;
  }
  public getProcessedText(text: string): string {
    return this.colOwner ? this.colOwner.getProcessedText(text) : text;
  }
  public createCellQuestion(data: any): Question {
    var qType = this.calcCellQuestionType();
    var cellQuestion = <Question>this.createNewQuestion(qType);
    this.updateCellQuestion(cellQuestion, data);
    return cellQuestion;
  }
  public updateCellQuestion(cellQuestion: Question, data: any) {
    this.setQuestionProperties(cellQuestion);
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
  protected calcCellQuestionType(): string {
    if (this.cellType !== "default") return this.cellType;
    if (this.colOwner) return this.colOwner.getCellType();
    return settings.matrixDefaultCellType;
  }
  protected updateTemplateQuestion() {
    var prevCellType = this.templateQuestion
      ? this.templateQuestion.getType()
      : "";
    var curCellType = this.calcCellQuestionType();
    if (curCellType === prevCellType) return;
    if (this.templateQuestion) {
      this.removeProperties(prevCellType);
    }
    this.templateQuestionValue = this.createNewQuestion(curCellType);
    this.templateQuestion.locOwner = this;
    this.addProperties(curCellType);
    var self = this;
    this.templateQuestion.onPropertyChanged.add(function() {
      self.doColumnPropertiesChanged();
    });
  }
  protected createNewQuestion(cellType: string): Question {
    var question = <Question>Serializer.createClass(cellType);
    if (!question) {
      question = <Question>Serializer.createClass("text");
    }
    this.setQuestionProperties(question);
    return question;
  }
  protected setQuestionProperties(question: Question) {
    if (this.templateQuestion) {
      var json = new JsonObject().toJsonObject(this.templateQuestion, true);
      json.type = question.getType();
      question.startLoadingFromJson();
      new JsonObject().toObject(json, question);
      question.endLoadingFromJson();
      question.onSurveyLoad();
    }
  }
  protected propertyValueChanged(name: string, oldValue: any, newValue: any) {
    super.propertyValueChanged(name, oldValue, newValue);
    this.doColumnPropertiesChanged();
  }
  private doColumnPropertiesChanged() {
    if (this.colOwner != null && !this.isLoadingFromJson) {
      this.colOwner.onColumnPropertiesChanged(this);
    }
  }
  private getProperties(curCellType: string): Array<JsonObjectProperty> {
    var qDef = (<any>matrixDropdownColumnTypes)[curCellType];
    if (!qDef || !qDef.properties) return [];
    return Serializer.findProperties(curCellType, qDef.properties);
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
      get: function() {
        return (<any>question)[propName];
      }
    };
    if (!isReadOnly) {
      (<any>desc)["set"] = function(v: any) {
        (<any>question)[propName] = v;
      };
    }
    Object.defineProperty(this, propName, desc);
  }
}

export class MatrixDropdownCell {
  private questionValue: Question;
  constructor(
    public column: MatrixDropdownColumn,
    public row: MatrixDropdownRowModelBase,
    public data: IMatrixDropdownData
  ) {
    this.questionValue = this.createQuestion(column, row, data);
    this.questionValue.updateCustomWidget();
  }
  protected createQuestion(
    column: MatrixDropdownColumn,
    row: MatrixDropdownRowModelBase,
    data: IMatrixDropdownData
  ): Question {
    var res = data.createQuestion(this.row, this.column);
    res.validateValueCallback = function() {
      return data.validateCell(row, column.name, row.value);
    };
    CustomPropertiesCollection.getProperties(column.getType()).forEach(
      property => {
        let propertyName = property.name;
        if ((<any>column)[propertyName] !== undefined) {
          res[propertyName] = (<any>column)[propertyName];
        }
      }
    );
    return res;
  }
  public get question(): Question {
    return this.questionValue;
  }
  public get value(): any {
    return this.question.value;
  }
  public set value(value: any) {
    this.question.value = value;
  }
  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
    this.question.runCondition(values, properties);
  }
  public get hasCondition(): boolean {
    return (
      !!this.question.visibleIf ||
      !!this.question.enableIf ||
      !!this.question.requiredIf ||
      this.question.getType() === "expression"
    );
  }
}

export class MatrixDropdownTotalCell extends MatrixDropdownCell {
  constructor(
    public column: MatrixDropdownColumn,
    public row: MatrixDropdownRowModelBase,
    public data: IMatrixDropdownData
  ) {
    super(column, row, data);
    this.updateCellQuestion();
  }
  protected createQuestion(
    column: MatrixDropdownColumn,
    row: MatrixDropdownRowModelBase,
    data: IMatrixDropdownData
  ): Question {
    var res = <Question>Serializer.createClass("expression");
    res.setSurveyImpl(row);
    return res;
  }
  public updateCellQuestion() {
    this.question.locCalculation();
    this.column.updateCellQuestion(this.question, null);
    this.question.expression = this.getTotalExpression();
    this.question.format = this.column.totalFormat;
    this.question.currency = this.column.totalCurrency;
    this.question.displayStyle = this.column.totalDisplayStyle;
    this.question.maximumFractionDigits = this.column.totalMaximumFractionDigits;
    this.question.minimumFractionDigits = this.column.totalMinimumFractionDigits;
    this.question.unlocCalculation();
  }
  public getTotalExpression(): string {
    if (!!this.column.totalExpression) return this.column.totalExpression;
    if (this.column.totalType == "none") return "";
    var funName = this.column.totalType + "InArray";
    if (!FunctionFactory.Instance.hasFunction(funName)) return "";
    return funName + "({self}, '" + this.column.name + "')";
  }
}

export class MatrixDropdownRowModelBase
  implements ISurveyData, ISurveyImpl, ILocalizableOwner, ITextProcessor {
  public static RowVariableName = "row";
  public static OwnerVariableName = "self";
  public static IndexVariableName = "rowIndex";

  private static idCounter: number = 1;
  private static getId(): string {
    return "srow_" + MatrixDropdownRowModelBase.idCounter++;
  }
  protected data: IMatrixDropdownData;
  private isSettingValue: boolean = false;
  private idValue: string;
  private textPreProcessor: TextPreProcessor;

  public cells: Array<MatrixDropdownCell> = [];

  constructor(data: IMatrixDropdownData, value: any) {
    this.data = data;
    this.textPreProcessor = new TextPreProcessor();
    var self = this;
    this.textPreProcessor.onProcess = function(
      textValue: TextPreProcessorValue
    ) {
      self.getProcessedTextValue(textValue);
    };
    this.idValue = MatrixDropdownRowModelBase.getId();
  }
  public get id(): string {
    return this.idValue;
  }
  public get rowName(): any {
    return null;
  }
  public get value(): any {
    var result: any = {};
    for (var i = 0; i < this.cells.length; i++) {
      var question = this.cells[i].question;
      if (!question.isEmpty()) {
        result[question.getValueName()] = question.value;
      }
    }
    return result;
  }
  public get locText(): LocalizableString {
    return null;
  }
  getAllValues(): any {
    return this.value;
  }
  getFilteredValues(): any {
    var allValues = this.getAllValues();
    var values: { [key: string]: any } = { row: allValues };
    for (var key in allValues) {
      values[key] = allValues[key];
    }
    return values;
  }
  getFilteredProperties(): any {
    return { survey: this.getSurvey(), row: this };
  }
  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
    if (!!this.data) {
      values[MatrixDropdownRowModelBase.OwnerVariableName] = this.data.value;
    }
    values[MatrixDropdownRowModelBase.IndexVariableName] = this.rowIndex;
    if (!properties) properties = {};
    properties[MatrixDropdownRowModelBase.RowVariableName] = this;
    for (var i = 0; i < this.cells.length; i++) {
      values[MatrixDropdownRowModelBase.RowVariableName] = this.value;
      this.cells[i].runCondition(values, properties);
    }
  }
  public set value(value: any) {
    this.isSettingValue = true;
    for (var i = 0; i < this.cells.length; i++) {
      var question = this.cells[i].question;
      var val = !!value ? value[question.getValueName()] : null;
      question.updateValueFromSurvey(val);
      question.onSurveyValueChanged(val);
    }
    this.isSettingValue = false;
  }
  public onAnyValueChanged(name: string) {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].question.onAnyValueChanged(name);
    }
  }
  public getDataValueCore(valuesHash: any, key: string) {
    var survey = this.getSurvey();
    if (!!survey) {
      return (<any>survey).getDataValueCore(valuesHash, key);
    } else {
      return valuesHash[key];
    }
  }
  public getValue(name: string): any {
    var question = this.getQuestionByColumnName(name);
    return !!question ? question.value : null;
  }
  public setValue(name: string, newColumnValue: any) {
    if (this.isSettingValue) return;
    var newValue = this.value;
    var changedValue = this.getValue(name);
    var changedQuestion = this.getQuestionByColumnName(name);
    var changingValue = this.data.onRowChanging(this, name, newValue);
    if (
      !!changedQuestion &&
      !Helpers.isTwoValueEquals(changingValue, changedValue)
    ) {
      this.getQuestionByColumnName(name).value = changingValue;
    } else {
      this.data.onRowChanged(
        this,
        name,
        newValue,
        newColumnValue == null && !changedQuestion
      );
      this.onAnyValueChanged(MatrixDropdownRowModelBase.RowVariableName);
    }
  }
  getVariable(name: string): any {
    return undefined;
  }
  setVariable(name: string, newValue: any) {}
  public getComment(name: string): string {
    var result = this.getValue(name + settings.commentPrefix);
    return result ? result : "";
  }
  public setComment(name: string, newValue: string, locNotification: any) {
    this.setValue(name + settings.commentPrefix, newValue);
  }
  public get isEmpty() {
    var val = this.value;
    if (Helpers.isValueEmpty(val)) return true;
    for (var key in val) {
      if (val[key] !== undefined && val[key] !== null) return false;
    }
    return true;
  }
  public getQuestionByColumn(column: MatrixDropdownColumn): Question {
    for (var i = 0; i < this.cells.length; i++) {
      if (this.cells[i].column == column) return this.cells[i].question;
    }
    return null;
  }
  public getQuestionByColumnName(columnName: string): Question {
    for (var i = 0; i < this.cells.length; i++) {
      if (this.cells[i].column.name == columnName)
        return this.cells[i].question;
    }
    return null;
  }
  protected getSharedQuestionByName(columnName: string): Question {
    return !!this.data
      ? this.data.getSharedQuestionByName(columnName, this)
      : null;
  }
  public clearIncorrectValues(val: any) {
    for (var key in val) {
      var question = this.getQuestionByColumnName(key);
      if (question) {
        var qVal = question.value;
        question.clearIncorrectValues();
        if (!Helpers.isTwoValueEquals(qVal, question.value)) {
          this.setValue(key, question.value);
        }
      } else {
        if (!this.getSharedQuestionByName(key)) {
          this.setValue(key, null);
        }
      }
    }
  }
  public get hasCondition(): boolean {
    for (var i = 0; i < this.cells.length; i++) {
      if (this.cells[i].hasCondition) return true;
    }
    return false;
  }
  public getLocale(): string {
    return this.data ? this.data.getLocale() : "";
  }
  public getMarkdownHtml(text: string): string {
    return this.data ? this.data.getMarkdownHtml(text) : null;
  }
  public getProcessedText(text: string): string {
    return this.data ? this.data.getProcessedText(text) : text;
  }
  public locStrsChanged() {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].question.locStrsChanged();
    }
  }
  public updateCellQuestionOnColumnChanged(column: MatrixDropdownColumn) {
    for (var i = 0; i < this.cells.length; i++) {
      if (this.cells[i].column === column) {
        this.updateCellOnColumnChanged(this.cells[i]);
        return;
      }
    }
  }
  public onQuestionReadOnlyChanged(parentIsReadOnly: boolean) {
    for (var i = 0; i < this.cells.length; i++) {
      if (!!this.cells[i].question) {
        this.cells[i].question.readOnly = parentIsReadOnly;
      }
    }
  }
  protected updateCellOnColumnChanged(cell: MatrixDropdownCell) {
    cell.column.updateCellQuestion(cell.question, this);
  }
  protected buildCells(value: any) {
    this.isSettingValue = true;
    var columns = this.data.columns;
    for (var i = 0; i < columns.length; i++) {
      var column = columns[i];
      if (!column.isVisible) continue;
      var cell = this.createCell(column);
      this.cells.push(cell);
      if (!!value && !Helpers.isValueEmpty(value[column.name])) {
        cell.question.value = value[column.name];
      }
    }
    this.isSettingValue = false;
  }
  protected createCell(column: MatrixDropdownColumn): MatrixDropdownCell {
    return new MatrixDropdownCell(column, this, this.data);
  }
  geSurveyData(): ISurveyData {
    return this;
  }
  getSurvey(): ISurvey {
    return this.data ? this.data.getSurvey() : null;
  }
  protected get rowIndex(): number {
    return !!this.data ? this.data.getRowIndex(this) + 1 : -1;
  }
  //ITextProcessor
  private getProcessedTextValue(textValue: TextPreProcessorValue) {
    var firstName = new ProcessValue().getFirstName(textValue.name);
    textValue.isExists =
      firstName == MatrixDropdownRowModelBase.RowVariableName;
    textValue.canProcess = textValue.isExists;
    if (!textValue.isExists) return;
    var values = { row: this.value };
    textValue.value = new ProcessValue().getValue(textValue.name, values);
  }
  getTextProcessor(): ITextProcessor {
    return this;
  }
  processText(text: string, returnDisplayValue: boolean): string {
    text = this.textPreProcessor.process(text, returnDisplayValue);
    if (!this.getSurvey()) return text;
    return this.getSurvey().processText(text, returnDisplayValue);
  }
  processTextEx(text: string, returnDisplayValue: boolean): any {
    text = this.processText(text, returnDisplayValue);
    if (!this.getSurvey()) return text;
    var hasAllValuesOnLastRun = this.textPreProcessor.hasAllValuesOnLastRun;
    var res = this.getSurvey().processTextEx(text, returnDisplayValue, false);
    res.hasAllValuesOnLastRun =
      res.hasAllValuesOnLastRun && hasAllValuesOnLastRun;
    return res;
  }
}
export class MatrixDropdownTotalRowModel extends MatrixDropdownRowModelBase {
  constructor(data: IMatrixDropdownData) {
    super(data, null);
    this.buildCells(null);
  }
  protected createCell(column: MatrixDropdownColumn): MatrixDropdownCell {
    return new MatrixDropdownTotalCell(column, this, this.data);
  }
  public setValue(name: string, newValue: any) {
    if (!!this.data) {
      this.data.onTotalValueChanged();
    }
  }
  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
    var counter = 0;
    var prevValue;
    do {
      prevValue = Helpers.getUnbindValue(this.value);
      super.runCondition(values, properties);
      counter++;
    } while (!Helpers.isTwoValueEquals(prevValue, this.value) && counter < 3);
  }
  protected updateCellOnColumnChanged(cell: MatrixDropdownCell) {
    (<MatrixDropdownTotalCell>cell).updateCellQuestion();
  }
}

export class QuestionMatrixDropdownRenderedCell {
  private static counter = 1;
  private idValue: number;
  public minWidth: string = "";
  public width: string = "";
  public locTitle: LocalizableString;
  public cell: MatrixDropdownCell;
  public row: MatrixDropdownRowModelBase;
  public question: Question;
  public isRemoveRow: boolean;
  public matrix: QuestionMatrixDropdownModelBase;
  public constructor() {
    this.idValue = QuestionMatrixDropdownRenderedCell.counter++;
  }
  public get hasQuestion(): boolean {
    return !!this.question;
  }
  public get hasTitle(): boolean {
    return !!this.locTitle;
  }
  public get id(): number {
    return this.idValue;
  }
}

export class QuestionMatrixDropdownRenderedRow {
  private static counter = 1;
  private idValue: number;
  public cells: Array<QuestionMatrixDropdownRenderedCell> = [];
  public constructor() {
    this.idValue = QuestionMatrixDropdownRenderedRow.counter++;
  }
  public get id(): number {
    return this.idValue;
  }
}

export class QuestionMatrixDropdownRenderedTable extends Base {
  private headerRowValue: QuestionMatrixDropdownRenderedRow;
  private footerRowValue: QuestionMatrixDropdownRenderedRow;
  private hasRemoveRowsValue: boolean;
  public constructor(public matrix: QuestionMatrixDropdownModelBase) {
    super();
    this.createNewArray("rows");
    this.build();
  }
  public get showHeader(): boolean {
    return this.getPropertyValue("showHeader");
  }
  public get showFooter(): boolean {
    return this.matrix.hasFooter && this.matrix.isColumnLayoutHorizontal;
  }
  public get hasFooter(): boolean {
    return !!this.footerRow;
  }
  public get hasRemoveRows(): boolean {
    return this.hasRemoveRowsValue;
  }
  public isRequireReset(): boolean {
    return (
      this.hasRemoveRows != this.matrix.canRemoveRows ||
      !this.matrix.isColumnLayoutHorizontal
    );
  }
  public get headerRow(): QuestionMatrixDropdownRenderedRow {
    return this.headerRowValue;
  }
  public get footerRow(): QuestionMatrixDropdownRenderedRow {
    return this.footerRowValue;
  }
  public get rows(): Array<QuestionMatrixDropdownRenderedRow> {
    return this.getPropertyValue("rows");
  }
  protected build() {
    this.hasRemoveRowsValue = this.matrix.canRemoveRows;
    //build rows now
    var rows = this.matrix.visibleRows;
    this.buildHeader();
    this.buildRows();
    this.buildFooter();
  }
  public onAddedRow() {
    if (this.rows.length >= this.matrix.visibleRows.length) return;
    this.rows.push(
      this.createHorizontalRow(
        this.matrix.visibleRows[this.matrix.visibleRows.length - 1]
      )
    );
  }
  public onRemovedRow(index: number) {
    if (this.rows.length <= index) return;
    this.rows.splice(index, 1);
  }
  protected buildHeader() {
    var colHeaders =
      this.matrix.isColumnLayoutHorizontal && this.matrix.showHeader;
    var isShown =
      colHeaders ||
      (this.matrix.hasRowText && !this.matrix.isColumnLayoutHorizontal);
    this.setPropertyValue("showHeader", isShown);
    if (!isShown) return;
    this.headerRowValue = new QuestionMatrixDropdownRenderedRow();
    if (this.matrix.hasRowText && this.matrix.showHeader) {
      this.headerRow.cells.push(this.createHeaderCell(null));
    }
    if (this.matrix.isColumnLayoutHorizontal) {
      for (var i = 0; i < this.matrix.visibleColumns.length; i++) {
        var column = this.matrix.visibleColumns[i];
        if (!column.hasVisibleCell) continue;
        this.headerRow.cells.push(this.createHeaderCell(column));
      }
    } else {
      var rows = this.matrix.visibleRows;
      for (var i = 0; i < rows.length; i++) {
        this.headerRow.cells.push(this.createTextCell(rows[i].locText));
      }
      if (this.matrix.hasFooter) {
        this.headerRow.cells.push(
          this.createTextCell(this.matrix.getFooterText())
        );
      }
    }
    if (this.hasRemoveRows) {
      this.headerRow.cells.push(this.createHeaderCell(null));
    }
  }
  protected buildFooter() {
    if (!this.showFooter) return;
    this.footerRowValue = new QuestionMatrixDropdownRenderedRow();
    if (this.matrix.hasRowText) {
      this.footerRow.cells.push(
        this.createTextCell(this.matrix.getFooterText())
      );
    }
    var cells = this.matrix.visibleTotalRow.cells;
    for (var i = 0; i < cells.length; i++) {
      if (!cells[i].column.hasVisibleCell) continue;
      this.footerRow.cells.push(this.createEditCell(cells[i]));
    }
    if (this.hasRemoveRows) {
      this.footerRow.cells.push(this.createHeaderCell(null));
    }
  }
  protected buildRows() {
    var rows = this.matrix.isColumnLayoutHorizontal
      ? this.buildHorizontalRows()
      : this.buildVerticalRows();
    this.setPropertyValue("rows", rows);
  }
  private canRemoveRow(row: MatrixDropdownRowModelBase): boolean {
    return this.matrix.canRemoveRow(row);
  }
  private buildHorizontalRows(): Array<QuestionMatrixDropdownRenderedRow> {
    var rows = this.matrix.visibleRows;
    var renderedRows = [];
    for (var i = 0; i < rows.length; i++) {
      renderedRows.push(this.createHorizontalRow(rows[i]));
    }
    return renderedRows;
  }
  private createHorizontalRow(
    row: MatrixDropdownRowModelBase
  ): QuestionMatrixDropdownRenderedRow {
    var res = new QuestionMatrixDropdownRenderedRow();
    if (this.matrix.hasRowText) {
      res.cells.push(this.createTextCell(row.locText));
    }
    for (var i = 0; i < row.cells.length; i++) {
      var cell = row.cells[i];
      if (!cell.column.hasVisibleCell) continue;
      res.cells.push(this.createEditCell(cell));
    }
    if (this.hasRemoveRows) {
      res.cells.push(this.createRemoveRowCell(row));
    }
    return res;
  }
  private buildVerticalRows(): Array<QuestionMatrixDropdownRenderedRow> {
    var columns = this.matrix.columns;
    var renderedRows = [];
    for (var i = 0; i < columns.length; i++) {
      if (columns[i].isVisible && columns[i].hasVisibleCell) {
        renderedRows.push(this.createVerticalRow(columns[i], i));
      }
    }
    if (this.hasRemoveRows) {
      renderedRows.push(this.createVerticalRemoveRow());
    }
    return renderedRows;
  }
  private createVerticalRow(
    column: MatrixDropdownColumn,
    index: number
  ): QuestionMatrixDropdownRenderedRow {
    var res = new QuestionMatrixDropdownRenderedRow();
    if (this.matrix.showHeader) {
      res.cells.push(this.createTextCell(column.locTitle));
    }
    var rows = this.matrix.visibleRows;
    for (var i = 0; i < rows.length; i++) {
      res.cells.push(this.createEditCell(rows[i].cells[index]));
    }
    if (this.matrix.hasTotal) {
      res.cells.push(
        this.createEditCell(this.matrix.visibleTotalRow.cells[index])
      );
    }
    return res;
  }
  private createVerticalRemoveRow(): QuestionMatrixDropdownRenderedRow {
    var res = new QuestionMatrixDropdownRenderedRow();
    if (this.matrix.showHeader) {
      res.cells.push(this.createTextCell(null));
    }
    var rows = this.matrix.visibleRows;
    for (var i = 0; i < rows.length; i++) {
      res.cells.push(this.createRemoveRowCell(rows[i]));
    }
    if (this.matrix.hasTotal) {
      res.cells.push(this.createTextCell(null));
    }
    return res;
  }
  private createEditCell(
    cell: MatrixDropdownCell
  ): QuestionMatrixDropdownRenderedCell {
    var res = new QuestionMatrixDropdownRenderedCell();
    res.cell = cell;
    res.row = cell.row;
    res.question = cell.question;
    res.matrix = this.matrix;
    return res;
  }
  private createHeaderCell(
    column: MatrixDropdownColumn
  ): QuestionMatrixDropdownRenderedCell {
    var cell = this.createTextCell(!!column ? column.locTitle : null);
    cell.minWidth = column != null ? this.matrix.getColumnWidth(column) : "";
    cell.width = column != null ? column.width : "";
    return cell;
  }
  private createRemoveRowCell(
    row: MatrixDropdownRowModelBase
  ): QuestionMatrixDropdownRenderedCell {
    var res = new QuestionMatrixDropdownRenderedCell();
    res.row = row;
    res.isRemoveRow = this.canRemoveRow(row);
    return res;
  }
  private createTextCell(
    locTitle: LocalizableString
  ): QuestionMatrixDropdownRenderedCell {
    var cell = new QuestionMatrixDropdownRenderedCell();
    cell.locTitle = !!locTitle
      ? locTitle
      : new LocalizableString(this.matrix, false);
    return cell;
  }
}

/**
 * A base class for matrix dropdown and matrix dynamic questions.
 */
export class QuestionMatrixDropdownModelBase
  extends QuestionMatrixBaseModel<
    MatrixDropdownRowModelBase,
    MatrixDropdownColumn
  >
  implements IMatrixDropdownData {
  public static get defaultCellType() {
    return settings.matrixDefaultCellType;
  }
  public static set defaultCellType(val: string) {
    settings.matrixDefaultCellType = val;
  }
  public static addDefaultColumns(matrix: QuestionMatrixDropdownModelBase) {
    var colNames = QuestionFactory.DefaultColums;
    for (var i = 0; i < colNames.length; i++) matrix.addColumn(colNames[i]);
  }
  private renderedTableValue: QuestionMatrixDropdownRenderedTable;
  protected isRowChanging = false;
  columnsChangedCallback: () => void;
  updateCellsCallback: () => void;
  columnLayoutChangedCallback: () => void;
  onRenderedTableResetCallback: () => void;
  onRenderedTableCreatedCallback: (
    table: QuestionMatrixDropdownRenderedTable
  ) => void;

  protected createColumnValues() {
    return this.createNewArray("columns", (item: any) => {
      item.colOwner = this;
    });
  }

  constructor(public name: string) {
    super(name);
    var self = this;
    this.createItemValues("choices");
    this.createLocalizableString("optionsCaption", this);
    this.registerFunctionOnPropertyValueChanged("columns", function(
      newColumns: any
    ) {
      self.updateColumnsIndexes(newColumns);
      self.generatedVisibleRows = null;
      self.generatedTotalRow = null;
      self.resetRenderedTable();
      self.fireCallback(self.columnsChangedCallback);
    });
    this.registerFunctionOnPropertiesValueChanged(
      ["columnLayout", "addRowLocation"],
      function() {
        self.fireCallback(self.columnLayoutChangedCallback);
      }
    );
    this.registerFunctionOnPropertiesValueChanged(
      ["cellType", "optionsCaption", "columnColCount"],
      function() {
        self.generatedVisibleRows = null;
        self.resetRenderedTable();
        self.fireCallback(self.columnsChangedCallback);
      }
    );
    this.registerFunctionOnPropertiesValueChanged(
      [
        "columnLayout",
        "showHeader",
        "minRowCount",
        "isReadOnly",
        "rowCount",
        "hasFooter"
      ],
      function() {
        self.resetRenderedTable();
      }
    );
  }
  public getType(): string {
    return "matrixdropdownbase";
  }
  public get isRowsDynamic(): boolean {
    return false;
  }
  /**
   * Set columnLayout to 'vertical' to place columns vertically and rows horizontally. It makes sense when we have many columns and few rows.
   * @see columns
   * @see rowCount
   */
  public get columnLayout(): string {
    return this.getPropertyValue("columnLayout");
  }
  public set columnLayout(val: string) {
    this.setPropertyValue("columnLayout", val);
  }
  get columnsLocation(): string {
    return this.columnLayout;
  }
  set columnsLocation(val: string) {
    this.columnLayout = val;
  }
  /**
   * Returns true if columns are located horizontally
   * @see columnLayout
   */
  public get isColumnLayoutHorizontal() {
    return this.columnLayout != "vertical";
  }
  public get hasRowText(): boolean {
    return true;
  }
  public getFooterText(): LocalizableString {
    return null;
  }
  public get canRemoveRows(): boolean {
    return false;
  }
  public canRemoveRow(row: MatrixDropdownRowModelBase): boolean {
    return true;
  }
  protected onRowsChanged() {
    this.resetRenderedTable();
    super.onRowsChanged();
  }
  private lockResetRenderedTable: boolean = false;
  protected onStartRowAddingRemoving() {
    this.lockResetRenderedTable = true;
  }
  protected onEndRowAdding() {
    this.lockResetRenderedTable = false;
    if (!this.renderedTable) return;
    if (this.renderedTable.isRequireReset()) {
      this.resetRenderedTable();
    } else {
      this.renderedTable.onAddedRow();
    }
  }
  protected onEndRowRemoving(index: number) {
    this.lockResetRenderedTable = false;
    if (this.renderedTable.isRequireReset()) {
      this.resetRenderedTable();
    } else {
      this.renderedTable.onRemovedRow(index);
    }
  }
  protected resetRenderedTable() {
    if (this.lockResetRenderedTable || this.isLoadingFromJson) return;
    this.renderedTableValue = null;
    this.fireCallback(this.onRenderedTableResetCallback);
  }
  public get renderedTable(): QuestionMatrixDropdownRenderedTable {
    if (!this.renderedTableValue) {
      this.renderedTableValue = this.createRenderedTable();
      if (!!this.onRenderedTableCreatedCallback) {
        this.onRenderedTableCreatedCallback(this.renderedTableValue);
      }
    }
    return this.renderedTableValue;
  }
  protected createRenderedTable(): QuestionMatrixDropdownRenderedTable {
    return new QuestionMatrixDropdownRenderedTable(this);
  }
  protected onMatrixRowCreated(row: MatrixDropdownRowModelBase) {
    if (!this.survey) return;
    var options = {
      rowValue: row.value,
      row: row,
      column: <any>null,
      columnName: <any>null,
      cell: <any>null,
      cellQuestion: <any>null,
      value: <any>null
    };
    for (var i = 0; i < this.visibleColumns.length; i++) {
      options.column = this.visibleColumns[i];
      options.columnName = options.column.name;
      var cell = row.cells[i];
      options.cell = cell;
      options.cellQuestion = cell.question;
      options.value = cell.value;
      this.survey.matrixCellCreated(this, options);
    }
  }
  /**
   * Use this property to change the default cell type.
   */
  public get cellType(): string {
    return this.getPropertyValue("cellType", settings.matrixDefaultCellType);
  }
  public set cellType(val: string) {
    val = val.toLowerCase();
    if (this.cellType == val) return;
    this.setPropertyValue("cellType", val);
    this.updateColumnsCellType();
    this.fireCallback(this.updateCellsCallback);
  }
  private updateColumnsCellType() {
    for (var i = 0; i < this.columns.length; i++) {
      this.columns[i].defaultCellTypeChanged();
    }
  }
  private updateColumnsIndexes(cols: Array<MatrixDropdownColumn>) {
    for (var i = 0; i < cols.length; i++) {
      cols[i].setIndex(i);
    }
  }
  /**
   * The default column count for radiogroup and checkbox  cell types.
   */
  public get columnColCount(): number {
    return this.getPropertyValue("columnColCount", 0);
  }
  public set columnColCount(value: number) {
    if (value < 0 || value > 4) return;
    this.setPropertyValue("columnColCount", value);
    this.fireCallback(this.updateCellsCallback);
  }
  /**
   * Use this property to set the mimimum column width.
   */
  public get columnMinWidth(): string {
    return this.getPropertyValue("columnMinWidth", "");
  }
  public set columnMinWidth(val: string) {
    this.setPropertyValue("columnMinWidth", val);
  }
  /**
   * Set this property to true to show the horizontal scroll.
   */
  public get horizontalScroll(): boolean {
    return this.getPropertyValue("horizontalScroll", false);
  }
  public set horizontalScroll(val: boolean) {
    this.setPropertyValue("horizontalScroll", val);
  }
  public getRequiredText(): string {
    return this.survey ? this.survey.requiredText : "";
  }
  onColumnPropertiesChanged(column: MatrixDropdownColumn) {
    this.updateHasFooter();
    if (!this.generatedVisibleRows) return;
    for (var i = 0; i < this.generatedVisibleRows.length; i++) {
      this.generatedVisibleRows[i].updateCellQuestionOnColumnChanged(column);
    }
    if (!!this.generatedTotalRow) {
      this.generatedTotalRow.updateCellQuestionOnColumnChanged(column);
    }
  }
  public get hasFooter(): boolean {
    return this.getPropertyValue("hasFooter", false);
  }
  protected updateHasFooter() {
    this.setPropertyValue("hasFooter", this.hasTotal);
  }
  public get hasTotal(): boolean {
    for (var i = 0; i < this.columns.length; i++) {
      if (this.columns[i].hasTotal) return true;
    }
    return false;
  }
  getCellType(): string {
    return this.cellType;
  }
  public getConditionJson(operator: string = null, path: string = null): any {
    if (!path) return super.getConditionJson();
    var columnName = "";
    for (var i = path.length - 1; i >= 0; i--) {
      if (path[i] == ".") break;
      columnName = path[i] + columnName;
    }
    var column = this.getColumnByName(columnName);
    if (!column) return null;
    var question = column.createCellQuestion(null);
    if (!question) return null;
    return question.getConditionJson(operator);
  }
  public clearIncorrectValues() {
    var rows = this.visibleRows;
    if (!rows) return;
    for (var i = 0; i < rows.length; i++) {
      rows[i].clearIncorrectValues(this.getRowValue(i));
    }
  }
  public clearErrors() {
    super.clearErrors();
    if (!!this.generatedVisibleRows) {
      for (var i = 0; i < this.generatedVisibleRows.length; i++) {
        var row = this.generatedVisibleRows[i];
        for (var j = 0; j < row.cells.length; j++) {
          row.cells[j].question.clearErrors();
        }
      }
    }
  }

  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
    super.runCondition(values, properties);
    var counter = 0;
    var prevTotalValue;
    do {
      prevTotalValue = Helpers.getUnbindValue(this.totalValue);
      this.runCellsCondition(values, properties);
      this.runTotalsCondition(values, properties);
      counter++;
    } while (
      !Helpers.isTwoValueEquals(prevTotalValue, this.totalValue) &&
      counter < 3
    );
  }
  protected shouldRunColumnExpression(): boolean {
    return false;
  }
  protected runCellsCondition(
    values: HashTable<any>,
    properties: HashTable<any>
  ) {
    if (!this.generatedVisibleRows || !this.hasCellsCondition) return;
    var newValues = this.getRowConditionValues(values);
    var rows = this.generatedVisibleRows;
    for (var i = 0; i < rows.length; i++) {
      rows[i].runCondition(newValues, properties);
    }
    this.checkColumnsVisibility();
  }
  private checkColumnsVisibility() {
    var hasChanged = false;
    for (var i = 0; i < this.visibleColumns.length; i++) {
      if (!this.visibleColumns[i].visibleIf) continue;
      hasChanged =
        this.isColumnVisibilityChanged(this.visibleColumns[i]) || hasChanged;
    }
    if (hasChanged) {
      this.resetRenderedTable();
    }
  }
  private isColumnVisibilityChanged(column: MatrixDropdownColumn): boolean {
    var curVis = column.hasVisibleCell;
    var hasVisCell = false;
    var rows = this.generatedVisibleRows;
    for (var i = 0; i < rows.length; i++) {
      var cell = rows[i].cells[column.index];
      if (!!cell && !!cell.question && cell.question.isVisible) {
        hasVisCell = true;
        break;
      }
    }
    if (curVis != hasVisCell) {
      column.hasVisibleCell = hasVisCell;
    }
    return curVis != hasVisCell;
  }
  protected runTotalsCondition(
    values: HashTable<any>,
    properties: HashTable<any>
  ) {
    if (!this.generatedTotalRow) return;
    this.generatedTotalRow.runCondition(
      this.getRowConditionValues(values),
      properties
    );
  }
  private getRowConditionValues(values: HashTable<any>): HashTable<any> {
    var newValues: { [index: string]: any } = {};
    if (values && values instanceof Object) {
      newValues = JSON.parse(JSON.stringify(values));
    }
    var totalRow = {};
    if (!Helpers.isValueEmpty(this.totalValue)) {
      totalRow = JSON.parse(JSON.stringify(this.totalValue));
    }
    newValues["row"] = {};
    newValues["totalRow"] = totalRow;
    return newValues;
  }
  private get hasCellsCondition(): boolean {
    var rows = this.generatedVisibleRows;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].hasCondition) return true;
    }
    return false;
  }
  public locStrsChanged() {
    super.locStrsChanged();
    var rows = this.generatedVisibleRows;
    if (!rows) return;
    var columns = this.columns;
    for (var i = 0; i < columns.length; i++) {
      columns[i].locStrsChanged();
    }
    for (var i = 0; i < rows.length; i++) {
      rows[i].locStrsChanged();
    }
    if (!!this.generatedTotalRow) {
      this.generatedTotalRow.locStrsChanged();
    }
  }
  /**
   * Returns the column by it's name. Retuns null if a column with this name doesn't exist.
   * @param column
   */
  public getColumnByName(columnName: string): MatrixDropdownColumn {
    for (var i = 0; i < this.columns.length; i++) {
      if (this.columns[i].name == columnName) return this.columns[i];
    }
    return null;
  }
  getColumnName(columnName: string): MatrixDropdownColumn {
    return this.getColumnByName(columnName);
  }
  /**
   * Returns the column width.
   * @param column
   */
  public getColumnWidth(column: MatrixDropdownColumn): string {
    return column.minWidth ? column.minWidth : this.columnMinWidth;
  }
  /**
   * The default choices for dropdown, checkbox and radiogroup cell types.
   */
  public get choices(): Array<any> {
    return this.getPropertyValue("choices");
  }
  public set choices(val: Array<any>) {
    this.setPropertyValue("choices", val);
  }
  /**
   * The default options caption for dropdown cell type.
   */
  public get optionsCaption() {
    return this.getLocalizableStringText(
      "optionsCaption",
      surveyLocalization.getString("optionsCaption")
    );
  }
  public set optionsCaption(val: string) {
    this.setLocalizableStringText("optionsCaption", val);
  }
  public get locOptionsCaption() {
    return this.getLocalizableString("optionsCaption");
  }
  public addColumn(name: string, title: string = null): MatrixDropdownColumn {
    var column = new MatrixDropdownColumn(name, title);
    this.columns.push(column);
    return column;
  }
  protected getVisibleRows(): Array<MatrixDropdownRowModelBase> {
    if (this.isLoadingFromJson) return null;
    if (!this.generatedVisibleRows) {
      this.generatedVisibleRows = this.generateRows();
      this.generatedVisibleRows.forEach(row => this.onMatrixRowCreated(row));
      if (this.data) {
        this.runCellsCondition(
          this.data.getFilteredValues(),
          this.data.getFilteredProperties()
        );
      }
      this.updateValueOnRowsGeneration(this.generatedVisibleRows);
    }
    return this.generatedVisibleRows;
  }
  private updateValueOnRowsGeneration(rows: Array<MatrixDropdownRowModelBase>) {
    var oldValue = this.createNewValue(true);
    var newValue = this.createNewValue();
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var rowValue = this.getRowValue(i);
      var rValue = row.value;
      if (this.isTwoValueEquals(rowValue, rValue)) continue;
      newValue = this.getNewValueOnRowChanged(row, "", rValue, false, newValue)
        .value;
    }
    if (this.isTwoValueEquals(oldValue, newValue)) return;
    this.isRowChanging = true;
    this.setNewValue(newValue);
    this.isRowChanging = false;
  }
  public get totalValue(): any {
    if (!this.hasTotal) return {};
    return this.visibleTotalRow.value;
  }
  protected getVisibleTotalRow(): MatrixDropdownRowModelBase {
    if (this.isLoadingFromJson) return null;
    if (this.hasTotal) {
      if (!this.generatedTotalRow) {
        this.generatedTotalRow = this.generateTotalRow();
        if (this.data) {
          var properties = { survey: this.survey };
          this.runTotalsCondition(this.data.getAllValues(), properties);
        }
      }
    } else {
      this.generatedTotalRow = null;
    }
    return this.generatedTotalRow;
  }
  public get visibleTotalRow(): MatrixDropdownRowModelBase {
    return this.getVisibleTotalRow();
  }
  public onSurveyLoad() {
    super.onSurveyLoad();
    this.updateColumnsIndexes(this.columns);
    this.generatedVisibleRows = null;
    this.generatedTotalRow = null;
    this.updateHasFooter();
  }
  /**
   * Returns the row value. If the row value is empty, the object is empty: {}.
   * @param rowIndex row index from 0 to visible row count - 1.
   */
  public getRowValue(rowIndex: number) {
    if (rowIndex < 0) return null;
    var visRows = this.visibleRows;
    if (rowIndex >= visRows.length) return null;
    var newValue = this.createNewValue();
    return this.getRowValueCore(visRows[rowIndex], newValue);
  }
  /**
   * Set the row value.
   * @param rowIndex row index from 0 to visible row count - 1.
   * @param rowValue an object {"column name": columnValue,... }
   */
  public setRowValue(rowIndex: number, rowValue: any): any {
    if (rowIndex < 0) return null;
    var visRows = this.visibleRows;
    if (rowIndex >= visRows.length) return null;
    this.onRowChanged(visRows[rowIndex], "", rowValue, false);
    this.onValueChanged();
  }
  protected generateRows(): Array<MatrixDropdownRowModelBase> {
    return null;
  }
  protected generateTotalRow(): MatrixDropdownRowModelBase {
    return new MatrixDropdownTotalRowModel(this);
  }
  protected createNewValue(nullOnEmpty: boolean = false): any {
    var res = !this.value ? {} : this.createValueCopy();
    if (nullOnEmpty && this.isMatrixValueEmpty(res)) return null;
    return res;
  }
  protected getRowValueCore(
    row: MatrixDropdownRowModelBase,
    questionValue: any,
    create: boolean = false
  ): any {
    var result =
      !!questionValue && !!questionValue[row.rowName]
        ? questionValue[row.rowName]
        : null;
    if (!result && create) {
      result = {};
      if (!!questionValue) {
        questionValue[row.rowName] = result;
      }
    }
    return result;
  }

  protected getRowDisplayValue(
    row: MatrixDropdownRowModelBase,
    rowValue: any
  ): any {
    if (!rowValue) return rowValue;
    for (var key in rowValue) {
      var question = row.getQuestionByColumnName(key);
      if (!question) {
        question = this.getSharedQuestionByName(key, row);
      }
      if (!!question) {
        rowValue[key] = question.displayValue;
      }
    }
    return rowValue;
  }
  public getPlainData(
    options: {
      includeEmpty?: boolean;
      calculations?: Array<{
        propertyName: string;
      }>;
    } = {
      includeEmpty: true
    }
  ) {
    var questionPlainData = super.getPlainData(options);
    if (!!questionPlainData) {
      questionPlainData.isNode = true;
      questionPlainData.data = this.visibleRows.map(
        (row: MatrixDropdownRowModelBase) => {
          var rowDataItem = <any>{
            name: row.rowName,
            title: row.rowName,
            value: row.value,
            displayValue: this.getRowDisplayValue(row, row.value),
            getString: (val: any) =>
              typeof val === "object" ? JSON.stringify(val) : val,
            isNode: true,
            data: row.cells
              .map((cell: MatrixDropdownCell) =>
                cell.question.getPlainData(options)
              )
              .filter((d: any) => !!d)
          };
          (options.calculations || []).forEach(calculation => {
            rowDataItem[calculation.propertyName] = (<any>row)[
              calculation.propertyName
            ];
          });
          return rowDataItem;
        }
      );
    }
    return questionPlainData;
  }

  protected onBeforeValueChanged(val: any) {}
  private onSetQuestionValue() {
    if (this.isRowChanging) return;
    this.onBeforeValueChanged(this.value);
    if (!this.generatedVisibleRows || this.generatedVisibleRows.length == 0)
      return;
    this.isRowChanging = true;
    var val = this.createNewValue();
    for (var i = 0; i < this.generatedVisibleRows.length; i++) {
      var row = this.generatedVisibleRows[i];
      this.generatedVisibleRows[i].value = this.getRowValueCore(row, val);
    }
    this.isRowChanging = false;
  }
  protected setQuestionValue(newValue: any) {
    super.setQuestionValue(newValue, false);
    this.onSetQuestionValue();
    this.updateIsAnswered();
  }
  supportGoNextPageAutomatic() {
    var rows = this.generatedVisibleRows;
    if (!rows) rows = this.visibleRows;
    if (!rows) return true;
    for (var i = 0; i < rows.length; i++) {
      var cells = this.generatedVisibleRows[i].cells;
      if (!cells) continue;
      for (var colIndex = 0; colIndex < cells.length; colIndex++) {
        var question = cells[colIndex].question;
        if (
          question &&
          (!question.supportGoNextPageAutomatic() || !question.value)
        )
          return false;
      }
    }
    return true;
  }
  protected getContainsErrors(): boolean {
    return (
      super.getContainsErrors() ||
      this.checkForAnswersOrErrors(
        (question: Question) => question.containsErrors,
        false
      )
    );
  }
  protected getIsAnswered(): boolean {
    return (
      super.getIsAnswered() &&
      this.checkForAnswersOrErrors(
        (question: Question) => question.isAnswered,
        true
      )
    );
  }
  private checkForAnswersOrErrors(
    predicate: (question: Question) => boolean,
    every: boolean = false
  ) {
    var rows = this.generatedVisibleRows;
    if (!rows) return false;
    for (var i = 0; i < rows.length; i++) {
      var cells = rows[i].cells;
      if (!cells) continue;
      for (var colIndex = 0; colIndex < cells.length; colIndex++) {
        if (!cells[colIndex]) continue;
        var question = cells[colIndex].question;
        if (question && question.isVisible)
          if (predicate(question)) {
            if (!every) return true;
          } else {
            if (every) return false;
          }
      }
    }
    return every ? true : false;
  }
  public hasErrors(fireCallback: boolean = true, rec: any = null): boolean {
    var errosInColumns = this.hasErrorInColumns(fireCallback);
    return super.hasErrors(fireCallback) || errosInColumns;
  }
  protected getIsRunningValidators(): boolean {
    if (super.getIsRunningValidators()) return true;
    if (!this.generatedVisibleRows) return false;
    for (var i = 0; i < this.generatedVisibleRows.length; i++) {
      var cells = this.generatedVisibleRows[i].cells;
      if (!cells) continue;
      for (var colIndex = 0; colIndex < cells.length; colIndex++) {
        if (!cells[colIndex]) continue;
        var question = cells[colIndex].question;
        if (!!question && question.isRunningValidators) return true;
      }
    }
    return false;
  }
  public getAllErrors(): Array<SurveyError> {
    var result = super.getAllErrors();
    var rows = this.generatedVisibleRows;

    if (rows === null) return result;

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      for (var j = 0; j < row.cells.length; j++) {
        var errors = row.cells[j].question.getAllErrors();
        if (errors && errors.length > 0) {
          result = result.concat(errors);
        }
      }
    }
    return result;
  }
  private hasErrorInColumns(fireCallback: boolean): boolean {
    if (!this.generatedVisibleRows) return false;
    var res = false;
    for (var i = 0; i < this.generatedVisibleRows.length; i++) {
      var cells = this.generatedVisibleRows[i].cells;
      if (!cells) continue;
      for (var colIndex = 0; colIndex < cells.length; colIndex++) {
        if (!cells[colIndex]) continue;
        var question = cells[colIndex].question;
        if (!question || !question.visible) continue;
        question.onCompletedAsyncValidators = (hasErrors: boolean) => {
          this.raiseOnCompletedAsyncValidators();
        };
        res = question.hasErrors(fireCallback) || res;
      }
    }
    return res;
  }
  protected getFirstInputElementId(): string {
    var question = this.getFirstCellQuestion(false);
    return question ? question.inputId : super.getFirstInputElementId();
  }
  protected getFirstErrorInputElementId(): string {
    var question = this.getFirstCellQuestion(true);
    return question ? question.inputId : super.getFirstErrorInputElementId();
  }
  protected getFirstCellQuestion(onError: boolean): Question {
    if (!this.generatedVisibleRows) return null;
    for (var i = 0; i < this.generatedVisibleRows.length; i++) {
      var cells = this.generatedVisibleRows[i].cells;
      for (var colIndex = 0; colIndex < cells.length; colIndex++) {
        if (!onError) return cells[colIndex].question;
        if (cells[colIndex].question.currentErrorCount > 0)
          return cells[colIndex].question;
      }
    }
    return null;
  }
  protected onReadOnlyChanged() {
    super.onReadOnlyChanged();
    if (!this.generateRows) return;
    for (var i = 0; i < this.visibleRows.length; i++) {
      this.visibleRows[i].onQuestionReadOnlyChanged(this.isReadOnly);
    }
  }

  //IMatrixDropdownData
  public createQuestion(
    row: MatrixDropdownRowModelBase,
    column: MatrixDropdownColumn
  ): Question {
    return this.createQuestionCore(row, column);
  }
  protected createQuestionCore(
    row: MatrixDropdownRowModelBase,
    column: MatrixDropdownColumn
  ): Question {
    var question = column.createCellQuestion(row);
    if (this.isReadOnly) {
      question.readOnly = true;
    }
    question.setSurveyImpl(row);
    return question;
  }
  protected deleteRowValue(
    newValue: any,
    row: MatrixDropdownRowModelBase
  ): any {
    if (!newValue) return newValue;
    delete newValue[row.rowName];
    return this.isObject(newValue) && Object.keys(newValue).length == 0
      ? null
      : newValue;
  }
  private isDoingonAnyValueChanged = false;
  onAnyValueChanged(name: string) {
    if (
      this.isLoadingFromJson ||
      this.isDoingonAnyValueChanged ||
      !this.generatedVisibleRows
    )
      return;
    this.isDoingonAnyValueChanged = true;
    var rows = this.visibleRows;
    for (var i = 0; i < rows.length; i++) {
      rows[i].onAnyValueChanged(name);
    }
    var totalRow = this.visibleTotalRow;
    if (!!totalRow) {
      totalRow.onAnyValueChanged(name);
    }
    this.isDoingonAnyValueChanged = false;
  }
  protected isObject(value: any) {
    return value !== null && typeof value === "object";
  }
  private getOnCellValueChangedOptions(
    row: MatrixDropdownRowModelBase,
    columnName: string,
    rowValue: any
  ): any {
    var self = this;
    var getQuestion = function(colName: any) {
      for (var i = 0; self.columns.length; i++) {
        if (self.columns[i].name === colName) {
          return row.cells[i].question;
        }
      }
      return null;
    };
    return {
      row: row,
      columnName: columnName,
      rowValue: rowValue,
      value: !!rowValue ? rowValue[columnName] : null,
      getCellQuestion: getQuestion
    };
  }
  protected onCellValueChanged(
    row: MatrixDropdownRowModelBase,
    columnName: string,
    rowValue: any
  ) {
    if (!this.survey) return;
    var options = this.getOnCellValueChangedOptions(row, columnName, rowValue);
    this.survey.matrixCellValueChanged(this, options);
  }
  validateCell(
    row: MatrixDropdownRowModelBase,
    columnName: string,
    rowValue: any
  ): SurveyError {
    if (!this.survey) return;
    var self = this;
    var getQuestion = function(colName: any) {
      for (var i = 0; self.columns.length; i++) {
        if (self.columns[i].name === colName) {
          return row.cells[i].question;
        }
      }
      return null;
    };
    var options = {
      row: row,
      columnName: columnName,
      rowValue: rowValue,
      value: rowValue[columnName],
      getCellQuestion: getQuestion
    };
    return this.survey.matrixCellValidate(this, options);
  }
  onRowChanging(
    row: MatrixDropdownRowModelBase,
    columnName: string,
    rowValue: any
  ): any {
    if (!this.survey) return !!rowValue ? rowValue[columnName] : null;
    var options = this.getOnCellValueChangedOptions(row, columnName, rowValue);
    var oldRowValue = this.getRowValueCore(row, this.createNewValue(), true);
    options.oldValue = !!oldRowValue ? oldRowValue[columnName] : null;
    this.survey.matrixCellValueChanging(this, options);
    return options.value;
  }
  onRowChanged(
    row: MatrixDropdownRowModelBase,
    columnName: string,
    newRowValue: any,
    isDeletingValue: boolean
  ) {
    var oldValue = this.createNewValue(true);
    var combine = this.getNewValueOnRowChanged(
      row,
      columnName,
      newRowValue,
      isDeletingValue,
      this.createNewValue()
    );
    if (this.isTwoValueEquals(oldValue, combine.value)) return;
    this.isRowChanging = true;
    this.setNewValue(combine.value);
    this.isRowChanging = false;
    if (columnName) {
      this.onCellValueChanged(row, columnName, combine.rowValue);
    }
  }
  private getNewValueOnRowChanged(
    row: MatrixDropdownRowModelBase,
    columnName: string,
    newRowValue: any,
    isDeletingValue: boolean,
    newValue: any
  ): any {
    var rowValue = this.getRowValueCore(row, newValue, true);
    if (isDeletingValue) {
      delete rowValue[columnName];
    }
    for (var i = 0; i < row.cells.length; i++) {
      var key = row.cells[i].question.getValueName();
      delete rowValue[key];
    }
    if (newRowValue) {
      newRowValue = JSON.parse(JSON.stringify(newRowValue));
      for (var key in newRowValue) {
        if (!this.isValueEmpty(newRowValue[key])) {
          rowValue[key] = newRowValue[key];
        }
      }
    }
    if (this.isObject(rowValue) && Object.keys(rowValue).length === 0) {
      newValue = this.deleteRowValue(newValue, row);
    }
    return { value: newValue, rowValue: rowValue };
  }
  getRowIndex(row: MatrixDropdownRowModelBase): number {
    return this.visibleRows.indexOf(row);
  }
  getSharedQuestionByName(
    columnName: string,
    row: MatrixDropdownRowModelBase
  ): Question {
    if (!this.survey || !this.valueName) return null;
    var index = this.getRowIndex(row);
    if (index < 0) return null;
    return <Question>(
      this.survey.getQuestionByValueNameFromArray(
        this.valueName,
        columnName,
        index
      )
    );
  }
  onTotalValueChanged(): any {
    if (!!this.data && !!this.visibleTotalRow) {
      this.data.setValue(
        this.getValueName() + settings.matrixTotalValuePostFix,
        this.totalValue,
        false
      );
    }
  }
  public getQuestionFromArray(name: string, index: number): IQuestion {
    if (index >= this.visibleRows.length) return null;
    return this.visibleRows[index].getQuestionByColumnName(name);
  }
  private isMatrixValueEmpty(val: any) {
    if (!val) return;
    if (Array.isArray(val)) {
      for (var i = 0; i < val.length; i++) {
        if (this.isObject(val[i]) && Object.keys(val[i]).length > 0)
          return false;
      }
      return true;
    }
    return Object.keys(val).length == 0;
  }
  getSurvey(): ISurvey {
    return this.survey;
  }
}

Serializer.addClass(
  "matrixdropdowncolumn",
  [
    "!name",
    { name: "title", serializationProperty: "locTitle" },
    {
      name: "cellType",
      default: "default",
      choices: () => {
        var res = MatrixDropdownColumn.getColumnTypes();
        res.splice(0, 0, "default");
        return res;
      }
    },
    { name: "colCount", default: -1, choices: [-1, 0, 1, 2, 3, 4] },
    "isRequired:boolean",
    {
      name: "requiredErrorText:text",
      serializationProperty: "locRequiredErrorText"
    },
    "hasOther:boolean",
    "readOnly:boolean",
    "minWidth",
    "width",
    "visibleIf:condition",
    "enableIf:condition",
    "requiredIf:condition",
    {
      name: "validators:validators",
      baseClassName: "surveyvalidator",
      classNamePart: "validator"
    },
    {
      name: "totalType",
      default: "none",
      choices: ["none", "sum", "count", "min", "max", "avg"]
    },
    "totalExpression:expression",
    { name: "totalFormat", serializationProperty: "locTotalFormat" },
    {
      name: "totalDisplayStyle",
      default: "none",
      choices: ["none", "decimal", "currency", "percent"]
    },
    {
      name: "totalCurrency",
      choices: () => {
        return getCurrecyCodes();
      },
      default: "USD"
    },
    { name: "totalMaximumFractionDigits:number", default: -1 },
    { name: "totalMinimumFractionDigits:number", default: -1 }
  ],
  function() {
    return new MatrixDropdownColumn("");
  }
);

Serializer.addClass(
  "matrixdropdownbase",
  [
    {
      name: "columns:matrixdropdowncolumns",
      className: "matrixdropdowncolumn"
    },
    {
      name: "columnLayout",
      alternativeName: "columnsLocation",
      default: "horizontal",
      choices: ["horizontal", "vertical"]
    },
    "horizontalScroll:boolean",
    {
      name: "choices:itemvalue[]"
    },
    { name: "optionsCaption", serializationProperty: "locOptionsCaption" },
    {
      name: "cellType",
      default: "dropdown",
      choices: () => {
        return MatrixDropdownColumn.getColumnTypes();
      }
    },
    { name: "columnColCount", default: 0, choices: [0, 1, 2, 3, 4] },
    "columnMinWidth"
  ],
  function() {
    return new QuestionMatrixDropdownModelBase("");
  },
  "matrixbase"
);
