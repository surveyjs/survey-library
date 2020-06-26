import { HashTable, Helpers } from "./helpers";
import { JsonObject, Serializer } from "./jsonobject";
import {
  SurveyError,
  SurveyElement,
  IElement,
  IQuestion,
  IPanel,
  IConditionRunner,
  ISurveyImpl,
  IPage,
  Event,
} from "./base";
import { surveyLocalization } from "./surveyStrings";
import { AnswerRequiredError, CustomError } from "./error";
import { SurveyValidator, IValidatorOwner, ValidatorRunner } from "./validator";
import { TextPreProcessor, TextPreProcessorValue } from "./textPreProcessor";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { ConditionRunner } from "./conditions";
import { QuestionCustomWidget } from "./questionCustomWidgets";
import { CustomWidgetCollection } from "./questionCustomWidgets";
import { settings } from "./settings";
import { SurveyModel } from './survey';
import { PanelModel } from './panel';

export interface IConditionObject {
  name: string;
  text: string;
  question: Question;
}

/**
 * A base class for all questions.
 */
export class Question extends SurveyElement
  implements IQuestion, IConditionRunner, ILocalizableOwner, IValidatorOwner {
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
  private isCustomWidgetRequested: boolean = false;
  private customWidgetValue: QuestionCustomWidget;
  customWidgetData = { isNeedRender: true };
  focusCallback: () => void;
  surveyLoadCallback: () => void;

  private textPreProcessor: TextPreProcessor;
  private conditionEnabelRunner: ConditionRunner;
  private conditionRequiredRunner: ConditionRunner;
  valueChangedCallback: () => void;
  commentChangedCallback: () => void;
  validateValueCallback: () => SurveyError;
  questionTitleTemplateCallback: () => string;
  afterRenderQuestionCallback: (question: Question, element: any) => any;
  private locProcessedTitle: LocalizableString;
  protected isReadyValue: boolean = true;

  /**
   * The event is fired when isReady property of question is changed.
   * <br/> options.question - the question
   * <br/> options.isReady - current value of isReady
   * <br/> options.oldIsReady - old value of isReady
   */
  public onReadyChanged: Event<
    (sender: Question, options: any) => any,
    any
  > = new Event<(sender: Question, options: any) => any, any>();

  public isReadOnlyRenderDiv() {
    return this.isReadOnly && settings.readOnlyCommentRenderMode === "div";
  }

  constructor(public name: string) {
    super(name);
    this.id = Question.getQuestionId();
    this.onCreating();
    var self = this;
    this.createNewArray("validators", function (validator: any) {
      validator.errorOwner = self;
    });
    var locTitleValue = this.createLocalizableString("title", this, true);
    locTitleValue.onGetTextCallback = function (text) {
      if (!text) {
        text = self.name;
      }
      if (!self.survey) return text;
      return self.survey.getUpdatedQuestionTitle(this, text);
    };
    this.locProcessedTitle = new LocalizableString(this, true);
    this.locProcessedTitle.sharedData = locTitleValue;
    this.createLocalizableString("description", this, true);
    var locCommentText = this.createLocalizableString(
      "commentText",
      this,
      true
    );
    locCommentText.onGetTextCallback = function (text) {
      return !!text ? text : surveyLocalization.getString("otherItemText");
    };

    this.createLocalizableString("requiredErrorText", this);
    this.registerFunctionOnPropertyValueChanged("width", function () {
      self.updateElementCss();
      if (!!self.parent) {
        self.parent.elementWidthChanged(self);
      }
    });
    this.registerFunctionOnPropertiesValueChanged(
      ["indent", "rightIndent"],
      function () {
        self.onIndentChanged();
      }
    );

    this.registerFunctionOnPropertiesValueChanged(
      ["hasComment", "hasOther"],
      function () {
        self.initCommentFromSurvey();
      }
    );
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
  protected onValueNameChanged(oldValue: string) {
    if (!this.survey) return;
    this.survey.questionRenamed(
      this,
      this.name,
      !!oldValue ? oldValue : this.name
    );
    this.initDataFromSurvey();
  }
  protected onNameChanged(oldValue: string) {
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
   * Get is question ready to use
   */
  public choicesLoaded(): void {}
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
  public delete() {
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
  protected onVisibleChanged() {
    this.setPropertyValue("isVisible", this.isVisible);
    if (!this.isVisible && this.errors && this.errors.length > 0) {
      this.errors = [];
    }
  }
  /**
   * Use it to choose how other question values will be rendered in title if referenced in {}.
   * Please note, this property is hidden for question without input, for example html question.
   */
  public get useDisplayValuesInTitle(): boolean {
    return this.getPropertyValue("useDisplayValuesInTitle", true);
  }
  public set useDisplayValuesInTitle(val: boolean) {
    this.setPropertyValue("useDisplayValuesInTitle", val);
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
    return this.getPropertyValue("hideNumber", false);
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
  /**
   * Move question to a new container Page/Panel. Add as a last element if insertBefore parameter is not used or inserted into the given index,
   * if insert parameter is number, or before the given element, if the insertBefore parameter is a question or panel
   * @param container Page or Panel to where a question is relocated.
   * @param insertBefore Use it if you want to set the question to a specific position. You may use a number (use 0 to insert int the beginning) or element, if you want to insert before this element.
   */
  public moveTo(container: IPanel, insertBefore: any = null): boolean {
    return this.moveToBase(this.parent, container, insertBefore);
  }

  private runConditions() {
    if (this.data && !this.isLoadingFromJson && !this.isDesignMode) {
      this.runCondition(
        this.getDataFilteredValues(),
        this.getDataFilteredProperties()
      );
      this.locStrsChanged();
    }
  }
  public setSurveyImpl(value: ISurveyImpl) {
    super.setSurveyImpl(value);
    if (this.survey) {
      this.survey.questionCreated(this);
    }
    if (this.survey && this.survey.isDesignMode && !this.isDesignMode) {
      this.onVisibleChanged();
    }
    this.runConditions();
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
    this.updateElementCss();
    this.onParentChanged();
  }
  protected onParentChanged() {}
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
    if (!this.isLoadingFromJson) {
      this.updateElementCss();
    }
    if (isVisibilityChanged) {
      this.notifySurveyVisibilityChanged();
    }
  }
  private notifySurveyVisibilityChanged() {
    if (!this.survey || this.isLoadingFromJson) return;
    this.survey.questionVisibilityChanged(this, this.isVisible);
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
    var location = this.getTitleLocation();
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
  /**
   * Question title. Use survey questionTitleTemplate property to change the title question is rendered. If it is empty, then question name property is used.
   * @see SurveyModel.questionTitleTemplate
   */
  public get title(): string {
    return this.getLocalizableStringText("title", this.name);
  }
  public set title(val: string) {
    this.setLocalizableStringText("title", val);
  }
  get locTitle(): LocalizableString {
    return this.getLocalizableString("title");
  }
  /**
   * Question description. It renders under question title by using smaller font. Unlike the title, description can be empty.
   * Please note, this property is hidden for questions without input, for example html question.
   * @see title
   */
  public get description(): string {
    return this.getLocalizableStringText("description");
  }
  public set description(val: string) {
    this.setLocalizableStringText("description", val);
  }
  get locDescription(): LocalizableString {
    return this.getLocalizableString("description");
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
    return this.getLocalizableStringText(
      "commentText",
      surveyLocalization.getString("otherItemText")
    );
  }
  public set commentText(val: string) {
    this.setLocalizableStringText("commentText", val);
  }
  get locCommentText(): LocalizableString {
    return this.getLocalizableString("commentText");
  }
  /**
   * Returns a copy of question errors survey. For some questions like matrix and panel dynamic it includes the errors of nested questions.
   */
  public getAllErrors(): Array<SurveyError> {
    return this.errors.slice();
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
  public get isCompositeQuestion(): boolean {
    return false;
  }
  public afterRenderQuestionElement(el: any) {
    if (!this.survey || !this.hasSingleInput) return;
    this.survey.afterRenderQuestionInput(this, el);
  }
  public afterRender(el: any) {
    if (!this.survey) return;
    this.survey.afterRenderQuestion(this, el);
    if (!!this.afterRenderQuestionCallback) {
      this.afterRenderQuestionCallback(this, el);
    }
  }
  public beforeDestoyQuestionElement(el: any) {}
  /**
   * Returns the rendred question title.
   */
  public get processedTitle() {
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
  public get questionTitlePattern(): string {
    return !!this.survey ? this.survey.questionTitlePattern : "numTitleRequire";
  }
  public get isRequireTextOnStart() {
    return this.isRequired && this.questionTitlePattern == "requireNumTitle";
  }
  public get isRequireTextBeforeTitle() {
    return this.isRequired && this.questionTitlePattern == "numRequireTitle";
  }
  public get isRequireTextAfterTitle() {
    return this.isRequired && this.questionTitlePattern == "numTitleRequire";
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
    var css = this.css;
    var classes = { error: {} };
    this.copyCssClasses(classes, css.question);
    this.copyCssClasses(classes.error, css.error);
    this.updateCssClasses(classes, css);
    if (this.survey) {
      this.survey.updateQuestionCssClasses(this, classes);
    }
    this.updateElementCssCore(classes);
    return classes;
  }
  public get cssRoot(): string {
    return this.getPropertyValue("cssRoot", "");
  }
  protected setCssRoot(val: string) {
    this.setPropertyValue("cssRoot", val);
  }
  protected getCssRoot(cssClasses: any): string {
    var res =
      this.isFlowLayout && !this.isDesignMode
        ? cssClasses.flowRoot
        : cssClasses.mainRoot;
    if (!res) res = "";
    if (
      !this.isFlowLayout &&
      this.hasTitleOnLeft &&
      !!cssClasses.titleLeftRoot
    ) {
      res += " " + cssClasses.titleLeftRoot;
    }
    if (this.errors.length > 0 && !!cssClasses.hasError) {
      res += " " + cssClasses.hasError;
    }
    if (cssClasses.small && !this.width) {
      res += " " + cssClasses.small;
    }
    return res;
  }
  public get cssHeader(): string {
    return this.getPropertyValue("cssHeader", "");
  }
  protected setCssHeader(val: string) {
    this.setPropertyValue("cssHeader", val);
  }
  protected getCssHeader(cssClasses: any): string {
    var res = cssClasses.header || "";
    if (this.hasTitleOnTop && !!cssClasses.headerTop) {
      res += " " + cssClasses.headerTop;
    }
    if (this.hasTitleOnLeft && !!cssClasses.headerLeft) {
      res += " " + cssClasses.headerLeft;
    }
    if (this.hasTitleOnBottom && !!cssClasses.headerBottom) {
      res += " " + cssClasses.headerBottom;
    }
    return res;
  }
  public get cssContent(): string {
    return this.getPropertyValue("cssContent", "");
  }
  protected setCssContent(val: string) {
    this.setPropertyValue("cssContent", val);
  }
  protected getCssContent(cssClasses: any): string {
    var res = cssClasses.content || "";
    if (this.hasTitleOnLeft && !!cssClasses.contentLeft) {
      res += " " + cssClasses.contentLeft;
    }
    return res;
  }
  public get cssTitle(): string {
    return this.getPropertyValue("cssTitle", "");
  }
  protected setCssTitle(val: string) {
    this.setPropertyValue("cssTitle", val);
  }
  protected getCssTitle(cssClasses: any): string {
    var result = cssClasses.title;
    if (this.containsErrors) {
      if (!!cssClasses.titleOnError) {
        result += " " + cssClasses.titleOnError;
      }
    } else if (this.isAnswered && !!cssClasses.titleOnAnswer) {
      result += " " + cssClasses.titleOnAnswer;
    }
    return result;
  }
  public get cssError(): string {
    return this.getPropertyValue("cssError", "");
  }
  protected setCssError(val: string) {
    this.setPropertyValue("cssError", val);
  }
  //TODO was not removed from other places
  protected getCssError(cssClasses: any): string {
    var res = cssClasses.error.root || "";
    if (this.errorLocation == "top") {
      if (!!cssClasses.error.locationTop) {
        res += " " + cssClasses.error.locationTop;
      }
    } else if (
      this.errorLocation === "bottom" &&
      !!cssClasses.error.locationBottom
    ) {
      res += " " + cssClasses.error.locationBottom;
    }
    return res;
  }
  public updateElementCss() {
    if (this.isLoadingFromJson) return;
    this.updateElementCssCore(this.cssClasses);
  }
  protected updateElementCssCore(cssClasses: any) {
    this.setCssRoot(this.getCssRoot(cssClasses));
    this.setCssHeader(this.getCssHeader(cssClasses));
    this.setCssContent(this.getCssContent(cssClasses));
    this.setCssTitle(this.getCssTitle(cssClasses));
    this.setCssError(this.getCssError(cssClasses));
  }
  protected updateCssClasses(res: any, css: any) {
    if (!css.question) return;
    if (this.isRequired) {
      if (!!css.question.required) {
        res.root = (res.root ? res.root + " " : "") + objCss;
      }
      if (css.question.titleRequired) {
        res.title += " " + css.question.titleRequired;
      }
    }
    var objCss = css[this.getCssType()];
    if (objCss === undefined || objCss === null) return;
    if (typeof objCss === "string" || objCss instanceof String) {
      res.root = (res.root ? res.root + " " : "") + objCss;
    } else {
      for (var key in objCss) {
        res[key] = objCss[key];
      }
    }
  }
  protected getCssType(): string {
    return this.getType();
  }
  private get css(): any {
    return !!this.survey ? this.survey.getCss() : {};
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
  get paddingLeft(): string {
    return this.getPropertyValue("paddintLeft", "");
  }
  set paddingLeft(val: string) {
    this.setPropertyValue("paddintLeft", val);
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
    if (indent < 1) return "";
    return indent * this.cssClasses.indent + "px";
  }
  /**
   * Move the focus to the input of this question.
   * @param onError set this parameter to true, to focus the input with the first error, other wise the first input will be focused.
   */
  public focus(onError: boolean = false) {
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
  protected fireCallback(callback: () => void) {
    if (callback) callback();
  }
  public getOthersMaxLength(): any {
    if (!this.survey) return null;
    return this.survey.maxOthersLength > 0 ? this.survey.maxOthersLength : null;
  }
  protected onCreating() {}
  protected getFirstInputElementId(): string {
    return this.inputId;
  }
  protected getFirstErrorInputElementId(): string {
    return this.getFirstInputElementId();
  }
  protected getProcessedTextValue(textValue: TextPreProcessorValue) {
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
    return this.getPropertyValue("isRequired", false);
  }
  public set isRequired(val: boolean) {
    if (this.isRequired == val) return;
    this.setPropertyValue("isRequired", val);
    if (!this.isLoadingFromJson) {
      this.locTitle.onChanged();
    }
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
  protected hasOtherChanged() {}
  public get requireUpdateCommentValue() {
    return this.hasComment || this.hasOther;
  }
  /**
   * Returns true if readOnly property is true or survey is in display mode or parent panel/page is readOnly.
   * @see SurveyModel.model
   * @see readOnly
   */
  public get isReadOnly() {
    var isParentReadOnly = !!this.parent && this.parent.isReadOnly;
    var isSurveyReadOnly = !!this.survey && this.survey.isDisplayMode;
    return this.readOnly || isParentReadOnly || isSurveyReadOnly;
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
  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
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
    return Helpers.getNumberByIndex(this.visibleIndex, this.getStartIndex());
  }
  protected getStartIndex(): string {
    if (!!this.parent) return this.parent.getQuestionStartIndex();
    if (!!this.survey) return this.survey.questionStartIndex;
    return "";
  }
  public onSurveyLoad() {
    this.fireCallback(this.surveyLoadCallback);
    this.updateValueWithDefaults();
    this.updateDisplayValue();
    this.updateElementCss();
  }
  protected onSetData() {
    super.onSetData();
    this.initDataFromSurvey();
    this.onSurveyValueChanged(this.value);
    this.updateValueWithDefaults();
    this.updateElementCss();
  }
  protected initDataFromSurvey() {
    if (!!this.data) {
      this.updateValueFromSurvey(this.data.getValue(this.getValueName()));
      this.initCommentFromSurvey();
    }
  }
  protected initCommentFromSurvey() {
    if (!!this.data && this.requireUpdateCommentValue) {
      this.updateCommentFromSurvey(this.data.getComment(this.getValueName()));
    } else {
      this.updateCommentFromSurvey("");
    }
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
  public clearValue() {
    this.value = null;
    this.comment = null;
  }
  public createValueCopy(): any {
    return Helpers.getUnbindValue(this.value);
  }
  private canClearValueAsInvisible(): boolean {
    if (this.isVisible && this.isParentVisible) return false;
    if (!!this.page && this.page.isStarted) return false;
    if (!this.survey || !this.valueName) return true;
    return !this.survey.hasVisibleQuestionByValueName(this.valueName);
  }
  private get isParentVisible(): boolean {
    var parent = this.parent;
    while (parent) {
      if (!parent.isVisible) return false;
      parent = parent.parent;
    }
    return true;
  }
  public clearValueIfInvisible() {
    if (this.canClearValueAsInvisible()) {
      this.clearValue();
    }
  }
  public get displayValue(): any {
    this.updateDisplayValue();
    return this.getPropertyValue("displayValue", "");
  }
  protected updateDisplayValue(): any {
    if (this.isLoadingFromJson) return;
    this.setPropertyValue("displayValue", this.getDisplayValue(true));
  }
  /**
   * Return the question value as a display text. For example, for dropdown, it would return the item text instead of item value.
   * @param keysAsText Set this value to true, to return key (in matrices questions) as display text as well.
   * @param value use this parameter, if you want to get display value for this value and not question.value. It is undefined by default.
   */
  public getDisplayValue(keysAsText: boolean, value: any = undefined): any {
    if (this.customWidget) {
      var res = this.customWidget.getDisplayValue(this, value);
      if (res) return res;
    }
    value = value == undefined ? this.createValueCopy() : value;
    if (Helpers.isValueEmpty(value)) return "";
    return this.getDisplayValueCore(keysAsText, value);
  }
  protected getDisplayValueCore(keyAsText: boolean, value: any): any {
    return value;
  }
  /**
   * Set the default value to the question. It will be assign to the question on loading the survey from JSON or adding a question to the survey or on setting this property of the value is empty.
   * Please note, this property is hidden for question without input, for example html question.
   */
  public get defaultValue(): any {
    return this.getPropertyValue("defaultValue");
  }
  public set defaultValue(val: any) {
    this.setPropertyValue("defaultValue", val);
    this.updateValueWithDefaults();
  }
  /**
   * Returns question answer data as a plain object: with question title, name, value and displayValue.
   * For complex questions (like matrix, etc.) isNode flag is set to true and data contains array of nested objects (rows)
   * set options.includeEmpty to false if you want to skip empty answers
   */
  public getPlainData(
    options: {
      includeEmpty?: boolean;
      includeQuestionTypes?: boolean;
      calculations?: Array<{
        propertyName: string;
      }>;
    } = {
      includeEmpty: true,
      includeQuestionTypes: false,
    }
  ) {
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
    this.setPropertyValue("correctAnswer", val);
  }
  /**
   * Returns questions count: 1 for the non-matrix questions and all inner visible questions that has input(s) widgets for question of matrix types.
   * @see getQuizQuestions
   */
  public get quizQuestionCount(): number {
    if (
      this.isVisible &&
      this.hasInput &&
      !Helpers.isValueEmpty(this.correctAnswer)
    )
      return this.getQuizQuestionCount();
    return 0;
  }
  public get correctAnswerCount(): number {
    if (!this.isEmpty() && !this.isValueEmpty(this.correctAnswer))
      return this.getCorrectAnswerCount();
    return 0;
  }
  protected getQuizQuestionCount() {
    return 1;
  }
  protected getCorrectAnswerCount(): number {
    return this.isTwoValueEquals(this.value, this.correctAnswer, true) ? 1 : 0;
  }
  public isAnswerCorrect(): boolean {
    return this.correctAnswerCount == this.quizQuestionCount;
  }
  public updateValueWithDefaults() {
    if (
      this.isLoadingFromJson ||
      (!this.isDesignMode && this.isDefaultValueEmpty())
    )
      return;
    if (!this.isDesignMode && !this.isEmpty()) return;
    if (this.isEmpty() && this.isDefaultValueEmpty()) return;
    this.setDefaultValue();
  }
  getQuestionFromArray(name: string, index: number): IQuestion {
    return null;
  }
  public getDefaultValue(): any {
    return this.defaultValue;
  }
  protected isDefaultValueEmpty(): boolean {
    return this.isValueEmpty(this.defaultValue);
  }
  protected setDefaultValue() {
    this.value = Helpers.getUnbindValue(this.defaultValue);
  }

  /**
   * The question comment value.
   */
  public get comment(): string {
    return this.getQuestionComment();
  }
  public set comment(newValue: string) {
    if (!!newValue) {
      newValue = newValue.toString().trim();
    }
    if (this.comment == newValue) return;
    this.setQuestionComment(newValue);
  }
  protected getQuestionComment(): string {
    return this.questionComment;
  }
  protected setQuestionComment(newValue: string) {
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
  protected updateIsAnswered() {
    this.setPropertyValue("isAnswered", this.getIsAnswered());
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
    this.addSupportedValidators(res);
    return res;
  }
  protected addSupportedValidators(supportedValidators: Array<string>) {
    supportedValidators.push("expression");
  }
  public addConditionObjectsByContext(
    objects: Array<IConditionObject>,
    context: any
  ) {
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
      this.updateElementCss();
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
  public addError(error: SurveyError | string) {
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
  public removeError(error: SurveyError) {
    var errors = this.errors;
    var index = errors.indexOf(error);
    if (index !== -1) errors.splice(index, 1);
  }
  private checkForErrors(isOnValueChanged: boolean): Array<SurveyError> {
    var qErrors = new Array<SurveyError>();
    if (this.isVisible && !this.isReadOnly) {
      this.collectErrors(qErrors, isOnValueChanged);
    }
    return qErrors;
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
  protected onCheckForErrors(
    errors: Array<SurveyError>,
    isOnValueChanged: boolean
  ) {
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
  protected raiseOnCompletedAsyncValidators() {
    if (!!this.onCompletedAsyncValidators && !this.isRunningValidators) {
      this.onCompletedAsyncValidators(this.getAllErrors().length > 0);
      this.onCompletedAsyncValidators = null;
    }
  }
  private isValueChangedInSurvey = false;
  protected allowNotifyValueChanged = true;
  protected setNewValue(newValue: any) {
    var oldAnswered = this.isAnswered;
    this.setNewValueInData(newValue);
    this.allowNotifyValueChanged && this.onValueChanged();
    if (this.isAnswered != oldAnswered) {
      this.updateElementCss();
    }
  }
  protected locNotificationInData = false;
  protected isTextValue(): boolean {
    return false;
  }
  public get isSurveyInputTextUpdate(): boolean {
    return !!this.survey ? this.survey.isUpdateValueTextOnTyping : false;
  }
  private getDataLocNotification(): any {
    if (this.locNotificationInData) return this.locNotificationInData;
    return this.isInputTextUpdate ? "text" : false;
  }
  public get isInputTextUpdate() {
    return this.isSurveyInputTextUpdate && this.isTextValue();
  }
  protected setNewValueInData(newValue: any) {
    newValue = this.valueToData(newValue);
    if (!this.isValueChangedInSurvey) {
      this.setValueCore(newValue);
    }
  }
  protected getValueCore() {
    return this.questionValue;
  }
  protected setValueCore(newValue: any) {
    this.setQuestionValue(newValue);
    if (this.data != null) {
      this.data.setValue(
        this.getValueName(),
        newValue,
        this.getDataLocNotification(),
        this.allowNotifyValueChanged
      );
    }
  }
  protected valueFromData(val: any): any {
    return val;
  }
  protected valueToData(val: any): any {
    return val;
  }
  protected onValueChanged() {}
  protected setNewComment(newValue: string) {
    this.questionComment = newValue;
    if (this.data != null) {
      this.data.setComment(
        this.getValueName(),
        newValue,
        this.isSurveyInputTextUpdate ? "text" : false
      );
    }
  }
  //IQuestion
  updateValueFromSurvey(newValue: any) {
    newValue = Helpers.getUnbindValue(newValue);
    this.setQuestionValue(this.valueFromData(newValue));
  }
  updateCommentFromSurvey(newValue: any): any {
    this.questionComment = newValue;
  }
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true) {
    this.questionValue = newValue;
    this.allowNotifyValueChanged &&
      this.fireCallback(this.valueChangedCallback);
    if (updateIsAnswered) this.updateIsAnswered();
  }
  onSurveyValueChanged(newValue: any) {
    if (this.isLoadingFromJson) return;
    this.updateDisplayValue();
  }
  public setVisibleIndex(val: number): number {
    if (!this.isVisible || !this.hasTitle || this.hideNumber) {
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
  public supportGoNextPageError() {
    return true;
  }
  /**
   * Call this function to remove values from the current question, that end-user will not be able to enter.
   * For example the value that doesn't exists in a radigroup/dropdown/checkbox choices or matrix rows/columns.
   */
  public clearIncorrectValues() {}
  public clearOnDeletingContainer() {}
  /**
   * Call this function to clear all errors in the question
   */
  public clearErrors() {
    this.errors = [];
  }
  public clearUnusedValues() {}
  onAnyValueChanged(name: string) {}
  //ILocalizableOwner
  locOwner: ILocalizableOwner = null;
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
    if (this.textProcessor)
      return this.textProcessor.processText(text, this.useDisplayValuesInTitle);
    if (this.locOwner) return this.locOwner.getProcessedText(text);
    return text;
  }
  //ISurveyErrorOwner
  getErrorCustomText(text: string, error: SurveyError): string {
    if (!!this.survey) return this.survey.getErrorCustomText(text, error);
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
  public dispose() {}
}
Serializer.addClass("question", [
  "!name",
  { name: "visible:switch", default: true },
  { name: "useDisplayValuesInTitle:boolean", default: true, layout: "row" },
  "visibleIf:condition",
  { name: "width" },
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
    visibleIf: function(obj: any) {
      if(!obj) {
        return true;
      }
      if ((<Question>obj).titleLocation === "hidden") {
        return false;
      }
      var parent: PanelModel = obj ? obj.parent : null;
      var numberingAllowedByParent = !parent || parent.showQuestionNumbers !== "off";
      if (!numberingAllowedByParent) {
        return false;
      }
      var survey: SurveyModel = obj ? obj.survey : null;
      return !survey || survey.showQuestionNumbers !== "off" || (!!parent && parent.showQuestionNumbers === "onpanel");
    },
  },
  "valueName",
  "enableIf:condition",
  "defaultValue:value",
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
]);
Serializer.addAlterNativeClassName("question", "questionbase");
