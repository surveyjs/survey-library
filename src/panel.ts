import { property, Serializer } from "./jsonobject";
import { HashTable, Helpers } from "./helpers";
import { Base, EventBase } from "./base";
import {
  ISurveyImpl,
  IPage,
  IPanel,
  IConditionRunner,
  IElement,
  ISurveyElement,
  IQuestion,
  ISurveyErrorOwner,
  ITitleOwner,
  IProgressInfo,
  ISurvey,
  IFindElement
} from "./base-interfaces";
import { DragTypeOverMeEnum, SurveyElement } from "./survey-element";
import { Question } from "./question";
import { ConditionRunner } from "./conditions";
import { ElementFactory, QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { OneAnswerRequiredError } from "./error";
import { PageModel } from "./page";
import { settings } from "./settings";
import { findScrollableParent, isElementVisible } from "./utils/utils";
import { SurveyError } from "./survey-error";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { IAction } from "./actions/action";
import { AdaptiveActionContainer } from "./actions/adaptive-container";
import { ActionContainer } from "./actions/container";
import { SurveyModel } from "./survey";
import { DragDropPanelHelperV1 } from "./drag-drop-panel-helper-v1";
import { DragDropInfo } from "./drag-drop-helper-v1";

export class QuestionRowModel extends Base {
  private static rowCounter = 100;
  private static getRowId(): string {
    return "pr_" + QuestionRowModel.rowCounter++;
  }
  protected _scrollableParent: any = undefined;
  protected _updateVisibility: any = undefined;
  public startLazyRendering(
    rowContainerDiv: HTMLElement,
    findScrollableContainer = findScrollableParent
  ) {
    this._scrollableParent = findScrollableContainer(rowContainerDiv);
    // if  this._scrollableParent is html the scroll event isn't fired, so we should use window
    if (this._scrollableParent === document.documentElement) {
      this._scrollableParent = window;
    }
    const hasScroll = this._scrollableParent.scrollHeight > this._scrollableParent.clientHeight;
    this.isNeedRender = !hasScroll;
    if (hasScroll) {
      this._updateVisibility = () => {
        var isRowContainerDivVisible = isElementVisible(rowContainerDiv, 50);
        if (!this.isNeedRender && isRowContainerDivVisible) {
          this.isNeedRender = true;
          this.stopLazyRendering();
        }
      };
      setTimeout(() => {
        if (
          !!this._scrollableParent &&
          !!this._scrollableParent.addEventListener
        ) {
          this._scrollableParent.addEventListener(
            "scroll",
            this._updateVisibility
          );
        }
        this.ensureVisibility();
      }, 10);
    }
  }
  public ensureVisibility() {
    if (!!this._updateVisibility) {
      this._updateVisibility();
    }
  }
  public stopLazyRendering() {
    if (
      !!this._scrollableParent &&
      !!this._updateVisibility &&
      !!this._scrollableParent.removeEventListener
    ) {
      this._scrollableParent.removeEventListener(
        "scroll",
        this._updateVisibility
      );
    }
    this._scrollableParent = undefined;
    this._updateVisibility = undefined;
  }
  private idValue: string;
  constructor(public panel: PanelModelBase) {
    super();
    this.idValue = QuestionRowModel.getRowId();
    this.visible = panel.areInvisibleElementsShowing;
    this.createNewArray("elements");
    this.createNewArray("visibleElements");
  }
  private isLazyRenderingValue: boolean;
  public setIsLazyRendering(val: boolean) {
    this.isLazyRenderingValue = val;
    this.isNeedRender = !val;
  }
  public isLazyRendering(): boolean {
    return this.isLazyRenderingValue === true;
  }
  public get id(): string {
    return this.idValue;
  }
  public get elements(): Array<IElement> {
    return this.getPropertyValue("elements");
  }
  public get visibleElements(): Array<IElement> {
    return this.getPropertyValue("visibleElements");
  }
  public get visible(): boolean {
    return this.getPropertyValue("visible", true);
  }
  public set visible(val: boolean) {
    this.setPropertyValue("visible", val);
  }
  public get isNeedRender(): boolean {
    return this.getPropertyValue("isneedrender", true);
  }
  public set isNeedRender(val: boolean) {
    this.setPropertyValue("isneedrender", val);
  }
  public updateVisible() {
    const isVisible = this.calcVisible();
    this.setWidth();
    this.visible = isVisible;
  }
  public addElement(q: IElement) {
    this.elements.push(q);
    this.updateVisible();
  }
  public get index(): number {
    return this.panel.rows.indexOf(this);
  }
  private setWidth() {
    var visCount = this.visibleElements.length;
    if (visCount == 0) return;
    const isSingleInRow = this.visibleElements.length === 1;
    var counter = 0;
    var preSetWidthElements = [];
    for (var i = 0; i < this.elements.length; i++) {
      var el = this.elements[i];
      this.setElementMaxMinWidth(el);

      if (el.isVisible) {
        (<any>el).isSingleInRow = isSingleInRow;
        var width = this.getElementWidth(el);
        if (!!width) {
          el.renderWidth = this.getRenderedWidthFromWidth(width);
          preSetWidthElements.push(el);
        }
        if(counter < visCount - 1 && !(this.panel.isDefaultV2Theme || this.panel.parentQuestion?.isDefaultV2Theme)) {
          el.rightIndent = 1;
        } else {
          el.rightIndent = 0;
        }
        counter++;
      } else {
        el.renderWidth = "";
      }
    }
    for (var i = 0; i < this.elements.length; i++) {
      var el = this.elements[i];
      if (!el.isVisible || preSetWidthElements.indexOf(el) > -1) continue;
      if (preSetWidthElements.length == 0) {
        el.renderWidth = `${Number.parseFloat((100 / visCount).toFixed(6))}%`;
      } else {
        el.renderWidth = this.getRenderedCalcWidth(
          el,
          preSetWidthElements,
          visCount
        );
      }
    }
  }
  public setElementMaxMinWidth(el: IElement): void {
    if (
      el.width &&
      typeof el.width === "string" &&
      el.width.indexOf("%") === -1
    ) {
      el.minWidth = el.width;
      el.maxWidth = el.width;
    }
  }

  private getRenderedCalcWidth(
    el: IElement,
    preSetWidthElements: Array<IElement>,
    visCount: number
  ): string {
    var expression = "100%";
    for (var i = 0; i < preSetWidthElements.length; i++) {
      expression += " - " + preSetWidthElements[i].renderWidth;
    }
    var calcWidthEl = visCount - preSetWidthElements.length;
    if (calcWidthEl > 1) {
      expression = "(" + expression + ")/" + calcWidthEl.toString();
    }
    return "calc(" + expression + ")";
  }
  private getElementWidth(el: IElement): string {
    var width = el.width;
    if (!width || typeof width !== "string") return "";
    return width.trim();
  }
  private getRenderedWidthFromWidth(width: string): string {
    return Helpers.isNumber(width) ? width + "px" : width;
  }
  private calcVisible(): boolean {
    var visElements: Array<IElement> = [];
    for (var i = 0; i < this.elements.length; i++) {
      if (this.elements[i].isVisible) {
        visElements.push(this.elements[i]);
      }
    }
    if (this.needToUpdateVisibleElements(visElements)) {
      this.setPropertyValue("visibleElements", visElements);
    }
    return visElements.length > 0;
  }
  private needToUpdateVisibleElements(visElements: Array<IElement>): boolean {
    if (visElements.length !== this.visibleElements.length) return true;
    for (var i = 0; i < visElements.length; i++) {
      if (visElements[i] !== this.visibleElements[i]) return true;
    }
    return false;
  }
  @property({ defaultValue: null }) dragTypeOverMe: DragTypeOverMeEnum;
  public dispose() {
    super.dispose();
    this.stopLazyRendering();
  }
  public getRowCss() {
    return new CssClassBuilder()
      .append(this.panel.cssClasses.row)
      .append(this.panel.cssClasses.rowCompact, this.panel["isCompact"])
      .append(this.panel.cssClasses.pageRow, this.panel.isPage || (!!(<any>this.panel).originalPage && !(<any>this.panel.survey).isShowingPreview))
      .append(this.panel.cssClasses.rowMultiple, this.visibleElements.length > 1)
      .toString();

  }
}

/**
 * A base class for the [PanelModel](https://surveyjs.io/form-library/documentation/panelmodel) and [PageModel](https://surveyjs.io/form-library/documentation/pagemodel) classes.
 */
export class PanelModelBase extends SurveyElement<Question>
  implements IPanel, IConditionRunner, ISurveyErrorOwner, ITitleOwner {
  private static panelCounter = 100;
  private static getPanelId(): string {
    return "sp_" + PanelModelBase.panelCounter++;
  }

  private elementsValue: Array<IElement>;
  private isQuestionsReady: boolean = false;
  private questionsValue: Array<Question> = new Array<Question>();
  addElementCallback: (element: IElement) => void;
  removeElementCallback: (element: IElement) => void;
  onGetQuestionTitleLocation: () => string;

  private dragDropPanelHelper: DragDropPanelHelperV1;

  constructor(name: string = "") {
    super(name);
    this.createNewArray("rows");
    this.elementsValue = this.createNewArray(
      "elements",
      this.onAddElement.bind(this),
      this.onRemoveElement.bind(this)
    );
    this.id = PanelModelBase.getPanelId();

    this.addExpressionProperty("visibleIf",
      (obj: Base, res: any) => { this.visible = res === true; },
      (obj: Base) => { return !this.areInvisibleElementsShowing; });
    this.addExpressionProperty("enableIf", (obj: Base, res: any) => { this.readOnly = res === false; });
    this.addExpressionProperty("requiredIf", (obj: Base, res: any) => { this.isRequired = res === true; });

    this.createLocalizableString("requiredErrorText", this);
    this.registerPropertyChangedHandlers(["questionTitleLocation"], () => {
      this.onVisibleChanged.bind(this);
      this.updateElementCss(true);
    });
    this.registerPropertyChangedHandlers(
      ["questionStartIndex", "showQuestionNumbers"],
      () => {
        this.updateVisibleIndexes();
      }
    );

    this.dragDropPanelHelper = new DragDropPanelHelperV1(this);
  }
  public getType(): string {
    return "panelbase";
  }
  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean) {
    super.setSurveyImpl(value, isLight);
    if (this.isDesignMode) this.onVisibleChanged();
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].setSurveyImpl(value, isLight);
    }
  }
  endLoadingFromJson() {
    super.endLoadingFromJson();
    this.updateDescriptionVisibility(this.description);
    this.markQuestionListDirty();
    this.onRowsChanged();
  }
  @property({ defaultValue: true }) showTitle: boolean;
  get hasTitle(): boolean {
    return (
      (this.canShowTitle() && this.title.length > 0) ||
      (this.showTitle && this.isDesignMode && settings.designMode.showEmptyTitles)
    );
  }
  protected canShowTitle(): boolean { return true; }
  @property({ defaultValue: true }) showDescription: boolean;
  get _showDescription(): boolean {
    return this.survey && (<any>this.survey).showPageTitles && this.hasDescription ||
      (this.showDescription && this.isDesignMode &&
        settings.designMode.showEmptyTitles &&
        settings.designMode.showEmptyDescriptions);
  }
  public localeChanged() {
    super.localeChanged();
    for (var i = 0; i < this.elements.length; i++) {
      (<Base>(<any>this.elements[i])).localeChanged();
    }
  }
  public locStrsChanged() {
    super.locStrsChanged();
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].locStrsChanged();
    }
  }
  /**
   * Returns a character or text string that indicates a required panel/page.
   * @see SurveyModel.requiredText
   * @see isRequired
   */
  public get requiredText(): string {
    return !!this.survey && this.isRequired
      ? this.survey.requiredText
      : "";
  }
  protected get titlePattern(): string {
    return !!this.survey ? this.survey.questionTitlePattern : "numTitleRequire";
  }
  public get isRequireTextOnStart() {
    return this.isRequired && this.titlePattern == "requireNumTitle";
  }
  public get isRequireTextBeforeTitle() {
    return this.isRequired && this.titlePattern == "numRequireTitle";
  }
  public get isRequireTextAfterTitle() {
    return this.isRequired && this.titlePattern == "numTitleRequire";
  }
  /**
   * Specifies a custom error message for a required panel/page.
   * @see isRequired
   * @see requiredIf
   */
  public get requiredErrorText(): string {
    return this.getLocalizableStringText("requiredErrorText");
  }
  public set requiredErrorText(val: string) {
    this.setLocalizableStringText("requiredErrorText", val);
  }
  get locRequiredErrorText(): LocalizableString {
    return this.getLocalizableString("requiredErrorText");
  }
  /**
   * Specifies the sort order of questions in the panel/page.
   *
   * Possible values:
   *
   * - `"initial"` - Preserves the original order of questions.
   * - `"random"` - Displays questions in random order.
   * - `"default"` (default) - Inherits the setting from the Survey's `questionsOrder` property.
   * @see SurveyModel.questionsOrder
   * @see areQuestionsRandomized
   */
  public get questionsOrder(): string {
    return this.getPropertyValue("questionsOrder");
  }
  public set questionsOrder(val: string) {
    this.setPropertyValue("questionsOrder", val);
  }
  private canRandomize(isRandom: boolean): boolean {
    return isRandom && (this.questionsOrder !== "initial") || this.questionsOrder === "random";
  }
  protected isRandomizing = false;
  randomizeElements(isRandom: boolean): void {
    if (!this.canRandomize(isRandom) || this.isRandomizing) return;
    this.isRandomizing = true;
    var oldElements = [];
    var elements = this.elements;
    for (var i = 0; i < elements.length; i++) {
      oldElements.push(elements[i]);
    }
    const newElements = Helpers.randomizeArray<IElement>(oldElements);
    this.setArrayPropertyDirectly("elements", newElements, false);
    this.updateRows();
    this.updateVisibleIndexes();
    this.isRandomizing = false;
  }
  /**
   * Returns `true` if elements in this panel/page are arranged in random order.
   * @see questionsOrder
   */
  public get areQuestionsRandomized(): boolean {
    var order =
      this.questionsOrder == "default" && this.survey
        ? this.survey.questionsOrder
        : this.questionsOrder;
    return order == "random";
  }
  /**
   * Returns a survey element (panel or page) that contains this panel and allows you to move this question to a different survey element.
   *
   * This property is always `null` for the `PageModel` object.
   */
  public get parent(): PanelModelBase {
    return this.getPropertyValue("parent", null);
  }
  public set parent(val: PanelModelBase) {
    this.setPropertyValue("parent", val);
  }
  public get depth(): number {
    if (this.parent == null) return 0;
    return this.parent.depth + 1;
  }
  /**
   * A Boolean expression. If it evaluates to `false`, this panel/page becomes hidden.
   *
   * A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.
   *
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility)
   * @see visible
   * @see isVisible
   */
  public get visibleIf(): string {
    return this.getPropertyValue("visibleIf", "");
  }
  public set visibleIf(val: string) {
    this.setPropertyValue("visibleIf", val);
  }
  protected calcCssClasses(css: any): any {
    var classes = { panel: {}, error: {}, row: "", rowMultiple: "", pageRow: "", rowCompact: "" };
    this.copyCssClasses(classes.panel, css.panel);
    this.copyCssClasses(classes.error, css.error);
    if (!!css.pageRow) {
      classes.pageRow = css.pageRow;
    }
    if (!!css.rowCompact) {
      classes.rowCompact = css.rowCompact;
    }
    if (!!css.row) {
      classes.row = css.row;
    }
    if (!!css.rowMultiple) {
      classes.rowMultiple = css.rowMultiple;
    }
    if (this.survey) {
      this.survey.updatePanelCssClasses(this, classes);
    }
    return classes;
  }
  /**
   * An auto-generated unique element identifier.
   */
  public get id(): string {
    return this.getPropertyValue("id");
  }
  public set id(val: string) {
    this.setPropertyValue("id", val);
  }
  /**
   * Returns `true` if the survey element is a panel.
   * @see Base.getType
   */
  public get isPanel(): boolean {
    return false;
  }
  public getPanel(): IPanel {
    return this;
  }
  getLayoutType(): string {
    return "row";
  }
  isLayoutTypeSupported(layoutType: string): boolean {
    return layoutType !== "flow";
  }
  /**
   * An array of all questions within this panel/page. Includes questions within nested panels.
   * @see elements
   */
  public get questions(): Array<Question> {
    if (!this.isQuestionsReady) {
      this.questionsValue = [];
      for (var i = 0; i < this.elements.length; i++) {
        var el = this.elements[i];
        if (el.isPanel) {
          var qs = (<PanelModel>el).questions;
          for (var j = 0; j < qs.length; j++) {
            this.questionsValue.push(qs[j]);
          }
        } else {
          this.questionsValue.push(<Question>el);
        }
      }
      this.isQuestionsReady = true;
    }

    return this.questionsValue;
  }
  protected getValidName(name: string): string {
    if (!!name) return name.trim();
    return name;
  }
  /**
   * Returns a question with a specified `name`. This method does not find questions within nested panels.
   * @param name A question name.
   */
  public getQuestionByName(name: string): Question {
    var questions = this.questions;
    for (var i = 0; i < questions.length; i++) {
      if (questions[i].name == name) return questions[i];
    }
    return null;
  }
  /**
   * Returns a survey element with a specified `name`. This method can find survey elements within nested elements.
   * @param name An element name.
   */
  public getElementByName(name: string): IElement {
    var elements = this.elements;
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (el.name == name) return el;
      var pnl = el.getPanel();
      if (!!pnl) {
        var res = (<PanelModelBase>pnl).getElementByName(name);
        if (!!res) return res;
      }
    }
    return null;
  }
  public getQuestionByValueName(valueName: string): Question {
    var questions = this.questions;
    for (var i = 0; i < questions.length; i++) {
      if (questions[i].getValueName() == valueName) return questions[i];
    }
    return null;
  }
  /**
   * Returns a JSON object with question values nested in the panel/page.
   * @see getDisplayValue
   */
  public getValue(): any {
    var data: any = {};
    this.collectValues(data, 0);
    return data;
  }
  collectValues(data: any, level: number): boolean {
    let elements = this.elements;
    if(level === 0) {
      elements = this.questions;
    }
    let hasValue = false;
    for (var i = 0; i < elements.length; i++) {
      const el = elements[i];
      if(el.isPanel || el.isPage) {
        const panelData = {};
        if((<PanelModelBase><any>el).collectValues(panelData, level - 1)) {
          data[el.name] = panelData;
          hasValue = true;
        }
      } else {
        const q = <Question>el;
        if (!q.isEmpty()) {
          var valueName = q.getValueName();
          data[valueName] = q.value;
          if (!!this.data) {
            var comment = this.data.getComment(valueName);
            if (!!comment) {
              data[valueName + Base.commentSuffix] = comment;
            }
          }
        }
        hasValue = true;
      }
    }
    return true;
  }
  /**
   * Returns a JSON object with display texts that correspond to question values nested in the panel/page.
   * @param keysAsText Pass `true` if not only values in the object should be display texts, but also keys. Default value: `false`.
   * @see getValue
   */
  public getDisplayValue(keysAsText: boolean): any {
    var data: any = {};
    var questions = this.questions;

    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      if (q.isEmpty()) continue;
      var valueName = keysAsText ? q.title : q.getValueName();
      data[valueName] = q.getDisplayValue(keysAsText);
    }
    return data;
  }
  /**
   * Returns a JSON object with comments left to questions within this panel/page. Question names are used as keys.
   */
  public getComments(): any {
    var comments = {};
    if (!this.data) return comments;
    var questions = this.questions;
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      var comment = this.data.getComment(q.getValueName());
      if (!!comment) {
        (<any>comments)[q.getValueName()] = comment;
      }
    }
    return comments;
  }
  /**
   * Removes values that cannot be assigned to nested questions, for example, choices unlisted in the `choices` array.
   *
   * Call this method after you assign new question values in code to ensure that they are acceptable.
   *
   * > This method does not remove values for invisible questions and values that fail validation. Call the `validate()` method to validate newly assigned values.
   *
   * @see validate
   */
  public clearIncorrectValues() {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].clearIncorrectValues();
    }
  }
  /**
   * Empties the `errors` array for this panel/page and all its child elements (panels and questions).
   * @see errors
   */
  public clearErrors() {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].clearErrors();
    }
    this.errors = [];
  }
  private markQuestionListDirty() {
    this.isQuestionsReady = false;
    if (this.parent) this.parent.markQuestionListDirty();
  }
  /**
   * An array of all survey elements (questions or panels) within this panel/page. Does not include questions within nested panels.
   * @see questions
   */
  public get elements(): Array<IElement> {
    return this.elementsValue;
  }
  public getElementsInDesign(includeHidden: boolean = false): Array<IElement> {
    return this.elements;
  }
  /**
   * Checks whether a given element belongs to this panel/page or nested panels.
   * @param element A survey element to check.
   */
  public containsElement(element: IElement): boolean {
    for (var i = 0; i < this.elements.length; i++) {
      var el: any = this.elements[i];
      if (el == element) return true;
      var pnl = el.getPanel();
      if (!!pnl) {
        if ((<PanelModelBase>pnl).containsElement(element)) return true;
      }
    }
    return false;
  }
  /**
   * Makes the panel/page require an answer at least in one nested question. If a respondent leaves the panel/page without any answers, the survey displays a validation error.
   * @see requiredIf
   * @see [Data Validation](https://surveyjs.io/form-library/documentation/data-validation)
   */
  public get isRequired(): boolean {
    return this.getPropertyValue("isRequired");
  }
  public set isRequired(val: boolean) {
    this.setPropertyValue("isRequired", val);
  }
  /**
   * A Boolean expression. If it evaluates to `true`, this panel/page becomes required (at least one question in the panel/page should have an answer).
   *
   * A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.
   *
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility)
   * @see isRequired
   */
  public get requiredIf(): string {
    return this.getPropertyValue("requiredIf", "");
  }
  public set requiredIf(val: string) {
    this.setPropertyValue("requiredIf", val);
  }
  public searchText(text: string, founded: Array<IFindElement>): void {
    super.searchText(text, founded);
    for (var i = 0; i < this.elements.length; i++) {
      (<Base>(<any>this.elements[i])).searchText(text, founded);
    }
  }
  public hasErrors(fireCallback: boolean = true, focusOnFirstError: boolean = false, rec: any = null): boolean {
    return !this.validate(fireCallback, focusOnFirstError, rec);
  }
  /**
   * Validates questions within this panel or page and returns `false` if the validation fails.
   * @param fireCallback *Optional.* Pass `false` if you do not want to show validation errors in the UI.
   * @param focusOnFirstError *Optional.* Pass `true` if you want to focus the first question with a validation error.
   * @see [Data Validation](https://surveyjs.io/form-library/documentation/data-validation)
   */
  public validate(fireCallback: boolean = true, focusOnFirstError: boolean = false, rec: any = null): boolean {
    rec = !!rec
      ? rec
      : {
        fireCallback: fireCallback,
        focuseOnFirstError: focusOnFirstError,
        firstErrorQuestion: <any>null,
        result: false,
      };
    if(rec.result !== true) rec.result = false;
    this.hasErrorsCore(rec);
    if (rec.firstErrorQuestion) {
      rec.firstErrorQuestion.focus(true);
    }
    return !rec.result;
  }
  public validateContainerOnly(): void {
    this.hasErrorsInPanels({ fireCallback: true });
    if(!!this.parent) {
      this.parent.validateContainerOnly();
    }
  }
  private hasErrorsInPanels(rec: any) {
    var errors = <Array<any>>[];
    this.hasRequiredError(rec, errors);
    if (this.survey) {
      var customError = this.survey.validatePanel(this);
      if (customError) {
        errors.push(customError);
        rec.result = true;
      }
    }
    if (!!rec.fireCallback) {
      if (!!this.survey) {
        this.survey.beforeSettingPanelErrors(this, errors);
      }
      this.errors = errors;
    }
  }
  //ISurveyErrorOwner
  getErrorCustomText(text: string, error: SurveyError): string {
    if (!!this.survey) return this.survey.getSurveyErrorCustomText(this, text, error);
    return text;
  }

  private hasRequiredError(rec: any, errors: Array<SurveyError>) {
    if (!this.isRequired) return;
    var visQuestions = <Array<any>>[];
    this.addQuestionsToList(visQuestions, true);
    if (visQuestions.length == 0) return;
    for (var i = 0; i < visQuestions.length; i++) {
      if (!visQuestions[i].isEmpty()) return;
    }
    rec.result = true;
    errors.push(new OneAnswerRequiredError(this.requiredErrorText, this));
    if (rec.focuseOnFirstError && !rec.firstErrorQuestion) {
      rec.firstErrorQuestion = visQuestions[0];
    }
  }
  protected hasErrorsCore(rec: any) {
    var elements = this.elements;
    var element = null;

    for (var i = 0; i < elements.length; i++) {
      element = elements[i];

      if (!element.isVisible) continue;

      if (element.isPanel) {
        (<PanelModelBase>(<any>element)).hasErrorsCore(rec);
      } else {
        var question = <Question>element;
        if (question.isReadOnly) continue;
        if (!question.validate(rec.fireCallback, rec)) {
          if (rec.focuseOnFirstError && rec.firstErrorQuestion == null) {
            rec.firstErrorQuestion = question;
          }
          rec.result = true;
        }
      }
    }
    this.hasErrorsInPanels(rec);
    this.updateContainsErrors();
  }
  protected getContainsErrors(): boolean {
    var res = super.getContainsErrors();
    if (res) return res;
    var elements = this.elements;
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].containsErrors) return true;
    }
    return false;
  }
  updateElementVisibility() {
    for (var i = 0; i < this.elements.length; i++) {
      var el = this.elements[i];
      (<Base>(<any>el)).setPropertyValue("isVisible", el.isVisible);
      if (el.isPanel) {
        (<PanelModelBase>(<any>el)).updateElementVisibility();
      }
    }
  }
  getFirstQuestionToFocus(withError: boolean = false, ignoreCollapseState: boolean = false): Question {
    if (!withError && !ignoreCollapseState && this.isCollapsed) return null;
    var elements = this.elements;
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (!el.isVisible || !ignoreCollapseState && el.isCollapsed) continue;
      if (el.isPanel) {
        var res = (<PanelModelBase>(<any>el)).getFirstQuestionToFocus(withError, ignoreCollapseState);
        if (!!res) return res;
      } else {
        const q = (<Question>el).getFirstQuestionToFocus(withError);
        if (!!q) return q;
      }
    }
    return null;
  }
  /**
   * Focuses the first question in this panel/page.
   * @see focusFirstErrorQuestion
   */
  public focusFirstQuestion() {
    var q = this.getFirstQuestionToFocus();
    if (!!q) {
      q.focus();
    }
  }
  /**
   * Focuses the first question with a validation error in this panel/page.
   * @see validate
   * @see focusFirstQuestion
   */
  public focusFirstErrorQuestion() {
    var q = this.getFirstQuestionToFocus(true);
    if (!!q) {
      q.focus();
    }
  }
  public addQuestionsToList(
    list: Array<IQuestion>,
    visibleOnly: boolean = false,
    includingDesignTime: boolean = false
  ) {
    this.addElementsToList(list, visibleOnly, includingDesignTime, false);
  }
  public addPanelsIntoList(
    list: Array<IPanel>,
    visibleOnly: boolean = false,
    includingDesignTime: boolean = false
  ) {
    this.addElementsToList(
      <Array<IElement>>(<Array<any>>list),
      visibleOnly,
      includingDesignTime,
      true
    );
  }
  private addElementsToList(
    list: Array<IElement>,
    visibleOnly: boolean,
    includingDesignTime: boolean,
    isPanel: boolean
  ) {
    if (visibleOnly && !this.visible) return;
    this.addElementsToListCore(
      list,
      this.elements,
      visibleOnly,
      includingDesignTime,
      isPanel
    );
  }
  private addElementsToListCore(
    list: Array<IElement>,
    elements: Array<IElement>,
    visibleOnly: boolean,
    includingDesignTime: boolean,
    isPanel: boolean
  ) {
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (visibleOnly && !el.visible) continue;
      if ((isPanel && el.isPanel) || (!isPanel && !el.isPanel)) {
        list.push(el);
      }
      if (el.isPanel) {
        (<PanelModel>el).addElementsToListCore(
          list,
          (<PanelModel>el).elements,
          visibleOnly,
          includingDesignTime,
          isPanel
        );
      } else {
        if (includingDesignTime) {
          this.addElementsToListCore(
            list,
            (<SurveyElement>(<any>el)).getElementsInDesign(false),
            visibleOnly,
            includingDesignTime,
            isPanel
          );
        }
      }
    }
  }
  public updateCustomWidgets() {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].updateCustomWidgets();
    }
  }
  /**
   * Sets a title location relative to the input field for questions that belong to this panel/page.
   *
   * Use this property to override the `questionTitleLocation` property specified for the survey. You can also set the `titleLocation` property for individual questions.
   *
   * Possible values:
   *
   * - `"default"` (default) - Inherits the setting from the `questionTitleLocation` property specified for the survey.
   * - `"top"` - Displays the title above the input field.
   * - `"bottom"` - Displays the title below the input field.
   * - `"left"` - Displays the title to the left of the input field.
   * - `"hidden"` - Hides the question title.
   *
   * > Certain question types (Matrix, Multiple Text) do not support the `"left"` value. For them, the `"top"` value is used.
   * @see SurveyModel.questionTitleLocation
   */
  public get questionTitleLocation(): string {
    return this.getPropertyValue("questionTitleLocation");
  }
  public set questionTitleLocation(value: string) {
    this.setPropertyValue("questionTitleLocation", value.toLowerCase());
  }
  getQuestionTitleLocation(): string {
    if (this.onGetQuestionTitleLocation)
      return this.onGetQuestionTitleLocation();
    if (this.questionTitleLocation != "default")
      return this.questionTitleLocation;
    if (this.parent) return this.parent.getQuestionTitleLocation();
    return this.survey ? this.survey.questionTitleLocation : "top";
  }
  protected getStartIndex(): string {
    if (!!this.parent) return this.parent.getQuestionStartIndex();
    if (!!this.survey) return this.survey.questionStartIndex;
    return "";
  }
  getQuestionStartIndex(): string {
    return this.getStartIndex();
  }
  getChildrenLayoutType(): string {
    return "row";
  }
  public getProgressInfo(): IProgressInfo {
    return SurveyElement.getProgressInfoByElements(
      <Array<SurveyElement>>(<any>this.elements),
      this.isRequired
    );
  }
  public get root(): PanelModelBase {
    var res = <PanelModelBase>this;
    while (res.parent) res = res.parent;
    return res;
  }
  protected childVisibilityChanged() {
    var newIsVisibleValue = this.getIsPageVisible(null);
    var oldIsVisibleValue = this.getPropertyValue("isVisible", true);
    if (newIsVisibleValue !== oldIsVisibleValue) {
      this.onVisibleChanged();
    }
  }
  public createRowAndSetLazy(index: number): QuestionRowModel {
    const row = this.createRow();
    row.setIsLazyRendering(this.isLazyRenderInRow(index));
    return row;
  }
  public createRow(): QuestionRowModel {
    return new QuestionRowModel(this);
  }
  public onSurveyLoad() {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].onSurveyLoad();
    }
    this.onElementVisibilityChanged(this);
  }
  public onFirstRendering() {
    super.onFirstRendering();
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].onFirstRendering();
    }
    this.onRowsChanged();
  }
  public updateRows() {
    if (this.isLoadingFromJson) return;
    for (var i = 0; i < this.elements.length; i++) {
      if (this.elements[i].isPanel) {
        (<PanelModel>this.elements[i]).updateRows();
      }
    }
    this.onRowsChanged();
  }
  get rows(): Array<QuestionRowModel> {
    return this.getPropertyValue("rows");
  }

  public ensureRowsVisibility() {
    this.rows.forEach((row) => {
      row.ensureVisibility();
    });
  }

  protected onRowsChanged() {
    if (this.isLoadingFromJson) return;
    this.setArrayPropertyDirectly("rows", this.buildRows());
  }
  protected onAddElement(element: IElement, index: number) {
    element.setSurveyImpl(this.surveyImpl);
    element.parent = this;
    this.markQuestionListDirty();
    if (this.canBuildRows()) {
      let dragDropInfo = settings.supportCreatorV2 ? this.getDragDropInfo() : undefined;
      this.dragDropPanelHelper.updateRowsOnElementAdded(element, index, dragDropInfo, this);
    }
    if (element.isPanel) {
      var p = <PanelModel>element;
      if (this.survey) {
        this.survey.panelAdded(p, index, this, this.root);
      }
    } else {
      if (this.survey) {
        var q = <Question>element;
        this.survey.questionAdded(q, index, this, this.root);
      }
    }
    if (!!this.addElementCallback) this.addElementCallback(element);
    var self = this;
    (<Base>(<any>element)).registerPropertyChangedHandlers(
      ["visible", "isVisible"], () => {
        this.onElementVisibilityChanged(element);
      },
      this.id
    );
    (<Base>(<any>element)).registerPropertyChangedHandlers(["startWithNewLine"], () => {
      this.onElementStartWithNewLineChanged(element);
    }, this.id);
    this.onElementVisibilityChanged(this);
  }
  protected onRemoveElement(element: IElement) {
    element.parent = null;
    this.markQuestionListDirty();
    (<Base>(<any>element)).unregisterPropertyChangedHandlers(["visible", "isVisible", "startWithNewLine"], this.id);
    this.updateRowsOnElementRemoved(element);
    if (this.isRandomizing) return;
    if (!element.isPanel) {
      if (this.survey) this.survey.questionRemoved(<Question>element);
    } else {
      if (this.survey) this.survey.panelRemoved(element);
    }
    if (!!this.removeElementCallback) this.removeElementCallback(element);
    this.onElementVisibilityChanged(this);
  }
  private onElementVisibilityChanged(element: any) {
    if (this.isLoadingFromJson || this.isRandomizing) return;
    this.updateRowsVisibility(element);
    this.childVisibilityChanged();
    if (!!this.parent) {
      this.parent.onElementVisibilityChanged(this);
    }
  }
  private onElementStartWithNewLineChanged(element: any) {
    this.onRowsChanged();
  }
  private updateRowsVisibility(element: any) {
    var rows = this.rows;
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (row.elements.indexOf(element) > -1) {
        row.updateVisible();
        if (row.visible && !row.isNeedRender) {
          row.isNeedRender = true;
        }
        break;
      }
    }
  }
  public canBuildRows() {
    return !this.isLoadingFromJson && this.getChildrenLayoutType() == "row";
  }
  private buildRows(): Array<QuestionRowModel> {
    if (!this.canBuildRows()) return [];
    var result = new Array<QuestionRowModel>();
    for (var i = 0; i < this.elements.length; i++) {
      var el = this.elements[i];
      var isNewRow = i == 0 || el.startWithNewLine;
      var row = isNewRow ? this.createRowAndSetLazy(result.length) : result[result.length - 1];
      if (isNewRow) result.push(row);
      row.addElement(el);
    }
    for (var i = 0; i < result.length; i++) {
      result[i].updateVisible();
    }
    return result;
  }
  private isLazyRenderInRow(rowIndex: number): boolean {
    if (!this.survey || !this.survey.isLazyRendering) return false;
    return (
      rowIndex >= settings.lazyRender.firstBatchSize ||
      !this.canRenderFirstRows()
    );
  }
  protected canRenderFirstRows(): boolean {
    return this.isPage;
  }
  public getDragDropInfo(): any {
    const page: PanelModelBase = <any>this.getPage(this.parent);
    return !!page ? page.getDragDropInfo() : undefined;
  }
  private updateRowsOnElementRemoved(element: IElement) {
    if (!this.canBuildRows()) return;
    this.updateRowsRemoveElementFromRow(
      element,
      this.findRowByElement(element)
    );
  }
  public updateRowsRemoveElementFromRow(
    element: IElement,
    row: QuestionRowModel
  ) {
    if (!row || !row.panel) return;
    var elIndex = row.elements.indexOf(element);
    if (elIndex < 0) return;
    row.elements.splice(elIndex, 1);
    if (row.elements.length > 0) {
      row.elements[0].startWithNewLine = true;
      row.updateVisible();
    } else {
      if (row.index >= 0) {
        row.panel.rows.splice(row.index, 1);
      }
    }
  }
  public findRowByElement(el: IElement): QuestionRowModel {
    var rows = this.rows;
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].elements.indexOf(el) > -1) return rows[i];
    }
    return null;
  }
  elementWidthChanged(el: IElement) {
    if (this.isLoadingFromJson) return;
    var row = this.findRowByElement(el);
    if (!!row) {
      row.updateVisible();
    }
  }
  public get processedTitle() {
    return this.getRenderedTitle(this.locTitle.textOrHtml);
  }
  protected getRenderedTitle(str: string): string {
    return this.textProcessor != null
      ? this.textProcessor.processText(str, true)
      : str;
  }
  /**
   * Gets or sets panel/page visibility.
   *
   * If you want to display or hide a survey element based on a condition, specify the `visibleIf` property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   * @see visibleIf
   * @see isVisible
   */
  public get visible(): boolean {
    return this.getPropertyValue("visible", true);
  }
  public set visible(value: boolean) {
    if (value === this.visible) return;
    this.setPropertyValue("visible", value);
    this.setPropertyValue("isVisible", this.isVisible);
    if (!this.isLoadingFromJson) this.onVisibleChanged();
  }
  protected onVisibleChanged(): void {
    if (this.isRandomizing) return;
    this.setPropertyValue("isVisible", this.isVisible);
    if (
      !!this.survey && this.survey.getQuestionClearIfInvisible("default") !== "none" &&
      !this.isLoadingFromJson
    ) {
      const questions = this.questions;
      const isVisible = this.isVisible;
      for (var i = 0; i < questions.length; i++) {
        if (!isVisible) {
          questions[i].clearValueIfInvisible("onHiddenContainer");
        } else {
          questions[i].updateValueWithDefaults();
        }
      }
    }
  }
  /**
   * Returns `true` if the panel/page is visible or the survey is currently in design mode.
   *
   * If you want to display or hide a question based on a condition, specify the `visibleIf` property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   * @see visibleIf
   * @see visible
   */
  public get isVisible(): boolean {
    return this.areInvisibleElementsShowing || this.getIsPageVisible(null);
  }
  getIsPageVisible(exceptionQuestion: IQuestion): boolean {
    if (!this.visible) return false;
    for (var i = 0; i < this.elements.length; i++) {
      if (this.elements[i] == exceptionQuestion) continue;
      if (this.elements[i].isVisible) return true;
    }
    return false;
  }
  private lastVisibleIndex: number;
  public setVisibleIndex(index: number): number {
    if (!this.isVisible || index < 0) {
      this.resetVisibleIndexes();
      return 0;
    }
    this.lastVisibleIndex = index;
    var startIndex = index;
    index += this.beforeSetVisibleIndex(index);
    var panelStartIndex = this.getPanelStartIndex(index);
    var panelIndex = panelStartIndex;
    for (var i = 0; i < this.elements.length; i++) {
      panelIndex += this.elements[i].setVisibleIndex(panelIndex);
    }
    if (this.isContinueNumbering()) {
      index += panelIndex - panelStartIndex;
    }
    return index - startIndex;
  }
  private updateVisibleIndexes() {
    if (this.lastVisibleIndex === undefined) return;
    this.resetVisibleIndexes();
    this.setVisibleIndex(this.lastVisibleIndex);
  }
  private resetVisibleIndexes() {
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].setVisibleIndex(-1);
    }
  }
  protected beforeSetVisibleIndex(index: number): number {
    return 0;
  }
  protected getPanelStartIndex(index: number): number {
    return index;
  }
  protected isContinueNumbering() {
    return true;
  }
  public get isReadOnly(): boolean {
    var isParentReadOnly = !!this.parent && this.parent.isReadOnly;
    var isSurveyReadOnly = !!this.survey && this.survey.isDisplayMode;
    return this.readOnly || isParentReadOnly || isSurveyReadOnly;
  }
  protected onReadOnlyChanged() {
    for (var i = 0; i < this.elements.length; i++) {
      var el = <SurveyElement>(<any>this.elements[i]);
      el.setPropertyValue("isReadOnly", el.isReadOnly);
    }
    super.onReadOnlyChanged();
  }
  public updateElementCss(reNew?: boolean) {
    super.updateElementCss(reNew);
    for (let i = 0; i < this.elements.length; i++) {
      const el = <SurveyElement>(<any>this.elements[i]);
      el.updateElementCss(reNew);
    }
  }
  /**
   * A Boolean expression. If it evaluates to `false`, this panel/page becomes read-only.
   *
   * A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.
   *
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility)
   * @see readOnly
   * @see isReadOnly
   */
  public get enableIf(): string {
    return this.getPropertyValue("enableIf", "");
  }
  public set enableIf(val: string) {
    this.setPropertyValue("enableIf", val);
  }
  /**
   * Adds a survey element (question or panel) to this panel/page. Returns `true` if the element was added successfully; `false` otherwise.
   * @param element A survey element to add.
   * @param index A desired index of this element in the `elements` array.
   * @see addNewQuestion
   * @see addNewPanel
   */
  public addElement(element: IElement, index: number = -1): boolean {
    if (!this.canAddElement(element)) return false;
    if (index < 0 || index >= this.elements.length) {
      this.elements.push(element);
    } else {
      this.elements.splice(index, 0, element);
    }
    return true;
  }

  public insertElementAfter(element: IElement, after: IElement) {
    const index = this.elements.indexOf(after);
    if (index >= 0) this.addElement(element, index + 1);
  }
  public insertElementBefore(element: IElement, before: IElement) {
    const index = this.elements.indexOf(before);
    if (index >= 0) this.addElement(element, index);
  }

  protected canAddElement(element: IElement): boolean {
    return (
      !!element && element.isLayoutTypeSupported(this.getChildrenLayoutType())
    );
  }
  public addQuestion(question: Question, index: number = -1): boolean {
    return this.addElement(question, index);
  }
  public addPanel(panel: PanelModel, index: number = -1): boolean {
    return this.addElement(panel, index);
  }
  /**
   * Creates a new question of a given type and adds it to the `elements` array at a specified index.
   *
   * This method returns `null` if the question cannot be created or added to this panel/page; otherwise, the method returns the created question.
   *
   * @param questionType A [question type](https://surveyjs.io/form-library/documentation/question#getType).
   * @param name A question name.
   * @param index A desired index of the new question in the `elements` array.
   * @see elements
   * @see addElement
   */
  public addNewQuestion(
    questionType: string,
    name: string = null,
    index: number = -1
  ): Question {
    var question = QuestionFactory.Instance.createQuestion(questionType, name);
    if (!this.addQuestion(question, index)) return null;
    return question;
  }
  /**
   * Creates a new panel and adds it to the end of the `elements` array.
   *
   * This method returns `null` if the panel cannot be created or added to this panel/page; otherwise, the method returns the created panel.
   * @param name A panel name.
   * @see elements
   * @see addElement
   */
  public addNewPanel(name: string = null): PanelModel {
    var panel = this.createNewPanel(name);
    if (!this.addPanel(panel)) return null;
    return panel;
  }
  public indexOf(element: IElement): number {
    return this.elements.indexOf(element);
  }
  protected createNewPanel(name: string): PanelModel {
    var res = Serializer.createClass("panel");
    res.name = name;
    return res;
  }
  /**
   * Deletes a survey element (question or panel) from this panel/page. Returns `true` if the element was deleted successfully; `false` otherwise.
   * @param element A survey element to delete.
   * @see elements
   */
  public removeElement(element: IElement): boolean {
    var index = this.elements.indexOf(element);
    if (index < 0) {
      for (var i = 0; i < this.elements.length; i++) {
        if (this.elements[i].removeElement(element)) return true;
      }
      return false;
    }
    this.elements.splice(index, 1);
    return true;
  }
  public removeQuestion(question: Question) {
    this.removeElement(question);
  }
  runCondition(values: HashTable<any>, properties: HashTable<any>) {
    if (this.isDesignMode || this.isLoadingFromJson) return;
    var elements = this.elements.slice();
    for (var i = 0; i < elements.length; i++) {
      elements[i].runCondition(values, properties);
    }
    this.runConditionCore(values, properties);
  }
  onAnyValueChanged(name: string) {
    var els = this.elements;
    for (var i = 0; i < els.length; i++) {
      els[i].onAnyValueChanged(name);
    }
  }
  checkBindings(valueName: string, value: any) {
    var els = this.elements;
    for (var i = 0; i < els.length; i++) {
      (<Base>(<any>els[i])).checkBindings(valueName, value);
    }
  }

  public dragDropAddTarget(dragDropInfo: DragDropInfo) {
    this.dragDropPanelHelper.dragDropAddTarget(dragDropInfo);
  }
  public dragDropFindRow(findElement: ISurveyElement): QuestionRowModel {
    return this.dragDropPanelHelper.dragDropFindRow(findElement);
  }
  public dragDropMoveElement(src: IElement, target: IElement, targetIndex: number) {
    this.dragDropPanelHelper.dragDropMoveElement(src, target, targetIndex);
  }

  public needResponsiveWidth() {
    let result = false;
    this.elements.forEach((e) => {
      if (e.needResponsiveWidth())
        result = true;
    });
    this.rows.forEach((r) => {
      if (r.elements.length > 1)
        result = true;
    });

    return result;
  }

  public get hasDescriptionUnderTitle(): boolean {
    return this.hasDescription;
  }
  public get cssHeader(): string {
    return this.cssClasses.panel.header;
  }
  public get cssDescription(): string {
    return this.cssClasses.panel.description;
  }

  //ITitleOwner
  public get no(): string { return ""; }
  public dispose() {
    super.dispose();
    if (this.rows) {
      for (var i = 0; i < this.rows.length; i++) {
        this.rows[i].dispose();
      }
      this.rows.splice(0, this.rows.length);
    }
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].dispose();
    }
    this.elements.splice(0, this.elements.length);
  }

}

