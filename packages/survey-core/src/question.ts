import { HashTable, Helpers } from "./helpers";
import { JsonObject, Serializer } from "./jsonobject";
import { Base, EventBase } from "./base";
import { IElement, IQuestion, IPanel, IConditionRunner, ISurveyImpl, IPage, ITitleOwner, IProgressInfo, ISurvey, IPlainDataOptions, IDropdownMenuOptions, ISurveyElement } from "./base-interfaces";
import { SurveyElement } from "./survey-element";
import { AnswerRequiredError, CustomError } from "./error";
import { SurveyValidator, IValidatorOwner, ValidatorRunner, AsyncElementsRunner } from "./validator";
import { LocalizableString } from "./localizablestring";
import { ExpressionRunner } from "./conditions";
import { QuestionCustomWidget } from "./questionCustomWidgets";
import { CustomWidgetCollection } from "./questionCustomWidgets";
import { settings } from "./settings";
import { SurveyModel } from "./survey";
import { PanelModel } from "./panel";
import { RendererFactory } from "./rendererFactory";
import { SurveyError } from "./survey-error";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { getElementWidth, isContainerVisible } from "./utils/utils";
import { PopupModel } from "./popup";
import { ConsoleWarnings } from "./console-warnings";
import { IObjectValueContext, IValueGetterContext, IValueGetterContextGetValueParams, IValueGetterInfo, IValueGetterItem, ProcessValue, PropertyGetterContext, ValueGetter, ValueGetterContextCore, VariableGetterContext } from "./conditionProcessValue";
import { ITheme } from "./themes";
import { DomDocumentHelper, DomWindowHelper } from "./global_variables_utils";
import { ITextArea, TextAreaModel } from "./utils/text-area";
import { Action } from "./actions/action";
import { QuestionSingleInputSummary } from "./questionSingleInputSummary";
import { ActionContainer } from "./actions/container";

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

interface ITriggerExpressionInfo {
  name: string;
  canRun: () => boolean;
  doComplete: (res: any, properties: HashTable<any>) => void;
  secondName?: string;
}

export class QuestionValueGetterContext implements IValueGetterContext {
  constructor (protected question: Question, protected isUnwrapped?: boolean) {}
  public getObj(): Base { return this.question; }
  public getValue(params: IValueGetterContextGetValueParams): IValueGetterInfo {
    const path = params.path;
    const index = params.index;
    const expVar = settings.expressionVariables;
    if (params.isProperty && path.length > 1) {
      params.path = path.slice(1);
      params.isRoot = false;
      if (path[0].name === expVar.self) {
        return new PropertyGetterContext(this.question).getValue(params);
      }
      if (path[0].name === expVar.parent && !!this.question.parentQuestion) {
        return new PropertyGetterContext(this.question.parentQuestion).getValue(params);
      }
    }
    if (path.length === 0 || (path.length === 1 && path[0].name === expVar.self)) return this.getQuestionValue(index);
    if (path.length > 1 && path[0].name === expVar.panel) {
      params.isRoot = false;
      const panel: any = this.question.parent;
      if (panel && panel.isPanel) {
        path.shift();
        return params.isProperty ? new PropertyGetterContext(panel).getValue(params) :
          new QuestionArrayGetterContext(panel.questions).getValue(params);
      }
    }
    if (!this.question.isEmpty()) {
      let val = this.question.value;
      if (index >= 0) {
        if (!Array.isArray(val || index >= val.length)) return undefined;
        val = val[index];
      }
      params.isProperty = false;
      return new VariableGetterContext(val).getValue(params);
    }
    return undefined;
  }
  getTextValue(name: string, value: any, isDisplayValue: boolean): string {
    if (!isDisplayValue) return value;
    return this.question.getDisplayValue(true, value);
  }
  getRootObj(): IObjectValueContext { return <any>this.question.data; }
  getQuestion(): IQuestion { return this.question; }
  protected getSurveyValue(path: Array<IValueGetterItem>, index?: number): IValueGetterInfo {
    const survey = this.question.getSurvey();
    if (survey) return (<any>survey).getValueGetterContext().getValue({ path, isRoot: false, index });
    return undefined;
  }
  private getQuestionValue(index: number): IValueGetterInfo {
    const q = this.question;
    let val = q.getFilteredValue(this.isUnwrapped);
    if (index > -1 && Array.isArray(val)) {
      val = index < val.length ? val[index] : undefined;
    }
    return { isFound: true, context: this, value: val, requireStrictCompare: q.requireStrictCompare };
  }
}
export abstract class QuestionItemValueGetterContext extends ValueGetterContextCore {
  protected abstract getIndex(): number;
  protected abstract getQuestionData(): Question;
  protected getValueFromBindedQuestions(path: Array<IValueGetterItem>, objValue: any): IValueGetterInfo {
    if (typeof objValue !== "object") {
      objValue = undefined;
    }
    const name = path.length === 1 ? path[0].name : "";
    const qs = this.getQuestionsBySameValueNames();
    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      //TODO valuePropertyName
      if (!!name && q.valuePropertyName === name && !!objValue && objValue.hasOwnProperty(name)) {
        return { isFound: true, value: objValue[name], context: q.getValueGetterContext() };
      }
      const res = q.getValueGetterContext().getValue({ path, isRoot: false, index: this.getIndex() });
      if (!!res && res.isFound) return res;
    }
    return undefined;
  }
  private getQuestionsBySameValueNames(): Array<Question> {
    const res = new Array<Question>();
    const q = this.getQuestionData();
    if (!q || !q.isQuestion) return res;
    if (q.parent && q.parent.isPanel) {
      this.fillQuestions((<PanelModel>q.parent).getQuestionsByValueName(q.getValueName()), q, res);
    }
    if (res.length === 0 && !!q.survey) {
      this.fillQuestions((<any>q.survey).getQuestionsByValueName(q.getValueName()), q, res);
    }
    return res;
  }
  private fillQuestions(qs: Array<Question>, q: Question, res: Array<Question>): void {
    if (Array.isArray(qs)) {
      qs.forEach((question) => {
        if (question !== q) {
          res.push(question);
        }
      });
    }
  }
  getRootObj(): any { return this.getQuestionData(); }
}
export class QuestionArrayGetterContext extends ValueGetterContextCore {
  constructor(private questions: Array<Question>) {
    super();
  }
  protected isSearchNameRevert(): boolean { return true; }
  protected updateValueByItem(name: string, res: IValueGetterInfo): void {
    const lowName = name.toLocaleLowerCase();
    const unWrappedNameSuffix = settings.expressionVariables.unwrapPostfix;
    for (let i = 0; i < this.questions.length; i++) {
      const q = this.questions[i];
      const qName = q.getFilteredName().toLocaleLowerCase();
      if (qName.toLocaleLowerCase() === lowName) {
        res.isFound = true;
        res.obj = q;
        res.context = q.getValueGetterContext(qName.endsWith(unWrappedNameSuffix));
        break;
      }
    }
  }
}

export interface IValidationContextParams {
  fireCallback: boolean;
  isOnValueChanged?: boolean;
  focusOnFirstError?: boolean;
  firstErrorQuestion?: IQuestion;
  changeCurrentPage?: boolean;
  callbackResult?: (res: boolean, element: IElement) => void;
}

export class ValidationContext extends AsyncElementsRunner {
  private fireCallbackValue: boolean;
  private focusOnFirstErrorValue: boolean;
  private isOnValueChangedValue: boolean;
  private changeCurrentPage: boolean;
  private firstErrorQuestionValue: Question;
  private res: boolean = true;
  private errorCountValue: number = 0;
  private isCallbackFired: boolean;
  private callbackResult: (res: boolean, element: IElement) => void;
  constructor(context?: IValidationContextParams) {
    super(() => { this.setCallbackResult(); });
    if (!context) {
      context = { fireCallback: true };
    }
    this.fireCallbackValue = context.fireCallback || false;
    this.isOnValueChangedValue = context.isOnValueChanged || false;
    this.focusOnFirstErrorValue = context.focusOnFirstError || false;
    this.callbackResult = context.callbackResult || null;
    this.changeCurrentPage = context.changeCurrentPage || false;
  }
  public get fireCallback(): boolean { return this.fireCallbackValue; }
  public get isOnValueChanged(): boolean { return this.isOnValueChangedValue; }
  public get focusOnFirstError(): boolean { return this.focusOnFirstErrorValue; }
  public get result(): boolean { return this.res; }
  public get runningResult(): boolean {
    return !this.res || !this.isRunning || !this.callbackResult ? this.res : undefined;
  }
  public setErrorElement(element: ISurveyElement, errors? : Array<SurveyError>): void {
    if (Array.isArray(errors) && this.isWarningOnlyOrEmpty(errors)) return;
    this.errorCountValue ++;
    this.res = false;
    if (!element) return;
    if (element.isQuestion) {
      this.setQuestionError(<Question>element);
    } else {
      if (element.isCollapsed) {
        element.expand();
      }
    }
  }
  private isWarningOnlyOrEmpty(errors: Array<SurveyError>): boolean {
    for (let i = 0; i < errors.length; i++) {
      const er = errors[i];
      if (er.isError && er.visible) return false;
    }
    return true;
  }
  public get firstErrorQuestion(): Question {
    return this.firstErrorQuestionValue;
  }
  public get errorCount(): number { return this.errorCountValue; }
  private setCallbackResult(): void {
    if (this.callbackResult && !this.isCallbackFired) {
      this.isCallbackFired = true;
      this.callbackResult(this.res, this.firstErrorQuestion);
    }
  }
  private setQuestionError(question: Question): void {
    question.expandAllParents();
    if (!this.firstErrorQuestionValue) {
      this.firstErrorQuestionValue = question;
      if (this.focusOnFirstError || this.changeCurrentPage) {
        if (this.focusOnFirstError) {
          question.focus(true);
        } else {
          const survey = question.getSurvey();
          if (!!survey && !!question.page) {
            survey.currentPage = question.page;
          }
        }
      }
      this.setCallbackResult();
    }
  }
}

/**
 * A base class for all questions.
 */
