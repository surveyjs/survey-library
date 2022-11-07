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
import { getElementWidth, increaseHeightByContent, isContainerVisible } from "./utils/utils";

export interface IConditionObject {
  name: string;
  text: string;
  question: Question;
  context?: Question;
}

export interface IQuestionPlainData {
  name: string | number;
  title: string;
  value: any;
  displayValue: any;
  isNode: boolean;
  isComment?: boolean;
  questionType?: string;
  data?: Array<IQuestionPlainData>;
  getString: (val: any) => string;
  [key: string]: any;
}

/**
 * A base class for all questions.
 */
export class Question extends SurveyElement<Question>
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
  private isCustomWidgetRequested: boolean;
  private customWidgetValue: QuestionCustomWidget;
  customWidgetData = { isNeedRender: true };
  focusCallback: () => void;
  surveyLoadCallback: () => void;
  displayValueCallback: (text: string) => string;

  private defaultValueRunner: ExpressionRunner;
  private isChangingViaDefaultValue: boolean;
  private isValueChangedDirectly: boolean;
  valueChangedCallback: () => void;
  commentChangedCallback: () => void;
  localeChangedCallback: () => void;
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
   * An event that is raised when the question's ready state has changed (expressions are evaluated, choices are loaded from a web resource specified by the `choicesByUrl` property, etc.).
   *
   * Parameters:
   *
   * - `sender` - A survey that contains the question whose ready state has changed.
   * - `options.isReady` - A Boolean value that indicates whether the question is ready.
   * - `options.oldIsReady` - A Boolean value that indicates the previous ready state.
   */
  public onReadyChanged: EventBase<Question> = this.addEvent<Question>();

  public isReadOnlyRenderDiv(): boolean {
    return this.isReadOnly && settings.readOnlyCommentRenderMode === "div";
  }

  @property({ defaultValue: false }) isMobile: boolean;

  constructor(name: string) {
    super(name);
    this.id = Question.getQuestionId();
    this.onCreating();
    this.createNewArray("validators", (validator: any) => {
      validator.errorOwner = this;
    });

    this.addExpressionProperty("visibleIf",
      (obj: Base, res: any) => { this.visible = res === true; },
      (obj: Base) => { return !this.areInvisibleElementsShowing; });
    this.addExpressionProperty("enableIf", (obj: Base, res: any) => { this.readOnly = res === false; });
    this.addExpressionProperty("requiredIf", (obj: Base, res: any) => { this.isRequired = res === true; });

    this.createLocalizableString("commentText", this, true, "otherItemText");
    this.locTitle.onGetDefaultTextCallback = (): string => {
      return this.name;
    };
    this.locTitle.storeDefaultText = true;
    this.createLocalizableString("requiredErrorText", this);
    this.registerPropertyChangedHandlers(["width"], () => {
      this.updateQuestionCss();
      if (!!this.parent) {
        this.parent.elementWidthChanged(this);
      }
    });
    this.registerPropertyChangedHandlers(["isRequired"], () => {
      this.locTitle.strChanged();
      this.clearCssClasses();
    });
    this.registerPropertyChangedHandlers(
      ["indent", "rightIndent"],
      () => {
        this.onIndentChanged();
      }
    );

    this.registerPropertyChangedHandlers(
      ["showCommentArea", "showOtherItem"],
      () => {
        this.initCommentFromSurvey();
      }
    );
    this.registerPropertyChangedHandlers(["isMobile"], () => { this.onMobileChanged(); });
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
   * Specifies an object property that should store the question value.
   *
   * Refer to the [Merge Question Values](https://surveyjs.io/form-library/documentation/design-survey-merge-question-values) help topic for more information.
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
    this.locTitle.strChanged();
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
  public get ariaRequired() {
    return this.isRequired ? "true" : "false";
  }
  public get ariaInvalid() {
    return this.errors.length > 0 ? "true" : "false";
  }
  public get ariaDescribedBy(): string {
    return this.errors.length > 0 ? this.id + "_errors" : null;
  }

  public choicesLoaded(): void { }
  /**
   * Returns a page to which the question belongs and allows you to move this question to a different page.
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
   * Gets or sets question visibility.
   *
   * If you want to display or hide a question based on a condition, specify the [`visibleIf`](https://surveyjs.io/form-library/documentation/question#visibleIf) property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   * @see isVisible
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
    if (!this.isVisible && this.errors && this.errors.length > 0) {
      this.errors = [];
    }
  }
  /**
   * Specifies whether to use display names for question values in placeholders.
   *
   * Default value: `true`
   *
   * This property applies to questions whose values are defined as objects with the `value` and `text` properties (for example, [choice items](https://surveyjs.io/form-library/documentation/questionradiogroupmodel#choices) in Radiogroup, Checkbox, and Dropdown questions).
   *
   * You can use question values as placeholders in the following places:
   *
   * - Survey element titles and descriptions
   * - The [`expression`](https://surveyjs.io/form-library/documentation/questionexpressionmodel#expression) property of the [Expression](https://surveyjs.io/form-library/documentation/questionexpressionmodel) question
   * - The [`html`](https://surveyjs.io/form-library/documentation/questionhtmlmodel#html) property of the [HTML](https://surveyjs.io/form-library/documentation/questionhtmlmodel) question
   *
   * To use a question value as a placeholder, specify the question `name` in curly brackets: `{questionName}`. Refer to the following help topic for more information: [Dynamic Texts - Question Values](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#question-values).
   */
  public get useDisplayValuesInDynamicTexts(): boolean {
    return this.getPropertyValue("useDisplayValuesInDynamicTexts");
  }
  public set useDisplayValuesInDynamicTexts(val: boolean) {
    this.setPropertyValue("useDisplayValuesInDynamicTexts", val);
  }
  protected getUseDisplayValuesInDynamicTexts(): boolean { return this.useDisplayValuesInDynamicTexts; }
  /**
   * A Boolean expression. If it evaluates to `false`, this question becomes hidden.
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
  /**
   * Returns `true` if the question is visible or the survey is currently in design mode.
   *
   * If you want to display or hide a question based on a condition, specify the [`visibleIf`](https://surveyjs.io/form-library/documentation/question#visibleIf) property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   * @see visibleIf
   * @see visible
   * @see isParentVisible
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
   * Hides the question number from the title and excludes the question from numbering.
   *
   * If you want to disable question numbering in the entire survey, set SurveyModel's `showQuestionNumbers` property to `false`.
   * @see SurveyModel.showQuestionNumbers
   */
  public get hideNumber(): boolean {
    return this.getPropertyValue("hideNumber");
  }
  public set hideNumber(val: boolean) {
    this.setPropertyValue("hideNumber", val);
    this.notifySurveyVisibilityChanged();
  }
  /**
   * Returns `true` if the question can display its title to the left of the input field.
   * @see titleLocation
   * @see getTitleLocation
   * @see hasTitle
   */
  public get isAllowTitleLeft(): boolean {
    return true;
  }
  /**
   * Returns the question type.
   * Possible values:
   * - [*"boolean"*](https://surveyjs.io/Documentation/Library?id=questionbooleanmodel)
   * - [*"checkbox"*](https://surveyjs.io/Documentation/Library?id=questioncheckboxmodel)
   * - [*"comment"*](https://surveyjs.io/Documentation/Library?id=questioncommentmodel)
   * - [*"dropdown"*](https://surveyjs.io/Documentation/Library?id=questiondropdownmodel)
   * - [*"tagbox"*](https://surveyjs.io/form-library/documentation/questiontagboxmodel)
   * - [*"expression"*](https://surveyjs.io/Documentation/Library?id=questionexpressionmodel)
   * - [*"file"*](https://surveyjs.io/Documentation/Library?id=questionfilemodel)
   * - [*"html"*](https://surveyjs.io/Documentation/Library?id=questionhtmlmodel)
   * - [*"image"*](https://surveyjs.io/Documentation/Library?id=questionimagemodel)
   * - [*"imagepicker"*](https://surveyjs.io/Documentation/Library?id=questionimagepickermodel)
   * - [*"matrix"*](https://surveyjs.io/Documentation/Library?id=questionmatrixmodel)
   * - [*"matrixdropdown"*](https://surveyjs.io/Documentation/Library?id=questionmatrixdropdownmodel)
   * - [*"matrixdynamic"*](https://surveyjs.io/Documentation/Library?id=questionmatrixdynamicmodel)
   * - [*"multipletext"*](https://surveyjs.io/Documentation/Library?id=questionmultipletextmodel)
   * - [*"panel"*](https://surveyjs.io/Documentation/Library?id=panelmodel)
   * - [*"paneldynamic"*](https://surveyjs.io/Documentation/Library?id=questionpaneldynamicmodel)
   * - [*"radiogroup"*](https://surveyjs.io/Documentation/Library?id=questionradiogroupmodel)
   * - [*"rating"*](https://surveyjs.io/Documentation/Library?id=questionratingmodel)
   * - [*"ranking"*](https://surveyjs.io/Documentation/Library?id=questionrankingmodel)
   * - [*"signaturepad"*](https://surveyjs.io/Documentation/Library?id=questionsignaturepadmodel)
   * - [*"text"*](https://surveyjs.io/Documentation/Library?id=questiontextmodel)
   */
  public getType(): string {
    return "question";
  }
  public get isQuestion(): boolean {
    return true;
  }
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
  /**
   * Returns a survey element (panel or page) that contains the question and allows you to move this question to a different survey element.
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
  protected onParentChanged(): void { }
  /**
   * Returns `false` if the `titleLocation` property is set to `"hidden"` or if the question cannot have a title (for example, an [HTML](https://surveyjs.io/form-library/documentation/questionhtmlmodel) question).
   *
   * If the `title` property is `undefined` or set to an empty string, the `hasTitle` property returns `true`, because the question uses its `name` as a title in this case.
   * @see title
   * @see titleLocation
   */
  public get hasTitle(): boolean {
    return this.getTitleLocation() !== "hidden";
  }
  /**
   * Sets question title location relative to the input field. Overrides the `questionTitleLocation` property specified for the question's container (survey, page, or panel).
   *
   * Possible values:
   *
   * - `"default"` - Inherits the setting from the `questionTitleLocation` property specified for the question's container.
   * - `"top"` - Displays the title above the input field.
   * - `"bottom"` - Displays the title below the input field.
   * - `"left"` - Displays the title to the left of the input field.
   * - `"hidden"` - Hides the question title.
   *
   * > NOTE: Certain question types (Matrix, Multiple Text) do not support the `"left"` value. For them, the `"top"` value is used.
   * @see SurveyModel.questionTitleLocation
   * @see getTitleLocation
   * @see isAllowTitleLeft
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
  protected getIsTitleRenderedAsString(): boolean { return this.titleLocation === "hidden"; }
  private notifySurveyVisibilityChanged() {
    if (!this.survey || this.isLoadingFromJson) return;
    this.survey.questionVisibilityChanged(this, this.isVisible);
    if (this.isClearValueOnHidden) {
      if (!this.visible) {
        this.clearValueIfInvisible();
      }
      if (this.isVisible) {
        this.updateValueWithDefaults();
      }
    }
  }
  /**
   * Returns title location calculated based on the question's `titleLocation` property and the `questionTitleLocation` property of the question's containers (survey, page, or panel).
   * @see titleLocation
   * @see SurveyModel.questionTitleLocation
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
   * Returns `false` if the question has no input fields ([HTML](https://surveyjs.io/form-library/documentation/questionhtmlmodel), [Image](https://surveyjs.io/form-library/documentation/questionimagemodel), and similar question types).
   * @see hasSingleInput
   */
  public get hasInput(): boolean {
    return true;
  }
  /**
   * Returns `false` if the question has no input fields ([HTML](https://surveyjs.io/form-library/documentation/questionhtmlmodel), [Image](https://surveyjs.io/form-library/documentation/questionimagemodel)) or has multiple input fields ([Matrix](https://surveyjs.io/form-library/documentation/questionmatrixmodel), [Multiple Text](https://surveyjs.io/form-library/documentation/questionmultipletextmodel)).
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
   * Specifies where to display a question description.
   *
   * Possible values:
   *
   * - `"default"` (default) - Inherits the setting from the Survey's [`questionDescriptionLocation`](https://surveyjs.io/form-library/documentation/surveymodel#questionDescriptionLocation) property.
   * - `"underTitle"` - Displays the description under the question title.
   * - `"underInput"` - Displays the description under the interactive area.
   * @see description
   * @see hasDescription
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
  protected needClickTitleFunction(): boolean {
    return super.needClickTitleFunction() || this.hasInput;
  }
  protected processTitleClick() {
    super.processTitleClick();
    if (this.isCollapsed) return;
    setTimeout(() => {
      this.focus();
    }, 1);
    return true;
  }
  /**
   * Specifies a custom error message for a required form field.
   * @see isRequired
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
   * Specifies a caption displayed above the comment area. Applies when the `showCommentArea` property is `true`.
   * @see showCommentArea
   * @see comment
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
   * A placeholder for the comment area. Applies when the `showCommentArea` property is `true`.
   * @see showCommentArea
   * @see comment
   * @see commentText
   */
  @property({ localizable: true }) commentPlaceholder: string;

  public get commentPlaceHolder(): string {
    return this.commentPlaceholder;
  }
  public set commentPlaceHolder(newValue: string) {
    this.commentPlaceholder = newValue;
  }

  public get commentOrOtherPlaceholder(): string {
    return this.otherPlaceholder || this.commentPlaceholder;
  }

  public getAllErrors(): Array<SurveyError> {
    return this.errors.slice();
  }
  public getErrorByType(errorType: string): SurveyError {
    for (let i = 0; i < this.errors.length; i++) {
      if (this.errors[i].getErrorType() === errorType) return this.errors[i];
    }
    return null;
  }
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
  public localeChanged() {
    super.localeChanged();
    if (!!this.localeChangedCallback) {
      this.localeChangedCallback();
    }
  }
  public get isCompositeQuestion(): boolean {
    return false;
  }
  public updateCommentElement(): void {
    if (this.commentElement && this.autoGrowComment) increaseHeightByContent(this.commentElement);
  }
  public onCommentInput(event: any): void {
    if (this.isInputTextUpdate) {
      if (event.target) {
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
    this.checkForResponsiveness(el);
  }
  public beforeDestroyQuestionElement(el: HTMLElement): void { }
  public get processedTitle(): string {
    var res = this.locProcessedTitle.textOrHtml;
    return res ? res : this.name;
  }
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
   * Disable this property if you want to render the current question on the same line or row with the previous question or panel.
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
      .append(cssClasses.expanded, !!this.isExpanded)
      .append(cssClasses.collapsed, !!this.isCollapsed)
      .append(cssClasses.withFrame, this.hasFrameV2)
      .append(cssClasses.nested, (this.hasParent || !this.isSingleInRow) && this.isDefaultV2Theme)
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
      .append(cssClasses.titleExpandable, this.state !== "default")
      .append(cssClasses.titleExpanded, this.isExpanded)
      .append(cssClasses.titleCollapsed, this.isCollapsed)
      .append(cssClasses.titleDisabled, this.isReadOnly)
      .append(cssClasses.titleOnError, this.containsErrors)
      .append(cssClasses.titleOnAnswer, !this.containsErrors && this.isAnswered)
      .toString();
  }
  public get cssDescription(): string {
    this.ensureElementCss();
    return this.cssClasses.description;
  }
  protected setCssDescription(val: string): void {
    this.setPropertyValue("cssDescription", "");
  }
  protected getCssDescription(cssClasses: any): string {
    return new CssClassBuilder()
      .append(this.cssClasses.descriptionUnderInput, this.hasDescriptionUnderInput)
      .append(this.cssClasses.description, this.hasDescriptionUnderTitle)
      .toString();
  }
  protected getIsErrorsModeTooltip() {
    return super.getIsErrorsModeTooltip() && !this.customWidget;
  }

  public showErrorOnCore(location: string): boolean {
    return !this.isErrorsModeTooltip && !this.showErrorsAboveQuestion && !this.showErrorsBelowQuestion && this.errorLocation === location;
  }

  public get showErrorOnTop(): boolean {
    return this.showErrorOnCore("top");
  }
  public get showErrorOnBottom(): boolean {
    return this.showErrorOnCore("bottom");
  }
  protected getIsTooltipErrorSupportedByParent(): boolean {
    if (this.parentQuestion) {
      return this.parentQuestion.getIsTooltipErrorInsideSupported();
    } else {
      return super.getIsTooltipErrorSupportedByParent();
    }
  }
  private get showErrorsOutsideQuestion(): boolean {
    return this.isDefaultV2Theme && !(this.hasParent && this.getIsTooltipErrorSupportedByParent());
  }
  public get showErrorsAboveQuestion(): boolean {
    return this.showErrorsOutsideQuestion && this.errorLocation === "top";
  }
  public get showErrorsBelowQuestion(): boolean {
    return this.showErrorsOutsideQuestion && this.errorLocation === "bottom";
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
      .append(cssClasses.error.outsideQuestion, this.showErrorsBelowQuestion || this.showErrorsAboveQuestion)
      .append(cssClasses.error.belowQuestion, this.showErrorsBelowQuestion)
      .append(cssClasses.error.aboveQuestion, this.showErrorsAboveQuestion)
      .append(cssClasses.error.tooltip, this.isErrorsModeTooltip)
      .append(cssClasses.error.locationTop, this.showErrorOnTop)
      .append(cssClasses.error.locationBottom, this.showErrorOnBottom)
      .toString();
  }
  public getRootCss(): string {
    return new CssClassBuilder()
      .append(this.cssRoot)
      .append(this.cssClasses.disabled, this.isReadOnly)
      .append(this.cssClasses.invisible, !this.isDesignMode && this.areInvisibleElementsShowing && !this.visible)
      .toString();
  }
  public updateElementCss(reNew?: boolean): void {
    super.updateElementCss(reNew);
    if (reNew) {
      this.updateQuestionCss(true);
    }
    this.onIndentChanged();
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
    this.setCssDescription(this.getCssDescription(cssClasses));
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

  public get renderCssRoot(): string {
    return this.cssClasses.root || undefined;
  }
  private onIndentChanged() {
    this.paddingLeft = this.getIndentSize(this.indent);
    this.paddingRight = this.getIndentSize(this.rightIndent);
  }
  private getIndentSize(indent: number): string {
    if (indent < 1 || !this.getSurvey() || !this.cssClasses || !this.cssClasses.indent) return "";
    return indent * this.cssClasses.indent + "px";
  }
  /**
   * Moves focus to the input field of this question.
   * @param onError Pass `true` if you want to focus an input field with the first validation error. Default value: `false` (focuses the first input field). Applies to question types with multiple input fields.
   */
  public focus(onError: boolean = false): void {
    if (this.isDesignMode) return;

    if (!!this.survey) {
      this.expandAllPanels(this.parent);
      this.survey.scrollElementToTop(this, this, null, this.id);
    }
    var id = !onError
      ? this.getFirstInputElementId()
      : this.getFirstErrorInputElementId();
    if (SurveyElement.FocusElement(id)) {
      this.fireCallback(this.focusCallback);
    }
  }
  private expandAllPanels(panel: IPanel) {
    if (!!panel && !!panel.parent) {
      if (panel.isCollapsed) {
        panel.expand();
      }
      this.expandAllPanels(panel.parent);
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
  public getFirstQuestionToFocus(withError: boolean): Question {
    return this.hasInput && (!withError || this.currentErrorCount > 0) ? this : null;
  }
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
   * Makes the question required. If a respondent skips a required question, the survey displays a validation error.
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
   * A Boolean expression. If it evaluates to `true`, this question becomes required.
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
  /**
   * Specifies whether to display a comment area. Incompatible with the `showOtherItem` property.
   * @see comment
   * @see commentText
   * @see showOtherItem
   */
  public get showCommentArea(): boolean {
    return this.getPropertyValue("showCommentArea", false);
  }
  public set showCommentArea(val: boolean) {
    if (!this.supportComment()) return;
    this.setPropertyValue("showCommentArea", val);
    if (this.showCommentArea) this.hasOther = false;
  }

  public get hasComment(): boolean {
    return this.showCommentArea;
  }
  public set hasComment(val: boolean) {
    this.showCommentArea = val;
  }

  /**
   * A value to assign to the `id` attribute of the rendered HTML element. A default `id` is generated automatically.
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
    return "textbox";
  }
  /**
   * Specifies whether to display the "Other" choice item. Incompatible with the `showCommentArea` property.
   *
   * @see otherText
   * @see otherItem
   * @see otherErrorText
   * @see showCommentArea
   */
  public get showOtherItem(): boolean {
    return this.getPropertyValue("showOtherItem", false);
  }
  public set showOtherItem(val: boolean) {
    if (!this.supportOther() || this.showOtherItem == val) return;
    this.setPropertyValue("showOtherItem", val);
    if (this.showOtherItem) this.hasComment = false;
    this.hasOtherChanged();
  }

  public get hasOther(): boolean {
    return this.showOtherItem;
  }
  public set hasOther(val: boolean) {
    this.showOtherItem = val;
  }

  protected hasOtherChanged(): void { }
  public get requireUpdateCommentValue(): boolean {
    return this.hasComment || this.hasOther;
  }
  public get isReadOnly(): boolean {
    const isParentReadOnly = !!this.parent && this.parent.isReadOnly;
    const isPareQuestionReadOnly = !!this.parentQuestion && this.parentQuestion.isReadOnly;
    const isSurveyReadOnly = !!this.survey && this.survey.isDisplayMode;
    return this.readOnly || isParentReadOnly || isSurveyReadOnly || isPareQuestionReadOnly;
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
   * A Boolean expression. If it evaluates to `false`, this question becomes read-only.
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
  public surveyChoiceItemVisibilityChange(): void { }
  public runCondition(values: HashTable<any>, properties: HashTable<any>): void {
    if (this.isDesignMode) return;
    if (!properties) properties = {};
    properties["question"] = this;
    this.runConditionCore(values, properties);
    if (!this.isValueChangedDirectly) {
      this.defaultValueRunner = this.getDefaultRunner(this.defaultValueRunner, this.defaultValueExpression);
      this.runDefaultValueExpression(this.defaultValueRunner, values, properties);
    }
  }
  /**
   * A question number or letter (depends on SurveyModel's `questionStartIndex` property).
   *
   * For invisible questions, this property returns an empty string.
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
    if (this.isEmpty()) {
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
   * Gets or sets the question value.
   * @see SurveyModel.setValue
   * @see SurveyModel.getValue
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
   * Sets the question's `value` and `comment` properties to `undefined`.
   * @see value
   * @see comment
   */
  public clearValue(): void {
    if (this.value !== undefined) {
      this.value = undefined;
    }
    if (!!this.comment) {
      this.comment = undefined;
    }
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
   * Returns `true` if a parent element (page or panel) is visible.
   */
  public get isParentVisible(): boolean {
    var parent = this.parent;
    while (parent) {
      if (!parent.isVisible) return false;
      parent = parent.parent;
    }
    return true;
  }
  public clearValueIfInvisible(reason: string = "onHidden"): void {
    if (this.clearIfInvisible === "none") return;
    if (reason === "onHidden" && this.clearIfInvisible === "onComplete") return;
    if (reason === "none" && (this.clearIfInvisible === "default" || this.clearIfInvisible === "none")) return;
    this.clearValueIfInvisibleCore();
  }
  protected clearValueIfInvisibleCore(): void {
    if (this.canClearValueAsInvisible()) {
      this.clearValue();
    }
  }
  /**
   * Specifies when to clear the question value if the question becomes invisible.
   *
   * Possible values:
   *
   * - `"default"` (default) - Inherits the setting from the Survey's [`clearInvisibleValues`](https://surveyjs.io/form-library/documentation/surveymodel#clearInvisibleValues) property.
   * - `"onHidden"` - Clears the value when the question becomes invisible. If a question is invisible on startup and has an initial value, this value will be cleared when the survey is complete.
   * - `"onComplete"` - Clears the value when the survey is complete.
   * - `"none"` - Never clears the value of an invisible question.
   * @see SurveyModel.clearInvisibleValues
   * @see visible
   * @see SurveyModel.onComplete
   */
  public get clearIfInvisible(): string {
    return this.getPropertyValue("clearIfInvisible");
  }
  public set clearIfInvisible(val: string) {
    this.setPropertyValue("clearIfInvisible", val);
  }
  public get displayValue(): any {
    if (this.isLoadingFromJson) return "";
    return this.getDisplayValue(true);
  }
  /**
   * Returns a display text that corresponds to the question value. For example, if you call this method for a Dropdown question, it returns an item text instead of an item value.
   * @param keysAsText Applies when the question value is an object (in Matrix, Multiple Text, and similar questions). Pass `true` if not only values in the object should be display texts, but also keys. Default value: `false`.
   * @param value Specify this parameter to get a display text for a specific value, not for the current question value. If the question value is an object, this parameter should be a similar object.
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
   * A default value for the question. Ignored for question types that cannot have a [value](https://surveyjs.io/form-library/documentation/question#value) (for example, HTML).
   *
   * The default value is used as a question value in the following cases:
   *
   * - While the survey is being loaded from JSON.
   * - The question is just added to the survey and does not yet have an answer.
   * - The respondent left the answer empty.
   * @see defaultValueExpression
   */
  public get defaultValue(): any {
    return this.getPropertyValue("defaultValue");
  }
  public set defaultValue(val: any) {
    if (this.isValueExpression(val)) {
      this.defaultValueExpression = val.substring(1);
      return;
    }
    this.setPropertyValue("defaultValue", this.convertDefaultValue(val));
    this.updateValueWithDefaults();
  }
  /**
   * An expression used to calculate the [defaultValue](https://surveyjs.io/form-library/documentation/question#defaultValue).
   *
   * This expression applies until the question [value](https://surveyjs.io/form-library/documentation/question#value) is specified by an end user or programmatically.
   *
   * An expression can reference other questions as follows:
   *
   * - `{other_question_name}`
   * - `{panel.other_question_name}` (to access questions inside the same dynamic panel)
   * - `{row.other_question_name}` (to access questions inside the same dynamic matrix or multi-column dropdown)
   *
   * An expression can also include built-in and custom functions for advanced calculations. For example, if the `defaultValue` should be today's date, set the `defaultValueExpression` to `"today()"`, and the corresponding built-in function will be executed each time the survey is loaded. Refer to the following help topic for more information: [Built-In Functions](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#built-in-functions).
   * @see defaultValue
   */
  public get defaultValueExpression(): any {
    return this.getPropertyValue("defaultValueExpression");
  }
  public set defaultValueExpression(val: any) {
    this.setPropertyValue("defaultValueExpression", val);
    this.defaultValueRunner = undefined;
    this.updateValueWithDefaults();
  }
  public get resizeStyle() {
    return this.autoGrowComment ? "none" : "both";
  }
  /**
   * Returns the question value as an object in which the question name, title, value, and other parameters are stored as individual properties.
   *
   * If the question can have more than one value (Matrix, Multiple Text), the object enables the `isNode` flag and stores information about these values in the `data` property. Refer to the following help topic for more information: [Access Full Survey Results](https://surveyjs.io/form-library/documentation/handle-survey-results-access#access-full-survey-results).
   *
   * Pass an object with the `includeEmpty` property set to `false` if you want to skip empty answers.
   */
  public getPlainData(
    options?: {
      includeEmpty?: boolean,
      includeQuestionTypes?: boolean,
      calculations?: Array<{
        propertyName: string,
      }>,
    }
  ): IQuestionPlainData {
    if (!options) {
      options = { includeEmpty: true, includeQuestionTypes: false };
    }
    if (options.includeEmpty || !this.isEmpty()) {
      var questionPlainData: IQuestionPlainData = {
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
   * A correct answer to this question. Specify this property if you want to [create a quiz](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz).
   * @see SurveyModel.getCorrectAnswerCount
   * @see SurveyModel.getInCorrectAnswerCount
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
   * The number of quiz questions. A question counts if it is visible, has an input field, and specifies `correctAnswer`.
   * @see [Create a Quiz](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz)
   * @see correctAnswer
   * @see SurveyModel.getQuizQuestions
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
    if (this.isClearValueOnHidden && !this.isVisible) return;
    if (this.isDesignMode && this.isContentElement && this.isDefaultValueEmpty()) return;
    this.setDefaultValue();
  }
  protected get isClearValueOnHidden(): boolean {
    if (this.clearIfInvisible === "none" || this.clearIfInvisible === "onComplete") return false;
    if (this.clearIfInvisible === "onHidden") return true;
    return !!this.survey && this.survey.isClearValueOnHidden;
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
  protected getDefaultRunner(runner: ExpressionRunner, expression: string): ExpressionRunner {
    if (!runner && !!expression) {
      runner = new ExpressionRunner(expression);
    }
    if (!!runner) {
      runner.expression = expression;
    }
    return runner;
  }
  protected setDefaultValue(): void {
    this.defaultValueRunner = this.getDefaultRunner(this.defaultValueRunner, this.defaultValueExpression);
    this.setValueAndRunExpression(
      this.defaultValueRunner,
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
    runner: ExpressionRunner,
    defaultValue: any,
    setFunc: (val: any) => void,
    values: HashTable<any> = null,
    properties: HashTable<any> = null
  ): void {
    const func = (val: any) => {
      this.runExpressionSetValue(val, setFunc);
    };
    if (!this.runDefaultValueExpression(runner, values, properties, func)) {
      func(defaultValue);
    }
  }
  private runExpressionSetValue(val: any, setFunc?: (val: any) => void): void {
    setFunc(Helpers.convertValToQuestionVal(val));
  }
  private runDefaultValueExpression(runner: ExpressionRunner, values: HashTable<any> = null,
    properties: HashTable<any> = null, setFunc?: (val: any) => void): boolean {
    if (!runner || !this.data) return false;
    if (!setFunc) {
      setFunc = (val: any): void => {
        this.runExpressionSetValue(val, (val: any): void => { this.value = val; });
      };
    }
    if (!values) values = this.data.getFilteredValues();
    if (!properties) properties = this.data.getFilteredProperties();
    if (!!runner && runner.canRun) {
      runner.onRunComplete = (res) => {
        if (res == undefined) res = this.defaultValue;
        this.isChangingViaDefaultValue = true;
        setFunc(res);
        this.isChangingViaDefaultValue = false;
      };
      runner.run(values, properties);
    }
    return true;
  }
  /**
   * A comment to the selected question value. Enable the `showCommentArea` property to allow users to leave comments.
   * @see showCommentArea
   * @see commentText
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
   * Returns `true` if the question value is an empty string, array, or object or if it equals `undefined` or `null`.
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
    if (oldVal !== this.isAnswered) {
      this.updateQuestionCss();
    }
  }
  protected getIsAnswered(): boolean {
    return !this.isEmpty();
  }
  /**
   * Question validators.
   * @see [Data Validation](https://surveyjs.io/form-library/documentation/data-validation)
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
  public get currentErrorCount(): number {
    return this.errors.length;
  }
  /**
   * Returns a character or text string that indicates a required question.
   * @see SurveyModel.requiredText
   * @see isRequired
   */
  public get requiredText(): string {
    return this.survey != null && this.isRequired
      ? this.survey.requiredText
      : "";
  }
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
      const err = new AnswerRequiredError(this.requiredErrorText, this);
      err.onUpdateErrorTextCallback = (err) => { err.text = this.requiredErrorText; };
      errors.push(err);
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
    if (this.questionComment === newValue) return;
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
  protected onChangeQuestionValue(newValue: any): void { }
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true): void {
    const isEqual = this.isTwoValueEquals(this.questionValue, newValue);
    if (!isEqual && !this.isChangingViaDefaultValue) {
      this.isValueChangedDirectly = true;
    }
    this.questionValue = newValue;
    if (!isEqual) {
      this.onChangeQuestionValue(newValue);
    }
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
   * Removes values that cannot be assigned to this question, for example, choices unlisted in the `choices` array.
   *
   * Call this method after you assign new question values in code to ensure that they are acceptable.
   *
   * > NOTE: This method does not remove values that do not pass validation. Call the `hasErrors()` method to validate newly assigned values.
   *
   * @see hasErrors
   */
  public clearIncorrectValues(): void { }
  public clearOnDeletingContainer(): void { }
  /**
   * Empties the `errors` array.
   * @see errors
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
      const propName = props[i];
      if (this.isValueEmpty(value) && Helpers.isNumber(this[propName])) {
        value = 0;
      }
      this[propName] = value;
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
  public transformToMobileView(): void { }
  public transformToDesktopView(): void { }
  public needResponsiveWidth() {
    return false;
  }
  //responsiveness methods
  protected supportResponsiveness(): boolean {
    return false;
  }

  protected needResponsiveness(): boolean {
    return this.supportResponsiveness() && this.isDefaultV2Theme && !this.isDesignMode;
  }

  protected checkForResponsiveness(el: HTMLElement): void {
    if (this.needResponsiveness()) {
      if (this.isCollapsed) {
        const onStateChanged = () => {
          if (this.isExpanded) {
            this.initResponsiveness(el);
            this.unregisterPropertyChangedHandlers(["state"], "for-responsiveness");
          }
        };
        this.registerPropertyChangedHandlers(["state"], onStateChanged, "for-responsiveness");
      } else {
        this.initResponsiveness(el);
      }
    }
  }
  private resizeObserver: ResizeObserver;

  protected getObservedElementSelector(): string {
    return ".sd-scrollable-container";
  }

  private onMobileChanged() {
    this.onMobileChangedCallback && this.onMobileChangedCallback();
  }

  private onMobileChangedCallback: () => void;

  private initResponsiveness(el: HTMLElement) {
    this.destroyResizeObserver();
    if (!!el && this.isDefaultRendering()) {
      const scrollableSelector = this.getObservedElementSelector();
      if (!scrollableSelector) return;
      const defaultRootEl = el.querySelector(scrollableSelector);
      if (!defaultRootEl) return;
      let isProcessed = false;
      let requiredWidth: number = undefined;
      this.resizeObserver = new ResizeObserver(() => {
        const rootEl = <HTMLElement>el.querySelector(scrollableSelector);
        if (!requiredWidth && this.isDefaultRendering()) {
          requiredWidth = rootEl.scrollWidth;
        }
        if (isProcessed || !isContainerVisible(rootEl)) {
          isProcessed = false;
        } else {
          isProcessed = this.processResponsiveness(requiredWidth, getElementWidth(rootEl));
        }
      });
      this.onMobileChangedCallback = () => {
        setTimeout(() => {
          const rootEl = <HTMLElement>el.querySelector(scrollableSelector);
          this.processResponsiveness(requiredWidth, getElementWidth(rootEl));
        }, 0);
      };
      this.resizeObserver.observe(el);
    }
  }
  protected getCompactRenderAs(): string {
    return "default";
  }
  protected getDesktopRenderAs(): string {
    return "default";
  }
  protected processResponsiveness(requiredWidth: number, availableWidth: number): any {
    availableWidth = Math.round(availableWidth);
    if (Math.abs(requiredWidth - availableWidth) > 2) {
      const oldRenderAs = this.renderAs;
      if (requiredWidth > availableWidth) {
        this.renderAs = this.getCompactRenderAs();
      } else {
        this.renderAs = this.getDesktopRenderAs();
      }
      return oldRenderAs !== this.renderAs;
    }
    return false;
  }
  private destroyResizeObserver() {
    if (!!this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
      this.onMobileChangedCallback = undefined;
      this.renderAs = this.getDesktopRenderAs();
    }
  }
  public dispose() {
    super.dispose();
    this.destroyResizeObserver();
  }
}
function removeConverChar(str: string): string {
  if (!!str && str[0] === settings.expressionDisableConversionChar) return str.substring(1);
  return str;
}
Serializer.addClass("question", [
  { name: "!name", onSettingValue: (obj: any, val: any): any => { return removeConverChar(val); } },
  {
    name: "state",
    default: "default",
    choices: ["default", "collapsed", "expanded"],
  },
  { name: "visible:switch", default: true },
  { name: "useDisplayValuesInDynamicTexts:boolean", alternativeName: "useDisplayValuesInTitle", default: true, layout: "row" },
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
  {
    name: "title:text", serializationProperty: "locTitle", layout: "row", dependsOn: "name",
    onPropertyEditorUpdate: function (obj: any, editor: any) {
      if (!!obj && !!editor) {
        editor.placeholder = obj.name;
      }
    }
  },
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
  { name: "valueName", onSettingValue: (obj: any, val: any): any => { return removeConverChar(val); } },
  "enableIf:condition",
  "defaultValue:value",
  {
    name: "defaultValueExpression:expression",
    category: "logic",
  },
  "correctAnswer:value",
  {
    name: "clearIfInvisible",
    default: "default",
    choices: ["default", "none", "onComplete", "onHidden"],
  },
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
  { name: "showCommentArea", visible: false, default: false, alternativeName: "hasComment" }
]);
Serializer.addAlterNativeClassName("question", "questionbase");