/**
 * A class that describes the Panel container element.
 *
 * A panel can contain questions and other panels. Refer to the following help topic for an illustration: [Survey Structure](https://surveyjs.io/form-library/documentation/design-survey-create-a-simple-survey#survey-structure).
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-panel/ (linkStyle))
 */
export class PanelModel extends PanelModelBase implements IElement {
  constructor(name: string = "") {
    super(name);
    this.createNewArray("footerActions");
    this.registerPropertyChangedHandlers(["width"], () => {
      if (!!this.parent) {
        this.parent.elementWidthChanged(this);
      }
    });
    this.registerPropertyChangedHandlers(
      ["indent", "innerIndent", "rightIndent"], () => { this.onIndentChanged(); });
  }
  public getType(): string {
    return "panel";
  }
  public get contentId(): string {
    return this.id + "_content";
  }
  public getSurvey(live: boolean = false): ISurvey {
    if (live) {
      return !!this.parent ? this.parent.getSurvey(live) : null;
    }
    return super.getSurvey(live);
  }
  onSurveyLoad() {
    super.onSurveyLoad();
    this.onIndentChanged();
  }
  protected onSetData() {
    super.onSetData();
    this.onIndentChanged();
  }
  public get isPanel(): boolean {
    return true;
  }
  /**
   * Returns a page to which the panel belongs and allows you to move this panel to a different page.
   * @see PanelModelBase.parent
   */
  public get page(): IPage {
    return this.getPage(this.parent);
  }
  public set page(val: IPage) {
    this.setPage(this.parent, val);
  }
  public delete() {
    if (!!this.parent) {
      this.removeSelfFromList(this.parent.elements);
    }
  }
  public moveTo(container: IPanel, insertBefore: any = null): boolean {
    return this.moveToBase(this.parent, container, insertBefore);
  }
  /**
   * Returns the visible index of the panel in the survey. Commonly it is -1 and it doesn't show.
   * You have to set showNumber to true to show index/numbering for the Panel
   * @see showNumber
   */
  public get visibleIndex(): number {
    return this.getPropertyValue("visibleIndex", -1);
  }
  public getTitleOwner(): ITitleOwner { return this; }
  /**
   * Specifies whether to show the panel number in the title.
   *
   * Default value: `false`
   * @see SurveyModel.showQuestionNumbers
   * @see SurveyModel.questionTitlePattern
   */
  public get showNumber(): boolean {
    return this.getPropertyValue("showNumber");
  }
  public set showNumber(val: boolean) {
    this.setPropertyValue("showNumber", val);
    this.notifySurveyOnVisibilityChanged();
  }
  /**
   * Gets or sets a value that specifies how the elements numbers inside panel are displayed.
   *
   * The following options are available:
   *
   * - `default` - display questions numbers as defined in parent panel or survey
   * - `onpanel` - display questions numbers, start numbering from beginning of this page
   * - `off` - turn off the numbering for questions titles
   * @see showNumber
   */
  public get showQuestionNumbers(): string {
    return this.getPropertyValue("showQuestionNumbers");
  }
  public set showQuestionNumbers(value: string) {
    this.setPropertyValue("showQuestionNumbers", value);
    this.notifySurveyOnVisibilityChanged();
  }
  /**
   * Specifies a number or letter used to start numbering of elements inside the panel.
   *
   * You can include desired prefixes and postfixes alongside the number or letter:
   *
   * ```js
   * "questionStartIndex": "a.", // a., b., c., ...
   * "questionStartIndex": "#3", // #3, #4, #5, ...
   * "questionStartIndex": "(B)." // (B)., (C)., (D)., ...
   * ```
   * Default value: `"1."` (inherited from `SurveyModel`'s `questionStartIndex` property)
   * @see SurveyModel.questionStartIndex
   * @see showQuestionNumbers
   */
  public get questionStartIndex(): string {
    return this.getPropertyValue("questionStartIndex", "");
  }
  public set questionStartIndex(val: string) {
    this.setPropertyValue("questionStartIndex", val);
  }
  getQuestionStartIndex(): string {
    if (!!this.questionStartIndex) return this.questionStartIndex;
    return super.getQuestionStartIndex();
  }
  /**
   * A question number or letter (depends on the `questionStartIndex` property).
   *
   * When the question number, title, or the entire question is invisible, this property returns an empty string.
   * @see questionStartIndex
   * @see showNumber
   * @see visibleIf
   */
  public get no(): string {
    return this.getPropertyValue("no", "");
  }
  protected setNo(visibleIndex: number) {
    this.setPropertyValue(
      "no",
      Helpers.getNumberByIndex(this.visibleIndex, this.getStartIndex())
    );
  }
  protected beforeSetVisibleIndex(index: number): number {
    let visibleIndex = -1;
    if (this.showNumber && (this.isDesignMode || !this.locTitle.isEmpty)) {
      visibleIndex = index;
    }
    this.setPropertyValue("visibleIndex", visibleIndex);
    this.setNo(visibleIndex);
    return visibleIndex < 0 ? 0 : 1;
  }
  protected getPanelStartIndex(index: number): number {
    if (this.showQuestionNumbers == "off") return -1;
    if (this.showQuestionNumbers == "onpanel") return 0;
    return index;
  }
  protected isContinueNumbering() {
    return (
      this.showQuestionNumbers != "off" && this.showQuestionNumbers != "onpanel"
    );
  }
  private notifySurveyOnVisibilityChanged() {
    if (this.survey != null && !this.isLoadingFromJson) {
      this.survey.panelVisibilityChanged(this, this.isVisible);
    }
  }
  protected hasErrorsCore(rec: any) {
    super.hasErrorsCore(rec);
    if (this.isCollapsed && rec.result && rec.fireCallback) {
      this.expand();
    }
  }
  protected getRenderedTitle(str: string): string {
    if (!str) {
      if (this.isCollapsed || this.isExpanded) return this.name;
      if (this.isDesignMode) return "[" + this.name + "]";
    }
    return super.getRenderedTitle(str);
  }
  /**
   * Increases or decreases an indent of panel content from the left edge. Accepts positive integer values and 0.
   */
  public get innerIndent(): number {
    return this.getPropertyValue("innerIndent");
  }
  public set innerIndent(val: number) {
    this.setPropertyValue("innerIndent", val);
  }
  /**
   * Disable this property if you want to render the current panel on the same line or row with the previous question or panel.
   */
  public get startWithNewLine(): boolean {
    return this.getPropertyValue("startWithNewLine");
  }
  public set startWithNewLine(value: boolean) {
    this.setPropertyValue("startWithNewLine", value);
  }
  public get allowAdaptiveActions(): boolean {
    return this.getPropertyValue("allowAdaptiveActions");
  }
  public set allowAdaptiveActions(val: boolean) {
    this.setPropertyValue("allowAdaptiveActions", val);
  }
  get innerPaddingLeft(): string {
    return this.getPropertyValue("innerPaddingLeft", "");
  }
  set innerPaddingLeft(val: string) {
    this.setPropertyValue("innerPaddingLeft", val);
  }
  private onIndentChanged() {
    if (!this.getSurvey()) return;
    this.innerPaddingLeft = this.getIndentSize(this.innerIndent);
    this.paddingLeft = this.getIndentSize(this.indent);
    this.paddingRight = this.getIndentSize(this.rightIndent);
  }
  private getIndentSize(indent: number): string {
    if (indent < 1) return "";
    var css = (<any>this).survey["css"];
    if (!css || !css.question.indent) return "";
    return indent * css.question.indent + "px";
  }
  public clearOnDeletingContainer() {
    this.elements.forEach((element) => {
      if (element instanceof Question || element instanceof PanelModel) {
        element.clearOnDeletingContainer();
      }
    });
  }
  public get footerActions(): Array<IAction> {
    return this.getPropertyValue("footerActions");
  }
  private footerToolbarValue: ActionContainer;

