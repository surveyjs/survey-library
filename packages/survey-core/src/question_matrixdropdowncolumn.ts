import { JsonObject, JsonObjectProperty, Serializer } from "./jsonobject";
import { Question } from "./question";
import { Base, ArrayChanges } from "./base";
import { ISurvey, IWrapperObject } from "./base-interfaces";
import { ItemValue } from "./itemvalue";
import { QuestionSelectBase } from "./question_baseselect";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { SurveyValidator } from "./validator";
import { getCurrecyCodes } from "./question_expression";
import { settings } from "./settings";
import { MatrixDropdownRowModelBase, QuestionMatrixDropdownModelBase } from "./question_matrixdropdownbase";
import { IObjectValueContext, IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo, IValueGetterItem, PropertyGetterContext } from "./conditionProcessValue";

export interface IMatrixColumnOwner extends ILocalizableOwner {
  hasChoices(): boolean;
  onColumnPropertyChanged(column: MatrixDropdownColumn, name: string, newValue: any): void;
  onColumnNestedPropertyChanged(column: MatrixDropdownColumn, name: string, nestedName: string, newValue: any): void;
  onColumnItemValuePropertyChanged(
    column: MatrixDropdownColumn,
    propertyName: string,
    obj: ItemValue,
    name: string,
    newValue: any,
    oldValue: any
  ): void;
  onShowInMultipleColumnsChanged(column: MatrixDropdownColumn): void;
  onColumnVisibilityChanged(column: MatrixDropdownColumn): void;
  getCellType(): string;
  getCustomCellType(column: MatrixDropdownColumn, row: MatrixDropdownRowModelBase, cellType: string): string;
  onColumnCellTypeChanged(column: MatrixDropdownColumn): void;
  getCellAriaLabel(row: any, column: any, directRowTitle?: string): string;
}
export class MatrixColumnGetterContext implements IValueGetterContext {
  constructor(private column: MatrixDropdownColumn) {
  }
  public getObj(): Base { return this.column; }
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    const name = path.length > 0 ? path[0].name.toLocaleLowerCase() : "";
    const expVar = settings.expressionVariables;
    const isColumnVar = [expVar.self, expVar.column].indexOf(name) > -1;
    if (params.isProperty && path.length > 1 && isColumnVar) {
      params.path = path.slice(1);
      return new PropertyGetterContext(this.column).getValue(params);
    }
    if (path.length === 1 && ["name", "item"].indexOf(name) > -1)
      return { isFound: true, value: this.column.name };
    return undefined;
  }
  getRootObj(): IObjectValueContext { return <any>this.column.colOwner; }
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
function onUpdateSelectDropdownCellQuestion(cellQuestion: QuestionSelectBase, column: MatrixDropdownColumn,
  question: QuestionMatrixDropdownModelBase, data: any) {
  onUpdateSelectBaseCellQuestion(cellQuestion, column, question, data);
  if (!!cellQuestion.locPlaceholder && cellQuestion.locPlaceholder.isEmpty && !question.locPlaceholder.isEmpty) {
    cellQuestion.placeholder = question.placeholder;
  }
}
export var matrixDropdownColumnTypes: any = {
  dropdown: {
    onCellQuestionUpdate: (cellQuestion: any, column: any, question: any, data: any) => {
      onUpdateSelectDropdownCellQuestion(cellQuestion, column, question, data);
    }
  },
  checkbox: {
    onCellQuestionUpdate: (cellQuestion: any, column: any, question: any, data: any) => {
      onUpdateSelectBaseCellQuestion(cellQuestion, column, question, data);
      cellQuestion.colCount =
        column.colCount > -1 ? column.colCount : question.columnColCount;
    },
  },
  radiogroup: {
    onCellQuestionUpdate: (cellQuestion: any, column: any, question: any, data: any) => {
      onUpdateSelectBaseCellQuestion(cellQuestion, column, question, data);
      cellQuestion.colCount =
        column.colCount > -1 ? column.colCount : question.columnColCount;
    },
  },
  tagbox: {
    onCellQuestionUpdate: (cellQuestion: any, column: any, question: any, data: any) => {
      onUpdateSelectBaseCellQuestion(cellQuestion, column, question, data);
    }
  },
  text: {},
  comment: {},
  boolean: {
    onCellQuestionUpdate: (cellQuestion: any, column: any, question: any, data: any) => {
      cellQuestion.renderAs = column.renderAs;
    },
  },
  expression: {},
  rating: {},
  slider: {}
};

