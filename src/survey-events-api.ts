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

export interface QuestionEventMixin {
  /**
   * A Question instance for which the event is raised.
   */
  question: Question;
}
export interface FileQuestionEventMixin {
  /**
   * A File question instance for which the event is raised.
   */
  question: QuestionFileModel;
}
export interface PanelDynamicQuestionEventMixin {
  /**
   * A Dynamic Panel question instance for which the event is raised.
   */
  question: QuestionPanelDynamicModel;
}
export interface MatrixDropdownQuestionEventMixin {
  /**
   * A Multiple-Choice Matrix question instance for which the event is raised.
   */
  question: QuestionMatrixDropdownModelBase;
}
export interface MatrixDynamicQuestionEventMixin {
 /**
  * A Dynamic Matrix question instance for which the event is raised.
  */
  question: QuestionMatrixDynamicModel;
}
export interface PanelEventMixin {
  /**
   * A Panel instance for which the event is raised.
   */
  panel: PanelModel;
}
export interface PageEventMixin {
  /**
   * A Page instance for which the event is raised.
   */
  page: PageModel;
}
export interface GetTitleActionsEventMixin {
  /**
   * An array of [actions](https://surveyjs.io/form-library/documentation/iaction) associated with the processed element.
   */
  titleActions: Array<IAction>;
}
export interface GetActionsEventMixin {
  /**
   * An array of [actions](https://surveyjs.io/form-library/documentation/iaction). You can modify the entire array or individual actions within it.
   */
  actions: Array<IAction>;
}
export interface AfterRenderElementEventMixin {
  /**
   * The rendered HTML element.
   */
  htmlElement: HTMLElement;
}
export interface UpdateElementCssClassesEventMixin {
  /**
   * An object with CSS classes applied to the element being rendered, for example, `{ root: "class1", button: "class2" }`. You can modify this object to apply custom CSS classes.
   */
  cssClasses: any;
}
export interface ElementVisibleChangedEventMixin {
  /**
   * Indicates whether the element is visible now.
   */
  visible: boolean;
}

export interface TriggerExecutedEvent {
  /**
   * A trigger that has been executed.
   */
  trigger: Trigger;
}

