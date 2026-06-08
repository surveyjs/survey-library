import { LocalizableString } from "./localizablestring";
import { HashTable } from "./helpers";
import type {
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase,
} from "./question_matrixdropdownbase";
import type { AdaptiveActionContainer } from "./actions/adaptive-container";
import { SurveyError } from "./survey-error";
import { Base } from "./base";
import { IAction } from "./actions/action";
import type { PanelModel } from "./panel";
import type { PanelLayoutColumnModel } from "./panel-layout-column";
import type { QuestionPanelDynamicModel } from "./question_paneldynamic";
import { DragDropAllowEvent } from "./survey-events-api";
import type { PopupModel } from "./popup";
import type { ItemValue } from "./itemvalue";
import type {
  ISurveyElementLifecycle,
  ISurveyFileCallbacks,
  ISurveyMatrixCallbacks,
  ISurveyDynamicPanelCallbacks,
  ISurveyChoiceCallbacks,
  ISurveyCssCallbacks,
  ISurveyAfterRenderCallbacks,
} from "./interfaces/survey-callbacks";

import type { ISurveyData, ITextProcessor } from "./interfaces/data-interfaces";
import type { ISurveyErrorOwner, ISurveyValidation } from "./interfaces/validation-interfaces";

// Survey-host callback interfaces are defined in ./interfaces/survey-callbacks
// and re-exported here so existing `./base-interfaces` importers keep working.
export type {
  ISurveyElementLifecycle,
  ISurveyFileCallbacks,
  ISurveyMatrixCallbacks,
  ISurveyDynamicPanelCallbacks,
  ISurveyChoiceCallbacks,
  ISurveyCssCallbacks,
  ISurveyAfterRenderCallbacks,
} from "./interfaces/survey-callbacks";

// Data & text-processing interfaces are defined in ./interfaces/data-interfaces
// and re-exported here so existing `./base-interfaces` importers keep working.
export type {
  ISurveyVariables,
  ISurveyDataGetEditingObj,
  ISurveyData,
  ITextProcessorProp,
  ITextProcessorResult,
  ITextProcessor,
} from "./interfaces/data-interfaces";

// Validation/error-owner interfaces are defined in ./interfaces/validation-interfaces
// and re-exported here so existing `./base-interfaces` importers keep working.
export type {
  ISurveyErrorOwner,
  ISurveyValidatorOwner,
  ISurveyValidation,
} from "./interfaces/validation-interfaces";

export interface IScrollElementToTopOptions {
  element: ISurveyElement;
  question: IQuestion;
  page?: IPage;
  id: string;
  scrollIfVisible?: boolean;
  scrollIntoViewOptions?: ScrollIntoViewOptions;
  passedRootElement?: HTMLElement;
  onScolledCallback?: () => void;
}

export interface IValueItemCustomPropValues {
  propertyName: string;
  values: Array<any>;
}
/**
 * Settings and callbacks for title/numbering display (question titles, numbering, required mark,
 * title tag, element actions).
 */
export interface ISurveyTitleSettings {
  requiredMark: string;
  questionTitlePattern: string;
  questionTitleLocation: string;
  questionDescriptionLocation: string;
  questionErrorLocation: string;
  showQuestionNumbers: string | boolean;
  getQuestionStartIndex(pageVisibleIndex: number): string;
  getElementTitleTagName(element: Base, tagName: string): string;
  getQuestionDisplayValue(question: IElement, displayValue: any): any;
  getExpressionDisplayValue(
    question: IQuestion,
    value: any,
    displayValue: string
  ): string;
  getUpdatedQuestionTitle(question: IQuestion, title: string): string;
  getUpdatedQuestionNo(question: IQuestion, no: string): string;
  getUpdatedPanelNo(question: IPanel, no: string): string;
  getUpdatedPageNo(question: IPage, no: string): string;
  getUpdatedElementTitleActions(
    element: ISurveyElement,
    titleActions: Array<IAction>
  ): Array<IAction>;
  getUpdatedMatrixRowActions(
    question: QuestionMatrixDropdownModelBase,
    row: MatrixDropdownRowModelBase,
    actions: Array<IAction>
  ): Array<IAction>;
  getUpdatedPanelFooterActions(
    panel: PanelModel,
    actions: Array<IAction>,
    question?: QuestionPanelDynamicModel
  ): Array<IAction>;
}
/**
 * Settings and callbacks for single-input (single-question-per-page) mode.
 */
