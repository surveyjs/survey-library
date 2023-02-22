import { IAction } from "./actions/action";
import { Base } from "./base";
import { IElement, ISurveyElement } from "./base-interfaces";
import { ItemValue } from "./itemvalue";
import { PageModel } from "./page";
import { PanelModel, PanelModelBase } from "./panel";
import { Question } from "./question";
import { QuestionFileModel } from "./question_file";
import { MatrixDropdownCell, MatrixDropdownRowModelBase, QuestionMatrixDropdownModelBase } from "./question_matrixdropdownbase";
import { MatrixDropdownColumn } from "./question_matrixdropdowncolumn";
import { QuestionMatrixDynamicModel } from "./question_matrixdynamic";
import { QuestionPanelDynamicModel } from "./question_paneldynamic";
import { SurveyModel } from "./survey";
import { SurveyError } from "./survey-error";
import { Trigger } from "./trigger";

export interface IEmptyOptions {
}
export interface IQuestionOptions {
  /**
   * A Question instance for which the event is raised.
   */
  question: Question;
}
export interface IFileQuestionOptions extends IQuestionOptions {
  /**
   * A File Question instance for which the event is raised.
   */
  question: QuestionFileModel;
}
export interface IPanelDynamicQuestionOptions extends IQuestionOptions {
  /**
   * A Panel Dynamic Question instance for which the event is raised.
   */
  question: QuestionPanelDynamicModel;
}
export interface IMatrixDropdownQuestionOptions extends IQuestionOptions {
  /**
 * A Matrix Dynamic Question instance for which the event is raised.
 */
  question: QuestionMatrixDropdownModelBase;
}
export interface IMatrixDynamicQuestionOptions extends IMatrixDropdownQuestionOptions {
 /**
  * A Matrix Dynamic Question instance for which the event is raised.
  */
  question: QuestionMatrixDynamicModel;
}
export interface IPanelOptions {
  /**
   * A panel object for which the event is fired
   */
  panel: PanelModel;
}
export interface IPageOptions {
  /**
   * A page object for which the event is fired
   */
  page: PageModel;
}
export interface IOnGetTitleActionsOptions {
  /**
   * A list of actions ([IAction](https://surveyjs.io/Documentation/Library?id=IAction) objects) associated with the processed element
   */
  titleActions: Array<IAction>;
}
export interface IOnGetActionsOptions {
  /**
   * An array of [actions](https://surveyjs.io/form-library/documentation/iaction). You can modify the entire array or individual actions within it
   */
  actions: Array<IAction>;
}
export interface IOnAterRenderElementOptions {
  /**
   * an HTML element bound to the event's object
   */
  htmlElement: HTMLElement;
}
export interface IOnUpdateElementCssClassesOptions {
  /**
   * an object with CSS classes. For example `{root: "table", button: "button"}`. You can change them to your own CSS classes
   */
  cssClasses: any;
}
export interface IOnElementVisibleChangedOptions {
  /**
   * Indicates whether the element is visible now.
   */
  visible: boolean;
}

export interface IOnTriggerExecutedOptions {
  /**
   * A trigger that has been executed.
   */
  trigger: Trigger;
}

export interface IOnCompleteBaseOptions {
  /**
   * Returns `true` if survey completion is caused by the ["complete" trigger](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#complete).
   */
  isCompleteOnTrigger: boolean;
}
export interface IOnCompletingOptions extends IOnCompleteBaseOptions {

