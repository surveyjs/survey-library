import { JsonObject, CustomPropertiesCollection, Serializer } from "./jsonobject";
import { property } from "./decorators";
import { Question, IConditionObject, IQuestionPlainData, IVerifyDataContext } from "./question";
import { HashTable, Helpers } from "./helpers";
import { Base } from "./base";
import { IElement, IQuestion, ISurvey, ISurveyData, ISurveyImpl, ITextProcessor, IProgressInfo, IPanel, IPlainDataOptions, ISurveyMatrixCallbacks, ISurveyChoiceCallbacks } from "./base-interfaces";
import { SurveyElement } from "./survey-element";

import { ItemValue } from "./itemvalue";
import { QuestionFactory } from "./questionfactory";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { FunctionFactory } from "./functionsfactory";
import { PanelModel } from "./panel";
import { settings } from "./settings";
import { KeyDuplicationError } from "./error";
import { SurveyModel } from "./survey";
import { SurveyError } from "./survey-error";
import { toCssClasses } from "./utils/cssClassBuilder";
import { getMatrixCellAriaLabel, getMatrixTableBodyCss, getMatrixTableCss, getMatrixTableWrapperCss, isMatrixColumnsAutoWidth } from "./utils/matrix-table";
import { IMatrixColumnOwner, MatrixDropdownColumn } from "./question_matrixdropdowncolumn";
import { QuestionMatrixDropdownRenderedCell, QuestionMatrixDropdownRenderedRow, QuestionMatrixDropdownRenderedTable } from "./question_matrixdropdownrendered";
import { ConditionRunner } from "./conditions/conditionRunner";
import { IObjectValueContext, IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo } from "./conditions/conditionProcessValue";
import { ValidationContext } from "./question";
import { QuestionSingleInputBehavior } from "./question_singleinput_behavior";
import {
  QuestionRecordItemGetterContext, QuestionRecordItem, IDynamicDataRecordUniqueness, IRecordItemWrite, QuestionRecordsModel,
  QuestionRecordsSingleInputBehavior, IRecordRemoval, IRecordCleanupObject, removeRecordCleanupSkipped, isRecordEmpty, getRecordViewProperties
} from "./question_records";
import { DynamicDataOperation, IDynamicDataField } from "./dynamic-data/dynamic-data-interfaces";
import { DynamicDataList } from "./dynamic-data/dynamic-data-list";
import { groupByDuplicateKey } from "./dynamic-data/dynamic-data-page-validation";

export interface IMatrixDuplicationEntry {
  row: MatrixDropdownRowModelBase;
  value: any;
}

/* The matrix as its cells see it. The first group is what the interface has always declared for the
   rows; the rows themselves type their matrix as QuestionMatrixDropdownModelBase. */
export interface IMatrixDropdownData extends IObjectValueContext, ILocalizableOwner {
  getSurvey(): ISurvey;
  // getItem and getItemIndex: positions among the rows that exist - under paging, the page.
  getItem(index: number): QuestionRecordItem;
  getItemData(item: ISurveyData): any;
  getItemIndex(item: ISurveyData): number;
  getValueGetterContext(): IValueGetterContext;
  getFilteredData(): any;
  getBindedQuestions(): IQuestion[];
  getSharedQuestionFromArray(name: string, index: number): Question;
  updateItemValue(item: ISurveyData, name: string, val: any, isDeletingValue: boolean): any;
  onRowChanging(
    row: MatrixDropdownRowModelBase,
    columnName: string,
    rowValue: any
  ): any;
  isValidateOnValueChanging: boolean;
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
  choices: Array<ItemValue>;
  onTotalValueChanged(): any;
  isMatrixReadOnly(): boolean;
  onRowVisibilityChanged(row: MatrixDropdownRowModelBase): void;
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
    this.updateCellQuestionTitleDueToAccessebility(row);
    this.questionValue.registerPropertyChangedHandlers(
      ["isVisible"], () => {
        this.onQuestionVisibilityChanged();
      },
      "cell"
    );
  }
  private updateCellQuestionTitleDueToAccessebility(row: MatrixDropdownRowModelBase): void {
    this.questionValue.locTitle.onGetTextCallback = (str: string): string => {
      const survey = row?.getSurvey();
      if (!survey || survey.isSingleVisibleInput) return this.questionValue.title;
      const rowTitle = row.getAccessbilityText();
      if (!rowTitle) return this.questionValue.title;
      return this.column.colOwner.getCellAriaLabel(row, this.column, rowTitle);
    };
  }
  public locStrsChanged(): void {
    this.question.locStrsChanged();
  }
  protected createQuestion(
    column: MatrixDropdownColumn,
    row: MatrixDropdownRowModelBase,
    data: IMatrixDropdownData
  ): Question {
    const res = data.createQuestion(this.row, this.column);
    res.onFirstRendering();
    // isMatrixReadOnly() is the one hook the matrix has for "nothing in this table may be edited":
    // the matrix answers its own isReadOnly there, and a dynamic matrix over a data source that
    // cannot update also answers true.
    // The cell inherits the matrix's own isReadOnly through parentQuestion, so the callback carries
    // only the part it cannot inherit. A callback that returns true also renders the disabled
    // attribute (Question.isDisabledAttr), and a plain read-only matrix renders readonly cells.
    const matrixQuestion = <Question><any>data;
    res.readOnlyCallback = (): boolean => !this.row.isRowEnabled() ||
      (data.isMatrixReadOnly() && !matrixQuestion.isReadOnly);
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
  public getQuestionWrapperClassName(className: string): string {
    return className;
  }
  public runCondition(properties: HashTable<any>): void {
    this.question.runCondition(properties);
  }
  private onQuestionVisibilityChanged(): void {
    this.column.onCellVisibilityChanged(this.question.isVisible);
  }
  public dispose(): void {
    this.questionValue.unregisterPropertyChangedHandlers(["isVisible"], "cell");
    this.questionValue.dispose();
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
  public getQuestionWrapperClassName(className: string): string {
    let result = super.getQuestionWrapperClassName(className);
    if (!result) {
      return result;
    }
    if (this.question.expression && this.question.expression != "''") {
      result += " " + className + "--expression";
    }
    let alignment = this.column.totalAlignment;
    if (alignment === "auto") {
      if (this.column.cellType === "dropdown") {
        alignment = "left";
      }
    }
    return result + " " + className + "--" + alignment;
  }
  public getTotalExpression(): string {
    if (!!this.column.totalExpression) return this.column.totalExpression;
    if (this.column.totalType == "none") return "''";
    var funName = this.column.totalType + "InArray";
    if (!FunctionFactory.Instance.hasFunction(funName)) return "";
    return funName + "({matrix}, '" + this.column.name + "')";
  }
}

export class MatrixRowGetterContext extends QuestionRecordItemGetterContext {
  /* row is a row object, or - for a matrix that pages - a record without a row read as a value
     (RecordValueItem): the neighbours of the first and last row of a page, and rowsVisibleIf,
     which decides the page before any row exists. */
  constructor(protected row: MatrixDropdownRowModelBase) {
    super(row);
  }
  protected getNextName(): string {
    return settings.expressionVariables.nextRow;
  }
  protected getPrevName(): string {
    return settings.expressionVariables.prevRow;
  }
  protected getSpecificValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    if (path.length > 1 && path[0].name.toLocaleLowerCase() === settings.expressionVariables.totalRow.toLocaleLowerCase()) {
      const totalRow = this.row.data.visibleTotalRow;
      if (!!totalRow) {
        path[0].name = "row";
        return totalRow.getValueGetterContext().getValue(params);
      }
    }
    return null;
  }
  protected get questionName(): string {
    return settings.expressionVariables.matrix;
  }
  protected getItemVariableNames(): Array<string> {
    const v = settings.expressionVariables;
    return [v.rowIndex, v.visibleRowIndex, v.item, v.rowName, v.rowValue, v.rowTitle];
  }
  protected getRelatedItemNames(): Array<string> {
    return [settings.expressionVariables.totalRow];
  }
  /* Total row expressions ({matrix} in xxxInArray functions) calculate over visible rows
     only, and row visibility may depend on any survey value */
  protected isItemDependenciesTrackable(): boolean {
    return !(this.row instanceof MatrixDropdownTotalRowModel);
  }
  getRootObj(): IObjectValueContext { return this.row.data; }
  protected getItemValue(name: string): any {
    const setVar = settings.expressionVariables;
    name = name.toLocaleLowerCase();
    if (name === setVar.rowIndex.toLocaleLowerCase()) {
      // A record without a row: its record number, 1-based, in the whole list.
      if (!(this.row instanceof MatrixDropdownRowModelBase)) return this.getRecordNumber() + 1;
      return this.row.rowIndex;
    }
    if (name === setVar.visibleRowIndex.toLocaleLowerCase()) {
      return this.visibleIndex + 1;
    }
    if ([setVar.item, setVar.rowName.toLocaleLowerCase(), setVar.rowValue.toLocaleLowerCase()].indexOf(name) > -1) {
      return this.getRowName();
    }
    if (name == setVar.rowTitle.toLocaleLowerCase()) {
      return this.getRowTitle();
    }
    return undefined;
  }
  // {item} / {rowName} / {rowValue} and {rowTitle}: the row's own, or - for a record without a row - the
  // question's answer for it (see createRecordItemContext).
  protected getRowName(): any {
    return this.row.rowName;
  }
  protected getRowTitle(): any {
    return this.row.rowTitle;
  }
}

export class MatrixDropdownRowModelBase extends QuestionRecordItem implements ILocalizableOwner {
  private idValue: string;
  private detailPanelValue: PanelModel = null;
  private visibleValue: boolean = true;

  public cells: Array<MatrixDropdownCell> = [];
  public showHideDetailPanelClick: any;
  public onDetailPanelShowingChanged: () => void;
  // The row's position among the visible records of the whole list: a matrix that pages holds one
  // page of them as rows (see pageVisibleIndex).
  public visibleIndex: number = -1;

  constructor(public data: QuestionMatrixDropdownModelBase, value: any) {
    super(data);
    this.data = data;
    this.subscribeToChanges(value);
    this.showHideDetailPanelClick = () => {
      if (this.getSurvey().isDesignMode) return true;
      this.showHideDetailPanel();
    };
  }
  public get id(): string {
    if (this.idValue === undefined) {
      this.idValue = Base.getIdGeneratorBySurvey(this.getSurvey()).next("srow");
    }
    return this.idValue;
  }
  // This class does not extend Base, so it cannot inherit Base.renderedId / composeElementId; it
  // delegates the DOM-id namespacing to the owner survey directly (raw id when detached).
  public get renderedId(): string {
    const survey = this.getSurvey();
    return survey ? survey.getElementId(this.id) : this.id;
  }
  // Not a serializable element, but code that is handed a model object - the tester's target grammar,
  // a renderer event handler - identifies it the way it identifies everything else: by getType(),
  // instead of duck-typing on the properties a row happens to have.
  public getType(): string {
    return "matrixrow";
  }
  public get rowName(): any {
    return null;
  }
  public get rowTitle(): any {
    return this.rowName;
  }
  public get dataName(): string {
    return this.rowName;
  }
  public get text(): any {
    return this.rowName;
  }
  public getValueGetterContext(): IValueGetterContext {
    return new MatrixRowGetterContext(this);
  }
  public isRowEnabled(): boolean { return true; }
  protected isRowHasEnabledCondition(): boolean { return false; }
  public get isVisible(): boolean { return this.visible && this.isItemVisible(); }
  public get visible(): boolean { return this.visibleValue; }
  public set visible(val: boolean) {
    if (this.visible !== val) {
      this.visibleValue = val;
      this.data?.onRowVisibilityChanged(this);
    }
  }
  protected isItemVisible(): boolean { return true; }
  public get value(): any {
    return this.getValueCore(false);
  }
  public set value(value: any) {
    this.updateFromRecord(value);
  }
  // A row edits a survey element in place when its value is one (see editingObj).
  public updateFromRecord(record: any): void {
    this.runSettingValue((): void => {
      this.subscribeToChanges(record);
      super.updateFromRecord(record);
    });
  }
  /* The row notifies each question right after updating it, and it keeps a comment the question
     typed while the record has none, unless the question's comment was the record's. */
  protected updateQuestionFromRecord(question: Question, record: any): void {
    const val = this.getCellValue(record, question.getValueName());
    const oldComment = question.comment;
    let comment = !!record ? record[question.getValueName() + Base.commentSuffix] : "";
    if (comment == undefined) comment = "";
    question.updateValueFromSurvey(val);
    if (!!comment || this.isTwoValueEquals(oldComment, question.comment)) {
      question.updateCommentFromSurvey(comment);
    }
    question.onSurveyValueChanged(val);
  }
  public get filteredValue(): any {
    return this.getValueCore(true);
  }
  private getValueCore(isFiltered: boolean): any {
    var result: any = {};
    var cellValueNames: any = {};
    for (var i = 0; i < this.cells.length; i++) {
      var question = this.cells[i].question;
      if (!question) continue;
      var valueName = question.getValueName();
      cellValueNames[valueName] = true;
      if (!question.isEmpty()) {
        result[valueName] = isFiltered ? question.getFilteredValue() : question.value;
      }
      if (
        !!question.comment &&
        !!this.getSurvey() &&
        this.getSurvey().storeOthersAsComment
      ) {
        result[valueName + Base.commentSuffix] = question.comment;
      }
    }
    var detailQuestions = !!this.detailPanel ? this.detailPanel.questions : [];
    for (var i = 0; i < detailQuestions.length; i++) {
      var question = detailQuestions[i];
      var valueName = question.getValueName();
      if (cellValueNames[valueName]) continue;
      if (!question.isEmpty()) {
        result[valueName] = isFiltered ? question.getFilteredValue() : question.value;
      }
      if (
        !!question.comment &&
        !!this.getSurvey() &&
        this.getSurvey().storeOthersAsComment
      ) {
        result[valueName + Base.commentSuffix] = question.comment;
      }
    }
    return result;
  }
  public get locText(): LocalizableString {
    return null;
  }
  public getAccessbilityText(): string {
    return this.locText && this.locText.renderedHtml;
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
    if (!val && this.detailPanel) {
      this.detailPanel.onHidingContent();
    }
    if (!!this.data) {
      this.data.setIsDetailPanelShowing(this, val);
    }
    if (val && this.detailPanel) {
      this.detailPanel.onFirstRendering();
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
  public ensureDetailPanel() {
    if (this.isCreatingDetailPanel) return;
    if (!!this.detailPanelValue || !this.hasPanel || !this.data) return;
    this.isCreatingDetailPanel = true;
    this.detailPanelValue = this.data.createRowDetailPanel(this);
    var questions = this.detailPanelValue.questions;
    var value = this.getDataRowValue();
    if (!Helpers.isValueEmpty(value)) {
      for (var i = 0; i < questions.length; i++) {
        const key = questions[i].getValueName();
        const val = !!this.editingObj ? Serializer.getObjPropertyValue(this.editingObj, key) : value[key];
        if (!Helpers.isValueEmpty(val)) {
          questions[i].value = val;
        }
      }
    }
    this.detailPanelValue.setSurveyImpl(this);
    this.isCreatingDetailPanel = false;
  }
  getAllValues(): any {
    const res = this.value;
    if (this.data) {
      const rowVal = this.getDataRowValue();
      if (rowVal) {
        for (var key in rowVal) {
          if (res[key] === undefined) {
            res[key] = rowVal[key];
          }
        }
      }
    }
    return res;
  }
  public getVariableName(): string {
    return settings.expressionVariables.row;
  }
  private getDataRowValue(): any {
    if (!this.data) return null;
    return this.data.getItemData(this);
  }
  public runCondition(properties: HashTable<any>, rowsVisibleIf?: string, alwaysVisible?: boolean): void {
    if (!this.data) return;
    const newProps = Helpers.createCopy(properties);
    newProps[settings.expressionVariables.row] = this;
    this.visible = alwaysVisible === true || this.getRowVisibleIfBaseOnExpression(newProps, rowsVisibleIf);
    this.runRowsEnableCondition(newProps);
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].runCondition(newProps);
    }
    if (!!this.detailPanel) {
      this.detailPanel.runCondition(newProps);
    }
    if (this.isRowHasEnabledCondition()) {
      this.onQuestionReadOnlyChanged();
    }
  }
  protected runRowsEnableCondition(properties: HashTable<any>): void { }
  protected getRowsVisibleIfExpression(rowsVisibleIf: string): Array<string> {
    return !!rowsVisibleIf ? [rowsVisibleIf] : [];
  }
  private getRowVisibleIfBaseOnExpression(properties: HashTable<any>, rowsVisibleIf: string): boolean {
    const exps = this.getRowsVisibleIfExpression(rowsVisibleIf);
    let result = true;
    for (let i = 0; i < exps.length; i++) {
      result = new ConditionRunner(exps[i]).runContext(this.getValueGetterContext(), properties);
      if (!result) break;
    }
    return result;
  }
  public updateElementVisibility(): void {
    this.cells.forEach(cell => cell.question.updateElementVisibility());
    if (!!this.detailPanel) {
      this.detailPanel.updateElementVisibility();
    }
  }
  public getNamesWithDefaultValues(): Array<string> {
    const res: Array<string> = [];
    this.questions.forEach(q => {
      if (q.isValueDefault) {
        res.push(q.getValueName());
      }
    });
    return res;
  }
  public clearValue(keepComment?: boolean, fromUI?: boolean): void {
    var questions = this.questions;
    for (var i = 0; i < questions.length; i++) {
      questions[i].clearValue(keepComment, fromUI);
    }
  }
  public getDataValueCore(valuesHash: any, key: string): any {
    var survey = this.getSurvey();
    if (!!survey) {
      return (<any>survey).getDataValueCore(valuesHash, key);
    } else {
      return valuesHash[key];
    }
  }
  public getComment(name: string): string {
    var question = this.getQuestionByName(name);
    return !!question ? question.comment : "";
  }
  /* The owner receives the whole proposed row, after the cell-changing callback had its say and,
     when the matrix validates on value changing, after the cell passed. */
  protected prepareRecordWrite(name: string, newValue: any, isComment: boolean): IRecordItemWrite {
    if (this.isCreatingDetailPanel) return undefined;
    const changedQuestion = this.getQuestionByName(name);
    const rowValue = this.onCellValueChanging(changedQuestion, this.value, isComment);
    if (this.data.isValidateOnValueChanging && !this.validateCellQuestion(changedQuestion)) return undefined;
    const fieldName = isComment ? name + Base.commentSuffix : name;
    return {
      fieldValue: rowValue[fieldName],
      ownerValue: rowValue,
      isDeleting: newValue == null && !changedQuestion || isComment && !newValue && !!changedQuestion
    };
  }
  protected onRecordWritten(name: string, isComment: boolean): void {
    if (isComment) return;
    const changedQuestion = this.getQuestionByName(name);
    const survey = <any>this.getSurvey();
    if (changedQuestion && survey && survey.isValidateOnValueChanged) {
      const col = this.data.columns.filter(c => c.name === name)[0];
      if (col && col.isUnique) {
        this.data.checkIfValueInRowDuplicated(this, changedQuestion);
      }
    }
  }