export class Question extends SurveyElement<Question>
  implements IQuestion, IConditionRunner, IValidatorOwner, ITitleOwner {
  [index: string]: any;
  private isCustomWidgetRequested: boolean;
  private customWidgetValue: QuestionCustomWidget;
  customWidgetData = { isNeedRender: true };
  focusCallback: () => void;
  surveyLoadCallback: () => void;
  displayValueCallback: (text: string) => string;
  hasCssErrorCallback: () => boolean = (): boolean => false;

  private triggersInfo: Array<ITriggerExpressionInfo> = [];
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
  onUpdateCssClassesCallback: (css: any) => void;
  setValueChangedDirectlyCallback: (val: boolean) => void;
  onGetSurvey: () => ISurvey;
  private locProcessedTitle: LocalizableString;
  private isReadyValue: boolean = true;
  private commentElements: Array<HTMLElement>;
  private dependedQuestions: Array<Question> = [];
  private commentTextAreaModelValue: TextAreaModel;

  /**
   * An event that is raised when the question's ready state has changed (expressions are evaluated, choices are loaded from a web resource specified by the `choicesByUrl` property, etc.).
   *
   * Parameters:
   *
   * - `sender`: `SurveyModel`\
   * A survey instance that contains the question whose ready state has changed.
   * - `options.isReady`: `boolean`\
   * Indicates whether the question is ready.
   * - `options.oldIsReady`: `boolean`\
   * Indicates the previous ready state.
   */
  public onReadyChanged: EventBase<Question> = this.addEvent<Question>();

  public isReadOnlyRenderDiv(): boolean {
    return this.isReadOnly && settings.readOnly.commentRenderMode === "div";
  }

  protected allowMobileInDesignMode() {
    return false;
  }
  public updateIsMobileFromSurvey() {
    this.setIsMobile((<SurveyModel>this.survey)._isMobile);
  }
  public setIsMobile(val: boolean): void {
    const newVal = val && (this.allowMobileInDesignMode() || !this.isDesignMode);
    this.isMobile = newVal;
  }
  protected getIsMobile(): boolean {
    return this._isMobile;
  }
  public get isMobile(): boolean {
    return this.getIsMobile();
  }
  public set isMobile(val: boolean) {
    this._isMobile = val;
  }
  public themeChanged(theme: ITheme): void { }
  private get _isMobile(): boolean { return this.getPropertyValue("_isMobile", false); }
  private set _isMobile(val: boolean) { this.setPropertyValue("_isMobile", val); }
  public get forceIsInputReadOnly(): boolean { return this.getPropertyValue("forceIsInputReadOnly"); }
  public set forceIsInputReadOnly(val: boolean) { this.setPropertyValue("forceIsInputReadOnly", val); }
  public get ariaExpanded(): "true" | "false" {
    if (this.isNewA11yStructure) {
      return null;
    }
    return this.getPropertyValue("ariaExpanded");
  }
  public set ariaExpanded(val: "true" | "false") { this.setPropertyValue("ariaExpanded", val); }

  constructor(name: string) {
    super(name);
    this.setPropertyValueDirectly("id", "sq_" + this.uniqueId);
    this.onCreating();
    this.createNewArray("validators", (validator: any) => {
      validator.errorOwner = this;
    });

    this.addExpressionProperty("visibleIf", (obj: Base, res: any) => { this.visible = res === true; });
    this.addExpressionProperty("enableIf", (obj: Base, res: any) => { this.readOnly = res === false; });
    this.addExpressionProperty("requiredIf", (obj: Base, res: any) => { this.isRequired = res === true; });

    this.addTriggersInfo();
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    const updateQuestionCssProps = ["no", "readOnly", "hasVisibleErrors", "containsErrors"];
    if (updateQuestionCssProps.indexOf(name) > -1) {
      this.updateQuestionCss();
    }
    if (name === "width") {
      this.updateQuestionCss();
      if (!!this.parent) {
        this.parent.elementWidthChanged(this);
      }
    }
    if (name === "isRequired") {
      if (!this.isRequired && this.errors.length > 0) {
        this.validate();
      }
      this.locTitle.strChanged();
      this.clearCssClasses();
    }
    if (name === "indent" || name === "rightIndent") {
      this.resetIndents();
    }
    if (name === "showCommentArea" || name === "showOtherItem") {
      this.initCommentFromSurvey();
    }
    if (name === "commentPlaceholder") {
      this.resetRenderedCommentPlaceholder();
    }
    if (name === "_isMobile") {
      this.onMobileChanged();
    }
    if (name === "colSpan") {
      this.parent?.updateColumns();
    }
  }
  protected getDefaultTitle(): string { return this.name; }
  protected createLocTitleProperty(): LocalizableString {
    const locTitleValue = super.createLocTitleProperty();
    locTitleValue.storeDefaultText = true;
    locTitleValue.onGetTextCallback = (text: string, nonProcessedText?: string): string => {
      if (!text && !nonProcessedText) {
        text = this.getDefaultTitle();
      }
      if (!this.survey) return text;
      return this.survey.getUpdatedQuestionTitle(this, text);
    };
    this.locProcessedTitle = new LocalizableString(this, true);
    this.locProcessedTitle.sharedData = locTitleValue;
    return locTitleValue;
  }
  get locRenderedTitle(): LocalizableString {
    if (this.isSingleInputActive && !!this.singleInputLocTitle) return this.singleInputLocTitle;
    return this.locTitle;
  }
  public get commentTextAreaModel(): TextAreaModel {
    if (!this.commentTextAreaModelValue) {
      this.commentTextAreaModelValue = new TextAreaModel(this.getCommentTextAreaOptions());
    }
    return this.commentTextAreaModelValue;
  }
  private getCommentTextAreaOptions(): ITextArea {
    const options: ITextArea = {
      question: this,
      id: () => this.commentId,
      propertyNames: ["comment"],
      className: () => this.cssClasses.comment,
      placeholder: () => this.renderedCommentPlaceholder,
      isDisabledAttr: () => this.isInputReadOnly || false,
      rows: () => this.commentAreaRows,
      autoGrow: () => this.autoGrowComment,
      maxLength: () => this.getOthersMaxLength(),
      ariaRequired: () => this.a11y_input_ariaRequired,
      ariaLabel: () => this.a11y_input_ariaLabel,
      getTextValue: () => { return this.comment; },
      onTextAreaChange: (e) => { this.onCommentChange(e); },
      onTextAreaInput: (e) => { this.onCommentInput(e); },
    };
    return options;
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
  protected onAsyncRunningChanged(): void {
    this.updateIsReady();
  }
  protected ensureQuestionIsReady(): void {
    const _displayValue = this.displayValue;
  }
  public waitForQuestionIsReady(callback?: () => void): Promise<void> {
    return new Promise((resolve: any) => {
      this.ensureQuestionIsReady();
      if (this.isReady) {
        resolve();
        if (!!callback) callback();
      } else {
        const readyCallback: (sender: Question, options: any) => void =
                (_, options: any) => {
                  if (options.isReady) {
                    this.onReadyChanged.remove(readyCallback);
                    resolve();
                    if (!!callback) callback();
                  }
                };
        this.onReadyChanged.add(readyCallback);
      }
    });
  }
  protected updateIsReady(): void {
    let res = this.getIsQuestionReady();
    if (res) {
      const questions = this.getIsReadyDependsOn();
      for (let i = 0; i < questions.length; i++) {
        if (!questions[i].getIsQuestionReady()) {
          res = false;
          break;
        }
      }
    }
    this.setIsReady(res);
  }
  protected getIsQuestionReady(): boolean {
    return !this.isAsyncExpressionRunning && this.getAreNestedQuestionsReady();
  }
  private getAreNestedQuestionsReady(): boolean {
    const questions = this.getIsReadyNestedQuestions();
    if (!Array.isArray(questions)) return true;
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].isReady) return false;
    }
    return true;
  }
  protected getIsReadyNestedQuestions(): Array<Question> {
    return this.getNestedQuestions();
  }
  private setIsReady(val: boolean): void {
    const oldIsReady = this.isReadyValue;
    this.isReadyValue = val;
    if (oldIsReady != val) {
      this.getIsReadyDependends().forEach(q => q.updateIsReady());
      this.onReadyChanged.fire(this, {
        question: this,
        isReady: val,
        oldIsReady: oldIsReady,
      });
    }
  }
  protected getIsReadyDependsOn(): Array<Question> {
    return this.getIsReadyDependendCore(true);
  }
  private getIsReadyDependends(): Array<Question> {
    return this.getIsReadyDependendCore(false);
  }
  protected getDependedQuestionsByValueName(isDependOn: boolean): Array<IQuestion> {
    return this.survey.questionsByValueName(this.getValueName());
  }
  private getIsReadyDependendCore(isDependOn: boolean): Array<Question> {
    if (!this.survey) return [];
    const questions = this.getDependedQuestionsByValueName(isDependOn);
    const res = new Array<Question>();
    questions.forEach(q => { if (q !== this) res.push(<Question>q); });
    if (!isDependOn) {
      if (this.parentQuestion) {
        res.push(this.parentQuestion);
      }
      if (this.dependedQuestions.length > 0) {
        this.dependedQuestions.forEach(q => res.push(q));
      }
    }
    return res;
  }
  public choicesLoaded(): void { }
  /**
   * Returns a page to which the question belongs and allows you to move this question to a different page.
   */
  public get page(): IPage {
    if (!!this.parentQuestion) return this.parentQuestion.page;
    return this.getPage(this.parent);
  }
  public set page(val: IPage) {
    this.setPage(this.parent, val);
  }
  public getPanels(): Array<IPanel> {
    return null;
  }
  protected getPageVisibleIndex(): number { return (<any>this.page)?.visibleIndex || -1; }
  public delete(doDispose: boolean = true): void {
    this.removeFromParent();
    if (doDispose) {
      this.dispose();
    } else {
      this.resetDependedQuestions();
    }
  }
  protected removeFromParent(): void {
    if (!!this.parent) {
      this.removeSelfFromList(this.parent.elements);
    }
  }
  protected addDependedQuestion(question: Question): void {
    if (!question || this.dependedQuestions.indexOf(question) > -1) return;
    this.dependedQuestions.push(question);
  }
  protected removeDependedQuestion(question: Question): void {
    if (!question) return;
    var index = this.dependedQuestions.indexOf(question);
    if (index > -1) {
      this.dependedQuestions.splice(index, 1);
    }
  }
  protected updateDependedQuestions(): void {
    for (var i = 0; i < this.dependedQuestions.length; i++) {
      this.dependedQuestions[i].updateDependedQuestion();
    }
  }
  protected updateDependedQuestion(): void { }
  protected resetDependedQuestion(): void { }
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
    return this.getPropertyValue("visible");
  }
  public set visible(val: boolean) {
    if (val == this.visible) return;
    this.setPropertyValue("visible", val);
    this.onVisibleChangedCore();
    this.notifySurveyVisibilityChanged();
  }
  protected onVisibleChanged(): void {
    const prevVal = this.getPropertyValue("isVisible");
    this.onVisibleChangedCore();
    const newVal = this.getPropertyValue("isVisible");
    if (prevVal !== undefined && prevVal !== newVal) {
      this.notifySurveyVisibilityChanged();
    }
  }
  private onVisibleChangedCore(): void {
    this.updateIsVisibleProp();
    if (!this.isVisible && this.errors && this.errors.length > 0) {
      this.errors = [];
    }
  }
  protected notifyStateChanged(prevState: string): void {
    super.notifyStateChanged(prevState);
    if (this.isCollapsed) {
      this.onHidingContent();
    }
  }
  public updateElementVisibility(): void {
    this.updateIsVisibleProp();
  }
  private updateIsVisibleProp(): void {
    const prev = this.getPropertyValue("isVisible");
    const val = this.isVisible;
    if (prev !== val) {
      this.setPropertyValue("isVisible", val);
      if (!val) {
        this.onHidingContent();
      }
    }
    if (val !== this.visible && this.areInvisibleElementsShowing) {
      this.updateQuestionCss();
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
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   *
   * [View Demo](https://surveyjs.io/form-library/examples/implement-conditional-logic-to-change-question-visibility/ (linkStyle))
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
    if (this.areInvisibleElementsShowing) return true;
    return this.isVisibleCore();
  }
  public get isVisibleInSurvey(): boolean {
    return this.isVisible && this.isParentVisible;
  }
  protected isVisibleCore(): boolean {
    return this.visible;
  }
  /**
   * Returns the visible index of the question in the survey. It can be from 0 to all visible questions count - 1
   * The visibleIndex is -1 if the title is 'hidden' or showNumber is false
   * @see titleLocation
   * @see showNumber
   */
  public get visibleIndex(): number {
    return this.getPropertyValue("visibleIndex", -1);
  }
  public onHidingContent(): void { }
  /**
   * Specifies whether to show a number for this question. Setting this property to `false` hides the question number from the title and excludes the question from numbering.
   *
   * Default value: `false` (inherited from the `SurveyModel`'s [`showQuestionNumbers`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showQuestionNumbers) property)
   * @see no
   * @see showQuestionNumbers
   * @see questionStartIndex
   */
  public get showNumber(): boolean {
    return this.getPropertyValue("showNumber");
  }
  public set showNumber(val: boolean) {
    this.setPropertyValue("showNumber", val);
    this.notifySurveyVisibilityChanged();
  }
  /**
   * @deprecated Use the [`showNumber`](https://surveyjs.io/form-library/documentation/api-reference/question#showNumber) property instead.
   */
  public get hideNumber(): boolean {
    return !this.showNumber;
  }
  public set hideNumber(val: boolean) {
    this.showNumber = !val;
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
  private runTriggerInfo(info: ITriggerExpressionInfo, keys: any, properties: any): void {
    this.runExpressionByProperty(info.name, properties, (value: any) => {
      info.doComplete(value, properties);
    }, (runner: ExpressionRunner): boolean => {
      if (!info.canRun()) return false;
      return !keys || this.canExecuteTriggerByKeys(keys, runner, this.getExpressionByProperty(info.secondName));
    });
  }
  private canExecuteTriggerByKeys(keys: any, runner: ExpressionRunner, secondRunner?: ExpressionRunner): boolean {
    if (!runner && !!secondRunner) {
      runner = secondRunner;
      secondRunner = undefined;
    }
    const run1 = this.canExecuteTriggerByKeysCore(keys, runner);
    if (run1 === "var") return true;
    if (!secondRunner) return run1 === "func" || run1 === "const";
    const run2 = this.canExecuteTriggerByKeysCore(keys, secondRunner);
    return run2 !== "";
  }
  private canExecuteTriggerByKeysCore(keys: any, runner: ExpressionRunner): string {
    if (!runner.expression) return "";
    const vars = runner.getVariables();
    if ((!Array.isArray(vars) || vars.length === 0)) {
      if (runner.hasFunction()) return "func";
      return "const";
    }
    return new ValueGetter().isAnyKeyChanged(keys, vars) ? "var" : "";
  }
  public getValueGetterContext(isUnwrapped?: boolean): IValueGetterContext {
    return new QuestionValueGetterContext(this, isUnwrapped);
  }
  private addTriggersInfo(): void {
    this.addTriggerInfo({
      name: "resetValueIf",
      canRun: (): boolean => !this.isEmpty(),
      doComplete: (res: any, properties: HashTable<any>): void => {
        if (res === true) {
          this.startSetValueOnExpression();
          this.updateValueWithDefaultsOrClear();
          this.finishSetValueOnExpression();
        }
      }
    });
    this.addTriggerInfo({
      name: "setValueIf",
      secondName: "setValueExpression",
      canRun: (): boolean => true,
      doComplete: (res: any, properties: HashTable<any>): void => {
        if (res) {
          if (!this.setValueExpression) {
            this.clearValue();
          } else {
            const info = {
              name: "setValueExpression",
              canRun: (): boolean => true,
              doComplete: (res: any, properties: HashTable<any>): void => this.runExpressionSetValue(res)
            };
            this.runTriggerInfo(info, undefined, properties);
          }
        }
      }
    });
    this.addTriggerInfo({
      name: "setValueExpression",
      canRun: (): boolean => !this.setValueIf,
      doComplete: (res: any, properties: HashTable<any>): void => this.runExpressionSetValue(res)
    });
  }
  protected addTriggerInfo(info: ITriggerExpressionInfo): void {
    this.triggersInfo.push(info);
  }
  public runTriggers(name: string, value: any, keys?: any): void {
    if (this.isSettingQuestionValue || (this.parentQuestion && this.parentQuestion.getValueName() === name)) return;
    if (!keys) {
      keys = {};
      keys[name] = value;
    }
    const properties = this.getDataFilteredProperties();
    this.triggersInfo.forEach(info => {
      this.runTriggerInfo(info, keys, properties);
    });
  }
  private runConditions() {
    if (this.data && !this.isLoadingFromJson) {
      if (!this.isDesignMode) {
        this.runCondition(this.getDataFilteredProperties());
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
    if (!this.visible) {
      this.updateIsVisibleProp();
    }
    this.updateIsMobileFromSurvey();
  }
  /**
   * Returns a survey element (panel or page) that contains the question and allows you to move this question to a different survey element.
   */
  public get parent(): IPanel {
    return this.getPropertyValue("parent", null);
  }
  public set parent(val: IPanel) {
    if (this.parent === val) return;
    this.removeFromParent();
    this.setPropertyValue("parent", val);
    if (!!val) {
      this.updateQuestionCss();
    }
    this.onParentChanged();
  }
  protected onParentChanged(): void { }
  private calculateSingleInputQuestion(): Question {
    if (!this.isSingleInputActive) {
      return undefined;
    }
    const questions = this.getSingleInputQuestions();
    if (Array.isArray(questions) && questions.length > 0) {
      const q = questions[0];
      this.onBeforeSetSingleInputQuestion(q);
      return q;
    }
    return undefined;
  }
  //#region singleInput
  public get singleInputQuestion(): Question {
    if (!this.isSingleInputMode) return undefined;
    return this.getPropertyValue("singleInputQuestion", undefined, () => this.calculateSingleInputQuestion());
  }
  private get currentSingleInputQuestion(): Question {
    let res = this.singleInputQuestion;
    while(!!res && !!res.singleInputQuestion && res.singleInputQuestion !== res) {
      res = res.singleInputQuestion;
    }
    return res;
  }
  private get currentSingleInputParentQuestion(): Question {
    const q = this.currentSingleInputQuestion;
    if (!q) return this;
    if (q.singleInputQuestion === q) return q;
    return q.parentQuestion || this;
  }
  public get singleInputSummary(): QuestionSingleInputSummary {
    return this.getPropertyValue("singleInputSummary", undefined, () => {
      if (!this.supportNestedSingleInput()) return undefined;
      const q = this.singleInputQuestion;
      if (!q || q !== this) return undefined;
      const res = this.createSingleInputSummary();
      if (!!res) {
        this.calcSingleInputActions();
        this.resetPropertyValue("singleInputLocTitle");
      }
      return res;
    });
  }
  protected createSingleInputSummary(): QuestionSingleInputSummary {
    return undefined;
  }
  public get rootParentQuestion(): Question {
    let res: Question = this;
    while(!!res.parentQuestion) {
      res = res.parentQuestion;
    }
    return res;
  }
  private getParentQuestions(): Array<Question> {
    const res = new Array<Question>();
    let q: Question = this;
    while(!!q.parentQuestion) {
      res.push(q.parentQuestion);
      q = q.parentQuestion;
    }
    return res;
  }
  public resetSingleInput(): void {
    this.resetSingleInputCore();
  }
  private resetSingleInputCore(): void {
    const prev = this.getPropertyValue("singleInputQuestion");
    this.resetPropertyValue("singleInputQuestion");
    if (!!prev) {
      this.onSingleInputChanged();
    }
  }
  private onSingleInputChanged(resetSummary: boolean = true): void {
    if (resetSummary) {
      this.resetSingleInputSummary();
    }
    this.singleInputLocTitle?.strChanged();
    this.resetPropertyValue("singleInputLocTitle");
    this.calcSingleInputActions();
    this.survey?.updateNavigationElements();
  }
  private resetSingleInputSummary(): void {
    this.singleInputSummary?.dispose();
    this.resetPropertyValue("singleInputSummary");
  }
  public validateSingleInput(): boolean {
    const q = this.currentSingleInputQuestion;
    if (!q) return true;
    return q.validate(true, true);
  }
  public getSingleInputElementPos(): number {
    if (this.singleInputQuestion === this) return 0;
    const pQ = this.currentSingleInputParentQuestion;
    if (pQ !== this) {
      let res = pQ.getSingleInputElementPos();
      if (res === 2) return 2;
    }
    const q = this.singleInputQuestion;
    const questions = this.getSingleInputQuestions();
    if (questions.length < 2) return 0;
    let index = questions.indexOf(q);
    return index === 0 ? -1 : (index >= questions.length - 1 ? 1 : 2);
  }
  protected get isSingleInputActive(): boolean {
    if (!this.isSingleInputMode) return false;
    const ssQ = this.survey.currentSingleQuestion;
    return !!ssQ && ssQ === this.rootParentQuestion;
  }
  protected singleInputOnAddItem(isOnDataChanging: boolean): void {
    if (this.isSingleInputActive) {
      if (isOnDataChanging && this.singleInputSummary) {
        this.resetSingleInputSummary();
      } else {
        this.setSingleQuestionOnChange(Number.MAX_VALUE);
      }
    }
  }
  protected singleInputOnRemoveItem(index: number): void {
    if (this.isSingleInputActive) {
      if (!this.singleInputSummary) {
        this.setSingleQuestionOnChange(index);
      } else {
        this.onSingleInputChanged();
      }
    }
  }
  protected getSingleQuestionOnChange(index: number): Question { return null; }
  private setSingleQuestionOnChange(index: number): void {
    const q = this.getSingleQuestionOnChange(index);
    if (!!q) {
      this.setSingleInputQuestion(q);
    } else {
      this.resetSingleInput();
    }
  }
  private isSingleInputSummaryShown: boolean;
  public onSetAsSingleInput(): void {
    this.isSingleInputSummaryShown = false;
    const needReset = !this.wasRendered || this.singleInputSummary;
    this.onFirstRendering();
    if (needReset) {
      this.resetSingleInputSummary();
      this.resetPropertyValue("singleInputQuestion");
      this.resetPropertyValue("singleInputLocTitle");
    }
  }
  public nextSingleInput(): boolean {
    return this.nextPrevSingleInput(1);
  }
  public prevSingleInput(): boolean {
    return this.nextPrevSingleInput(-1);
  }
  public getSingleInputAddText(): string {
    const q = this.currentSingleInputQuestion;
    if (!q) return undefined;
    if (!!q.singleInputSummary) return q.getSingleInputAddTextCore();
    const qs = this.getSingleInputQuestions();
    const len = Array.isArray(qs) ? qs.length : 0;
    if (len > 0 && qs[len - 1] === q) return this.getSingleInputAddTextCore();
    return undefined;
  }
  public singleInputAddItem(checkErrors?: boolean): void {
    if (!checkErrors || this.validateSingleInput()) {
      this.currentSingleInputQuestion.singleInputAddItemCore();
    }
  }
  public get singleInputLocTitle(): LocalizableString {
    return this.getPropertyValue("singleInputLocTitle", undefined, () => {
      return this.getSingleQuestionLocTitle();
    });
  }

  public get singleInputActions(): ActionContainer {
    return this.getPropertyValue("singleInputActions", undefined, () => {
      return this.createSingleInputActions();
    });
  }

  public get singleInputHasActions(): boolean {
    return this.getPropertyValue("singleInputHasActions", undefined, () => {
      return this.createSingleInputActions();
    });
  }
  private get singleInputHideHeader(): boolean {
    const childQ = this.singleInputQuestion?.singleInputQuestion;
    return !!childQ && this.singleInputQuestion !== this;
  }
  private set singleInputHasActions(val: boolean) {
    this.setPropertyValue("singleInputHasActions", val);
  }
  private get singleInputParentQuestion(): Question {
    return this.singleInputQuestion?.parentQuestion || this;
  }
  private createSingleInputActions() {
    if (this.survey?.currentSingleQuestion !== this) return undefined;
    const singleInputActions = new ActionContainer();
    singleInputActions.actions = this.getSingleQuestionActions();
    return singleInputActions;
  }
  private calcSingleInputActions(): void {
    if (!!this.parentQuestion) {
      this.parentQuestion.calcSingleInputActions();
    } else {
      const actions = this.getSingleQuestionActions();
      if (this.singleInputActions) {
        this.singleInputActions.actions = actions;
      }
      this.singleInputHasActions = actions.length > 0 ? true : undefined;
    }
  }
  private getSingleQuestionActions(): Array<Action> {
    const res = new Array<Action>();
    const p = this.currentSingleInputParentQuestion;
    if (!p || p === this) return res;
    const pSQs = p.getSingleInputQuestions();
    const qs = new Array<Question>();
    let summaryQ = undefined;
    if (pSQs.length > 1 && pSQs[0] === p) {
      summaryQ = p;
      qs.push(p);
    }
    let pQ = p.parentQuestion;
    while(!!pQ) {
      qs.push(pQ);
      pQ = pQ.parentQuestion;
    }
    for (let i = qs.length - 1; i >= 0; i--) {
      const q = qs[i];
      if (q !== summaryQ) {
        const title = q.singleInputLocTitle;
        const action = new Action({ id: "single-action" + q.id, locTitle: title,
          css: this.cssClasses.breadcrumbsItem,
          innerCss: this.cssClasses.breadcrumbsItemButton,
          action: () => {
            q.singleInputMoveToFirst();
          }
        });

        action.cssClasses = {};
        res.push(action);
      }
    }
    return res;
  }
  protected singleInputMoveToFirst(): void {
    const q = this.singleInputQuestion;
    if (!!q && q !== this) {
      q.singleInputMoveToFirst();
    }
    this.singleInputMoveToFirstCore();
  }
  protected singleInputMoveToFirstCore(): void {}
  private getSingleQuestionLocTitle(): LocalizableString {
    return !this.singleInputSummary ? this.getSingleQuestionLocTitleCore() : undefined;
  }
  protected getSingleQuestionLocTitleCore(): LocalizableString {
    return undefined;
  }
  private supportNestedSingleInput(): boolean {
    return this.survey?.supportsNestedSingleInput(this);
  }
  private getSingleInputQuestions(): Array<Question> {
    if (!this.supportNestedSingleInput()) return [];
    const question = this.getPropertyValue("singleInputQuestion");
    if (question === this) return [this];
    const res = this.getSingleInputQuestionsCore(question, !question || !this.isSingleInputSummaryShown);
    if (this.survey) {
      this.survey.updateNestedSingleQuestions(this, res);
    }
    res.forEach(q => { if (q !== this)this.onSingleInputQuestionAdded(q); });
    return res;
  }
  protected getSingleInputQuestionsCore(question: Question, checkDynamic: boolean): Array<Question> {
    return this.getNestedQuestions(true, false);
  }
  protected onSingleInputQuestionAdded(question: Question): void {}
  protected fillSingleInputQuestionsInContainer(res: Array<Question>, innerQuestion: Question): void {}
  protected getSingleInputQuestionsForDynamic(question: Question, arr: Array<Question>): Array<Question> {
    const res = new Array<Question>();
    if (!!question && question !== this && arr.indexOf(question) < 0) {
      this.fillSingleInputQuestionsInContainer(res, question);
    }
    arr.forEach(q => res.push(q));
    if (this.isSingleInputSummaryShown && res.length > 0) {
      res.unshift(this);
    }
    res.push(this);
    return res;
  }
  protected getSingleInputAddTextCore(): string { return undefined; }
  protected singleInputAddItemCore(): void {}
  private setSingleInputQuestionCore(question: Question): void {
    this.onBeforeSetSingleInputQuestion(question);
    this.setPropertyValue("singleInputQuestion", question);
  }
  private onBeforeSetSingleInputQuestion(question: Question): void {
    question.onFirstRendering();
    if (question === this) {
      this.isSingleInputSummaryShown = true;
    }
  }
  protected setSingleInputQuestion(question: Question, onPrev?: boolean): void {
    if (this.singleInputQuestion !== question) {
      this.setSingleInputQuestionCore(question);
      this.onSingleInputChanged(!onPrev || question !== this);
    }
  }
  private nextPrevSingleInput(skip: number): boolean {
    let pQ = this.currentSingleInputParentQuestion;
    while(!!pQ && pQ !== this) {
      const res = pQ.nextPrevSingleInput(skip);
      if (res) return true;
      pQ = pQ.parentQuestion;
    }
    const q = this.singleInputQuestion;
    if (!q) return false;
    const questions = this.getSingleInputQuestions();
    let index = questions.indexOf(q);
    if (index < 0) {
      if (questions.length === 0) return false;
      index = 0;
      skip = 0;
    }
    index += skip;
    if (index < 0 || index >= questions.length) return false;
    this.setSingleInputQuestion(questions[index], skip < 0);
    return true;
  }
  //#endregion
  /**
   * Returns `false` if the `titleLocation` property is set to `"hidden"` or if the question cannot have a title (for example, an [HTML](https://surveyjs.io/form-library/documentation/questionhtmlmodel) question).
   *
   * If the `title` property is `undefined` or set to an empty string, the `hasTitle` property returns `true`, because the question uses its `name` as a title in this case.
   * @see title
   * @see titleLocation
   */
  public get hasTitle(): boolean {
    return this.getTitleLocation() !== "hidden" && !this.singleInputHideHeader;
  }
  /**
   * Sets question title location relative to the input field. Overrides the `questionTitleLocation` property specified for the question's container (survey, page, or panel).
   *
   * Possible values:
   *
   * - `"default"` (default) - Inherits the setting from the `questionTitleLocation` property specified for the question's container.
   * - `"top"` - Displays the title above the input field.
   * - `"bottom"` - Displays the title below the input field.
   * - `"left"` - Displays the title to the left of the input field.
   * - `"hidden"` - Hides the question title.
   *
   * > Certain question types (Matrix, Multiple Text) do not support the `"left"` value. For them, the `"top"` value is used.
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
  get showTitle(): boolean {
    return this.getTitleLocation() !== "hidden";
  }
  set showTitle(newValue: boolean) {
    this.titleLocation = newValue ? "default" : "hidden";
  }
  public getTitleOwner(): ITitleOwner { return this; }
  protected getIsTitleRenderedAsString(): boolean { return this.titleLocation === "hidden"; }
  protected notifySurveyOnChildrenVisibilityChanged(): boolean { return false; }
  private notifySurveyVisibilityChanged(): void {
    if (!this.canUpdateValueOnVisibleChanged()) return;
    this.survey.questionVisibilityChanged(this, this.isVisible,
      !this.parentQuestion || this.parentQuestion.notifySurveyOnChildrenVisibilityChanged());
    const isClearOnHidden = this.isClearValueOnHidden;
    if (!this.visible) {
      this.clearValueOnHidding(isClearOnHidden);
    }
    if (isClearOnHidden && this.isVisibleInSurvey) {
      this.updateValueWithDefaults();
    }
  }
  protected clearValueOnHidding(isClearOnHidden: boolean): void {
    if (isClearOnHidden) {
      this.clearValueIfInvisible();
    }
  }
  public get titleWidth(): string {
    if (this.parent && this.getTitleLocation() === "left") {
      const columns = this.parent.getColumsForElement(this as any);
      const columnCount = columns.length;
      if (columnCount !== 0 && !!columns[0].questionTitleWidth) return columns[0].questionTitleWidth;
      const questionWidth = this.getQuestionParentTitleWidth();
      const percentWidth = this.getPercentQuestionTitleWidth(questionWidth);
      if (!percentWidth && !!this.parent) {
        let width = questionWidth;
        if (width && !isNaN(width)) width = width + "px";
        return width;
      }
      return (percentWidth / (columnCount || 1)) + "%";
    }
    return undefined;
  }
  private getQuestionParentTitleWidth(): any {
    if (!this.parent) return undefined;
    const res = this.parent.getQuestionTitleWidth();
    if (!res && !!this.parentQuestion) return this.parentQuestion.getQuestionParentTitleWidth();
    return res;
  }
  private getPercentQuestionTitleWidth(width: any): number {
    if (!!width && width[width.length - 1] === "%") {
      return parseInt(width);

    }
    return undefined;
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
    return this.getParentTitleLocation();
  }
  protected getParentTitleLocation(): string {
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
  /**
   * Specifies the error message position. Overrides the `questionErrorLocation` property specified for the question's container ([survey](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionErrorLocation), [page](https://surveyjs.io/form-library/documentation/api-reference/page-model#questionErrorLocation), or [panel](https://surveyjs.io/form-library/documentation/api-reference/panel-model#questionErrorLocation)).
   *
   * Possible values:
   *
   * - `"default"` (default) - Inherits the setting from the `questionErrorLocation` property specified for the question's container.
   * - `"top"` - Displays error messages above questions.
   * - `"bottom"` - Displays error messages below questions.
   */
  public get errorLocation(): string {
    return this.getPropertyValue("errorLocation");
  }
  public set errorLocation(val: string) {
    this.setPropertyValue("errorLocation", val);
  }
  public getErrorLocation(): string {
    if (this.errorLocation !== "default") return this.errorLocation;
    if (this.parentQuestion) return this.parentQuestion.getChildErrorLocation(this);
    if (this.parent) return this.parent.getQuestionErrorLocation();
    return this.survey ? this.survey.questionErrorLocation : "top";
  }
  public getChildErrorLocation(child: Question): string {
    return this.getErrorLocation();
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
    return this.hasInput && !this.isContainer;
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
    this.updateQuestionCss();
  }
  get hasDescriptionUnderTitle(): boolean {
    return this.getDescriptionLocation() == "underTitle" && this.hasDescription;
  }
  get hasDescriptionUnderInput(): boolean {
    return this.getDescriptionLocation() == "underInput" && this.hasDescription;
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
    return this.getLocStringText(this.locRequiredErrorText);
  }
  public set requiredErrorText(val: string) {
    this.setLocStringText(this.locRequiredErrorText, val);
  }
  get locRequiredErrorText(): LocalizableString {
    return this.getOrCreateLocStr("requiredErrorText");
  }
  /**
   * Specifies a caption displayed above the comment area. Applies when the `showCommentArea` property is `true`.
   * @see showCommentArea
   * @see comment
   */
  public get commentText(): string {
    return this.getLocStringText(this.locCommentText);
  }
  public set commentText(val: string) {
    this.setLocStringText(this.locCommentText, val);
  }
  get locCommentText(): LocalizableString {
    return this.getOrCreateLocStr("commentText", true, true);
  }
  /**
   * A placeholder for the comment area. Applies when the `showCommentArea` property is `true`.
   * @see showCommentArea
   * @see comment
   * @see commentText
   */
  public get commentPlaceholder(): string { return this.getLocStringText(this.locCommentPlaceholder); }
  public set commentPlaceholder(val: string) { this.setLocStringText(this.locCommentPlaceholder, val); }
  public get locCommentPlaceholder(): LocalizableString { return this.getOrCreateLocStr("commentPlaceholder"); }

  public get commentPlaceHolder(): string {
    return this.commentPlaceholder;
  }
  public set commentPlaceHolder(newValue: string) {
    this.commentPlaceholder = newValue;
  }
  public get renderedCommentPlaceholder(): string {
    return this.getPropertyValue("renderedCommentPlaceholder") ?? (!this.isReadOnly ? this.commentPlaceholder : undefined);
  }
  private resetRenderedCommentPlaceholder() {
    this.resetPropertyValue("renderedCommentPlaceholder");
  }
  /**
   * A value to show in HTML questions and in the dynamic titles and descriptions of survey elements when the question value is [empty](#isValueEmpty).
   *
   * Default value: `""`
   *
   * [Dynamic Texts](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#dynamic-texts (linkStyle))
   */
  public get defaultDisplayValue(): string { return this.getLocStringText(this.locDefaultDisplayValue); }
  public set defaultDisplayValue(val: string) { this.setLocStringText(this.locDefaultDisplayValue, val); }
  public get locDefaultDisplayValue(): LocalizableString { return this.getOrCreateLocStr("defaultDisplayValue"); }
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
  public localeChanged(): void {
    super.localeChanged();
    this.resetRenderedCommentPlaceholder();
    if (!!this.localeChangedCallback) {
      this.localeChangedCallback();
    }
  }
  public get isCompositeQuestion(): boolean {
    return false;
  }
  public get isContainer(): boolean { return false; }
  public onCommentInput(event: any): void {
    if (this.isInputTextUpdate) {
      if (event.target) {
        this.comment = event.target.value;
      }
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
    this.afterRenderCore(el);
    if (!this.survey) return;
    this.survey.afterRenderQuestion(this, el);
    if (!!this.afterRenderQuestionCallback) {
      this.afterRenderQuestionCallback(this, el);
    }

    if (this.supportComment() || this.supportOther()) {
      this.commentElements = [];
      this.getCommentElementsId().forEach(id => {
        const commentEl = el?.querySelector(`#${id}`);
        if (commentEl)this.commentElements.push(commentEl as HTMLElement);
      });
    }
    this.checkForResponsiveness(el);
  }
  public afterRenderCore(element: HTMLElement): void {
    super.afterRenderCore(element);
  }
  protected getCommentElementsId(): Array<string> {
    return [this.commentId];
  }
  public beforeDestroyQuestionElement(el: HTMLElement): void {
    this.commentElements = undefined;
  }
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
    return this.isRequired && this.titlePattern == "numRequireTitle" && this.requiredMark !== "";
  }
  public get isRequireTextAfterTitle(): boolean {
    return this.isRequired && this.titlePattern == "numTitleRequire" && this.requiredMark !== "";
  }
  /**
   * Disable this property if you want to render the current question on the same line or row with the previous question or panel.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/arrange-multiple-questions-in-single-line/ (linkStyle))
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
    return classes;
  }
  protected onCalcCssClasses(classes: any): void {
    super.onCalcCssClasses(classes);
    if (this.survey) {
      this.survey.updateQuestionCssClasses(this, classes);
    }
    if (this.onUpdateCssClassesCallback) {
      this.onUpdateCssClassesCallback(classes);
    }
  }
  public get cssRoot(): string {
    this.ensureElementCss();
    return this.getPropertyValue("cssRoot", "");
  }
  protected setCssRoot(val: string): void {
    this.setPropertyValue("cssRoot", val);
  }
  protected getCssRoot(cssClasses: { [index: string]: string }): string {
    const hasError = this.hasCssError(true);
    return new CssClassBuilder()
      .append(super.getCssRoot(cssClasses))
      .append(this.isFlowLayout && !this.isDesignMode
        ? cssClasses.flowRoot
        : cssClasses.mainRoot)
      .append(cssClasses.titleLeftRoot, !this.isFlowLayout && this.hasTitleOnLeft)
      .append(cssClasses.titleTopRoot, !this.isFlowLayout && this.hasTitleOnTop)
      .append(cssClasses.titleBottomRoot, !this.isFlowLayout && this.hasTitleOnBottom)
      .append(cssClasses.descriptionUnderInputRoot, !this.isFlowLayout && this.hasDescriptionUnderInput)
      .append(cssClasses.hasError, hasError)
      .append(cssClasses.hasErrorTop, hasError && this.getErrorLocation() == "top")
      .append(cssClasses.hasErrorBottom, hasError && this.getErrorLocation() == "bottom")
      .append(cssClasses.small, !this.width)
      .append(cssClasses.answered, this.isAnswered)
      .append(cssClasses.noPointerEventsMode, this.isReadOnlyAttr)
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
  protected supportContainerQueries() {
    return false;
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
      .append(cssClasses.contentSupportContainerQueries, this.supportContainerQueries())
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
      .append(super.getCssTitle(cssClasses))
      .append(cssClasses.singleInputTitle, !!this.singleInputQuestion)
      .append(cssClasses.titleOnAnswer, !this.containsErrors && this.isAnswered)
      .append(cssClasses.titleEmpty, !this.title.trim())
      .toString();
  }
  public get cssDescription(): string {
    this.ensureElementCss();
    return this.getPropertyValue("cssDescription", "");
  }
  protected setCssDescription(val: string): void {
    this.setPropertyValue("cssDescription", val);
  }
  protected getCssDescription(cssClasses: any): string {
    return new CssClassBuilder()
      .append(cssClasses.description)
      .append(cssClasses.descriptionUnderInput, this.getDescriptionLocation() == "underInput")
      .toString();
  }
  public get showErrorsAboveQuestion(): boolean {
    return this.getErrorLocation() === "top";
  }
  public get showErrorsBelowQuestion(): boolean {
    return this.getErrorLocation() === "bottom";
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
      .append(cssClasses.error.warningMode, this.currentNotificationType === "warning")
      .append(cssClasses.error.infoMode, this.currentNotificationType === "info")
      .append(cssClasses.errorsContainer)
      .append(cssClasses.errorsContainerTop, this.showErrorsAboveQuestion)
      .append(cssClasses.errorsContainerBottom, this.showErrorsBelowQuestion)
      .toString();
  }
  protected hasCssError(includeWarning?: boolean): boolean {
    const erros = this.errors;
    for (let i = 0; i < erros.length; i++) {
      const er = erros[i];
      if (er.visible && (includeWarning || er.isError)) return true;
    }
    return this.hasCssErrorCallback();
  }
  protected updateVisibleErrors() {
    super.updateVisibleErrors();
    this.updateQuestionCss();
  }
  private get isSingleInputQuestionMode(): boolean {
    return !!this.parentQuestion && this.isSingleInputMode;
  }
  protected getIsNested(): boolean {
    if (!!this.isSingleInputQuestionMode) return false;
    return super.getIsNested();
  }
  protected getHasFrameV2(): boolean {
    if (this.isSingleInputQuestionMode) return true;
    return super.getHasFrameV2();
  }
  public getRootCss(): string {
    return new CssClassBuilder()
      .append(this.cssRoot, !this.singleInputQuestion)
      .append(this.cssClasses.mobile, this.isMobile)
      .append(this.cssClasses.readOnly, this.isReadOnlyStyle)
      .append(this.cssClasses.disabled, this.isDisabledStyle)
      .append(this.cssClasses.preview, this.isPreviewStyle)
      .append(this.cssClasses.invisible, !this.isDesignMode && this.areInvisibleElementsShowing && !this.visible)
      .toString();
  }

  public getQuestionRootCss() {
    return new CssClassBuilder()
      .append(this.cssClasses.root)
      .append(this.cssClasses.rootMobile, this.isMobile)
      .toString();
  }
  public updateElementCss(reNew?: boolean): void {
    if (this.wasRendered) {
      super.updateElementCss(reNew);
      if (reNew) {
        this.updateQuestionCss();
      }
    } else {
      this.clearCssClasses();
    }
    this.resetIndents();
  }
  private updateQuestionCss(): void {
    if (this.isLoadingFromJson || !this.survey || this.isDisposed) return;
    if (this.wasRendered) {
      this.updateElementCssCore(this.cssClasses);
    }
  }
  private ensureElementCss() {
    if (!this.cssClassesValue) {
      this.updateQuestionCss();
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
    } else if (typeof objCss === "string" || objCss instanceof String) {
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
  protected calcPaddingLeft(): string {
    return this.getIndentSize(this.indent);
  }
  protected calcPaddingRight(): string {
    return this.getIndentSize(this.rightIndent);
  }
  private getIndentSize(indent: number): string {
    if (indent < 1 || !this.getSurvey() || !this.cssClasses || !this.cssClasses.indent) return "";
    return indent * this.cssClasses.indent + "px";
  }
  /**
   * Moves focus to the input field of this question.
   * @param onError Pass `true` if you want to focus an input field with the first validation error. Default value: `false` (focuses the first input field). Applies to question types with multiple input fields.
   */
  public focus(onError: boolean = false, scrollIfVisible?: boolean): void {
    if (this.isDesignMode || !this.isVisible || this.isReadOnly || !this.survey) return;
    let page = this.page;
    const shouldChangePage = !!page && this.survey.activePage !== page;
    const isSingleInput = this.isSingleInputMode;
    if (shouldChangePage && !isSingleInput) {
      this.survey.focusQuestionByInstance(this, onError);
    } else {
      if (isSingleInput) {
        this.survey.currentSingleQuestion = this.rootParentQuestion;
        const parents = this.getParentQuestions();
        for (let i = parents.length - 1; i >= 1; i--) {
          if (i === parents.length - 1) {
            parents[i].setSingleInputQuestion(parents[i - 1]);
          }
        }
        if (parents.length > 0) {
          parents[0].setSingleInputQuestion(this);
        }
        this.focusInputElement(onError);
      } else {
        this.expandAllParents();
        const scrollOptions: ScrollIntoViewOptions = (this.survey as SurveyModel)["isSmoothScrollEnabled"] ? { behavior: "smooth" } : undefined;
        this.survey.scrollElementToTop(this, this, null, this.id, scrollIfVisible, scrollOptions, undefined, () => {
          this.focusInputElement(onError);
        });
      }
    }
  }
  focusInputElement(onError: boolean): void {
    const id = !onError ? this.getFirstInputElementId() : this.getFirstErrorInputElementId();
    const surveyRoot = (this.survey as SurveyModel)?.rootElement;
    const res = SurveyElement.FocusElement(id, false, surveyRoot);
    if (res || !!this.customWidget) {
      this.fireCallback(this.focusCallback);
    }
  }
  private get isValidateVisitedEmptyFields(): boolean {
    return this.supportEmptyValidation() && !!this.survey && this.survey.getValidateVisitedEmptyFields() && this.isEmpty();
  }
  private isFocusEmpty: boolean;
  protected supportEmptyValidation(): boolean { return false; }
  onBlur(event: any): void {
    this.onBlurCore(event);
  }
  onFocus(event: any): void {
    this.onFocusCore(event);
  }
  protected onBlurCore(event: any): void {
    if (this.isFocusEmpty && this.isEmpty()) {
      this.validate(true);
    }
  }
  protected onFocusCore(event: any): void {
    this.isFocusEmpty = this.isValidateVisitedEmptyFields;
  }
  public expandAllParents(): void {
    this.expandAllParentsCore(this);
  }
  private expandAllParentsCore(element: IElement) {
    if (!element) return;
    if (element.isCollapsed) {
      element.expand();
    }
    this.expandAllParentsCore((<any>element).parent);
    this.expandAllParentsCore((<any>element).parentQuestion);
  }
  public focusIn(): void {
    if (!this.survey || this.isDisposed || this.isContainer) return;
    (this.survey as SurveyModel).whenQuestionFocusIn(this);
  }
  protected fireCallback(callback: () => void): void {
    if (callback) callback();
  }
  public getOthersMaxLength(): any {
    if (!this.survey) return null;
    return this.survey.maxCommentLength > 0 ? this.survey.maxCommentLength : null;
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
  public supportComment(): boolean {
    const prop = this.getPropertyByName("showCommentArea");
    return !prop || prop.visible;
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
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   * @see isRequired
   */
  public get requiredIf(): string {
    return this.getPropertyValue("requiredIf", "");
  }
  public set requiredIf(val: string) {
    this.setPropertyValue("requiredIf", val);
  }
  /**
   * Specifies whether to display a comment area.
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
  public get ariaDescriptionId(): string {
    return this.id + "_ariaDescription";
  }
  public get commentId(): string {
    return this.id + "_comment";
  }
  public get requireUpdateCommentValue(): boolean { return this.showCommentArea; }
  public readOnlyCallback: () => boolean;
  public get isReadOnly(): boolean {
    const isParentReadOnly = !!this.parent && this.parent.isReadOnly;
    const isPareQuestionReadOnly = !!this.parentQuestion && this.parentQuestion.isReadOnly;
    const isSurveyReadOnly = !!this.survey && this.survey.isDisplayMode;
    const callbackVal = !!this.readOnlyCallback && this.readOnlyCallback();
    return this.readOnly || isParentReadOnly || isSurveyReadOnly || isPareQuestionReadOnly || callbackVal;
  }
  public get isInputReadOnly(): boolean {
    if (this.forceIsInputReadOnly !== undefined) {
      return this.forceIsInputReadOnly;
    }
    return this.isReadOnly || this.isDesignMode;
  }
  public get renderedInputReadOnly(): string {
    return this.isInputReadOnly ? "" : undefined;
  }
  public get renderedInputDisabled(): string {
    return this.isInputReadOnly ? "" : undefined;
  }
  public get isReadOnlyAttr(): boolean {
    return this.isReadOnly;
  }
  public get isDisabledAttr(): boolean {
    return this.isDesignMode || (!!this.readOnlyCallback && this.readOnlyCallback());
  }
  protected onReadOnlyChanged(): void {
    this.setPropertyValue("isInputReadOnly", this.isInputReadOnly);
    super.onReadOnlyChanged();
    if (this.isReadOnly) {
      this.clearErrors();
    }
    this.updateQuestionCss();
    this.resetRenderedCommentPlaceholder();
  }
  /**
   * A Boolean expression. If it evaluates to `false`, this question becomes read-only.
   *
   * A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.
   *
   * Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).
   *
   * [View Demo](https://surveyjs.io/form-library/examples/how-to-conditionally-make-input-field-read-only/ (linkStyle))
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
  public runCondition(properties: HashTable<any>): void {
    if (this.isDesignMode) return;
    if (!properties) properties = {};
    properties["question"] = this;
    this.runConditionCore(properties);
    if (!this.isValueChangedDirectly && (!this.isClearValueOnHidden || this.isVisibleInSurvey)) {
      this.runDefaultValueExpression(properties);
    }
  }
  public get isInDesignMode(): boolean {
    return !this.isContentElement && this.isDesignMode;
  }
  /**
   * A question number or letter (depends on the `questionStartIndex` property of the question container (panel, page, or survey)).
   *
   * When the question number, title, or the entire question is invisible, this property returns an empty string.
   * @see SurveyModel.questionStartIndex
   * @see showNumber
   * @see titleLocation
   * @see visibleIf
   */
  public get no(): string {
    return this.getPropertyValue("no", undefined, () => this.calcNo());
  }
  onGetNoCallback : (no: string) => string;
  private calcNo(): string {
    let no = "";
    const hasTitle = this.getHasTitleOnCalcNo() && this.showNumber && this.visibleIndex >= 0;
    if (hasTitle) {
      no = Helpers.getNumberByIndex(this.visibleIndex, this.getStartIndex());
    }
    if (this.onGetNoCallback) {
      return this.onGetNoCallback(no);
    }
    if (!hasTitle) return no;
    if (!!this.parent) {
      no = (<any>this.parent).addNoFromChild(no);
    }
    if (!!this.survey) {
      no = this.survey.getUpdatedQuestionNo(this, no);
    }
    return no;
  }
  protected getHasTitleOnCalcNo(): boolean {
    return this.hasTitle;
  }
  public onSurveyLoad(): void {
    this.isCustomWidgetRequested = false;
    this.fireCallback(this.surveyLoadCallback);
    this.updateValueWithDefaults();
    if (this.isEmpty()) {
      this.initDataFromSurvey();
    }
  }
  protected onSetData(): void {
    super.onSetData();
    if (!this.isDesignMode && !!this.survey && !this.isLoadingFromJson) {
      this.initDataFromSurvey();
      this.onSurveyValueChanged(this.value);
      this.updateValueWithDefaults();
      this.updateIsAnswered();
    }
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
  get commentAreaRows(): number {
    return this.survey && this.survey.commentAreaRows;
  }
  private get autoGrowComment(): boolean {
    return this.survey && this.survey.autoGrowComment;
  }
  private get allowResizeComment(): boolean {
    return this.survey && this.survey.allowResizeComment;
  }
  private get questionValue(): any {
    return this.getPropertyValueWithoutDefault("value");
  }
  private set questionValue(val: any) {
    this.setPropertyValue("value", val);
  }
  private get questionComment(): string {
    return this.getPropertyValueWithoutDefault("comment");
  }
  private set questionComment(val: string) {
    this.setPropertyValue("comment", val);
    this.fireCallback(this.commentChangedCallback);
  }
  public get isValueArray(): boolean { return false; }
  /**
   * Gets or sets the question value.
   *
   * The following table illustrates how the value type depends on the question type:
   *
   * | Question type | Value type(s) |
   * | ------------- | ------------- |
   * | Checkboxes | <code>Array&lt;string &#124; number&gt;</code> |
   * | Dropdown | `string` \| `number` |
   * | Dynamic Matrix | `Array<object>` |
   * | Dynamic Panel | `Array<object>` |
   * | Expression | `string` \| `number` \| `boolean` |
   * | File Upload | `File` \| `Array<File>` |
   * | Image Picker | <code>Array&lt;string &#124; number&gt;</code> |
   * | Long Text | `string` |
   * | Multi-Select Dropdown | <code>Array&lt;string &#124; number&gt;</code> |
   * | Multi-Select Matrix | `object` |
   * | Multiple Textboxes | `Array<string>` |
   * | Radio Button Group | `string` \| `number` |
   * | Ranking | <code>Array&lt;string &#124; number&gt;</code> |
   * | Rating Scale | `number` \| `string` |
   * | Slider | <code>Array&lt;string &#124; number&gt;</code> |
   * | Signature | `string` (base64-encoded image) |
   * | Single-Line Input | `string` \| `number` \| `Date` |
   * | Single-Select Matrix | `object` |
   * | Yes/No (Boolean) | `boolean` \| `string` |
   * @hidefor QuestionImageModel, QuestionHtmlModel
   */
  public get value(): any {
    return this.getValueCore();
  }
  public set value(newValue: any) {
    this.setNewValue(newValue);
  }
  public getStructuredValue(level: number = -1): any {
    return this.value;
  }
  public get hasFilteredValue(): boolean { return false; }
  public getFilteredValue(isUnwrapped?: boolean): any { return this.value; }
  public getFilteredName(): any { return this.getValueName(); }
  public get valueForSurvey(): any {
    return this.valueForSurveyCore(this.value);
  }
  protected valueForSurveyCore(val: any): any {
    if (!!this.valueToDataCallback) {
      return this.valueToDataCallback(val);
    }
    return val;
  }
  protected valueFromDataCore(val: any): any {
    if (!!this.valueFromDataCallback) {
      return this.valueFromDataCallback(val);
    }
    return val;
  }
  /**
   * Sets the question's `value` and `comment` properties to `undefined`.
   * @see value
   * @see comment
   */
  public clearValue(keepComment?: boolean, fromUI?: boolean): void {
    if (this.value !== undefined) {
      this.value = undefined;
    }
    if (!!this.comment && keepComment !== true) {
      this.comment = undefined;
    }
    this.setValueChangedDirectly(fromUI === true);
  }
  clearValueFromUI(): void {
    this.clearValue(true, true);
  }
  clearValueOnly(): void {
    this.clearValue(true);
  }
  public unbindValue(): void {
    this.clearValue();
  }
  public createValueCopy(): any {
    return this.getUnbindValue(this.value);
  }
  initDataUI(): void { }
  protected getUnbindValue(value: any): any {
    if (this.isValueSurveyElement(value)) return value;
    return Helpers.getUnbindValue(value);
  }
  protected isValueSurveyElement(val: any): boolean {
    if (!val) return false;
    if (Array.isArray(val))
      return val.length > 0 ? this.isValueSurveyElement(val[0]) : false;
    return val.isSurveyObj === true;
  }
  private canClearValueAsInvisible(reason: string): boolean {
    if (reason === "onHiddenContainer" && !this.isParentVisible) return true;
    if (this.isVisibleInSurvey) return false;
    if (!!this.page && this.page.isStartPage) return false;
    if (!this.survey) return true;
    return !this.survey.hasVisibleQuestionByValueName(this);
  }
  /**
   * Returns `true` if a parent element (page or panel) is visible.
   */
  public get isParentVisible(): boolean {
    if (this.parentQuestion && !this.parentQuestion.isVisible) return false;
    var parent = this.parent;
    while(parent) {
      if (!parent.isVisible) return false;
      parent = parent.parent;
    }
    return true;
  }
  public clearValueIfInvisible(reason: string = "onHidden"): void {
    const clearIf = this.getClearIfInvisible();
    if (clearIf === "none") return;
    if (reason === "onHidden" && clearIf === "onComplete") return;
    if (reason === "onHiddenContainer" && clearIf !== reason) return;
    this.clearValueIfInvisibleCore(reason);
  }
  protected clearValueIfInvisibleCore(reason: string): void {
    if (this.canClearValueAsInvisible(reason)) {
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
   * - `"onHiddenContainer"` - Clears the value when the question or its container (page or panel) becomes invisible. If a question is invisible on startup and has an initial value, this value will be cleared when the survey is complete.
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
  protected getClearIfInvisible(): string {
    const res = this.clearIfInvisible;
    if (!!this.survey) return this.survey.getQuestionClearIfInvisible(res);
    return res !== "default" ? res : "onComplete";
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
    if (this.survey) {
      res = this.survey.getQuestionDisplayValue(this, res);
    }
    return !!this.displayValueCallback ? this.displayValueCallback(res) : res;
  }
  private calcDisplayValue(keysAsText: boolean, value: any = undefined): any {
    if (this.customWidget) {
      var res = this.customWidget.getDisplayValue(this, value);
      if (res) return res;
    }
    value = value == undefined ? this.createValueCopy() : value;
    if (this.isValueEmpty(value) && !this.locDefaultDisplayValue.isEmpty) {
      value = this.defaultDisplayValue;
    }
    if (this.isValueEmpty(value, !this.allowSpaceAsAnswer)) return this.getDisplayValueEmpty();
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
   *
   * [View Demo](https://surveyjs.io/form-library/examples/specify-default-question-value-dynamically (linkStyle))
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
    this.setPropertyValue("defaultValue", this.valueToData(val));
    this.updateValueWithDefaults();
  }
  /**
   * An expression used to calculate the [`defaultValue`](https://surveyjs.io/form-library/documentation/question#defaultValue).
   *
   * This expression applies until the question [`value`](https://surveyjs.io/form-library/documentation/question#value) is specified by an end user or programmatically.
   *
   * An expression can reference other questions as follows:
   *
   * - `{other_question_name}`
   * - `{panel.other_question_name}` (to access questions inside the same dynamic panel)
   * - `{row.other_question_name}` (to access questions inside the same dynamic matrix or multi-column dropdown)
   *
   * An expression can also include built-in and custom functions for advanced calculations. For example, if the `defaultValue` should be today's date, set the `defaultValueExpression` to `"today()"`, and the corresponding built-in function will be executed each time the survey is loaded. Refer to the following help topic for more information: [Built-In Functions](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#built-in-functions).
   *
   * [View Demo](https://surveyjs.io/form-library/examples/specify-default-question-value-dynamically (linkStyle))
   * @see defaultValue
   * @see setValueExpression
   */
  public get defaultValueExpression(): any {
    return this.getPropertyValue("defaultValueExpression");
  }
  public set defaultValueExpression(val: any) {
    this.setPropertyValue("defaultValueExpression", val);
    this.defaultValueRunner = undefined;
    this.updateValueWithDefaults();
  }
  /**
   * A Boolean [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions). If it evaluates to `true`, the question value is reset to [default](#defaultValue).
   *
   * A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/set-question-value-dynamically/ (linkStyle))
   * @see setValueIf
   */
  public get resetValueIf(): string {
    return this.getPropertyValue("resetValueIf");
  }
  public set resetValueIf(val: string) {
    this.setPropertyValue("resetValueIf", val);
  }
  /**
   * A Boolean [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions). If it evaluates to `true`, the question value is set to a value calculated using the [`setValueExpression`](#setValueExpression).
   *
   * A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/set-question-value-dynamically/ (linkStyle))
   * @see resetValueIf
   */
  public get setValueIf(): string {
    return this.getPropertyValue("setValueIf");
  }
  public set setValueIf(val: string) {
    this.setPropertyValue("setValueIf", val);
  }
  /**
   * An [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) that calculates the question value.
   *
   * The `setValueExpression` is re-evaluated whenever a referenced question's value changes. If you also specify the [`setValueIf`](#setValueIf) expression, re-evaluation occurs only when it returns `true`.
   *
   * [View Demo](https://surveyjs.io/form-library/examples/set-question-value-dynamically/ (linkStyle))
   * @see defaultValueExpression
   * @see resetValueIf
   */
  public get setValueExpression(): string {
    return this.getPropertyValue("setValueExpression");
  }
  public set setValueExpression(val: string) {
    this.setPropertyValue("setValueExpression", val);
  }
  public get resizeStyle() {
    return this.allowResizeComment ? "both" : "none";
  }
  /**
   * Returns the question value as an object in which the question name, title, value, and other parameters are stored as individual properties.
   *
   * If the question can have more than one value (Matrix, Multiple Text), the object enables the `isNode` flag and stores information about these values in the `data` property. Refer to the following help topic for more information: [Access Full Survey Results](https://surveyjs.io/form-library/documentation/handle-survey-results-access#access-full-survey-results).
   *
   * Pass an object with the `includeEmpty` property set to `false` if you want to skip empty answers.
   */
  public getPlainData(options?: IPlainDataOptions): IQuestionPlainData {
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
        questionPlainData[calculation.propertyName] = this.getPlainDataCalculatedValue(calculation.propertyName);
      });
      if (this.showCommentArea) {
        questionPlainData.isNode = true;
        questionPlainData.data = [
          {
            name: 0,
            isComment: true,
            title: "Comment",
            value: settings.commentSuffix,
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
  protected getPlainDataCalculatedValue(propName: string): any {
    return this[propName];
  }
  /**
   * A correct answer to this question. Specify this property if you want to [create a quiz](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz).
   *
   * [View Demo](https://surveyjs.io/form-library/examples/make-quiz-javascript/ (linkStyle))
   * @see SurveyModel.getCorrectAnswerCount
   * @see SurveyModel.getIncorrectAnswerCount
   */
  public get correctAnswer(): any {
    return this.getPropertyValue("correctAnswer");
  }
  public set correctAnswer(val: any) {
    this.setPropertyValue("correctAnswer", this.valueToData(val));
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
    return this.checkIfAnswerCorrect() ? 1 : 0;
  }
  protected checkIfAnswerCorrect(): boolean {
    const isEqual = Helpers.isTwoValueEquals(this.value, this.correctAnswer, this.getAnswerCorrectIgnoreOrder(), settings.comparator.caseSensitive, true);
    const correct = isEqual ? 1 : 0;
    const incorrect = this.quizQuestionCount - correct;
    const options = {
      result: isEqual,
      correctAnswers: correct,
      correctAnswerCount: correct,
      incorrectAnswers: incorrect,
      incorrectAnswerCount: incorrect,
    };
    if (!!this.survey) {
      this.survey.onCorrectQuestionAnswer(this, options);
    }
    return options.result;
  }
  protected getAnswerCorrectIgnoreOrder(): boolean { return false; }
  /**
  * Returns `true` if a question answer matches the [`correctAnswer`](#correctAnswer) property value.
  *
  * [View Demo](https://surveyjs.io/form-library/examples/create-a-scored-quiz (linkStyle))
  * @see SurveyModel.getQuizQuestions
  */
  public isAnswerCorrect(): boolean {
    return this.correctAnswerCount == this.quizQuestionCount;
  }
  public updateValueWithDefaults(): void {
    if (this.isLoadingFromJson || (!this.isDesignMode && this.isDefaultValueEmpty())) return;
    const isEmpty = this.isEmpty();
    if (!this.isDesignMode && !isEmpty) return;
    if (isEmpty && this.isDefaultValueEmpty()) return;
    if (this.isClearValueOnHidden && !this.isVisible) return;
    if (this.isDesignMode && this.isContentElement && this.isDefaultValueEmpty()) return;
    this.setDefaultValue();
  }
  public get isValueDefault(): boolean {
    return !this.isEmpty() && (this.isTwoValueEquals(this.defaultValue, this.value) || !this.isValueChangedDirectly && !!this.defaultValueExpression);
  }
  protected get isClearValueOnHidden(): boolean {
    const clearIf = this.getClearIfInvisible();
    if (clearIf === "none" || clearIf === "onComplete") return false;
    return clearIf === "onHidden" || clearIf === "onHiddenContainer";
  }
  getQuestionFromArray(name: string, index: number): IQuestion {
    return null;
  }
  public getDefaultValue(): any {
    return this.defaultValue;
  }
  protected isDefaultValueEmpty(): boolean {
    return !this.defaultValueExpression && this.isValueEmpty(this.defaultValue, !this.allowSpaceAsAnswer);
  }
  protected setDefaultValue(): void {
    this.setDefaultValueCore((val: any): void => {
      val = this.convertToCorrectValue(val);
      if (!this.isTwoValueEquals(this.value, val)) {
        this.setDefaultIntoValue(val);
      }
    });
  }
  protected setDefaultIntoValue(val: any): void {
    this.value = val;
  }
  private setDefaultValueCore(setFunc: (val: any) => void): void {
    const func = (val: any) => {
      this.runExpressionSetValueCore(val, setFunc);
    };
    if (!this.runDefaultValueExpression(undefined, func)) {
      func(this.getUnbindValue(this.defaultValue));
    }
  }
  protected updateValueWithDefaultsOrClear(): void {
    if (this.isDesignMode || this.isLoadingFromJson) return;
    if (this.isDefaultValueEmpty()) {
      this.clearValue();
    } else {
      this.setDefaultValue();
    }
  }
  protected isValueExpression(val: any): boolean {
    return !!val && typeof val == "string" && val.length > 0 && val[0] == "=";
  }
  protected convertFuncValuetoQuestionValue(val: any): any {
    return Helpers.convertValToQuestionVal(val);
  }
  private runExpressionSetValueCore(val: any, setFunc?: (val: any) => void): void {
    setFunc(this.convertFuncValuetoQuestionValue(val));
  }
  private runExpressionSetValue(val: any): void {
    this.runExpressionSetValueCore(val, (val: any): void => {
      if (!this.isTwoValueEquals(this.value, val)) {
        this.startSetValueOnExpression();
        this.value = val;
        this.finishSetValueOnExpression();
      }
    });
  }
  protected startSetValueOnExpression(): void {
    this.survey?.startSetValueOnExpression();
  }
  protected finishSetValueOnExpression(): void {
    this.survey?.finishSetValueOnExpression();
  }
  private runDefaultValueExpression(properties: HashTable<any> = null, setFunc?: (val: any) => void): boolean {
    if (!this.data) return false;
    if (!setFunc) {
      setFunc = (val: any): void => {
        this.runExpressionSetValue(val);
      };
    }
    if (!properties) {
      properties = this.defaultValueExpression ? this.data.getFilteredProperties() : {};
      properties["question"] = this;
    }
    return this.runExpressionByProperty("defaultValueExpression", properties, (res: any) => {
      if (res == undefined) res = this.defaultValue;
      this.isChangingViaDefaultValue = true;
      setFunc(res);
      this.isChangingViaDefaultValue = false;
    });
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
    if (!!newValue && newValue !== this.comment) {
      const trimmedValue = newValue.toString().trim();
      if (trimmedValue !== newValue) {
        newValue = trimmedValue;
        if (newValue === this.comment) {
          this.setPropertyValueDirectly("comment", newValue);
        }
      }
    }
    if (this.comment == newValue) return;
    this.setNewComment(newValue);
  }

  public getCommentAreaCss(isOther: boolean = false): string {
    return new CssClassBuilder()
      .append("form-group", isOther)
      .append(this.cssClasses.formGroup, !isOther)
      .append(this.cssClasses.commentArea)
      .append(this.cssClasses.otherArea, isOther)
      .toString();
  }

  protected getQuestionComment(): string {
    return this.questionComment;
  }
  /**
   * Returns `true` if the question value is an empty string, array, or object or if it equals `undefined` or `null`.
   */
  public isEmpty(): boolean {
    return this.isValueEmpty(this.value, !this.allowSpaceAsAnswer);
  }
  public get isAnswered(): boolean {
    return this.getPropertyValue("isAnswered") || false;
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
   *
   * [Data Validation](https://surveyjs.io/form-library/documentation/data-validation (linkStyle))
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
    const res: Array<string> = [];
    let className = this.getType();
    while(!!className) {
      const classValidators = (<any>settings.supportedValidators)[className];
      if (!!classValidators) {
        for (let i = classValidators.length - 1; i >= 0; i--) {
          res.splice(0, 0, classValidators[i]);
        }
      }
      const classInfo = Serializer.findClass(className);
      className = classInfo.parentName;
    }
    return res;
  }
  public addConditionObjectsByContext(objects: Array<IConditionObject>, context: any): void {
    objects.push({
      name: this.getFilteredName(),
      text: this.processedTitle,
      question: this,
    });
  }
  /**
   * Returns an array of questions nested within the current question. Use this method to obtain questions within [Multiple Text](https://surveyjs.io/form-library/documentation/api-reference/multiple-text-entry-question-model), [Dynamic Panel](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model), and [Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-question-model)-like questions.
   * @param visibleOnly A Boolean value that specifies whether to include only visible nested questions.
   * @returns An array of nested questions.
   */
  public getNestedQuestions(visibleOnly: boolean = false, includeNested: boolean = true, includeItSelf: boolean = false): Array<Question> {
    const res: Array<Question> = [];
    this.collectNestedQuestions(res, visibleOnly, includeNested, includeItSelf);
    if (!includeItSelf && res.length === 1 && res[0] === this) return [];
    return res;
  }
  public collectNestedQuestions(questions: Array<Question>, visibleOnly: boolean = false, includeNested: boolean = true, includeItSelf: boolean = false): void {
    if (visibleOnly && !this.isVisible) return;
    this.collectNestedQuestionsCore(questions, visibleOnly, includeNested, includeItSelf);
  }
  protected collectNestedQuestionsCore(questions: Array<Question>, visibleOnly: boolean, includeNested: boolean, includeItSelf: boolean): void {
    questions.push(this);
  }
  addNestedQuestion(questions: Array<Question>, visibleOnly: boolean, includeNested: boolean, includeItSelf?: boolean): void {
    if (includeNested) {
      this.collectNestedQuestions(questions, visibleOnly, includeNested, includeItSelf);
    } else {
      if (!visibleOnly || this.isVisible) {
        questions.push(this);
      }
    }
  }
  public getConditionJson(operator: string = null, path: string = null): any {
    const json = new JsonObject().toJsonObject(this);
    json["type"] = this.getType();
    return json;
  }
  public hasErrors(fireCallback: boolean = true, focusOnFirstError: boolean = false): boolean {
    return !this.validateCore(fireCallback, false, focusOnFirstError);
  }
  /**
   * Validates this question and returns `false` if the validation fails.
   * @param fireCallback *(Optional)* Pass `false` if you do not want to show validation errors in the UI.
   * @see [Data Validation](https://surveyjs.io/form-library/documentation/data-validation)
   */
  public validate(fireCallback: boolean = true, focusFirstError: boolean = false, isOnValueChanged: boolean = false, callbackResult?: (res: boolean, question: Question) => void): boolean {
    return this.validateCore(fireCallback, true, focusFirstError, isOnValueChanged, callbackResult);
  }
  private validateCore(fireCallback: boolean, isRoot: boolean, focusOnFirstError: boolean = false, isOnValueChanged: boolean = false, callbackResult?: (res: boolean, question: Question) => void): boolean {
    if (isRoot && isOnValueChanged && !!this.parent) {
      this.parent.validateContainerOnly();
    }
    const context = new ValidationContext({
      isOnValueChanged: isOnValueChanged,
      focusOnFirstError: focusOnFirstError,
      fireCallback: fireCallback,
      callbackResult: callbackResult
    });
    this.validateElement(context);
    context.finish();
    return context.runningResult;
  }
  public validateElement(context: ValidationContext): boolean {
    return this.validateElementCore(context);
  }
  protected validateElementCore(context: ValidationContext): boolean {
    const errors = this.checkForErrors(context);
    if (context.fireCallback) {
      this.errors = errors;
      if (this.errors !== errors) {
        this.errors.forEach(er => er.locText.strChanged());
      }
    }
    context.setErrorElement(this, errors);
    this.updateContainsErrors();
    if (this.isCollapsed && context.fireCallback && errors.length > 0) {
      this.expand();
    }
    return errors.length === 0;
  }
  public get currentErrorCount(): number {
    return this.errors.length;
  }
  /**
   * Returns a character or text string that indicates a required question.
   * @see SurveyModel.requiredMark
   * @see isRequired
   */
  public get requiredMark(): string {
    return this.survey != null && this.isRequired
      ? this.survey.requiredMark
      : "";
  }
  /**
   * @deprecated Use the [`requiredMark`](https://surveyjs.io/form-library/documentation/api-reference/question#requiredMark) property instead.
   */
  public get requiredText(): string {
    return this.requiredMark;
  }
  public addError(error: SurveyError | string): void {
    if (!error) return;
    let newError: SurveyError = null;
    if (typeof error === "string" || error instanceof String) {
      newError = this.addCustomError(<string>error);
    } else {
      newError = <SurveyError>error;
    }
    this.errors.push(newError);
  }
  private addCustomError(error: string): SurveyError {
    return new CustomError(error, this.survey);
  }
  public removeError(error: SurveyError): boolean {
    if (!error) return false;
    const errors = this.errors;
    const index = errors.indexOf(error);
    if (index !== -1) errors.splice(index, 1);
    return index !== -1;
  }
  private checkForErrors(context: ValidationContext): Array<SurveyError> {
    var qErrors = new Array<SurveyError>();
    if (this.isVisible && this.canCollectErrors()) {
      this.collectErrors(qErrors, context);
    }
    if (!!this.survey) {
      if (this.validateValueCallback && qErrors.length === 0) {
        const error = this.validateValueCallback();
        if (error) {
          qErrors.push(error);
        }
      }
      this.survey.validateQuestion(this, qErrors, context.fireCallback);
    }
    return qErrors;
  }
  protected canCollectErrors(): boolean {
    return !this.isReadOnly || settings.readOnly.enableValidation;
  }
  private collectErrors(qErrors: Array<SurveyError>, context: ValidationContext): void {
    this.onCheckForErrors(qErrors, context.isOnValueChanged, context.fireCallback);
    if (qErrors.length > 0 || !this.canRunValidators(context.isOnValueChanged)) return;
    const errors = this.runValidators(context);
    if (errors.length > 0) {
      //validators may change the question value.
      qErrors.length = 0;
      for (var i = 0; i < errors.length; i++) {
        qErrors.push(errors[i]);
      }
    }
  }
  protected canRunValidators(isOnValueChanged: boolean): boolean {
    return true;
  }
  protected onCheckForErrors(errors: Array<SurveyError>, isOnValueChanged: boolean, fireCallback: boolean): void {
    if ((!isOnValueChanged || this.isOldAnswered) && this.hasRequiredError()) {
      const err = new AnswerRequiredError(this.requiredErrorText, this);
      err.onUpdateErrorTextCallback = (err) => { err.text = this.requiredErrorText; };
      errors.push(err);
    }
    if (!this.isEmpty() && this.customWidget) {
      const text = this.customWidget.validate(this);
      if (!!text) {
        errors.push(this.addCustomError(text));
      }
    }
  }
  public hasRequiredError(): boolean {
    return this.isRequired && this.isEmpty();
  }
  private validatorRunner: ValidatorRunner;
  public get isRunningValidators(): boolean {
    return this.getIsRunningValidators();
  }
  protected getIsRunningValidators(): boolean {
    return !!this.validatorRunner;
  }
  private runValidators(context: ValidationContext): Array<SurveyError> {
    if (!!this.validatorRunner) {
      this.validatorRunner.onAsyncCompleted = null;
    }
    this.validatorRunner = new ValidatorRunner();
    this.validatorRunner.onAsyncCompleted = (errors: Array<SurveyError>) => {
      this.doOnAsyncCompleted(context.fireCallback, errors);
      context.setErrorElement(this, errors);
      context.removeElement(this.id);
    };
    context.addElement(this.id);
    return this.validatorRunner.run(this);
  }
  private doOnAsyncCompleted(fireCallback: boolean, errors: Array<SurveyError>): void {
    if (fireCallback) {
      errors.forEach(er => {
        if (this.errors.indexOf(er) < 0) {
          this.errors.push(er);
        }
      });
    }
    this.validatorRunner = null;
  }
  public allowSpaceAsAnswer: boolean;
  private isValueChangedInSurvey = false;
  private isOldAnswered: boolean;
  private isSettingQuestionValue: boolean;
  protected allowNotifyValueChanged = true;
  protected setNewValue(newValue: any): void {
    if (this.survey) {
      newValue = this.survey.questionValueChanging(this, newValue);
    }
    if (this.isNewValueEqualsToValue(newValue)) return;
    if (!this.checkIsValueCorrect(newValue)) return;
    const oldValue = this.getUnbindValue(this.value);
    this.isOldAnswered = this.isAnswered;
    this.isSettingQuestionValue = true;
    this.setNewValueInData(newValue);
    this.allowNotifyValueChanged && this.onValueChanged();
    this.isSettingQuestionValue = false;
    if (this.isAnswered !== this.isOldAnswered) {
      this.updateQuestionCss();
    }
    this.isOldAnswered = undefined;
    if (this.parent) {
      this.parent.onQuestionValueChanged(this);
    }
    if (this.survey) {
      this.survey.questionValueChanged(this, oldValue);
    }
  }
  public getValueChangingOptions(childQuestion: Question): any { return undefined; }
  private checkIsValueCorrect(val: any): boolean {
    const res = this.isValueEmpty(val, !this.allowSpaceAsAnswer) || this.isNewValueCorrect(val);
    if (!res) {
      ConsoleWarnings.inCorrectQuestionValue(this.name, val);
    }
    return res;
  }
  protected isNewValueCorrect(val: any): boolean {
    return true;
  }
  protected isNewValueEqualsToValue(newValue: any): boolean {
    const val = this.value;
    if (!this.isTwoValueEquals(newValue, val, false, false)) return false;
    const isObj = newValue === val && !!val && (Array.isArray(val) || typeof val === "object");
    return !isObj;
  }
  protected isTextValue(): boolean {
    return false;
  }
  protected getIsInputTextUpdate(): boolean {
    return !!this.survey ? this.survey.isUpdateValueTextOnTyping : false;
  }
  get requireStrictCompare(): boolean { return false; }
  getExpressionValue(val: any): any { return val; }
  private getDataLocNotification(): any {
    return this.isInputTextUpdate ? "text" : false;
  }
  public get isInputTextUpdate(): boolean {
    return this.getIsInputTextUpdate() && this.isTextValue();
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
        this.allowNotifyValueChanged,
        this.name
      );
    }
    this.isMouseDown = false;
  }
  protected canSetValueToSurvey(): boolean {
    return true;
  }
  protected valueFromData(val: any): any { return val; }
  protected valueToData(val: any): any { return val; }
  protected convertToCorrectValue(val: any): any { return val; }
  protected onValueChanged(): void { }
  protected isMouseDown: boolean;
  onMouseDown(): void {
    this.isMouseDown = true;
  }
  protected setNewComment(newValue: string): void {
    if (this.questionComment === newValue) return;
    this.questionComment = newValue;
    this.setCommentIntoData(newValue);
  }
  protected setCommentIntoData(newValue: string): void {
    if (this.data != null) {
      this.data.setComment(
        this.getValueName(),
        newValue,
        this.getIsInputTextUpdate() ? "text" : false
      );
    }
  }
  protected getValidName(name: string): string {
    return makeNameValid(super.getValidName(name));
  }
  //IQuestion
  private isUpdateingValueFromSurvey: boolean;
  updateValueFromSurvey(newValue: any, clearData: boolean = false): void {
    newValue = this.getUnbindValue(newValue);
    newValue = this.valueFromDataCore(newValue);
    if (!this.checkIsValueCorrect(newValue)) return;
    const isEmpty = this.isValueEmpty(newValue);
    this.isUpdateingValueFromSurvey = true;
    if (!isEmpty && this.defaultValueExpression) {
      this.setDefaultValueCore((val: any): void => {
        this.updateValueFromSurveyCore(newValue, this.isTwoValueEquals(newValue, val));
      });
    } else {
      this.updateValueFromSurveyCore(newValue, <any>this.data !== <any>this.getSurvey());
      if (clearData && isEmpty) {
        this.isValueChangedDirectly = false;
      }
      if (isEmpty) {
        this.updateBindingsOnClearFromSurveyCore();
      }
    }
    this.isUpdateingValueFromSurvey = false;
    this.updateDependedQuestions();
    this.updateIsAnswered();
  }
  protected canUpdateBindings(): boolean { return !this.isUpdateingValueFromSurvey; }
  private updateBindingsOnClearFromSurveyCore(): void {
    const surveyData = this.data;
    if (surveyData && !this.isBindingEmpty()) {
      this.bindings.getNames().forEach(name => {
        const valueName = this.bindings.getValueNameByPropertyName(name);
        const val = surveyData.getValue(valueName);
        if (!this.isValueEmpty(val)) {
          this.updateBindingProp(name, val);
        }
      });
    }
  }
  private updateValueFromSurveyCore(newValue: any, viaDefaultVal: boolean): void {
    this.isChangingViaDefaultValue = viaDefaultVal;
    newValue = this.valueFromData(newValue);
    const isEqual = this.isTwoValueEquals(this.questionValue, this.convertToCorrectValue(newValue));
    this.setQuestionValue(newValue);
    if (!isEqual) {
      this.resetSingleInput();
    }
    this.isChangingViaDefaultValue = false;
  }
  updateCommentFromSurvey(newValue: any): any {
    this.questionComment = newValue;
  }
  protected onChangeQuestionValue(newValue: any): void { }
  protected setValueChangedDirectly(val: boolean): void {
    this.isValueChangedDirectly = val;
    if (!!this.setValueChangedDirectlyCallback) {
      this.setValueChangedDirectlyCallback(val);
    }
  }
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true): void {
    newValue = this.convertToCorrectValue(newValue);
    const isEqual = this.isTwoValueEquals(this.questionValue, newValue);
    if (!isEqual && !this.isChangingViaDefaultValue && !this.isParentChangingViaDefaultValue) {
      this.setValueChangedDirectly(true);
    }
    this.questionValue = newValue;
    if (!isEqual) {
      this.onChangeQuestionValue(newValue);
    }
    !isEqual && this.allowNotifyValueChanged &&
      this.fireCallback(this.valueChangedCallback);
    if (updateIsAnswered)this.updateIsAnswered();
  }
  private get isParentChangingViaDefaultValue(): boolean {
    return (<any>this.data)?.isChangingViaDefaultValue === true;
  }
  onSurveyValueChanged(newValue: any): void { }
  public setVisibleIndex(val: number): number {
    if (this.isVisibleIndexNegative(val)) {
      val = -1;
    }
    this.setPropertyValue("visibleIndex", val);
    this.resetPropertyValue("no");
    return val < 0 ? 0 : 1;
  }
  protected isVisibleIndexNegative(val: number): boolean {
    return val < 0 || !this.isVisible ||
      (!this.getHasTitleOnCalcNo() && !settings.numbering.includeQuestionsWithHiddenTitle) ||
      (!this.showNumber && !settings.numbering.includeQuestionsWithHiddenNumber);
  }
  public removeElement(element: IElement): boolean {
    return false;
  }
  // Obsolete
  supportGoNextPageAutomatic(): boolean { return this.supportAutoAdvance(); }
  public supportAutoAdvance(): boolean {
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
   * > This method does not remove values that fail validation. Call the `validate()` method to validate newly assigned values.
   *
   * @see validate
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
  onAnyValueChanged(name: string, questionName: string): void { }
  checkBindings(valueName: string, value: any): void {
    if (this.bindings.isEmpty() || !this.data) return;
    var props = this.bindings.getPropertiesByValueName(valueName);
    for (var i = 0; i < props.length; i++) {
      const propName = props[i];
      if (this.isValueEmpty(value) && Helpers.isNumber(this[propName])) {
        value = 0;
      }
      this.updateBindingProp(propName, value);
    }
  }
  protected updateBindingProp(propName: string, value: any): void {
    this[propName] = value;
  }
  public getComponentName(): string {
    return RendererFactory.Instance.getRendererByQuestion(this);
  }

  public isDefaultRendering(): boolean {
    return (
      !!this.customWidget ||
      this.getComponentName() === "default"
    );
  }
  public get renderAs(): string { return this.getPropertyValue("renderAs"); }
  public set renderAs(val: string) { this.setPropertyValue("renderAs", val); }

  public get inMatrixMode(): boolean { return this.getPropertyValue("inMatrixMode", false); }
  public set inMatrixMode(val: boolean) { this.setPropertyValue("inMatrixMode", val); }

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

  public processPopupVisiblilityChanged(popupModel: PopupModel, visible: boolean): void {
    this.survey.processPopupVisiblityChanged(this, popupModel, visible);
  }
  public processOpenDropdownMenu(options: IDropdownMenuOptions): void {
    this.survey.processOpenDropdownMenu(this, options);
  }

  protected onTextKeyDownHandler(event: any) {
    if (event.keyCode === 13) {
      (this.survey as SurveyModel).questionEditFinishCallback(this, event);
    }
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
    return this.supportResponsiveness() && !this.isDesignMode;
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

  protected onMobileChanged() {
    this.onMobileChangedCallback && this.onMobileChangedCallback();
  }

  private onMobileChangedCallback: () => void;

  public triggerResponsiveness(hard: boolean = true): void {
    if (this.triggerResponsivenessCallback) {
      this.triggerResponsivenessCallback(hard);
    }
  }
  private triggerResponsivenessCallback: (hard: boolean) => void;
  private initResponsiveness(el: HTMLElement) {
    if (!DomDocumentHelper.isAvailable()) { return; }
    this.destroyResizeObserver();
    if (!!el && this.isDefaultRendering()) {
      const scrollableSelector = this.getObservedElementSelector();
      if (!scrollableSelector) return;
      const defaultRootEl = el.querySelector(scrollableSelector);
      if (!defaultRootEl) return;
      let isProcessed = false;
      let requiredWidth: number = undefined;
      this.triggerResponsivenessCallback = (hard: boolean) => {
        if (hard) {
          requiredWidth = undefined;
          this.renderAs = "default";
          isProcessed = false;
        }
        const callback = () => {
          const rootEl = <HTMLElement>el.querySelector(scrollableSelector);
          if (this.isDefaultRendering()) {
            requiredWidth = rootEl.scrollWidth;
          }
          if (isProcessed || !isContainerVisible(rootEl)) {
            isProcessed = false;
          } else {
            const availableWidth = getElementWidth(rootEl);
            isProcessed = this.processResponsiveness(requiredWidth, availableWidth);
          }
        };
        if (hard) {
          setTimeout(callback, 1);
        } else {
          callback();
        }

      };
      this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        DomWindowHelper.requestAnimationFrame((): void | undefined => {
          this.triggerResponsiveness(false);
        });
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
  protected onBeforeSetCompactRenderer(): void { }
  protected onBeforeSetDesktopRenderer(): void { }
  protected processResponsiveness(requiredWidth: number, availableWidth: number): any {
    availableWidth = Math.round(availableWidth);
    if (Math.abs(requiredWidth - availableWidth) > 2) {
      const oldRenderAs = this.renderAs;
      if (requiredWidth > availableWidth) {
        this.onBeforeSetCompactRenderer();
        this.renderAs = this.getCompactRenderAs();
      } else {
        this.onBeforeSetDesktopRenderer();
        this.renderAs = this.getDesktopRenderAs();
      }
      return oldRenderAs !== this.renderAs;
    }
    return false;
  }
  public destroyResizeObserver(): void {
    if (!!this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
      this.onMobileChangedCallback = undefined;
      this.triggerResponsivenessCallback = undefined;
      this.renderAs = this.getDesktopRenderAs();
    }
  }
  public dispose(): void {
    super.dispose();
    this.resetDependedQuestions();
    this.destroyResizeObserver();
  }
  private resetDependedQuestions(): void {
    for (var i = 0; i < this.dependedQuestions.length; i++) {
      this.dependedQuestions[i].resetDependedQuestion();
    }
  }

  //a11y
  public get isNewA11yStructure(): boolean {
    return false;
  }
  public get ariaLabel(): string {
    if (this.isNewA11yStructure || (this.hasTitle && !this.parentQuestion)) return null;
    return this.locTitle.renderedHtml;
  }
  public get ariaRole(): string {
    if (this.isNewA11yStructure) return null;

    return "textbox";
  }
  public get ariaRequired() {
    if (this.isNewA11yStructure) return null;

    return this.isRequired ? "true" : "false";
  }
  public get ariaInvalid() {
    if (this.isNewA11yStructure) return null;

    return this.hasCssError() ? "true" : "false";
  }
  public get ariaLabelledBy(): string {
    if (this.isNewA11yStructure || !this.hasTitle || this.parentQuestion) return null;
    return this.ariaTitleId;
  }
  public get ariaDescribedBy(): string {
    if (this.isNewA11yStructure) return null;

    if (this.hasTitle && this.hasDescription) {
      return this.ariaDescriptionId;
    } else {
      return null;
    }
  }

  protected getContentAriaHidden(): boolean {
    return null;
  }
  public get contentAriaHidden(): boolean {
    return this.getContentAriaHidden();
  }

  public get ariaErrormessage(): string {
    if (this.isNewA11yStructure) return null;

    return this.hasCssError() ? this.id + "_errors" : null;
  }
  //EO a11y

  //new a11y
  public get a11y_input_ariaRole(): string {
    return null;
  }
  public get a11y_input_ariaRequired(): "true" | "false" {
    return this.isRequired ? "true" : "false";
  }
  public get a11y_input_ariaInvalid(): "true" | "false" {
    return this.hasCssError() ? "true" : "false";
  }
  public get a11y_input_ariaLabel(): string {
    if (this.hasTitle && !this.parentQuestion) {
      return null;
    } else {
      return this.locTitle.renderedHtml;
    }
  }
  public get a11y_input_ariaLabelledBy(): string {
    if (this.hasTitle && !this.parentQuestion) {
      return this.ariaTitleId;
    } else {
      return null;
    }
  }
  public get a11y_input_ariaDescribedBy(): string {
    let result = null;

    if (this.hasCssError()) {
      result = this.id + "_errors";
    } else if (this.hasTitle && !this.parentQuestion && this.hasDescription && this.descriptionLocation !== "hidden") {
      result = this.ariaDescriptionId;
    }

    return result;
  }
  public get a11y_input_ariaErrormessage(): string {
    return null;
    //return this.hasCssError() ? this.id + "_errors" : null; // due to https://cerovac.com/a11y/2024/06/support-for-aria-errormessage-is-getting-better-but-still-not-there-yet/
  }
  public get a11y_input_ariaExpanded(): "true" | "false" {
    return this.getPropertyValue("ariaExpanded");
  }
  //EO new a11y

  public get dragDropMatrixAttribute(): string {
    return null;
  }

  private _syncPropertiesChanging: boolean = false;
  protected registerSychProperties(names: Array<string>, func: any) {
    this.registerFunctionOnPropertiesValueChanged(names,
      () => {
        if (!this._syncPropertiesChanging) {
          this._syncPropertiesChanging = true;
          func();
          this._syncPropertiesChanging = false;
        }
      });
  }
}
function makeNameValid(str: string): string {
  if (!str) return str;
  str = str.trim().replace(/[\{\}]+/g, "");
  while(!!str && str[0] === settings.expressionDisableConversionChar) {
    str = str.substring(1);
  }
  return str;
}

Serializer.addClass("question", [
  { name: "!name", onSettingValue: (obj: any, val: any): any => { return makeNameValid(val); } },
  {
    name: "state",
    default: "default",
    choices: ["default", "collapsed", "expanded"],
  },
  { name: "visible:switch", default: true, overridingProperty: "visibleIf" },
  { name: "useDisplayValuesInDynamicTexts:boolean", alternativeName: "useDisplayValuesInTitle", default: true, layout: "row" },
  "visibleIf:condition",
  { name: "width" },
  { name: "minWidth", defaultFunc: () => settings.minWidth },
  { name: "maxWidth", defaultFunc: () => settings.maxWidth },
  {
    name: "colSpan:number", visible: false,
    onSerializeValue: (obj) => { return obj.getPropertyValue("colSpan"); },
  },
  {
    name: "effectiveColSpan:number", minValue: 1, isSerializable: false,
    visibleIf: function (obj: any) { return !!obj && !!obj.survey && obj.survey.gridLayoutEnabled; }
  },
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
        editor.placeholder = obj.locTitle.getPlaceholder();
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
    name: "showTitle:boolean",
    isSerializable: false,
    dependsOn: "titleLocation"
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
    name: "showNumber:boolean",
    dependsOn: "titleLocation",
    default: true,
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
  { name: "hideNumber:boolean", visible: false, isSerializable: false },
  { name: "valueName", onSettingValue: (obj: any, val: any): any => { return makeNameValid(val); } },
  "enableIf:condition",
  "resetValueIf:condition",
  "setValueIf:condition",
  "setValueExpression:expression",
  "defaultValue:value",
  {
    name: "defaultValueExpression:expression",
    category: "logic",
  },
  "correctAnswer:value",
  {
    name: "clearIfInvisible",
    default: "default",
    choices: ["default", "none", "onComplete", "onHidden", "onHiddenContainer"],
  },
  { name: "isRequired:switch", overridingProperty: "requiredIf" },
  "requiredIf:condition",
  {
    name: "requiredErrorText:text",
    serializationProperty: "locRequiredErrorText",
  },
  { name: "errorLocation", default: "default", choices: ["default", "top", "bottom"] },
  { name: "readOnly:switch", overridingProperty: "enableIf" },
  {
    name: "validators:validators",
    baseClassName: "surveyvalidator",
    classNamePart: "validator",
  },
  {
    name: "bindings:bindings",
    serializationProperty: "bindings",
    isSerializableFunc: (obj: any) => !obj.isBindingEmpty(),
    visibleIf: function (obj: any) {
      return obj.bindings.getNames().length > 0;
    },
  },
  { name: "renderAs", default: "default", visible: false },
  { name: "showCommentArea:switch", visible: false, default: false, alternativeName: "hasComment", category: "general" },
  {
    name: "commentText",
    dependsOn: "showCommentArea",
    visibleIf: function (obj: any) {
      return obj.showCommentArea;
    },
    serializationProperty: "locCommentText"
  },
  {
    name: "commentPlaceholder",
    alternativeName: "commentPlaceHolder",
    serializationProperty: "locCommentPlaceholder",
    dependsOn: "showCommentArea",
    visibleIf: function (obj: any) {
      return obj.showCommentArea;
    }
  },
  { name: "defaultDisplayValue", serializationProperty: "locDefaultDisplayValue" }
]);
Serializer.addAlterNativeClassName("question", "questionbase");