  private footerToolbarCssValue: string;

  public set footerToolbarCss(val: string) {
    this.footerToolbarCssValue = val;
  }

  public get footerToolbarCss(): string {
    return this.footerToolbarCssValue || this.cssClasses.panel?.footer;
  }
  public onGetFooterActionsCallback: () => Array<IAction>;

  public getFooterToolbar(): ActionContainer {
    if (!this.footerToolbarValue) {
      var actions = this.footerActions;
      if (this.hasEditButton) {
        actions.push({
          id: "cancel-preview",
          locTitle: this.survey.locEditText,
          innerCss: this.survey.cssNavigationEdit,
          action: () => { this.cancelPreview(); }
        });
      }
      if(!!this.onGetFooterActionsCallback) {
        actions = this.onGetFooterActionsCallback();
      } else {
        actions = this.survey?.getUpdatedPanelFooterActions(this, actions);
      }
      this.footerToolbarValue = this.createActionContainer(this.allowAdaptiveActions);
      // if (!!this.cssClasses.panel) {
      this.footerToolbarValue.containerCss = this.footerToolbarCss;
      // }
      this.footerToolbarValue.setItems(actions);
    }
    return this.footerToolbarValue;
  }
  public get hasEditButton(): boolean {
    if (this.survey && this.survey.state === "preview") return this.depth === 1;
    return false;
  }
  public cancelPreview() {
    if (!this.hasEditButton) return;
    this.survey.cancelPreviewByPage(this);
  }
  public get cssTitle(): string {
    return this.getCssTitle(this.cssClasses.panel);
  }
  public get cssError(): string {
    return this.getCssError(this.cssClasses);
  }
  public get showErrorsAbovePanel(): boolean {
    return this.isDefaultV2Theme;
  }
  protected getCssError(cssClasses: any): string {
    const isDefaultV2Theme = this.isDefaultV2Theme;
    const builder = new CssClassBuilder()
      .append(this.cssClasses.error.root)
      .append(this.cssClasses.error.outsideQuestion, isDefaultV2Theme)
      .append(this.cssClasses.error.aboveQuestion, isDefaultV2Theme);
    return builder.append("panel-error-root", builder.isEmpty()).toString();
  }
  protected onVisibleChanged() {
    super.onVisibleChanged();
    this.notifySurveyOnVisibilityChanged();
  }
  public needResponsiveWidth() {
    if (!this.startWithNewLine) {
      return true;
    }
    else {
      return super.needResponsiveWidth();
    }
  }
  public focusIn(): void {
    if(!this.survey) return;
    (this.survey as SurveyModel).whenPanelFocusIn(this);
  }
  protected getHasFrameV2(): boolean {
    return super.getHasFrameV2() && (!(<any>this).originalPage || (<any>this.survey).isShowingPreview);
  }
  protected getIsNested(): boolean {
    return super.getIsNested() && this.parent !== undefined;
  }
  protected getCssRoot(cssClasses: { [index: string]: string }): string {
    return new CssClassBuilder()
      .append(super.getCssRoot(cssClasses))
      .append(cssClasses.container)
      .append(cssClasses.asPage, !!(<any>this).originalPage && !(<any>this.survey).isShowingPreview)
      .append(cssClasses.invisible, !this.isDesignMode && this.areInvisibleElementsShowing && !this.visible)
      .toString();
  }
  public getContainerCss() {
    return this.getCssRoot(this.cssClasses.panel);
  }
}

