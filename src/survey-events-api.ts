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
  /**
   * [`Trigger`](https://surveyjs.io/form-library/documentation/api-reference/trigger) - A trigger that has been executed.
   */
  trigger: Trigger;
}
export interface IOnCompletingOptions {
  /**
   * Returns `true` if survey completion is caused by the ["complete" trigger](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#complete).
   */
  isCompleteOnTrigger: boolean;
  /**
   * Set this property to `false` if you want to prevent survey completion.
   */
  allow: boolean;
  allowComplete: boolean;
}
export interface IOnCompleteOptions {
  /**
   * Call this method to hide the save operation messages.
   */
  clearSaveMessages: (test?: string) => void;
  /**
   * Call this method to indicate that survey results are successfully saved. You can use the `text` parameter to display a custom message.
   */
  showSaveSuccess: (text?: string) => void;
  /**
   * Call this method to indicate that an error occurred during the save operation. You can use the `text` parameter to display a custom error message.
   */
  showSaveError: (text?: string) => void;
  /**
   * Call this method to indicate that the save operation is in progress. You can use the `text` parameter to display a custom message.
   */
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
  /**
   * Set this property to `false` if you want to cancel the preview.
   */
  allow: boolean;
}
export interface IOnNavigateToUrlOptions {
  /**
   * Set this property to `false` if you want to cancel the navigation and show the [complete page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#complete-page).
   */
  allow: boolean;
  /**
   * A URL to which respondents should be navigated. You can modify this parameter's value.
   */
  url: string;
}
export interface IOnStartedOptions {
}
export interface IOnPartialSendOptions {
}
export interface IOnCurrentPageChangingOptions {
  /**
   * Returns `true` if the respondent is going backwards, that is, `newCurrentPage` is earlier in the survey than `oldCurrentPage`.
   */
  isPrevPage: boolean;
  /**
   * Returns `true` if the respondent is going forward along the survey.
   */
  isNextPage: boolean;
  /**
   * Set this property to `false` if you do not want to switch the current page.
   */
  allow: boolean;
  /**
   * A page that will be current.
   */
  newCurrentPage: PageModel;
  /**
   * The current page.
   */
  oldCurrentPage: PageModel;
  allowChanging: boolean;
}
export interface IOnCurrentPageChangedOptions {
  /**
   * Returns `true` if the respondent is going backwards, that is, `newCurrentPage` is earlier in the survey than `oldCurrentPage`.
   */
  isPrevPage: boolean;
  /**
   * Returns `true` if the respondent is going forward along the survey.
   */
  isNextPage: boolean;
  /**
   * The current page.
   */
  newCurrentPage: PageModel;
  /**
   * A page that used to be current.
   */
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
  /**
   * A new value for the variable or calculated value.
   */
  value: any;
  /**
   * The name of the variable or calculated value that has been changed.
   */
  name: string;
}
export interface IOnQuestionVisibleChangedOptions {
  /**
   * Indicates whether the question is visible now.
   */
  visible: boolean;
  /**
   * The question's name.
   */
  name: string;
  /**
   * A question whose visibility has been changed.
   */
  question: Question;
}
export interface IOnPageVisibleChangedOptions {
  /**
   * Indicates whether the page is visible now.
   */
  visible: boolean;
  /**
   * A page whose visibility has been changed.
   */
  page: PageModel;
}
export interface IOnPanelVisibleChangedOptions {
  /**
   * Indicates whether the panel is visible now.
   */
  visible: boolean;
  /**
   * A panel whose visibility has been changed.
   */
  panel: PanelModel;
}
export interface IOnQuestionCreatedOptions {
  /**
   * A created question.
   */
  question: Question;
}
export interface IOnQuestionAddedOptions {
  /**
   * A page that nests the added question.
   */
  page: PanelModelBase;
  /**
   * The parent container (panel or page).
   */
  parent: PanelModelBase;
  rootPanel: any;
  parentPanel: any;
  /**
   * The question's index within the parent container (panel or page).
   */
  index: number;
  /**
   * The question's name.
   */
  name: string;
  /**
   * A new question.
   */
  question: Question;
}
export interface IOnQuestionRemovedOptions {
  /**
   * The question's name.
   */
  name: string;
  /**
   * A deleted question.
   */
  question: Question;
}
export interface IOnPanelAddedOptions {
  /**
   * A page that nests the added panel.
   */
  page: PanelModelBase;
  /**
   * The parent container (panel or page).
   */
  parent: PanelModelBase;
  /**
   * The panel's index within the parent container (panel or page).
   */
  index: number;
  /**
   * The panel's name.
   */
  name: string;
  /**
   * A new panel.
   */
  panel: PanelModel;
  parentPanel: any;
  rootPanel: any;
}
export interface IOnPanelRemovedOptions {
  /**
   * The panel's name.
   */
  name: string;
  /**
   * A deleted panel.
   */
  panel: IElement;
}
export interface IOnPageAddedOptions {
  /**
   * A new page.
   */
  page: PageModel;
}
export interface IOnValidateQuestionOptions {
  /**
   * An error message that you should specify if validation fails.
   */
  error: string;
  /**
   * A question value being validated.
   */
  value: any;
  /**
   * The question's name.
   */
  name: string;
  /**
   * A question being validated.
   */
  question: Question;
}
export interface IOnSettingQuestionErrorsOptions {
  /**
   * the list of errors. The list is empty by default and remains empty if a validated question has no errors
   */
  errors: Array<SurveyError>;
  /**
   * a validated question
   */
  question: Question;
}
export interface IOnServerValidateQuestionsOptions {
  /**
   * A method that you should call when a request to the server has completed.
   */
  complete: () => void;
  /**
   * An object for your error messages. Set error messages as follows: `options.errors["questionName"] = "My error message"`
   */
  errors: { [index: string]: any };
  /**
   * Question values. You can get an individual question value as follows: `options.data["questionName"]`.
   */
  data: { [index: string]: any };
}
export interface IOnValidatePanelOptions {
  /**
   * An error message that you should specify if validation fails.
   */
  error: string;
  /**
   * The panel's name.
   */
  name: string;
  /**
   * A panel being validated.
   */
  panel: PanelModel;
}
export interface IOnErrorCustomTextOptions {
  /**
   * the error name. The following error names are available:
   * required, requireoneanswer, requirenumeric, exceedsize, webrequest, webrequestempty, otherempty,
   * uploadingfile, requiredinallrowserror, minrowcounterror, keyduplicationerror, custom
   */
  name: string;
  /**
   * an instance of Question, Panel or Survey object to where error is located
   */
  obj: Question | PanelModel | SurveyModel;
  /**
   * an instance of the `SurveyError` object
   */
  error: SurveyError;
  /**
   * an error text
   */
  text: string;
}
export interface IOnValidatedErrorsOnCurrentPageOptions {
  /**
   * the list of questions that have errors
   */
  questions: Array<Question>;
  /**
   * the list of errors
   */
  errors: Array<SurveyError>;
  /**
   * the page where question(s) are located
   */
  page: PageModel;
}
export interface IOnProcessHtmlOptions {
  /**
   * an HTML that you may change before text processing and then rendering. specifies the modified HTML content
   */
  html: string;
}
export interface IOnGetQuestionTitleOptions {
  /**
   * a question object
   */
  question: Question;
  /**
   * a calculated question title, based on question `title`, `name`
   */
  title: string;
}
export interface IOnGetTitleTagNameOptions {
  /**
   * an element title tagName that are used to render a title. You can change it from the default value
   */
  tagName: string;
  /**
   * an element (question, panel, page and survey) that SurveyJS is going to render
   */
  element: Base;
}
export interface IOnGetQuestionNoOptions {
  /**
   * a question object
   */
  question: Question;
  /**
   * a calculated question no, based on question `visibleIndex`, survey `.questionStartIndex` properties. You can change it
   */
  no: string;
}
export interface IOnProgressTextOptions {
  /**
   * a number of required questions that have input(s) and an user has answered
   */
  requiredAnsweredQuestionCount: number;
  /**
   * a number of required questions that have input(s). We do not count html or expression questions
   */
  requiredQuestionCount: number;
  /**
   * a number of questions that have input(s) and an user has answered
   */
  answeredQuestionCount: number;
  /**
   * a number of questions that have input(s). We do not count html or expression questions
   */
  questionCount: number;
  /**
   * a progress text, that SurveyJS will render in progress bar
   */
  text: string;
}
export interface IOnTextMarkdownOptions {
  /**
   * an HTML content. It is `null` by default. Use this property to specify the HTML content rendered instead of `options.text`
   */
  html?: string;
  /**
   * a text that is going to be rendered
   */
  text: string;
  /**
   * a property name is going to be rendered
   */
  name: string;
  /**
   * SurveyJS element (a question, panel, page, or survey) where the string is going to be rendered
   */
  element: Question | PanelModel | PageModel | SurveyModel;
}
export interface IOnTextRenderAsOptions {
  /**
   * a component name used for text rendering
   */
  renderAs: string;
  /**
   * a property name is going to be rendered
   */
  name: string;
  /**
   * SurveyJS element (a question, panel, page, or survey) where the string is going to be rendered
   */
  element: Question | PanelModel | PageModel | SurveyModel;
}
export interface IOnSendResultOptions {
  /**
   * a response from the service
   */
  response: any;
  request: any;
  /**
   * it is `true` if the results has been sent to the service successfully
   */
  success: boolean;
}
export interface IOnGetResultOptions {
  /**
   * the server response
   */
  response: any;
  /**
   * an array of objects `{name, value}`, where `name` is a unique value/answer to the question and `value` is a number/count of such answers
   */
  dataList: Array<any>;
  /**
   * the object `{AnswersCount, QuestionResult : {} }`. `AnswersCount` is the number of posted survey results. `QuestionResult` is an object with all possible unique answers to the question and number of these answers
   */
  data: any;
  /**
   * it is `true` if the results were got from the service successfully
   */
  success: boolean;
}
export interface IOnUploadFilesOptions {
  /**
   * a callback function to get the file upload status and the updloaded file content
   */
  callback: (status: string, data?: any) => any;
  /**
   * the Javascript File objects array to upload
   */
  files: Array<File>;
  /**
   * the question name
   */
  name: string;
  /**
   * the file question instance
   */
  question: QuestionFileModel;
}
export interface IOnDownloadFileOptions {
  question: QuestionFileModel;
  /**
   * a callback function to get the file downloading status and the downloaded file content
   */
  callback: (status: string, data?: any) => any;
  /**
   * single file question value
   */
  fileValue: any;
  /**
   * the file content
   */
  content: any;
  /**
   * the question name
   */
  name: string;
}
export interface IOnClearFilesOptions {
  /**
   * a callback function to get the operation status
   */
  callback: (status: string, data?: any) => any;
  /**
   * a removed file's name, set it to `null` to clear all files
   */
  fileName: string;
  /**
   * the question value
   */
  value: any;
  /**
   * the question name
   */
  name: string;
  /**
   * the question instance
   */
  question: QuestionFileModel;
}
export interface IOnLoadChoicesFromServerOptions {
  /**
   * a result that comes from the server as it is
   */
  serverResult: any;
  /**
   * the loaded choices. You can change the loaded choices to before they are assigned to question
   */
  choices: Array<ItemValue>;
  /**
   * the question where loaded choices are going to be assigned
   */
  question: QuestionSelectBase;
}
export interface IOnLoadedSurveyFromServiceOptions {
}
export interface IOnProcessTextValueOptions {
  /**
   * the value of the processing text
   */
  value: any;
  /**
   * a boolean value. Set it to `true` if you want to use the value and set it to `false` if you don't
   */
  isExists: boolean;
  canProcess: boolean;
  /**
   * the name of the processing value, for example, "state" in our example
   */
  name: string;
  returnDisplayValue: boolean;
}
export interface IOnUpdateQuestionCssClassesOptions {
  /**
   * an object with CSS classes. For example `{root: "table", button: "button"}`. You can change them to your own CSS classes
   */
  cssClasses: any;
  /**
   * a question for which you can change the CSS classes
   */
  question: Question;
}
export interface IOnUpdatePanelCssClassesOptions {
  /**
   * an object with CSS classes. For example `{title: "sv_p_title", description: "small"}`. You can change them to your own CSS classes
   */
  cssClasses: any;
  /**
   * a panel for which you can change the CSS classes
   */
  panel: PanelModel;
}
export interface IOnUpdatePageCssClassesOptions {
  /**
   * an object with CSS classes. For example `{title: "sv_p_title", description: "small"}`. You can change them to your own CSS classes
   */
  cssClasses: any;
  /**
   * a page for which you can change the CSS classes
   */
  page: PageModel;
}
export interface IOnUpdateChoiceItemCssOptions {
  /**
   * a string with css classes divided by space. You can change it
   */
  css: string;
  /**
   * a choice item of ItemValue type. You can get value or text choice properties as options.item.value or options.choice.text
   */
  item: ItemValue;
  /**
   * a question where choice item is rendered
   */
  question: Question;
}
export interface IOnAfterRenderSurveyOptions {
  survey: SurveyModel;
  /**
   * a root HTML element bound to the survey object
   */
  htmlElement: HTMLElement;
}
export interface IOnAfterRenderHeaderOptions {
  /**
   * an HTML element bound to the survey header object
   */
  htmlElement: HTMLElement;
}
export interface IOnAfterRenderPageOptions {
  /**
   * an HTML element bound to the page object
   */
  htmlElement: HTMLElement;
  /**
   * a page object for which the event is fired. Typically the current/active page
   */
  page: PageModel;
}
export interface IOnAfterRenderQuestionOptions {
  /**
   * an HTML element bound to the question object
   */
  htmlElement: HTMLElement;
  /**
   * a question object for which the event is fired
   */
  question: Question;
}
export interface IOnAfterRenderQuestionInputOptions {
  /**
   * an HTML element bound to the question object
   */
  htmlElement: HTMLElement;
  /**
   * a question object for which the event is fired
   */
  question: Question;
}
export interface IOnAfterRenderPanelOptions {
  /**
   * an HTML element bound to the panel object
   */
  htmlElement: HTMLElement;
  /**
   * a panel object for which the event is fired
   */
  panel: PanelModel;
}
export interface IOnFocusInQuestionOptions {
  /**
   * A [question](https://surveyjs.io/Documentation/Library?id=Question) whose child element gets focus
   */
  question: Question;
}
export interface IOnFocusInPanelOptions {
  /**
   * A [panel](https://surveyjs.io/Documentation/Library?id=PanelModelBase) whose child element gets focus
   */
  panel: PanelModel;
}
export interface IOnShowingChoiceItemOptions {
  /**
   * A Boolean value that specifies item visibility. Set it to `false` to hide the item.
   */
  visible: boolean;
  /**
   * The choice item as specified in the [choices](https://surveyjs.io/Documentation/Library?id=QuestionSelectBase#choices) array.
   */
  item: ItemValue;
  /**
   * A Question instance to which the choice item belongs.
   */
  question: Question;
}
export interface IOnChoicesLazyLoadOptions {
  /**
   * A method that you should call to assign loaded items to the question. Item objects should be structured as specified in the [`choices`](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model#choices) property description. If their structure is different, [map their properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) to bring them to the required structure.
   */
  setItems: (items: Array<{ "value": any, "text"?: String, "imageLink"?: string, "customProperty"?: any } | string>, totalCount: number) => void;
  /**
   * A search string used to filter choices.
   */
  filter: string;
  /**
   * The number of choice items to load. You can use the question's [`choicesLazyLoadPageSize`](https://surveyjs.io/form-library/documentation/questiondropdownmodel#choicesLazyLoadPageSize) property to change this number.
   */
  take: number;
  /**
   * The number of choice items to skip.
   */
  skip: number;
  /**
   * A Question instance for which the event is raised.
   */
  question: Question;
}
export interface IOnGetChoiceDisplayValueOptions {
  /**
   * A method that you should call to assign display texts to the question.
   */
  setItems: (displayValues: Array<string>) => void;
  /**
   * An array of one (in Dropdown) or more (in Tag Box) default values.
   */
  values: Array<any>;
  /**
   * A Question instance for which the event is raised.
   */
  question: Question;
}
export interface IOnMatrixRowAddedOptions {
  /**
   * a new added row
   */
  row: any;
  /**
   * a matrix question
   */
  question: QuestionMatrixDynamicModel;
}
export interface IOnMatrixBeforeRowAddedOptions {
  /**
   * specifies whether a new row can be added
   */
  canAddRow: boolean;
  /**
   * a matrix question
   */
  question: QuestionMatrixDynamicModel;
}
export interface IOnMatrixRowRemovingOptions {
  /**
   * a boolean property. Set it to `false` to disable the row removing
   */
  allow: boolean;
  /**
   * a row object
   */
  row: any;
  /**
   * a row index
   */
  rowIndex: number;
  /**
   * a matrix question
   */
  question: QuestionMatrixDynamicModel;
}
export interface IOnMatrixRowRemovedOptions {
  /**
   * a removed row object
   */
  row: any;
  /**
   * a removed row index
   */
  rowIndex: number;
  /**
   * a matrix question
   */
  question: QuestionMatrixDynamicModel;
}
export interface IOnMatrixAllowRemoveRowOptions {
  /**
   * a boolean property. Set it to `false` to disable the row removing
   */
  allow: boolean;
  /**
   * a row object
   */
  row: any;
  /**
   * a row index
   */
  rowIndex: number;
  /**
   * a matrix question
   */
  question: QuestionMatrixDynamicModel;
}
export interface IOnMatrixCellCreatingOptions {
  /**
   * the matrix row object
   */
  row: MatrixDropdownRowModelBase;
  /**
   * the matrix column name
   */
  columnName: string;
  /**
   * the matrix column object
   */
  column: MatrixDropdownColumn;
  /**
   * the value of the current row. To access a particular column's value within the current row, use: `options.rowValue["columnValue"]`
   */
  rowValue: any;
  /**
   * the cell question type. You can change it
   */
  cellType: string;
  /**
   * the matrix question
   */
  question: Question;
}
export interface IOnMatrixCellCreatedOptions {
  /**
   * the matrix row object
   */
  row: MatrixDropdownRowModelBase;
  /**
   * the matrix column name
   */
  columnName: string;
  /**
   * the matrix column object
   */
  column: MatrixDropdownColumn;
  /**
   * the value of the current row. To access a particular column's value within the current row, use: `options.rowValue["columnValue"]`
   */
  rowValue: any;
  /**
   * the question/editor in the cell. You may customize it, change it's properties, like choices or visible
   */
  cellQuestion: Question;
  /**
   * the matrix cell
   */
  cell: MatrixDropdownCell;
  /**
   * the matrix question
   */
  question: Question;
}
export interface IOnMatrixAfterCellRenderOptions {
  /**
   * the matrix row object
   */
  row: MatrixDropdownRowModelBase;
  /**
   * the matrix column object
   */
  column: MatrixDropdownColumn | MatrixDropdownCell;
  /**
   * an HTML element bound to the `cellQuestion` object
   */
  htmlElement: HTMLElement;
  /**
   * the question/editor in the cell
   */
  cellQuestion: Question;
  /**
   * the matrix cell
   */
  cell: MatrixDropdownCell;
  /**
   * the matrix question
   */
  question: Question;
}
export interface IOnMatrixCellValueChangedOptions {
  /**
   * the function that returns the cell question by column name
   */
  getCellQuestion: (columnName: string) => Question;
  /**
   * the matrix row object
   */
  row: MatrixDropdownRowModelBase;
  /**
   * a new value
   */
  value: any;
  /**
   * the matrix column name
   */
  columnName: string;
  /**
   * the matrix question
   */
  question: Question;
}
export interface IOnMatrixCellValueChangingOptions {
  /**
   * the function that returns a cell question by column name
   */
  getCellQuestion: (columnName: string) => Question;
  /**
   * the matrix row object
   */
  row: MatrixDropdownRowModelBase;
  /**
   * the old value
   */
  oldValue: any;
  /**
   * a new value
   */
  value: any;
  /**
   * the matrix column name
   */
  columnName: string;
  /**
   * the matrix question
   */
  question: Question;
}
export interface IOnMatrixCellValidateOptions {
  /**
   * the function that returns the cell question by column name
   */
  getCellQuestion: (columnName: string) => Question;
  /**
   * the matrix row object
   */
  row: MatrixDropdownRowModelBase;
  /**
   * a cell value
   */
  value: any;
  /**
   * the matrix column name
   */
  columnName: string;
  /**
   * the matrix question
   */
  question: QuestionMatrixDropdownModelBase;
  /**
   * an error string. It is empty by default
   */
  error?: string;
}
export interface IOnDynamicPanelAddedOptions {
  /**
   * The panel's index within Dynamic Panel.
   */
  panelIndex: number;
  /**
   * An added panel.
   */
  panel: PanelModel;
  /**
   * A Dynamic Panel question.
   */
  question: QuestionPanelDynamicModel;
}
export interface IOnDynamicPanelRemovedOptions {
  /**
   * The panel's index within Dynamic Panel.
   */
  panelIndex: number;
  /**
   * A deleted panel.
   */
  panel: PanelModel;
  /**
   * A Dynamic Panel question.
   */
  question: QuestionPanelDynamicModel;
}
export interface IOnDynamicPanelRemovingOptions {
  /**
   * Set this property to `false` if you want to cancel the panel deletion.
   */
  allow: boolean;
  /**
   * The panel's index within Dynamic Panel.
   */
  panelIndex: number;
  /**
   * A panel to be deleted.
   */
  panel: PanelModel;
  /**
   * A Dynamic Panel question.
   */
  question: QuestionPanelDynamicModel;
}
export interface IOnTimerOptions {
}
export interface IOnTimerPanelInfoTextOptions {
  /**
   * the timer panel info text
   */
  text: string;
}
export interface IOnDynamicPanelItemValueChangedOptions {
  /**
   * The panel's data object that includes all item values.
   */
  panelData: { [index: string]: any };
  /**
   * The panel's index within Dynamic Panel.
   */
  panelIndex: number;
  /**
   * The item's new value.
   */
  value: any;
  /**
   * The item's name.
   */
  name: string;
  /**
   * A panel that nests the item with a changed value.
   */
  panel: PanelModel;
  /**
   * A Dynamic Panel question.
   */
  question: QuestionPanelDynamicModel;
}
export interface IOnIsAnswerCorrectOptions {
  /**
   * you may change the default number of correct or incorrect answers in the question, for example for matrix, where each row is a quiz question
   */
  correctAnswers: number;
  incorrectAnswers: number;
  /**
   * returns `true`, if an answer is correct, or `false`, if the answer is not correct. Use questions' `value` and `correctAnswer` properties to return the correct value
   */
  result: boolean;
  /**
   * a question on which you have to decide if the answer is correct or not
   */
  question: Question;
}
export interface IOnDragDropAllowOptions {
  /**
   * an element after the target element is dragging. It can be `null` if parent container (page or panel) is empty or dragging element to the first position within the parent container
   */
  insertAfter: IElement;
  /**
   * an element before the target element is dragging. It can be `null` if parent container (page or panel) is empty or dragging an element after the last element in a container
   */
  insertBefore: IElement;
  /**
   * a page or panel where target element is dragging
   */
  parent: ISurveyElement;
  /**
   * a source element. It can be `null`, if it is a new element, dragging from toolbox
   */
  source: IElement;
  /**
   * a target element that is dragged
   */
  target: IElement;
  /**
   * set it to `false` to disable dragging
   */
  allow: boolean;
}
export interface IOnScrollingElementToTopOptions {
  /**
   * an element that is going to be scrolled on top
   */
  element: ISurveyElement;
  /**
   * a question that is going to be scrolled on top. It can be null if options.page is not null
   */
  question: Question;
  /**
   * a page that is going to be scrolled on top. It can be null if options.question is not null
   */
  page: PageModel;
  /**
   * set this property to true to cancel the default scrolling
   */
  cancel: boolean;
  /**
   * the unique element DOM Id
   */
  elementId: string;
}
export interface IOnLocaleChangedEventOptions {
}
export interface IOnGetQuestionTitleActionsOptions {
  /**
   * A list of actions ([IAction](https://surveyjs.io/Documentation/Library?id=IAction) objects) associated with the processed question
   */
  titleActions: Array<IAction>;
  /**
   * A [Question](https://surveyjs.io/Documentation/Library?id=Question) object for which the event is fired
   */
  question: Question;
}
export interface IOnGetPanelTitleActionsOptions {
  /**
   * A list of actions ([IAction](https://surveyjs.io/Documentation/Library?id=IAction) objects) associated with the processed panel
   */
  titleActions: Array<IAction>;
  /**
   * A panel ([PanelModel](https://surveyjs.io/Documentation/Library?id=panelmodel) object) for which the event is fired
   */
  panel: PanelModel;
}
export interface IOnGetPageTitleActionsOptions {
  /**
   * A list of actions ([IAction](https://surveyjs.io/Documentation/Library?id=IAction) objects) associated with the processed page
   */
  titleActions: Array<IAction>;
  /**
   * A page ([PageModel](https://surveyjs.io/Documentation/Library?id=pagemodel) object) for which the event is fired
   */
  page: PageModel;
}
export interface IOnGetPanelFooterActionsOptions {
  /**
   * A [Dynamic Panel](https://surveyjs.io/form-library/documentation/questionpaneldynamicmodel) to which the Panel belongs. This field is `undefined` if the Panel does not belong to any Dynamic Panel
   */
  question?: QuestionPanelDynamicModel;
  /**
   * An array of panel [actions](https://surveyjs.io/form-library/documentation/iaction). You can modify the entire array or individual actions within it
   */
  actions: Array<IAction>;
  /**
   * A Panel whose actions are being modified
   */
  panel: PanelModel;
}
export interface IOnGetMatrixRowActionsOptions {
  /**
   * A list of actions ([IAction](https://surveyjs.io/Documentation/Library?id=IAction) objects) associated with the processed matrix question and row
   */
  actions: Array<IAction>;
  /**
   * A matrix row for which the event is fired
   */
  row: any;
  /**
   * A matrix question ([QuestionMatrixBaseModel](https://surveyjs.io/Documentation/Library?id=questionmatrixbasemodel) object) for which the event is fired
   */
  question: QuestionMatrixDropdownModelBase;
}
export interface IOnElementContentVisibilityChangedOptions {
  /**
   * Specifies which survey element content was collapsed or expanded
   */
  element: ISurveyElement;
}
export interface IOnGetExpressionDisplayValueOptions {
  /**
   * the display value that you can change before rendering
   */
  displayValue: string;
  /**
   * The question value
   */
  value: any;
  /**
   * The expression question
   */
  question: Question;
}