export interface CompleteBaseEvent {
  /**
   * Returns `true` if survey completion is caused by the ["complete" trigger](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#complete).
   */
  isCompleteOnTrigger: boolean;
}
export interface CompletingEvent extends CompleteBaseEvent {
  /**
   * Set this property to `false` if you want to prevent survey completion.
   */
  allow: boolean;
  allowComplete: boolean;
}
export interface CompleteEvent extends CompleteBaseEvent {
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
  * @deprecated Use the `showSaveInProgress()` method instead.
  */
  showDataSaving: (text?: string) => void;
  /**
  * @deprecated Use the `showSaveError()` method instead.
  */
  showDataSavingError: (text?: string) => void;
  /**
  * @deprecated Use the `showSaveSuccess()` method instead.
  */
  showDataSavingSuccess: (text?: string) => void;
  /**
  * @deprecated Use the `clearSaveMessages()` method instead.
  */
  showDataSavingClear: (text?: string) => void;
}
export interface ShowingPreviewEvent {
  /**
   * Set this property to `false` if you want to cancel the preview.
   */
  allow: boolean;
  /**
  * @deprecated Use the `allow` property instead.
  */
  allowShowPreview: boolean;
}
export interface NavigateToUrlEvent {
  /**
   * Set this property to `false` if you want to cancel the navigation and show the [complete page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#complete-page).
   */
  allow: boolean;
  /**
   * A URL to which respondents should be navigated. You can modify this parameter's value.
   */
  url: string;
}
export interface CurrentPageChangedEvent {
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
export interface CurrentPageChangingEvent extends CurrentPageChangedEvent {
  /**
   * Set this property to `false` if you do not want to switch the current page.
   */
  allow: boolean;
  /**
  * @deprecated Use the `allow` property instead.
  */
  allowChanging: boolean;
}

export interface ValueChangeBaseEvent extends QuestionEventMixin {
  /**
   * The `name` of the question whose value is being changed. If you use the [`valueName`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#valueName) property, this parameter contains its value.
   */
  name: string;
}
export interface ValueChangedEvent extends ValueChangeBaseEvent {
  /**
   * A new value.
   */
  value: any;
}
export interface ValueChangingEvent extends ValueChangeBaseEvent {
  /**
   * A new value. You can change it if required.
   */
  value: any;
  /**
   * A previous value.
   */
  oldValue: any;
}
export interface VariableChangedEvent {
  /**
   * A new value for the variable or calculated value.
   */
  value: any;
  /**
   * The name of the variable or calculated value that has been changed.
   */
  name: string;
}
export interface QuestionVisibleChangedEvent extends QuestionEventMixin, ElementVisibleChangedEventMixin {
  /**
   * The question's name.
   */
  name: string;
}
export interface PageVisibleChangedEvent extends ElementVisibleChangedEventMixin, PageEventMixin { }
export interface PanelVisibleChangedEvent extends ElementVisibleChangedEventMixin, PanelEventMixin { }
export interface QuestionCreatedEvent extends QuestionEventMixin { }

export interface ElementAddedEvent {
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
export interface ElementRemovedEvent {
  /**
   * The element's name.
   */
  name: string;
}
export interface QuestionAddedEvent extends QuestionEventMixin, ElementAddedEvent {}
export interface QuestionRemovedEvent extends QuestionEventMixin, ElementRemovedEvent {}
export interface PanelAddedEvent extends PanelEventMixin, ElementAddedEvent {}
export interface PanelRemovedEvent extends PanelEventMixin, ElementRemovedEvent {}
export interface PageAddedEvent extends PageEventMixin {}
export interface ValidateQuestionEvent extends QuestionEventMixin {
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
export interface SettingQuestionErrorsEvent extends QuestionEventMixin {
  /**
   * An array of errors. The array is empty if the validated question satisfy all validation rules.
   */
  errors: Array<SurveyError>;
}
export interface ServerValidateQuestionsEvent {
  /**
   * A method that you should call when a request to the server has completed.
   */
  complete: () => void;
  /**
   * An object for your error messages. Set error messages as follows: `options.errors["questionName"] = "My error message"`.
   */
  errors: { [index: string]: any };
  /**
   * Question values. You can get an individual question value as follows: `options.data["questionName"]`.
   */
  data: { [index: string]: any };
}
export interface ValidatePanelEvent extends PanelEventMixin {
  /**
   * An error message that you should specify if validation fails.
   */
  error: string;
  /**
   * The panel's name.
   */
  name: string;
}
export interface ErrorCustomTextEvent {
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
export interface ValidatedErrorsOnCurrentPageEvent extends PageEventMixin {
  /**
   * the list of questions that have errors
   */
  questions: Array<Question>;
  /**
   * the list of errors
   */
  errors: Array<SurveyError>;
}
export interface ProcessHtmlEvent {
  /**
   * an HTML that you may change before text processing and then rendering. specifies the modified HTML content
   */
  html: string;
}
export interface GetQuestionTitleEvent extends QuestionEventMixin {
  /**
   * a calculated question title, based on question `title`, `name`
   */
  title: string;
}
export interface GetTitleTagNameEvent {
  /**
   * an element title tagName that are used to render a title. You can change it from the default value
   */
  tagName: string;
  /**
   * an element (question, panel, page and survey) that SurveyJS is going to render
   */
  element: Base;
}
export interface GetQuestionNoEvent extends QuestionEventMixin {
  /**
   * a calculated question no, based on question `visibleIndex`, survey `.questionStartIndex` properties. You can change it
   */
  no: string;
}
export interface ProgressTextEvent {
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

export interface TextProcessingEvent {
  /**
   * a property name is going to be rendered
   */
  name: string;
  /**
   * SurveyJS element (a question, panel, page, or survey) where the string is going to be rendered
   */
  element: Question | PanelModel | PageModel | SurveyModel;
}
export interface TextMarkdownEvent extends TextProcessingEvent {
  /**
   * an HTML content. It is `null` by default. Use this property to specify the HTML content rendered instead of `options.text`
   */
  html?: string;
  /**
   * a text that is going to be rendered
   */
  text: string;
}
export interface TextRenderAsEvent extends TextProcessingEvent {
  /**
   * a component name used for text rendering
   */
  renderAs: string;
}

export interface SendResultEvent {
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
export interface GetResultEvent {
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

export interface LoadFilesEvent extends FileQuestionEventMixin {
  /**
   * the question name
   */
  name: string;
}
export interface UploadFilesEvent extends LoadFilesEvent {
  /**
   * a callback function to get the file upload status and the updloaded file content
   */
  callback: (status: string, data?: any) => any;
  /**
   * the Javascript File objects array to upload
   */
  files: Array<File>;

}
export interface DownloadFileEvent extends LoadFilesEvent {
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
export interface ClearFilesEvent extends LoadFilesEvent {
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
export interface LoadChoicesFromServerEvent extends QuestionEventMixin {
  /**
   * a result that comes from the server as it is
   */
  serverResult: any;
  /**
   * the loaded choices. You can change the loaded choices to before they are assigned to question
   */
  choices: Array<ItemValue>;
}
export interface ProcessTextValueEvent {
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
export interface UpdateQuestionCssClassesEvent extends QuestionEventMixin, UpdateElementCssClassesEventMixin { }
export interface UpdatePanelCssClassesEvent extends PanelEventMixin, UpdateElementCssClassesEventMixin { }
export interface UpdatePageCssClassesEvent extends PageEventMixin, UpdateElementCssClassesEventMixin { }
export interface UpdateChoiceItemCssEvent extends QuestionEventMixin {
  /**
   * a string with css classes divided by space. You can change it
   */
  css: string;
  /**
   * a choice item of ItemValue type. You can get value or text choice properties as options.item.value or options.choice.text
   */
  item: ItemValue;
}
export interface AfterRenderSurveyEvent extends AfterRenderElementEventMixin {
  survey: SurveyModel;
}
export interface AfterRenderHeaderEvent extends AfterRenderElementEventMixin { }
export interface AfterRenderPageEvent extends AfterRenderElementEventMixin, PageEventMixin { }
export interface AfterRenderQuestionEvent extends QuestionEventMixin, AfterRenderElementEventMixin { }
export interface AfterRenderQuestionInputEvent extends QuestionEventMixin, AfterRenderElementEventMixin { }
export interface AfterRenderPanelEvent extends AfterRenderElementEventMixin, PanelEventMixin { }
export interface FocusInQuestionEvent extends QuestionEventMixin {
}
export interface FocusInPanelEvent extends PanelEventMixin { }
export interface ShowingChoiceItemEvent extends QuestionEventMixin {
  /**
   * A Boolean value that specifies item visibility. Set it to `false` to hide the item.
   */
  visible: boolean;
  /**
   * The choice item as specified in the [choices](https://surveyjs.io/Documentation/Library?id=QuestionSelectBase#choices) array.
   */
  item: ItemValue;
}
export interface ChoicesLazyLoadEvent extends QuestionEventMixin {
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
export interface GetChoiceDisplayValueEvent extends QuestionEventMixin {
  /**
   * A method that you should call to assign display texts to the question.
   */
  setItems: (displayValues: Array<string>) => void;
  /**
   * An array of one (in Dropdown) or more (in Tag Box) default values.
   */
  values: Array<any>;
}
export interface MatrixRowAddedEvent extends MatrixDynamicQuestionEventMixin {
  /**
   * a new added row
   */
  row: any;
}
export interface MatrixBeforeRowAddedEvent extends MatrixDynamicQuestionEventMixin {
  /**
   * specifies whether a new row can be added
   */
  canAddRow: boolean;
}
export interface MatrixRowRemovingEvent extends MatrixDynamicQuestionEventMixin {
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
export interface MatrixRowRemovedEvent extends MatrixDynamicQuestionEventMixin {
  /**
   * a removed row object
   */
  row: any;
  /**
   * a removed row index
   */
  rowIndex: number;
}
export interface MatrixAllowRemoveRowEvent extends MatrixDynamicQuestionEventMixin {
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

export interface MatrixCellCreatingBaseEvent extends MatrixDropdownQuestionEventMixin {
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
export interface MatrixCellCreatingEvent extends MatrixCellCreatingBaseEvent {
  /**
   * the cell question type. You can change it
   */
  cellType: string;
}
export interface MatrixCellCreatedEvent extends MatrixCellCreatingBaseEvent {
  /**
   * the question/editor in the cell. You may customize it, change it's properties, like choices or visible
   */
  cellQuestion: Question;
  /**
   * the matrix cell
   */
  cell: MatrixDropdownCell;
}
export interface MatrixAfterCellRenderEvent extends QuestionEventMixin, AfterRenderElementEventMixin {
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

export interface MatrixCellValueBaseEvent extends MatrixDropdownQuestionEventMixin {
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

export interface MatrixCellValueChangedEvent extends MatrixCellValueBaseEvent {}
export interface MatrixCellValueChangingEvent extends QuestionEventMixin {
  /**
   * the old value
   */
  oldValue: any;
}
export interface MatrixCellValidateEvent extends MatrixCellValueBaseEvent {
  /**
   * an error string. It is empty by default
   */
  error?: string;
}
export interface DynamicPanelModifiedEvent extends PanelDynamicQuestionEventMixin, PanelEventMixin {
  /**
   * The panel's index within Dynamic Panel.
   */
  panelIndex: number;
}
export interface DynamicPanelRemovingEvent extends DynamicPanelModifiedEvent {
  /**
   * Set this property to `false` if you want to cancel the panel deletion.
   */
  allow: boolean;
}
export interface TimerPanelInfoTextEvent {
  /**
   * the timer panel info text
   */
  text: string;
}
export interface DynamicPanelItemValueChangedEvent extends PanelDynamicQuestionEventMixin {
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
export interface IsAnswerCorrectEvent extends QuestionEventMixin {
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
export interface DragDropAllowEvent {
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
export interface ScrollingElementToTopEvent {
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
export interface GetQuestionTitleActionsEvent extends QuestionEventMixin, GetTitleActionsEventMixin { }
export interface GetPanelTitleActionsEvent extends PanelEventMixin, GetTitleActionsEventMixin { }
export interface GetPageTitleActionsEvent extends PageEventMixin, GetTitleActionsEventMixin { }
export interface GetPanelFooterActionsEvent extends GetActionsEventMixin, PanelEventMixin {
  /**
   * A [Dynamic Panel](https://surveyjs.io/form-library/documentation/questionpaneldynamicmodel) to which the Panel belongs. This field is `undefined` if the Panel does not belong to any Dynamic Panel
   */
  question?: QuestionPanelDynamicModel;
}
export interface GetMatrixRowActionsEvent extends QuestionEventMixin, GetActionsEventMixin {
  /**
   * A matrix row for which the event is fired
   */
  row: any;
}
export interface ElementContentVisibilityChangedEvent {
  /**
   * Specifies which survey element content was collapsed or expanded
   */
  element: ISurveyElement;
}
export interface GetQuestionDisplayValueEvent extends QuestionEventMixin {
  /**
   * A question's display text. You can assign a custom value to this parameter.
   */
  displayValue: any;
}
export interface GetExpressionDisplayValueEvent extends GetQuestionDisplayValueEvent {
  /**
   * The question value
   */
  value: any;
}

export interface MultipleTextItemAddedEvent extends QuestionEventMixin {
  /**
   * A new added item.
   */
  item: any;
}
export interface MatrixColumnAddedEvent extends QuestionEventMixin {
  /**
   * A new added column.
   */
  column: any;
}
