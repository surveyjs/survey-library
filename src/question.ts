import { HashTable, Helpers } from "./helpers";
import { JsonObject } from "./jsonobject";
import { QuestionBase } from "./questionbase";
import { Base, SurveyError, SurveyElement } from "./base";
import { surveyLocalization } from "./surveyStrings";
import { AnswerRequiredError } from "./error";
import { SurveyValidator, IValidatorOwner, ValidatorRunner } from "./validator";
import { TextPreProcessor, TextPreProcessorValue } from "./textPreProcessor";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { ConditionRunner } from "./conditions";

/**
 * Extends question base class with title, value, errors and other functionality
 */
export class Question extends QuestionBase implements IValidatorOwner {
  private static TextPreprocessorValuesMap = {
    title: "processedTitle",
    require: "requiredText"
  };
  private questionValue: any;
  private questionComment: string;
  private textPreProcessor: TextPreProcessor;
  private conditionEnabelRunner: ConditionRunner;
  private validatorsValue: Array<SurveyValidator>;
  valueChangedCallback: () => void;
  commentChangedCallback: () => void;
  validateValueCallback: () => SurveyError;
  questionTitleTemplateCallback: () => string;

  constructor(public name: string) {
    super(name);
    var self = this;
    this.validatorsValue = this.createNewArray("validators", function(
      validator
    ) {
      validator.locOwner = self;
    });
    var locTitleValue = this.createLocalizableString("title", this, true);
    locTitleValue.onRenderedHtmlCallback = function(text) {
      return self.fullTitle;
    };
    var locDescriptionValue = this.createLocalizableString(
      "description",
      this,
      true
    );
    this.createLocalizableString("commentText", this, true);
    this.createLocalizableString("requiredErrorText", this);
  }
  public getValueName(): string {
    return this.valueName ? this.valueName : this.name;
  }
  public get valueName(): string {
    return this.getPropertyValue("valueName", "");
  }
  public set valueName(val: string) {
    this.setPropertyValue("valueName", val);
  }
  /**
   * Returns true if the question may have a title located on the left
   */
  public get isAllowTitleLeft(): boolean {
    return true;
  }
  public getType(): string {
    return "question";
  }
  public get hasTitle(): boolean {
    return this.getTitleLocation() !== "hidden";
  }
  public get hasDescription(): boolean {
    return this.description != "";
  }
  /**
   * Set this property different from "default" to set the specific question title location for this panel/page.
   * @see SurveyModel.questionTitleLocation
   */
  public get titleLocation(): string {
    return this.getPropertyValue("questionTitleLocation", "default");
  }
  public set titleLocation(value: string) {
    var isVisibilityChanged =
      this.titleLocation == "hidden" || value == "hidden";
    this.setPropertyValue("questionTitleLocation", value.toLowerCase());
    if (isVisibilityChanged && this.survey) {
      this.survey.questionVisibilityChanged(this, this.visible);
    }
  }
  /**
   * Return the title location based on question titleLocation property and QuestionTitleLocation of it's parents
   * @see titleLocation
   * @see PanelModelBase.QuestionTitleLocation
   * @see SurveyModel.QuestionTitleLocation
   */
  public getTitleLocation(): string {
    var location = this.getTitleLocationCore();
    if (location === "left" && !this.isAllowTitleLeft) location = "top";
    return location;
  }
  protected getTitleLocationCore(): string {
    if (this.titleLocation !== "default") return this.titleLocation;
    var location = "top";
    if (this.parent) {
      location = this.parent.getQuestionTitleLocation();
    } else if (this.survey) {
      location = this.survey.questionTitleLocation;
    }
    return location;
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
  public get hasInput(): boolean {
    return true;
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
   * The custom text that will be shown on required error. Use this property, if you do not want to show the default text.
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
  private get locTitleHtml(): string {
    var res = this.locTitle.textOrHtml;
    return res ? res : this.name;
  }
  /**
   * Returns a copy of question errors survey. For some questions like matrix and panel dynamic it includes the errors of nested questions.
   */
  public getAllErrors(): Array<SurveyError> {
    return this.errors.slice();
  }
  /**
   * Returns the rendred question title.
   */
  public get processedTitle() {
    var res = this.locTitle.textOrHtml;
    return res ? res : this.name;
    //return this.getProcessedHtml(this.locTitleHtml);
  }
  /**
   * Returns the title after processing the question template.
   * @see SurveyModel.questionTitleTemplate
   */
  public get fullTitle(): string {
    var res = this.calcFullTitle();
    if (!this.survey) return res;
    return this.survey.getUpdatedQuestionTitle(this, res);
  }
  protected getQuestionTitleTemplate() {
    if (this.questionTitleTemplateCallback)
      return this.questionTitleTemplateCallback();
    return !!this.survey ? this.survey.getQuestionTitleTemplate() : null;
  }
  private calcFullTitle(): string {
    if (this.getQuestionTitleTemplate()) {
      if (!this.textPreProcessor) {
        var self = this;
        this.textPreProcessor = new TextPreProcessor();
        this.textPreProcessor.onProcess = function(
          textValue: TextPreProcessorValue
        ) {
          self.getProcessedTextValue(textValue);
        };
      }
      return this.textPreProcessor.process(this.getQuestionTitleTemplate());
    }
    var requireText = this.requiredText;
    if (requireText) requireText += " ";
    var no = this.no;
    if (no) no += ". ";
    return no + requireText + this.processedTitle;
  }
  public focus(onError: boolean = false) {
    SurveyElement.ScrollElementToTop(this.id);
    var id = !onError
      ? this.getFirstInputElementId()
      : this.getFirstErrorInputElementId();
    if (SurveyElement.FocusElement(id)) {
      this.fireCallback(this.focusCallback);
    }
  }
  protected updateCssClasses(res: any, surveyCss: any) {
    super.updateCssClasses(res, surveyCss);
    if (this.isRequired) {
      if (surveyCss.question.required) {
        res.root += " " + surveyCss.question.required;
      }
      if (surveyCss.question.titleRequired) {
        res.title += " " + surveyCss.question.titleRequired;
      }
    }
  }
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
      this[textValue.name] !== undefined;
    textValue.value = this[
      Question.TextPreprocessorValuesMap[name] || textValue.name
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
   */
  public get isRequired(): boolean {
    return this.getPropertyValue("isRequired", false);
  }
  public set isRequired(val: boolean) {
    if (this.isRequired == val) return;
    this.setPropertyValue("isRequired", val);
    this.locTitle.strChanged();
  }
  public get hasComment(): boolean {
    return this.getPropertyValue("hasComment", false);
  }
  public set hasComment(val: boolean) {
    if (!this.supportComment()) return;
    this.setPropertyValue("hasComment", val);
    if (this.hasComment) this.hasOther = false;
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
  /**
   * Retuns true if readOnly property is true or survey is in display mode.
   * @see SurveyModel.model
   * @see readOnly
   */
  public get isReadOnly() {
    return this.readOnly || (this.survey != null && this.survey.isDisplayMode);
  }
  /**
   * Set it to true to make a question readonly.
   */
  /**
   * Set it to true to make the question readonly.
   */
  public get readOnly(): boolean {
    return this.getPropertyValue("readOnly", false);
  }
  public set readOnly(val: boolean) {
    if (this.readOnly == val) return;
    this.setPropertyValue("readOnly", val);
    this.onReadOnlyChanged();
  }
  /**
   * An expression that returns true or false. If it returns false the Question becomes read only and an end-user will not able to answer on the qustion. The library runs the expression on survey start and on changing a question value. If the property is empty then readOnly property is used.
   * @see readOnly
   * @see isReadOnly
   */
  public get enableIf(): string {
    return this.getPropertyValue("enableIf", "");
  }
  public set enableIf(val: string) {
    this.setPropertyValue("enableIf", val);
  }

  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
    if (this.isDesignMode) return;
    super.runCondition(values, properties);
    if (!this.enableIf) return;
    if (!this.conditionEnabelRunner)
      this.conditionEnabelRunner = new ConditionRunner(this.enableIf);
    this.conditionEnabelRunner.expression = this.enableIf;
    this.readOnly = !this.conditionEnabelRunner.run(values, properties);
  }
  public readOnlyChangedCallback: () => void;
  onReadOnlyChanged() {
    this.setPropertyValue("isReadOnly", this.isReadOnly);
    this.fireCallback(this.readOnlyChangedCallback);
  }
  protected get no(): string {
    if (this.visibleIndex < 0) return "";
    var startIndex = 1;
    var isNumeric = true;
    var str = "";
    if (this.survey && this.survey.questionStartIndex) {
      str = this.survey.questionStartIndex;
      if (parseInt(str)) startIndex = parseInt(str);
      else if (str.length == 1) isNumeric = false;
    }
    if (isNumeric) return (this.visibleIndex + startIndex).toString();
    return String.fromCharCode(str.charCodeAt(0) + this.visibleIndex);
  }
  public onSurveyLoad() {
    super.onSurveyLoad();
    this.updateValueWithDefaults();
  }
  protected onSetData() {
    super.onSetData();
    this.onSurveyValueChanged(this.value);
    this.updateValueWithDefaults();
  }
  private isvalueChangedCallbackFiring: boolean = false;
  /**
   * Get/Set the question value.
   * @see SurveyMode.setValue
   * @see SurveyMode.getValue
   */
  public get value(): any {
    return this.valueFromData(this.getValueCore());
  }
  public set value(newValue: any) {
    this.setNewValue(newValue);
    if (this.isvalueChangedCallbackFiring) return;
    this.isvalueChangedCallbackFiring = true;
    this.fireCallback(this.valueChangedCallback);
    this.isvalueChangedCallbackFiring = false;
  }
  public clearValue() {
    this.value = null;
    this.comment = null;
  }
  private canClearValueAsInvisible(): boolean {
    if (this.isVisible && this.isParentVisible) return false;
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
  public getDisplayValue(keysAsText: boolean): any {
    if (this.customWidget) {
      var res = this.customWidget.getDisplayValue(this);
      if (res) return res;
    }
    return this.getDisplayValueCore(keysAsText);
  }
  protected getDisplayValueCore(keyAsText: boolean): any {
    return this.value;
  }
  /**
   * Set the default value to the question. It will be assign to the question on loading the survey from JSON or adding a question to the survey or on setting this property of the value is empty.
   */
  public get defaultValue(): any {
    return this.getPropertyValue("defaultValue");
  }
  public set defaultValue(val: any) {
    this.setPropertyValue("defaultValue", val);
    this.updateValueWithDefaults();
  }
  /**
   * The correct answer on the question. Set this value if you are doing a quiz.
   * @see SurveyModel.correctAnswers
   * @see SurveyModel.inCorrectAnswers
   */
  public get correctAnswer(): any {
    return this.getPropertyValue("correctAnswer");
  }
  public set correctAnswer(val: any) {
    this.setPropertyValue("correctAnswer", val);
  }
  public isAnswerCorrect(): boolean {
    if (this.isValueEmpty(this.value) || this.isValueEmpty(this.correctAnswer))
      return false;
    return this.isTwoValueEquals(this.value, this.correctAnswer);
  }
  public updateValueWithDefaults() {
    if (
      this.isLoadingFromJson ||
      (!this.isDesignMode && this.isDefaultValueEmpty())
    )
      return;
    if (!this.isDesignMode && !this.isEmpty()) return;
    this.setDefaultValue();
  }
  protected isDefaultValueEmpty(): boolean {
    return this.isValueEmpty(this.defaultValue);
  }
  protected setDefaultValue() {
    this.value = this.defaultValue;
  }

  /**
   * The question comment value.
   */
  public get comment(): string {
    return this.getComment();
  }
  public set comment(newValue: string) {
    if (!!newValue) newValue = newValue.trim();
    if (this.comment == newValue) return;
    this.setComment(newValue);
    this.fireCallback(this.commentChangedCallback);
  }
  protected getComment(): string {
    return this.data != null
      ? this.data.getComment(this.getValueName())
      : this.questionComment;
  }
  protected setComment(newValue: string) {
    this.setNewComment(newValue);
  }
  /**
   * Returns true if the question value is empty
   */
  public isEmpty(): boolean {
    return this.isValueEmpty(this.value);
  }
  /**
   * The list of question validators.
   */
  public get validators(): Array<SurveyValidator> {
    return this.validatorsValue;
  }
  public set validators(val: Array<SurveyValidator>) {
    this.setPropertyValue("validators", val);
  }
  public addConditionNames(names: Array<string>) {
    names.push(this.name);
  }
  public getConditionJson(operator: string = null, path: string = null): any {
    var json = new JsonObject().toJsonObject(this);
    json["type"] = this.getType();
    return json;
  }
  /**
   * Returns true if threre is a validation error(s) in the question.
   * @param fireCallback set it to true to show an error in UI.
   */
  public hasErrors(fireCallback: boolean = true): boolean {
    this.checkForErrors(fireCallback);
    return this.errors.length > 0;
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
  public addError(error: SurveyError) {
    this.errors.push(error);
    this.fireCallback(this.errorsChangedCallback);
  }
  private checkForErrors(fireCallback: boolean) {
    var errorLength = this.errors ? this.errors.length : 0;
    this.errors = [];
    if (this.isVisible && !this.isReadOnly) {
      this.collectErrors();
    }
    if (
      fireCallback &&
      (errorLength != this.errors.length || errorLength > 0)
    ) {
      this.fireCallback(this.errorsChangedCallback);
    }
  }
  private collectErrors() {
    this.onCheckForErrors(this.errors);
    if (this.errors.length == 0) {
      var error = this.runValidators();
      if (error) {
        //validators may change the question value.
        this.errors = [];
        this.errors.push(error);
      }
    }
    if (this.survey && this.errors.length == 0) {
      var error = this.fireSurveyValidation();
      if (error) {
        this.errors.push(error);
      }
    }
  }
  private fireSurveyValidation(): SurveyError {
    if (this.validateValueCallback) return this.validateValueCallback();
    return this.survey ? this.survey.validateQuestion(this) : null;
  }
  protected onCheckForErrors(errors: Array<SurveyError>) {
    if (this.hasRequiredError()) {
      this.errors.push(new AnswerRequiredError(this.requiredErrorText));
    }
  }
  protected hasRequiredError(): boolean {
    return this.isRequired && this.isEmpty();
  }
  protected runValidators(): SurveyError {
    return new ValidatorRunner().run(this);
  }
  private isValueChangedInSurvey = false;
  protected setNewValue(newValue: any) {
    this.setNewValueInData(newValue);
    this.onValueChanged();
  }
  protected setNewValueInData(newValue: any) {
    if (!this.isValueChangedInSurvey) {
      newValue = this.valueToData(newValue);
      this.setValueCore(newValue);
    }
  }
  protected getValueCore() {
    return this.data != null
      ? this.data.getValue(this.getValueName())
      : this.questionValue;
  }
  private setValueCore(newValue: any) {
    if (this.data != null) {
      this.data.setValue(this.getValueName(), newValue);
    } else {
      this.questionValue = newValue;
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
    if (this.data != null) {
      this.data.setComment(this.getValueName(), newValue);
    } else this.questionComment = newValue;
  }
  //IQuestion
  onSurveyValueChanged(newValue: any) {
    this.isValueChangedInSurvey = true;
    this.value = this.valueFromData(newValue);
    this.fireCallback(this.commentChangedCallback);
    this.isValueChangedInSurvey = false;
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
}
JsonObject.metaData.addClass(
  "question",
  [
    { name: "title:text", serializationProperty: "locTitle" },
    { name: "description:text", serializationProperty: "locDescription" },
    { name: "commentText", serializationProperty: "locCommentText" },
    "valueName",
    "enableIf:condition",
    "defaultValue:value",
    "correctAnswer:value",
    "isRequired:boolean",
    {
      name: "requiredErrorText:text",
      serializationProperty: "locRequiredErrorText"
    },
    "readOnly:boolean",
    {
      name: "validators:validators",
      baseClassName: "surveyvalidator",
      classNamePart: "validator"
    },
    {
      name: "titleLocation",
      default: "default",
      choices: ["default", "top", "bottom", "left", "hidden"]
    }
  ],
  null,
  "questionbase"
);
