import { Base } from "./base";
import {
  ISurveyData,
  ISurveyImpl,
  ISurvey,
  IPanel,
  IElement,
  IQuestion,
  ITextProcessor,
  IProgressInfo
} from "./base-interfaces";
import { SurveyElement } from "./survey-element";
import { SurveyValidator, IValidatorOwner } from "./validator";
import { Question, IConditionObject } from "./question";
import { QuestionTextModel, isMinMaxType } from "./question_text";
import { JsonObject, Serializer, property, propertyArray } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { SurveyError } from "./survey-error";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { HashTable, Helpers } from "./helpers";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { settings } from "./settings";

export interface IMultipleTextData extends ILocalizableOwner, IPanel {
  getSurvey(): ISurvey;
  getTextProcessor(): ITextProcessor;
  getAllValues(): any;
  getMultipleTextValue(name: string): any;
  setMultipleTextValue(name: string, value: any): any;
  getItemDefaultValue(name: string): any;
  getIsRequiredText(): string;
}

export class MultipleTextEditorModel extends QuestionTextModel {
  public get a11y_input_ariaLabel(): string {
    return this.locTitle.renderedHtml;
  }
  public get a11y_input_ariaLabelledBy(): string {
    return null;
  }
}

/**
 * A class that describes an item in a [Multiple Textboxes](https://surveyjs.io/form-library/documentation/api-reference/multiple-text-entry-question-model) question.
 *
 * [View Demo](/form-library/examples/multiple-text-box-question/)
 */
