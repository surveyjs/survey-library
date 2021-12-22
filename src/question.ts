import { HashTable, Helpers } from "./helpers";
import { JsonObject, Serializer, property } from "./jsonobject";
import { Base, EventBase } from "./base";
import { IElement, IQuestion, IPanel, IConditionRunner, ISurveyImpl, IPage, ITitleOwner, IProgressInfo, ISurvey } from "./base-interfaces";
import { SurveyElement } from "./survey-element";
import { surveyLocalization } from "./surveyStrings";
import { AnswerRequiredError, CustomError } from "./error";
import { SurveyValidator, IValidatorOwner, ValidatorRunner } from "./validator";
import { TextPreProcessor, TextPreProcessorValue } from "./textPreProcessor";
import { LocalizableString } from "./localizablestring";
import { ConditionRunner, ExpressionRunner } from "./conditions";
import { QuestionCustomWidget } from "./questionCustomWidgets";
import { CustomWidgetCollection } from "./questionCustomWidgets";
import { settings } from "./settings";
import { SurveyModel } from "./survey";
import { PanelModel } from "./panel";
import { RendererFactory } from "./rendererFactory";
import { SurveyError } from "./survey-error";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { increaseHeightByContent } from "./utils/utils";

export interface IConditionObject {
  name: string;
  text: string;
  question: Question;
}

/**
 * A base class for all questions.
 */
