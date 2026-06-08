import { LocalizableString } from "./localizablestring";
import type {
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase,
} from "./question_matrixdropdownbase";
import { SurveyError } from "./survey-error";
import { Base } from "./base";
import { IAction } from "./actions/action";
import type { PanelModel } from "./panel";
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
import type { IDropdownMenuOptions, IScrollElementToTopOptions } from "./interfaces/ui-interfaces";
import type { IElement, IPage, IPanel, IQuestion, ISurveyElement } from "./interfaces/element-interfaces";

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

// UI / layout / environment interfaces are defined in ./interfaces/ui-interfaces
// and re-exported here so existing `./base-interfaces` importers keep working.
export type {
  IScrollElementToTopOptions,
  IElementUIState,
  ISurveyUIState,
  IWrapperObject,
  ISurveyEnvironment,
  LayoutElementContainer,
  HorizontalAlignment,
  VerticalAlignment,
  ISurveyLayoutElement,
  ILayoutElementModel,
  IDropdownMenuOptions,
} from "./interfaces/ui-interfaces";

// Serialization-option interfaces are defined in ./interfaces/serialization-interfaces
// and re-exported here so existing `./base-interfaces` importers keep working.
export type {
  IValueItemCustomPropValues,
  IFindElement,
  IPlainDataOptions,
  ILoadFromJSONOptions,
  ISaveToJSONOptions,
} from "./interfaces/serialization-interfaces";

// Element-hierarchy interfaces are defined in ./interfaces/element-interfaces
// and re-exported here so existing `./base-interfaces` importers keep working.
export type {
  IConditionRunner,
  IShortcutText,
  ISurveyElement,
  IElement,
  IQuestion,
  IParentElement,
  IPanel,
  IPage,
  ITitleOwner,
  IProgressInfo,
} from "./interfaces/element-interfaces";

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