/**
 * An auxiliary class that describes a column in a [Multi-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list) or [Dynamic Matrix](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model).
 *
 * You can get an object of this class from the [`columns`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#columns) array or by calling the [`getColumnByName()`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#getColumnByName) method on a matrix instance.
 */
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
  private colOwnerValue: IMatrixColumnOwner;
  private indexValue = -1;
  private _hasVisibleCell = true;
  private _visiblechoices: Array<any>;

  constructor(name: string, title?: string, colOwner?: IMatrixColumnOwner) {
    super();
    this.colOwnerValue = colOwner;
    this.updateTemplateQuestion(undefined, name, title);
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "showInMultipleColumns") {
      this.doShowInMultipleColumnsChanged();
    }
    if (name === "visible") {
      this.doColumnVisibilityChanged();
    }
    if (name === "isRequired") {
      this.updateIsRenderedRequired(newValue);
    }
    if (!this.colOwner || this.isLoadingFromJson) return;
    if (this.isShowInMultipleColumns) {
      if (name === "choicesOrder") return;
      if (["visibleChoices", "choices"].indexOf(name) > -1) {
        this.colOwner.onShowInMultipleColumnsChanged(this);
      }
    }
    if (!Serializer.hasOriginalProperty(this, name)) return;
    this.colOwner.onColumnPropertyChanged(this, name, newValue);
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
    this.templateQuestion.autoOtherMode = this.isShowInMultipleColumns;
    this.templateQuestion.endLoadingFromJson();
    this.templateQuestion.onGetSurvey = () => {
      return this.getSurvey();
    };
  }
  getDynamicPropertyName(): string {
    return "cellType";
  }
  getDynamicType(): string {
    if (this.cellType === "default") return "question";
    return this.calcCellQuestionType(null);
  }
  public get colOwner(): IMatrixColumnOwner {
    return this.colOwnerValue;
  }
  public set colOwner(value: IMatrixColumnOwner) {
    this.colOwnerValue = value;
    if (!!value) {
      this.updateTemplateQuestion();
      this.setParentQuestionToTemplate(this.templateQuestion);
    }
  }
  public getValueGetterContext(): IValueGetterContext {
    return new MatrixColumnGetterContext(this);
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
  /**
   * Specifies the type of column cells.
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
   * - `"default"` (default) - Inherits the input type from the [`cellType`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#cellType) property specified for the parent matrix.
   *
   * The input types are based upon standalone question types. Depending on the selected input type, the matrix column can have additional configuration properties inherited from the corresponding question type. For instance, Dropdown, Checkboxes, Radio Button Group, and Tag Box columns can specify the [`choices`](https://surveyjs.io/form-library/documentation/api-reference/radio-button-question-model#choices) array, similar to the question types upon which they are based. Refer to the API Reference of these question types for a full list of available properties.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/aggregate-data-within-form/ (linkStyle))
   */
  public get cellType(): string {
    return this.getPropertyValue("cellType");
  }
  public set cellType(val: string) {
    val = val.toLocaleLowerCase();
    this.updateTemplateQuestion(val);
    this.setPropertyValue("cellType", val);
    if (!!this.colOwner) {
      this.colOwner.onColumnCellTypeChanged(this);
    }
  }
  public get templateQuestion(): Question {
    return this.templateQuestionValue;
  }
  public get value() {
    return this.templateQuestion.name;
  }
  //For filtering columns
  public get isVisible(): boolean {
    return true;
  }
  public get isColumnVisible(): boolean {
    if (this.areInvisibleElementsShowing) return true;
    return this.visible && this.hasVisibleCell;
  }
  private get areInvisibleElementsShowing(): boolean {
    return this.getSurvey()?.areInvisibleElementsShowing;
  }
  /**
   * Gets or sets column visibility.
   *
   * If you want to display or hide a column based on a condition, specify the [`visibleIf`](#visibleIf) property.
   * @see isRequired
   * @see readOnly
   */
  public get visible(): boolean { return this.templateQuestion.visible; }
  public set visible(val: boolean) {
    this.templateQuestion.visible = val;
  }
  public get hasVisibleCell(): boolean {
    return this._hasVisibleCell;
  }
  public set hasVisibleCell(newVal: boolean) {
    this._hasVisibleCell = newVal;
  }
  public isColumnsVisibleIf: boolean = true;
  public getVisibleMultipleChoices(): Array<ItemValue> {
    const choices = this.templateQuestion.visibleChoices;
    if (!Array.isArray(choices)) return [];
    if (!Array.isArray(this._visiblechoices)) return choices;
    const res = new Array<ItemValue>();
    for (let i = 0; i < choices.length; i++) {
      const item = choices[i];
      if (this._visiblechoices.indexOf(item.value) > -1) res.push(item);
    }
    return res;
  }
  public get getVisibleChoicesInCell(): Array<any> {
    if (Array.isArray(this._visiblechoices)) return this._visiblechoices;
    const res = this.templateQuestion.visibleChoices;
    return Array.isArray(res) ? res : [];
  }
  public setVisibleChoicesInCell(val: Array<any>): void {
    this._visiblechoices = val;
  }
  public get isFilteredMultipleColumns(): boolean {
    if (!this.showInMultipleColumns) return false;
    const choices = this.templateQuestion.choices;
    if (!Array.isArray(choices)) return false;
    for (let i = 0; i < choices.length; i++) {
      if (choices[i].visibleIf) return true;
    }
    return false;
  }
  /**
   * A column ID that is not visible to respondents.
   *
   * > Column IDs must be unique.
   * @see title
   */
  public get name(): string {
    return this.templateQuestion.name;
  }
  public set name(val: string) {
    this.templateQuestion.name = val;
  }
  /**
   * A user-friendly column caption to display. If `title` is undefined, [`name`](#name) is displayed instead.
   */
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
  /**
   * A value to show in HTML questions and in the dynamic titles and descriptions of survey elements when the cell value is empty.
   *
   * Default value: `""`
   *
   * [Dynamic Texts](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#dynamic-texts (linkStyle))
   */
  public get defaultDisplayValue(): string {
    return this.templateQuestion.defaultDisplayValue;
  }
  public set defaultDisplayValue(val: string) {
    this.templateQuestion.defaultDisplayValue = val;
  }
  public get locDefaultDisplayValue(): LocalizableString {
    return this.templateQuestion.locDefaultDisplayValue;
  }
  /**
   * Marks the column as required. If a respondent skips any cell in a required column, the matrix displays a [validation error](#requiredErrorText).
   *
   * If you want to mark the column as required based on a condition, specify the [`requiredIf`](#requiredIf) property.
   * @see visible
   * @see readOnly
   */
  public get isRequired(): boolean {
    return this.getPropertyValue("isRequired");
  }
  public set isRequired(val: boolean) {
    this.setPropertyValue("isRequired", val);
    this.templateQuestion.isRequired = val;
  }
  public get isRenderedRequired(): boolean {
    return this.getPropertyValue("isRenderedRequired", this.isRequired);
  }
  public set isRenderedRequired(val: boolean) {
    this.setPropertyValue("isRenderedRequired", val);
  }
  public updateIsRenderedRequired(val: boolean): void {
    this.isRenderedRequired = val || this.isRequired;
  }
  public get requiredMark(): string {
    return this.isRenderedRequired && this.getSurvey() ? this.getSurvey().requiredMark : this.templateQuestion.requiredMark;
  }
  /**
   * Specifies a custom error message for a required column.
   * @see isRequired
   */
  public get requiredErrorText(): string {
    return this.templateQuestion.requiredErrorText;
  }
  public set requiredErrorText(val: string) {
    this.templateQuestion.requiredErrorText = val;
  }
  get locRequiredErrorText(): LocalizableString {
    return this.templateQuestion.locRequiredErrorText;
  }
  /**
   * Makes the column read-only.
   *
   * If you want to switch the column to the read-only state based on a condition, specify the [`enableIf`](#enableIf) property.
   * @see visible
   * @see isRequired
   */
  public get readOnly(): boolean {
    return this.templateQuestion.readOnly;
  }
  public set readOnly(val: boolean) {
    this.templateQuestion.readOnly = val;
  }
  public get hasOther(): boolean {
    return this.showOtherItem;
  }
  public set hasOther(val: boolean) {
    this.showOtherItem = val;
  }
  public get showOtherItem(): boolean {
    return this.templateQuestion.showOtherItem;
  }
  public set showOtherItem(val: boolean) {
    this.templateQuestion.showOtherItem = val;
  }
  /**
   * A Boolean expression. If it evaluates to `false`, this column becomes hidden.
   *
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   * @see visible
   */
  public get visibleIf(): string {
    return this.templateQuestion.visibleIf;
  }
  public set visibleIf(val: string) {
    this.templateQuestion.visibleIf = val;
  }
  /**
   * A Boolean expression. If it evaluates to `false`, this column becomes read-only.
   *
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   *
   * [View Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))
   * @see readOnly
   */
  public get enableIf(): string {
    return this.templateQuestion.enableIf;
  }
  public set enableIf(val: string) {
    this.templateQuestion.enableIf = val;
  }
  /**
   * A Boolean expression. If it evaluates to `true`, this column becomes required.
   *
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   * @see isRequired
   */
  public get requiredIf(): string {
    return this.templateQuestion.requiredIf;
  }
  public set requiredIf(val: string) {
    this.templateQuestion.requiredIf = val;
  }
  /**
   * A Boolean expression. If it evaluates to `true`, all cells in this column are set to a value calculated using the [`defaultValueExpression`](#defaultValueExpression).
   *
   * [Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))
   * @see setValueIf
   */
  public get resetValueIf(): string {
    return this.templateQuestion.resetValueIf;
  }
  public set resetValueIf(val: string) {
    this.templateQuestion.resetValueIf = val;
  }
  /**
   * An expression used to calculate the column's default value. This expression applies to all cells of this column until the cell value is specified by an end user or programmatically.
   *
   * [Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))
   * @see setValueExpression
   */
  public get defaultValueExpression(): string {
    return this.templateQuestion.defaultValueExpression;
  }
  public set defaultValueExpression(val: string) {
    this.templateQuestion.defaultValueExpression = val;
  }
  /**
   * A Boolean expression. If it evaluates to `true`, all cells in this column are set to a value calculated using the [`setValueExpression`](#setValueExpression).
   *
   * [Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))
   * @see resetValueIf
   */
  public get setValueIf(): string {
    return this.templateQuestion.setValueIf;
  }
  public set setValueIf(val: string) {
    this.templateQuestion.setValueIf = val;
  }
  /**
   * An expression that calculates a value for all cells in this column.
   *
   * The `setValueExpression` is re-evaluated whenever a referenced question's value changes. If you also specify the [`setValueIf`](#setValueIf) expression, re-evaluation occurs only when it returns `true`.
   *
   * [Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))
   * @see defaultValueExpression
   * @see resetValueIf
   */
  public get setValueExpression(): string {
    return this.templateQuestion.setValueExpression;
  }
  public set setValueExpression(val: string) {
    this.templateQuestion.setValueExpression = val;
  }
  /**
   * Specifies whether a respondent is required to provide a unique response for each question within this column.
   *
   * Default value: `false`
   */
  public get isUnique(): boolean {
    return this.getPropertyValue("isUnique");
  }
  public set isUnique(val: boolean) {
    this.setPropertyValue("isUnique", val);
  }
  /**
   * Specifies whether to create an individual column for each choice option. Applies only to columns of `"checkbox"` or `"radiogroup"` [`cellType`](#cellType).
   *
   * [View Demo](https://surveyjs.io/form-library/examples/columnize-choice-options-of-matrix-cell/ (linkStyle))
   */
  public get showInMultipleColumns(): boolean {
    return this.getPropertyValue("showInMultipleColumns");
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
  /**
   * Column validators.
   *
   * [Data Validation](https://surveyjs.io/form-library/documentation/data-validation (linkStyle))
   * @see isRequired
   */
  public get validators(): Array<SurveyValidator> {
    return this.templateQuestion.validators;
  }
  public set validators(val: Array<SurveyValidator>) {
    this.templateQuestion.validators = val;
  }
  /**
   * An aggregation method used to calculate the column total.
   *
   * Possible values:
   *
   * - `"none"` (default) - Disables total calculations.
   * - `"sum"`
   * - `"count"`
   * - `"min"`
   * - `"max"`
   * - `"avg"`
   *
   * [View Demo](https://surveyjs.io/form-library/examples/aggregate-data-within-form/ (linkStyle))
   * @see totalFormat
   * @see totalDisplayStyle
   */
  public get totalType(): string {
    return this.getPropertyValue("totalType");
  }
  public set totalType(val: string) {
    this.setPropertyValue("totalType", val);
  }
  /**
   * An expression used to calculate total values. Overrides the [`totalType`](#totalType) property.
   *
   * [Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))
   */
  public get totalExpression(): string {
    return this.getPropertyValue("totalExpression");
  }
  public set totalExpression(val: string) {
    this.setPropertyValue("totalExpression", val);
  }
  public get hasTotal(): boolean {
    return this.totalType != "none" || !!this.totalExpression;
  }
  /**
   * A string pattern used to display column totals. To reference a total value within this pattern, use the `{0}` placeholder.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/aggregate-data-within-form/ (linkStyle))
   * @see totalType
   * @see totalDisplayStyle
   */
  public get totalFormat(): string {
    return this.getLocStringText(this.locTotalFormat) || "";
  }
  public set totalFormat(val: string) {
    this.setLocStringText(this.locTotalFormat, val);
  }
  get locTotalFormat(): LocalizableString {
    return this.getOrCreateLocStr("totalFormat");
  }
  public get cellHint(): string {
    return this.getLocStringText(this.locCellHint) || "";
  }
  public set cellHint(val: string) {
    this.setLocStringText(this.locCellHint, val);
  }
  get locCellHint(): LocalizableString {
    return this.getOrCreateLocStr("cellHint");
  }
  public get renderAs(): string {
    return this.getPropertyValue("renderAs");
  }
  public set renderAs(val: string) {
    this.setPropertyValue("renderAs", val);
    if (!!this.templateQuestion) {
      this.templateQuestion.renderAs = val;
    }
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
  /**
   * A format for calculated total values.
   *
   * Possible values:
   *
   * - `"none"` (default)
   * - `"decimal"`
   * - `"currency"`
   * - `"percent"`
   *
   * [View Demo](https://surveyjs.io/form-library/examples/aggregate-data-within-form/ (linkStyle))
   * @see totalType
   * @see totalFormat
   * @see totalCurrency
   */
  public get totalDisplayStyle(): string {
    return this.getPropertyValue("totalDisplayStyle");
  }
  public set totalDisplayStyle(val: string) {
    this.setPropertyValue("totalDisplayStyle", val);
  }
  /**
   * An alignment for calculated total values.
   *
   * Possible values:
   *
   * - `"left"`
   * - `"center"`
   * - `"right"`
   * - `"auto"` (default) - Applies one of the values above based on the column's [cell type](#cellType).
   *
   * [View Demo](https://surveyjs.io/form-library/examples/aggregate-data-within-form/ (linkStyle))
   * @see totalType
   * @see totalFormat
   * @see totalCurrency
   * @see totalDisplayStyle
   */
  public get totalAlignment(): string {
    return this.getPropertyValue("totalAlignment");
  }
  public set totalAlignment(val: string) {
    this.setPropertyValue("totalAlignment", val);
  }
  /**
   * Specifies a currency used to display calculated total values. Applies only if [`totalDisplayStyle`](#totalDisplayStyle) is set to `"currency"`.
   * @see totalType
   */
  public get totalCurrency(): string {
    return this.getPropertyValue("totalCurrency");
  }
  public set totalCurrency(val: string) {
    if (getCurrecyCodes().indexOf(val) < 0) return;
    this.setPropertyValue("totalCurrency", val);
  }
  /**
   * Gets or sets minimum column width in CSS values. By default, the matrix calculates column widths to optimally fit the content of all columns.
   * @see width
   */
  public get minWidth(): string {
    return this.getPropertyValue("minWidth", "");
  }
  public set minWidth(val: string) {
    this.setPropertyValue("minWidth", val);
  }
  /**
   * Gets or sets column width in CSS values. By default, the matrix calculates column widths to optimally fit the content of all columns.
   * @see minWidth
  */
  public get width(): string {
    return this.templateQuestion.width;
  }
  public set width(val: string) {
    this.templateQuestion.width = val;
  }
  /**
   * Gets or sets the number of columns used to arrange choice options. Applies only to columns of `"checkbox"` or `"radiogroup"` [`cellType`](#cellType).
   *
   * Default value: -1 (inherits the actual value from the parent matrix's [`columnColCount`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#columnColCount) property)
   *
   * [View Demo](https://surveyjs.io/form-library/examples/multi-select-matrix-question/ (linkStyle))
   */
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
  public getMarkdownHtml(text: string, name: string, item?: any): string {
    return this.colOwner ? this.colOwner.getMarkdownHtml(text, name, item) : undefined;
  }
  public getRenderer(name: string): string {
    return !!this.colOwner ? this.colOwner.getRenderer(name) : null;
  }
  public getRendererContext(locStr: LocalizableString): any {
    return !!this.colOwner ? this.colOwner.getRendererContext(locStr) : locStr;
  }
  public getProcessedText(text: string): string {
    return this.colOwner ? this.colOwner.getProcessedText(text, this) : text;
  }
  public createCellQuestion(row: MatrixDropdownRowModelBase): Question {
    var qType = this.calcCellQuestionType(row);
    var cellQuestion = <Question>this.createNewQuestion(qType);
    this.callOnCellQuestionUpdate(cellQuestion, row);
    return cellQuestion;
  }
  startLoadingFromJson(json?: any): void {
    super.startLoadingFromJson(json);
    if (!!json && !json.cellType && !!json.choices) {
      json.cellType = this.colOwner.getCellType();
    }
  }
  public updateCellQuestion(
    cellQuestion: Question,
    data: any,
    onUpdateJson: (json: any) => any = null
  ) {
    this.setQuestionProperties(cellQuestion, onUpdateJson);
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
  defaultCellTypeChanged(): void {
    this.updateTemplateQuestion();
  }
  protected calcCellQuestionType(row: MatrixDropdownRowModelBase): string {
    let cellType = this.getDefaultCellQuestionType();
    if (!!row && !!this.colOwner) {
      cellType = this.colOwner.getCustomCellType(this, row, cellType);
    }
    return cellType;
  }
  private getDefaultCellQuestionType(cellType?: string): string {
    if (!cellType) cellType = this.cellType;
    if (cellType !== "default") return cellType;
    if (this.colOwner) return this.colOwner.getCellType();
    return settings.matrix.defaultCellType;
  }
  protected updateTemplateQuestion(newCellType?: string, name?: string, title?: string): void {
    const curCellType = this.getDefaultCellQuestionType(newCellType);
    const prevCellType = this.templateQuestion
      ? this.templateQuestion.getType()
      : "";
    if (curCellType === prevCellType) return;
    if (this.templateQuestion) {
      this.removeProperties(prevCellType);
    }
    this.templateQuestionValue = this.createNewQuestion(curCellType);
    this.templateQuestion.locOwner = this;
    this.addProperties(curCellType);
    if (!!name) {
      this.name = name;
    }
    if (!!title) {
      this.title = title;
    } else {
      this.templateQuestion.locTitle.strChanged();
    }
    if (settings.serialization.matrixDropdownColumnSerializeTitle) {
      this.templateQuestion.locTitle.serializeCallBackText = true;
    }
    this.templateQuestion.onPropertyChanged.add((sender, options) => {
      this.propertyValueChanged(
        options.name,
        options.oldValue,
        options.newValue,
        options.arrayChanges,
        options.target
      );
    });
    this.templateQuestion.onNestedPropertyChanged.add((sender, options) => {
      if (this.colOwner && !this.isLoadingFromJson) {
        this.colOwner.onColumnNestedPropertyChanged(this, options.name, options.nestedName, options.newValue);
      }
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
    question.autoOtherMode = this.isShowInMultipleColumns;
    this.setQuestionProperties(question);
    this.setParentQuestionToTemplate(question);
    return question;
  }
  private setParentQuestionToTemplate(question: Question): void {
    if (!!this.colOwner && (<any>this.colOwner).isQuestion) {
      question.setParentQuestion(<any>this.colOwner);
    }
  }
  private previousChoicesId: string = undefined;
  protected setQuestionProperties(
    question: Question,
    onUpdateJson: (json: any) => any = null
  ): void {
    if (this.templateQuestion) {
      var json = new JsonObject().toJsonObject(this.templateQuestion, true);
      if (onUpdateJson) {
        onUpdateJson(json);
      }
      json.type = question.getType();
      if (this.cellType === "default" && !!this.colOwner && this.colOwner.hasChoices()) {
        delete json["choices"];
      }
      delete json["itemComponent"];

      if (this.jsonObj && json.type === "rating" && this.isLoadingFromJson) {
        Object.keys(this.jsonObj).forEach((prop) => {
          json[prop] = this.jsonObj[prop];
        });
      }
      if (json["choicesOrder"] === "random") {
        json["choicesOrder"] = "none";
        const visChoices = this.templateQuestion["visibleChoices"];
        if (Array.isArray(visChoices)) {
          json["choices"] = visChoices;
        }
      }

      new JsonObject().toObject(json, question);
      question.isContentElement = this.templateQuestion.isContentElement;
      this.previousChoicesId = undefined;
      question.loadedChoicesFromServerCallback = () => {
        if (!this.isShowInMultipleColumns) return;
        if (!!this.previousChoicesId && this.previousChoicesId !== question.id) return;
        this.previousChoicesId = question.id;
        const choices = question.visibleChoices;
        this.templateQuestion.choices = choices;
        this.propertyValueChanged("choices", choices, choices);
      };
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

  private doShowInMultipleColumnsChanged(): void {
    if (this.colOwner != null) {
      this.colOwner.onShowInMultipleColumnsChanged(this);
    }
    if (this.templateQuestion) {
      this.templateQuestion.autoOtherMode = this.isShowInMultipleColumns;
    }
  }
  private doColumnVisibilityChanged(): void {
    if (this.colOwner != null && !this.isDesignMode) {
      this.colOwner.onColumnVisibilityChanged(this);
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
    const props = this.getProperties(curCellType);
    Serializer.addDynamicPropertiesIntoObj(this, this.templateQuestion, props);
  }
}

Serializer.addClass(
  "matrixdropdowncolumn",
  [
    { name: "!name", isUnique: true },
    {
      name: "title", serializationProperty: "locTitle", dependsOn: "name",
      onPropertyEditorUpdate: function (obj: any, editor: any) {
        if (!!obj && !!editor) {
          editor.placeholder = obj.locTitle.getPlaceholder();
        }
      }
    },
    { name: "cellHint", serializationProperty: "locCellHint", visible: false },
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
    { name: "isRequired:boolean", defaultFunc: (obj: Base) => {
      const q = (<any>obj)?.templateQuestion;
      if (!!q) {
        return Serializer.findProperty(q.getType(), "isRequired").getDefaultValue(q) || false;
      }
      return false;
    } },
    "isUnique:boolean",
    {
      name: "requiredErrorText:text",
      serializationProperty: "locRequiredErrorText",
    },
    "readOnly:boolean",
    {
      name: "minWidth",
      onPropertyEditorUpdate: function (obj: any, editor: any) {
        if (!!obj && !!editor) {
          editor.value = obj.minWidth;
        }
      }
    },
    "width",
    { name: "visible:switch", default: true, overridingProperty: "visibleIf" },
    "visibleIf:condition",
    "enableIf:condition",
    "requiredIf:condition",
    "resetValueIf:condition",
    "setValueIf:condition",
    "setValueExpression:expression",
    {
      name: "showInMultipleColumns:boolean",
      dependsOn: "cellType",
      visibleIf: (obj: any): boolean => {
        return obj.isSupportMultipleColumns;
      },
    },
    {
      name: "validators:validators",
      baseClassName: "surveyvalidator",
      classNamePart: "validator",
    },
    {
      name: "totalType", visibleIf: (obj: any): boolean => !obj.isShowInMultipleColumns,
      default: "none",
      choices: ["none", "sum", "count", "min", "max", "avg"],
    },
    { name: "totalExpression:expression", visibleIf: (obj: any): boolean => !obj.isShowInMultipleColumns },
    { name: "totalFormat", serializationProperty: "locTotalFormat", visibleIf: (obj: any): boolean => obj.hasTotal },
    {
      name: "totalDisplayStyle", visibleIf: (obj: any): boolean => obj.hasTotal,
      default: "none",
      choices: ["none", "decimal", "currency", "percent"],
    },
    {
      name: "totalAlignment", visibleIf: (obj: any): boolean => obj.hasTotal,
      default: "auto",
      choices: ["auto", "left", "center", "right"],
    },
    {
      name: "totalCurrency", visibleIf: (obj: any): boolean => obj.hasTotal,
      choices: () => {
        return getCurrecyCodes();
      },
      default: "USD",
    },
    { name: "totalMaximumFractionDigits:number", default: -1, visibleIf: (obj: any): boolean => obj.hasTotal },
    { name: "totalMinimumFractionDigits:number", default: -1, visibleIf: (obj: any): boolean => obj.hasTotal },
    { name: "renderAs", default: "default", visible: false },
    { name: "defaultDisplayValue", serializationProperty: "locDefaultDisplayValue" },
  ],
  function () {
    return new MatrixDropdownColumn("");
  }
);