export class MultipleTextItemModel extends Base
  implements IValidatorOwner, ISurveyData, ISurveyImpl {
  private editorValue: MultipleTextEditorModel;
  private data: IMultipleTextData;

  valueChangedCallback: (newValue: any) => void;

  constructor(name: any = null, title: string = null) {
    super();
    this.editorValue = this.createEditor(name);
    this.editor.questionTitleTemplateCallback = function () {
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
  public get editor(): MultipleTextEditorModel {
    return this.editorValue;
  }
  protected createEditor(name: string): MultipleTextEditorModel {
    return new MultipleTextEditorModel(name);
  }
  public addUsedLocales(locales: Array<string>) {
    super.addUsedLocales(locales);
    this.editor.addUsedLocales(locales);
  }
  public localeChanged(): void {
    super.localeChanged();
    this.editor.localeChanged();
  }
  public locStrsChanged(): void {
    super.locStrsChanged();
    this.editor.locStrsChanged();
  }
  setData(data: IMultipleTextData) {
    this.data = data;
    if (!!data) {
      this.editor.defaultValue = data.getItemDefaultValue(this.name);
      this.editor.setSurveyImpl(this);
      this.editor.parent = data;
      this.editor.setParentQuestion(<any>data);
    }
  }
  public focusIn = (): void => {
    this.editor.focusIn();
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
  public get placeholder(): string {
    return this.editor.placeholder;
  }
  public set placeholder(val: string) {
    this.editor.placeholder = val;
  }
  get locPlaceholder(): LocalizableString {
    return this.editor.locPlaceholder;
  }
  public get placeHolder(): string {
    return this.placeholder;
  }
  public set placeHolder(val: string) {
    this.placeholder = val;
  }
  get locPlaceHolder(): LocalizableString {
    return this.locPlaceholder;
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
   * An expression used to calculate the [defaultValue](https://surveyjs.io/form-library/documentation/question#defaultValue).
   */
  public get defaultValueExpression(): string {
    return this.editor.defaultValueExpression;
  }
  public set defaultValueExpression(val: string) {
    this.editor.defaultValueExpression = val;
  }
  /**
   * The minimum value specified as an expression. For example, `"minValueExpression": "today(-1)"` sets the minimum value to yesterday.
   */
  public get minValueExpression(): string {
    return this.editor.minValueExpression;
  }
  public set minValueExpression(val: string) {
    this.editor.minValueExpression = val;
  }
  /**
   * The maximum value specified as an expression. For example, `"maxValueExpression": "today(1)"` sets the maximum value to tomorrow.
   */
  public get maxValueExpression(): string {
    return this.editor.maxValueExpression;
  }
  public set maxValueExpression(val: string) {
    this.editor.maxValueExpression = val;
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
  setVariable(name: string, newValue: any) { }
  getComment(name: string): string {
    return null;
  }
  setComment(name: string, newValue: string) { }
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
  findQuestionByName(name: string): IQuestion {
    const survey = this.getSurvey();
    return !!survey ? survey.getQuestionByName(name) : null;
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
 * A class that describes the Multiple Text question type.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-multipletext/ (linkStyle))
 */
export class QuestionMultipleTextModel extends Question
  implements IMultipleTextData, IPanel {
  public static addDefaultItems(question: QuestionMultipleTextModel) {
    var names = QuestionFactory.DefaultMutlipleTextItems;
    for (var i = 0; i < names.length; i++) question.addItem(names[i]);
  }

  constructor(name: string) {
    super(name);
    this.createNewArray("items", (item: any) => {
      item.setData(this);
      if (this.survey) {
        this.survey.multipleTextItemAdded(this, item);
      }
    });
    this.registerPropertyChangedHandlers(["items", "colCount", "itemErrorLocation"], () => {
      this.calcVisibleRows();
    });
    this.registerPropertyChangedHandlers(["itemSize"], () => { this.updateItemsSize(); });
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
  public get hasSingleInput(): boolean { return false; }
  public get isContainer(): boolean { return true; }
  public get id() {
    return this.getPropertyValue("id");
  }
  public set id(val: string) {
    this.items?.map((item, index) => item.editor.id = val + "_" + index);
    this.setPropertyValue("id", val);
  }
  onSurveyLoad() {
    this.editorsOnSurveyLoad();
    super.onSurveyLoad();
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
   * Gets or sets an array of `MultipleTextItemModel` objects that represent input items.
   *
   * This property accepts an array of objects with the following structure:
   *
   * ```js
   * {
   *   "name": any, // A unique value used to identify an input item and save an item value to survey results.
   *   "title": String // An item caption. When `title` is undefined, `name` is used. This property supports Markdown.
   * }
   * ```
   *
   * To enable Markdown support for the `title` property, implement Markdown-to-HTML conversion in the [onTextMarkdown](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onTextMarkdown) event handler. For an example, refer to the following demo: [Convert Markdown to HTML with Showdown](https://surveyjs.io/form-library/examples/edit-survey-questions-markdown/).
   * @see addItem
   */
  public get items(): Array<MultipleTextItemModel> {
    return this.getPropertyValue("items");
  }
  public set items(val: Array<MultipleTextItemModel>) {
    this.setPropertyValue("items", val);
  }
  /**
   * Adds a new input item.
   * @param name An item name
   * @param title (Optional) An item title
   * @see items
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
  public addConditionObjectsByContext(objects: Array<IConditionObject>, context: any): void {
    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      objects.push({
        name: this.getValueName() + "." + item.name,
        text: this.processedTitle + "." + item.fullTitle,
        question: this,
      });
    }
  }
  protected collectNestedQuestionsCore(questions: Question[], visibleOnly: boolean): void {
    this.items.forEach(item => item.editor.collectNestedQuestions(questions, visibleOnly));
  }
  public getConditionJson(operator: string = null, path: string = null): any {
    if (!path) return super.getConditionJson();
    var item = this.getItemByName(path);
    if (!item) return null;
    var json = new JsonObject().toJsonObject(item);
    json["type"] = "text";
    return json;
  }
  public locStrsChanged(): void {
    super.locStrsChanged();
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].locStrsChanged();
    }
  }
  public localeChanged(): void {
    super.localeChanged();
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].localeChanged();
    }
  }
  /**
   * Specifies the error message position relative to individual input fields.
   *
   * Possible values:
   *
   * - `"default"` (default) - Inherits the setting from the [`errorLocation`](#errorLocation) property.
   * - `"top"` - Displays error messages above input fields.
   * - `"bottom"` - Displays error messages below input fields.
   */
  public get itemErrorLocation(): string {
    return this.getPropertyValue("itemErrorLocation");
  }
  public set itemErrorLocation(val: string) {
    this.setPropertyValue("itemErrorLocation", val);
  }
  public getQuestionErrorLocation(): string {
    if(this.itemErrorLocation !== "default") return this.itemErrorLocation;
    return this.getErrorLocation();
  }
  public get showItemErrorOnTop(): boolean {
    return this.getQuestionErrorLocation() == "top";
  }
  public get showItemErrorOnBottom(): boolean {
    return this.getQuestionErrorLocation() == "bottom";
  }
  public getChildErrorLocation(child: Question): string {
    return this.getQuestionErrorLocation();
  }
  protected isNewValueCorrect(val: any): boolean {
    return Helpers.isValueObject(val, true);
  }
  supportGoNextPageAutomatic(): boolean {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].isEmpty()) return false;
    }
    return true;
  }
  /**
   * The number of columns used to arrange input items. Accepts the following values: 1, 2, 3, 4, 5.
   *
   * Default value: 1
   */
  public get colCount(): number {
    return this.getPropertyValue("colCount");
  }
  public set colCount(val: number) {
    if (val < 1 || val > 5) return;
    this.setPropertyValue("colCount", val);
  }
  /**
   * A value passed on to the [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/size) attribute of the underlying `<input>` elements.
   */
  public get itemSize(): number {
    return this.getPropertyValue("itemSize");
  }
  public set itemSize(val: number) {
    this.setPropertyValue("itemSize", val);
  }
  @propertyArray() rows: Array<MutlipleTextRow>;

  protected onRowCreated(row: MutlipleTextRow) {
    return row;
  }

  private calcVisibleRows() {
    const colCount = this.colCount;
    const items = this.items;
    let index = 0;
    let row: MutlipleTextRow;
    let errorRow: MutlipleTextErrorRow;
    let rows: Array<MutlipleTextRow> = [];
    for (var i = 0; i < items.length; i++) {
      if(index == 0) {
        row = this.onRowCreated(new MutlipleTextRow());
        errorRow = <MutlipleTextErrorRow>this.onRowCreated(new MutlipleTextErrorRow());
        if(this.showItemErrorOnTop) {
          rows.push(errorRow);
          rows.push(row);
        }
        else {
          rows.push(row);
          rows.push(errorRow);
        }
      }
      row.cells.push(new MultipleTextCell(items[i], this));
      errorRow.cells.push(new MultipleTextErrorCell(items[i], this));
      index++;
      if (index >= colCount || i == items.length - 1) {
        index = 0;
        errorRow.onAfterCreated();
      }
    }
    this.rows = rows;
  }

  public getRows(): Array<any> {
    if(Helpers.isValueEmpty(this.rows)) {
      this.calcVisibleRows();
    }
    return this.rows;
  }
  private isMultipleItemValueChanging = false;
  protected onValueChanged(): void {
    super.onValueChanged();
    this.onItemValueChanged();
  }
  protected createTextItem(name: string, title: string): MultipleTextItemModel {
    return new MultipleTextItemModel(name, title);
  }
  protected onItemValueChanged(): void {
    if (this.isMultipleItemValueChanging) return;
    for (var i = 0; i < this.items.length; i++) {
      var itemValue = null;
      if (this.value && this.items[i].name in this.value) {
        itemValue = this.value[this.items[i].name];
      }
      this.items[i].onValueChanged(itemValue);
    }
  }
  public runCondition(values: HashTable<any>, properties: HashTable<any>): void {
    super.runCondition(values, properties);
    this.items.forEach(item => item.editor.runCondition(values, properties));
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
  protected allowMobileInDesignMode(): boolean {
    return true;
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
  addElement(element: IElement, index: number) { }
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
  elementWidthChanged(el: IElement) { }
  get elements(): Array<IElement> {
    return [];
  }
  indexOf(el: IElement): number {
    return -1;
  }
  ensureRowsVisibility(): void {
    // do nothing
  }
  validateContainerOnly(): void {
    // do nothing
  }
  public getItemLabelCss(item: MultipleTextItemModel): string {
    return new CssClassBuilder()
      .append(this.cssClasses.itemLabel)
      .append(this.cssClasses.itemLabelAnswered, item.editor.isAnswered)
      .append(this.cssClasses.itemLabelAllowFocus, !this.isDesignMode)
      .append(this.cssClasses.itemLabelOnError, item.editor.errors.length > 0)
      .append(this.cssClasses.itemWithCharacterCounter, !!item.getMaxLength())
      .toString();
  }
  public getItemCss(): string {
    return new CssClassBuilder().append(this.cssClasses.item).toString();
  }
  public getItemTitleCss(): string {
    return new CssClassBuilder().append(this.cssClasses.itemTitle).toString();
  }
}

export class MutlipleTextRow extends Base {
  @property() public isVisible: boolean = true;
  @propertyArray() public cells: Array<MultipleTextCell> = []
}
export class MutlipleTextErrorRow extends MutlipleTextRow {
  public onAfterCreated(): void {
    const callback = () => {
      this.isVisible = this.cells.some((cell) => cell.item?.editor && cell.item?.editor.hasVisibleErrors);
    };
    this.cells.forEach((cell) => {
      if(cell.item?.editor) {
        cell.item?.editor.registerFunctionOnPropertyValueChanged("hasVisibleErrors", callback);
      }
    });
    callback();
  }
}
export class MultipleTextCell {
  constructor(public item: MultipleTextItemModel, protected question: QuestionMultipleTextModel) {}
  public isErrorsCell: boolean = false;
  protected getClassName(): string {
    return new CssClassBuilder().append(this.question.cssClasses.cell).toString();
  }
  public get className(): string {
    return this.getClassName();
  }
}

export class MultipleTextErrorCell extends MultipleTextCell {
  public isErrorsCell: boolean = true;
  protected getClassName(): string {
    return new CssClassBuilder()
      .append(super.getClassName())
      .append(this.question.cssClasses.cellError)
      .append(this.question.cssClasses.cellErrorTop, this.question.showItemErrorOnTop)
      .append(this.question.cssClasses.cellErrorBottom, this.question.showItemErrorOnBottom)
      .toString();
  }
}

Serializer.addClass(
  "multipletextitem",
  [
    { name: "!name", isUnique: true },
    "isRequired:boolean",
    { name: "placeholder", alternativeName: "placeHolder", serializationProperty: "locPlaceholder" },
    {
      name: "inputType",
      default: "text",
      choices: settings.questions.inputTypes,
    },
    { name: "title", serializationProperty: "locTitle" },
    { name: "maxLength:number", default: -1 },
    { name: "size:number", minValue: 0 },
    {
      name: "requiredErrorText:text",
      serializationProperty: "locRequiredErrorText",
    },
    { name: "defaultValueExpression:expression", visible: false },
    {
      name: "minValueExpression:expression",
      category: "logic",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        return isMinMaxType(obj);
      },
    },
    {
      name: "maxValueExpression:expression",
      category: "logic",
      dependsOn: "inputType",
      visibleIf: function(obj: any) {
        return isMinMaxType(obj);
      },
    },
    {
      name: "validators:validators",
      baseClassName: "surveyvalidator",
      classNamePart: "validator",
    },
  ],
  function () {
    return new MultipleTextItemModel("");
  }
);

Serializer.addClass(
  "multipletext",
  [
    { name: "!items:textitems", className: "multipletextitem" },
    { name: "itemSize:number", minValue: 0 },
    { name: "colCount:number", default: 1, choices: [1, 2, 3, 4, 5] },
    { name: "itemErrorLocation", default: "default", choices: ["default", "top", "bottom"], visible: false }
  ],
  function () {
    return new QuestionMultipleTextModel("");
  },
  "question"
);

QuestionFactory.Instance.registerQuestion("multipletext", (name) => {
  var q = new QuestionMultipleTextModel(name);
  QuestionMultipleTextModel.addDefaultItems(q);
  return q;
});