  /**
   * Set this property to `false` if you want to prevent survey completion.
   */
  allow: boolean;
  allowComplete: boolean;
}
export interface IOnCompleteOptions extends IOnCompleteBaseOptions {
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
export interface IOnCurrentPageChangingOptions extends IOnCurrentPageChangedOptions {
  /**
   * Set this property to `false` if you do not want to switch the current page.
   */
  allow: boolean;
  allowChanging: boolean;
}

export interface IOnValueChangeBaseOptions extends IQuestionOptions {
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
export interface IOnQuestionVisibleChangedOptions extends IQuestionOptions, IOnElementVisibleChangedOptions {
  /**
   * The question's name.
   */
  name: string;
}
export interface IOnPageVisibleChangedOptions extends IOnElementVisibleChangedOptions, IPageOptions { }
export interface IOnPanelVisibleChangedOptions extends IOnElementVisibleChangedOptions, IPanelOptions { }
export interface IOnQuestionCreatedOptions extends IQuestionOptions { }

export interface IOnElementAddedOptions {
  /**
   * A page that nests the added element.
   */
  page: PanelModelBase;
  /**
   * The parent container (panel or page).
   */
  parent: PanelModelBase;
  rootPanel: any;
  parentPanel: any;
  /**
   * The element's index within the parent container (panel or page).
   */
  index: number;
  /**
   * The question's name.
   */
  name: string;
}
export interface IOnElementRemovedOptions {
  /**
   * The element's name.
   */
  name: string;
}
export interface IOnQuestionAddedOptions extends IQuestionOptions, IOnElementAddedOptions {}
export interface IOnQuestionRemovedOptions extends IQuestionOptions, IOnElementRemovedOptions {}
export interface IOnPanelAddedOptions extends IPanelOptions, IOnElementAddedOptions {}
export interface IOnPanelRemovedOptions extends IPanelOptions, IOnElementRemovedOptions {}
export interface IOnPageAddedOptions extends IPageOptions {}
export interface IOnValidateQuestionOptions extends IQuestionOptions {
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
}
export interface IOnSettingQuestionErrorsOptions extends IQuestionOptions {
  /**
   * the list of errors. The list is empty by default and remains empty if a validated question has no errors
   */
  errors: Array<SurveyError>;
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
export interface IOnValidatePanelOptions extends IPanelOptions {
  /**
   * An error message that you should specify if validation fails.
   */
  error: string;
  /**
   * The panel's name.
   */
  name: string;
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
export interface IOnValidatedErrorsOnCurrentPageOptions extends IPageOptions {
  /**
   * the list of questions that have errors
   */
  questions: Array<Question>;
  /**
   * the list of errors
   */
  errors: Array<SurveyError>;
}
export interface IOnProcessHtmlOptions {
  /**
   * an HTML that you may change before text processing and then rendering. specifies the modified HTML content
   */
  html: string;
}
export interface IOnGetQuestionTitleOptions extends IQuestionOptions {
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
export interface IOnGetQuestionNoOptions extends IQuestionOptions {
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

export interface IOnTextProcessingOptions {
  /**
   * a property name is going to be rendered
   */
  name: string;
  /**
   * SurveyJS element (a question, panel, page, or survey) where the string is going to be rendered
   */
  element: Question | PanelModel | PageModel | SurveyModel;
}
export interface IOnTextMarkdownOptions extends IOnTextProcessingOptions {
  /**
   * an HTML content. It is `null` by default. Use this property to specify the HTML content rendered instead of `options.text`
   */
  html?: string;
  /**
   * a text that is going to be rendered
   */
  text: string;
}
export interface IOnTextRenderAsOptions extends IOnTextProcessingOptions {
  /**
   * a component name used for text rendering
   */
  renderAs: string;
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

export interface IOnLoadFilesOptions extends IFileQuestionOptions {
  /**
 * the question name
 */
  name: string;
}
export interface IOnUploadFilesOptions extends IOnLoadFilesOptions {
  /**
   * a callback function to get the file upload status and the updloaded file content
   */
  callback: (status: string, data?: any) => any;
  /**
   * the Javascript File objects array to upload
   */
  files: Array<File>;

}
export interface IOnDownloadFileOptions extends IOnLoadFilesOptions {
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
}
export interface IOnClearFilesOptions extends IOnLoadFilesOptions {
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
}
export interface IOnLoadChoicesFromServerOptions extends IQuestionOptions {
  /**
   * a result that comes from the server as it is
   */
  serverResult: any;
  /**
   * the loaded choices. You can change the loaded choices to before they are assigned to question
   */
  choices: Array<ItemValue>;
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
export interface IOnUpdateQuestionCssClassesOptions extends IQuestionOptions, IOnUpdateElementCssClassesOptions { }
export interface IOnUpdatePanelCssClassesOptions extends IPanelOptions, IOnUpdateElementCssClassesOptions { }
export interface IOnUpdatePageCssClassesOptions extends IPageOptions, IOnUpdateElementCssClassesOptions { }
export interface IOnUpdateChoiceItemCssOptions extends IQuestionOptions {
  /**
   * a string with css classes divided by space. You can change it
   */
  css: string;
  /**
   * a choice item of ItemValue type. You can get value or text choice properties as options.item.value or options.choice.text
   */
  item: ItemValue;
}
export interface IOnAfterRenderSurveyOptions extends IOnAterRenderElementOptions {
  survey: SurveyModel;
}
export interface IOnAfterRenderHeaderOptions extends IOnAterRenderElementOptions { }
export interface IOnAfterRenderPageOptions extends IOnAterRenderElementOptions, IPageOptions { }
export interface IOnAfterRenderQuestionOptions extends IQuestionOptions, IOnAterRenderElementOptions { }
export interface IOnAfterRenderQuestionInputOptions extends IQuestionOptions, IOnAterRenderElementOptions { }
export interface IOnAfterRenderPanelOptions extends IOnAterRenderElementOptions, IPanelOptions { }
export interface IOnFocusInQuestionOptions extends IQuestionOptions {
}
export interface IOnFocusInPanelOptions extends IPanelOptions { }
export interface IOnShowingChoiceItemOptions extends IQuestionOptions {
  /**
   * A Boolean value that specifies item visibility. Set it to `false` to hide the item.
   */
  visible: boolean;
  /**
   * The choice item as specified in the [choices](https://surveyjs.io/Documentation/Library?id=QuestionSelectBase#choices) array.
   */
  item: ItemValue;
}
export interface IOnChoicesLazyLoadOptions extends IQuestionOptions {
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
}
export interface IOnGetChoiceDisplayValueOptions extends IQuestionOptions {
  /**
   * A method that you should call to assign display texts to the question.
   */
  setItems: (displayValues: Array<string>) => void;
  /**
   * An array of one (in Dropdown) or more (in Tag Box) default values.
   */
  values: Array<any>;
}
export interface IOnMatrixRowAddedOptions extends IMatrixDynamicQuestionOptions {
  /**
   * a new added row
   */
  row: any;
}
export interface IOnMatrixBeforeRowAddedOptions extends IMatrixDynamicQuestionOptions {
  /**
   * specifies whether a new row can be added
   */
  canAddRow: boolean;
}
export interface IOnMatrixRowRemovingOptions extends IMatrixDynamicQuestionOptions {
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
}
export interface IOnMatrixRowRemovedOptions extends IMatrixDynamicQuestionOptions {
  /**
   * a removed row object
   */
  row: any;
  /**
   * a removed row index
   */
  rowIndex: number;
}
export interface IOnMatrixAllowRemoveRowOptions extends IMatrixDynamicQuestionOptions {
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
}

export interface IMatrixCellCreatingBaseOptions extends IMatrixDropdownQuestionOptions {
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
}
export interface IOnMatrixCellCreatingOptions extends IMatrixCellCreatingBaseOptions {
    /**
   * the cell question type. You can change it
   */
    cellType: string;
}
export interface IOnMatrixCellCreatedOptions extends IMatrixCellCreatingBaseOptions {
  /**
   * the question/editor in the cell. You may customize it, change it's properties, like choices or visible
   */
  cellQuestion: Question;
  /**
   * the matrix cell
   */
  cell: MatrixDropdownCell;
}
export interface IOnMatrixAfterCellRenderOptions extends IQuestionOptions, IOnAterRenderElementOptions {
  /**
   * the matrix row object
   */
  row: MatrixDropdownRowModelBase;
  /**
   * the matrix column object
   */
  column: MatrixDropdownColumn | MatrixDropdownCell;
  /**
   * the question/editor in the cell
   */
  cellQuestion: Question;
  /**
   * the matrix cell
   */
  cell: MatrixDropdownCell;
}

export interface IOnMatrixCellValueBaseOptions extends IMatrixDropdownQuestionOptions {
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
}

export interface IOnMatrixCellValueChangedOptions extends IOnMatrixCellValueBaseOptions {}
export interface IOnMatrixCellValueChangingOptions extends IQuestionOptions {
  /**
   * the old value
   */
  oldValue: any;
}
export interface IOnMatrixCellValidateOptions extends IOnMatrixCellValueBaseOptions {
  /**
   * an error string. It is empty by default
   */
  error?: string;
}
export interface IOnDynamicPanelModifiedOptions extends IPanelDynamicQuestionOptions, IPanelOptions {
  /**
   * The panel's index within Dynamic Panel.
   */
  panelIndex: number;
}
export interface IOnDynamicPanelRemovingOptions extends IOnDynamicPanelModifiedOptions {
  /**
   * Set this property to `false` if you want to cancel the panel deletion.
   */
  allow: boolean;
}
export interface IOnTimerPanelInfoTextOptions {
  /**
   * the timer panel info text
   */
  text: string;
}
export interface IOnDynamicPanelItemValueChangedOptions extends IPanelDynamicQuestionOptions {
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
}
export interface IOnIsAnswerCorrectOptions extends IQuestionOptions {
  /**
   * you may change the default number of correct or incorrect answers in the question, for example for matrix, where each row is a quiz question
   */
  correctAnswers: number;
  incorrectAnswers: number;
  /**
   * returns `true`, if an answer is correct, or `false`, if the answer is not correct. Use questions' `value` and `correctAnswer` properties to return the correct value
   */
  result: boolean;
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
  question?: Question;
  /**
   * a page that is going to be scrolled on top. It can be null if options.question is not null
   */
  page?: PageModel;
  /**
   * set this property to true to cancel the default scrolling
   */
  cancel: boolean;
  /**
   * the unique element DOM Id
   */
  elementId: string;
}
export interface IOnGetQuestionTitleActionsOptions extends IQuestionOptions, IOnGetTitleActionsOptions { }
export interface IOnGetPanelTitleActionsOptions extends IPanelOptions, IOnGetTitleActionsOptions { }
export interface IOnGetPageTitleActionsOptions extends IPageOptions, IOnGetTitleActionsOptions { }
export interface IOnGetPanelFooterActionsOptions extends IOnGetActionsOptions, IPanelOptions {
  /**
   * A [Dynamic Panel](https://surveyjs.io/form-library/documentation/questionpaneldynamicmodel) to which the Panel belongs. This field is `undefined` if the Panel does not belong to any Dynamic Panel
   */
  question?: QuestionPanelDynamicModel;
}
export interface IOnGetMatrixRowActionsOptions extends IQuestionOptions, IOnGetActionsOptions {
  /**
   * A matrix row for which the event is fired
   */
  row: any;
}
export interface IOnElementContentVisibilityChangedOptions {
  /**
   * Specifies which survey element content was collapsed or expanded
   */
  element: ISurveyElement;
}
export interface IOnGetQuestionDisplayValueOptions extends IQuestionOptions {
  /**
   * A question's display text. You can assign a custom value to this parameter.
   */
  displayValue: any;
}
export interface IOnGetExpressionDisplayValueOptions extends IOnGetQuestionDisplayValueOptions {
  /**
   * The question value
   */
  value: any;
}

export interface IOnMultipleTextItemAddedOptions extends IQuestionOptions {
  /**
   * A new added item.
   */
  item: any;
}
export interface IOnMatrixColumnAddedOptions extends IQuestionOptions {
  /**
   * A new added column.
   */
  column: any;
}
