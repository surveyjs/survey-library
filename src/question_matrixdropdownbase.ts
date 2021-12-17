import { JsonObject, CustomPropertiesCollection, Serializer } from "./jsonobject";
import { QuestionMatrixBaseModel } from "./martixBase";
import { Question } from "./question";
import { HashTable, Helpers } from "./helpers";
import { Base } from "./base";
import { IElement, IQuestion, ISurveyData, ISurvey, ISurveyImpl, ITextProcessor, IProgressInfo, IPanel } from "./base-interfaces";
import { SurveyElement } from "./survey-element";
import { TextPreProcessorValue, QuestionTextProcessor } from "./textPreProcessor";
import { ItemValue } from "./itemvalue";
import { surveyLocalization } from "./surveyStrings";
import { QuestionFactory } from "./questionfactory";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { getCurrecyCodes } from "./question_expression";
import { FunctionFactory } from "./functionsfactory";
import { PanelModel } from "./panel";
import { settings } from "./settings";
import { KeyDuplicationError } from "./error";
import { SurveyModel } from "./survey";
import { SurveyError } from "./survey-error";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { MatrixDropdownColumn } from "./question_matrixdropdowncolumn";
import { QuestionMatrixDropdownRenderedCell, QuestionMatrixDropdownRenderedRow, QuestionMatrixDropdownRenderedTable } from "./question_matrixdropdownrendered";

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
  isValidateOnValueChanging: boolean;
  getRowIndex(row: MatrixDropdownRowModelBase): number;
  getRowValue(rowIndex: number): any;
  checkIfValueInRowDuplicated(
    checkedRow: MatrixDropdownRowModelBase,
    cellQuestion: Question
  ): boolean;
  hasDetailPanel(row: MatrixDropdownRowModelBase): boolean;
  getIsDetailPanelShowing(row: MatrixDropdownRowModelBase): boolean;
  setIsDetailPanelShowing(row: MatrixDropdownRowModelBase, val: boolean): void;
  createRowDetailPanel(row: MatrixDropdownRowModelBase): PanelModel;
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
  getMarkdownHtml(text: string, name: string): string;
  getRenderer(name: string): string;
  getRendererContext(locStr: LocalizableString): any;
  getProcessedText(text: string): string;
  getParentTextProcessor(): ITextProcessor;
  getSharedQuestionByName(
    columnName: string,
    row: MatrixDropdownRowModelBase
  ): Question;
  onTotalValueChanged(): any;
  getSurvey(): ISurvey;
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
  public locStrsChanged() {
    this.question.locStrsChanged();
  }
  protected createQuestion(
    column: MatrixDropdownColumn,
    row: MatrixDropdownRowModelBase,
    data: IMatrixDropdownData
  ): Question {
    var res = data.createQuestion(this.row, this.column);
    res.validateValueCallback = function () {
      return data.validateCell(row, column.name, row.value);
    };
    CustomPropertiesCollection.getProperties(column.getType()).forEach(
      (property) => {
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
  public locStrsChanged() {
    this.updateCellQuestion();
    super.locStrsChanged();
  }
  public updateCellQuestion() {
    this.question.locCalculation();
    this.column.updateCellQuestion(this.question, null, function (json) {
      delete json["defaultValue"];
    });
    this.question.expression = this.getTotalExpression();
    this.question.format = this.column.totalFormat;
    this.question.currency = this.column.totalCurrency;
    this.question.displayStyle = this.column.totalDisplayStyle;
    this.question.maximumFractionDigits = this.column.totalMaximumFractionDigits;
    this.question.minimumFractionDigits = this.column.totalMinimumFractionDigits;
    this.question.unlocCalculation();
    this.question.runIfReadOnly = true;
  }
  public getTotalExpression(): string {
    if (!!this.column.totalExpression) return this.column.totalExpression;
    if (this.column.totalType == "none") return "";
    var funName = this.column.totalType + "InArray";
    if (!FunctionFactory.Instance.hasFunction(funName)) return "";
    return funName + "({self}, '" + this.column.name + "')";
  }
}

class MatrixDropdownRowTextProcessor extends QuestionTextProcessor {
  constructor(
    protected row: MatrixDropdownRowModelBase,
    protected variableName: string,
    private parentTextProcessor: ITextProcessor
  ) {
    super(variableName);
  }
  protected getParentTextProcessor(): ITextProcessor { return this.parentTextProcessor; }
  protected get survey(): ISurvey {
    return this.row.getSurvey();
  }
  protected getValues(): any {
    return this.row.value;
  }
  protected getQuestionByName(name: string): Question {
    return this.row.getQuestionByName(name);
  }
  protected onCustomProcessText(textValue: TextPreProcessorValue): boolean {
    if (textValue.name == MatrixDropdownRowModelBase.IndexVariableName) {
      textValue.isExists = true;
      textValue.value = this.row.rowIndex;
      return true;
    }
    if (textValue.name == MatrixDropdownRowModelBase.RowValueVariableName) {
      textValue.isExists = true;
      textValue.value = this.row.rowName;
      return true;
    }
    return false;
  }
}

export class MatrixDropdownRowModelBase
implements ISurveyData, ISurveyImpl, ILocalizableOwner {
  public static RowVariableName = "row";
  public static OwnerVariableName = "self";
  public static IndexVariableName = "rowIndex";
  public static RowValueVariableName = "rowValue";

  private static idCounter: number = 1;
  private static getId(): string {
    return "srow_" + MatrixDropdownRowModelBase.idCounter++;
  }
  protected data: IMatrixDropdownData;
  protected isSettingValue: boolean = false;
  private idValue: string;
  private textPreProcessor: MatrixDropdownRowTextProcessor;
  private detailPanelValue: PanelModel = null;

  public cells: Array<MatrixDropdownCell> = [];
  public showHideDetailPanelClick: any;
  public onDetailPanelShowingChanged: () => void;

  constructor(data: IMatrixDropdownData, value: any) {
    this.data = data;
    this.subscribeToChanges(value);
    this.textPreProcessor = new MatrixDropdownRowTextProcessor(
      this,
      MatrixDropdownRowModelBase.RowVariableName, !!data ? data.getParentTextProcessor() : null
    );
    this.showHideDetailPanelClick = () => {
      if (this.getSurvey().isDesignMode) return true;
      this.showHideDetailPanel();
    };
    this.idValue = MatrixDropdownRowModelBase.getId();
  }
  public get id(): string {
    return this.idValue;
  }
  public get rowName(): any {
    return null;
  }
  public get text(): any {
    return this.rowName;
  }
  public get value(): any {
    var result: any = {};
    var questions = this.questions;
    for (var i = 0; i < questions.length; i++) {
      var question = questions[i];
      if (!question.isEmpty()) {
        result[question.getValueName()] = question.value;
      }
      if (
        !!question.comment &&
        !!this.getSurvey() &&
        this.getSurvey().storeOthersAsComment
      ) {
        result[question.getValueName() + settings.commentPrefix] =
          question.comment;
      }
    }
    return result;
  }
  public set value(value: any) {
    this.isSettingValue = true;
    this.subscribeToChanges(value);
    var questions = this.questions;
    for (var i = 0; i < questions.length; i++) {
      var question = questions[i];
      var val = this.getCellValue(value, question.getValueName());
      var oldComment = question.comment;
      var comment = !!value
        ? value[question.getValueName() + settings.commentPrefix]
        : "";
      if (comment == undefined) comment = "";
      question.updateValueFromSurvey(val);
      if (!!comment || this.isTwoValueEquals(oldComment, question.comment)) {
        question.updateCommentFromSurvey(comment);
      }
      question.onSurveyValueChanged(val);
    }
    this.isSettingValue = false;
  }
  public get locText(): LocalizableString {
    return null;
  }
  public get hasPanel(): boolean {
    if (!this.data) return false;
    return this.data.hasDetailPanel(this);
  }
  public get detailPanel(): PanelModel {
    return this.detailPanelValue;
  }
  public get detailPanelId(): string {
    return !!this.detailPanel ? this.detailPanel.id : "";
  }
  public get isDetailPanelShowing(): boolean {
    return !!this.data ? this.data.getIsDetailPanelShowing(this) : false;
  }
  private setIsDetailPanelShowing(val: boolean) {
    if (!!this.data) {
      this.data.setIsDetailPanelShowing(this, val);
    }
    if (!!this.onDetailPanelShowingChanged) {
      this.onDetailPanelShowingChanged();
    }
  }
  private showHideDetailPanel() {
    if (this.isDetailPanelShowing) {
      this.hideDetailPanel();
    } else {
      this.showDetailPanel();
    }
  }
  private isCreatingDetailPanel = false;
  public showDetailPanel() {
    this.ensureDetailPanel();
    if (!this.detailPanelValue) return;
    this.setIsDetailPanelShowing(true);
  }
  public hideDetailPanel(destroyPanel: boolean = false) {
    this.setIsDetailPanelShowing(false);
    if (destroyPanel) {
      this.detailPanelValue = null;
    }
  }
  private ensureDetailPanel() {
    if (this.isCreatingDetailPanel) return;
    if (!!this.detailPanelValue || !this.hasPanel || !this.data) return;
    this.isCreatingDetailPanel = true;
    this.detailPanelValue = this.data.createRowDetailPanel(this);
    var questions = this.detailPanelValue.questions;
    var value = this.data.getRowValue(this.data.getRowIndex(this));
    if (!Helpers.isValueEmpty(value)) {
      for (var i = 0; i < questions.length; i++) {
        var key = questions[i].getValueName();
        if (!Helpers.isValueEmpty(value[key])) {
          questions[i].value = value[key];
        }
      }
    }
    this.detailPanelValue.setSurveyImpl(this);
    this.isCreatingDetailPanel = false;
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
    values[MatrixDropdownRowModelBase.RowValueVariableName] = this.rowName;
    if (!properties) properties = {};
    properties[MatrixDropdownRowModelBase.RowVariableName] = this;
    for (var i = 0; i < this.cells.length; i++) {
      values[MatrixDropdownRowModelBase.RowVariableName] = this.value;
      this.cells[i].runCondition(values, properties);
    }
    if (!!this.detailPanel) {
      this.detailPanel.runCondition(values, properties);
    }
  }
  public clearValue() {
    var questions = this.questions;
    for (var i = 0; i < questions.length; i++) {
      questions[i].clearValue();
    }
  }
  public onAnyValueChanged(name: string) {
    var questions = this.questions;
    for (var i = 0; i < questions.length; i++) {
      questions[i].onAnyValueChanged(name);
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
    var question = this.getQuestionByName(name);
    return !!question ? question.value : null;
  }
  public setValue(name: string, newColumnValue: any) {
    this.setValueCore(name, newColumnValue, false);
  }
  getVariable(name: string): any {
    return undefined;
  }
  setVariable(name: string, newValue: any) { }
  public getComment(name: string): string {
    var question = this.getQuestionByName(name);
    return !!question ? question.comment : "";
  }
  public setComment(name: string, newValue: string, locNotification: any) {
    this.setValueCore(name, newValue, true);
  }
  private setValueCore(name: string, newColumnValue: any, isComment: boolean) {
    if (this.isSettingValue) return;
    this.updateQuestionsValue(name, newColumnValue, isComment);
    var newValue = this.value;
    var changedName = isComment ? name + settings.commentPrefix : name;
    var changedValue = isComment ? this.getComment(name) : this.getValue(name);
    var changedQuestion = this.getQuestionByName(name);
    var changingValue = this.data.onRowChanging(this, changedName, newValue);
    if (
      !!changedQuestion &&
      !this.isTwoValueEquals(changingValue, changedValue)
    ) {
      if (isComment) {
        changedQuestion.comment = changingValue;
      } else {
        changedQuestion.value = changingValue;
      }
    } else {
      if (
        this.data.isValidateOnValueChanging &&
        this.hasQuestonError(changedQuestion)
      )
        return;
      this.data.onRowChanged(
        this,
        changedName,
        newValue,
        newColumnValue == null && !changedQuestion
      );
      this.onAnyValueChanged(MatrixDropdownRowModelBase.RowVariableName);
    }
  }

  private updateQuestionsValue(
    name: string,
    newColumnValue: any,
    isComment: boolean
  ) {
    if (!this.detailPanel) return;
    var colQuestion = this.getQuestionByColumnName(name);
    var detailQuestion = this.detailPanel.getQuestionByName(name);
    if (!colQuestion || !detailQuestion) return;
    var isColQuestion = this.isTwoValueEquals(
      newColumnValue,
      isComment ? colQuestion.comment : colQuestion.value
    );
    var question = isColQuestion ? detailQuestion : colQuestion;
    this.isSettingValue = true;
    if (!isComment) {
      question.value = newColumnValue;
    } else {
      question.comment = newColumnValue;
    }
    this.isSettingValue = false;
  }

  private hasQuestonError(question: Question): boolean {
    if (!question) return false;
    if (
      question.hasErrors(true, {
        isOnValueChanged: !this.data.isValidateOnValueChanging,
      })
    )
      return true;
    if (question.isEmpty()) return false;
    var cell = this.getCellByColumnName(question.name);
    if (!cell || !cell.column || !cell.column.isUnique) return false;
    return this.data.checkIfValueInRowDuplicated(this, question);
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
    var cell = this.getCellByColumn(column);
    return !!cell ? cell.question : null;
  }
  public getCellByColumn(column: MatrixDropdownColumn): MatrixDropdownCell {
    for (var i = 0; i < this.cells.length; i++) {
      if (this.cells[i].column == column) return this.cells[i];
    }
    return null;
  }
  private getCellByColumnName(columnName: string): MatrixDropdownCell {
    for (var i = 0; i < this.cells.length; i++) {
      if (this.cells[i].column.name == columnName) return this.cells[i];
    }
    return null;
  }
  public getQuestionByColumnName(columnName: string): Question {
    var cell = this.getCellByColumnName(columnName);
    return !!cell ? cell.question : null;
  }
  public get questions(): Array<Question> {
    var res: Array<Question> = [];
    for (var i = 0; i < this.cells.length; i++) {
      res.push(this.cells[i].question);
    }
    var detailQuestions = !!this.detailPanel ? this.detailPanel.questions : [];
    for (var i = 0; i < detailQuestions.length; i++) {
      res.push(detailQuestions[i]);
    }
    return res;
  }
  public getQuestionByName(name: string): Question {
    var res = this.getQuestionByColumnName(name);
    if (!!res) return res;
    return !!this.detailPanel ? this.detailPanel.getQuestionByName(name) : null;
  }
  public getQuestionsByName(name: string): Array<Question> {
    let res = [];
    let q = this.getQuestionByColumnName(name);
    if (!!q) res.push(q);
    if (!!this.detailPanel) {
      q = this.detailPanel.getQuestionByName(name);
      if (!!q) res.push(q);
    }
    return res;
  }
  protected getSharedQuestionByName(columnName: string): Question {
    return !!this.data
      ? this.data.getSharedQuestionByName(columnName, this)
      : null;
  }
  public clearIncorrectValues(val: any) {
    for (var key in val) {
      var question = this.getQuestionByName(key);
      if (question) {
        var qVal = question.value;
        question.clearIncorrectValues();
        if (!this.isTwoValueEquals(qVal, question.value)) {
          this.setValue(key, question.value);
        }
      } else {
        if (
          !this.getSharedQuestionByName(key) &&
          key.indexOf(settings.matrixTotalValuePostFix) < 0
        ) {
          this.setValue(key, null);
        }
      }
    }
  }
  public getLocale(): string {
    return this.data ? this.data.getLocale() : "";
  }
  public getMarkdownHtml(text: string, name: string): string {
    return this.data ? this.data.getMarkdownHtml(text, name) : null;
  }
  public getRenderer(name: string): string {
    return this.data ? this.data.getRenderer(name) : null;
  }
  public getRendererContext(locStr: LocalizableString): any {
    return this.data ? this.data.getRendererContext(locStr) : locStr;
  }
  public getProcessedText(text: string): string {
    return this.data ? this.data.getProcessedText(text) : text;
  }
  public locStrsChanged() {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].locStrsChanged();
    }
    if (!!this.detailPanel) {
      this.detailPanel.locStrsChanged();
    }
  }
  public updateCellQuestionOnColumnChanged(
    column: MatrixDropdownColumn,
    name: string,
    newValue: any
  ) {
    var cell = this.getCellByColumn(column);
    if (!cell) return;
    this.updateCellOnColumnChanged(cell, name, newValue);
  }
  public updateCellQuestionOnColumnItemValueChanged(
    column: MatrixDropdownColumn,
    propertyName: string,
    obj: ItemValue,
    name: string,
    newValue: any,
    oldValue: any
  ) {
    var cell = this.getCellByColumn(column);
    if (!cell) return;
    this.updateCellOnColumnItemValueChanged(
      cell,
      propertyName,
      obj,
      name,
      newValue,
      oldValue
    );
  }
  public onQuestionReadOnlyChanged(parentIsReadOnly: boolean) {
    var questions = this.questions;
    for (var i = 0; i < questions.length; i++) {
      questions[i].readOnly = parentIsReadOnly;
    }
    if (!!this.detailPanel) {
      this.detailPanel.readOnly = parentIsReadOnly;
    }
  }
  public hasErrors(
    fireCallback: boolean,
    rec: any,
    raiseOnCompletedAsyncValidators: () => void
  ): boolean {
    var res = false;
    var cells = this.cells;
    if (!cells) return res;
    for (var colIndex = 0; colIndex < cells.length; colIndex++) {
      if (!cells[colIndex]) continue;
      var question = cells[colIndex].question;
      if (!question || !question.visible) continue;
      question.onCompletedAsyncValidators = (hasErrors: boolean) => {
        raiseOnCompletedAsyncValidators();
      };
      if (!!rec && rec.isOnValueChanged === true && question.isEmpty())
        continue;
      res = question.hasErrors(fireCallback, rec) || res;
    }
    if (this.hasPanel) {
      this.ensureDetailPanel();
      var panelHasError = this.detailPanel.hasErrors(fireCallback, false, rec);
      if (!rec.hideErroredPanel && panelHasError && fireCallback) {
        if (rec.isSingleDetailPanel) {
          rec.hideErroredPanel = true;
        }
        this.showDetailPanel();
      }
      res = panelHasError || res;
    }
    return res;
  }

  protected updateCellOnColumnChanged(
    cell: MatrixDropdownCell,
    name: string,
    newValue: any
  ) {
    cell.question[name] = newValue;
  }
  public updateCellOnColumnItemValueChanged(
    cell: MatrixDropdownCell,
    propertyName: string,
    obj: ItemValue,
    name: string,
    newValue: any,
    oldValue: any
  ) {
    var items = cell.question[propertyName];
    if (!Array.isArray(items)) return;
    var val = name === "value" ? oldValue : obj["value"];
    var item = ItemValue.getItemByValue(items, val);
    if (!item) return;
    item[name] = newValue;
  }
  protected buildCells(value: any) {
    this.isSettingValue = true;
    var columns = this.data.columns;
    for (var i = 0; i < columns.length; i++) {
      var column = columns[i];
      if (!column.isVisible) continue;
      var cell = this.createCell(column);
      this.cells.push(cell);
      var cellValue = this.getCellValue(value, column.name);
      if (!Helpers.isValueEmpty(cellValue)) {
        cell.question.value = cellValue;
        var commentKey = column.name + settings.commentPrefix;
        if (!!value && !Helpers.isValueEmpty(value[commentKey])) {
          cell.question.comment = value[commentKey];
        }
      }
    }
    this.isSettingValue = false;
  }
  protected isTwoValueEquals(val1: any, val2: any): boolean {
    return Helpers.isTwoValueEquals(val1, val2, false, true, false);
  }
  private getCellValue(value: any, name: string): any {
    if (!!this.editingObj)
      return Serializer.getObjPropertyValue(this.editingObj, name);
    return !!value ? value[name] : undefined;
  }
  protected createCell(column: MatrixDropdownColumn): MatrixDropdownCell {
    return new MatrixDropdownCell(column, this, this.data);
  }
  getSurveyData(): ISurveyData {
    return this;
  }
  getSurvey(): ISurvey {
    return this.data ? this.data.getSurvey() : null;
  }
  getTextProcessor(): ITextProcessor {
    return this.textPreProcessor;
  }
  public get rowIndex(): number {
    return !!this.data ? this.data.getRowIndex(this) + 1 : -1;
  }
  public get editingObj(): Base {
    return this.editingObjValue;
  }
  private onEditingObjPropertyChanged: (sender: Base, options: any) => void;
  private editingObjValue: Base;
  public dispose() {
    if (!!this.editingObj) {
      this.editingObj.onPropertyChanged.remove(
        this.onEditingObjPropertyChanged
      );
      this.editingObjValue = null;
    }
  }
  private subscribeToChanges(value: any) {
    if (!value || !value.getType || !value.onPropertyChanged) return;
    if (value === this.editingObj) return;
    this.editingObjValue = <Base>value;
    this.onEditingObjPropertyChanged = (sender: Base, options: any) => {
      this.updateOnSetValue(options.name, options.newValue);
    };
    this.editingObj.onPropertyChanged.add(this.onEditingObjPropertyChanged);
  }
  private updateOnSetValue(name: string, newValue: any) {
    this.isSettingValue = true;
    let questions = this.getQuestionsByName(name);
    for (let i = 0; i < questions.length; i++) {
      questions[i].value = newValue;
    }
    this.isSettingValue = false;
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
    if (!!this.data && !this.isSettingValue) {
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
  protected updateCellOnColumnChanged(
    cell: MatrixDropdownCell,
    name: string,
    newValue: any
  ) {
    (<MatrixDropdownTotalCell>cell).updateCellQuestion();
  }
}

/**
 * A base class for matrix dropdown and matrix dynamic questions.
 */
export class QuestionMatrixDropdownModelBase extends QuestionMatrixBaseModel<MatrixDropdownRowModelBase, MatrixDropdownColumn> implements IMatrixDropdownData {
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
  private detailPanelValue: PanelModel;
  protected isRowChanging = false;
  columnsChangedCallback: () => void;
  onRenderedTableResetCallback: () => void;
  onRenderedTableCreatedCallback: (
    table: QuestionMatrixDropdownRenderedTable
  ) => void;
  onCellCreatedCallback: (options: any) => void;
  onCellValueChangedCallback: (options: any) => void;
  onHasDetailPanelCallback: (row: MatrixDropdownRowModelBase) => boolean;
  onCreateDetailPanelCallback: (
    row: MatrixDropdownRowModelBase,
    panel: PanelModel
  ) => void;
  onCreateDetailPanelRenderedRowCallback: (
    renderedRow: QuestionMatrixDropdownRenderedRow
  ) => void;

  protected createColumnValues() {
    return this.createNewArray(
      "columns",
      (item: any) => {
        item.colOwner = this;
      },
      (item: any) => {
        item.colOwner = null;
      }
    );
  }

  constructor(name: string) {
    super(name);
    this.createItemValues("choices");
    this.createLocalizableString("optionsCaption", this, false, true);
    this.createLocalizableString("keyDuplicationError", this, false, true);
    this.detailPanelValue = this.createNewDetailPanel();
    this.detailPanel.selectedElementInDesign = this;
    this.detailPanel.renderWidth = "100%";
    this.registerFunctionOnPropertyValueChanged(
      "columns",
      (newColumns: any) => {
        this.updateColumnsAndRows();
      }
    );
    this.registerFunctionOnPropertyValueChanged("cellType", () => {
      this.updateColumnsAndRows();
    });
    this.registerFunctionOnPropertiesValueChanged(
      ["optionsCaption", "columnColCount", "rowTitleWidth", "choices"],
      () => {
        this.clearRowsAndResetRenderedTable();
      }
    );
    this.registerFunctionOnPropertiesValueChanged(
      [
        "columnLayout",
        "addRowLocation",
        "hideColumnsIfEmpty",
        "showHeader",
        "minRowCount",
        "isReadOnly",
        "rowCount",
        "hasFooter",
        "detailPanelMode",
      ],
      () => {
        this.resetRenderedTable();
      }
    );
  }
  public getType(): string {
    return "matrixdropdownbase";
  }
  public dispose() {
    super.dispose();
    this.clearGeneratedRows();
  }
  public get hasSingleInput(): boolean {
    return false;
  }
  public get isRowsDynamic(): boolean {
    return false;
  }
  private isUpdating: boolean;
  protected get isUpdateLocked(): boolean {
    return this.isLoadingFromJson || this.isUpdating;
  }
  public beginUpdate(): void {
    this.isUpdating = true;
  }
  public endUpdate(): void {
    this.isUpdating = false;
    this.updateColumnsAndRows();
  }
  protected updateColumnsAndRows(): void {
    this.updateColumnsIndexes(this.columns);
    this.updateColumnsCellType();
    this.generatedTotalRow = null;
    this.clearRowsAndResetRenderedTable();
  }
  public itemValuePropertyChanged(
    item: ItemValue,
    name: string,
    oldValue: any,
    newValue: any
  ) {
    super.itemValuePropertyChanged(item, name, oldValue, newValue);
    if (item.ownerPropertyName === "choices") {
      this.clearRowsAndResetRenderedTable();
    }
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
  /**
   * Set the value to "underRow" to show the detailPanel under the row.
   */
  public get detailPanelMode(): string {
    return this.getPropertyValue("detailPanelMode");
  }
  public set detailPanelMode(val: string) {
    this.setPropertyValue("detailPanelMode", val);
  }
  /**
   * The detail template Panel. This panel is used as a template on creating detail panel for a row.
   * @see  detailElements
   * @see detailPanelMode
   */
  public get detailPanel(): PanelModel {
    return this.detailPanelValue;
  }
  public getPanel(): IPanel {
    return this.detailPanel;
  }
  /**
   * The template Panel elements, questions and panels.
   * @see  detailPanel
   * @see detailPanelMode
   */
  public get detailElements(): Array<IElement> {
    return this.detailPanel.elements;
  }
  protected createNewDetailPanel(): PanelModel {
    return Serializer.createClass("panel");
  }
  public get hasRowText(): boolean {
    return true;
  }
  public getFooterText(): LocalizableString {
    return null;
  }
  public get canAddRow(): boolean {
    return false;
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
  protected onEndRowRemoving(row: MatrixDropdownRowModelBase) {
    this.lockResetRenderedTable = false;
    if (this.renderedTable.isRequireReset()) {
      this.resetRenderedTable();
    } else {
      if (!!row) {
        this.renderedTable.onRemovedRow(row);
      }
    }
  }
  private get renderedTableValue(): QuestionMatrixDropdownRenderedTable {
    return this.getPropertyValue("renderedTable", null);
  }
  private set renderedTableValue(val: QuestionMatrixDropdownRenderedTable) {
    this.setPropertyValue("renderedTable", val);
  }
  protected clearRowsAndResetRenderedTable() {
    this.clearGeneratedRows();
    this.resetRenderedTable();
    this.fireCallback(this.columnsChangedCallback);
  }
  protected resetRenderedTable() {
    if (this.lockResetRenderedTable || this.isUpdateLocked) return;
    this.renderedTableValue = null;
    this.fireCallback(this.onRenderedTableResetCallback);
  }
  protected clearGeneratedRows() {
    if (!this.generatedVisibleRows) return;
    for (var i = 0; i < this.generatedVisibleRows.length; i++) {
      this.generatedVisibleRows[i].dispose();
    }
    super.clearGeneratedRows();
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
      value: <any>null,
    };
    for (var i = 0; i < this.visibleColumns.length; i++) {
      options.column = this.visibleColumns[i];
      options.columnName = options.column.name;
      var cell = row.cells[i];
      options.cell = cell;
      options.cellQuestion = cell.question;
      options.value = cell.value;
      if (!!this.onCellCreatedCallback) {
        this.onCellCreatedCallback(options);
      }
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
    this.setPropertyValue("cellType", val);
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
    return this.getPropertyValue("columnColCount");
  }
  public set columnColCount(value: number) {
    if (value < 0 || value > 4) return;
    this.setPropertyValue("columnColCount", value);
  }
  /**
   * Use this property to set the minimum column width.
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
  /**
   * The Matrix toolbar and inner panel toolbars get adaptive if the property is set to true.
   */
  public get allowAdaptiveActions(): boolean {
    return this.getPropertyValue("allowAdaptiveActions");
  }
  public set allowAdaptiveActions(val: boolean) {
    this.setPropertyValue("allowAdaptiveActions", val);
    if(!!this.detailPanel) {
      this.detailPanel.allowAdaptiveActions = val;
    }
  }
  public getRequiredText(): string {
    return this.survey ? this.survey.requiredText : "";
  }
  onColumnPropertyChanged(
    column: MatrixDropdownColumn,
    name: string,
    newValue: any
  ) {
    this.updateHasFooter();
    if (!this.generatedVisibleRows) return;
    for (var i = 0; i < this.generatedVisibleRows.length; i++) {
      this.generatedVisibleRows[i].updateCellQuestionOnColumnChanged(
        column,
        name,
        newValue
      );
    }
    if (!!this.generatedTotalRow) {
      this.generatedTotalRow.updateCellQuestionOnColumnChanged(
        column,
        name,
        newValue
      );
    }
    this.onColumnsChanged();
    if (name == "isRequired") {
      this.resetRenderedTable();
    }
    if (column.isShowInMultipleColumns) {
      this.onShowInMultipleColumnsChanged(column);
    }
  }
  onColumnItemValuePropertyChanged(
    column: MatrixDropdownColumn,
    propertyName: string,
    obj: ItemValue,
    name: string,
    newValue: any,
    oldValue: any
  ) {
    if (!this.generatedVisibleRows) return;
    for (var i = 0; i < this.generatedVisibleRows.length; i++) {
      this.generatedVisibleRows[i].updateCellQuestionOnColumnItemValueChanged(
        column,
        propertyName,
        obj,
        name,
        newValue,
        oldValue
      );
    }
  }

  onShowInMultipleColumnsChanged(column: MatrixDropdownColumn) {
    this.clearGeneratedRows();
    this.resetRenderedTable();
  }
  onColumnCellTypeChanged(column: MatrixDropdownColumn) {
    this.clearGeneratedRows();
    this.resetRenderedTable();
  }
  public getRowTitleWidth(): string {
    return "";
  }
  public get hasFooter(): boolean {
    return this.getPropertyValue("hasFooter", false);
  }
  public getAddRowLocation(): string {
    return "default";
  }
  public getShowColumnsIfEmpty(): boolean {
    return false;
  }
  protected updateShowTableAndAddRow() {
    if (!!this.renderedTable) {
      this.renderedTable.updateShowTableAndAddRow();
    }
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
  getCustomCellType(column: MatrixDropdownColumn, row: MatrixDropdownRowModelBase, cellType: string): string {
    if (!this.survey) return cellType;
    var options = {
      rowValue: row.value,
      row: row,
      column: column,
      columnName: column.name,
      cellType: cellType
    };
    this.survey.matrixCellCreating(this, options);
    return options.cellType;
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
    if (!this.generatedVisibleRows) return;
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
    var newValues = values;
    if (!newValues) newValues = {};
    /*
    var newValues: { [index: string]: any } = {};
    if (values && values instanceof Object) {
      newValues = JSON.parse(JSON.stringify(values));
    }
    */
    var totalRow = {};
    if (!this.isValueEmpty(this.totalValue)) {
      totalRow = JSON.parse(JSON.stringify(this.totalValue));
    }
    newValues["row"] = {};
    newValues["totalRow"] = totalRow;
    return newValues;
  }
  public locStrsChanged() {
    super.locStrsChanged();
    var columns = this.columns;
    for (var i = 0; i < columns.length; i++) {
      columns[i].locStrsChanged();
    }
    var rows = this.generatedVisibleRows;
    if (!rows) return;
    for (var i = 0; i < rows.length; i++) {
      rows[i].locStrsChanged();
    }
    if (!!this.generatedTotalRow) {
      this.generatedTotalRow.locStrsChanged();
    }
  }
  /**
   * Returns the column by it's name. Returns null if a column with this name doesn't exist.
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
    return this.getLocalizableStringText("optionsCaption");
  }
  public set optionsCaption(val: string) {
    this.setLocalizableStringText("optionsCaption", val);
  }
  public get locOptionsCaption() {
    return this.getLocalizableString("optionsCaption");
  }
  /**
   * The duplication value error text. Set it to show the text different from the default.
   * @see MatrixDropdownColumn.isUnique
   */
  public get keyDuplicationError() {
    return this.getLocalizableStringText("keyDuplicationError");
  }
  public set keyDuplicationError(val: string) {
    this.setLocalizableStringText("keyDuplicationError", val);
  }
  get locKeyDuplicationError() {
    return this.getLocalizableString("keyDuplicationError");
  }
  public get storeOthersAsComment(): boolean {
    return !!this.survey ? this.survey.storeOthersAsComment : false;
  }
  public addColumn(name: string, title: string = null): MatrixDropdownColumn {
    var column = new MatrixDropdownColumn(name, title);
    this.columns.push(column);
    return column;
  }
  protected getVisibleRows(): Array<MatrixDropdownRowModelBase> {
    if (this.isUpdateLocked) return null;
    if (!this.generatedVisibleRows) {
      this.generatedVisibleRows = this.generateRows();
      this.generatedVisibleRows.forEach((row) => this.onMatrixRowCreated(row));
      if (this.data) {
        this.runCellsCondition(
          this.data.getFilteredValues(),
          this.data.getFilteredProperties()
        );
      }
      this.updateValueOnRowsGeneration(this.generatedVisibleRows);
      this.updateIsAnswered();
    }
    return this.generatedVisibleRows;
  }
  private updateValueOnRowsGeneration(rows: Array<MatrixDropdownRowModelBase>) {
    var oldValue = this.createNewValue(true);
    var newValue = this.createNewValue();
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (!!row.editingObj) continue;
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
    if (!this.hasTotal || !this.visibleTotalRow) return {};
    return this.visibleTotalRow.value;
  }
  protected getVisibleTotalRow(): MatrixDropdownRowModelBase {
    if (this.isUpdateLocked) return null;
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
    this.clearGeneratedRows();
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
  public checkIfValueInRowDuplicated(
    checkedRow: MatrixDropdownRowModelBase,
    cellQuestion: Question
  ): boolean {
    if (!this.generatedVisibleRows) return false;
    var res = false;
    for (var i = 0; i < this.generatedVisibleRows.length; i++) {
      var row = this.generatedVisibleRows[i];
      if (checkedRow === row) continue;
      if (row.getValue(cellQuestion.name) == cellQuestion.value) {
        res = true;
        break;
      }
    }
    if (res) {
      this.addDuplicationError(cellQuestion);
    } else {
      cellQuestion.clearErrors();
    }
    return res;
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
    visRows[rowIndex].value = rowValue;
    this.onRowChanged(visRows[rowIndex], "", rowValue, false);
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
  protected getRowObj(row: MatrixDropdownRowModelBase): any {
    var obj = this.getRowValueCore(row, this.value);
    return !!obj && !!obj.getType ? obj : null;
  }
  protected getRowDisplayValue(
    keysAsText: boolean,
    row: MatrixDropdownRowModelBase,
    rowValue: any
  ): any {
    if (!rowValue) return rowValue;
    if (!!row.editingObj) return rowValue;
    var keys = Object.keys(rowValue);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var question = row.getQuestionByName(key);
      if (!question) {
        question = this.getSharedQuestionByName(key, row);
      }
      if (!!question) {
        var displayvalue = question.getDisplayValue(keysAsText, rowValue[key]);
        if (keysAsText && !!question.title && question.title !== key) {
          rowValue[question.title] = displayvalue;
          delete rowValue[key];
        } else {
          rowValue[key] = displayvalue;
        }
      }
    }
    return rowValue;
  }
  public getPlainData(
    options: {
      includeEmpty?: boolean,
      calculations?: Array<{
        propertyName: string,
      }>,
    } = {
      includeEmpty: true,
    }
  ) {
    var questionPlainData = super.getPlainData(options);
    if (!!questionPlainData) {
      questionPlainData.isNode = true;
      questionPlainData.data = this.visibleRows.map(
        (row: MatrixDropdownRowModelBase) => {
          var rowDataItem = <any>{
            name: row.rowName,
            title: row.text,
            value: row.value,
            displayValue: this.getRowDisplayValue(false, row, row.value),
            getString: (val: any) =>
              typeof val === "object" ? JSON.stringify(val) : val,
            isNode: true,
            data: row.cells
              .map((cell: MatrixDropdownCell) =>
                cell.question.getPlainData(options)
              )
              .filter((d: any) => !!d),
          };
          (options.calculations || []).forEach((calculation) => {
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
  public getProgressInfo(): IProgressInfo {
    return SurveyElement.getProgressInfoByElements(
      this.getCellQuestions(),
      this.isRequired
    );
  }
  private getCellQuestions(): Array<Question> {
    const rows = this.visibleRows;
    if (!rows) return [];
    const questions = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      for (let j = 0; j < row.cells.length; j++) {
        questions.push(row.cells[j].question);
      }
    }
    return questions;
  }

  protected onBeforeValueChanged(val: any) { }
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
    var errosInRows = this.hasErrorInRows(fireCallback, rec);
    var isDuplicated = this.isValueDuplicated();
    return super.hasErrors(fireCallback, rec) || errosInRows || isDuplicated;
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
  private hasErrorInRows(fireCallback: boolean, rec: any): boolean {
    if (!this.generatedVisibleRows) {
      const rows = this.visibleRows;
    }
    var res = false;
    if (!rec) rec = {};
    rec.isSingleDetailPanel = this.detailPanelMode === "underRowSingle";
    for (var i = 0; i < this.generatedVisibleRows.length; i++) {
      res =
        this.generatedVisibleRows[i].hasErrors(fireCallback, rec, () => {
          this.raiseOnCompletedAsyncValidators();
        }) || res;
    }
    return res;
  }
  private isValueDuplicated(): boolean {
    if (!this.generatedVisibleRows) return false;
    var columns = this.getUniqueColumns();
    var res = false;
    for (var i = 0; i < columns.length; i++) {
      res = this.isValueInColumnDuplicated(columns[i]) || res;
    }
    return res;
  }
  private isValueInColumnDuplicated(column: MatrixDropdownColumn): boolean {
    var keyValues = <Array<any>>[];
    var res = false;
    for (var i = 0; i < this.generatedVisibleRows.length; i++) {
      res =
        this.isValueDuplicatedInRow(
          this.generatedVisibleRows[i],
          column,
          keyValues
        ) || res;
    }
    return res;
  }
  protected getUniqueColumns(): Array<MatrixDropdownColumn> {
    var res = new Array<MatrixDropdownColumn>();
    for (var i = 0; i < this.columns.length; i++) {
      if (this.columns[i].isUnique) {
        res.push(this.columns[i]);
      }
    }
    return res;
  }
  private isValueDuplicatedInRow(
    row: MatrixDropdownRowModelBase,
    column: MatrixDropdownColumn,
    keyValues: Array<any>
  ): boolean {
    var question = row.getQuestionByColumn(column);
    if (!question || question.isEmpty()) return false;
    var value = question.value;
    for (var i = 0; i < keyValues.length; i++) {
      if (value == keyValues[i]) {
        this.addDuplicationError(question);
        return true;
      }
    }
    keyValues.push(value);
    return false;
  }
  private addDuplicationError(question: Question) {
    question.addError(new KeyDuplicationError(this.keyDuplicationError, this));
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
    question.setParentQuestion(this);
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
      this.isUpdateLocked ||
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
    var getQuestion = (colName: any) => {
      for (var i = 0; i < row.cells.length; i++) {
        var col = row.cells[i].column;
        if (!!col && col.name === colName) {
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
      getCellQuestion: getQuestion,
    };
  }
  protected onCellValueChanged(
    row: MatrixDropdownRowModelBase,
    columnName: string,
    rowValue: any
  ) {
    if (!this.survey) return;
    var options = this.getOnCellValueChangedOptions(row, columnName, rowValue);
    if (!!this.onCellValueChangedCallback) {
      this.onCellValueChangedCallback(options);
    }
    this.survey.matrixCellValueChanged(this, options);
  }
  validateCell(
    row: MatrixDropdownRowModelBase,
    columnName: string,
    rowValue: any
  ): SurveyError {
    if (!this.survey) return;
    var options = this.getOnCellValueChangedOptions(row, columnName, rowValue);
    return this.survey.matrixCellValidate(this, options);
  }
  get isValidateOnValueChanging(): boolean {
    return !!this.survey ? this.survey.isValidateOnValueChanging : false;
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
    var rowObj = !!columnName ? this.getRowObj(row) : null;
    if (!!rowObj) {
      var columnValue = null;
      if (!!newRowValue && !isDeletingValue) {
        columnValue = newRowValue[columnName];
      }
      this.isRowChanging = true;
      rowObj[columnName] = columnValue;
      this.isRowChanging = false;
      this.onCellValueChanged(row, columnName, rowObj);
    } else {
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
    if (!this.generatedVisibleRows) return -1;
    return this.visibleRows.indexOf(row);
  }
  public getElementsInDesign(includeHidden: boolean = false): Array<IElement> {
    if (this.detailPanelMode == "none")
      return super.getElementsInDesign(includeHidden);
    return includeHidden ? [this.detailPanel] : this.detailElements;
  }
  hasDetailPanel(row: MatrixDropdownRowModelBase): boolean {
    if (this.detailPanelMode == "none") return false;
    if (this.isDesignMode) return true;
    if (!!this.onHasDetailPanelCallback)
      return this.onHasDetailPanelCallback(row);
    return this.detailElements.length > 0;
  }
  getIsDetailPanelShowing(row: MatrixDropdownRowModelBase): boolean {
    if (this.detailPanelMode == "none") return false;
    if (this.isDesignMode) {
      var res = this.visibleRows.indexOf(row) == 0;
      if (res) {
        if (!row.detailPanel) {
          row.showDetailPanel();
        }
      }
      return res;
    }
    return this.getPropertyValue("isRowShowing" + row.id, false);
  }
  setIsDetailPanelShowing(row: MatrixDropdownRowModelBase, val: boolean): void {
    if (val == this.getIsDetailPanelShowing(row)) return;
    this.setPropertyValue("isRowShowing" + row.id, val);
    this.updateDetailPanelButtonCss(row);
    if (!!this.renderedTable) {
      this.renderedTable.onDetailPanelChangeVisibility(row, val);
    }
    if (val && this.detailPanelMode === "underRowSingle") {
      var rows = this.visibleRows;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].id !== row.id && rows[i].isDetailPanelShowing) {
          rows[i].hideDetailPanel();
        }
      }
    }
  }
  public getDetailPanelButtonCss(row: MatrixDropdownRowModelBase): string {
    const builder = new CssClassBuilder().append(this.getPropertyValue("detailButtonCss" + row.id));
    return builder.append(this.cssClasses.detailButton, builder.toString() === "").toString();
  }
  public getDetailPanelIconCss(row: MatrixDropdownRowModelBase): string {
    const builder = new CssClassBuilder().append(this.getPropertyValue("detailIconCss" + row.id));
    return builder.append(this.cssClasses.detailIcon, builder.toString() === "").toString();
  }
  public getDetailPanelIconId(row: MatrixDropdownRowModelBase): string {
    return this.getIsDetailPanelShowing(row) ? this.cssClasses.detailIconExpandedId : this.cssClasses.detailIconId;
  }
  private updateDetailPanelButtonCss(row: MatrixDropdownRowModelBase) {
    const classes = this.cssClasses;
    const isPanelShowing = this.getIsDetailPanelShowing(row);

    const iconBuilder = new CssClassBuilder().append(classes.detailIcon)
      .append(classes.detailIconExpanded, isPanelShowing);
    this.setPropertyValue("detailIconCss" + row.id, iconBuilder.toString());

    const buttonBuilder = new CssClassBuilder().append(classes.detailButton)
      .append(classes.detailButtonExpanded, isPanelShowing);
    this.setPropertyValue("detailButtonCss" + row.id, buttonBuilder.toString());
  }
  createRowDetailPanel(row: MatrixDropdownRowModelBase): PanelModel {
    if (this.isDesignMode) return this.detailPanel;
    var panel = this.createNewDetailPanel();
    panel.readOnly = this.isReadOnly;
    var json = this.detailPanel.toJSON();
    new JsonObject().toObject(json, panel);
    panel.renderWidth = "100%";
    panel.updateCustomWidgets();
    if (!!this.onCreateDetailPanelCallback) {
      this.onCreateDetailPanelCallback(row, panel);
    }
    return panel;
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
    if (
      !!this.data &&
      !!this.visibleTotalRow &&
      !this.isUpdateLocked &&
      !this.isSett &&
      !this.isReadOnly
    ) {
      this.data.setValue(
        this.getValueName() + settings.matrixTotalValuePostFix,
        this.totalValue,
        false
      );
    }
  }
  getParentTextProcessor(): ITextProcessor {
    if(!this.parentQuestion || !this.parent) return null;
    const data = (<any>this.parent).data;
    if(!!data && !!data.getTextProcessor)
      return data.getTextProcessor();
    return null;
  }
  public getQuestionFromArray(name: string, index: number): IQuestion {
    if (index >= this.visibleRows.length) return null;
    return this.visibleRows[index].getQuestionByName(name);
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

  private get SurveyModel() {
    return this.survey as SurveyModel;
  }
  public getCellTemplateData(cell: QuestionMatrixDropdownRenderedCell) {
    // return cell.cell.column.templateQuestion;
    return this.SurveyModel.getMatrixCellTemplateData(cell);
  }
  public getCellWrapperComponentName(cell: MatrixDropdownCell) {
    return this.SurveyModel.getElementWrapperComponentName(cell, "cell");
  }
  public getCellWrapperComponentData(cell: MatrixDropdownCell) {
    return this.SurveyModel.getElementWrapperComponentData(cell, "cell");
  }
  public getColumnHeaderWrapperComponentName(cell: MatrixDropdownCell) {
    return this.SurveyModel.getElementWrapperComponentName(
      cell,
      "column-header"
    );
  }
  public getColumnHeaderWrapperComponentData(cell: MatrixDropdownCell) {
    return this.SurveyModel.getElementWrapperComponentData(
      cell,
      "column-header"
    );
  }
  public getRowHeaderWrapperComponentName(cell: MatrixDropdownCell) {
    return this.SurveyModel.getElementWrapperComponentName(cell, "row-header");
  }
  public getRowHeaderWrapperComponentData(cell: MatrixDropdownCell) {
    return this.SurveyModel.getElementWrapperComponentData(cell, "row-header");
  }
}

Serializer.addClass(
  "matrixdropdownbase",
  [
    {
      name: "columns:matrixdropdowncolumns",
      className: "matrixdropdowncolumn",
    },
    {
      name: "columnLayout",
      alternativeName: "columnsLocation",
      default: "horizontal",
      choices: ["horizontal", "vertical"],
    },
    {
      name: "detailElements",
      visible: false,
      isLightSerializable: false,
    },
    {
      name: "detailPanelMode",
      choices: ["none", "underRow", "underRowSingle"],
      default: "none",
    },
    "horizontalScroll:boolean",
    {
      name: "choices:itemvalue[]",
    },
    { name: "optionsCaption", serializationProperty: "locOptionsCaption" },
    {
      name: "keyDuplicationError",
      serializationProperty: "locKeyDuplicationError",
    },
    {
      name: "cellType",
      default: "dropdown",
      choices: () => {
        return MatrixDropdownColumn.getColumnTypes();
      },
    },
    { name: "columnColCount", default: 0, choices: [0, 1, 2, 3, 4] },
    "columnMinWidth",
    { name: "allowAdaptiveActions:boolean", default: false, visible: false },
  ],
  function () {
    return new QuestionMatrixDropdownModelBase("");
  },
  "matrixbase"
);
