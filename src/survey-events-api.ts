import { IAction } from "./actions/action";
import { Base } from "./base";
import { IElement, ISurveyElement } from "./base-interfaces";
import { ItemValue } from "./itemvalue";
import { PageModel } from "./page";
import { PanelModel, PanelModelBase } from "./panel";
import { Question } from "./question";
import { QuestionSelectBase } from "./question_baseselect";
import { QuestionFileModel } from "./question_file";
import { MatrixDropdownCell, MatrixDropdownRowModelBase, QuestionMatrixDropdownModelBase } from "./question_matrixdropdownbase";
import { MatrixDropdownColumn } from "./question_matrixdropdowncolumn";
import { QuestionMatrixDynamicModel } from "./question_matrixdynamic";
import { QuestionPanelDynamicModel } from "./question_paneldynamic";
import { SurveyModel } from "./survey";
import { SurveyError } from "./survey-error";
import { Trigger } from "./trigger";
export interface IOnTriggerExecutedOptions {
  trigger: Trigger;
}
export interface IOnCompletingOptions {
  isCompleteOnTrigger: boolean;
  allow: boolean;
  allowComplete: boolean;
}
export interface IOnCompleteOptions {
  clearSaveMessages: (test?: string) => void;
  showSaveSuccess: (text?: string) => void;
  showSaveError: (text?: string) => void;
  showSaveInProgress: (text?: string) => void;
  /**
  * @deprecated The method should not be used
  */
  showDataSaving: (text?: string) => void;
  /**
  * @deprecated The method should not be used
  */
  showDataSavingError: (text?: string) => void;
  /**
  * @deprecated The method should not be used
  */
  showDataSavingSuccess: (text?: string) => void;
  /**
  * @deprecated The method should not be used
  */
  showDataSavingClear: (text?: string) => void;
  isCompleteOnTrigger: boolean;
}
export interface IOnShowingPreviewOptions {
  allowShowPreview: boolean;
  allow: boolean;
}
export interface IOnNavigateToUrlOptions {
  allow: boolean;
  url: string;
}
export interface IOnStartedOptions {
}
export interface IOnPartialSendOptions {
}
export interface IOnCurrentPageChangingOptions {
  isPrevPage: boolean;
  isNextPage: boolean;
  allow: boolean;
  newCurrentPage: PageModel;
  oldCurrentPage: PageModel;
  allowChanging: boolean;
}
export interface IOnCurrentPageChangedOptions {
  isPrevPage: boolean;
  isNextPage: boolean;
  newCurrentPage: PageModel;
  oldCurrentPage: PageModel;
}
export interface IOnValueChangeBaseOptions {
  /**
   * The question whose value is being changed. If you use `valueName` and it is the same for several questions, this parameter contains the first question.
   */
  question: Question;
  /**
   * The `name` of the question whose value is being changed. If you use the [`valueName`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#valueName) property, this parameter contains its value.
   */
  name: string;
}
export interface IOnValueChangedOptions extends IOnValueChangeBaseOptions {
  /**
   * A new value.
   */
  value: any;
}
export interface IOnValueChangingOptions extends IOnValueChangeBaseOptions {
  /**
   * A new value. You can change it if required.
   */
  value: any;
  /**
   * A previous value.
   */
  oldValue: any;
}
export interface IOnVariableChangedOptions {
  value: any;
  name: string;
}
export interface IOnQuestionVisibleChangedOptions {
  visible: boolean;
  name: string;
  question: Question;
}
export interface IOnPageVisibleChangedOptions {
  visible: boolean;
  page: PageModel;
}
export interface IOnPanelVisibleChangedOptions {
  visible: boolean;
  panel: PanelModel;
}
export interface IOnQuestionCreatedOptions {
  question: Question;
}
export interface IOnQuestionAddedOptions {
  page: PanelModelBase;
  parent: PanelModelBase;
  rootPanel: any;
  parentPanel: any;
  index: number;
  name: string;
  question: Question;
}
export interface IOnQuestionRemovedOptions {
  name: string;
  question: Question;
}
export interface IOnPanelAddedOptions {
  page: PanelModelBase;
  parent: PanelModelBase;
  index: number;
  name: string;
  panel: PanelModel;
  parentPanel: any;
  rootPanel: any;
}
export interface IOnPanelRemovedOptions {
  name: string;
  panel: IElement;
}
export interface IOnPageAddedOptions {
  page: PageModel;
}
export interface IOnValidateQuestionOptions {
  error: string;
  value: any;
  name: string;
  question: Question;
}
export interface IOnSettingQuestionErrorsOptions {
  errors: Array<SurveyError>;
  question: Question;
}
export interface IOnServerValidateQuestionsOptions {
  complete: () => void;
  errors: { [index:string]: any };
  data: { [index:string]: any };
}
export interface IOnValidatePanelOptions {
  error: string;
  name: string;
  panel: PanelModel;
}
export interface IOnErrorCustomTextOptions {
  name: string;
  obj: Question | PanelModel | SurveyModel ;
  error: SurveyError;
  text: string;
}
export interface IOnValidatedErrorsOnCurrentPageOptions {
  questions: Array<Question>;
  errors: Array<SurveyError>;
  page: PageModel;
}
export interface IOnProcessHtmlOptions {
  html: string;
}
export interface IOnGetQuestionTitleOptions {
  question: Question;
  title: string;
}
export interface IOnGetTitleTagNameOptions {
  tagName: string;
  element: Base;
}
export interface IOnGetQuestionNoOptions {
  question: Question;
  no: string;
}
export interface IOnProgressTextOptions {
  requiredAnsweredQuestionCount: number;
  requiredQuestionCount: number;
  answeredQuestionCount: number;
  questionCount: number;
  text: string;
}
export interface IOnTextMarkdownOptions {
  html?: string;
  text: string;
  name: string;
  element: Question | PanelModel | PageModel | SurveyModel;
}
export interface IOnTextRenderAsOptions {
  renderAs: string;
  name: string;
  element: Question | PanelModel | PageModel | SurveyModel;
}
export interface IOnSendResultOptions {
  response: any;
  request: any;
  success: boolean;
}
export interface IOnGetResultOptions {
  response: any;
  dataList: Array<any>;
  data: any;
  success: boolean;
}
export interface IOnUploadFilesOptions {
  callback: (status: string, data?: any) => any;
  files: Array<File>;
  name: string;
  question: QuestionFileModel;
}
export interface IOnDownloadFileOptions {
  question: QuestionFileModel;
  callback: (status: string, data?: any) => any;
  fileValue: any;
  content: any;
  name: string;
}
export interface IOnClearFilesOptions {
  callback: (status: string, data?: any) => any;
  fileName: string;
  value: any;
  name: string;
  question: QuestionFileModel;
}
export interface IOnLoadChoicesFromServerOptions {
    serverResult: any;
    choices: Array<ItemValue>;
    question: QuestionSelectBase;
}
export interface IOnLoadedSurveyFromServiceOptions {
}
export interface IOnProcessTextValueOptions {
  value: any;
  isExists: boolean;
  canProcess: boolean;
  name: string;
  returnDisplayValue: boolean;
}
export interface IOnUpdateQuestionCssClassesOptions {
  cssClasses: any;
  question: Question;
}
export interface IOnUpdatePanelCssClassesOptions {
  cssClasses: any;
  panel: PanelModel;
}
export interface IOnUpdatePageCssClassesOptions {
  cssClasses: any;
  page: PageModel;
}
export interface IOnUpdateChoiceItemCssOptions {
  css: string;
  item: ItemValue;
  question: Question;
}
export interface IOnAfterRenderSurveyOptions {
  survey: SurveyModel;
  htmlElement: HTMLElement;
}
export interface IOnAfterRenderHeaderOptions {
  htmlElement: HTMLElement;
}
export interface IOnAfterRenderPageOptions {
  htmlElement: HTMLElement;
  page: PageModel;
}
export interface IOnAfterRenderQuestionOptions {
  htmlElement: HTMLElement;
  question: Question;
}
export interface IOnAfterRenderQuestionInputOptions {
  htmlElement: HTMLElement;
  question: Question;
}
export interface IOnAfterRenderPanelOptions {
  htmlElement: HTMLElement;
  panel: PanelModel;
}
export interface IOnFocusInQuestionOptions {
  question: Question;
}
export interface IOnFocusInPanelOptions {
  panel: PanelModel;
}
export interface IOnShowingChoiceItemOptions {
  visible: boolean;
  item: ItemValue;
  question: Question;
}
export interface IOnChoicesLazyLoadOptions {
  setItems: (items: Array<{ "value": any, "text"?: String, "imageLink"?: string, "customProperty"?: any } | string>, totalCount: number) => void;
  filter: string;
  take: number;
  skip: number;
  question: Question;
}
export interface IOnGetChoiceDisplayValueOptions {
  setItems: (displayValues: Array<string>) => void;
  values: Array<any>;
  question: Question;
}
export interface IOnMatrixRowAddedOptions {
  row: any;
  question: QuestionMatrixDynamicModel;
}
export interface IOnMatrixBeforeRowAddedOptions {
  canAddRow: boolean;
  question: QuestionMatrixDynamicModel;
}
export interface IOnMatrixRowRemovingOptions {
  allow: boolean;
  row: any;
  rowIndex: number;
  question: QuestionMatrixDynamicModel;
}
export interface IOnMatrixRowRemovedOptions {
  row: any;
  rowIndex: number;
  question: QuestionMatrixDynamicModel;
}
export interface IOnMatrixAllowRemoveRowOptions {
  allow: boolean;
  row: any;
  rowIndex: number;
  question: QuestionMatrixDynamicModel;
}
export interface IOnMatrixCellCreatingOptions {
  row: MatrixDropdownRowModelBase;
  columnName: string;
  column: MatrixDropdownColumn;
  rowValue: any;
  cellType: string;
  question: Question;
}
export interface IOnMatrixCellCreatedOptions {
  row: MatrixDropdownRowModelBase;
  columnName: string;
  column: MatrixDropdownColumn;
  rowValue: any;
  cellQuestion: Question;
  cell: MatrixDropdownCell;
  question: Question;
}
export interface IOnMatrixAfterCellRenderOptions {
  row: MatrixDropdownRowModelBase;
  column: MatrixDropdownColumn | MatrixDropdownCell;
  htmlElement: HTMLElement;
  cellQuestion: Question;
  cell: MatrixDropdownCell;
  question: Question;
}
export interface IOnMatrixCellValueChangedOptions {
  getCellQuestion: (columnName: string) => Question;
  row: MatrixDropdownRowModelBase;
  value: any;
  columnName: string;
  question: Question;
}
export interface IOnMatrixCellValueChangingOptions {
  getCellQuestion: (columnName: string) => Question;
  row: MatrixDropdownRowModelBase;
  oldValue: any;
  value: any;
  columnName: string;
  question: Question;
}
export interface IOnMatrixCellValidateOptions {
  getCellQuestion: (columnName: string) => Question;
  row: MatrixDropdownRowModelBase;
  value: any;
  columnName: string;
  question: QuestionMatrixDropdownModelBase;
  error?: string;
}
export interface IOnDynamicPanelAddedOptions {
  panelIndex: number;
  panel: PanelModel;
  question: QuestionPanelDynamicModel;
}
export interface IOnDynamicPanelRemovedOptions {
  panelIndex: number;
  panel: PanelModel;
  question: QuestionPanelDynamicModel;
}
export interface IOnDynamicPanelRemovingOptions {
  allow: boolean;
  panelIndex: number;
  panel: PanelModel;
  question: QuestionPanelDynamicModel;
}
export interface IOnTimerOptions {
}
export interface IOnTimerPanelInfoTextOptions {
  text: string;
}
export interface IOnDynamicPanelItemValueChangedOptions {
  panelData: { [index:string]: any };
  panelIndex: number;
  value: any;
  name: string;
  panel: PanelModel;
  question: QuestionPanelDynamicModel;
}
export interface IOnIsAnswerCorrectOptions {
  correctAnswers: number;
  incorrectAnswers: number;
  result: boolean;
  question: Question;
}
export interface IOnDragDropAllowOptions {
  insertAfter: IElement;
  insertBefore: IElement;
  parent: ISurveyElement;
  source: IElement;
  target: IElement;
  allow: boolean;
}
export interface IOnScrollingElementToTopOptions {
  element: ISurveyElement;
  question: Question;
  page: PageModel;
  cancel: boolean;
  elementId: string;
}
export interface IOnLocaleChangedEventOptions {}
export interface IOnGetQuestionTitleActionsOptions {
  titleActions: Array<IAction>;
  question: Question;
}
export interface IOnGetPanelTitleActionsOptions {
  titleActions: Array<IAction>;
  panel: PanelModel;
}
export interface IOnGetPageTitleActionsOptions {
  titleActions: Array<IAction>;
  page: PageModel;
}
export interface IOnGetPanelFooterActionsOptions {
  question?: QuestionPanelDynamicModel;
  actions: Array<IAction>;
  panel: PanelModel;
}
export interface IOnGetMatrixRowActionsOptions {
  actions: Array<IAction>;
  row: any;
  question: QuestionMatrixDropdownModelBase;
}
export interface IOnElementContentVisibilityChangedOptions {
  element: ISurveyElement;
}
export interface IOnGetExpressionDisplayValueOptions {
  displayValue: string;
  value: any;
  question: Question;
}