  private onCellValueChanging(question: Question, newValue: any, isComment: boolean): any {
    if (!question) return newValue;
    const name = question.getValueName();
    const changedName = isComment ? name + Base.commentSuffix : name;
    const changingValue = this.data.onRowChanging(this, changedName, newValue);
    /* The row value leaves an empty question out, so an empty changing value is what the question
       holds already: written back, it would replace the question's own empty value - a dynamic
       panel's empty records - with nothing. */
    const isEmptyAlready = !isComment && question.isEmpty() && Helpers.isValueEmpty(changingValue);
    if (!isEmptyAlready && !this.isTwoValueEquals(changingValue, question.value)) {
      this.runSettingValue((): void => {
        if (isComment) {
          question.comment = changingValue;
        } else {
          question.value = changingValue;
        }
      });
      return this.value;
    }
    return newValue;
  }
  private validateCellQuestion(question: Question): boolean {
    if (!question) return true;
    if (!question.validateElement(new ValidationContext({ fireCallback: true, isOnValueChanged: !this.data.isValidateOnValueChanging })))
      return false;
    if (question.isEmpty()) return true;
    var cell = this.getCellByColumnName(question.name);
    if (!cell || !cell.column || !cell.column.isUnique) return true;
    return !this.data.checkIfValueInRowDuplicated(this, question);
  }
  public get isEmpty() {
    return isRecordEmpty(this.value);
  }
  // The detail panel's own errors as well; a panel that was never created has none.
  public clearErrors(): void {
    super.clearErrors();
    if (!!this.detailPanel) {
      this.detailPanel.clearErrors();
    }
  }
  public hasValueAnyQuestion(visibleOnly?: boolean): boolean {
    const questions = visibleOnly ? this.visibleQuestions : this.questions;
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].isEmpty()) return true;
    }
    return false;
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
  public get visibleQuestions(): Array<Question> {
    const res: Array<Question> = [];
    this.questions.forEach(q => {
      if (q.isVisible) {
        res.push(q);
      }
    });
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
  public getQuestionsByValueName(name: string, caseInsensitive?: boolean): Array<Question> {
    if (caseInsensitive) {
      name = name.toLocaleLowerCase();
    }
    let res = [];
    for (var i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];
      const q = cell.question;
      if (!q) continue;
      let valueName = q.getValueName();
      if (caseInsensitive) {
        valueName = valueName.toLocaleLowerCase();
      }
      if (valueName === name) {
        res.push(cell.question);
      }
    }
    if (!!this.detailPanel) {
      res = res.concat(this.detailPanel.getQuestionsByValueName(name, caseInsensitive));
    }
    return res;
  }
  public clearIncorrectValues(val: any): void {
    // The keys of the detail panel questions are known once the panel is created.
    this.ensureDetailPanel();
    for (var key in val) {
      // A key is resolved by valueName, the way isUnknownValueKey() does it, so that clearing
      // removes exactly what getUnknownValueKeys() reports.
      var question = this.getQuestionsByValueName(key)[0];
      if (question) {
        var qVal = question.value;
        question.clearIncorrectValues();
        if (!this.isTwoValueEquals(qVal, question.value)) {
          this.setValue(key, question.value);
        }
      } else {
        if (this.isUnknownValueKey(key)) {
          this.deleteUnknownValueKey(key);
        }
      }
    }
  }
  // Lists the keys of a row value that no cell question stores. It does not modify the value.
  public getUnknownValueKeys(val: any): Array<string> {
    // A row edits an object, not a JSON value, when the survey is used as an object editor.
    if (!!val && typeof val.getType === "function") return [];
    // A row value of another shape is a valueType finding of the question, not an unknown key one.
    if (!Helpers.isValueObject(val, true)) return [];
    this.ensureDetailPanel();
    const res: Array<string> = [];
    for (var key in val) {
      if (this.isUnknownValueKey(key)) res.push(key);
    }
    return res;
  }
  private deleteUnknownValueKey(key: string): void {
    // setValue() resolves a key by the question name and keeps a key that a question of the row is
    // named after, even when that question stores its value under another valueName. Such a key has
    // to be removed from the row value directly, so that clearing removes what getUnknownValueKeys() reports.
    if (!this.getQuestionByName(key)) {
      this.setValue(key, null);
    } else {
      this.data.updateItemValue(this, key, this.value, true);
    }
  }
  // The matrix's rule, the one a record without a row is checked by (isRecordKeyUnknown).
  private isUnknownValueKey(key: string): boolean {
    return this.isOwnRecordKeyUnknown(key);
  }
  public getLocale(): string {
    return this.data ? this.data.getLocale() : "";
  }
  public getMarkdownHtml(text: string, name: string, item?: any): string {
    return this.data ? this.data.getMarkdownHtml(text, name, item) : undefined;
  }
  public getRenderer(name: string): string {
    return this.data ? this.data.getRenderer(name) : null;
  }
  public getRendererContext(locStr: LocalizableString): any {
    return this.data ? this.data.getRendererContext(locStr) : locStr;
  }
  public getProcessedText(text: string): string {
    return this.data ? this.data.getProcessedText(text, this) : text;
  }
  public locStrsChanged() {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].locStrsChanged();
    }
    if (!!this.detailPanel) {
      this.detailPanel.locStrsChanged();
    }
  }
  public randomSeedChanged(): void {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].question.randomSeedChanged();
    }
    if (!!this.detailPanel) {
      this.detailPanel.randomSeedChanged();
    }
  }
  public updateCellQuestionOnColumnChanged(column: MatrixDropdownColumn, name: string, newValue: any): void {
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
  public onQuestionReadOnlyChanged() {
    const questions = this.questions;
    for (var i = 0; i < questions.length; i++) {
      const q = questions[i];
      q.setPropertyValue("isReadOnly", q.isReadOnly);
    }
    if (!!this.detailPanel) {
      const parentIsReadOnly = !!this.data && this.data.isMatrixReadOnly();
      this.detailPanel.readOnly = parentIsReadOnly || !this.isRowEnabled();
    }
  }
  public validate(context: ValidationContext): boolean {
    let res = true;
    const cells = this.cells;
    if (!cells) return res;
    for (let colIndex = 0; colIndex < cells.length; colIndex++) {
      if (!cells[colIndex]) continue;
      const question = cells[colIndex].question;
      if (!question || !question.isVisible) continue;
      if (!!context && context.isOnValueChanged === true && question.isEmpty())
        continue;
      res = question.validateElement(context) && res;
    }
    if (this.hasPanel && (!!this.detailPanelValue || !context || !context.isOnValueChanging)) {
      this.ensureDetailPanel();
      // Creating the panel adds its questions to the survey, and in the input-per-page mode that
      // re-runs the navigation, which may validate this very row again while the panel is still being
      // created. That nested call finds no panel yet; the call that is creating it validates it.
      if (!this.detailPanel) return res;
      const isValid = this.detailPanel.validateElement(context);
      const rec = <any>context;
      if (!rec.hideErroredPanel && !isValid && context.fireCallback) {
        if (rec.isSingleDetailPanel) {
          rec.hideErroredPanel = true;
        }
        this.showDetailPanel();
      }
      res = isValid && res;
    }
    return res;
  }
  protected updateCellOnColumnChanged(cell: MatrixDropdownCell, name: string, newValue: any): void {
    if (name === "choices" && Array.isArray(newValue) && newValue.length === 0 && this.data) {
      newValue = this.data.choices;
    }
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
    this.runSettingValue((): void => {
      var columns = this.data.columns;
      for (var i = 0; i < columns.length; i++) {
        var column = columns[i];
        var cell = this.createCell(column);
        this.cells.push(cell);
        var cellValue = this.getCellValue(value, column.name);
        if (!Helpers.isValueEmpty(cellValue)) {
          cell.question.value = cellValue;
          var commentKey = column.name + Base.commentSuffix;
          if (!!value && !Helpers.isValueEmpty(value[commentKey])) {
            cell.question.comment = value[commentKey];
          }
        }
      }
    });
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
  /* 1-based RECORD index: it names the record, not the row slot, so that a stored {rowIndex}
     expression keeps meaning the same row when a filter or a sort changes which rows exist - and in
     the whole list, so that row 23 is record 23 on every page of a data source that pages itself.
     getIndex() stays the window-local record index the matrix storage is addressed by. */
  public get rowIndex(): number {
    const res = this.getItemIndex();
    return res > 0 ? this.getOwnRecordNumber() + 1 : res;
  }
  public getIndex(): number {
    return this.getItemIndex() - 1;
  }
  protected getItemIndex(): number {
    return !!this.data ? this.getOwnRecordIndex() + 1 : -1;
  }
  public get editingObj(): Base {
    return this.editingObjValue;
  }
  private onEditingObjPropertyChanged: (sender: Base, options: any) => void;
  private editingObjValue: Base;
  public dispose(): void {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].dispose();
    }
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
    this.runSettingValue((): void => {
      let questions = this.getQuestionsByName(name);
      for (let i = 0; i < questions.length; i++) {
        questions[i].value = newValue;
      }
    });
  }
}

export class MatrixDropdownTotalRowModel extends MatrixDropdownRowModelBase {
  constructor(data: QuestionMatrixDropdownModelBase) {
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
  public runCondition(properties: HashTable<any>, rowsVisibleIf?: string): void {
    var counter = 0;
    var prevValue;
    do {
      prevValue = Helpers.getUnbindValue(this.value);
      super.runCondition(properties, "");
      counter++;
    } while(!Helpers.isTwoValueEquals(prevValue, this.value) && counter < 3);
  }
  protected updateCellOnColumnChanged(cell: MatrixDropdownCell, name: string, newValue: any): void {
    (<MatrixDropdownTotalCell>cell).updateCellQuestion();
  }
}

export class MatrixSingleInputLocOwner implements ILocalizableOwner {
  constructor(private matrix: QuestionMatrixDropdownModelBase, private row?: MatrixDropdownRowModelBase) {}
  getLocale(): string { return this.matrix.getLocale(); }
  getMarkdownHtml(text: string, name: string, item?: any): string {
    return this.matrix.getMarkdownHtml(text, name, item);
  }
  getProcessedText(text: string): string {
    return this.matrix.processSingleInputTitle(text, this.row);
  }
  getRenderer(name: string): string {
    return this.matrix.getRenderer(name);
  }
  getRendererContext(locStr: LocalizableString): any {
    return this.matrix.getRendererContext(locStr);
  }
}

/**
 * A base class for the [`QuestionMatrixDropdownModel`](https://surveyjs.io/form-library/documentation/questionmatrixdropdownmodel) and [`QuestionMatrixDynamicModel`](https://surveyjs.io/form-library/documentation/questionmatrixdynamicmodel) classes.
 */
export class QuestionMatrixDropdownModelBase extends QuestionRecordsModel implements IMatrixDropdownData, IMatrixColumnOwner {
  protected generatedVisibleRows: Array<MatrixDropdownRowModelBase> = null;
  protected generatedTotalRow: MatrixDropdownRowModelBase = null;
  public visibleRowsChangedCallback: () => void;
  public get matrixCallbacks(): ISurveyMatrixCallbacks {
    return this.survey as ISurveyMatrixCallbacks;
  }
  public get choiceCallbacks(): ISurveyChoiceCallbacks {
    return this.survey as ISurveyChoiceCallbacks;
  }
  public static get defaultCellType() {
    return settings.matrix.defaultCellType;
  }
  public static set defaultCellType(val: string) {
    settings.matrix.defaultCellType = val;
  }
  public static addDefaultColumns(matrix: QuestionMatrixDropdownModelBase) {
    var colNames = QuestionFactory.DefaultColums;
    for (var i = 0; i < colNames.length; i++) matrix.addColumn(colNames[i]);
  }
  private detailPanelValue: PanelModel;
  private useCaseSensitiveComparisonValue: boolean;
  /* The matrix is writing its records itself (see QuestionRecordsModel.writeRecords). A subclass may
     still set it, as it could before: the value it sets counts too. */
  private isRowChangingValue: boolean = false;
  protected get isRowChanging(): boolean {
    return this.isRowChangingValue || this.isWritingRecords;
  }
  protected set isRowChanging(val: boolean) {
    this.isRowChangingValue = val;
  }
  columnsChangedCallback: () => void;
  onRenderedTableResetCallback: () => void;
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
  onAddColumn: (column: MatrixDropdownColumn) => void;
  onRemoveColumn: (column: MatrixDropdownColumn) => void;
  cellValueChangingCallback: (row: any, columnName: string, value: any, oldValue: any) => any;