Serializer.addClass(
  "panelbase",
  [
    "name",
    {
      name: "elements",
      alternativeName: "questions",
      baseClassName: "question",
      visible: false,
      isLightSerializable: false,
    },
    { name: "visible:switch", default: true },
    "visibleIf:condition",
    "enableIf:condition",
    "requiredIf:condition",
    "readOnly:boolean",
    {
      name: "questionTitleLocation",
      default: "default",
      choices: ["default", "top", "bottom", "left", "hidden"],
    },
    { name: "title:text", serializationProperty: "locTitle" },
    { name: "description:text", serializationProperty: "locDescription" },
    {
      name: "questionsOrder",
      default: "default",
      choices: ["default", "initial", "random"],
    },

  ],
  function () {
    return new PanelModelBase();
  }
);

Serializer.addClass(
  "panel",
  [
    {
      name: "state",
      default: "default",
      choices: ["default", "collapsed", "expanded"],
    },
    "isRequired:switch",
    {
      name: "requiredErrorText:text",
      serializationProperty: "locRequiredErrorText",
    },
    { name: "startWithNewLine:boolean", default: true },
    "width",
    { name: "minWidth", defaultFunc: () => "auto" },
    { name: "maxWidth", defaultFunc: () => settings.maxWidth },
    { name: "innerIndent:number", default: 0, choices: [0, 1, 2, 3] },
    { name: "indent:number", default: 0, choices: [0, 1, 2, 3] },
    {
      name: "page",
      isSerializable: false,
      visibleIf: function (obj: any) {
        var survey = obj ? obj.survey : null;
        return !survey || !survey.pages || survey.pages.length > 1;
      },
      choices: function (obj: any) {
        var survey = obj ? obj.survey : null;
        return survey
          ? survey.pages.map((p: any) => {
            return { value: p.name, text: p.title };
          })
          : [];
      },
    },
    "showNumber:boolean",
    {
      name: "showQuestionNumbers",
      default: "default",
      choices: ["default", "onpanel", "off"],
    },
    "questionStartIndex",
    { name: "allowAdaptiveActions:boolean", default: true, visible: false },
  ],
  function () {
    return new PanelModel();
  },
  "panelbase"
);

ElementFactory.Instance.registerElement("panel", (name) => {
  return new PanelModel(name);
});