export interface ISurveySingleInput {
  currentSingleQuestion: IQuestion;
  isSingleVisibleInput: boolean;
  updateNavigationElements(): void;
  currentSingleElement: IElement;
  supportsNestedSingleInput(question: IQuestion): boolean;
  updateNestedSingleQuestions(question: IQuestion, nestedQuestions: Array<IQuestion>): void;
}
/**
 * The main survey interface, composed from focused sub-interfaces.
 *
 * Consumers that only need a subset of survey functionality can depend on the
 * narrower sub-interfaces (e.g. `ISurveyFileCallbacks`, `ISurveyMatrixCallbacks`)
 * instead of the full `ISurvey`.
 */
export interface ISurvey extends ITextProcessor, ISurveyErrorOwner,
  ISurveyElementLifecycle, ISurveyFileCallbacks, ISurveyMatrixCallbacks,
  ISurveyDynamicPanelCallbacks, ISurveyChoiceCallbacks, ISurveyCssCallbacks,
  ISurveyAfterRenderCallbacks, ISurveyTitleSettings, ISurveyValidation,
  ISurveySingleInput {

  //#region Page & navigation
  currentPage: IPage;
  activePage: IPage;
  pages: Array<IPage>;
  isPageStarted(page: IPage): boolean;
  state: string;
  cancelPreviewByPage(panel: IPanel): any;
  locEditText: LocalizableString;
  cssNavigationEdit: string;
  //#endregion

  //#region Question lookup
  getQuestionByName(name: string): IQuestion;
  getQuestionsByValueName(valueName: string): IQuestion[];
  questionsByValueName(valueName: string): Array<IQuestion>;
  hasVisibleQuestionByValueName(question: IQuestion): boolean;
  getQuestionByValueNameFromArray(
    valueName: string,
    name: string,
    index: number
  ): IQuestion;
  focusQuestionByInstance(question: IQuestion, onError: boolean): boolean;
  //#endregion

  //#region Question value changes
  questionValueChanging(question: IQuestion, newValue: any, isComment?: boolean): any;
  questionValueChanged(question: IQuestion, oldValue: any, isComment?: boolean): void;
  getQuestionClearIfInvisible(questionClearIf: string): string;
  keepIncorrectValues: boolean;
  questionOrder: string;
  //#endregion

  //#region Rendering & appearance
  getSkeletonComponentName(element: ISurveyElement): string;
  getCss(): any;
  processHtml(html: string, reason: string): string;
  getSurveyMarkdownHtml(element: Base, text: string, name: string, item?: any): string;
  getRendererForString(element: Base, name: string, item?: ItemValue): string;
  getRendererContextForString(element: Base, locStr: LocalizableString, item?: ItemValue): any;
  gridLayoutEnabled: boolean;
  isLazyRendering: boolean;
  lazyRenderFirstBatchSize: number;
  rootElement?: HTMLElement;
  //#endregion

  //#region Display modes & flags
  isDisplayMode: boolean;
  isDesignMode: boolean;
  isLoadingFromJson: boolean;
  isEditingSurveyElement: boolean;
  isSettingData(): boolean;
  areInvisibleElementsShowing: boolean;
  areEmptyElementsHidden: boolean;
  //#endregion

  //#region Text input settings
  isUpdateValueTextOnTyping: boolean;
  autoGrowComment: boolean;
  allowResizeComment: boolean;
  commentAreaRows: number;
  maxTextLength: number;
  maxCommentLength: number;
  //#endregion

  //#region Error handling
  getSurveyErrorCustomText(obj: Base, text: string, error: SurveyError): string;
  //#endregion

  //#region Expressions
  runExpression(expression: string, callback?: (res: any) => void): any;
  beforeExpressionRunning(obj: Base, propertyName: string, expression: string): string;
  startSetValueOnExpression(): void;
  finishSetValueOnExpression(): void;
  //#endregion

  //#region Misc callbacks
  multipleTextItemAdded(question: IQuestion, item: any): void;
  onCorrectQuestionAnswer(question: IQuestion, options: any): void;
  processPopupVisiblityChanged(question: IQuestion, popupModel: PopupModel, visible: boolean): void;
  processOpenDropdownMenu(question: IQuestion, options: IDropdownMenuOptions): void;
  dragAndDropAllow(options: DragDropAllowEvent): boolean;
  scrollElementToTop(options: IScrollElementToTopOptions): any;
  scrollElementToTop(element: ISurveyElement, question?: IQuestion, page?: IPage, id?: string, scrollIfVisible?: boolean, scrollIntoViewOptions?: ScrollIntoViewOptions, passedRootElement?: HTMLElement, onScolledCallback?: () => void): any;
  //#endregion

  //#region Timer & randomization
  timeLimitPerPage: number;
  randomSeed: number;
  //#endregion
}
export interface ISurveyImpl {
  getSurveyData(): ISurveyData;
  getSurvey(): ISurvey;
  getTextProcessor(): ITextProcessor;
}
export interface IConditionRunner {
  runCondition(properties: HashTable<any>): any;
}
export interface IShortcutText {
  shortcutText: string;
}
export interface ISurveyElement extends IShortcutText {
  name: string;
  isVisible: boolean;
  isReadOnly: boolean;
  isPage: boolean;
  isPanel: boolean;
  isQuestion: boolean;
  containsErrors: boolean;
  parent: IPanel;
  skeletonComponentName: string;
  setSurveyImpl(value: ISurveyImpl, isLight?: boolean): any;
  onSurveyLoad(): any;
  onFirstRendering(): any;
  getType(): string;
  setVisibleIndex(value: number): number;
  locStrsChanged(): any;
  delete(doDispose?: boolean): void;
  toggleState(): void;
  stateChangedCallback(): void;
  getTitleToolbar(): AdaptiveActionContainer;
  isCollapsed: boolean;
  isExpanded: boolean;
  expand(): void;
  collapse(): void;
  uiState: IElementUIState;
}
export interface IElementUIState {
  collapsed?: boolean;
  activePanelIndex?: number; // For Dynamic panel only, current Tab index
}
export interface ISurveyUIState {
  panels?: { [key:string]: IElementUIState };
  questions?: { [key:string]: IElementUIState };
  activeElementName?: string;
  randomSeed?: number;
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
  colSpan?: number;
  registerPropertyChangedHandlers(propertyNames: Array<string>, handler: any, key: string): void;
  registerFunctionOnPropertyValueChanged(name: string, func: any, key: string): void;
  unRegisterFunctionOnPropertyValueChanged(name: string, key: string): void;
  getPanels(): Array<IPanel>;
  getLayoutType(): string;
  isLayoutTypeSupported(layoutType: string): boolean;
  removeElement(el: IElement): boolean;
  onAnyValueChanged(name: string, questionName: string): void;
  updateCustomWidgets(): any;
  clearIncorrectValues(): any;
  clearErrors(): any;
  dispose(): void;
  needResponsiveWidth(): boolean;
  updateRootStyle(): void;
  updateElementVisibility(): void;
  ensureRowsVisibility(): void;
}

