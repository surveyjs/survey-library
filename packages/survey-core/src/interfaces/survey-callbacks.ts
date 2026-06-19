import type { Base } from "../base";
import type { SurveyError } from "../survey-error";
import type { CreateCustomChoiceItemEvent } from "../survey-events-api";
import type {
  IElement,
  IPage,
  IPanel,
  IQuestion,
  ISurveyElement,
  IValueItemCustomPropValues,
} from "../base-interfaces";

/**
 * Callbacks for element lifecycle events (question/panel/page add, remove, rename, visibility).
 */
export interface ISurveyElementLifecycle {
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
  pageVisibilityChanged(page: IPage, newValue: boolean): any;
  panelVisibilityChanged(panel: IPanel, newValue: boolean): any;
  questionVisibilityChanged(question: IQuestion, newValue: boolean, resetIndexes: boolean): any;
  elementContentVisibilityChanged(element: ISurveyElement): void;
  pageShown(page: IPage): void;
}
/**
 * Callbacks for file upload, download, removal, and file chooser operations.
 */
export interface ISurveyFileCallbacks {
  uploadFiles(
    question: IQuestion,
    name: string,
    files: File[],
    uploadingCallback: (data: any | Array<any>, errors?: any | Array<any>) => any,
    sourceType?: string
  ): any;
  downloadFile(
    question: IQuestion,
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
  chooseFiles(input: HTMLInputElement, callback: (files: File[]) => void, context?: { element: Base, item?: any, elementType?: string, propertyName?: string }): void;
}
/**
 * Callbacks for matrix question events (row/cell add, remove, validate, render).
 */
export interface ISurveyMatrixCallbacks {
  matrixRowAdded(question: IQuestion, row: any): any;
  matrixColumnAdded(question: IQuestion, column: any): void;
  matrixBeforeRowAdded(options: {
    question: IQuestion,
    canAddRow: boolean,
  }): any;
  matrixRowRemoved(question: IQuestion, rowIndex: number, row: any): any;
  matrixRowRemoving(question: IQuestion, rowIndex: number, row: any): boolean;
  matrixAllowRemoveRow(question: IQuestion, rowIndex: number, row: any): boolean;
  matrixDetailPanelVisibleChanged(question: IQuestion, rowIndex: number, row: any, visible: boolean): void;
  matrixCellCreating(question: IQuestion, options: any): any;
  matrixCellCreated(question: IQuestion, options: any): any;
  matrixAfterCellRender(options: any): any;
  matrixCellValueChanged(question: IQuestion, options: any): any;
  matrixCellValueChanging(question: IQuestion, options: any): any;
  matrixCellValidate(question: IQuestion, options: any): SurveyError;
  matrixDragHandleArea: string;
}
/**
 * Callbacks for dynamic panel events (add, remove, tab title, index change).
 */
export interface ISurveyDynamicPanelCallbacks {
  dynamicPanelAdded(question: IQuestion, panelIndex: number, panel: IPanel, updateIndexes: boolean): void;
  dynamicPanelRemoved(question: IQuestion, panelIndex: number, panel: IPanel, updateIndexes: boolean): void;
  dynamicPanelRemoving(question: IQuestion, panelIndex: number, panel: IPanel): boolean;
  dynamicPanelGetTabTitle(question: IQuestion, options: any): any;
  dynamicPanelCurrentIndexChanged(question: IQuestion, options: any): void;
}
/**
 * Callbacks and settings for choice/select-based questions (choice visibility, display values,
 * server-populated choices, custom items).
 */
export interface ISurveyChoiceCallbacks {
  storeOthersAsComment: boolean;
  /**
   * @deprecated Use `clearDisabledChoices` instead.
   */
  clearValueOnDisableItems: boolean;
  clearDisabledChoices: boolean;
  canChangeChoiceItemsVisibility(): boolean;
  getChoiceItemVisibility(question: IQuestion, item: any, val: boolean): boolean;
  loadQuestionChoices(options: { question: IQuestion, filter: string, skip: number, take: number, setItems: (items: Array<any>, totalCount: number) => void }): void;
  getChoiceDisplayValue(options: { question: IQuestion, values: Array<any>, setItems: (displayValues: Array<string>, ...customValues: Array<IValueItemCustomPropValues>) => void }): void;
  updateChoicesFromServer(
    question: IQuestion,
    choices: Array<any>,
    serverResult: any
  ): Array<any>;
  loadedChoicesFromServer(question: IQuestion): void;
  createCustomChoiceItem(options: CreateCustomChoiceItemEvent);
}
/**
 * Callbacks for CSS class updates on questions, panels, pages, and choice items.
 */
export interface ISurveyCssCallbacks {
  updateQuestionCssClasses(question: IQuestion, cssClasses: any): any;
  updatePanelCssClasses(panel: IPanel, cssClasses: any): any;
  updatePageCssClasses(panel: IPanel, cssClasses: any): any;
  updateChoiceItemCss(question: IQuestion, options: any): any;
}
/**
 * Callbacks fired after rendering questions, panels, and pages.
 */
export interface ISurveyAfterRenderCallbacks {
  afterRenderQuestion(question: IQuestion, htmlElement: HTMLElement): any;
  afterRenderQuestionInput(question: IQuestion, htmlElement: HTMLElement): any;
  afterRenderPanel(panel: IElement, htmlElement: HTMLElement): any;
  afterRenderPage(htmlElement: HTMLElement): any;
}
