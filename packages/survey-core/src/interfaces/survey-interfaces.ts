import type { LocalizableString } from "../localizablestring";
import type {
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase,
} from "../question_matrixdropdownbase";
import type { SurveyError } from "../survey-error";
import type { Base } from "../base";
import type { IAction } from "../actions/action";
import type { PanelModel } from "../panel";
import type { QuestionPanelDynamicModel } from "../question_paneldynamic";
import type { DragDropAllowEvent } from "../survey-events-api";
import type { PopupModel } from "../popup";
import type { ItemValue } from "../itemvalue";
import type {
  ISurveyElementLifecycle,
  ISurveyFileCallbacks,
  ISurveyMatrixCallbacks,
  ISurveyDynamicPanelCallbacks,
  ISurveyChoiceCallbacks,
  ISurveyCssCallbacks,
  ISurveyAfterRenderCallbacks,
} from "./survey-callbacks";
import type { ISurveyData, ITextProcessor } from "./data-interfaces";
import type { ISurveyErrorOwner, ISurveyValidation } from "./validation-interfaces";
import type { IDropdownMenuOptions, IScrollElementToTopOptions } from "./ui-interfaces";
import type { IElement, IPage, IPanel, IQuestion, ISurveyElement } from "./element-interfaces";

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
  //#endregion

  //#region Rendered ids
  getRenderedId(id: string): string;
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