export interface IQuestion extends IElement, ISurveyErrorOwner {
  hasTitle: boolean;
  isEmpty(): boolean;
  onSurveyValueChanged(newValue: any): any;
  updateValueFromSurvey(newValue: any, clearData: boolean): void;
  updateCommentFromSurvey(newValue: any): any;
  supportAutoAdvance(): boolean;
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
  getQuestionTitleWidth(): string;
  getQuestionStartIndex(): string;
  getQuestionErrorLocation(): string;
  getColumsForElement(el: IElement): Array<PanelLayoutColumnModel>;
  updateColumns(): void;
  parent: IPanel;
  elementWidthChanged(el: IElement): any;
  indexOf(el: IElement): number;
  elements: Array<IElement>;
  ensureRowsVisibility(): void;
  validateContainerOnly(): void;
}
export interface IPage extends IPanel, IConditionRunner {
  isStartPage: boolean;
}
export interface ITitleOwner {
  name: string;
  no: string;
  requiredMark: string;
  cssTitleNumber: string;
  cssRequiredMark?: string;
  isRequireTextOnStart: boolean;
  isRequireTextBeforeTitle: boolean;
  isRequireTextAfterTitle: boolean;
  locTitle: LocalizableString;
  locRenderedTitle: LocalizableString;
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

export type ISurveyEnvironment = {
  root: Document | ShadowRoot,
  rootElement: HTMLElement | ShadowRoot,
  popupMountContainer: HTMLElement | string,
  svgMountContainer: HTMLElement | string,
  stylesSheetsMountContainer: HTMLElement,
}

export type LayoutElementContainer = "header" | "footer" | "left" | "right" | "contentTop" | "contentBottom" | "center";
export type HorizontalAlignment = "left" | "center" | "right";
export type VerticalAlignment = "top" | "middle" | "bottom";

export interface ISurveyLayoutElement {
  id: string;
  container?: LayoutElementContainer | Array<LayoutElementContainer>;
  isInContainer?: (container: LayoutElementContainer) => boolean;
  component?: string;
  template?: string;
  data?: any;
  index?: number;
  getData?: () => any;
  processResponsiveness?: (width: number) => void;
}

export interface ILayoutElementModel {
  createLayoutElements(): Array<ISurveyLayoutElement>;
}
export interface IPlainDataOptions {
  includeEmpty?: boolean;
  includeQuestionTypes?: boolean;
  includeValues?: boolean;
  calculations?: Array<{
    propertyName: string,
  }>;
}
export interface ILoadFromJSONOptions {
  validatePropertyValues?: boolean;
}
/**
 * An interface with configuration options that control how a `SurveyModel` instance is serialized by the [`toJSON()`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#toJSON) method.
 */
export interface ISaveToJSONOptions {
  /**
   * Specifies whether the exported JSON schema should include properties whose values are equal to their defaults.
   *
   * Default value: `false`
   */
  storeDefaults?: boolean;
  version?: string;
  /**
   * Specifies how locale-specific strings are handled during JSON export.
   *
   * Possible values:
   *
   * - `true` (default)\
   * Export the full JSON schema, including all locale strings. Use the [`locales`](#locales) array to restrict the output to specific locales.
   * - `false`\
   * Export the JSON schema without any textual content.
   * - `"stringsOnly"`\
   * Export a JSON schema that contains only locale strings and the minimal set of properties required to identify survey elements. Use the [`locales`](#locales) array to restrict the output to specific locales. To apply a locale-strings-only schema to a survey model, call the [`mergeLocalizationJSON(json, locales)`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#mergeLocalizationJSON) method.
   *
   * > As an alternative to calling `toJSON()` with `"stringsOnly"`, you can call the [`getLocalizationJSON(locales)`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#getLocalizationJSON) method, which is syntactic sugar.
   */
  storeLocaleStrings?: boolean | "stringsOnly";
  /**
   * Specifies the locales to include in the exported JSON schema. Applies only when [`storeLocaleStrings`](#storeLocaleStrings) is `true` or `"stringsOnly"`.
   */
  locales?: Array<string>;
}

export interface IDropdownMenuOptions {
  menuType: "dropdown" | "popup" | "overlay";
  deviceType: "mobile" | "tablet" | "desktop";
  hasTouchScreen: boolean;
  screenHeight: number;
  screenWidth: number;
}
