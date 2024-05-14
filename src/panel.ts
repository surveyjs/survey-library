import { property, Serializer } from "./jsonobject";
import { HashTable, Helpers } from "./helpers";
import { Base } from "./base";
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
import { ElementFactory, QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { OneAnswerRequiredError } from "./error";
import { settings } from "./settings";
import { findScrollableParent, getElementWidth, isElementVisible } from "./utils/utils";
import { SurveyError } from "./survey-error";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { IAction } from "./actions/action";
import { ActionContainer } from "./actions/container";
import { SurveyModel } from "./survey";
import { DragDropPanelHelperV1 } from "./drag-drop-panel-helper-v1";
import { DragDropInfo } from "./drag-drop-helper-v1";
import { AnimationGroup, IAnimationConsumer } from "./utils/animation";
import { DomDocumentHelper, DomWindowHelper } from "./global_variables_utils";
import { PageModel } from "./page";

export class QuestionRowModel extends Base {
  private static rowCounter = 100;
  private static getRowId(): string {
    return "pr_" + QuestionRowModel.rowCounter++;
  }
  protected _scrollableParent: any = undefined;
  protected _updateVisibility: any = undefined;
  public startLazyRendering(rowContainerDiv: HTMLElement, findScrollableContainer = findScrollableParent): void {
    if (!DomDocumentHelper.isAvailable()) return;
    this._scrollableParent = findScrollableContainer(rowContainerDiv);
    // if  this._scrollableParent is html the scroll event isn't fired, so we should use window
    if (this._scrollableParent === DomDocumentHelper.getDocumentElement()) {
      this._scrollableParent = DomWindowHelper.getWindow();
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
  protected equalsCore(obj: Base): boolean {
    return this == obj;
  }
  public get elements(): Array<IElement> {
    return this.getPropertyValue("elements");
  }
  protected getIsAnimationAllowed(): boolean {
    return super.getIsAnimationAllowed() && this.visible && this.panel?.animationAllowed;
  }
  private getVisibleElementsAnimationOptions(): IAnimationConsumer<[IElement]> {
    const beforeRunAnimation = (el: HTMLElement) => {
      el.style.setProperty("--animation-height", el.offsetHeight + "px");
      el.style.setProperty("--animation-width", getElementWidth(el) + "px");
    };
    return {
      isAnimationEnabled: () => this.animationAllowed,
      getAnimatedElement: (element: IElement) => (element as any as SurveyElement).getWrapperElement(),
      getLeaveOptions: (element: IElement) => {
        const surveyElement = element as unknown as SurveyElement;
        const cssClasses = element.isPanel ? surveyElement.cssClasses.panel : surveyElement.cssClasses;
        return {
          cssClass: cssClasses.fadeOut,
          onBeforeRunAnimation: beforeRunAnimation
        };
      },
      getEnterOptions: (element: IElement) => {
        const surveyElement = element as unknown as SurveyElement;
        const cssClasses = element.isPanel ? surveyElement.cssClasses.panel : surveyElement.cssClasses;
        return {
          cssClass: cssClasses.fadeIn,
          onBeforeRunAnimation: beforeRunAnimation
        };
      }
    };
  }
  public visibleElementsAnimation: AnimationGroup<IElement> = new AnimationGroup(this.getVisibleElementsAnimationOptions(), (value) => {
    this.setPropertyValue("visibleElements", value);
    this.setWidth();
  }, () => this.visibleElements);
  public set visibleElements(val: Array<IElement>) {
    if(!val.length) {
      this.visible = false;
      this.visibleElementsAnimation.cancel();
      return;
    } else {
      this.visible = true;
    }
    this.visibleElementsAnimation.sync(val);
  }
  public get visibleElements(): Array<IElement> {
    return this.getPropertyValue("visibleElements");
  }

  public onVisibleChangedCallback: () => void;
  public get visible(): boolean {
    return this.getPropertyValue("visible", true);
  }
  public set visible(val: boolean) {
    this.setPropertyValue("visible", val);
    this.onVisibleChangedCallback && this.onVisibleChangedCallback();
  }
  public get isNeedRender(): boolean {
    return this.getPropertyValue("isneedrender", true);
  }
  public set isNeedRender(val: boolean) {
    this.setPropertyValue("isneedrender", val);
  }

  public updateVisible() {
    var visElements: Array<IElement> = [];
    for (var i = 0; i < this.elements.length; i++) {
      if (this.elements[i].isVisible) {
        visElements.push(this.elements[i]);
      }
    }
    this.visibleElements = visElements;
    return;
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
  @property({ defaultValue: null }) dragTypeOverMe: DragTypeOverMeEnum;
  public dispose(): void {
    super.dispose();
    this.stopLazyRendering();
  }
  public getRowCss() {
    return new CssClassBuilder()
      .append(this.panel.cssClasses.row)
      .append(this.panel.cssClasses.rowCompact, this.panel["isCompact"])
      .append(this.panel.cssClasses.pageRow, this.panel.isPage || (this.panel as PanelModel).showPanelAsPage)
      .append(this.panel.cssClasses.rowMultiple, this.visibleElements.length > 1)
      .toString();
  }
  private rootElement?: HTMLElement;
  public setRootElement(element?: HTMLElement) {
    this.rootElement = element;
  }
  public getRootElement(): HTMLElement {
    return this.rootElement;
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

  public onAddRow(row: QuestionRowModel): void {
    this.onRowVisibleChanged();
    row.onVisibleChangedCallback = () => this.onRowVisibleChanged();
  }
  private getRowsAnimationOptions(): IAnimationConsumer<[QuestionRowModel]> {
    const beforeRunAnimation = (el: HTMLElement) => {
      el.style.setProperty("--animation-height", el.offsetHeight + "px");
    };
    return {
      isAnimationEnabled: () => this.animationAllowed,
      getAnimatedElement: (row: QuestionRowModel) => row.getRootElement(),
      getLeaveOptions: (_: QuestionRowModel) => {
        return { cssClass: this.cssClasses.rowFadeOut,
          onBeforeRunAnimation: beforeRunAnimation
        };
      },
      getEnterOptions: (_: QuestionRowModel) => {
        return {
          cssClass: this.cssClasses.rowFadeIn,
          onBeforeRunAnimation: beforeRunAnimation
        };
      }
    };
  }
  private rowsAnimation: AnimationGroup<QuestionRowModel> = new AnimationGroup(this.getRowsAnimationOptions(), (value) => {
    this.setPropertyValue("visibleRows", value);
  }, () => this.visibleRows)
  get visibleRows(): Array<QuestionRowModel> {
    return this.getPropertyValue("visibleRows");
  }
  set visibleRows(val: Array<QuestionRowModel>) {
    this.rowsAnimation.sync(val);
  }

  public onRemoveRow(row: QuestionRowModel): void {
    row.visibleElementsAnimation.cancel();
    this.visibleRows = this.rows.filter(row => row.visible);
    row.onVisibleChangedCallback = undefined;
  }
  onRowVisibleChanged() {
    this.visibleRows = this.rows.filter(row => row.visible);
  }
  constructor(name: string = "") {
    super(name);
    this.createNewArray("rows", (el: QuestionRowModel, index: number) => { this.onAddRow(el); }, (el: QuestionRowModel) => { this.onRemoveRow(el); });
    this.createNewArray("visibleRows");

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
    this.createLocalizableString("navigationTitle", this, true).onGetTextCallback = (text: string) => {
      return text || this.title || this.name;
    };
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
    this.blockAnimations();
    super.setSurveyImpl(value, isLight);
    if (this.isDesignMode) this.onVisibleChanged();
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].setSurveyImpl(value, isLight);
    }
    this.releaseAnimations();
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
      (this.canShowTitle() && this.locTitle.textOrHtml.length > 0) ||
      (this.isDesignMode && (this.showTitle && settings.designMode.showEmptyTitles))
    );
  }
  public delete(doDispose: boolean = true): void {
    this.removeFromParent();
    if(doDispose) {
      this.dispose();
    }
  }
  protected removeFromParent(): void {}
  protected canShowTitle(): boolean { return true; }
  @property({ defaultValue: true }) showDescription: boolean;
  get _showDescription(): boolean {
    if(!this.hasTitle && this.isDesignMode) return false;
    return this.survey && (<any>this.survey).showPageTitles && this.hasDescription ||
      (this.showDescription && this.isDesignMode &&
        settings.designMode.showEmptyDescriptions);
  }
  public localeChanged(): void {
    super.localeChanged();
    for (var i = 0; i < this.elements.length; i++) {
      (<Base>(<any>this.elements[i])).localeChanged();
    }
  }
  public locStrsChanged(): void {
    super.locStrsChanged();
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].locStrsChanged();
    }
  }
  getMarkdownHtml(text: string, name: string): string {
    if(name === "navigationTitle" && this.locNavigationTitle.isEmpty) {
      return this.locTitle.renderedHtml || this.name;
    }
    return super.getMarkdownHtml(text, name);
  }
  public get locNavigationTitle(): LocalizableString {
    return this.getLocalizableString("navigationTitle");
  }
  public get renderedNavigationTitle(): string {
    return this.locNavigationTitle.renderedHtml;
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
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
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
    var classes = { panel: {}, error: {}, row: "", rowFadeIn: "", rowFadeOut: "", rowFadeOutActive: "", rowMultiple: "", pageRow: "", rowCompact: "" };
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
    if (!!css.rowFadeIn) {
      classes.rowFadeIn = css.rowFadeIn;
    }
    if (!!css.rowFadeOut) {
      classes.rowFadeOut = css.rowFadeOut;
    }
    if (!!css.rowFadeOutActive) {
      classes.rowFadeOutActive = css.rowFadeOutActive;
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
  public getQuestions(includeNested: boolean): Array<Question> {
    const res = this.questions;
    if(!includeNested) return res;
    const res2: Array<Question> = [];
    res.forEach(q => {
      res2.push(q);
      q.getNestedQuestions().forEach(nQ => res2.push(nQ));
    });
    return res2;
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
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
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
   * @param fireCallback *(Optional)* Pass `false` if you do not want to show validation errors in the UI.
   * @param focusOnFirstError *(Optional)* Pass `true` if you want to focus the first question with a validation error.
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
    if (rec.focuseOnFirstError && rec.firstErrorQuestion) {
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
  public onSurveyLoad(): void {
    this.blockAnimations();
    super.onSurveyLoad();
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].onSurveyLoad();
    }
    this.onElementVisibilityChanged(this);
    this.releaseAnimations();
  }
  public onFirstRendering(): void {
    super.onFirstRendering();
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].onFirstRendering();
    }
    this.onRowsChanged();
  }
  public updateRows(): void {
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
    this.blockAnimations();
    this.setArrayPropertyDirectly("rows", this.buildRows());
    this.releaseAnimations();
  }

  private locCountRowUpdates = 0;
  private blockRowsUpdates() {
    this.locCountRowUpdates++;
  }
  private releaseRowsUpdates() {
    this.locCountRowUpdates--;
  }
  private updateRowsBeforeElementRemoved(element: IElement): void {
    const elementRow = this.findRowByElement(element);
    const elementRowIndex = this.rows.indexOf(elementRow);
    const elementIndexInRow = elementRow.elements.indexOf(element);
    elementRow.elements.splice(elementIndexInRow, 1);
    if(elementRow.elements.length == 0) {
      this.rows.splice(elementRowIndex, 1);
    } else if(!elementRow.elements[0].startWithNewLine && this.rows[elementRowIndex - 1]) {
      elementRow.elements.forEach(el => this.rows[elementRowIndex - 1].addElement(el));
      this.rows.splice(elementRowIndex, 1);
    }
    else {
      elementRow.updateVisible();
    }
  }
  private updateRowsOnElementAdded(element: IElement): void {
    const index = this.elements.indexOf(element);
    const targetElement = this.elements[index + 1];
    const createRowAtIndex = (index: number) => {
      const row = this.createRowAndSetLazy(index);
      if(this.isDesignModeV2) {
        row.setIsLazyRendering(false);
      }
      this.rows.splice(index, 0, row);
      return row;
    };
    const updateRow = (row: QuestionRowModel, start: number, deleteCount: number, ...elements: IElement[]) => {
      const removedElements = row.elements.splice(start, deleteCount, ...elements);
      row.updateVisible();
      return removedElements;
    };
    if(!targetElement) {
      if(index == 0 || element.startWithNewLine) {
        updateRow(createRowAtIndex(this.rows.length), 0, 0, element);
      } else {
        this.rows[this.rows.length - 1].addElement(element);
      }
      return;
    }
    const targetRow = this.findRowByElement(targetElement);
    if(!targetRow) return;
    const targetRowIndex = this.rows.indexOf(targetRow);
    const targetElementIndexInRow = targetRow.elements.indexOf(targetElement);
    if(targetElementIndexInRow == 0) {
      if(!targetElement.startWithNewLine) {
        updateRow(targetRow, 0, 0, element);
      }
      else if(element.startWithNewLine || targetRowIndex < 1) {
        createRowAtIndex(targetRowIndex).addElement(element);
      } else {
        this.rows[targetRowIndex - 1].addElement(element);
      }
    } else {
      if(element.startWithNewLine) {
        updateRow(createRowAtIndex(targetRowIndex + 1), 0, 0, ...[element].concat(updateRow(targetRow, targetElementIndexInRow, targetRow.elements.length)));
      } else {
        updateRow(targetRow, targetElementIndexInRow, 0, element);
      }
    }
  }
  protected onAddElement(element: IElement, index: number): void {
    element.setSurveyImpl(this.surveyImpl);
    element.parent = this;
    this.markQuestionListDirty();
    if (this.canBuildRows()) {
      this.updateRowsOnElementAdded(element);
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
    if(this.locCountRowUpdates > 0) return;
    this.updateRowsBeforeElementRemoved(element);
    this.updateRowsOnElementAdded(element);
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
      rowIndex >= this.survey.lazyRenderingFirstBatchSize ||
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
      this.blockRowsUpdates();
      row.elements[0].startWithNewLine = true;
      this.releaseRowsUpdates();
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
  public onHidingContent(): void {
    this.questions.forEach(q => q.onHidingContent());
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
        const q = questions[i];
        if (!isVisible) {
          q.clearValueIfInvisible("onHiddenContainer");
          q.onHidingContent();
        } else {
          q.updateValueWithDefaults();
        }
      }
    }
  }
  protected notifyStateChanged(prevState: string): void {
    super.notifyStateChanged(prevState);
    if(this.isCollapsed) {
      this.questions.forEach(q => q.onHidingContent());
    }
    if(this.survey != null && !this.isLoadingFromJson && this.isExpanded && prevState === "collapsed") {
      const q = this.getFirstQuestionToFocus(false);
      if(!!q) {
        setTimeout(() => {
          if(!this.isDisposed && !!this.survey) {
            this.survey.scrollElementToTop(q, q, null, q.inputId, false);
          }
        }, 15);
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
  getIsContentVisible(exceptionQuestion?: IQuestion) {
    if(this.areInvisibleElementsShowing) return true;
    for (var i = 0; i < this.elements.length; i++) {
      if (this.elements[i] == exceptionQuestion) continue;
      if (this.elements[i].isVisible) return true;
    }
    return false;
  }
  getIsPageVisible(exceptionQuestion?: IQuestion): boolean {
    return this.visible && this.getIsContentVisible(exceptionQuestion);
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
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
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
    if(this.wasRendered) {
      element.onFirstRendering();
    }
    return true;
  }
  public insertElement(element: IElement, dest?: IElement, location: "bottom" | "top" | "left" | "right" = "bottom"): void {
    if(!dest) {
      this.addElement(element);
      return;
    }
    this.blockRowsUpdates();
    let index = this.elements.indexOf(dest);
    const destRow = this.findRowByElement(dest);
    if(location == "left" || location == "right") {
      if(location == "right") {
        element.startWithNewLine = false;
        index++;
      }
      else {
        if(destRow.elements.indexOf(dest) == 0) {
          dest.startWithNewLine = false;
          element.startWithNewLine = true;
        } else {
          element.startWithNewLine = false;
        }
      }
    }
    else {
      element.startWithNewLine = true;
      if(location == "top") {
        index = this.elements.indexOf(destRow.elements[0]);
      } else {
        index = this.elements.indexOf(destRow.elements[destRow.elements.length - 1]) + 1;
      }
    }
    this.releaseRowsUpdates();
    this.addElement(element, index);
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
   * @see elementsup
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
  onAnyValueChanged(name: string, questionName: string): void {
    var els = this.elements;
    for (var i = 0; i < els.length; i++) {
      els[i].onAnyValueChanged(name, questionName);
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
  /**
   * Specifies the error message position for questions that belong to this page/panel.
   *
   * Use this property to override the [`questionErrorLocation`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionErrorLocation) property specified for the survey. You can also set the [`errorLocation`](https://surveyjs.io/form-library/documentation/question#errorLocation) property for individual questions.
   *
   * Possible values:
   *
   * - `"default"` (default) - Inherits the setting from the `questionErrorLocation` property specified for the survey.
   * - `"top"` - Displays error messages above questions.
   * - `"bottom"` - Displays error messages below questions.
   */
  public get questionErrorLocation(): string {
    return this.getPropertyValue("questionErrorLocation");
  }
  public set questionErrorLocation(val: string) {
    this.setPropertyValue("questionErrorLocation", val);
  }
  public getQuestionErrorLocation(): string {
    if(this.questionErrorLocation !== "default") return this.questionErrorLocation;
    if(this.parent) return this.parent.getQuestionErrorLocation();
    return this.survey ? this.survey.questionErrorLocation : "top";
  }
  //ITitleOwner
  public get no(): string { return ""; }

  public get cssError(): string {
    return this.getCssError(this.cssClasses);
  }
  protected getCssError(cssClasses: any): string {
    return new CssClassBuilder().append(cssClasses.error.root).toString();
  }

  public dispose(): void {
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
  protected removeFromParent(): void {
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
  protected setNo(visibleIndex: number): void {
    this.setPropertyValue(
      "no",
      Helpers.getNumberByIndex(this.visibleIndex, this.getStartIndex())
    );
  }
  protected notifyStateChanged(prevState: string): void {
    if(!this.isLoadingFromJson) {
      this.locTitle.strChanged();
    }
    super.notifyStateChanged(prevState);
  }
  protected createLocTitleProperty(): LocalizableString {
    const locTitleValue = super.createLocTitleProperty();
    locTitleValue.onGetTextCallback = (text: string): string => {
      if (!text && (this.state !== "default")) {
        text = this.name;
      }
      return text;
    };
    return locTitleValue;
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

  public onGetFooterActionsCallback: () => Array<IAction>;
  public onGetFooterToolbarCssCallback: () => string;
  public getFooterToolbar(): ActionContainer {
    if (!this.footerToolbarValue) {
      var actions = this.footerActions;
      if (this.hasEditButton) {
        actions.push({
          id: "cancel-preview",
          locTitle: this.survey.locEditText,
          innerCss: this.survey.cssNavigationEdit,
          component: "sv-nav-btn",
          action: () => { this.cancelPreview(); }
        });
      }
      if(!!this.onGetFooterActionsCallback) {
        actions = this.onGetFooterActionsCallback();
      } else {
        actions = this.survey?.getUpdatedPanelFooterActions(this, actions);
      }
      this.footerToolbarValue = this.createActionContainer(this.allowAdaptiveActions);
      let footerCss = this.onGetFooterToolbarCssCallback ? this.onGetFooterToolbarCssCallback() : "";
      if(!footerCss) {
        footerCss = this.cssClasses.panel?.footer;
      }
      if(footerCss) {
        this.footerToolbarValue.containerCss = footerCss;
      }
      this.footerToolbarValue.setItems(actions);
    }
    return this.footerToolbarValue;
  }
  public get hasEditButton(): boolean {
    if (this.survey && this.survey.state === "preview") return (this.parent && this.parent instanceof PageModel);
    return false;
  }
  public cancelPreview() {
    if (!this.hasEditButton) return;
    this.survey.cancelPreviewByPage(this);
  }
  public get cssTitle(): string {
    return this.getCssTitle(this.cssClasses.panel);
  }
  public get showErrorsAbovePanel(): boolean {
    return this.isDefaultV2Theme && !this.showPanelAsPage;
  }
  protected getCssError(cssClasses: any): string {
    const builder = new CssClassBuilder()
      .append(super.getCssError(cssClasses))
      .append(cssClasses.panel.errorsContainer);
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
    return super.getHasFrameV2() && !this.showPanelAsPage;
  }
  protected getIsNested(): boolean {
    return super.getIsNested() && this.parent !== undefined;
  }
  public get showPanelAsPage(): boolean {
    const panel = <any>this;
    if (!!panel.originalPage) return true;
    return panel.survey.isShowingPreview && panel.survey.isSinglePage && !!panel.parent && !!panel.parent.originalPage;
  }
  protected getCssRoot(cssClasses: { [index: string]: string }): string {
    return new CssClassBuilder()
      .append(super.getCssRoot(cssClasses))
      .append(cssClasses.container)
      .append(cssClasses.asPage, this.showPanelAsPage)
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
    { name: "visible:switch", default: true, overridingProperty: "visibleIf" },
    { name: "readOnly:boolean", overridingProperty: "enableIf" },
    "visibleIf:condition",
    "enableIf:condition",
    "requiredIf:condition",
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
    { name: "questionErrorLocation", default: "default", choices: ["default", "top", "bottom"] }
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
    { name: "isRequired:switch", overridingProperty: "requiredIf" },
    {
      name: "requiredErrorText:text",
      serializationProperty: "locRequiredErrorText",
    },
    { name: "startWithNewLine:boolean", default: true },
    "width",
    { name: "minWidth", defaultFunc: () => "auto" },
    { name: "maxWidth", defaultFunc: () => settings.maxWidth },
    { name: "innerIndent:number", default: 0, choices: [0, 1, 2, 3] },
    { name: "indent:number", default: 0, choices: [0, 1, 2, 3], visible: false },
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