  protected createColumnValues() {
    return this.createNewArray(
      "columns",
      (item: any) => {
        item.colOwner = this;
        if (this.onAddColumn)this.onAddColumn(item);
        if (this.survey) {
          this.matrixCallbacks.matrixColumnAdded(this, item);
        }
      },
      (item: any) => {
        item.colOwner = null;
        if (this.onRemoveColumn)this.onRemoveColumn(item);
      }
    );
  }
  constructor(name: string) {
    super(name);
    this.columns = this.createColumnValues();
    this.rows = this.createItemValues("rows");
  }
  // The records of the Multi-Select Matrix; the dynamic matrix keeps the empty array it has always had.
  /**
   * An array of matrix rows.
   *
   * This array can contain primitive values or objects with the `text` (display value) and `value` (value to be saved in survey results) properties.
   *
   * [Single-Select Matrix Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))
   *
   * [Multi-Select Matrix Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))
   */
  @property() rows: Array<any>;
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "rowsVisibleIf" || name === "columnsVisibleIf") {
      this.runCondition(this.getDataFilteredProperties());
    }
    if (name === "columns" || name === "cellType") {
      this.updateColumnsAndRows();
    }
    const clearRowsProps = ["placeholder", "columnColCount", "rowTitleWidth", "choices"];
    const resetRenderTableProps = [
      "transposeData",
      "addRowButtonLocation",
      "hideColumnsIfEmpty",
      "showHeader",
      "minRowCount",
      "isReadOnly",
      "rowCount",
      "hasFooter",
      "detailPanelMode",
      "displayMode"
    ];
    if (clearRowsProps.indexOf(name) > -1) {
      this.clearRowsAndResetRenderedTable();
    }
    if (resetRenderTableProps.indexOf(name) > -1) {
      this.resetRenderedTable();
    }
  }
  public getType(): string {
    return "matrixdropdownbase";
  }
  /**
   * Specifies whether to display the table header that contains column captions.
   *
   * Default value: `true`
   */
  @property() showHeader: boolean;
  /**
   * An array of matrix columns.
   *
   * For a Single-Select Matrix, the `columns` array can contain configuration objects with the `text` (display value) and `value` (value to be saved in survey results) properties. Alternatively, the array can contain primitive values that will be used as both the display values and values to be saved in survey results.
   *
   * [Single-Select Matrix Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))
   *
   * For a Multi-Select Matrix or Dynamic Matrix, the `columns` array should contain configuration objects with properties described in the [`MatrixDropdownColumn`](https://surveyjs.io/form-library/documentation/api-reference/multi-select-matrix-column-values) API Reference section.
   *
   * [Multi-Select Matrix Demo](https://surveyjs.io/form-library/examples/questiontype-matrixdropdown/ (linkStyle))
   */
  @property() columns: Array<any>;
  public get visibleColumns(): Array<any> {
    const res: Array<any> = [];
    this.columns.forEach(col => { if (this.isColumnVisible(col)) { res.push(col); } });
    return res;
  }
  /**
   * Returns an array of visible matrix rows.
   * @see rowsVisibleIf
   */
  // The rows that exist: under paging the page, and a number of the whole view is not a position in it.
  public get visibleRows(): Array<MatrixDropdownRowModelBase> {
    return this.getVisibleRows();
  }
  /**
   * A Boolean expression that is evaluated against each matrix row. If the expression evaluates to `false`, the row becomes hidden.
   *
   * A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.
   *
   * Use the `{item}` placeholder to reference the current row in the expression.
   *
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   *
   * [View Demo](https://surveyjs.io/form-library/examples/change-visibility-of-rows-in-matrix-table/ (linkStyle))
   * @see visibleRows
   * @see columnsVisibleIf
   */
  @property() rowsVisibleIf: string;
  /**
   * A Boolean expression that is evaluated against each matrix column. If the expression evaluates to `false`, the column becomes hidden.
   *
   * A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.
   *
   * Use the `{item}` placeholder to reference the current column in the expression.
   *
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   *
   * [View Demo](https://surveyjs.io/form-library/examples/change-visibility-of-rows-in-matrix-table/ (linkStyle))
   * @see rowsVisibleIf
   */
  @property() columnsVisibleIf: string;
  protected runConditionCore(properties: HashTable<any>): void {
    super.runConditionCore(properties);
    this.runItemsCondition(properties);
  }
  protected onColumnsChanged(): void { }
  // The points where the visible rows may have changed; the fixed matrix hides itself without rows
  // (hideIfRowsEmpty).
  protected updateVisibilityBasedOnRows(): void { }
  public needResponsiveWidth() {
    //TODO: make it mor intelligent
    return true;
  }

  protected get columnsAutoWidth() {
    return isMatrixColumnsAutoWidth(this.isMobile, this.columns);
  }
  public getTableCss(): string {
    return getMatrixTableCss(this.cssClasses, this.columnsAutoWidth, this.showHeader, this.verticalAlign);
  }
  public getTableBodyCss(): string {
    return getMatrixTableBodyCss(this.cssClasses, this.alternateRows, this.isMobile);
  }
  public getTableWrapperCss(): string {
    return getMatrixTableWrapperCss(this.cssClasses, this.titleLocation);
  }

  /**
   * Aligns matrix cell content in the vertical direction.
   */
  @property() verticalAlign: "top" | "middle";

  /**
   * Specifies whether to apply shading to alternate matrix rows.
   *
   * [Single-Select Matrix Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/ (linkStyle))
   */
  @property() alternateRows: boolean;

  /**
   * Minimum column width in CSS values.
   *
   * [Multi-Select Matrix Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))
   *
   * [Dynamic Matrix Demo](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/ (linkStyle))
   * @see width
   */
  @property({ returnValue: "" }) columnMinWidth: string;

  /**
   * A width for the column that displays row titles (first column). Accepts CSS values.
   */
  @property({ returnValue: "" }) rowTitleWidth: string;
  /**
   * Specifies how to arrange matrix questions.
   *
   * Possible values:
   *
   * - `"table"` - Displays matrix questions in a table.
   * - `"list"` - Displays matrix questions one under another as a list.
   * - `"auto"` (default) - Uses the `"table"` mode if the survey has sufficient width to fit the table or the `"list"` mode otherwise.
   */
  @property() displayMode: "auto" | "table" | "list";

  //a11y
  public getCellAriaLabel(row: any, column: any, directRowTitle?: string): string {
    return getMatrixCellAriaLabel(this.getLocalizationString("matrix_row"), this.getLocalizationString("matrix_column"), row, column, directRowTitle);
  }

  public get isNewA11yStructure(): boolean {
    return true;
  }
  // EO a11y
  protected getIsMobile(): boolean {
    if (this.displayMode == "auto") return super.getIsMobile();
    return this.displayMode === "list";
  }
  protected getAllChildren(): Base[] {
    return [
      ...super.getAllChildren(),
      ...(<any>this.detailElements)
    ];
  }
  // The rows go before the record list (see QuestionRecordsModel.dispose).
  protected disposeRecordObjects(): void {
    this.clearGeneratedRows();
  }
  public get isRowsDynamic(): boolean {
    return false;
  }
  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean): void {
    super.setSurveyImpl(value, isLight);
    this.syncPageSizeWithSurvey();
  }
  startLoadingFromJson(json?: any): void {
    super.startLoadingFromJson(json);
    // toJSON() writes "cellType" after "columns". Apply it first: a column with the default cellType
    // accepts the properties of the matrix cell type, and it must know that type when its JSON is loaded.
    if (!!json && !!json.cellType) {
      this.cellType = json.cellType;
    }
  }
  endLoadingFromJson(): void {
    // cellType changes are not propagated while loading, bring the default columns in line with it
    this.updateColumnsCellType();
    super.endLoadingFromJson();
    this.updateVisibilityBasedOnRows();
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
   * Specifies whether to display [`columns`](#columns) as rows and [`rows`](#rows) as columns.
   *
   * Default value: `false`
   *
   * [Multi-Select Matrix Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))
   *
   * [Dynamic Matrix Demo](https://surveyjs.io/form-library/examples/transpose-dynamic-rows-to-columns-in-matrix/ (linkStyle))
   */
  @property() transposeData: boolean;
  /**
   * @deprecated Use the [`transposeData`](#transposeData) property instead.
   * @hidden
   */
  public get columnLayout(): string {
    return this.transposeData ? "vertical" : "horizontal";
  }
  public set columnLayout(val: string) {
    this.transposeData = val === "vertical";
  }
  get columnsLocation(): string {
    return this.columnLayout;
  }
  set columnsLocation(val: string) {
    this.columnLayout = val;
  }
  /**
   * Specifies the error message position for questions within detail sections.
   *
   * Possible values:
   *
   * - `"default"` (default) - Inherits the setting from the [`errorLocation`](#errorLocation) property.
   * - `"top"` - Displays error messages above questions.
   * - `"bottom"` - Displays error messages below questions.
   * @see cellErrorLocation
   */
  @property({ isLowerCase: true }) detailErrorLocation: string;

  /**
   * Specifies the error message position relative to matrix cells.
   *
   * Possible values:
   *
   * - `"default"` (default) - Inherits the setting from the [`errorLocation`](#errorLocation) property.
   * - `"top"` - Displays error messages above matrix cells.
   * - `"bottom"` - Displays error messages below matrix cells.
   * @see detailErrorLocation
   */
  @property({ isLowerCase: true }) cellErrorLocation: string;

  public getChildErrorLocation(child: Question): string {
    const errLocation = !!child.parent ? this.detailErrorLocation : this.cellErrorLocation;
    if (errLocation !== "default") return errLocation;
    return super.getChildErrorLocation(child);
  }
  /**
   * Returns `true` if [`columns`](#columns) are placed in the horizontal direction and [`rows`](#columns) in the vertical direction.
   *
   * To specify the layout, use the [`transposeData`](#transposeData) property. If you set it to `true`, the survey applies it only when the screen has enough space. Otherwise, the survey falls back to the original layout, but the `transposeData` property remains set to `true`. Unlike `transposeData`, the `isColumnLayoutHorizontal` property always indicates the current layout.
   * @see transposeData
   */
  public get isColumnLayoutHorizontal(): boolean {
    return this.isMobile ? true : !this.transposeData;
  }
  /**
   * Enables case-sensitive comparison in columns with the `isUnique` property set to `true`.
   *
   * When this property is `true`, `"ABC"` and `"abc"` are considered different values.
   *
   * Default value: `false`
   * @see keyDuplicationError
   * @since 2.0.0
   */
  public get useCaseSensitiveComparison(): boolean {
    return this.useCaseSensitiveComparisonValue !== undefined ? this.useCaseSensitiveComparisonValue : settings.comparator.caseSensitive;
  }
  public set useCaseSensitiveComparison(val: boolean) {
    this.useCaseSensitiveComparisonValue = val;
  }
  /**
   * @deprecated Use the [`useCaseSensitiveComparison`](#useCaseSensitiveComparison) property instead.
   * @hidden
   */
  public get isUniqueCaseSensitive(): boolean {
    return this.useCaseSensitiveComparison;
  }
  public set isUniqueCaseSensitive(val: boolean) {
    this.useCaseSensitiveComparison = val;
  }
  /**
   * Specifies the location of detail sections.
   *
   * Possible values:
   *
   * - `"underRow"` - Displays detail sections under their respective rows. Users can expand any number of detail sections.
   * - `"underRowSingle"` - Displays detail sections under their respective rows, but only one detail section can be expanded at a time.
   * - `"none"` (default) - Hides detail sections.
   *
   * Use the [`detailElements`](#detailElements) property to specify content of detail sections.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-expandable-details-section-under-matrix-rows/ (linkStyle))
   * @see detailPanel
   */
  @property() detailPanelMode: string;
  /**
   * Contains a [`PanelModel`](https://surveyjs.io/form-library/documentation/panelmodel) instance that represents a detail section template.
   * @see detailElements
   * @see detailPanelMode
   */
  public get detailPanel(): PanelModel {
    if (!this.detailPanelValue) {
      const pnl = this.createNewDetailPanel();
      pnl.selectedElementInDesign = this;
      pnl.renderWidth = "100%";
      pnl.isInteractiveDesignElement = false;
      pnl.showTitle = false;
      const adActions = this.getPropertyValueWithoutDefault("allowAdaptiveActions");
      if (adActions !== undefined) {
        pnl.allowAdaptiveActions = adActions;
      }
      this.detailPanelValue = pnl;
    }
    return this.detailPanelValue;
  }
  public getPanels(): Array<IPanel> {
    const pnl = this.getPanelInDesignMode();
    return !!pnl ? [pnl] : null;
  }
  public getPanelInDesignMode(): PanelModel { return this.detailPanelMode !== "none" ? this.detailPanel : null; }
  /**
   * An array of survey elements (questions and panels) to be displayed in detail sections.
   *
   * Detail sections are expandable panels displayed under each matrix row. You can use them to display questions that do not fit into the row.
   *
   * Set the [`detailPanelMode`](#detailPanelMode) property to `"underRow"` or `"underRowSingle"` to display detail sections.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/add-expandable-details-section-under-matrix-rows/ (linkStyle))
   * @see detailPanel
   */
  public get detailElements(): Array<IElement> {
    return this.detailPanel.elements;
  }
  protected isPropertyStoredInHash(name: string): boolean {
    if (name === "detailElements") return !this.detailPanelValue;
    return super.isPropertyStoredInHash(name);
  }
  protected mergeLocalizationWithInnerObjects(src: Base, locales?: Array<string>): void {
    const srcPanel = (<QuestionMatrixDropdownModelBase><unknown>src).detailPanelValue;
    if (srcPanel) {
      (<any>this.detailPanel).mergeLocalizationObj(srcPanel, locales);
    }
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
  public onPointerDown(pointerDownEvent: PointerEvent, row: MatrixDropdownRowModelBase): void { }
  protected onRowsChanged(): void {
    this.clearVisibleRows();
    this.resetRenderedTable();
    this.updateVisibilityBasedOnRows();
    this.fireCallback(this.visibleRowsChangedCallback);
    this.updateRowsVisibleIndexes();
  }
  private updateRowsVisibleIndexes(): void {
    const rows = this.visibleRows;
    if (!Array.isArray(rows)) return;
    const vriName = settings.expressionVariables.visibleRowIndex;
    const keys = {};
    keys[vriName] = 0;
    // A row's visibleIndex is its position among the visible records of the whole list; the rows of
    // a matrix that pages are one page of them.
    for (let i = 0; i < rows.length; i ++) {
      const visibleIndex = this.setRowVisibleIndex(rows[i], i);
      keys[vriName] = visibleIndex + 1;
      rows[i].runTriggers(vriName, visibleIndex + 1, keys);
    }
  }
  private lockResetRenderedTable: boolean = false;
  protected onStartRowAddingRemoving() {
    this.lockResetRenderedTable = true;
    this.setValueChangedDirectly(true);
  }
  protected onEndRowAdding() {
    this.lockResetRenderedTable = false;
    if (!this.renderedTable) return;
    /* The incremental add appends the new row to the rendered table, which is right for a table
       that shows every visible row and wrong for a page that may not hold the new one at all. With
       paging on the table is reset instead - the question moves pageIndex to the page the new row
       landed on, which resets it anyway. */
    if (this.renderedTable.isRequireReset() || this.isPagingActive) {
      this.resetRenderedTable();
    } else {
      const index = this.rowsOnPage.length - 1;
      this.renderedTable.onAddedRow(this.rowsOnPage[index], index);
    }
  }
  protected onEndRowRemoving(row: MatrixDropdownRowModelBase) {
    this.lockResetRenderedTable = false;
    /* Removing one row from the rendered table is right for a table that shows every visible row.
       A page is a window: the row that took the vacated slot comes from the next page, and a
       removal that emptied the last page moved pageIndex back while the reset it raised was locked
       out by onStartRowAddingRemoving. Either way the whole page is re-rendered. */
    if (this.renderedTable.isRequireReset() || this.isPagingActive) {
      this.resetRenderedTable();
    } else {
      if (!!row) {
        this.renderedTable.onRemovedRow(row);
      }
    }
  }
  protected clearRowsAndResetRenderedTable() {
    this.clearGeneratedRows();
    this.resetRenderedTable();
    this.fireCallback(this.columnsChangedCallback);
  }
  //For internal use
  public resetRenderedTable(columnVisibilityChanged?: boolean): void {
    if (!this.isRendredTableCreated) return;
    if (this.lockResetRenderedTable || this.isUpdateLocked) {
      if (columnVisibilityChanged) {
        this.renderedTable.requireReset();
      }
    } else {
      const table = <QuestionMatrixDropdownRenderedTable>this.getPropertyValueWithoutDefault("renderedTable");
      this.resetPropertyValue("renderedTable");
      this.disposeRenderedTable(table);
      this.fireCallback(this.onRenderedTableResetCallback);
    }
  }
  /* A table that is replaced - a page move, a column change - holds the actions of its rows: each keeps
     listeners on the matrix's strings and on the survey's locale. They go with the table, once the UI
     no longer shows it (disposeAfterRerender). */
  private disposeRenderedTable(table: QuestionMatrixDropdownRenderedTable): void {
    if (!table || table.isDisposed) return;
    this.disposeAfterRerender(table, (): void => {
      table.rows.forEach((row: QuestionMatrixDropdownRenderedRow): void => {
        row.cells.forEach((cell: QuestionMatrixDropdownRenderedCell): void => {
          const actions = cell.isActionsCell && !!cell.item ? cell.item.value : undefined;
          if (!!actions && typeof actions.dispose === "function")actions.dispose();
        });
        row.dispose();
      });
      table.dispose();
    });
  }
  protected clearGeneratedRows(): void {
    this.clearVisibleRows();
    if (!this.generatedVisibleRows) return;
    this.keepDetailPanelPageStates(this.generatedVisibleRows);
    // A row that is replaced - a page move, a new value - can still be on screen until the UI rerenders
    // the matrix, or still be writing its cell (disposeReplacedItem).
    this.generatedVisibleRows.forEach((row: MatrixDropdownRowModelBase): void => {
      this.disposeReplacedItem((): void => this.disposeAfterRerender(row));
    });
    this.generatedVisibleRows = null;
  }
  protected get isRendredTableCreated(): boolean {
    return !!this.getPropertyValueWithoutDefault("renderedTable");
  }
  public get renderedTable(): QuestionMatrixDropdownRenderedTable {
    return this.getPropertyValue("renderedTable", undefined, () => this.createRenderedTable());
  }
  protected createRenderedTable(): QuestionMatrixDropdownRenderedTable {
    return new QuestionMatrixDropdownRenderedTable(this);
  }
  protected getRowByQuestion(question: Question): MatrixDropdownRowModelBase {
    if (!question) return undefined;
    return <MatrixDropdownRowModelBase>question.data;
  }
  protected onMatrixRowCreated(row: MatrixDropdownRowModelBase): void {
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
    for (var i = 0; i < this.columns.length; i++) {
      options.column = this.columns[i];
      options.columnName = options.column.name;
      var cell = row.cells[i];
      options.cell = cell;
      options.cellQuestion = cell.question;
      options.value = cell.value;
      if (!!this.onCellCreatedCallback) {
        this.onCellCreatedCallback(options);
      }
      this.matrixCallbacks.matrixCellCreated(this, options);
    }
  }
  /**
   * Specifies the type of matrix cells. You can override this property for individual columns.
   *
   * Possible values:
   *
   * - [`"dropdown"`](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model)
   * - [`"checkbox"`](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model)
   * - [`"radiogroup"`](https://surveyjs.io/form-library/documentation/api-reference/radio-button-question-model)
   * - [`"tagbox"`](https://surveyjs.io/form-library/documentation/api-reference/dropdown-tag-box-model)
   * - [`"text"`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model)
   * - [`"comment"`](https://surveyjs.io/form-library/documentation/api-reference/comment-field-model)
   * - [`"boolean"`](https://surveyjs.io/form-library/documentation/api-reference/boolean-question-model)
   * - [`"expression"`](https://surveyjs.io/form-library/documentation/api-reference/expression-model)
   * - [`"rating"`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model)
   * - [`"slider"`](https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel)
   *
   * Default value: `"dropdown"` (inherited from [`settings.matrix.defaultCellType`](https://surveyjs.io/form-library/documentation/settings#matrixDefaultCellType))
   *
   * [Multi-Select Matrix Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))
   *
   * [Dynamic Matrix Demo](https://surveyjs.io/form-library/examples/dynamic-matrix-add-new-rows/ (linkStyle))
   */
  @property({ isLowerCase: true }) cellType: string;
  isSelectCellType(): boolean {
    return Serializer.isDescendantOf(this.cellType, "selectbase");
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
   * Specifies the number of columns in Radiogroup and Checkbox cells.
   *
   * Default value: 0 (the number of columns is selected automatically based on the available column width)
   * @see cellType
   */
  @property({ onSetting: (val: any) => val < 0 ? 0 : val > 4 ? 4 : val }) columnColCount: number;
  @property() horizontalScroll: boolean;
  public get allowAdaptiveActions(): boolean {
    return this.getPropertyValue("allowAdaptiveActions");
  }
  public set allowAdaptiveActions(val: boolean) {
    this.setPropertyValue("allowAdaptiveActions", val);
    if (!!this.detailPanelValue) {
      this.detailPanel.allowAdaptiveActions = val;
    }
  }
  public hasChoices(): boolean {
    const choices = this.getPropertyValueWithoutDefault("choices");
    return choices && choices.length > 0;
  }
  onColumnPropertyChanged(column: MatrixDropdownColumn, name: string, newValue: any): void {
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
  }
  onColumnNestedPropertyChanged(column: MatrixDropdownColumn, name: string, nestedName: string, newValue: any): void {
    if (!this.generatedVisibleRows) return;
    for (var i = 0; i < this.generatedVisibleRows.length; i++) {
      const row = this.generatedVisibleRows[i];
      const q = row.getQuestionByColumn(column);
      if (!!q && !!q[name]) {
        q[name][nestedName] = newValue;
      }
    }
  }
  onColumnItemValuePropertyChanged(column: MatrixDropdownColumn, propertyName: string,
    obj: ItemValue, name: string, newValue: any, oldValue: any): void {
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

  onShowInMultipleColumnsChanged(column: MatrixDropdownColumn): void {
    this.resetTableAndRows();
  }
  onColumnVisibilityChanged(column: MatrixDropdownColumn): void {
    this.resetTableAndRows();
  }
  onColumnCellVisibilityChanged(column: MatrixDropdownColumn): void {
    if (this.isDesignMode || this.isRunningCellsCondition) return;
    if (this.isColumnVisibilityChanged(column, true)) {
      this.resetRenderedTable(true);
    }
  }
  onColumnCellTypeChanged(column: MatrixDropdownColumn): void {
    this.updateDefaultRowValue(column);
    this.resetTableAndRows();
  }
  getDesignRowContext(): IValueGetterContext {
    const row = this.visibleRows && this.visibleRows.length > 0 ? this.visibleRows[0] : this.createMatrixRow(new ItemValue(1));
    return row.getValueGetterContext();
  }
  private updateDefaultRowValue(column: MatrixDropdownColumn): void {
    let val = this.defaultRowValue;
    if (!!val) {
      if (column.cellType === "file" && val[column.name]) {
        delete val[column.name];
        if (Object.keys(val).length === 0) {
          val = undefined;
        }
        this.defaultRowValue = val;
      }
    }
  }
  private resetTableAndRows(): void {
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
  protected updateShowTable() {
    if (!!this.renderedTable) {
      this.renderedTable.updateShowTable();
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
    this.matrixCallbacks.matrixCellCreating(this, options);
    return options.cellType;
  }
  public getConditionJson(operator: string = null, path: string = null): any {
    if (!path) return super.getConditionJson(operator);
    let columnName = "";
    for (let i = path.length - 1; i >= 0; i--) {
      if (path[i] == ".") break;
      columnName = path[i] + columnName;
    }
    let question = undefined;
    let column = this.getColumnByName(columnName);
    if (!!column) {
      question = column.createCellQuestion(null);
    } else {
      if (this.detailPanelMode !== "none") {
        question = this.detailPanel.getQuestionByName(columnName);
      }
    }
    return !!question ? question.getConditionJson(operator) : null;
  }
  protected verifyValueCore(val: any, context: IVerifyDataContext): boolean {
    if (!super.verifyValueCore(val, context)) return false;
    if (!context.checks.reportUnknownProperties) return true;
    // Verification builds the rows without paging, as it always has; the page's rows are built already.
    if (!this.isPagedByList)this.allRows;
    this.verifyRecordsUnknownKeys(val, context);
    // An unknown key inside a row is not a shape problem: a matrixdropdown still checks its rows.
    return true;
  }
  // A row edits an object, not a JSON value, when the survey is used as an object editor.
  protected getRecordUnknownKeys(index: number, recordValue: any, row: MatrixDropdownRowModelBase): Array<string> {
    if (!!recordValue && typeof recordValue.getType === "function") return [];
    return super.getRecordUnknownKeys(index, recordValue, row);
  }
  /* QuestionRecordsModel hooks of isRecordKeyUnknown, one rule for a row and a record without a row, as
     released: a key a column or a detail panel question stores under its value name - a comment key by
     the name in front of the suffix -, or a key with the totals suffix anywhere in it. */
  protected isRecordKeyOfType(key: string, row: QuestionRecordItem): boolean {
    return !!this.getRecordTemplateQuestion(this.getRecordKeyValueName(key)) || key.indexOf(settings.matrix.totalsSuffix) > -1;
  }
  protected getRecordKeyValueName(key: string): string {
    const suffix = settings.commentSuffix;
    const at = key.lastIndexOf(suffix);
    return at > 0 && at === key.length - suffix.length ? key.substring(0, at) : key;
  }
  // The segment of the row at a position in a location: the segment of the record it holds.
  private getRowDataSegment(position: number): string | number {
    const index = this.getRecordIndexAtRowPosition(position);
    return this.getRecordDataSegment(index > -1 ? index : position);
  }
  public initializeForVerification(): void {
    const rows = this.allRows;
    if (!Array.isArray(rows)) return;
    rows.forEach(row => {
      row.cells.forEach(cell => cell?.question?.initializeForVerification());
      row.ensureDetailPanel();
      row.detailPanel?.initializeForVerification();
    });
  }
  public verifyNestedValues(context: IVerifyDataContext): void {
    const rows = this.allRows;
    if (!Array.isArray(rows)) return;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      context.pushSegment(this.getRowDataSegment(i));
      row.cells.forEach(cell => cell?.question?.verifyDataCore(context));
      row.detailPanel?.verifyDataCore(context);
      context.popSegment();
    }
  }
  protected clearIncorrectValuesInObjects(): void {
    if (!Array.isArray(this.visibleRows)) return;
    const rows = this.generatedVisibleRows;
    for (let i = 0; i < rows.length; i++) {
      rows[i].clearIncorrectValues(this.getRowRecordValue(i));
    }
  }
  protected getRecordTemplateQuestion(key: string): Question {
    for (let i = 0; i < this.columns.length; i++) {
      const question = this.columns[i].templateQuestion;
      if (!!question && question.getValueName() === key) return question;
    }
    return this.detailPanelMode !== "none" ? <Question>this.detailPanel.getQuestionByValueName(key) || undefined : undefined;
  }
  // QuestionRecordsModel hook of clearHiddenAnswersWithoutObjects: the cell questions a column condition hides.
  protected getRecordConditionalInputs(): Array<Question> {
    return this.columns.filter((column: MatrixDropdownColumn): boolean => !!column.visibleIf).map((column: MatrixDropdownColumn): Question => column.templateQuestion);
  }
  /* QuestionRecordsModel hook: a temporary row for a record without one, built as a page builds a row
     (createRowForRecordCleanup: the cells raise onMatrixCellCreating and onMatrixCellCreated) with its
     detail panel. The row's own released clearIncorrectValues judges the record. */
  protected createRecordCleanupObject(index: number, record: any): IRecordCleanupObject {
    const row = this.createRowForRecordCleanup(index, record);
    if (!row) return undefined;
    this.onMatrixRowCreated(row);
    row.ensureDetailPanel();
    return {
      item: row,
      runCondition: (properties: HashTable<any>): void => { row.runCondition(properties, this.getRowsVisibleIfForRows(), true); },
      clearIncorrectValues: (): void => { row.clearIncorrectValues(Object.assign({}, this.getRecordCleanupCopy(row, false))); },
      validate: (): boolean => {
        const context = new ValidationContext({ fireCallback: false });
        const res = row.validate(context);
        context.finish();
        return res && context.runningResult !== false;
      },
      dispose: (): void => { row.dispose(); }
    };
  }
  protected createRowForRecordCleanup(index: number, record: any): MatrixDropdownRowModelBase {
    return undefined;
  }
  public localeChanged(): void {
    super.localeChanged();
    this.runFuncForCellQuestions((q: Question) => { q.localeChanged(); });
  }
  private runFuncForCellQuestions(func: (question: Question) => void): void {
    const rows = this.generatedVisibleRows;
    if (!!rows) {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.isVisible) {
          for (let j = 0; j < row.cells.length; j++) {
            func(row.cells[j].question);
          }
        }
      }
    }
  }
  protected runItemsCondition(properties: HashTable<any>): void {
    let counter = 0;
    let prevTotalValue;
    let isRowVisiblilityChanged = false;
    const isColumnChanged = this.runConditionsForColumns(properties);
    do {
      prevTotalValue = Helpers.getUnbindValue(this.totalValue);
      isRowVisiblilityChanged = this.runCellsCondition(properties) || isRowVisiblilityChanged;
      this.runTotalsCondition(properties);
      counter++;
    } while(
      !Helpers.isTwoValueEquals(prevTotalValue, this.totalValue) &&
      counter < 3
    );
    if (isRowVisiblilityChanged && this.isClearValueOnHidden) {
      this.clearInvisibleValuesInRows();
    }
    this.clearHiddenAnswersWithoutObjects(properties);
    if (isColumnChanged) {
      this.resetRenderedTable(true);
    }
    this.updateVisibilityBasedOnRows();
  }
  protected runTriggersInObjects(name: string, value: any, keys: any): void {
    this.runFuncForCellQuestions((q: Question) => { q.runTriggers(name, value, keys); });
  }
  public updateElementVisibility(): void {
    super.updateElementVisibility();
    const rows = this.generatedVisibleRows;
    if (!!rows) {
      rows.forEach(row => row.updateElementVisibility());
    }
    this.updateShowTable();
  }
  protected shouldRunColumnExpression(): boolean {
    return false;
  }
  private isRunningCellsCondition: boolean;
  // The values the cells compute are not edits (runComputedWrites).
  protected runCellsCondition(properties: HashTable<any>): boolean {
    return this.runComputedWrites((): boolean => this.runCellsConditionCore(properties));
  }
  private runCellsConditionCore(properties: HashTable<any>): boolean {
    if (this.isDesignMode) return false;
    /* Under paging the records decide the page (rebuildStalePage): a record that became hidden or
       visible is a row visibility change even when it has no row, so the answers it hides are
       cleared. */
    const stalePage = this.rebuildStalePage(properties);
    if (stalePage.isRebuilt) return true;
    let isRowVisiblilityChanged = stalePage.isChanged;
    this.isRunningCellsCondition = true;
    // The records decide their visibility under paging (areRecordsDecidingVisibility).
    const isAlwaysVisible = this.areInvisibleElementsShowing || this.areRecordsDecidingVisibility;
    const rowsVisibleIf = this.getRowsVisibleIfForRows();
    const rows = this.generatedVisibleRows;
    if (!!rows) {
      for (var i = 0; i < rows.length; i++) {
        const prevVis = rows[i].isVisible;
        rows[i].runCondition(properties, rowsVisibleIf, isAlwaysVisible);
        if (prevVis !== rows[i].isVisible) {
          isRowVisiblilityChanged = true;
        }
      }
    }
    this.checkColumnsVisibility();
    this.checkColumnsRenderedRequired();
    this.isRunningCellsCondition = false;
    this.updateRecordsVisibility();
    return isRowVisiblilityChanged;
  }
  /* The owner-visibility layer of the list: a record follows row.isVisible - the same flag
     visibleRows is built from - so that dataList.visibleCount and visibleRows.length agree. Nothing is
     created for it. */
  private updateRecordsVisibility(): void {
    const rows = this.generatedVisibleRows;
    if (!Array.isArray(rows)) return;
    this.setItemRecordsVisible(rows.length, (position: number): boolean => rows[position].isVisible);
  }
  // The rowsVisibleIf the rows run themselves: none while the records decide it (areRecordsDecidingVisibility).
  private getRowsVisibleIfForRows(): string {
    return this.areRecordsDecidingVisibility ? "" : this.getExpressionFromSurvey(this.getRecordVisibleIfPropertyName());
  }
  protected runConditionsForColumns(properties: HashTable<any>): boolean {
    const expression = this.getExpressionFromSurvey("columnsVisibleIf");
    this.columns.forEach(column => {
      if (!expression) {
        column.isColumnsVisibleIf = true;
      } else {
        const condition = new ConditionRunner(expression);
        column.isColumnsVisibleIf = condition.runContext(column.getValueGetterContext(), properties) === true;
      }
    });
    return false;
  }
  private checkColumnsVisibility(): void {
    if (this.isDesignMode) return;
    var hasChanged = false;
    for (var i = 0; i < this.columns.length; i++) {
      const column = this.columns[i];
      const isCellsVisibilty = !!column.visibleIf || column.isFilteredMultipleColumns;
      if (!isCellsVisibilty && !this.columnsVisibleIf && column.isColumnVisible) continue;
      hasChanged = this.isColumnVisibilityChanged(column, isCellsVisibilty) || hasChanged;
    }
    if (hasChanged) {
      this.resetRenderedTable(true);
    }
  }
  private checkColumnsRenderedRequired(): void {
    const rows = this.generatedVisibleRows;
    if (!rows) return;
    for (var i = 0; i < this.columns.length; i++) {
      const column = this.columns[i];
      if (!column.requiredIf || !column.isColumnVisible) continue;
      let required = rows.length > 0;
      for (var j = 0; j < rows.length; j++) {
        if (!rows[j].cells[i].question.isRequired) {
          required = false;
          break;
        }
      }
      column.updateIsRenderedRequired(required);
    }
  }
  private isColumnVisibilityChanged(column: MatrixDropdownColumn, checkCellsVisiblity: boolean): boolean {
    const curVis = column.isColumnVisible;
    let hasVisCell = !checkCellsVisiblity;
    const rows = this.generatedVisibleRows;
    const checkRows = checkCellsVisiblity && rows;
    const isMultipleColumnsVisibility = checkRows && column.isFilteredMultipleColumns;
    const curVisibleChoices = isMultipleColumnsVisibility ? column.getVisibleChoicesInCell : [];
    const newVisibleChoices = new Array<any>();
    if (checkRows) {
      for (let i = 0; i < rows.length; i++) {
        const cell = rows[i].cells[column.index];
        const q = cell?.question;
        if (!!q && q.isVisible) {
          hasVisCell = true;
          if (isMultipleColumnsVisibility) {
            this.updateNewVisibleChoices(q, newVisibleChoices);
          } else break;
        }
      }
    }
    column.hasVisibleCell = hasVisCell && column.isColumnsVisibleIf;
    if (isMultipleColumnsVisibility) {
      column.setVisibleChoicesInCell(newVisibleChoices);
      if (!Helpers.isArraysEqual(curVisibleChoices, newVisibleChoices, true, false, false)) return true;
    }
    return curVis !== column.isColumnVisible;
  }
  private updateNewVisibleChoices(q: Question, dest: Array<any>): void {
    const choices = q.visibleChoices;
    if (!Array.isArray(choices)) return;
    for (let i = 0; i < choices.length; i++) {
      const ch = choices[i];
      if (dest.indexOf(ch.value) < 0) dest.push(ch.value);
    }
  }
  protected runTotalsCondition(properties: HashTable<any>): void {
    if (!this.generatedTotalRow) return;
    this.generatedTotalRow.runCondition(properties);
  }
  public IsMultiplyColumn(column: MatrixDropdownColumn): boolean {
    return column.isShowInMultipleColumns && !this.isMobile;
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
  public randomSeedChanged(): void {
    const columns = this.columns;
    for (var i = 0; i < columns.length; i++) {
      columns[i].templateQuestion.randomSeedChanged();
    }
    const rows = this.generatedVisibleRows;
    if (!rows) return;
    for (var i = 0; i < rows.length; i++) {
      rows[i].randomSeedChanged();
    }
  }
  /**
   * Returns a matrix column with a given `name` or `null` if a column with this is not found.
   * @param columnName A column name.
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
  public getColumnWidth(column: MatrixDropdownColumn): string {
    return column.minWidth ? column.minWidth : this.columnMinWidth ? this.columnMinWidth : (settings.matrix.columnWidthsByType[column.cellType]?.minWidth || "");
  }
  /**
   * Gets or sets choice items for Dropdown, Checkbox, and Radiogroup matrix cells. You can override this property for individual columns.
   *
   * This property accepts an array of objects with the following structure:
   *
   * ```js
   * {
   *   "value": any, // A value to be saved in survey results
   *   "text": string, // A display text. This property supports Markdown. When `text` is undefined, `value` is used.
   *   "customProperty": any // Any property that you find useful.
   * }
   * ```
   *
   * To enable Markdown support for the `text` property, implement Markdown-to-HTML conversion in the [onTextMarkdown](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onTextMarkdown) event handler. For an example, refer to the following demo: [Convert Markdown to HTML with markdown-it](https://surveyjs.io/form-library/examples/edit-survey-questions-markdown/).
   *
   * If you add custom properties, refer to the following help topic to learn how to serialize them into JSON: [Add Custom Properties to Property Grid](https://surveyjs.io/survey-creator/documentation/property-grid#add-custom-properties-to-the-property-grid).
   *
   * If you need to specify only the `value` property, you can set the `choices` property to an array of primitive values, for example, `[ "item1", "item2", "item3" ]`. These values are both saved in survey results and used as display text.
   * @see cellType
   */
  public get choices(): Array<any> {
    return this.getItemValuesPropertyValue("choices");
  }
  public set choices(val: Array<any>) {
    this.setArrayPropertyValue("choices", val);
  }
  /**
   * A placeholder for Dropdown matrix cells.
   * @see cellType
   */
  @property ({ localizable: { defaultStr: true } }) placeholder: string;
  public get optionsCaption() { return this.placeholder; }
  public set optionsCaption(val: string) { this.placeholder = val; }
  /**
   * An error message displayed when users enter a duplicate value into a column that accepts only unique values (`isUnique` is set to `true` or `keyName` is specified).
   *
   * A default value for this property is taken from a [localization dictionary](https://github.com/surveyjs/survey-library/tree/01bd8abd0c574719956d4d579d48c8010cd389d4/packages/survey-core/src/localization). Refer to the following help topic for more information: [Localization & Globalization](https://surveyjs.io/form-library/documentation/localization).
   * @see useCaseSensitiveComparison
   */
  @property({ localizable: { defaultStr: true } }) keyDuplicationError: string;
  /**
   * A title template that applies when the survey is in [input-per-page mode](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode).
   *
   * Default value: `"Row {rowIndex}"` for Dynamic Matrix | `"{rowTitle}"` for Multi-Select Matrix
   *
   * The template can contain the following placeholders:
   *
   * - `{rowIndex}` - A row index within the collection of all rows. Starts with 1.
   * - `{visibleRowIndex}` - A row index within the collection of visible rows. Starts with 1.
   * - `{rowName}` - A row name (the `value` property within objects in the [`rows`](#rows) array). Use this placeholder if you need to distinguish between matrix rows.
   * - `{rowTitle}` - A row title (the `text` property within objects in the `rows` array).
   * - `{row.columnname}` - The value of a cell in the same row.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/loop-and-merge/ (linkStyle))
   * @since 2.0.6
   */
  public get singleInputTitleTemplate(): string {
    return this.getLocStringText(this.locSingleInputTitleTemplate);
  }
  public set singleInputTitleTemplate(val: string) {
    this.setLocStringText(this.locSingleInputTitleTemplate, val);
  }
  get locSingleInputTitleTemplate(): LocalizableString {
    return this.getOrCreateLocStr("singleInputTitleTemplate", true, this.getSingleInputTitleTemplate(), (locStr: LocalizableString) => {
      locStr.owner = new MatrixSingleInputLocOwner(this);
    });
  }
  public getMatrixDropdownBaseSingleQuestionLocTitleCore(): LocalizableString {
    return this.locSingleInputTitleTemplate;
  }
  public getSingleInputTitleTemplate(): string { return ""; }
  public processSingleInputTitle(text: string, row: MatrixDropdownRowModelBase): string {
    if (!row) {
      row = this.getRowByQuestion(this.singleInputQuestion);
    }
    const textProcessor = row ? row.getTextProcessor() : this.textProcessor;
    if (textProcessor) {
      return textProcessor.processText(text, true);
    }
    return text;
  }
  protected createSingleInputBehavior(): QuestionSingleInputBehavior {
    return new MatrixDropdownBaseSingleInputBehavior(this);
  }
  public get storeOthersAsComment(): boolean {
    return !!this.survey ? this.choiceCallbacks.storeOthersAsComment : false;
  }
  public addColumn(name: string, title?: string): MatrixDropdownColumn {
    var column = new MatrixDropdownColumn(name, title, this);
    this.columns.push(column);
    return column;
  }
  private visibleRowsArray: Array<MatrixDropdownRowModelBase>;
  protected clearVisibleRows(): void {
    this.visibleRowsArray = null;
  }
  protected isColumnVisible(column: any): boolean {
    return column.isColumnVisible;
  }
  private isGenereatingRows: boolean;
  protected getVisibleRows(): Array<MatrixDropdownRowModelBase> {
    if (this.isUpdateLocked) return null;
    if (this.isGenereatingRows) return [];
    if (!!this.visibleRowsArray) return this.visibleRowsArray;
    this.generateVisibleRowsIfNeeded();
    this.visibleRowsArray = this.getVisibleFromGenerated(this.generatedVisibleRows);
    this.updateRowsVisibleIndexes();
    return this.visibleRowsArray;
  }
  public get allRows(): Array<MatrixDropdownRowModelBase> {
    if (this.isGenereatingRows) return [];
    this.generateVisibleRowsIfNeeded();
    return this.generatedVisibleRows;
  }
  /* The rows the rendered table shows. The rows that exist are the page: which rows exist is decided
     by the list filter and the list sort (they create the rows), and with paging on visibleRows holds
     the current page only, whatever the source, so the page is visibleRows itself - the same
     instance - and never a slice of it. */
  public get rowsOnPage(): Array<MatrixDropdownRowModelBase> {
    return this.visibleRows;
  }
  private generateVisibleRowsIfNeeded(): void {
    if (!this.isUpdateLocked && !this.generatedVisibleRows) {
      // The values new rows write - their defaults - are computed.
      this.runComputedWrites((): void => this.generateVisibleRows());
    }
  }
  // The one writer of a row's released visibleIndex field: the visible index of the whole view at a page position.
  private setRowVisibleIndex(row: MatrixDropdownRowModelBase, position: number): number {
    row.visibleIndex = this.getVisibleIndexAtPosition(position);
    return row.visibleIndex;
  }
  private generateVisibleRows(): void {
    this.isGenereatingRows = true;
    this.generatedVisibleRows = this.generateRows();
    this.isGenereatingRows = false;
    for (var i = 0; i < this.generatedVisibleRows.length; i++) {
      const row = this.generatedVisibleRows[i];
      this.setRowVisibleIndex(row, i);
      this.onMatrixRowCreated(row);
    }
    if (this.data) {
      this.runCellsCondition(this.data.getFilteredProperties());
      if (this.takeValueChangedBeforeBuild()) {
        this.runTriggersOnNewRows();
      }
    }
    if (!!this.generatedVisibleRows) {
      this.updateValueOnRowsGeneration(this.generatedVisibleRows);
      this.updateIsAnswered();
    }
  }
  private runTriggersOnNewRows(): void {
    const val = this.value;
    this.runTriggersOnItems(
      this.generatedVisibleRows,
      row => this.getRowValueCore(row as MatrixDropdownRowModelBase, val),
      settings.expressionVariables.row
    );
  }
  private getVisibleFromGenerated(rows: Array<MatrixDropdownRowModelBase>): Array<MatrixDropdownRowModelBase> {
    const res: Array<MatrixDropdownRowModelBase> = [];
    if (!rows) return res;
    rows.forEach(row => { if (row.isVisible) res.push(row); });
    return res.length === rows.length ? rows : res;
  }
  private updateValueOnRowsGeneration(rows: Array<MatrixDropdownRowModelBase>) {
    /* The rows were built from the value and usually hold it already. The two copies of the whole
       value are made only when a row has a value to write back: a matrix that pages builds one page
       on every visit, and the copies would cost the record count each time. */
    const changedRows: Array<MatrixDropdownRowModelBase> = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.editingObj && (this.isRowWrittenOnBuild(row) || this.isRecordChangedByRow(row, this.getRowRecordValue(i)))) {
        changedRows.push(row);
      }
    }
    if (changedRows.length === 0) return;
    var oldValue = this.createNewValue(true);
    var newValue = this.createNewValue();
    for (var i = 0; i < changedRows.length; i++) {
      newValue = this.getNewValueOnRowChanged(changedRows[i], "", changedRows[i].value, false, newValue)
        .value;
    }
    if (this.isTwoValueEquals(oldValue, newValue)) return;
    this.writeRecords((): void => this.setOwnRecordsValue(newValue));
  }
  // A row whose build writes the value even when it holds nothing new (see the Dynamic Matrix).
  protected isRowWrittenOnBuild(row: MatrixDropdownRowModelBase): boolean {
    return false;
  }
  /* Would the row's value, merged into its record as a write merges it, change the record? A record
     may hold fields no column shows - the key of a data source - which the row neither holds nor
     writes: comparing the row's value with the whole record would take every such row for changed. */
  private isRecordChangedByRow(row: MatrixDropdownRowModelBase, record: any): boolean {
    const merged = Object.assign({}, record);
    this.mergeRowValue(merged, row, "", row.value, false);
    return !this.isTwoValueEquals(record || {}, merged);
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
          this.runTotalsCondition({ survey: this.survey });
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
    this.genetateColumnsName();
    // The one hook every load ends with: the sort and the filter the JSON authored reach the list
    // here, once, whatever order their keys came in.
    this.flushAuthoredView();
  }
  private genetateColumnsName(): void {
    this.columns.forEach(column => {
      if (!column.name || column.name === "") {
        column.name = this.generateNewName(this.columns, "question");
      }
    });
  }
  private generateNewName(elements: Array<any>, baseName: string): string {
    return (this.getSurvey() as SurveyModel).getNewGeneratedName(elements, baseName);
  }
  /**
   * Returns an object with row values. If a row has no answers, this method returns an empty object.
   * @param rowIndex A zero-based row index.
   * @see setRowValue
   */
  /* rowIndex is a CREATED position: the position in allRows/generatedVisibleRows; under paging a
     created position of the whole view (owner-hidden records included), and the stored record is
     read on the page and off it. A record a source that pages itself has not loaded reads null. */
  public getRowValue(rowIndex: number): any {
    if (rowIndex < 0 || !Array.isArray(this.visibleRows)) return null;
    if (this.isPagingActive) {
      const target = this.getRecordTargetAtCreatedIndex(rowIndex);
      return !target || target.isNotLoaded ? null : this.getStoredRecordValue(target.recordIndex);
    }
    var rows = this.generatedVisibleRows;
    if (rowIndex >= rows.length) return null;
    return this.unbindRowValue(this.getRowValueByIndexCore(rowIndex));
  }
  /* The seam for the record storage: matrix dynamic reads the record from its DynamicDataList,
     matrix dropdown keeps reading the object keyed by rowName. The unbinding and the range checks
     stay in getRowValue, so both paths keep its public contract. */
  protected getRowValueByIndexCore(index: number): any {
    return this.getRowValueCore(this.generatedVisibleRows[index], this.value);
  }
  // A copy, unless the value is a survey element edited in place (Creator): then it is the record itself.
  private unbindRowValue(rowValue: any): any {
    if (this.isValueSurveyElement(this.value)) return rowValue;
    return Helpers.getUnbindValue(rowValue);
  }
  /* The record as it is stored - never row.value, which assembles the cells and the detail questions
     only and would drop the fields without one (a key, server-only fields) - unbound as getRowValue
     returns it. null for no record. */
  private getStoredRecordValue(recordIndex: number): any {
    const record = recordIndex < 0 ? undefined : this.getListRecordAt(recordIndex);
    return this.unbindRowValue(record !== undefined ? record : null);
  }
  // The record of the row at a position in generatedVisibleRows: the row's own, without looking it up.
  private getRowRecordValue(position: number): any {
    return this.getStoredRecordValue(this.getRecordIndexAtRowPosition(position));
  }
  public getItemData(item: ISurveyData): any {
    const copy = this.getRecordCleanupCopy(item, this.getItemIndex(item) < 0);
    if (copy !== undefined) return this.unbindRowValue(copy);
    return this.getStoredRecordValue(this.getRecordIndexOf(item));
  }
  public checkIfValueInRowDuplicated(
    checkedRow: MatrixDropdownRowModelBase,
    cellQuestion: Question
  ): boolean {
    if (!this.generatedVisibleRows) return false;
    return this.isValueInColumnDuplicated(cellQuestion.name, true, checkedRow);
  }
  /**
   * Assigns values to a row.
   * @param rowIndex A zero-based row index.
   * @param rowValue An object with the following structure: `{ "column_name": columnValue, ... }`
   * @see getRowValue
   */
  /* rowIndex is a VISIBLE position: the position in visibleRows; under paging a visible position of
     the whole view. A record without a row - on another page - is written by value: the record that
     assigning rowValue to a row of it would write (mergeRecordFields over the questions of the
     columns), with no cell event (writeRecordWithoutItem). */
  public setRowValue(rowIndex: number, rowValue: any): any {
    if (rowIndex < 0) return null;
    const visRows = this.visibleRows;
    const target = this.resolveRecordTarget(rowIndex, visRows.length, (pos: number): QuestionRecordItem => visRows[pos]);
    if (!target) return null;
    if (!!target.item) {
      this.setRowValueCore(<MatrixDropdownRowModelBase>target.item, rowValue);
      return;
    }
    const questions = this.columns.map(column => column.templateQuestion).filter(question => !!question);
    this.writeRecordWithoutItem(target, (record: any): void => { this.mergeRecordFields(record, questions, rowValue); });
  }
  // setRowValue assigned the row before the write: a refusal puts it back as well.
  private setRowValueCore(row: MatrixDropdownRowModelBase, rowValue: any): void {
    row.value = rowValue;
    this.writeItemValue(row, "", rowValue, false);
  }
  protected generateRows(): Array<MatrixDropdownRowModelBase> {
    return null;
  }
  // The rows of the records indexes names, in that order: createRow makes one, and it is told its record.
  protected createRowsForRecords<T extends MatrixDropdownRowModelBase>(indexes: Array<number>, createRow: (index: number) => T): Array<T> {
    return indexes.map((index: number): T => {
      const row = createRow(index);
      this.setBuiltRecordIndex(row, index);
      return row;
    });
  }
  /* One row for one record that appeared after the rows were built: numbered with its record, so that
     what is kept under the record (a detail panel's paged question) finds it, put at position in the
     rows - the end when it is undefined - and announced. The list is not created. */
  protected addRowForRecord<T extends MatrixDropdownRowModelBase>(row: T, recordIndex: number, position?: number): T {
    this.setBuiltRecordIndex(row, recordIndex);
    if (position === undefined) {
      this.generatedVisibleRows.push(row);
    } else {
      this.generatedVisibleRows.splice(position, 0, row);
    }
    this.onMatrixRowCreated(row);
    return row;
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
    return this.formatRecordDisplayValue(keysAsText, rowValue,
      (key: string): Question => row.getQuestionByName(key) || this.getSharedQuestionByName(key, row));
  }
  /* The display values of a record: its row's cells format them, and a record without a row - off
     the page or never built - is formatted by its columns' template questions, so nothing is built
     for it. The record is formatted in place: the caller passes a copy it owns. */
  // A record without a row is formatted as its row would format it: the column, or a question that
  // shares the value name and stores the field.
  protected getRecordDisplayValue(keysAsText: boolean, row: MatrixDropdownRowModelBase, record: any, recordIndex: number): any {
    if (!!row) return this.getRowDisplayValue(keysAsText, row, record);
    return this.formatRecordWithoutObject(keysAsText, record, recordIndex);
  }
  public getPlainData(options: IPlainDataOptions = { includeEmpty: true }): IQuestionPlainData {
    var questionPlainData = super.getPlainData(options);
    if (!!questionPlainData) {
      questionPlainData.isNode = true;
      const prevData = Array.isArray(questionPlainData.data) ? [].concat(questionPlainData.data) : [];
      questionPlainData.data = this.isPagedByList ? this.getRecordsPlainData(options) :
        this.visibleRows.map((row: MatrixDropdownRowModelBase) => this.getRowPlainData(row, options));
      questionPlainData.data = questionPlainData.data.concat(prevData);
    }
    return questionPlainData;
  }
  private getRowPlainData(row: MatrixDropdownRowModelBase, options: IPlainDataOptions): any {
    return this.createRecordPlainData(row.dataName, row.text, row.value, this.getRowDisplayValue(false, row, row.value),
      row.cells.map((cell: MatrixDropdownCell) => cell.question.getPlainData(options)), row, options);
  }
  /* Under paging every visible record has an entry, in view order: a record on the page as its row
     gives it, a record without a row an entry of the same shape whose cell entries come from one cell
     question per column, built without a row and given the record's values in turn. Every entry is
     named by its record. A calculation reads the row, so a record without one gives none. */
  private getRecordsPlainData(options: IPlainDataOptions): Array<any> {
    const res: Array<any> = [];
    let cellQuestions: Array<{ column: MatrixDropdownColumn, question: Question }> = undefined;
    this.forEachRecordRow(this.dataList.getVisibleIndexes(), (index: number, row: MatrixDropdownRowModelBase): void => {
      if (!!row) {
        // Named by its record, as the records without a row are: a row's own name counts its creation.
        const entry = this.getRowPlainData(row, options);
        entry.name = this.getRecordDataName(index);
        res.push(entry);
        return;
      }
      if (!cellQuestions) {
        cellQuestions = this.columns.map((column: MatrixDropdownColumn) => ({ column: column, question: column.createCellQuestion(null) }));
      }
      const value = this.getUnbindValue(this.getListRecordAt(index)) || {};
      const visibleIndex = this.dataList.getGlobalVisibleIndex(index);
      const rowTitle = this.getRecordAccessibilityTitle(index, visibleIndex);
      res.push(this.createRecordPlainData(this.getRecordDataName(index), this.getRecordText(index, visibleIndex), value,
        this.getRecordDisplayValue(false, undefined, this.getUnbindValue(value), index),
        cellQuestions.map((cell) => {
          const q = cell.question;
          q.locTitle.onGetTextCallback = (): string => this.getCellAriaLabel({}, cell.column, rowTitle);
          q.value = value[q.getValueName()];
          q.comment = value[q.getValueName() + Base.commentSuffix];
          return q.getPlainData(options);
        }), undefined, options));
    });
    (cellQuestions || []).forEach(cell => cell.question.dispose());
    return res;
  }
  // What a row of a record would answer as dataName, text and accessibility text: the matrix's own
  // names for its records (the dynamic matrix numbers them).
  protected getRecordDataName(index: number): string {
    return "row" + (index + 1);
  }
  protected getRecordText(index: number, visibleIndex: number): string {
    return "row " + (visibleIndex + 1);
  }
  protected getRecordAccessibilityTitle(index: number, visibleIndex: number): string {
    return (visibleIndex + 1).toString();
  }
  public addConditionObjectsByContext(objects: Array<IConditionObject>, context: any): void {
    let rowElements: Array<any> = [].concat(this.columns);
    if (this.detailPanelMode !== "none") {
      rowElements = rowElements.concat(this.detailPanel.questions);
    }
    const hasColumnContext = !!context && rowElements.indexOf(context) > -1;
    const hasContext = context === true || hasColumnContext;
    const rowsIndeces = this.getConditionObjectsRowIndeces();
    if (hasContext) {
      rowsIndeces.push(-1);
    }
    for (var i = 0; i < rowsIndeces.length; i++) {
      const index = rowsIndeces[i];
      const rowName = index > -1 ? this.getConditionObjectRowName(index) : "row";
      if (!rowName) continue;
      const rowTitle = index > -1 ? this.getConditionObjectRowText(index) : "row";
      const hasQuestionPrefix = index > -1 || context === true;
      const dot = hasQuestionPrefix && index === -1 ? "." : "";
      const prefixName = (hasQuestionPrefix ? this.getValueName() : "") + dot + rowName + ".";
      const prefixTitle = (hasQuestionPrefix ? this.processedTitle : "") + dot + rowTitle + ".";
      for (var j = 0; j < rowElements.length; j++) {
        const rowElement = rowElements[j];
        if (index === -1 && context === rowElement) continue;
        const obj: IConditionObject = {
          name: prefixName + rowElement.name,
          text: prefixTitle + rowElement.fullTitle,
          question: this
        };

        if (index === -1 && context === true) {
          obj.context = this;
        } else {
          if (hasColumnContext && prefixName.startsWith("row.")) {
            obj.context = context;
          }
        }
        objects.push(obj);
      }
    }
  }
  public onHidingContent(): void {
    super.onHidingContent();
    if (!this.generatedVisibleRows) return;
    const questions: Question[] = [];
    this.collectNestedQuestions(questions, true);
    questions.forEach(q => q.onHidingContent());
  }
  protected getIsReadyNestedQuestions(): Array<Question> {
    if (!this.generatedVisibleRows) return [];
    const res = new Array<Question>();
    this.collectNestedQuestonsInRows(this.generatedVisibleRows, res, false, true, false);
    if (!!this.generatedTotalRow) {
      this.collectNestedQuestonsInRows([this.generatedTotalRow], res, false, true, false);
    }
    return res;
  }
  protected collectNestedQuestionsCore(questions: Array<Question>, visibleOnly: boolean, includeNested: boolean, includeItSelf: boolean): void {
    if (includeItSelf) {
      questions.push(this);
    }
    this.collectNestedQuestonsInRows(this.visibleRows, questions, visibleOnly, includeNested, includeItSelf);
  }
  protected collectNestedQuestonsInRows(rows: Array<MatrixDropdownRowModelBase>, questions: Question[], visibleOnly: boolean, includeNested: boolean, includeItSelf: boolean): void {
    this.collectNestedQuestionsOfItems(rows, questions, visibleOnly, includeNested, includeItSelf);
  }
  protected getConditionObjectRowName(index: number): string {
    return "";
  }
  protected getConditionObjectRowText(index: number): string {
    return this.getConditionObjectRowName(index);
  }
  protected getConditionObjectsRowIndeces(): Array<number> {
    return [];
  }
  // QuestionRecordsModel hooks of getProgressInfo.
  protected prepareProgressObjects(): void {
    this.getIsRequireToGenerateRows() && this.generateVisibleRowsIfNeeded();
  }
  protected getProgressInfoOfObjects(): IProgressInfo {
    return SurveyElement.getProgressInfoByElements(this.getCellQuestions(), this.isRequired);
  }
  protected updateProgressInfoByRecord(res: IProgressInfo, record: any): void {
    this.updateProgressInfoByRow(res, record);
  }
  protected getProgressInfoWithoutObjects(): IProgressInfo {
    const res = Base.createProgressInfo();
    this.updateProgressInfoByValues(res);
    if (res.requiredQuestionCount === 0 && this.isRequired) {
      res.requiredQuestionCount = 1;
      res.requiredAnsweredQuestionCount = !this.isEmpty() ? 1 : 0;
    }
    return res;
  }
  protected getIsRequireToGenerateRows(): boolean {
    return !!this.rowsVisibleIf;
  }
  protected updateProgressInfoByValues(res: IProgressInfo): void { }
  // A record is counted by its columns: the value is under the column name.
  protected updateProgressInfoByRow(res: IProgressInfo, rowValue: any): void {
    this.addRecordProgress(res, rowValue, this.columns, (col: MatrixDropdownColumn): Question => col.templateQuestion,
      (col: MatrixDropdownColumn): string => col.name, (col: MatrixDropdownColumn): boolean => col.isRequired);
  }
  private getCellQuestions(): Array<Question> {
    const res: Array<Question> = [];
    this.runFuncForCellQuestions((q: Question) => { res.push(q); });
    return res;
  }

  protected onBeforeValueChanged(val: any) { }
  /* Inside the list side of the assignment (see QuestionRecordsModel.setQuestionValue), before it
     closes. A write the matrix makes itself does not change the row count. The rows take their
     records once the pair is closed (QuestionRecordsModel.onRecordsValueAssigned). */
  protected onRecordsValueStored(): void {
    if (!this.isWritingRecords) {
      this.onBeforeValueChanged(this.value);
    }
    this.updateIsAnswered();
  }
  // The QuestionRecordsModel hooks in matrix terms.
  protected getFields(): Array<IDynamicDataField> {
    const questions = new Array<Question>();
    this.columns.forEach(column => {
      if (!!column.templateQuestion) {
        questions.push(column.templateQuestion);
      }
    });
    return this.getFieldsOfQuestions(questions);
  }
  protected refreshRenderedPage(): void {
    this.resetRenderedTable();
  }
  // The cells' conditions and the totals, which a write to the survey would have re-run.
  protected runRemoteWriteConditions(): void {
    if (!this.generatedVisibleRows) return;
    const properties = this.getDataFilteredProperties();
    this.runCellsCondition(properties);
    if (this.hasTotal) {
      this.runTotalsCondition(properties);
    }
  }
  protected areObjectsBuilt(): boolean {
    return Array.isArray(this.generatedVisibleRows);
  }
  protected validateBuiltPageObjects(context: ValidationContext): boolean {
    return this.validateRowObjects(context);
  }
  protected getRecordItemVariableName(): string {
    return settings.expressionVariables.row;
  }
  protected createRecordItemContext(item: QuestionRecordItem): IValueGetterContext {
    return new MatrixRowGetterContext(<any>item);
  }
  /* QuestionRecordsModel hook: every unique column, keyName included. A record rowsVisibleIf hides does
     not take part, as a hidden row does not on the page; a filtered-out one does. Strings compare as
     the on-page check compares them; the error goes on the later visible record of a pair, on its page. */
  protected getRecordUniqueness(): IDynamicDataRecordUniqueness {
    return { fields: this.getUniqueColumnsNames(), caseSensitive: this.useCaseSensitiveComparison, includeHidden: false, includeFilteredOut: true };
  }
  protected getRecordVisibleIfPropertyName(): string {
    return "rowsVisibleIf";
  }
  /* The rows define the records: a list operation that would insert, remove or move one is refused.
     The dynamic matrix answers false. */
  protected isRecordMembershipFixed(): boolean {
    return true;
  }
  // The matrix base generates no rows (generateRows), so it has no records: the two matrices answer these.
  protected getListRecords(): Array<any> {
    return [];
  }
  // No records, so nothing to write: the fixed membership keeps the count at 0.
  protected setListRecords(records: Array<any>, operations: Array<DynamicDataOperation>): void { }
  // No records, so no record at any index.
  protected getStoredRecordAt(index: number, defaultRecord?: any): any {
    return undefined;
  }
  /* A full rebuild: the rows are re-created for the records the view now holds. It costs the
     per-row state - open detail panels, row errors, cell question state, row ids - and fires the
     row-creation callbacks again. It is the same path a remote page change takes, so there is one.
     The rows' side of a list change, see QuestionRecordsModel.onDataListChanged. */
  protected rebuildFromDataList(isPageMove: boolean): void {
    if (this.isEditingObjectValue) return;
    const hasRows = !!this.generatedVisibleRows;
    if (hasRows) {
      this.decideRecordsVisibilityBeforeCut();
    }
    if (hasRows) {
      this.clearGeneratedRows();
      this.resetRenderedTable();
      this.getVisibleRows();
      this.onRowsChanged();
    }
    /* The totals are the totals of the rows that exist, so a view change recalculates them - and a
       total needs the rows even when nothing has asked for them yet. */
    if (this.hasTotal) {
      if (!hasRows) {
        this.getVisibleRows();
      }
      this.runTotalsCondition(this.getDataFilteredProperties());
    }
  }
  // settings.matrix.maxRowCount is the number of rows one page may hold.
  protected get maxRecordsPerPage(): number {
    return settings.matrix.maxRowCount;
  }
  /* The renderers show a pager under the table while the matrix has more than one page: never in design
     mode or in single-input mode, which do not page. pageCount is the synced property, so a change of it
     re-renders the question. */
  public get showPager(): boolean {
    return this.pageCount > 1;
  }
  // The number of rows on one page, 0 = no paging.
  public get rowsPerPage(): number {
    return this.pageSize;
  }
  public set rowsPerPage(val: number) {
    this.pageSize = val;
  }
  protected getRecordEntityName(): string {
    return "Row";
  }
  protected onPageSizeAssigned(): void {
    this.resetRenderedTable();
    this.updateVisibilityBasedOnRows();
  }
  supportAutoAdvance(): boolean {
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
          (!question.supportAutoAdvance() || !question.value)
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
  // Off the page: the edited records, the pages isEveryPageValidated asks for, and a duplicate pair
  // both of whose records have no row. Either moves to the page that holds the error.
  // QuestionRecordsModel hook of validateElementCore.
  protected validateRecordObjectsOfPage(context: ValidationContext): boolean {
    return this.validateRowObjects(context);
  }
  // The rows that exist and the duplicates they take part in: what a page of a matrix that pages is
  // validated by before the respondent leaves it.
  protected validateRowObjects(context: ValidationContext): boolean {
    const rowsValidation = this.validateRows(context);
    const isDuplicated = this.isValueDuplicated(context);
    return rowsValidation && !isDuplicated;
  }
  // The rows rowsVisibleIf hides are never validated.
  protected isItemVisible(item: QuestionRecordItem): boolean {
    return (<MatrixDropdownRowModelBase>item).isVisible;
  }
  private validateRows(context: ValidationContext): boolean {
    let rows = this.generatedVisibleRows;
    if (!rows) {
      rows = this.visibleRows;
    }
    var res = true;
    (<any>context).isSingleDetailPanel = this.detailPanelMode === "underRowSingle";
    this.validateRecordObjects(context, (): void => {
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].isVisible) {
          res = rows[i].validate(context) && res;
        }
      }
    });
    return res;
  }
  private isValueDuplicated(context: ValidationContext): boolean {
    if (!this.generatedVisibleRows) return false;
    var names = this.getUniqueColumnsNames();
    var res = false;
    for (var i = 0; i < names.length; i++) {
      const rows = this.getDuplicatedRowAndShowErrors(names[i], true);
      if (!!rows && rows.length > 0) {
        context.setErrorElement(rows[0].getQuestionByColumnName(names[i]));
        res = true;
      }
    }
    return res;
  }
  protected getUniqueColumnsNames(): Array<string> {
    var res = new Array<string>();
    for (var i = 0; i < this.columns.length; i++) {
      if (this.columns[i].isUnique) {
        res.push(this.columns[i].name);
      }
    }
    return res;
  }
  private isValueInColumnDuplicated(columnName: string, showErrors: boolean, row?: MatrixDropdownRowModelBase): boolean {
    const rows = this.getDuplicatedRowAndShowErrors(columnName, showErrors, row);
    return !!row ? rows.indexOf(row) > -1 : rows.length > 0;
  }
  private getDuplicatedRowAndShowErrors(columnName: string, showErrors: boolean, row?: MatrixDropdownRowModelBase): Array<MatrixDropdownRowModelBase> {
    const rows = this.getDuplicatedRows(columnName);
    if (showErrors) {
      this.showDuplicatedErrorsInRows(rows, columnName);
    }
    this.removeDuplicatedErrorsInRows(rows, columnName);
    return rows;
  }
  /* One entry per RECORD, with the row that holds it when the record has one: a duplicate of a
     record that has no row still makes the row that repeats it a duplicate, and the error is shown
     on the row that exists. A pair that is entirely outside the view reports nothing - it cannot
     be shown. */
  protected getDuplicationEntries(columnName: string): Array<IMatrixDuplicationEntry> {
    if (this.hasDataListView) return this.getRecordDuplicationEntries(columnName);
    const res = new Array<IMatrixDuplicationEntry>();
    const rows = this.generatedVisibleRows;
    for (let i = 0; i < rows.length; i++) {
      if (!rows[i].isVisible) continue;
      res.push({ row: rows[i], value: this.getDuplicationValue(rows[i], i, columnName) });
    }
    return res;
  }
  // Under a view the records forEachUniquenessRecord names take part; a row that exists takes part when it is visible.
  private getRecordDuplicationEntries(columnName: string): Array<IMatrixDuplicationEntry> {
    const res = new Array<IMatrixDuplicationEntry>();
    this.forEachUniquenessValue(columnName, (item: QuestionRecordItem, position: number): void => {
      const row = <MatrixDropdownRowModelBase>item;
      if (row.isVisible) res.push({ row: row, value: this.getDuplicationValue(row, position, columnName) });
    }, (index: number, value: any): void => { res.push({ row: undefined, value: value }); });
    return res;
  }
  /* position: the row's position in generatedVisibleRows, which both callers have. The row's own record
     is read by it: looking the row up would scan the rows for every row. */
  protected getDuplicationValue(row: MatrixDropdownRowModelBase, position: number, columnName: string): any {
    const question = !!row ? row.getQuestionByName(columnName) : undefined;
    if (!!question) return question.value;
    const rowVal = this.getRowRecordValue(position);
    return !!rowVal ? rowVal[columnName] : undefined;
  }
  // Every row of a group of two or more is marked, as released (the panel marks the later panel).
  private getDuplicatedRows(columnName: string): Array<MatrixDropdownRowModelBase> {
    const res: Array<MatrixDropdownRowModelBase> = [];
    const groups = groupByDuplicateKey(this.getDuplicationEntries(columnName),
      (entry: IMatrixDuplicationEntry): any => entry.value, this.useCaseSensitiveComparison);
    groups.forEach((group: Array<IMatrixDuplicationEntry>): void => {
      if (group.length > 1) {
        group.forEach(entry => { if (!!entry.row) res.push(entry.row); });
      }
    });
    return res;
  }
  private showDuplicatedErrorsInRows(duplicatedRows: Array<MatrixDropdownRowModelBase>, columnName: string): void {
    duplicatedRows.forEach(row => {
      let question = row.getQuestionByName(columnName);
      const inDetailPanel = this.detailPanelValue?.getQuestionByName(columnName);
      if (!question && inDetailPanel) {
        row.showDetailPanel();
        if (row.detailPanel) {
          question = row.detailPanel.getQuestionByName(columnName);
        }
      }
      if (question) {
        if (inDetailPanel) {
          row.showDetailPanel();
        }
        this.addDuplicationError(question);
      }
    });
  }
  private removeDuplicatedErrorsInRows(duplicatedRows: Array<MatrixDropdownRowModelBase>, columnName: string): void {
    this.generatedVisibleRows.forEach(row => {
      if (duplicatedRows.indexOf(row) < 0) {
        const question = row.getQuestionByName(columnName);
        if (question) {
          this.removeDuplicationError(row, question);
        }
      }
    });
  }
  private getDuplicationError(question: Question): SurveyError {
    const errors = question.errors;
    for (let i = 0; i < errors.length; i ++) {
      if (errors[i].getErrorType() === "keyduplicationerror") return errors[i];
    }
    return null;
  }
  private addDuplicationError(question: Question) {
    if (!this.getDuplicationError(question)) {
      question.addError(new KeyDuplicationError(this.keyDuplicationError, this));
    }
  }
  private removeDuplicationError(row: MatrixDropdownRowModelBase, question: Question) {
    if (question.removeError(this.getDuplicationError(question)) && question.errors.length === 0 && !!row.editingObj) {
      (<any>row.editingObj)[question.getValueName()] = question.value;
    }
  }
  public getFirstQuestionToFocus(withError: boolean): Question {
    return this.getFirstCellQuestion(withError);
  }
  protected getFirstInputElementId(): string | (() => HTMLElement) {
    var question = this.getFirstCellQuestion(false);
    return question ? question.inputId : super.getFirstInputElementId();
  }
  protected getFirstErrorInputElementId(): string | (() => HTMLElement) {
    var question = this.getFirstCellQuestion(true);
    return question ? question.inputId : super.getFirstErrorInputElementId();
  }
  protected getFirstCellQuestion(onError: boolean): Question {
    if (!this.generatedVisibleRows) return null;
    for (var i = 0; i < this.generatedVisibleRows.length; i++) {
      var cells = this.generatedVisibleRows[i].cells;
      for (var colIndex = 0; colIndex < cells.length; colIndex++) {
        const q = cells[colIndex].question;
        if (q.isVisible && !q.isReadOnly && (!onError || q.currentErrorCount > 0)) return q;
      }
    }
    return null;
  }
  protected onReadOnlyChanged() {
    super.onReadOnlyChanged();
    if (!this.generateRows) return;
    for (var i = 0; i < this.visibleRows.length; i++) {
      this.visibleRows[i].onQuestionReadOnlyChanged();
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
    // A temporary row of the records clean-up: a question it does not judge stays loading, so it sends no request.
    if (this.isRecordCleanupBuilding && this.isRecordCleanupSkipped(column.templateQuestion))question.startLoadingFromJson();
    question.setSurveyImpl(row);
    question.setParentQuestion(this);
    question.inMatrixMode = true;
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
  private isDoingonAnyValueChanged: boolean;
  /* The rows and the totals follow the change. A matrix does not re-validate its own validators when
     another value changes (Question.onAnyValueChanged): it never has. */
  onAnyValueChanged(name: string, questionName: string): void {
    if (this.isUpdateLocked || this.isDoingonAnyValueChanged) return;
    this.isDoingonAnyValueChanged = true;
    try {
      this.onAnyValueChangedInItems(name, questionName);
      // The total row is outside the record walk. It is created with the rows: before them there is
      // nothing for it to total.
      const totalRow = this.areObjectsBuilt() ? this.visibleTotalRow : null;
      if (!!totalRow) {
        totalRow.onAnyValueChanged(name, questionName);
      }
    } finally {
      this.isDoingonAnyValueChanged = false;
    }
  }
  protected isObject(value: any) {
    return value !== null && typeof value === "object";
  }
  private getOnCellValueChangedOptions(
    row: MatrixDropdownRowModelBase,
    columnName: string,
    rowValue: any
  ): any {
    const getQuestion = (colName: any) => {
      return row.getQuestionByName(colName);
    };
    return {
      row: row,
      columnName: columnName,
      rowValue: rowValue,
      value: !!rowValue ? rowValue[columnName] : null,
      getCellQuestion: getQuestion,
      cellQuestion: row.getQuestionByName(columnName),
      column: this.getColumnByName(columnName)
    };
  }
  protected onCellValueChanged(row: MatrixDropdownRowModelBase, columnName: string, rowValue: any, oldCellValue?: any): void {
    if (!this.survey) return;
    var options = this.getOnCellValueChangedOptions(row, columnName, rowValue);
    options.oldValue = oldCellValue;
    if (!!this.onCellValueChangedCallback) {
      this.onCellValueChangedCallback(options);
    }
    this.matrixCallbacks.matrixCellValueChanged(this, options);
  }
  validateCell(row: MatrixDropdownRowModelBase, columnName: string, rowValue: any): SurveyError {
    if (!this.survey) return;
    var options = this.getOnCellValueChangedOptions(row, columnName, rowValue);
    return this.matrixCallbacks.matrixCellValidate(this, options);
  }
  get isValidateOnValueChanging(): boolean {
    return !!this.survey ? this.validationCallbacks.isValidateOnValueChanging : false;
  }
  protected get hasInvisibleRows(): boolean {
    const rows = this.generatedVisibleRows;
    if (!Array.isArray(rows)) return false;
    for (let i = 0; i < rows.length; i ++) {
      if (!rows[i].isVisible) return true;
    }
    return false;
  }
  /* Under paging the records answer, whether or not the page's rows are built; without paging the
     rows, and before they exist the records a view shows. */
  getFilteredData(): any {
    if (this.isEmpty() || this.isEditingSurveyElement) return this.value;
    if (this.isPagedByList) return this.getPagedFilteredData();
    if (!this.generatedVisibleRows) {
      return this.hasRecordView ? this.getPagedFilteredData() : this.value;
    }
    return this.getFilteredDataCore();
  }
  protected getFilteredDataCore(): any { return this.value; }
  // forEachRecordItem with the rows typed.
  protected forEachRecordRow(indexes: Array<number>, func: (index: number, row: MatrixDropdownRowModelBase, position: number) => void): void {
    this.forEachRecordItem(indexes, (index: number, item: QuestionRecordItem, position: number): void => {
      func(index, <MatrixDropdownRowModelBase>item, position);
    });
  }
  // One walk, the result in the answer's shape: func adds what a record contributes.
  protected collectRecordValues(indexes: Array<number>, func: (index: number, row: MatrixDropdownRowModelBase, add: (value: any) => void) => void): any {
    const res = this.createRecordValues();
    this.forEachRecordRow(indexes, (index: number, row: MatrixDropdownRowModelBase): void => {
      func(index, row, (value: any): void => { this.addRecordValue(res, index, value); });
    });
    return res;
  }
  // The dynamic matrix collects an array, in walk order.
  protected createRecordValues(): any {
    return [];
  }
  protected addRecordValue(values: any, index: number, value: any): void {
    values.push(value);
  }
  /* Under paging - and before the rows of a view exist - the survey data and the totals are the view's
     records, not the page's rows: a record with a row gives its filteredValue (the values of invisible
     cells dropped), a record without one is taken as it is stored - it has no cells to be invisible. */
  protected getPagedFilteredData(): any {
    return this.collectRecordValues(this.dataList.getVisibleIndexes(), (index: number, row: MatrixDropdownRowModelBase, add: (value: any) => void): void => {
      if (!!row) {
        if (row.isVisible && !row.isEmpty) add(row.filteredValue);
        return;
      }
      const record = this.getListRecordAt(index);
      if (!this.isValueEmpty(record)) add(record);
    });
  }
  onRowChanging(
    row: MatrixDropdownRowModelBase,
    columnName: string,
    rowValue: any
  ): any {
    if (!this.survey && !this.cellValueChangingCallback) return !!rowValue ? rowValue[columnName] : null;
    var options = this.getOnCellValueChangedOptions(row, columnName, rowValue);
    var oldRowValue = this.getRowValueCore(row, this.createNewValue(), true);
    options.oldValue = !!oldRowValue ? oldRowValue[columnName] : null;
    if (!!this.cellValueChangingCallback) {
      options.value = this.cellValueChangingCallback(row, columnName, options.value, options.oldValue);
    }
    if (!!this.survey) {
      this.matrixCallbacks.matrixCellValueChanging(this, options);
    }
    return options.value;
  }
  updateItemValue(row: MatrixDropdownRowModelBase, columnName: string, newRowValue: any, isDeletingValue: boolean): void {
    const cellValue = !!newRowValue && !isDeletingValue ? newRowValue[columnName] : undefined;
    if (this.writeRecordCleanupCopy(row, this.getItemIndex(row) < 0, columnName, cellValue)) return;
    var rowObj = !!columnName ? this.getRowObj(row) : null;
    if (!!rowObj) {
      var oldCellValue = rowObj[columnName];
      var columnValue = null;
      if (!!newRowValue && !isDeletingValue) {
        columnValue = newRowValue[columnName];
      }
      this.writeRecords((): void => Serializer.setObjPropertyValue(rowObj, columnName, columnValue));
      this.onCellValueChanged(row, columnName, rowObj, oldCellValue);
    } else {
      const res = this.updateRowValueInData(row, columnName, newRowValue, isDeletingValue);
      // Nothing changed: the unique-column check is skipped as well, exactly as before.
      if (!res) return;
      if (columnName) {
        this.onCellValueChanged(row, columnName, res.rowValue, res.oldCellValue);
      }
    }
    if (this.getUniqueColumnsNames().indexOf(columnName) > -1) {
      this.isValueInColumnDuplicated(columnName, !!rowObj);
    }
  }
  /* The seam for the record storage: a cell write is a record write of the list - the record the row
     holds, through the question's own source (getListRecords / setListRecords). Returns null when
     nothing changed. */
  protected updateRowValueInData(row: MatrixDropdownRowModelBase, columnName: string,
    newRowValue: any, isDeletingValue: boolean): { rowValue: any, oldCellValue: any } {
    if (this.isEditingObjectValue) return this.updateRowValueInWholeValue(row, columnName, newRowValue, isDeletingValue);
    const index = this.getRecordIndexOf(row);
    if (index < 0) return null;
    const oldRecord = this.dataList.getRecord(index);
    const oldCellValue = oldRecord?.[columnName];
    // The merge is the base's, over a copy of the record (writeRecordAt).
    const rowValue = this.writeRecordAt(index, (record: any): void => this.mergeRowValue(record, row, columnName, newRowValue, isDeletingValue),
      (): void => this.markRecordTouchedByField(index, row, columnName));
    return !!rowValue ? { rowValue: rowValue, oldCellValue: oldCellValue } : null;
  }
  /* The cell write of a value that is edited in place (isEditingObjectValue): the whole value is
     composed and assigned, and the list is not involved. */
  protected updateRowValueInWholeValue(row: MatrixDropdownRowModelBase, columnName: string,
    newRowValue: any, isDeletingValue: boolean): { rowValue: any, oldCellValue: any } {
    const oldValue = this.createNewValue(true);
    const oldRowValue = this.getRowValueCore(row, oldValue, true);
    const oldCellValue = oldRowValue?.[columnName];
    const combine = this.getNewValueOnRowChanged(
      row,
      columnName,
      newRowValue,
      isDeletingValue,
      this.createNewValue()
    );
    if (this.isTwoValueEquals(oldValue, combine.value)) return null;
    this.writeRecords((): void => this.setOwnRecordsValue(combine.value));
    return { rowValue: combine.rowValue, oldCellValue: oldCellValue };
  }
  /* The per-row half of a cell change: which keys of a record belong to the row's questions is
     question knowledge. It mutates the record it is given - the base passes the row object inside
     its own value copy, matrix dynamic passes a copy of the record its list holds. */
  protected mergeRowValue(rowValue: any, row: MatrixDropdownRowModelBase, columnName: string,
    newRowValue: any, isDeletingValue: boolean): void {
    if (isDeletingValue) {
      delete rowValue[columnName];
    }
    this.mergeRecordFields(rowValue, row.questions, newRowValue);
  }
  // The fields of the questions give way to the non-empty values of newRowValue; the other fields stay.
  private mergeRecordFields(rowValue: any, questions: Array<Question>, newRowValue: any): void {
    questions.forEach(q => {
      delete rowValue[q.getValueName()];
    });
    if (newRowValue) {
      newRowValue = JSON.parse(JSON.stringify(newRowValue));
      for (var key in newRowValue) {
        if (!this.isValueEmpty(newRowValue[key])) {
          rowValue[key] = newRowValue[key];
        }
      }
    }
  }
  private getNewValueOnRowChanged(row: MatrixDropdownRowModelBase,
    columnName: string, newRowValue: any, isDeletingValue: boolean, newValue: any): any {
    const rowValue = this.getRowValueCore(row, newValue, true);
    this.mergeRowValue(rowValue, row, columnName, newRowValue, isDeletingValue);
    if (this.isObject(rowValue) && Object.keys(rowValue).length === 0) {
      newValue = this.deleteRowValue(newValue, row);
    }
    newValue = this.correctValueForMinMaxRows(newValue);
    return { value: newValue, rowValue: rowValue };
  }
  protected correctValueForMinMaxRows(newValue: any): any { return newValue; }
  // The row's position in generatedVisibleRows: under paging a position on the page.
  getItemIndex(item: ISurveyData): number {
    if (!Array.isArray(this.generatedVisibleRows)) return -1;
    return this.generatedVisibleRows.indexOf(<any>item);
  }
  // QuestionRecordsModel hooks of a removal: the rows are the objects, and a removal writes the list.
  protected getItemPosition(item: QuestionRecordItem): number {
    return this.getItemIndex(item);
  }
  protected detachItem(removal: IRecordRemoval): void {
    const rows = this.generatedVisibleRows;
    if (removal.position > -1 && Array.isArray(rows)) {
      rows.splice(removal.position, 1);
    }
  }
  protected removeStoredRecord(removal: IRecordRemoval, refill: () => void): void {
    this.dataList.remove(removal.recordIndex);
    refill();
  }
  /* The one seam between an object and its record. getItemIndex stays the row position - it is
     IMatrixDropdownData API and the rendered table addresses rows by position - and this is the
     record the row at that position holds. Without a list the rows are built for every record in
     record order, so the position is the record index; nothing is created for it. */
  protected getRecordIndexOf(item: ISurveyData): number {
    return this.getRecordIndexAtRowPosition(this.getItemIndex(item));
  }
  // The record the row at a position in generatedVisibleRows holds; -1 for no position.
  protected getRecordIndexAtRowPosition(position: number): number {
    return position < 0 ? -1 : this.getRecordIndexAtCreatedPosition(position);
  }
  protected getItemRecordIndex(item: ISurveyData): number {
    const cleanupIndex = this.getRecordCleanupIndex(item, this.getItemIndex(item) < 0);
    if (cleanupIndex > -1) return cleanupIndex;
    return this.getRecordIndexOf(item);
  }
  /* One row per record in the view. Without a filter and a sort that is one row per record, in
     record order, which is what createNewValue() composed the value for. The live-object value
     (Creator's property grid) is never filtered: its rows follow the edited array. */
  protected getRecordIndexesForRows(): Array<number> {
    if (this.isEditingObjectValue || !this.hasDataListView) {
      const count = this.getRecordCountForRows();
      const res = new Array<number>(count);
      for (let i = 0; i < count; i++) {
        res[i] = i;
      }
      return res;
    }
    return this.dataList.getMaterializedIndexes();
  }
  // The number of rows built without a view: one per record.
  protected getRecordCountForRows(): number {
    return this.getListRecordCount();
  }
  // The value is a Base object, or an array of them, edited in place (Creator's property grid): it is
  // never routed through the list, see the comments on the operations that branch on it.
  protected get isEditingObjectValue(): boolean {
    return this.isValueSurveyElement(this.value);
  }
  protected getItemVisibleIndex(item: ISurveyData): number {
    if (item instanceof MatrixDropdownRowModelBase) {
      const rows = this.visibleRows;
      if (!rows) return item.visibleIndex;
      return this.getVisibleIndexAtPosition(rows.indexOf(item));
    }
    return this.getRecordItemVisibleIndex(item);
  }
  // The row at a position among the visible rows (getItemByVisibleIndex); null while there are none.
  protected getVisibleItemAt(position: number): QuestionRecordItem {
    const rows = this.visibleRows;
    if (!rows) return null;
    return position >= 0 && position < rows.length ? rows[position] : undefined;
  }
  // The item {matrix[index].x} reads. index is a record index; a record without a row - filtered
  // out, off the page or not built - is read as a value.
  protected getExpressionItem(index: number): QuestionRecordItem {
    // Reading allRows builds the rows, so that a record that has a row is answered by the row.
    const rows = this.allRows;
    /* A row past the record count is on its way out: a lower rowCount truncates the value before the
       rows follow, and the survey runs the expressions in between. The row still answers, from the
       truncated value, as released: its fields are found and empty. */
    if (!this.hasDataListView) return index < rows.length ? rows[index] : null;
    return this.getViewExpressionItem(index);
  }
  public getElementsInDesign(includeHidden: boolean = false): Array<IElement> {
    let elements: Array<IElement>;
    if (this.detailPanelMode == "none") {
      elements = super.getElementsInDesign(includeHidden);
    } else {
      elements = includeHidden ? [this.detailPanel] : this.detailElements;
    }
    return this.columns.concat(elements);
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
    // A hide is where a row may drop its detail panel (hideDetailPanel(true)): its states are kept first.
    if (!val && !!row.detailPanel) {
      this.keepDetailPanelPageStates([row]);
    }
    if (val == this.getIsDetailPanelShowing(row)) return;
    if (val && this.detailPanelMode === "underRowSingle") {
      var rows = this.visibleRows;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].isDetailPanelShowing) {
          rows[i].hideDetailPanel();
        }
      }
    }
    this.setPropertyValue("isRowShowing" + row.id, val);
    if (!!this.renderedTable) {
      this.renderedTable.onDetailPanelChangeVisibility(row, val);
    }
    if (this.survey) {
      // The row's position in the whole view, as the event has always passed (getRecordViewIndex).
      this.matrixCallbacks.matrixDetailPanelVisibleChanged(this, this.getItemViewIndex(row), row, val);
    }
  }
  /* The paged questions of a row's detail panel keep their page states under the row's record when the
     row is disposed or its detail panel is hidden, and a new detail panel of the record takes them
     back (createRowDetailPanel). A row whose detail panel was never created hands nothing over. */
  private keepDetailPanelPageStates(rows: Array<MatrixDropdownRowModelBase>): void {
    this.keepNestedPageStates(rows);
  }
  // QuestionRecordsModel hook: a row's detail panel questions keep their page states under the row's record.
  protected getNestedStateQuestions(row: QuestionRecordItem): Array<Question> {
    const panel = (<MatrixDropdownRowModelBase>row).detailPanel;
    return !!panel ? panel.questions : undefined;
  }
  createRowDetailPanel(row: MatrixDropdownRowModelBase): PanelModel {
    if (this.isDesignMode) return this.detailPanel;
    var panel = this.createNewDetailPanel();
    panel.readOnly = this.isMatrixReadOnly() || !row.isRowEnabled();
    panel.setSurveyImpl(row);
    var json = this.detailPanel.toJSON();
    if (this.isRecordCleanupBuilding) {
      removeRecordCleanupSkipped(json, this.detailPanel.questions.filter((q: Question): boolean => this.isRecordCleanupSkipped(q)).map((q: Question): string => q.name));
    }
    new JsonObject().toObject(json, panel);
    panel.renderWidth = "100%";
    panel.updateCustomWidgets();
    if (!!this.onCreateDetailPanelCallback) {
      this.onCreateDetailPanelCallback(row, panel);
    }
    panel.questions.forEach(q => q.setParentQuestion(this));
    panel.onSurveyLoad();
    // The questions hold the row's values by now: a restored page is not reset by them.
    this.restorePageStatesOfQuestions(this.getBuiltRecordIndex(row), panel.questions);
    return panel;
  }
  getSharedQuestionByName(
    columnName: string,
    row: MatrixDropdownRowModelBase
  ): Question {
    if (!this.survey || !this.valueName) return null;
    var index = this.getItemRecordIndex(row);
    if (index < 0) return null;
    return <Question>(
      this.survey.getQuestionByValueNameFromRecord(
        this.valueName,
        columnName,
        index
      )
    );
  }
  // index is a CREATED position among the rows that exist: under paging a position on the page.
  getItem(index: number): QuestionRecordItem {
    if (index < 0 || !this.generatedVisibleRows || index >= this.generatedVisibleRows.length) return null;
    return this.generatedVisibleRows[index];
  }
  onTotalValueChanged(): any {
    if (
      !!this.data &&
      !!this.visibleTotalRow &&
      !this.isUpdateLocked &&
      !this.isSett
    ) {
      this.data.setValue(
        this.getValueName() + settings.matrix.totalsSuffix,
        this.totalValue,
        false
      );
    }
  }
  // One hook for the whole matrix, not one per cell: the cell questions read it (parentIsReadOnly).
  isMatrixReadOnly(): boolean { return this.areRecordsReadOnly; }
  onRowVisibilityChanged(row: MatrixDropdownRowModelBase): void {
    this.clearVisibleRows();
    this.resetRenderedTable();
    this.resetSingleInput();
    // A hidden row takes no page slot: the page count follows row visibility (setItemRecordVisible).
    this.setItemRecordVisible(!!this.dataListValue ? this.getRecordIndexOf(row) : -1, row.isVisible);
  }
  /* Without paging the error walks keep the scope they have always had: every row's cells report
     their errors, a hidden row's included, and the cells of the visible rows are cleared; the detail
     panels take part in neither. With paging they walk the objects of the page, as the validation
     does. */
  protected clearItemErrors(): void {
    if (this.isPagingActive) {
      super.clearItemErrors();
      return;
    }
    this.runFuncForCellQuestions((q: Question): void => { q.clearErrors(); });
  }
  protected getItemErrors(): Array<SurveyError> {
    if (this.isPagingActive) return super.getItemErrors();
    let res: Array<SurveyError> = [];
    (this.generatedVisibleRows || []).forEach((row: MatrixDropdownRowModelBase): void => {
      row.cells.forEach((cell: MatrixDropdownCell): void => {
        const errors = cell.question.getAllErrors();
        if (errors && errors.length > 0) {
          res = res.concat(errors);
        }
      });
    });
    return res;
  }
  protected clearValueIfInvisibleCore(reason: string): void {
    super.clearValueIfInvisibleCore(reason);
    this.clearInvisibleValuesInRows();
  }
  protected clearInvisibleValuesInRows(): void {
    if (this.isRemoteData) return;
    if (this.isEmpty()) return;
    /* Under paging the records rowsVisibleIf hides have no row, on whatever page they are: their
       visibility is decided over the stored values, for every record (one expression run each), when
       the survey clears invisible values - never on an ordinary edit. */
    if (this.isPagedByList && !!this.data) {
      this.updatePagedRecordsVisibility(this.getDataFilteredProperties());
    }
    if (!this.isRowsFiltered()) return;
    const sharedQuestions = this.survey?.questionsByValueName(this.getValueName()) || [];
    if (sharedQuestions.length < 2) {
      this.value = this.getDataWithoutInvisibleRows();
    }
  }
  /* What stays in the value when the owner-hidden rows are cleared. It is not getFilteredData():
     that one answers for the view - the rows that exist - and a record the list filter excluded has
     no row at all, so taking it from there would erase it. */
  /* Clearing the values of invisible rows may only touch the records that HAVE a row: a record the
     list filter excluded is not invisible, it is unrepresented, and dropping it here would delete
     it from question.value. */
  protected getDataWithoutInvisibleRows(): any {
    if (!this.hasDataListView) return this.getFilteredData();
    // loadedCount, not count: with a data source that pages, count is the server total and only the
    // records of the loaded window can be looked at. Equal for every local source.
    return this.collectRecordValues(this.getLoadedRecordIndexes(), (index: number, row: MatrixDropdownRowModelBase, add: (value: any) => void): void => {
      if (!row) {
        // A row's filteredValue holds the keys its questions store: a record without a row loses the others too.
        if (this.isRecordKeptWithoutRow(index)) add(this.getRecordWithoutUnknownKeys(index));
      } else if (row.isVisible && !row.isEmpty) {
        add(row.filteredValue);
      }
    });
  }
  private getRecordWithoutUnknownKeys(index: number): any {
    const record = this.getListRecordAt(index);
    if (!Helpers.isValueObject(record, true)) return record;
    const keys = this.getRecordUnknownKeys(index, record, undefined);
    if (keys.length === 0) return record;
    const res = Object.assign({}, record);
    keys.forEach((key: string): void => { delete res[key]; });
    return res;
  }
  /* A record without a row keeps its answer when invisible values are cleared - one the list filter
     excludes is unrepresented, not invisible - except a record rowsVisibleIf hides in a list that
     pages in memory: its row is never built, and its answer goes as a hidden row's does. A source that
     pages itself holds one window, and its records are not removed. */
  protected isRecordKeptWithoutRow(index: number): boolean {
    return !this.isPagedByList || this.dataList.isRecordVisible(index);
  }
  /* An identity test: getVisibleFromGenerated returns the very array it was given when no row is
     owner-hidden. A list filter alone therefore reads as "not filtered", which is what it has to be
     - the rows that exist are all visible and there is nothing to clear. Under paging in memory a
     hidden record has no row, so the list's flags say it. */
  protected isRowsFiltered(): boolean {
    if (this.visibleRows !== this.generatedVisibleRows) return true;
    const list = this.dataListValue;
    return this.isPagedByList && list.getVisibleIndexes().length !== list.getCreatedIndexes().length;
  }
  /* index is a VISIBLE position - what it has always been for this method; under paging a visible
     position of the whole view. A record without a row on the page answers null: nothing is built and
     the page stays (getQuestionFromRecord reaches the row a record has). */
  public getQuestionFromArray(name: string, index: number): IQuestion {
    const rows = this.visibleRows;
    if (this.isPagingActive) {
      const recordIndex = this.getRecordIndexAtVisibleIndex(index);
      return recordIndex < 0 ? null : this.getQuestionFromRecord(name, recordIndex);
    }
    if (index >= rows.length) return null;
    return rows[index].getQuestionByName(name);
  }
  /* QuestionRecordsModel hooks of getQuestionFromRecord. Without a view the rows are built first, as
     the released lookup built them: another question on the same value name asks for a column of a row
     it reads. A view builds nothing here (the page stays). */
  protected prepareQuestionFromRecord(): void {
    if (!this.generatedVisibleRows && !this.hasDataListView)this.visibleRows;
  }
  protected getItemQuestionByName(row: QuestionRecordItem, name: string): IQuestion {
    return (<MatrixDropdownRowModelBase>row).getQuestionByName(name);
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
    return this.SurveyModel.getElementWrapperComponentName(cell, cell.row instanceof MatrixDropdownTotalRowModel ? "row-footer" : "cell");
  }
  public getCellWrapperComponentData(cell: MatrixDropdownCell) {
    return this.SurveyModel.getElementWrapperComponentData(cell, cell.row instanceof MatrixDropdownTotalRowModel ? "row-footer" : "cell");
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
  protected onMobileChanged(): void {
    super.onMobileChanged();
    this.resetRenderedTable();
  }
  public getRootCss(): string {
    return toCssClasses(super.getRootCss(), this.horizontalScroll && this.cssClasses.rootScroll);
  }
  public afterRenderQuestionElement(el: HTMLElement): void {
    super.afterRenderQuestionElement(el);
    this.setRootElement(el?.parentElement);
  }
  public beforeDestroyQuestionElement(el: HTMLElement): void {
    super.beforeDestroyQuestionElement(el);
    this.setRootElement(undefined);
  }

  private rootElement: HTMLElement;
  public setRootElement(val: HTMLElement): void {
    this.rootElement = val;
  }
  public getRootElement(): HTMLElement {
    return this.rootElement;
  }
  public get dragDropMatrixAttribute(): string {
    return this.renderedTable.wrapperDropTargetId;
  }
}

