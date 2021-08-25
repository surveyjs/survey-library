import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { HashTable } from "./helpers";
import {
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase,
} from "./question_matrixdropdownbase";
import { AdaptiveActionContainer } from "./actions/adaptive-container";
import { SurveyError } from "./survey-error";
import { Base } from "./base";
import { IAction } from "./actions/action";

export interface ISurveyData {
  getValue(name: string): any;
  setValue(
    name: string,
    newValue: any,
    locNotification: any,
    allowNotifyValueChanged?: boolean
  ): any;
  getVariable(name: string): any;
  setVariable(name: string, newValue: any): void;
  getComment(name: string): string;
  setComment(name: string, newValue: string, locNotification: any): any;
  getAllValues(): any;
  getFilteredValues(): any;
  getFilteredProperties(): any;
}
export interface ITextProcessor {
  processText(text: string, returnDisplayValue: boolean): string;
  processTextEx(
    text: string,
    returnDisplayValue: boolean,
    doEncoding: boolean
  ): any;
}
export interface ISurveyErrorOwner extends ILocalizableOwner {
  getErrorCustomText(text: string, error: SurveyError): string;
}

export interface ISurvey extends ITextProcessor, ISurveyErrorOwner {
  currentPage: IPage;
  pages: Array<IPage>;
  getCss(): any;
  isPageStarted(page: IPage): boolean;
  getQuestionByName(name: string): IQuestion;
  pageVisibilityChanged(page: IPage, newValue: boolean): any;
  panelVisibilityChanged(panel: IPanel, newValue: boolean): any;
  questionVisibilityChanged(question: IQuestion, newValue: boolean): any;
  isEditingSurveyElement: boolean;
  isClearValueOnHidden: boolean;
  isClearValueOnHiddenContainer: boolean;
  questionsOrder: string;
  questionCreated(question: IQuestion): any;
  questionAdded(
    question: IQuestion,
    index: number,
    parentPanel: any,
    rootPanel: any
  ): any;
  panelAdded(
    panel: IElement,
    index: number,
    parentPanel: any,
    rootPanel: any
  ): any;
  questionRemoved(question: IQuestion): any;
  panelRemoved(panel: IElement): any;
  questionRenamed(
    question: IQuestion,
    oldName: string,
    oldValueName: string
  ): any;
  validateQuestion(question: IQuestion): SurveyError;
  validatePanel(panel: IPanel): SurveyError;
  hasVisibleQuestionByValueName(valueName: string): boolean;
  questionCountByValueName(valueName: string): number;
  processHtml(html: string): string;
  getSurveyMarkdownHtml(element: Base, text: string, name: string): string;
  getRendererForString(element: Base, name: string): string;
  getExpressionDisplayValue(
    question: IQuestion,
    value: any,
    displayValue: string
  ): string;
  isDisplayMode: boolean;
  isDesignMode: boolean;
  areInvisibleElementsShowing: boolean;
  areEmptyElementsHidden: boolean;
  isLoadingFromJson: boolean;
  isUpdateValueTextOnTyping: boolean;

  state: string;
  isLazyRendering: boolean;
  cancelPreviewByPage(panel: IPanel): any;
  editText: string;
  cssNavigationEdit: string;

  requiredText: string;
  beforeSettingQuestionErrors(
    question: IQuestion,
    errors: Array<SurveyError>
  ): void;
  beforeSettingPanelErrors(question: IPanel, errors: Array<SurveyError>): void;
  questionTitlePattern: string;
  getUpdatedQuestionTitle(question: IQuestion, title: string): string;
  getUpdatedQuestionNo(question: IQuestion, no: string): string;
  getUpdatedElementTitleActions(
    element: ISurveyElement,
    titleActions: Array<IAction>
  ): Array<IAction>;
  getUpdatedMatrixRowActions(
    question: QuestionMatrixDropdownModelBase,
    row: MatrixDropdownRowModelBase,
    actions: Array<IAction>
  ): Array<IAction>;
  questionStartIndex: string;
  questionTitleLocation: string;
  questionDescriptionLocation: string;
  questionErrorLocation: string;
  storeOthersAsComment: boolean;

  maxTextLength: number;
  maxOthersLength: number;
  clearValueOnDisableItems: boolean;

  uploadFiles(
    question: IQuestion,
    name: string,
    files: File[],
    uploadingCallback: (status: string, data: any) => any
  ): any;
  downloadFile(
    name: string,
    content: string,
    callback: (status: string, data: any) => any
  ): any;
  clearFiles(
    question: IQuestion,
    name: string,
    value: any,
    fileName: string,
    clearCallback: (status: string, data: any) => any
  ): any;
  updateChoicesFromServer(
    question: IQuestion,
    choices: Array<any>,
    serverResult: any
  ): Array<any>;
  updateQuestionCssClasses(question: IQuestion, cssClasses: any): any;
  updatePanelCssClasses(panel: IPanel, cssClasses: any): any;
  updatePageCssClasses(panel: IPanel, cssClasses: any): any;
  afterRenderQuestion(question: IQuestion, htmlElement: HTMLElement): any;
  afterRenderQuestionInput(question: IQuestion, htmlElement: HTMLElement): any;
  afterRenderPanel(panel: IElement, htmlElement: HTMLElement): any;
  afterRenderPage(htmlElement: HTMLElement): any;