export class Question extends SurveyElement
  implements IQuestion, IConditionRunner, IValidatorOwner, ITitleOwner {
  [index: string]: any;
  private static TextPreprocessorValuesMap = {
    title: "processedTitle",
    require: "requiredText",
  };
  private static questionCounter = 100;
  private static getQuestionId(): string {
    return "sq_" + Question.questionCounter++;
  }
  private conditionRunner: ConditionRunner = null;
  private isCustomWidgetRequested: boolean;
  private customWidgetValue: QuestionCustomWidget;
  customWidgetData = { isNeedRender: true };
  focusCallback: () => void;
  surveyLoadCallback: () => void;
  displayValueCallback: (text: string) => string;

  private textPreProcessor: TextPreProcessor;
  private conditionEnabelRunner: ConditionRunner;
  private conditionRequiredRunner: ConditionRunner;
  valueChangedCallback: () => void;
  commentChangedCallback: () => void;
  validateValueCallback: () => SurveyError;
  questionTitleTemplateCallback: () => string;
  afterRenderQuestionCallback: (question: Question, element: any) => any;
  valueFromDataCallback: (val: any) => any;
  valueToDataCallback: (val: any) => any;
  onGetSurvey: () => ISurvey;
  private locProcessedTitle: LocalizableString;
  protected isReadyValue: boolean = true;
  private commentElement: HTMLElement;

  /**
   * The event is fired when isReady property of question is changed.
   * <br/> options.question - the question
   * <br/> options.isReady - current value of isReady
   * <br/> options.oldIsReady - old value of isReady
   */
  public onReadyChanged: EventBase<Question> = this.addEvent<Question>();

  public isReadOnlyRenderDiv(): boolean {
    return this.isReadOnly && settings.readOnlyCommentRenderMode === "div";
  }

  constructor(name: string) {
    super(name);
    this.id = Question.getQuestionId();
    this.onCreating();
    this.createNewArray("validators", (validator: any) => {
      validator.errorOwner = this;
    });
    this.createLocalizableString("commentText", this, true, "otherItemText");
    this.locTitle.onGetDefaultTextCallback = (): string => {
      return this.name;
    };
    this.createLocalizableString("requiredErrorText", this);
    this.registerFunctionOnPropertyValueChanged("width", () => {
      this.updateQuestionCss();
      if (!!this.parent) {
        this.parent.elementWidthChanged(this);
      }
    });
    this.registerFunctionOnPropertyValueChanged("isRequired", () => {
      this.locTitle.onChanged();
      this.clearCssClasses();
    });
    this.registerFunctionOnPropertiesValueChanged(
      ["indent", "rightIndent"],
      () => {
        this.onIndentChanged();
      }
    );

    this.registerFunctionOnPropertiesValueChanged(
      ["hasComment", "hasOther"],
      () => {
        this.initCommentFromSurvey();
      }
    );
  }
  protected createLocTitleProperty(): LocalizableString {
    const locTitleValue = super.createLocTitleProperty();
    locTitleValue.onGetTextCallback = (text: string): string => {
      if (!text) {
        text = this.name;
      }
      if (!this.survey) return text;
      return this.survey.getUpdatedQuestionTitle(this, text);
    };
    this.locProcessedTitle = new LocalizableString(this, true);
    this.locProcessedTitle.sharedData = locTitleValue;
    return locTitleValue;
  }

  public getSurvey(live: boolean = false): ISurvey {
    if (live) {
      return !!this.parent ? (<Base>(<any>this.parent)).getSurvey(live) : null;
    }
    if (!!this.onGetSurvey) return this.onGetSurvey();
    return super.getSurvey();
  }
  public getValueName(): string {
    if (!!this.valueName) return this.valueName.toString();
    return this.name;
  }
  /**
   * Use this property if you want to store the question result in the name different from the question name.
   * Question name should be unique in the survey and valueName could be not unique. It allows to share data between several questions with the same valueName.
   * The library set the value automatically if the question.name property is not valid. For example, if it contains the period '.' symbol.
   * In this case if you set the question.name property to 'x.y' then the valueName becomes 'x y'.
   * Please note, this property is hidden for questions without input, for example html question.
   * @see name
   */
  public get valueName(): string {
    return this.getPropertyValue("valueName", "");
  }
  public set valueName(val: string) {
    var oldValueName = this.getValueName();
    this.setPropertyValue("valueName", val);
    this.onValueNameChanged(oldValueName);
  }
  protected onValueNameChanged(oldValue: string): void {
    if (!this.survey) return;
    this.survey.questionRenamed(
      this,
      this.name,
      !!oldValue ? oldValue : this.name
    );
    this.initDataFromSurvey();
  }
  protected onNameChanged(oldValue: string): void {
    this.locTitle.onChanged();
    if (!this.survey) return;
    this.survey.questionRenamed(
      this,
      oldValue,
      this.valueName ? this.valueName : oldValue
    );
  }
  public get isReady(): boolean {
    return this.isReadyValue;
  }

  /**
   * A11Y properties
   */
  public get ariaRequired() {
    return this.isRequired ? "true" : "false";
  }
  public get ariaLabel(): string {
    return this.locTitle.renderedHtml;
  }
  public get ariaInvalid() {
    return this.errors.length > 0 ? "true" : "false";
  }
  public get ariaDescribedBy(): string {
    return this.errors.length > 0 ? this.id + "_errors" : null;
  }

  /**
   * Get is question ready to use
   */
  public choicesLoaded(): void { }
  /**
   * Get/set the page where the question is located.
   */
  public get page(): IPage {
    return this.getPage(this.parent);
  }
  public set page(val: IPage) {
    this.setPage(this.parent, val);
  }
  public getPanel(): IPanel {
    return null;
  }
  public delete(): void {
    if (!!this.parent) {
      this.removeSelfFromList(this.parent.elements);
    }
  }
  public get isFlowLayout(): boolean {
    return this.getLayoutType() === "flow";
  }
  public getLayoutType(): string {
    if (!!this.parent) return this.parent.getChildrenLayoutType();
    return "row";
  }
  isLayoutTypeSupported(layoutType: string): boolean {
    return layoutType !== "flow";
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
    this.notifySurveyVisibilityChanged();
  }
  protected onVisibleChanged(): void {
    this.setPropertyValue("isVisible", this.isVisible);
    if (this.isVisible && this.survey && this.survey.isClearValueOnHidden) {
      this.updateValueWithDefaults();
    }
    if (!this.isVisible && this.errors && this.errors.length > 0) {
      this.errors = [];
    }
  }
  /**
   * Use it to choose how other question values will be rendered in title if referenced in {}.
   * Please note, this property is hidden for question without input, for example html question.
   */
  public get useDisplayValuesInTitle(): boolean {
    return this.getPropertyValue("useDisplayValuesInTitle");
  }
  public set useDisplayValuesInTitle(val: boolean) {
    this.setPropertyValue("useDisplayValuesInTitle", val);
  }
  protected getUseDisplayValuesInTitle(): boolean { return this.useDisplayValuesInTitle; }
  /**
   * An expression that returns true or false. If it returns true the Question becomes visible and if it returns false the Question becomes invisible. The library runs the expression on survey start and on changing a question value. If the property is empty then visible property is used.
   * @see visible
   */
  public get visibleIf(): string {
    return this.getPropertyValue("visibleIf", "");
  }
  public set visibleIf(val: string) {
    this.setPropertyValue("visibleIf", val);
    this.runConditions();
  }
  /**
   * Returns true if the question is visible or survey is in design mode right now.
   */
  public get isVisible(): boolean {
    if (this.survey && this.survey.areEmptyElementsHidden && this.isEmpty())
      return false;
    return this.visible || this.areInvisibleElementsShowing;
  }
  /**
   * Returns the visible index of the question in the survey. It can be from 0 to all visible questions count - 1
   * The visibleIndex is -1 if the title is 'hidden' or hideNumber is true
   * @see titleLocation
   * @see hideNumber
   */
  public get visibleIndex(): number {
    return this.getPropertyValue("visibleIndex", -1);
  }
  /**
   * Set hideNumber to true to stop showing the number for this question. The question will not be counter
   * @see visibleIndex
   * @see titleLocation
   */
  public get hideNumber(): boolean {
    return this.getPropertyValue("hideNumber");
  }
  public set hideNumber(val: boolean) {
    this.setPropertyValue("hideNumber", val);
    this.notifySurveyVisibilityChanged();
  }
  /**
   * Returns true if the question may have a title located on the left
   */
  public get isAllowTitleLeft(): boolean {
    return true;
  }
  /**
   * Returns the type of the object as a string as it represents in the json.
   */
  public getType(): string {
    return "question";
  }
  public get isQuestion(): boolean {
    return true;
  }
  /**
   * Move question to a new container Page/Panel. Add as a last element if insertBefore parameter is not used or inserted into the given index,
   * if insert parameter is number, or before the given element, if the insertBefore parameter is a question or panel
   * @param container Page or Panel to where a question is relocated.
   * @param insertBefore Use it if you want to set the question to a specific position. You may use a number (use 0 to insert int the beginning) or element, if you want to insert before this element.
   */
  public moveTo(container: IPanel, insertBefore: any = null): boolean {
    return this.moveToBase(this.parent, container, insertBefore);
  }
  public getProgressInfo(): IProgressInfo {
    if (!this.hasInput) return super.getProgressInfo();
    return {
      questionCount: 1,
      answeredQuestionCount: !this.isEmpty() ? 1 : 0,
      requiredQuestionCount: this.isRequired ? 1 : 0,
      requiredAnsweredQuestionCount: !this.isEmpty() && this.isRequired ? 1 : 0,
    };
  }
  private runConditions() {
    if (this.data && !this.isLoadingFromJson) {
      if (!this.isDesignMode) {
        this.runCondition(
          this.getDataFilteredValues(),
          this.getDataFilteredProperties()
        );
      }
      this.locStrsChanged();
    }
  }
  public setSurveyImpl(value: ISurveyImpl, isLight?: boolean): void {
    super.setSurveyImpl(value);
    if (!this.survey) return;
    this.survey.questionCreated(this);
    if (isLight !== true) {
      this.runConditions();
    }
  }
  public getDataFilteredValues(): any {
    return !!this.data ? this.data.getFilteredValues() : null;
  }
  public getDataFilteredProperties(): any {
    var props = !!this.data ? this.data.getFilteredProperties() : {};
    props.question = this;
    return props;
  }
  /**
   * A parent element. It can be panel or page.
   */
  public get parent(): IPanel {
    return this.getPropertyValue("parent", null);
  }
  public set parent(val: IPanel) {
    if (this.parent === val) return;
    this.delete();
    this.setPropertyValue("parent", val);
    this.updateQuestionCss();
    this.onParentChanged();
  }
  private parentQuestionValue: Question = null;
  /**
   * A parent question. It can be a dynamic panel or dynamic/dropdown matrices. If the value is a matrix, it means that question is a cell question.
   * This property is null for a stand alone question.
   */
  public get parentQuestion(): Question {
    return this.parentQuestionValue;
  }
  setParentQuestion(val: Question): void {
    this.parentQuestionValue = val;
    this.onParentQuestionChanged();
  }
  protected onParentQuestionChanged(): void { }
  protected onParentChanged(): void { }
  /**
   * Returns false if the question doesn't have a title property, for example: QuestionHtmlModel, or titleLocation property equals to "hidden"
   * @see titleLocation
   */
  public get hasTitle(): boolean {
    return this.getTitleLocation() !== "hidden";
  }
  /**
   * Set this property different from "default" to set the specific question title location for this panel/page.
   * Please note, this property is hidden for questions without input, for example html question.
   * @see SurveyModel.questionTitleLocation
   */
  public get titleLocation(): string {
    return this.getPropertyValue("titleLocation");
  }
  public set titleLocation(value: string) {
    var isVisibilityChanged =
      this.titleLocation == "hidden" || value == "hidden";
    this.setPropertyValue("titleLocation", value.toLowerCase());
    this.updateQuestionCss();
    if (isVisibilityChanged) {
      this.notifySurveyVisibilityChanged();
    }
  }
  public getTitleOwner(): ITitleOwner { return this; }
  private notifySurveyVisibilityChanged() {
    if (!this.survey || this.isLoadingFromJson) return;
    this.survey.questionVisibilityChanged(this, this.isVisible);
    if (this.survey.isClearValueOnHidden && !this.visible) {
      this.clearValue();
    }
  }
  /**
   * Return the title location based on question titleLocation property and QuestionTitleLocation of it's parents
   * @see titleLocation
   * @see PanelModelBase.QuestionTitleLocation
   * @see SurveyModel.QuestionTitleLocation
   */
  public getTitleLocation(): string {
    if (this.isFlowLayout) return "hidden";
    var location = this.getTitleLocationCore();
    if (location === "left" && !this.isAllowTitleLeft) location = "top";
    return location;
  }
  protected getTitleLocationCore(): string {
    if (this.titleLocation !== "default") return this.titleLocation;
    if (!!this.parent) return this.parent.getQuestionTitleLocation();
    if (!!this.survey) return this.survey.questionTitleLocation;
    return "top";
  }
  get hasTitleOnLeft(): boolean {
    return this.hasTitle && this.getTitleLocation() === "left";
  }
  get hasTitleOnTop(): boolean {
    return this.hasTitle && this.getTitleLocation() === "top";
  }
  get hasTitleOnBottom(): boolean {
    return this.hasTitle && this.getTitleLocation() === "bottom";
  }
  get hasTitleOnLeftTop(): boolean {
    if (!this.hasTitle) return false;
    const location = this.getTitleLocation();
    return location === "left" || location === "top";
  }
  public get errorLocation(): string {
    return this.survey ? this.survey.questionErrorLocation : "top";
  }
  /**
   * Returns false if the question doesn't have an input element, for example: QuestionHtmlModel
   * @see hasSingleInput
   */
  public get hasInput(): boolean {
    return true;
  }
  /**
   * Returns false if the question doesn't have an input element or have multiple inputs: matrices or panel dynamic
   * @see hasInput
   */
  public get hasSingleInput(): boolean {
    return this.hasInput;
  }
  public get inputId(): string {
    return this.id + "i";
  }
  protected getDefaultTitleValue(): string { return this.name; }
  protected getDefaultTitleTagName(): string {
    return settings.titleTags.question;
  }
  /**
   * Question description location. By default, value is "default" and it depends on survey questionDescriptionLocation property
   * You may change it to "underInput" to render it under question input or "underTitle" to rendered it under title.
   * @see description
   * @see Survey.questionDescriptionLocation
   */
  public get descriptionLocation(): string {
    return this.getPropertyValue("descriptionLocation");
  }
  public set descriptionLocation(val: string) {
    this.setPropertyValue("descriptionLocation", val);
  }
  get hasDescriptionUnderTitle(): boolean {
    return this.getDescriptionLocation() == "underTitle";
  }
  get hasDescriptionUnderInput(): boolean {
    return this.getDescriptionLocation() == "underInput";
  }
  private getDescriptionLocation() {
    if (this.descriptionLocation !== "default") return this.descriptionLocation;
    return !!this.survey
      ? this.survey.questionDescriptionLocation
      : "underTitle";
  }
  public get clickTitleFunction(): any {
    if (this.hasInput) {
      var self = this;
      return function () {
        if (self.isCollapsed) return;
        setTimeout(() => {
          self.focus();
        }, 1);
        return true;
      };
    }
    return undefined;
  }
  /**
   * The custom text that will be shown on required error. Use this property, if you do not want to show the default text.
   * Please note, this property is hidden for question without input, for example html question.
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
   * Use it to get or set the comment value.
   */
  public get commentText(): string {
    return this.getLocalizableStringText("commentText");
  }
  public set commentText(val: string) {
    this.setLocalizableStringText("commentText", val);
  }
  get locCommentText(): LocalizableString {
    return this.getLocalizableString("commentText");
  }
  /**
   *  Use this property to set the place holder text for comment field  .
   */
  @property({ localizable: true }) commentPlaceHolder: string;
  public get commentOrOtherPlaceHolder(): string {
    return this.otherPlaceHolder || this.commentPlaceHolder;
  }

  /**
   * Returns a copy of question errors survey. For some questions like matrix and panel dynamic it includes the errors of nested questions.
   */
  public getAllErrors(): Array<SurveyError> {
    return this.errors.slice();
  }
  public getErrorByType(errorType: string): SurveyError {
    for (let i = 0; i < this.errors.length; i++) {
      if (this.errors[i].getErrorType() === errorType) return this.errors[i];
    }
    return null;
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
  public updateCustomWidget(): void {
    this.customWidgetValue = CustomWidgetCollection.Instance.getCustomWidget(this);
  }
  public get isCompositeQuestion(): boolean {
    return false;
  }
  public updateCommentElement(): void {
    if (this.commentElement && this.autoGrowComment) increaseHeightByContent(this.commentElement);
  }
  public onCommentInput(event: any): void {
    if (this.isInputTextUpdate) {
      if(event.target) {
        this.comment = event.target.value;
      }
    }
    else {
      this.updateCommentElement();
    }
  }
  public onCommentChange(event: any): void {
    this.comment = event.target.value;
    if (this.comment !== event.target.value) {
      event.target.value = this.comment;
    }
  }
  public afterRenderQuestionElement(el: HTMLElement): void {
    if (!this.survey || !this.hasSingleInput) return;
    this.survey.afterRenderQuestionInput(this, el);
  }
  public afterRender(el: HTMLElement): void {
    if (!this.survey) return;
    this.survey.afterRenderQuestion(this, el);
    if (!!this.afterRenderQuestionCallback) {
      this.afterRenderQuestionCallback(this, el);
    }

    if (this.supportComment() || this.supportOther()) {
      this.commentElement = (document.getElementById(this.id) && document.getElementById(this.id).querySelector("textarea")) || null;
      this.updateCommentElement();
    }
  }
  public beforeDestroyQuestionElement(el: HTMLElement): void { }
  /**
   * Returns the rendred question title.
   */
  public get processedTitle(): string {
    var res = this.locProcessedTitle.textOrHtml;
    return res ? res : this.name;
  }
  /**
   * Returns the title after processing the question template.
   * @see SurveyModel.questionTitleTemplate
   */
  public get fullTitle(): string {
    return this.locTitle.renderedHtml;
  }
  protected get titlePattern(): string {
    return !!this.survey ? this.survey.questionTitlePattern : "numTitleRequire";
  }
  public get isRequireTextOnStart(): boolean {
    return this.isRequired && this.titlePattern == "requireNumTitle";
  }
  public get isRequireTextBeforeTitle(): boolean {
    return this.isRequired && this.titlePattern == "numRequireTitle" && this.requiredText !== "";
  }
  public get isRequireTextAfterTitle(): boolean {
    return this.isRequired && this.titlePattern == "numTitleRequire" && this.requiredText !== "";
  }
  /**
   * The Question renders on the new line if the property is true. If the property is false, the question tries to render on the same line/row with a previous question/panel.
   */
  public get startWithNewLine(): boolean {
    return this.getPropertyValue("startWithNewLine");
  }
  public set startWithNewLine(val: boolean) {
    if (this.startWithNewLine == val) return;
    this.setPropertyValue("startWithNewLine", val);
  }
  protected calcCssClasses(css: any): any {
    const classes = { error: {} };
    this.copyCssClasses(classes, css.question);
    this.copyCssClasses(classes.error, css.error);
    this.updateCssClasses(classes, css);
    if (this.survey) {
      this.survey.updateQuestionCssClasses(this, classes);
    }
    return classes;
  }
  public get cssRoot(): string {
    this.ensureElementCss();
    return this.getPropertyValue("cssRoot", "");
  }
  protected setCssRoot(val: string): void {
    this.setPropertyValue("cssRoot", val);
  }
  protected getCssRoot(cssClasses: any): string {
    return new CssClassBuilder()
      .append(this.isFlowLayout && !this.isDesignMode
        ? cssClasses.flowRoot
        : cssClasses.mainRoot)
      .append(cssClasses.titleLeftRoot, !this.isFlowLayout && this.hasTitleOnLeft)
      .append(cssClasses.hasError, this.errors.length > 0)
      .append(cssClasses.small, !this.width)
      .append(cssClasses.answered, this.isAnswered)
      .append(cssClasses.collapsed, !!this.isCollapsed)
      .append(cssClasses.withFrame, this.hasFrameV2)
      .append(cssClasses.nested, !this.hasFrameV2 && !this.isDesignMode)
      .toString();
  }
  public get cssHeader(): string {
    this.ensureElementCss();
    return this.getPropertyValue("cssHeader", "");
  }
  protected setCssHeader(val: string): void {
    this.setPropertyValue("cssHeader", val);
  }
  protected getCssHeader(cssClasses: any): string {
    return new CssClassBuilder()
      .append(cssClasses.header)
      .append(cssClasses.headerTop, this.hasTitleOnTop)
      .append(cssClasses.headerLeft, this.hasTitleOnLeft)
      .append(cssClasses.headerBottom, this.hasTitleOnBottom)
      .toString();
  }
  public get cssContent(): string {
    this.ensureElementCss();
    return this.getPropertyValue("cssContent", "");
  }
  protected setCssContent(val: string): void {
    this.setPropertyValue("cssContent", val);
  }
  protected getCssContent(cssClasses: any): string {
    return new CssClassBuilder()
      .append(cssClasses.content)
      .append(cssClasses.contentLeft, this.hasTitleOnLeft)
      .toString();
  }
  public get cssTitle(): string {
    this.ensureElementCss();
    return this.getPropertyValue("cssTitle", "");
  }
  protected setCssTitle(val: string): void {
    this.setPropertyValue("cssTitle", val);
  }
  protected getCssTitle(cssClasses: any): string {
    return new CssClassBuilder()
      .append(cssClasses.title)
      .append(cssClasses.titleExpandable, this.isCollapsed || this.isExpanded)
      .append(cssClasses.titleOnError, this.containsErrors)
      .append(cssClasses.titleOnAnswer, !this.containsErrors && this.isAnswered)
      .toString();
  }
  public get cssError(): string {
    this.ensureElementCss();
    return this.getPropertyValue("cssError", "");
  }
  protected setCssError(val: string): void {
    this.setPropertyValue("cssError", val);
  }
  protected getCssError(cssClasses: any): string {
    return new CssClassBuilder()
      .append(cssClasses.error.root)
      .append(cssClasses.error.aboveQuestion, this.isErrorsModeTooltip && !this.hasParent)
      .append(cssClasses.error.tooltip, this.isErrorsModeTooltip && this.hasParent)
      .append(cssClasses.error.locationTop, !this.isErrorsModeTooltip && this.errorLocation === "top")
      .append(cssClasses.error.locationBottom, !this.isErrorsModeTooltip && this.errorLocation === "bottom")
      .toString();
  }
  public getRootCss(): string {
    return new CssClassBuilder()
      .append(this.cssRoot)
      .append(this.cssClasses.disabled, this.isReadOnly)
      .toString();
  }
  public updateElementCss(reNew?: boolean): void {
    super.updateElementCss(reNew);
    if (reNew) {
      this.updateQuestionCss(true);
    }
  }
  protected updateQuestionCss(reNew?: boolean): void {
    if (
      this.isLoadingFromJson ||
      !this.survey ||
      (reNew !== true && !this.cssClassesValue)
    )
      return;
    this.updateElementCssCore(this.cssClasses);
  }
  private ensureElementCss() {
    if (!this.cssClassesValue) {
      this.updateQuestionCss(true);
    }
  }
  protected updateElementCssCore(cssClasses: any): void {
    this.setCssRoot(this.getCssRoot(cssClasses));
    this.setCssHeader(this.getCssHeader(cssClasses));
    this.setCssContent(this.getCssContent(cssClasses));
    this.setCssTitle(this.getCssTitle(cssClasses));
    this.setCssError(this.getCssError(cssClasses));
  }
  protected updateCssClasses(res: any, css: any): void {
    if (!css.question) return;
    const objCss = css[this.getCssType()];
    const titleBuilder = new CssClassBuilder().append(res.title)
      .append(css.question.titleRequired, this.isRequired);
    res.title = titleBuilder.toString();

    const rootBuilder = new CssClassBuilder().append(res.root)
      .append(objCss, this.isRequired && !!css.question.required);
    if (objCss === undefined || objCss === null) {
      res.root = rootBuilder.toString();
    }
    else if (typeof objCss === "string" || objCss instanceof String) {
      res.root = rootBuilder.append(objCss.toString()).toString();
    } else {
      res.root = rootBuilder.toString();
      for (const key in objCss) {
        res[key] = objCss[key];
      }
    }
  }
  protected getCssType(): string {
    return this.getType();
  }
  /**
   * Use it to set the specific width to the question like css style (%, px, em etc).
   */
  public get width(): string {
    return this.getPropertyValue("width", "");
  }
  public set width(val: string) {
    this.setPropertyValue("width", val);
  }
  /**
   * Use it to set the specific minWidth constraint to the question like css style (%, px, em etc).
   */
  public get minWidth(): string {
    return this.getPropertyValue("minWidth");
  }
  public set minWidth(val: string) {
    this.setPropertyValue("minWidth", val);
  }
  /**
   * Use it to set the specific maxWidth constraint to the question like css style (%, px, em etc).
   */
  public get maxWidth(): string {
    return this.getPropertyValue("maxWidth");
  }
  public set maxWidth(val: string) {
    this.setPropertyValue("maxWidth", val);
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

  public get renderCssRoot(): string {
    return this.cssClasses.root || undefined;
  }
  /**
   * Set it different from 0 to increase the left padding.
   */
  public get indent(): number {
    return this.getPropertyValue("indent");
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
  get paddingLeft(): string {
    return this.getPropertyValue("paddingLeft", "");
  }
  set paddingLeft(val: string) {
    this.setPropertyValue("paddingLeft", val);
  }
  get paddingRight(): string {
    return this.getPropertyValue("paddingRight", "");
  }
  set paddingRight(val: string) {
    this.setPropertyValue("paddingRight", val);
  }
  private onIndentChanged() {
    this.paddingLeft = this.getIndentSize(this.indent);
    this.paddingRight = this.getIndentSize(this.rightIndent);
  }
  private getIndentSize(indent: number): string {
    if (indent < 1 || !this.getSurvey() || !this.cssClasses) return "";
    return indent * this.cssClasses.indent + "px";
  }
  /**
   * Move the focus to the input of this question.
   * @param onError set this parameter to true, to focus the input with the first error, other wise the first input will be focused.
   */
  public focus(onError: boolean = false): void {
    if (this.isDesignMode) return;

    if (!!this.survey) {
      this.survey.scrollElementToTop(this, this, null, this.id);
    }
    var id = !onError
      ? this.getFirstInputElementId()
      : this.getFirstErrorInputElementId();
    if (SurveyElement.FocusElement(id)) {
      this.fireCallback(this.focusCallback);
    }
  }
  public focusIn = () => {
    (this.survey as SurveyModel).whenQuestionFocusIn(this);
  }
  protected fireCallback(callback: () => void): void {
    if (callback) callback();
  }
  public getOthersMaxLength(): any {
    if (!this.survey) return null;
    return this.survey.maxOthersLength > 0 ? this.survey.maxOthersLength : null;
  }
  protected onCreating(): void { }
  protected getFirstInputElementId(): string {
    return this.inputId;
  }
  protected getFirstErrorInputElementId(): string {
    return this.getFirstInputElementId();
  }
  protected getProcessedTextValue(textValue: TextPreProcessorValue): void {
    var name = textValue.name.toLocaleLowerCase();
    textValue.isExists =
      Object.keys(Question.TextPreprocessorValuesMap).indexOf(name) !== -1 ||
      (<any>this)[textValue.name] !== undefined;
    textValue.value = (<any>this)[
      (<any>Question.TextPreprocessorValuesMap)[name] || textValue.name
    ];
  }
  public supportComment(): boolean {
    return false;
  }
  public supportOther(): boolean {
    return false;
  }
  /**
   * Set this property to true, to make the question a required. If a user doesn't answer the question then a validation error will be generated.
   * Please note, this property is hidden for question without input, for example html question.
   */
  public get isRequired(): boolean {
    return this.getPropertyValue("isRequired");
  }
  public set isRequired(val: boolean) {
    this.setPropertyValue("isRequired", val);
  }
  /**
   * An expression that returns true or false. If it returns true the Question becomes required and an end-user has to answer it.
   * If it returns false the Question then an end-user may not answer it the Question maybe empty.
   * The library runs the expression on survey start and on changing a question value. If the property is empty then isRequired property is used.
   * Please note, this property is hidden for question without input, for example html question.
   * @see isRequired
   */
  public get requiredIf(): string {
    return this.getPropertyValue("requiredIf", "");
  }
  public set requiredIf(val: string) {
    this.setPropertyValue("requiredIf", val);
    this.runConditions();
  }
  /**
   * Set it to true, to add a comment for the question.
   */
  public get hasComment(): boolean {
    return this.getPropertyValue("hasComment", false);
  }
  public set hasComment(val: boolean) {
    if (!this.supportComment()) return;
    this.setPropertyValue("hasComment", val);
    if (this.hasComment) this.hasOther = false;
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
  public get ariaTitleId(): string {
    return this.id + "_ariaTitle";
  }
  public get ariaRole(): string {
    return null;
  }
  public get hasOther(): boolean {
    return this.getPropertyValue("hasOther", false);
  }
  public set hasOther(val: boolean) {
    if (!this.supportOther() || this.hasOther == val) return;
    this.setPropertyValue("hasOther", val);
    if (this.hasOther) this.hasComment = false;
    this.hasOtherChanged();
  }

  protected hasOtherChanged(): void { }
  public get requireUpdateCommentValue(): boolean {
    return this.hasComment || this.hasOther;
  }
  /**
   * Returns true if readOnly property is true or survey is in display mode or parent panel/page is readOnly.
   * @see SurveyModel.model
   * @see readOnly
   */
  public get isReadOnly(): boolean {
    var isParentReadOnly = !!this.parent && this.parent.isReadOnly;
    var isSurveyReadOnly = !!this.survey && this.survey.isDisplayMode;
    return this.readOnly || isParentReadOnly || isSurveyReadOnly;
  }
  public get isInputReadOnly(): boolean {
    var isDesignModeV2 = settings.supportCreatorV2 && this.isDesignMode;
    return this.isReadOnly || isDesignModeV2;
  }
  public get renderedInputReadOnly() {
    return this.isInputReadOnly ? "" : undefined;
  }
  public get renderedInputDisabled() {
    return this.isInputReadOnly ? "" : undefined;
  }
  protected onReadOnlyChanged(): void {
    this.setPropertyValue("isInputReadOnly", this.isInputReadOnly);
    super.onReadOnlyChanged();
  }
  /**
   * An expression that returns true or false. If it returns false the Question becomes read only and an end-user will not able to answer on the qustion. The library runs the expression on survey start and on changing a question value. If the property is empty then readOnly property is used.
   * Please note, this property is hidden for question without input, for example html question.
   * @see readOnly
   * @see isReadOnly
   */
  public get enableIf(): string {
    return this.getPropertyValue("enableIf", "");
  }
  public set enableIf(val: string) {
    this.setPropertyValue("enableIf", val);
    this.runConditions();
  }
  /**
   * Run visibleIf and enableIf expressions. If visibleIf or/and enabledIf are not empty, then the results of performing the expression (true or false) set to the visible/readOnly properties.
   * @param values Typically survey results
   * @see visible
   * @see visibleIf
   * @see readOnly
   * @see enableIf
   */
  public runCondition(values: HashTable<any>, properties: HashTable<any>): void {
    if (this.isDesignMode) return;
    if (!properties) properties = {};
    properties["question"] = this;
    if (!this.areInvisibleElementsShowing) {
      this.runVisibleIfCondition(values, properties);
    }
    this.runEnableIfCondition(values, properties);
    this.runRequiredIfCondition(values, properties);
  }
  private runVisibleIfCondition(
    values: HashTable<any>,
    properties: HashTable<any>
  ) {
    if (!this.visibleIf) return;
    if (!this.conditionRunner)
      this.conditionRunner = new ConditionRunner(this.visibleIf);
    this.conditionRunner.expression = this.visibleIf;
    this.conditionRunner.onRunComplete = (res: boolean) => {
      this.visible = res;
    };
    this.conditionRunner.run(values, properties);
  }
  private runEnableIfCondition(
    values: HashTable<any>,
    properties: HashTable<any>
  ) {
    if (!this.enableIf) return;
    if (!this.conditionEnabelRunner)
      this.conditionEnabelRunner = new ConditionRunner(this.enableIf);
    this.conditionEnabelRunner.expression = this.enableIf;
    this.conditionEnabelRunner.onRunComplete = (res: boolean) => {
      this.readOnly = !res;
    };
    this.conditionEnabelRunner.run(values, properties);
  }
  private runRequiredIfCondition(
    values: HashTable<any>,
    properties: HashTable<any>
  ) {
    if (!this.requiredIf) return;
    if (!this.conditionRequiredRunner)
      this.conditionRequiredRunner = new ConditionRunner(this.requiredIf);
    this.conditionRequiredRunner.expression = this.requiredIf;
    this.conditionRequiredRunner.onRunComplete = (res: boolean) => {
      this.isRequired = res;
    };
    this.conditionRequiredRunner.run(values, properties);
  }
  /**
   * The property returns the question number. If question is invisible then it returns empty string.
   * If visibleIndex is 1, then no is 2, or 'B' if survey.questionStartIndex is 'A'.
   * @see SurveyModel.questionStartIndex
   */
  public get no(): string {
    return this.getPropertyValue("no");
  }
  private calcNo(): string {
    if (!this.hasTitle || this.hideNumber) return "";
    var no = Helpers.getNumberByIndex(this.visibleIndex, this.getStartIndex());
    if (!!this.survey) {
      no = this.survey.getUpdatedQuestionNo(this, no);
    }
    return no;
  }
  protected getStartIndex(): string {
    if (!!this.parent) return this.parent.getQuestionStartIndex();
    if (!!this.survey) return this.survey.questionStartIndex;
    return "";
  }
  public onSurveyLoad(): void {
    this.fireCallback(this.surveyLoadCallback);
    this.updateValueWithDefaults();
    if(this.isEmpty()) {
      this.initDataFromSurvey();
    }
  }
  protected onSetData(): void {
    super.onSetData();
    if (!this.survey) return;
    this.initDataFromSurvey();
    this.onSurveyValueChanged(this.value);
    this.updateValueWithDefaults();
    this.onIndentChanged();
    this.updateQuestionCss();
    this.updateIsAnswered();
  }
  protected initDataFromSurvey(): void {
    if (!!this.data) {
      const val = this.data.getValue(this.getValueName());
      if (!Helpers.isValueEmpty(val) || !this.isLoadingFromJson) {
        this.updateValueFromSurvey(val);
      }
      this.initCommentFromSurvey();
    }
  }
  protected initCommentFromSurvey(): void {
    if (!!this.data && this.requireUpdateCommentValue) {
      this.updateCommentFromSurvey(this.data.getComment(this.getValueName()));
    } else {
      this.updateCommentFromSurvey("");
    }
  }
  protected runExpression(expression: string): any {
    if (!this.survey || !expression) return undefined;
    return this.survey.runExpression(expression);
  }
  private get autoGrowComment(): boolean {
    return this.survey && this.survey.autoGrowComment;
  }
  private get questionValue(): any {
    return this.getPropertyValue("value");
  }
  private set questionValue(val: any) {
    this.setPropertyValue("value", val);
  }
  private get questionComment(): string {
    return this.getPropertyValue("comment");
  }
  private set questionComment(val: string) {
    this.setPropertyValue("comment", val);
    this.fireCallback(this.commentChangedCallback);
  }
  /**
   * Get/Set the question value.
   * @see SurveyMode.setValue
   * @see SurveyMode.getValue
   */
  public get value(): any {
    return this.getValueCore();
  }
  public set value(newValue: any) {
    this.setNewValue(newValue);
  }
  public get valueForSurvey(): any {
    if (!!this.valueToDataCallback) {
      return this.valueToDataCallback(this.value);
    }
    return this.value;
  }
  /**
   * Clear the question value. It clears the question comment as well.
   */
  public clearValue(): void {
    if (this.value !== undefined) {
      this.value = undefined;
    }
    this.comment = undefined;
  }
  public unbindValue(): void {
    this.clearValue();
  }
  public createValueCopy(): any {
    return this.getUnbindValue(this.value);
  }
  protected getUnbindValue(value: any): any {
    if (this.isValueSurveyElement(value)) return value;
    return Helpers.getUnbindValue(value);
  }
  protected isValueSurveyElement(val: any): boolean {
    if (!val) return false;
    if (Array.isArray(val))
      return val.length > 0 ? this.isValueSurveyElement(val[0]) : false;
    return !!val.getType && !!val.onPropertyChanged;
  }
  private canClearValueAsInvisible(): boolean {
    if (this.isVisible && this.isParentVisible) return false;
    if (!!this.page && this.page.isStarted) return false;
    if (!this.survey || !this.valueName) return true;
    return !this.survey.hasVisibleQuestionByValueName(this.valueName);
  }
  /**
   * Return true if there is a parent (page or panel) and it is visible
   */
  public get isParentVisible(): boolean {
    var parent = this.parent;
    while (parent) {
      if (!parent.isVisible) return false;
      parent = parent.parent;
    }
    return true;
  }
  public clearValueIfInvisible(): void {
    if (this.canClearValueAsInvisible()) {
      this.clearValue();
    }
  }
  public get displayValue(): any {
    if (this.isLoadingFromJson) return "";
    return this.getDisplayValue(true);
  }
  /**
   * Return the question value as a display text. For example, for dropdown, it would return the item text instead of item value.
   * @param keysAsText Set this value to true, to return key (in matrices questions) as display text as well.
   * @param value use this parameter, if you want to get display value for this value and not question.value. It is undefined by default.
   */
  public getDisplayValue(keysAsText: boolean, value: any = undefined): any {
    var res = this.calcDisplayValue(keysAsText, value);
    return !!this.displayValueCallback ? this.displayValueCallback(res) : res;
  }
  private calcDisplayValue(keysAsText: boolean, value: any = undefined): any {
    if (this.customWidget) {
      var res = this.customWidget.getDisplayValue(this, value);
      if (res) return res;
    }
    value = value == undefined ? this.createValueCopy() : value;
    if (this.isValueEmpty(value)) return this.getDisplayValueEmpty();
    return this.getDisplayValueCore(keysAsText, value);
  }
  protected getDisplayValueCore(keyAsText: boolean, value: any): any {
    return value;
  }
  protected getDisplayValueEmpty(): string {
    return "";
  }
  /**
   * Set the default value to the question. It will be assign to the question on loading the survey from JSON or adding a question to the survey or on setting this property of the value is empty.
   * Please note, this property is hidden for question without input, for example html question.
   */
  public get defaultValue(): any {
    return this.getPropertyValue("defaultValue");
  }
  public set defaultValue(val: any) {
    if (this.isValueExpression(val)) {
      this.defaultValueExpression = val.substr(1);
      return;
    }
    this.setPropertyValue("defaultValue", this.convertDefaultValue(val));
    this.updateValueWithDefaults();
  }
  public get defaultValueExpression(): any {
    return this.getPropertyValue("defaultValueExpression");
  }
  public set defaultValueExpression(val: any) {
    this.setPropertyValue("defaultValueExpression", val);
    this.updateValueWithDefaults();
  }
  public get resizeStyle() {
    return this.autoGrowComment ? "none" : "both";
  }
  /**
   * Returns question answer data as a plain object: with question title, name, value and displayValue.
   * For complex questions (like matrix, etc.) isNode flag is set to true and data contains array of nested objects (rows)
   * set options.includeEmpty to false if you want to skip empty answers
   */
  public getPlainData(
    options?: {
      includeEmpty?: boolean,
      includeQuestionTypes?: boolean,
      calculations?: Array<{
        propertyName: string,
      }>,
    }
  ): any {
    if (!options) {
      options = { includeEmpty: true, includeQuestionTypes: false };
    }
    if (options.includeEmpty || !this.isEmpty()) {
      var questionPlainData = <any>{
        name: this.name,
        title: this.locTitle.renderedHtml,
        value: this.value,
        displayValue: this.displayValue,
        isNode: false,
        getString: (val: any) =>
          typeof val === "object" ? JSON.stringify(val) : val,
      };
      if (options.includeQuestionTypes === true) {
        questionPlainData.questionType = this.getType();
      }
      (options.calculations || []).forEach((calculation) => {
        questionPlainData[calculation.propertyName] = this[
          calculation.propertyName
        ];
      });
      if (this.hasComment) {
        questionPlainData.isNode = true;
        questionPlainData.data = [
          {
            name: 0,
            isComment: true,
            title: "Comment",
            value: settings.commentPrefix,
            displayValue: this.comment,
            getString: (val: any) =>
              typeof val === "object" ? JSON.stringify(val) : val,
            isNode: false,
          },
        ];
      }
      return questionPlainData;
    }
    return undefined;
  }
  /**
   * The correct answer on the question. Set this value if you are doing a quiz.
   * Please note, this property is hidden for question without input, for example html question.
   * @see SurveyModel.correctAnswers
   * @see SurveyModel.inCorrectAnswers
   */
  public get correctAnswer(): any {
    return this.getPropertyValue("correctAnswer");
  }
  public set correctAnswer(val: any) {
    this.setPropertyValue("correctAnswer", this.convertDefaultValue(val));
  }
  protected convertDefaultValue(val: any): any {
    return val;
  }
  /**
   * Returns questions count: 1 for the non-matrix questions and all inner visible questions that has input(s) widgets for question of matrix types.
   * @see getQuizQuestions
   */
  public get quizQuestionCount(): number {
    if (
      this.isVisible &&
      this.hasInput &&
      !this.isValueEmpty(this.correctAnswer)
    )
      return this.getQuizQuestionCount();
    return 0;
  }
  public get correctAnswerCount(): number {
    if (!this.isEmpty() && !this.isValueEmpty(this.correctAnswer))
      return this.getCorrectAnswerCount();
    return 0;
  }
  protected getQuizQuestionCount(): number {
    return 1;
  }
  protected getCorrectAnswerCount(): number {
    return this.isTwoValueEquals(this.value, this.correctAnswer, true, true)
      ? 1
      : 0;
  }
  public isAnswerCorrect(): boolean {
    return this.correctAnswerCount == this.quizQuestionCount;
  }
  public updateValueWithDefaults(): void {
    if (this.isLoadingFromJson || (!this.isDesignMode && this.isDefaultValueEmpty())) return;
    if (!this.isDesignMode && !this.isEmpty()) return;
    if (this.isEmpty() && this.isDefaultValueEmpty()) return;
    if (!!this.survey && this.survey.isClearValueOnHidden && !this.isVisible) return;
    this.setDefaultValue();
  }
  getQuestionFromArray(name: string, index: number): IQuestion {
    return null;
  }
  public getDefaultValue(): any {
    return this.defaultValue;
  }
  protected isDefaultValueEmpty(): boolean {
    return !this.defaultValueExpression && this.isValueEmpty(this.defaultValue);
  }
  protected setDefaultValue(): void {
    this.setValueAndRunExpression(
      this.defaultValueExpression,
      this.getUnbindValue(this.defaultValue),
      (val) => {
        this.value = val;
      }
    );
  }
  protected isValueExpression(val: any): boolean {
    return !!val && typeof val == "string" && val.length > 0 && val[0] == "=";
  }
  protected setValueAndRunExpression(
    expression: string,
    defaultValue: any,
    setFunc: (val: any) => void,
    values: HashTable<any> = null,
    properties: HashTable<any> = null
  ): void {
    var func = (val: any) => {
      if (val instanceof Date) {
        val = val.toISOString().slice(0, 10);
      }
      setFunc(val);
    };
    if (!!expression && !!this.data) {
      if (!values) values = this.data.getFilteredValues();
      if (!properties) properties = this.data.getFilteredProperties();
      var runner = new ExpressionRunner(expression);
      if (runner.canRun) {
        runner.onRunComplete = (res) => {
          if (res == undefined) res = this.defaultValue;
          func(res);
        };
        runner.run(values, properties);
      }
    } else {
      func(defaultValue);
    }
  }
  /**
   * The question comment value.
   */
  public get comment(): string {
    return this.getQuestionComment();
  }
  public set comment(newValue: string) {
    if (!!newValue) {
      const trimmedValue = newValue.toString().trim();
      if (trimmedValue !== newValue) {
        newValue = trimmedValue;
        if (newValue === this.comment) {
          this.setPropertyValueDirectly("comment", newValue);
        }
      }
    }
    if (this.comment == newValue) return;
    this.setQuestionComment(newValue);
    this.updateCommentElement();
  }
  protected getQuestionComment(): string {
    return this.questionComment;
  }
  protected setQuestionComment(newValue: string): void {
    this.setNewComment(newValue);
  }
  /**
   * Returns true if the question value is empty
   */
  public isEmpty(): boolean {
    return this.isValueEmpty(this.value);
  }
  public get isAnswered(): boolean {
    return this.getPropertyValue("isAnswered");
  }
  public set isAnswered(val: boolean) {
    this.setPropertyValue("isAnswered", val);
  }
  protected updateIsAnswered(): void {
    const oldVal = this.isAnswered;
    this.setPropertyValue("isAnswered", this.getIsAnswered());
    if(oldVal !== this.isAnswered) {
      this.updateQuestionCss();
    }
  }
  protected getIsAnswered(): boolean {
    return !this.isEmpty();
  }
  /**
   * The list of question validators.
   * Please note, this property is hidden for question without input, for example html question.
   */
  public get validators(): Array<SurveyValidator> {
    return this.getPropertyValue("validators");
  }
  public set validators(val: Array<SurveyValidator>) {
    this.setPropertyValue("validators", val);
  }
  public getValidators(): Array<SurveyValidator> {
    return this.validators;
  }
  public getSupportedValidators(): Array<string> {
    var res: Array<string> = [];
    var className = this.getType();
    while (!!className) {
      var classValidators = (<any>settings.supportedValidators)[className];
      if (!!classValidators) {
        for (var i = classValidators.length - 1; i >= 0; i--) {
          res.splice(0, 0, classValidators[i]);
        }
      }
      var classInfo = Serializer.findClass(className);
      className = classInfo.parentName;
    }
    return res;
  }
  private addSupportedValidators(
    supportedValidators: Array<string>,
    classValidators: Array<string>
  ) { }
  public addConditionObjectsByContext(objects: Array<IConditionObject>, context: any): void {
    objects.push({
      name: this.getValueName(),
      text: this.processedTitle,
      question: this,
    });
  }
  public getConditionJson(operator: string = null, path: string = null): any {
    var json = new JsonObject().toJsonObject(this);
    json["type"] = this.getType();
    return json;
  }
  /**
   * Returns true if there is a validation error(s) in the question.
   * @param fireCallback set it to true to show an error in UI.
   */
  public hasErrors(fireCallback: boolean = true, rec: any = null): boolean {
    var oldHasErrors = this.errors.length > 0;
    var errors = this.checkForErrors(!!rec && rec.isOnValueChanged === true);
    if (fireCallback) {
      if (!!this.survey) {
        this.survey.beforeSettingQuestionErrors(this, errors);
      }
      this.errors = errors;
    }
    this.updateContainsErrors();
    if (oldHasErrors != errors.length > 0) {
      this.updateQuestionCss();
    }
    if (this.isCollapsed && rec && fireCallback && errors.length > 0) {
      this.expand();
    }
    return errors.length > 0;
  }
  /**
   * Returns the validation errors count.
   */
  public get currentErrorCount(): number {
    return this.errors.length;
  }
  /**
   * Returns the char/string for a required question.
   * @see SurveyModel.requiredText
   */
  public get requiredText(): string {
    return this.survey != null && this.isRequired
      ? this.survey.requiredText
      : "";
  }
  /**
   * Add error into the question error list.
   * @param error
   */
  public addError(error: SurveyError | string): void {
    if (!error) return;
    let newError: SurveyError = null;
    if (typeof error === "string" || error instanceof String) {
      newError = new CustomError(<string>error, this.survey);
    } else {
      newError = <SurveyError>error;
    }
    this.errors.push(newError);
  }
  /**
   * Remove a particular error from the question error list.
   * @param error
   */
  public removeError(error: SurveyError): void {
    var errors = this.errors;
    var index = errors.indexOf(error);
    if (index !== -1) errors.splice(index, 1);
  }
  private checkForErrors(isOnValueChanged: boolean): Array<SurveyError> {
    var qErrors = new Array<SurveyError>();
    if (this.isVisible && this.canCollectErrors()) {
      this.collectErrors(qErrors, isOnValueChanged);
    }
    return qErrors;
  }
  protected canCollectErrors(): boolean {
    return !this.isReadOnly;
  }
  private collectErrors(
    qErrors: Array<SurveyError>,
    isOnValueChanged: boolean
  ) {
    this.onCheckForErrors(qErrors, isOnValueChanged);
    if (qErrors.length > 0 || !this.canRunValidators(isOnValueChanged)) return;
    var errors = this.runValidators();
    if (errors.length > 0) {
      //validators may change the question value.
      qErrors.length = 0;
      for (var i = 0; i < errors.length; i++) {
        qErrors.push(errors[i]);
      }
    }
    if (this.survey && qErrors.length == 0) {
      var error = this.fireSurveyValidation();
      if (error) {
        qErrors.push(error);
      }
    }
  }
  protected canRunValidators(isOnValueChanged: boolean): boolean {
    return true;
  }
  private fireSurveyValidation(): SurveyError {
    if (this.validateValueCallback) return this.validateValueCallback();
    return this.survey ? this.survey.validateQuestion(this) : null;
  }
  protected onCheckForErrors(errors: Array<SurveyError>, isOnValueChanged: boolean): void {
    if (!isOnValueChanged && this.hasRequiredError()) {
      errors.push(new AnswerRequiredError(this.requiredErrorText, this));
    }
  }
  protected hasRequiredError(): boolean {
    return this.isRequired && this.isEmpty();
  }
  private validatorRunner: ValidatorRunner;
  private isRunningValidatorsValue = false;
  public onCompletedAsyncValidators: (hasErrors: boolean) => void;
  public get isRunningValidators(): boolean {
    return this.getIsRunningValidators();
  }
  protected getIsRunningValidators(): boolean {
    return this.isRunningValidatorsValue;
  }
  protected runValidators(): Array<SurveyError> {
    if (!!this.validatorRunner) {
      this.validatorRunner.onAsyncCompleted = null;
    }
    this.validatorRunner = new ValidatorRunner();
    this.isRunningValidatorsValue = true;
    this.validatorRunner.onAsyncCompleted = (errors: Array<SurveyError>) => {
      this.doOnAsyncCompleted(errors);
    };
    return this.validatorRunner.run(this);
  }
  private doOnAsyncCompleted(errors: Array<SurveyError>) {
    for (var i = 0; i < errors.length; i++) {
      this.errors.push(errors[i]);
    }
    this.isRunningValidatorsValue = false;
    this.raiseOnCompletedAsyncValidators();
  }
  protected raiseOnCompletedAsyncValidators(): void {
    if (!!this.onCompletedAsyncValidators && !this.isRunningValidators) {
      this.onCompletedAsyncValidators(this.getAllErrors().length > 0);
      this.onCompletedAsyncValidators = null;
    }
  }
  private isValueChangedInSurvey = false;
  protected allowNotifyValueChanged = true;
  protected setNewValue(newValue: any): void {
    var oldAnswered = this.isAnswered;
    this.setNewValueInData(newValue);
    this.allowNotifyValueChanged && this.onValueChanged();
    if (this.isAnswered != oldAnswered) {
      this.updateQuestionCss();
    }
  }
  protected isTextValue(): boolean {
    return false;
  }
  public get isSurveyInputTextUpdate(): boolean {
    return !!this.survey ? this.survey.isUpdateValueTextOnTyping : false;
  }
  private getDataLocNotification(): any {
    return this.isInputTextUpdate ? "text" : false;
  }
  public get isInputTextUpdate(): boolean {
    return this.isSurveyInputTextUpdate && this.isTextValue();
  }
  protected setNewValueInData(newValue: any): void {
    newValue = this.valueToData(newValue);
    if (!this.isValueChangedInSurvey) {
      this.setValueCore(newValue);
    }
  }
  protected getValueCore(): any {
    return this.questionValue;
  }
  protected setValueCore(newValue: any): void {
    this.setQuestionValue(newValue);
    if (this.data != null && this.canSetValueToSurvey()) {
      newValue = this.valueForSurvey;
      this.data.setValue(
        this.getValueName(),
        newValue,
        this.getDataLocNotification(),
        this.allowNotifyValueChanged
      );
    }
  }
  protected canSetValueToSurvey(): boolean {
    return true;
  }
  protected valueFromData(val: any): any {
    return val;
  }
  protected valueToData(val: any): any {
    return val;
  }
  protected onValueChanged(): void { }
  protected setNewComment(newValue: string): void {
    this.questionComment = newValue;
    if (this.data != null) {
      this.data.setComment(
        this.getValueName(),
        newValue,
        this.isSurveyInputTextUpdate ? "text" : false
      );
    }
  }
  protected getValidName(name: string): string {
    if (!name) return name;
    return name.trim().replace(/[\{\}]+/g, "");
  }
  //IQuestion
  updateValueFromSurvey(newValue: any): void {
    newValue = this.getUnbindValue(newValue);
    if (!!this.valueFromDataCallback) {
      newValue = this.valueFromDataCallback(newValue);
    }
    this.setQuestionValue(this.valueFromData(newValue));
    this.updateIsAnswered();
  }
  updateCommentFromSurvey(newValue: any): any {
    this.questionComment = newValue;
  }
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true): void {
    const isEqual = this.isTwoValueEquals(this.questionValue, newValue);
    this.questionValue = newValue;
    !isEqual && this.allowNotifyValueChanged &&
      this.fireCallback(this.valueChangedCallback);
    if (updateIsAnswered) this.updateIsAnswered();
  }
  onSurveyValueChanged(newValue: any): void { }
  public setVisibleIndex(val: number): number {
    if (
      !this.isVisible ||
      (!this.hasTitle && !settings.setQuestionVisibleIndexForHiddenTitle) ||
      (this.hideNumber && !settings.setQuestionVisibleIndexForHiddenNumber)
    ) {
      val = -1;
    }
    this.setPropertyValue("visibleIndex", val);
    this.setPropertyValue("no", this.calcNo());
    return val < 0 ? 0 : 1;
  }
  public removeElement(element: IElement): boolean {
    return false;
  }
  public supportGoNextPageAutomatic(): boolean {
    return false;
  }
  public supportGoNextPageError(): boolean {
    return true;
  }
  /**
   * Call this function to remove values from the current question, that end-user will not be able to enter.
   * For example the value that doesn't exists in a radigroup/dropdown/checkbox choices or matrix rows/columns.
   */
  public clearIncorrectValues(): void { }
  public clearOnDeletingContainer(): void { }
  /**
   * Call this function to clear all errors in the question
   */
  public clearErrors(): void {
    this.errors = [];
  }
  public clearUnusedValues(): void { }
  onAnyValueChanged(name: string): void { }
  checkBindings(valueName: string, value: any): void {
    if (this.bindings.isEmpty() || !this.data) return;
    var props = this.bindings.getPropertiesByValueName(valueName);
    for (var i = 0; i < props.length; i++) {
      this[props[i]] = value;
    }
  }
  public getComponentName(): string {
    return RendererFactory.Instance.getRendererByQuestion(this);
  }

  public isDefaultRendering(): boolean {
    return (
      !!this.customWidget ||
      this.renderAs === "default" ||
      this.getComponentName() === "default"
    );
  }

  @property({ defaultValue: "default" })
  renderAs: string;

  //ISurveyErrorOwner
  getErrorCustomText(text: string, error: SurveyError): string {
    if (!!this.survey) return this.survey.getSurveyErrorCustomText(this, text, error);
    return text;
  }
  //IValidatorOwner
  getValidatorTitle(): string {
    return null;
  }
  get validatedValue(): any {
    return this.value;
  }
  set validatedValue(val: any) {
    this.value = val;
  }
  getAllValues(): any {
    return !!this.data ? this.data.getAllValues() : null;
  }
  public needResponsiveWidth() {
    return false;
  }
}
Serializer.addClass("question", [
  "!name",
  {
    name: "state",
    default: "default",
    choices: ["default", "collapsed", "expanded"],
  },
  { name: "visible:switch", default: true },
  { name: "useDisplayValuesInTitle:boolean", default: true, layout: "row" },
  "visibleIf:condition",
  { name: "width" },
  { name: "minWidth", default: settings.minWidth },
  { name: "maxWidth", default: settings.maxWidth },
  { name: "startWithNewLine:boolean", default: true, layout: "row" },
  { name: "indent:number", default: 0, choices: [0, 1, 2, 3], layout: "row" },
  {
    name: "page",
    isSerializable: false,
    visibleIf: function (obj: any) {
      var survey = obj ? obj.survey : null;
      return !survey || survey.pages.length > 1;
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
  { name: "title:text", serializationProperty: "locTitle", layout: "row" },
  {
    name: "titleLocation",
    default: "default",
    choices: ["default", "top", "bottom", "left", "hidden"],
    layout: "row",
  },
  {
    name: "description:text",
    serializationProperty: "locDescription",
    layout: "row",
  },
  {
    name: "descriptionLocation",
    default: "default",
    choices: ["default", "underInput", "underTitle"],
  },
  {
    name: "hideNumber:boolean",
    dependsOn: "titleLocation",
    visibleIf: function (obj: any) {
      if (!obj) {
        return true;
      }
      if ((<Question>obj).titleLocation === "hidden") {
        return false;
      }
      var parent: PanelModel = obj ? obj.parent : null;
      var numberingAllowedByParent =
        !parent || parent.showQuestionNumbers !== "off";
      if (!numberingAllowedByParent) {
        return false;
      }
      var survey: SurveyModel = obj ? obj.survey : null;
      return (
        !survey ||
        survey.showQuestionNumbers !== "off" ||
        (!!parent && parent.showQuestionNumbers === "onpanel")
      );
    },
  },
  "valueName",
  "enableIf:condition",
  "defaultValue:value",
  {
    name: "defaultValueExpression:expression",
    category: "logic",
  },
  "correctAnswer:value",
  "isRequired:switch",
  "requiredIf:condition",
  {
    name: "requiredErrorText:text",
    serializationProperty: "locRequiredErrorText",
  },
  "readOnly:switch",
  {
    name: "validators:validators",
    baseClassName: "surveyvalidator",
    classNamePart: "validator",
  },
  {
    name: "bindings:bindings",
    serializationProperty: "bindings",
    visibleIf: function (obj: any) {
      return obj.bindings.getNames().length > 0;
    },
  },
  { name: "renderAs", default: "default", visible: false },
]);
Serializer.addAlterNativeClassName("question", "questionbase");
