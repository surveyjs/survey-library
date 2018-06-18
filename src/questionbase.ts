import { HashTable } from "./helpers";
import {
  Base,
  SurveyElement,
  IElement,
  IQuestion,
  IConditionRunner,
  ISurveyData,
  ISurvey,
  ISurveyImpl,
  Event,
  SurveyError,
  IPanel,
  IPage
} from "./base";
import { QuestionCustomWidget } from "./questionCustomWidgets";
import { JsonObject } from "./jsonobject";
import { ConditionRunner } from "./conditions";
import { ILocalizableOwner } from "./localizablestring";
import { surveyCss } from "./defaultCss/cssstandard";
import { CustomWidgetCollection } from "./questionCustomWidgets";

/**
 * A base class for all questions. QuestionBase doesn't have information about title, values, errors and so on.
 * Those properties are defined in the Question class.
 */
export class QuestionBase extends SurveyElement
  implements IQuestion, IConditionRunner, ILocalizableOwner {
  private static questionCounter = 100;
  private static getQuestionId(): string {
    return "sq_" + QuestionBase.questionCounter++;
  }
  private conditionRunner: ConditionRunner = null;
  private isCustomWidgetRequested: boolean = false;
  private customWidgetValue: QuestionCustomWidget;
  customWidgetData = { isNeedRender: true };
  focusCallback: () => void;
  surveyLoadCallback: () => void;

  constructor(public name: string) {
    super(name);
    this.id = QuestionBase.getQuestionId();
    this.onCreating();
  }
  /**
   * Returns the type of the object as a string as it represents in the json.
   */
  public getType(): string {
    return "questionbase";
  }
  public setSurveyImpl(value: ISurveyImpl) {
    super.setSurveyImpl(value);
    if (this.survey && this.survey.isDesignMode) {
      this.onVisibleChanged();
    }
    if (this.data && !this.isLoadingFromJson) {
      this.runCondition(
        this.getDataFilteredValues(),
        this.getDataFilteredProperties()
      );
      this.locStrsChanged();
    }
  }
  public getDataFilteredValues(): any {
    return !!this.data ? this.data.getFilteredValues() : null;
  }
  public getDataFilteredProperties(): any {
    return !!this.data ? this.data.getFilteredProperties() : null;
  }
  /**
   * A parent element. It can be panel or page.
   */
  public get parent(): IPanel {
    return this.getPropertyValue("parent", null);
  }
  public set parent(val: IPanel) {
    this.setPropertyValue("parent", val);
  }
  public isAnswerCorrect(): boolean {
    return false;
  }
  public getValueName(): string {
    return this.name;
  }
  /**
   * Get/set the page where the question is located.
   */
  public get page(): IPage {
    return this.getPage(this.parent);
  }
  public set page(val: IPage) {
    this.setPage(this.parent, val);
  }
  /**
   * Always returns false.
   */
  public get isPanel(): boolean {
    return false;
  }
  /**
   * Use it to get/set the question visibility.
   * @see visibleIf
   */
  public get visible(): boolean {
    return this.getPropertyValue("visible", true);
  }
  public set visible(val: boolean) {
    if (val == this.visible) return;
    this.setPropertyValue("visible", val);
    this.onVisibleChanged();
    if (this.survey) {
      this.survey.questionVisibilityChanged(<IQuestion>this, this.visible);
    }
  }
  protected onVisibleChanged() {
    this.setPropertyValue("isVisible", this.isVisible);
    if (!this.isVisible && this.errors && this.errors.length > 0) {
      this.errors = [];
      this.fireCallback(this.errorsChangedCallback);
    }
  }
  /**
   * An expression that returns true or false. If it returns true the Question becomes visible and if it returns false the Question becomes invisible. The library runs the expression on survey start and on changing a question value. If the property is empty then visible property is used.
   * @see visible
   */
  public get visibleIf(): string {
    return this.getPropertyValue("visibleIf", "");
  }
  public set visibleIf(val: string) {
    this.setPropertyValue("visibleIf", val);
  }
  /**
   * Returns true if the question is visible or survey is in design mode right now.
   */
  public get isVisible(): boolean {
    return this.visible || this.isDesignMode;
  }
  /**
   * Returns true if there is no input in the question. It always returns true for html question or survey is in 'display' mode.
   * @see QuestionHtmlModel
   * @see SurveyModel.mode
   * @see Question.readOnly
   */
  public get isReadOnly() {
    return true;
  }
  /**
   * Returns the visible index of the question in the survey. It can be from 0 to all visible questions count - 1
   */
  public get visibleIndex(): number {
    return this.getPropertyValue("visibleIndex", -1);
  }
  /**
   * Returns true if there is at least one error on question validation.
   * @param fireCallback set it to true to show error in UI
   */
  public hasErrors(fireCallback: boolean = true): boolean {
    return false;
  }
  /**
   * Returns true if the question value is empty
   */
  public isEmpty(): boolean {
    return true;
  }
  /**
   * Returns the number of erros on validation.
   */
  public get currentErrorCount(): number {
    return 0;
  }
  /**
   * Returns false if the question doesn't have a title property, for example: QuestionHtmlModel
   */
  public get hasTitle(): boolean {
    return false;
  }
  public getTitleLocation(): string {
    return "";
  }
  /**
   * Returns false if the question doesn't have a description property, for example: QuestionHtmlModel, or description property is empty.
   */
  public get hasDescription(): boolean {
    return false;
  }
  /**
   * Returns false if the question doesn't have an input element, for example: QuestionHtmlModel
   */
  public get hasInput(): boolean {
    return false;
  }
  /**
   * Returns true, if you can have a comment for the question.
   */
  public get hasComment(): boolean {
    return false;
  }
  /**
   * The unique identificator. It is generated automatically.
   */
  public get id(): string {
    return this.getPropertyValue("id");
  }
  public set id(val: string) {
    this.setPropertyValue("id", val);
  }
  /**
   * Returns the list of errors that has in the question. For example, isRequired error.
   */
  public getAllErrors(): Array<SurveyError> {
    return [];
  }
  /**
   * The link to the custom widget.
   */
  public get customWidget(): QuestionCustomWidget {
    if (!this.isCustomWidgetRequested && !this.customWidgetValue) {
      this.isCustomWidgetRequested = true;
      this.updateCustomWidget();
    }
    return this.customWidgetValue;
  }
  public updateCustomWidget() {
    this.customWidgetValue = CustomWidgetCollection.Instance.getCustomWidget(
      this
    );
  }
  /**
   * The Question renders on the new line if the property is true. If the property is false, the question tries to render on the same line/row with a previous question/panel.
   */
  public get startWithNewLine(): boolean {
    return this.getPropertyValue("startWithNewLine", true);
  }
  public set startWithNewLine(val: boolean) {
    if (this.startWithNewLine == val) return;
    this.setPropertyValue("startWithNewLine", val);
  }
  /**
   * Returns all css classes that used for rendering the question. You may use survey.updateQuestionCssClasses event to override css classes for a question.
   * @see SurveyModel.updateQuestionCssClasses
   */
  public get cssClasses(): any {
    var surveyCss = this.css;
    var classes = { error: {} };
    this.copyCssClasses(classes, surveyCss.question);
    this.copyCssClasses(classes.error, surveyCss.error);
    this.updateCssClasses(classes, surveyCss);
    if (this.survey) {
      this.survey.updateQuestionCssClasses(this, classes);
    }
    return classes;
  }
  protected getRootCss(classes: any) {
    return classes.question.root;
  }
  protected updateCssClasses(res: any, surveyCss: any) {
    var objCss = surveyCss[this.getType()];
    if (objCss === undefined || objCss === null) return;
    if (typeof objCss === "string" || objCss instanceof String) {
      res.root = objCss;
    } else {
      for (var key in objCss) {
        res[key] = objCss[key];
      }
    }
  }
  private get css(): any {
    return surveyCss.getCss();
  }
  /**
   * Use it to set the specific width to the question.
   */
  public get width(): string {
    return this.getPropertyValue("width", "");
  }
  public set width(val: string) {
    this.setPropertyValue("width", val);
  }
  /**
   * The rendered width of the question.
   */
  public get renderWidth(): string {
    return this.getPropertyValue("renderWidth", "");
  }
  public set renderWidth(val: string) {
    this.setPropertyValue("renderWidth", val);
  }
  /**
   * Set it different from 0 to increase the left padding.
   */
  public get indent(): number {
    return this.getPropertyValue("indent", 0);
  }
  public set indent(val: number) {
    this.setPropertyValue("indent", val);
  }
  /**
   * Set it different from 0 to increase the right padding.
   */
  public get rightIndent(): number {
    return this.getPropertyValue("rightIndent", 0);
  }
  public set rightIndent(val: number) {
    this.setPropertyValue("rightIndent", val);
  }
  /**
   * Focus the question input.
   * @param onError Focus if there is an error.
   */
  public focus(onError: boolean = false) {}
  protected fireCallback(callback: () => void) {
    if (callback) callback();
  }
  public getOthersMaxLength(): any {
    if (!this.survey) return null;
    return this.survey.maxOthersLength > 0 ? this.survey.maxOthersLength : null;
  }
  protected onCreating() {}
  /**
   * Run visibleIf and enableIf expressions. If visibleIf or/and enabledIf are not empty, then the results of performing the expression (true or false) set to the visible/readOnly properties.
   * @param values Typically survey results
   * @see visible
   * @see visibleIf
   * @see readOnly
   * @see enableIf
   */
  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
    if (this.isDesignMode) return;
    if (!this.visibleIf) return;
    if (!this.conditionRunner)
      this.conditionRunner = new ConditionRunner(this.visibleIf);
    this.conditionRunner.expression = this.visibleIf;
    this.visible = this.conditionRunner.run(values, properties);
  }
  //IQuestion
  public onSurveyValueChanged(newValue: any) {}
  public onSurveyLoad() {
    this.fireCallback(this.surveyLoadCallback);
  }
  public setVisibleIndex(val: number): number {
    if (!this.isVisible || !this.hasTitle) {
      val = -1;
    }
    this.setPropertyValue("visibleIndex", val);
    return val < 0 ? 0 : 1;
  }
  public removeElement(element: IElement): boolean {
    return false;
  }
  public supportGoNextPageAutomatic() {
    return false;
  }
  public addConditionNames(names: Array<string>) {}
  public getConditionJson(operator: string = null, path: string = null): any {
    return null;
  }
  /**
   * Call this function to remove values from the current question, that end-user will not be able to enter.
   * For example the value that doesn't exists in a radigroup/dropdown/checkbox choices or matrix rows/columns.
   */
  public clearIncorrectValues() {}
  public clearUnusedValues() {}
  public updateValueWithDefaults() {}
  public getDisplayValue(keysAsText: boolean): any {
    return "";
  }
  public get displayValue(): any {
    return this.getDisplayValue(true);
  }
  public get value(): any {
    return null;
  }
  public set value(newValue: any) {}
  public clearValue() {}
  public clearValueIfInvisible() {}
  public locStrsChanged() {
    super.locStrsChanged();
  }
  onReadOnlyChanged() {}
  onAnyValueChanged(name: string) {}
  locOwner: ILocalizableOwner = null;
  //ILocalizableOwner
  /**
   * Returns the current survey locale
   * @see SurveyModel.locale
   */
  public getLocale(): string {
    return this.survey
      ? (<ILocalizableOwner>(<any>this.survey)).getLocale()
      : this.locOwner
        ? this.locOwner.getLocale()
        : "";
  }
  public getMarkdownHtml(text: string): string {
    return this.survey
      ? this.survey.getSurveyMarkdownHtml(this, text)
      : this.locOwner
        ? this.locOwner.getMarkdownHtml(text)
        : null;
  }
  public getProcessedText(text: string): string {
    if (this.textProcessor) return this.textProcessor.processText(text, true);
    if (this.locOwner) return this.locOwner.getProcessedText(text);
    return text;
  }
}
JsonObject.metaData.addClass("questionbase", [
  "!name",
  { name: "visible:boolean", default: true },
  "visibleIf:condition",
  { name: "width" },
  { name: "startWithNewLine:boolean", default: true },
  { name: "indent:number", default: 0, choices: [0, 1, 2, 3] },
  {
    name: "page",
    isSerializable: false,
    choices: function(obj) {
      var survey = obj ? obj.survey : null;
      return survey ? survey.pages : [];
    }
  }
]);