  getQuestionByValueNameFromArray(
    valueName: string,
    name: string,
    index: number
  ): IQuestion;
  matrixRowAdded(question: IQuestion, row: any): any;
  matrixBeforeRowAdded(options: {
    question: IQuestion,
    canAddRow: boolean,
  }): any;
  matrixRowRemoved(question: IQuestion, rowIndex: number, row: any): any;
  matrixRowRemoving(question: IQuestion, rowIndex: number, row: any): boolean;
  matrixAllowRemoveRow(
    question: IQuestion,
    rowIndex: number,
    row: any
  ): boolean;
  matrixCellCreated(question: IQuestion, options: any): any;
  matrixAfterCellRender(question: IQuestion, options: any): any;
  matrixCellValueChanged(question: IQuestion, options: any): any;
  matrixCellValueChanging(question: IQuestion, options: any): any;
  isValidateOnValueChanging: boolean;
  matrixCellValidate(question: IQuestion, options: any): SurveyError;
  dynamicPanelAdded(question: IQuestion): any;
  dynamicPanelRemoved(
    question: IQuestion,
    panelIndex: number,
    panel: IPanel
  ): any;
  dynamicPanelItemValueChanged(question: IQuestion, options: any): any;

  dragAndDropAllow(options: any): boolean;

  scrollElementToTop(
    element: ISurveyElement,
    question: IQuestion,
    page: IPage,
    id: string
  ): any;
  runExpression(expression: string): any;
  elementContentVisibilityChanged(element: ISurveyElement): void;
}
export interface ISurveyImpl {
  getSurveyData(): ISurveyData;
  getSurvey(): ISurvey;
  getTextProcessor(): ITextProcessor;
}
export interface IConditionRunner {
  runCondition(values: HashTable<any>, properties: HashTable<any>): any;
}
export interface ISurveyElement {
  name: string;
  isVisible: boolean;
  isReadOnly: boolean;
  isPage: boolean;
  isPanel: boolean;
  containsErrors: boolean;
  parent: IPanel;
  setSurveyImpl(value: ISurveyImpl): any;
  onSurveyLoad(): any;
  onFirstRendering(): any;
  getType(): string;
  setVisibleIndex(value: number): number;
  locStrsChanged(): any;
  delete(): any;
  toggleState(): void;
  stateChangedCallback(): void;
  getTitleToolbar(): AdaptiveActionContainer;
}
export interface IElement extends IConditionRunner, ISurveyElement {
  visible: boolean;
  renderWidth: string;
  width: string;
  minWidth?: string;
  maxWidth?: string;
  isExpanded: boolean;
  isCollapsed: boolean;
  rightIndent: number;
  startWithNewLine: boolean;
  registerFunctionOnPropertyValueChanged(
    name: string,
    func: any,
    key: string
  ): void;
  unRegisterFunctionOnPropertyValueChanged(name: string, key: string): void;
  getPanel(): IPanel;
  getLayoutType(): string;
  isLayoutTypeSupported(layoutType: string): boolean;
  removeElement(el: IElement): boolean;
  onAnyValueChanged(name: string): any;
  updateCustomWidgets(): any;
  clearIncorrectValues(): any;
  clearErrors(): any;
  dispose(): void;
}

export interface IQuestion extends IElement, ISurveyErrorOwner {
  hasTitle: boolean;
  isEmpty(): boolean;
  onSurveyValueChanged(newValue: any): any;
  updateValueFromSurvey(newValue: any): any;
  updateCommentFromSurvey(newValue: any): any;
  supportGoNextPageAutomatic(): boolean;
  clearUnusedValues(): any;
  getDisplayValue(keysAsText: boolean, value: any): any;
  getValueName(): string;
  clearValue(): any;
  clearValueIfInvisible(): any;
  isAnswerCorrect(): boolean;
  updateValueWithDefaults(): any;
  getQuestionFromArray(name: string, index: number): IQuestion;
  value: any;
  survey: any;
}
export interface IParentElement {
  addElement(element: IElement, index: number): any;
  removeElement(element: IElement): boolean;
  isReadOnly: boolean;
}

export interface IPanel extends ISurveyElement, IParentElement {
  getChildrenLayoutType(): string;
  getQuestionTitleLocation(): string;
  getQuestionStartIndex(): string;
  parent: IPanel;
  elementWidthChanged(el: IElement): any;
  indexOf(el: IElement): number;
  elements: Array<IElement>;
  ensureRowsVisibility(): void;
}
export interface IPage extends IPanel, IConditionRunner {
  isStarted: boolean;
}
export interface ITitleOwner {
  name: string;
  no: string;
  requiredText: string;
  isRequireTextOnStart: boolean;
  isRequireTextBeforeTitle: boolean;
  isRequireTextAfterTitle: boolean;
  locTitle: LocalizableString;
}
export interface IProgressInfo {
  questionCount: number;
  answeredQuestionCount: number;
  requiredQuestionCount: number;
  requiredAnsweredQuestionCount: number;
}

export interface IWrapperObject {
  getOriginalObj(): Base;
  getClassNameProperty(): string;
}

export interface IFindElement {
  element: Base;
  str: LocalizableString;
}