export class MatrixDropdownBaseSingleInputBehavior extends QuestionRecordsSingleInputBehavior<MatrixDropdownRowModelBase> {
  protected get matrixBase(): QuestionMatrixDropdownModelBase {
    return this.question as QuestionMatrixDropdownModelBase;
  }
  protected getSingleQuestionLocTitleCore(): LocalizableString {
    return this.matrixBase.locSingleInputTitleTemplate;
  }
  protected getRecords(): Array<MatrixDropdownRowModelBase> {
    return this.matrixBase.visibleRows;
  }
  protected getRecordOfQuestion(question: Question): MatrixDropdownRowModelBase {
    return <any>question.data;
  }
  // A navigation check, not a validation: it must not show errors or expand detail panels/questions.
  protected isRecordValid(row: MatrixDropdownRowModelBase): boolean {
    return row.validate(new ValidationContext({ fireCallback: false }));
  }
}

Serializer.addClass(
  "matrixdropdownbase",
  [
    { name: "showCommentArea:switch", visible: true },
    "columnsVisibleIf:condition",
    "rowsVisibleIf:condition",
    "columnMinWidth",
    { name: "showHeader:boolean", default: true },
    {
      name: "verticalAlign",
      choices: ["top", "middle"],
      default: "middle",
    },
    { name: "alternateRows:boolean", default: false },
    {
      name: "displayMode",
      default: "auto",
      choices: ["auto", "table", "list"],
      visible: false
    },
    {
      name: "columns:matrixdropdowncolumns",
      uniqueProperty: "name",
      className: "matrixdropdowncolumn",
      isArray: true
    },
    {
      name: "columnLayout",
      alternativeName: "columnsLocation",
      choices: ["horizontal", "vertical"],
      visible: false, isSerializable: false
    },
    {
      name: "transposeData:boolean", version: "1.9.130", oldName: "columnLayout"
    },
    {
      name: "detailElements",
      baseClassName: "question",
      visible: false,
      isLightSerializable: false,
    },
    {
      name: "detailPanelMode",
      choices: ["none", "underRow", "underRowSingle"],
      default: "none",
    },
    { name: "cellErrorLocation", default: "default", choices: ["default", "top", "bottom"] },
    {
      name: "detailErrorLocation", default: "default", choices: ["default", "top", "bottom"],
      visibleIf: (obj: any) => { return !!obj && obj.detailPanelMode != "none"; }
    },
    { name: "horizontalScroll:boolean", visible: false, },
    {
      name: "choices:itemvalue[]", uniqueProperty: "value", visibleIf: (obj): boolean => obj.isSelectCellType()
    },
    { name: "placeholder", alternativeName: "optionsCaption", serializationProperty: "locPlaceholder" },
    { name: "keyDuplicationError", serializationProperty: "locKeyDuplicationError", },
    {
      name: "singleInputTitleTemplate", serializationProperty: "locSingleInputTitleTemplate",
      visibleIf(obj) { return obj.survey?.questionsOnPageMode === "inputPerPage"; }
    },
    {
      name: "cellType",
      defaultFunc: () => settings.matrix.defaultCellType,
      choices: () => {
        return MatrixDropdownColumn.getColumnTypes();
      },
    },
    { name: "columnColCount", default: 0, choices: [0, 1, 2, 3, 4] },
    { name: "allowAdaptiveActions:boolean", default: false, visible: false },
    // The paging, the sort and the filter of every matrix with rows (the Dynamic Matrix and the Multi-Select Matrix inherit them).
    ...getRecordViewProperties("rowsPerPage"),
  ],
  function () {
    return new QuestionMatrixDropdownModelBase("");
  },
  "question"
);
