import { HashTable, Helpers } from "./helpers";
import { JsonObject, JsonError, Serializer } from "./jsonobject";
import {
  Base,
  ISurvey,
  ISurveyData,
  ISurveyImpl,
  ITextProcessor,
  IQuestion,
  IPanel,
  IElement,
  IPage,
  SurveyError,
  Event,
  ISurveyErrorOwner,
  ISurveyElement,
  SurveyElement,
} from "./base";
import { surveyCss } from "./defaultCss/cssstandard";
import { ISurveyTriggerOwner, SurveyTrigger } from "./trigger";
import { CalculatedValue } from "./calculatedValue";
import { PageModel } from "./page";
import { TextPreProcessor, TextPreProcessorValue } from "./textPreProcessor";
import { ProcessValue } from "./conditionProcessValue";
import { dxSurveyService } from "./dxSurveyService";
import { surveyLocalization } from "./surveyStrings";
import { CustomError } from "./error";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { StylesManager } from "./stylesmanager";
import { SurveyTimer } from "./surveytimer";
import { Question } from "./question";
import { ItemValue } from "./itemvalue";
import { PanelModelBase } from "./panel";
import {
  HtmlConditionItem,
  UrlConditionItem,
  ExpressionItem,
} from "./expressionItems";
import { ExpressionRunner, ConditionRunner } from "./conditions";
import { settings } from "./settings";

/**
 * The `Survey` object contains information about the survey, Pages, Questions, flow logic and etc.
 */
export class SurveyModel extends Base
  implements
    ISurvey,
    ISurveyData,
    ISurveyImpl,
    ISurveyTriggerOwner,
    ISurveyErrorOwner,
    ILocalizableOwner {
  [index: string]: any;
  private static stylesManager: StylesManager = null;
  public static platform: string = "unknown";
  public get platformName(): string {
    return SurveyModel.platform;
  }
  /**
   * You can display an additional field (comment field) for the most of questions; users can enter additional comments to their response.
   * The comment field input is saved as `'question name' + 'commentPrefix'`.
   * @see data
   * @see Question.hasComment
   */
  public get commentPrefix(): string {
    return settings.commentPrefix;
  }
  public set commentPrefix(val: string) {
    settings.commentPrefix = val;
  }

  private get currentPageValue(): PageModel {
    return this.getPropertyValue("currentPageValue", null);
  }
  private set currentPageValue(val: PageModel) {
    this.setPropertyValue("currentPageValue", val);
  }

  private valuesHash: HashTable<any> = {};
  private variablesHash: HashTable<any> = {};

  private localeValue: string = "";

  private textPreProcessor: TextPreProcessor;
  private completedStateValue: string = "";
  private completedStateTextValue: string = "";

  private isTimerStarted: boolean = false;
  /**
   * The event is fired before the survey is completed and the `onComplete` event is fired. You can prevent the survey from completing by setting `options.allowComplete` to `false`
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.allowComplete` - Specifies whether a user can complete a survey. Set this property to `false` to prevent the survey from completing. The default value is `true`.
   * <br/> `options.isCompleteOnTrigger` - returns true if the survey is completing on "complete" trigger.
   * @see onComplete
   */
  public onCompleting: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired after a user clicks the 'Complete' button and finishes a survey. Use this event to send the survey data to your web server.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.showDataSaving(text)` - call this method to show that the survey is saving survey data on your server. The `text` is an optional parameter to show a custom message instead of default.
   * <br/> `options.showDataSavingError(text)` - call this method to show that an error occurred while saving the data on your server. If you want to show a custom error, use an optional `text` parameter.
   * <br/> `options.showDataSavingSuccess(text)` - call this method to show that the data was successfully saved on the server.
   * <br/> `options.showDataSavingClear` - call this method to hide the text about the saving progress.
   * <br/> `options.isCompleteOnTrigger` - returns true if the survey is completed on "complete" trigger.
   *  @see data
   * @see clearInvisibleValues
   * @see completeLastPage
   * @see surveyPostId
   */
  public onComplete: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired after a user clicks the 'Complete' button. The event allows you to specify the URL opened after completing a survey.
   * Specify the `navigateToUrl` property to make survey navigate to another url.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.url` - Specifies a URL opened after completing a survey. Set this property to an empty string to cancel the navigation and show the completed survey page.
   * @see navigateToUrl
   * @see navigateToUrlOnCondition
   */
  public onNavigateToUrl: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired after the survey changed it's state from "starting" to "running". The "starting" state means that survey shows the started page.
   * The `firstPageIsStarted` property should be set to `true`, if you want to display a start page in your survey. In this case, an end user should click the "Start" button to start the survey.
   * @see firstPageIsStarted
   */
  public onStarted: Event<(sender: SurveyModel) => any, any> = new Event<
    (sender: SurveyModel) => any,
    any
  >();
  /**
   * The event is fired on clicking the 'Next' button if the `sendResultOnPageNext` is set to `true`. You can use it to save the intermediate results, for example, if your survey is large enough.
   * <br/> `sender` - the survey object that fires the event.
   * @see sendResultOnPageNext
   */
  public onPartialSend: Event<(sender: SurveyModel) => any, any> = new Event<
    (sender: SurveyModel) => any,
    any
  >();
  /**
   * The event is fired before the current page changes to another page. Typically it happens when a user click the 'Next' or 'Prev' buttons.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `option.oldCurrentPage` - the previous current/active page.
   * <br/> `option.newCurrentPage` - a new current/active page.
   * <br/> `option.allowChanging` - set it to `false` to disable the current page changing. It is `true` by default.
   * <br/> `option.isNextPage` - commonly means, that end-user press the next page button. In general, it means that options.newCurrentPage is the next page after options.oldCurrentPage
   * <br/> `option.isPrevPage` - commonly means, that end-user press the previous page button. In general, it means that options.newCurrentPage is the previous page before options.oldCurrentPage
   * @see currentPage
   * @see currentPageNo
   * @see nextPage
   * @see prevPage
   * @see completeLastPage
   * @see onCurrentPageChanged
   **/
  public onCurrentPageChanging: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired when the current page has been changed to another page. Typically it happens when a user click on 'Next' or 'Prev' buttons.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `option.oldCurrentPage` - a previous current/active page.
   * <br/> `option.newCurrentPage` - a new current/active page.
   * <br/> `option.isNextPage` - commonly means, that end-user press the next page button. In general, it means that options.newCurrentPage is the next page after options.oldCurrentPage
   * <br/> `option.isPrevPage` - commonly means, that end-user press the previous page button. In general, it means that options.newCurrentPage is the previous page before options.oldCurrentPage
   * @see currentPage
   * @see currentPageNo
   * @see nextPage
   * @see prevPage
   * @see completeLastPage
   * @see onCurrentPageChanging
   */
  public onCurrentPageChanged: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired before the question value (answer) is changed. It can be done via UI by a user or programmatically on calling the `setValue` method.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.name` - the value name that has being changed.
   * <br/> `options.question` - a question which `question.name` equals to the value name. If there are several questions with the same name, the first question is used. If there is no such questions, the `options.question` is null.
   * <br/> `options.oldValue` - an old, previous value.
   * <br/> `options.value` - a new value. You can change it.
   * @see setValue
   * @see onValueChanged
   */
  public onValueChanging: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired when the question value (i.e., answer) has been changed. The question value can be changed in UI (by a user) or programmatically (on calling `setValue` method).
   * Use the `onDynamicPanelItemValueChanged` and `onMatrixCellValueChanged` events to handle changes in a question in the Panel Dynamic and a cell question in matrices.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.name` - the value name that has been changed.
   * <br/> `options.question` - a question which `question.name` equals to the value name. If there are several questions with the same name, the first question is used. If there is no such questions, the `options.question` is `null`.
   * <br/> `options.value` - a new value.
   * @see setValue
   * @see onValueChanging
   * @see onDynamicPanelItemValueChanged
   * @see onMatrixCellValueChanged
   */
  public onValueChanged: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired when a question visibility has been changed.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - a question which visibility has been changed.
   * <br/> `options.name` - a question name.
   * <br/> `options.visible` - a question `visible` boolean value.
   * @see Question.visibile
   * @see Question.visibileIf
   */
  public onVisibleChanged: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on changing a page visibility.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.page` - a page which visibility has been changed.
   * <br/> `options.visible` - a page `visible` boolean value.
   * @see PageModel.visibile
   * @see PageModel.visibileIf
   */
  public onPageVisibleChanged: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on changing a panel visibility.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.panel` - a panel which visibility has been changed.
   * <br/> `options.visible` - a panel `visible` boolean value.
   * @see PanelModel.visibile
   * @see PanelModel.visibileIf
   */
  public onPanelVisibleChanged: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on creating a new question.
   * Unlike the onQuestionAdded event, this event calls for all question created in survey including inside: a page, panel, matrix cell, dynamic panel and multiple text.
   * or inside a matrix cell or it can be a text question in multiple text items or inside a panel of a panel dynamic.
   * You can use this event to set up properties to a question based on it's type for all questions, regardless where they are located, on the page or inside a matrix cell.
   * Please note: If you want to use this event for questions loaded from JSON then you have to create survey with empty/null JSON parameter, assign the event and call survey.fromJSON(yourJSON) function.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - a newly created question object.
   * @see Question
   * @see onQuestionAdded
   */
  public onQuestionCreated: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on adding a new question into survey.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - a newly added question object.
   * <br/> `options.name` - a question name.
   * <br/> `options.index` - an index of the question in the container (page or panel).
   * <br/> `options.parentPanel` - a container where a new question is located. It can be a page or panel.
   * <br/> `options.rootPanel` - typically, it is a page.
   * @see Question
   * @see onQuestionCreated
   */
  public onQuestionAdded: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on removing a question from survey.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - a removed question object.
   * <br/> `options.name` - a question name.
   * @see Question
   */
  public onQuestionRemoved: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on adding a panel into survey.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.panel` - a newly added panel object.
   * <br/> `options.name` - a panel name.
   * <br/> `options.index` - an index of the panel in the container (a page or panel).
   * <br/> `options.parentPanel` - a container (a page or panel) where a new panel is located.
   * <br/> `options.rootPanel` - a root container, typically it is a page.
   * @see PanelModel
   */
  public onPanelAdded: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on removing a panel from survey.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.panel` - a removed panel object.
   * <br/> `options.name` - a panel name.
   * @see PanelModel
   */
  public onPanelRemoved: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on adding a page into survey.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.page` - a newly added `panel` object.
   * @see PanelModel
   */
  public onPageAdded: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on validating value in a question. You can specify a custom error message using `options.error`. The survey blocks completing the survey or going to the next page when the error messages are displayed.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - a validated question.
   * <br/> `options.name` - a question name.
   * <br/> `options.value` - the current question value (answer).
   * <br/> `options.error` - an error string. It is empty by default.
   * @see onServerValidateQuestions
   * @see onSettingQuestionErrors
   */
  public onValidateQuestion: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired before errors are assigned to a question. You may add/remove/modify errors for a question.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - a validated question.
   * <br/> `options.errors` - the list of errors. The list is empty by default and remains empty if a validated question has no errors.
   * @see onValidateQuestion
   */
  public onSettingQuestionErrors: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * Use this event to validate data on your server.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.data` - the values of all non-empty questions on the current page. You can get a question value as `options.data["myQuestionName"]`.
   * <br/> `options.errors` - set your errors to this object as: `options.errors["myQuestionName"] = "Error text";`. It will be shown as a question error.
   * <br/> `options.complete()` - call this function to tell survey that your server callback has been processed.
   * @see onValidateQuestion
   * @see onValidatePanel
   */
  public onServerValidateQuestions: any = new Event<
    (sender: SurveyModel, options: any) => any,
    any
  >();
  /**
   * Use this event to modify the HTML before rendering, for example HTML on a completed page.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.html` - an HTML that you may change before text processing and then rendering.
   * @see completedHtml
   * @see loadingHtml
   * @see QuestionHtmlModel.html
   */
  /**
   * The event is fired on validating a panel. Set your error to `options.error` and survey will show the error for the panel and block completing the survey or going to the next page.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.name` - a panel name.
   * <br/> `options.error` - an error string. It is empty by default.
   * @see onValidateQuestion
   */
  public onValidatePanel: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * Use the event to change the default error text.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.text` - an error text.
   * <br/> `options.error` - an instance of the `SurveyError` object.
   * <br/> `options.name` - the error name. The following error names are available:
   * required, requireoneanswer, requirenumeric, exceedsize, webrequest, webrequestempty, otherempty,
   * uploadingfile, requiredinallrowserror, minrowcounterror, keyduplicationerror, custom
   */
  public onErrorCustomText: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * Use the this event to be notified when the survey finished validate questions on the current page. It commonly happens when a user try to go to the next page or complete the survey
   * options.questions - the list of questions that have errors
   * options.errors - the list of errors
   * options.page - the page where question(s) are located
   */
  public onValidatedErrorsOnCurrentPage: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();

  /**
   * Use this event to modify the HTML content before rendering, for example `completeHtml` or `loadingHtml`.
   * `options.html` - specifies the modified HTML content.
   * @see completedHtml
   * @see loadingHtml
   */
  public onProcessHtml: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * Use this event to change the question title in code.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.title` - a calculated question title, based on question `title`, `name`, `isRequired`, and `visibleIndex` properties.
   * <br/> `options.question` - a question object.
   */
  public onGetQuestionTitle: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * Use this event to process the markdown text.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.element` - SurveyJS element (a question, panel, page, or survey) where the string is going to be rendered.
   * <br/> `options.text` - a text that is going to be rendered.
   * <br/> `options.html` - an HTML content. It is `null` by default. Use this property to specify the HTML content rendered instead of `options.text`.
   */
  public onTextMarkdown: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event fires when it gets response from the [api.surveyjs.io](https://api.surveyjs.io) service on saving survey results. Use it to find out if the results have been saved successfully.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.success` - it is `true` if the results has been sent to the service successfully.
   * <br/> `options.response` - a response from the service.
   */
  public onSendResult: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * Use it to get results after calling the `getResult` method. It returns a simple analytics from [api.surveyjs.io](https://api.surveyjs.io) service.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.success` - it is `true` if the results were got from the service successfully.
   * <br/> `options.data` - the object `{AnswersCount, QuestionResult : {} }`. `AnswersCount` is the number of posted survey results. `QuestionResult` is an object with all possible unique answers to the question and number of these answers.
   * <br/> `options.dataList` - an array of objects `{name, value}`, where `name` is a unique value/answer to the question and `value` is a number/count of such answers.
   * <br/> `options.response` - the server response.
   * @see getResult
   */
  public onGetResult: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on uploading the file in QuestionFile when `storeDataAsText` is set to `false`. Use this event to change the uploaded file name or to prevent a particular file from being uploaded.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.name` - the file name.
   * <br/> `options.file` - the Javascript File object.
   * <br/> `options.accept` - a boolean value, `true` by default. Set it to `false` to deny this file uploading.
   * @see uploadFiles
   * @see QuestionFileModel.storeDataAsText
   */
  public onUploadFiles: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on downloading a file in QuestionFile. Use this event to pass the file to a preview.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.name` - the question name.
   * <br/> `options.content` - the file content.
   * <br/> `options.fileValue` - single file question value.
   * <br/> `options.callback` - a call back function to get the status on downloading the file and the downloaded file content.
   * @see downloadFile
   */
  public onDownloadFile: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * This event is fired on clearing the value in a QuestionFile. Use this event to remove files stored on your server.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.name` - the question name.
   * <br/> `options.value` - the question value.
   * <br/> `options.fileName` - a removed file's name, set it to `null` to clear all files.
   * <br/> `options.callback` - a call back function to get the status on clearing the files operation.
   * @see clearFiles
   */
  public onClearFiles: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired after choices for radiogroup, checkbox, and dropdown has been loaded from a RESTful service and before they are assigned to a question.
   * You may change the choices, before they are assigned or disable/enabled make visible/invisible question, based on loaded results.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `question` - the question where loaded choices are going to be assigned.
   * <br/> `choices` - the loaded choices. You can change the loaded choices to before they are assigned to question.
   * <br/> `serverResult` - a result that comes from the server as it is.
   */
  public onLoadChoicesFromServer: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired after survey is loaded from api.surveyjs.io service.
   * You can use this event to perform manipulation with the survey model after it was loaded from the web service.
   * <br/> `sender` - the survey object that fires the event.
   * @see surveyId
   * @see loadSurveyFromService
   */
  public onLoadedSurveyFromService: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on processing the text when it finds a text in brackets: `{somevalue}`. By default, it uses the value of survey question values and variables.
   * For example, you may use the text processing in loading choices from the web. If your `choicesByUrl.url` equals to "UrlToServiceToGetAllCities/{country}/{state}",
   * you may set on this event `options.value` to "all" or empty string when the "state" value/question is non selected by a user.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.name` - the name of the processing value, for example, "state" in our example.
   * <br/> `options.value` - the value of the processing text.
   * <br/> `options.isExists` - a boolean value. Set it to `true` if you want to use the value and set it to `false` if you don't.
   */
  public onProcessTextValue: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired before rendering a question. Use it to override the default question CSS classes.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - a question for which you can change the CSS classes.
   * <br/> `options.cssClasses` - an object with CSS classes. For example `{root: "table", button: "button"}`. You can change them to your own CSS classes.
   */
  public onUpdateQuestionCssClasses: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired before rendering a panel. Use it to override the default panel CSS classes.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.panel` - a panel for which you can change the CSS classes.
   * <br/> `options.cssClasses` - an object with CSS classes. For example `{title: "sv_p_title", description: "small"}`. You can change them to your own CSS classes.
   */
  public onUpdatePanelCssClasses: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired before rendering a page. Use it to override the default page CSS classes.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.page` - a page for which you can change the CSS classes.
   * <br/> `options.cssClasses` - an object with CSS classes. For example `{title: "sv_p_title", description: "small"}`. You can change them to your own CSS classes.
   */
  public onUpdatePageCssClasses: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired right after survey is rendered in DOM.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.htmlElement` - a root HTML element bound to the survey object.
   */
  public onAfterRenderSurvey: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired right after a page is rendered in DOM. Use it to modify HTML elements.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.htmlElement` - an HTML element bound to the survey header object.
   */
  public onAfterRenderHeader: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired right after a page is rendered in DOM. Use it to modify HTML elements.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.page` - a page object for which the event is fired. Typically the current/active page.
   * <br/> `options.htmlElement` - an HTML element bound to the page object.
   */
  public onAfterRenderPage: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired right after a question is rendered in DOM. Use it to modify HTML elements.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - a question object for which the event is fired.
   * <br/> `options.htmlElement` - an HTML element bound to the question object.
   */
  public onAfterRenderQuestion: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired right after a non-composite question (text, comment, dropdown, radiogroup, checkbox) is rendered in DOM. Use it to modify HTML elements.
   * This event is not fired for matrices, panels, multiple text and image picker.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - a question object for which the event is fired.
   * <br/> `options.htmlElement` - an HTML element bound to the question object.
   */
  public onAfterRenderQuestionInput: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired right after a panel is rendered in DOM. Use it to modify HTML elements.
   * <br/> `sender` - the survey object that fires the event
   * <br/> `options.panel` - a panel object for which the event is fired
   * <br/> `options.htmlElement` - an HTML element bound to the panel object
   */
  public onAfterRenderPanel: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on adding a new row in Matrix Dynamic question.
   * <br/> `sender` - the survey object that fires the event
   * <br/> `options.question` - a matrix question.
   * <br/> `options.row` - a new added row.
   * @see QuestionMatrixDynamicModel
   * @see QuestionMatrixDynamicModel.visibleRows
   */
  public onMatrixRowAdded: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired before adding a new row in Matrix Dynamic question.
   * <br/> `sender` - the survey object that fires the event
   * <br/> `options.question` - a matrix question.
   * <br/> `options.canAddRow` - specifies whether a new row can be added
   * @see QuestionMatrixDynamicModel
   * @see QuestionMatrixDynamicModel.visibleRows
   */
  public onMatrixBeforeRowAdded: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on removing a row from Matrix Dynamic question.
   * <br/> `sender` - the survey object that fires the event
   * <br/> `options.question` - a matrix question
   * <br/> `options.rowIndex` - a removed row index
   * <br/> `options.row` - a removed row object
   * @see QuestionMatrixDynamicModel
   * @see QuestionMatrixDynamicModel.visibleRows
   */
  public onMatrixRowRemoved: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired before rendering "Remove" button for removing a row from Matrix Dynamic question.
   * <br/> `sender` - the survey object that fires the event
   * <br/> `options.question` - a matrix question.
   * <br/> `options.rowIndex` - a row index.
   * <br/> `options.row` - a row object.
   * <br/> `options.allow` - a boolean property. Set it to `false` to disable the row removing.
   * @see QuestionMatrixDynamicModel
   */
  public onMatrixAllowRemoveRow: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired for every cell created in Matrix Dynamic and Matrix Dropdown questions.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - the matrix question.
   * <br/> `options.cell` - the matrix cell.
   * <br/> `options.cellQuestion` - the question/editor in the cell. You may customize it, change it's properties, like choices or visible.
   * <br/> `options.rowValue` - the value of the current row. To access a particular column's value within the current row, use: `options.rowValue["columnValue"]`.
   * <br/> `options.column` - the matrix column object.
   * <br/> `options.columName` - the matrix column name.
   * <br/> `options.row` - the matrix row object.
   * @see onMatrixBeforeRowAdded
   * @see onMatrixRowAdded
   * @see QuestionMatrixDynamicModel
   * @see QuestionMatrixDropdownModel
   */
  public onMatrixCellCreated: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired for every cell after is has been rendered in DOM.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - the matrix question.
   * <br/> `options.cell` - the matrix cell.
   * <br/> `options.cellQuestion` - the question/editor in the cell.
   * <br/> `options.htmlElement` - an HTML element bound to the `cellQuestion` object.
   * <br/> `options.column` - the matrix column object.
   * <br/> `options.row` - the matrix row object.
   * @see onMatrixCellCreated
   * @see QuestionMatrixDynamicModel
   * @see QuestionMatrixDropdownModel
   */
  public onMatrixAfterCellRender: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired when cell value is changed in Matrix Dynamic and Matrix Dropdown questions.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - the matrix question.
   * <br/> `options.columName` - the matrix column name.
   * <br/> `options.value` - a new value.
   * <br/> `options.row` - the matrix row object.
   * <br/> `options.getCellQuestion(columnName)` - the function that returns the cell question by column name.
   * @see onMatrixCellValueChanging
   * @see onMatrixBeforeRowAdded
   * @see onMatrixRowAdded
   * @see QuestionMatrixDynamicModel
   * @see QuestionMatrixDropdownModel
   */
  public onMatrixCellValueChanged: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on changing cell value in Matrix Dynamic and Matrix Dropdown questions. You may change the `options.value` property to change a cell value.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - the matrix question.
   * <br/> `options.columName` - the matrix column name.
   * <br/> `options.value` - a new value.
   * <br/> `options.oldValue` - the old value.
   * <br/> `options.row` - the matrix row object.
   * <br/> `options.getCellQuestion(columnName)` - the function that returns a cell question by column name.
   * @see onMatrixCellValueChanged
   * @see onMatrixBeforeRowAdded
   * @see onMatrixRowAdded
   * @see QuestionMatrixDynamicModel
   * @see QuestionMatrixDropdownModel
   */
  public onMatrixCellValueChanging: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired when Matrix Dynamic and Matrix Dropdown questions validate the cell value.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - the matrix question.
   * <br/> `options.columName` - the matrix column name.
   * <br/> `options.value` - a cell value.
   * <br/> `options.row` - the matrix row object.
   * <br/> `options.getCellQuestion(columnName)` - the function that returns the cell question by column name.
   * @see onMatrixBeforeRowAdded
   * @see onMatrixRowAdded
   * @see QuestionMatrixDynamicModel
   * @see QuestionMatrixDropdownModel
   */
  public onMatrixCellValidate: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on adding a new panel in Panel Dynamic question.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - a panel question.
   * @see QuestionPanelDynamicModel
   * @see QuestionPanelDynamicModel.panels
   */
  public onDynamicPanelAdded: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired on removing a panel from Panel Dynamic question.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - a panel question.
   * <br/> `options.panelIndex` - a removed panel index.
   * <br/> `options.panel` - a removed panel.
   * @see QuestionPanelDynamicModel
   * @see QuestionPanelDynamicModel.panels
   */
  public onDynamicPanelRemoved: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired every second if the method `startTimer` has been called.
   * @see startTimer
   * @see timeSpent
   * @see Page.timeSpent
   */
  public onTimer: Event<(sender: SurveyModel) => any, any> = new Event<
    (sender: SurveyModel) => any,
    any
  >();
  /**
   * The event is fired before displaying a new information in the Timer Panel. Use it to change the default text.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.text` - the timer panel info text.
   */
  public onTimerPanelInfoText: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * The event is fired when item value is changed in Panel Dynamic question.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - the panel question.
   * <br/> `options.panel` - the dynamic panel item.
   * <br/> `options.name` - the item name.
   * <br/> `options.value` - a new value.
   * <br/> `options.itemIndex` - the panel item index.
   * <br/> `options.itemValue` - the panel item object.
   * @see onDynamicPanelAdded
   * @see QuestionPanelDynamicModel
   */
  public onDynamicPanelItemValueChanged: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * Use this event to define, whether an answer to a question is correct or not.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.question` - a question on which you have to decide if the answer is correct or not.
   * <br/> `options.result` - returns `true`, if an answer is correct, or `false`, if the answer is not correct. Use questions' `value` and `correctAnswer` properties to return the correct value.
   * <br/> `options.correctAnswers` - you may change the default number of correct or incorrect answers in the question, for example for matrix, where each row is a quiz question.
   * @see Question.value
   * @see Question.correctAnswer
   */
  public onIsAnswerCorrect: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * Use this event to control drag&drop operations during design mode.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.allow` - set it to `false` to disable dragging.
   * <br/> `options.target` - a target element that is dragged.
   * <br/> `options.source` - a source element. It can be `null`, if it is a new element, dragging from toolbox.
   * <br/> `options.parent` - a page or panel where target element is dragging.
   * <br/> `options.insertBefore` - an element before the target element is dragging. It can be `null` if parent container (page or panel) is empty or dragging an element after the last element in a container.
   * <br/> `options.insertAfter` - an element after the target element is dragging. It can be `null` if parent container (page or panel) is empty or dragging element to the first position within the parent container.
   * @see setDesignMode
   * @see isDesignMode
   */
  public onDragDropAllow: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();
  /**
   * Use this event to control scrolling element to top. You can cancel the default behavior by setting options.cancel property to true.
   * <br/> `sender` - the survey object that fires the event.
   * <br/> `options.element` - an element that is going to be scrolled on top.
   * <br/> `options.question` - a question that is going to be scrolled on top. It can be null if options.page is not null.
   * <br/> `options.page` - a page that is going to be scrolled on top. It can be null if options.question is not null.
   * <br/> `options.elementId` - the unique element DOM Id.
   * <br/> `options.cancel` - set this property to true to cancel the default scrolling.
   */
  public onScrollingElementToTop: Event<
    (sender: SurveyModel, options: any) => any,
    any
  > = new Event<(sender: SurveyModel, options: any) => any, any>();

  public onLocaleChangedEvent: Event<
    (sender: SurveyModel, value: string) => any,
    any
  > = new Event<(sender: SurveyModel) => any, any>();

  /**
   * The list of errors on loading survey JSON. If the list is empty after loading a JSON, then the JSON is correct and has no errors.
   * @see JsonError
   */
  public jsonErrors: Array<JsonError> = null;

  constructor(jsonObj: any = null) {
    super();
    var self = this;
    if (typeof document !== "undefined") {
      SurveyModel.stylesManager = new StylesManager();
    }
    this.createLocalizableString("title", this, true);
    this.createLocalizableString("description", this, true);
    this.createLocalizableString("logo", this, false);
    this.createLocalizableString("completedHtml", this);
    this.createLocalizableString("completedBeforeHtml", this);
    this.createLocalizableString("loadingHtml", this);
    this.createLocalizableString("startSurveyText", this);
    this.createLocalizableString("pagePrevText", this);
    this.createLocalizableString("pageNextText", this);
    this.createLocalizableString("completeText", this);
    this.createLocalizableString("previewText", this);
    this.createLocalizableString("editText", this);
    this.createLocalizableString("questionTitleTemplate", this, true);

    this.textPreProcessor = new TextPreProcessor();
    this.textPreProcessor.onProcess = function (
      textValue: TextPreProcessorValue
    ) {
      self.getProcessedTextValue(textValue);
    };
    this.createNewArray("pages", function (value: any) {
      self.doOnPageAdded(value);
    });
    this.createNewArray("triggers", function (value: any) {
      value.setOwner(self);
    });
    this.createNewArray("calculatedValues", function (value: any) {
      value.setOwner(self);
    });
    this.createNewArray("completedHtmlOnCondition", function (value: any) {
      value.locOwner = self;
    });
    this.createNewArray("navigateToUrlOnCondition", function (value: any) {
      value.locOwner = self;
    });
    this.registerFunctionOnPropertyValueChanged(
      "firstPageIsStarted",
      function () {
        self.onFirstPageIsStartedChanged();
      }
    );
    this.registerFunctionOnPropertyValueChanged("mode", function () {
      self.onModeChanged();
    });
    this.onBeforeCreating();
    if (jsonObj) {
      if (typeof jsonObj === "string" || jsonObj instanceof String) {
        jsonObj = JSON.parse(jsonObj as string);
      }
      if (jsonObj && jsonObj.clientId) {
        this.clientId = jsonObj.clientId;
      }
      this.fromJSON(jsonObj);
      if (this.surveyId) {
        this.loadSurveyFromService(this.surveyId, this.clientId);
      }
    }
    this.onCreating();
  }
  public getType(): string {
    return "survey";
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any) {
    if (name === "questionsOnPageMode") {
      this.onQuestionsOnPageModeChanged(oldValue);
    }
  }

  /**
   * Returns a list of all pages in the survey, including invisible pages.
   * @see PageModel
   * @see visiblePages
   */
  public get pages(): Array<PageModel> {
    return this.getPropertyValue("pages");
  }
  public getCss(): any {
    return this.css;
  }
  private cssValue: any = null;
  public get css(): any {
    if (!this.cssValue) {
      this.cssValue = {};
      this.copyCssClasses(this.cssValue, surveyCss.getCss());
    }
    return this.cssValue;
  }
  public set css(value: any) {
    this.mergeValues(value, this.css);
  }
  public get cssNavigationComplete() {
    return this.getNavigationCss(
      this.css.navigationButton,
      this.css.navigation.complete
    );
  }
  public get cssNavigationPreview() {
    return this.getNavigationCss(
      this.css.navigationButton,
      this.css.navigation.preview
    );
  }
  public get cssNavigationEdit() {
    return this.getNavigationCss(
      this.css.navigationButton,
      this.css.navigation.edit
    );
  }
  public get cssNavigationPrev() {
    return this.getNavigationCss(
      this.css.navigationButton,
      this.css.navigation.prev
    );
  }
  public get cssNavigationStart() {
    return this.getNavigationCss(
      this.css.navigationButton,
      this.css.navigation.start
    );
  }
  public get cssNavigationNext() {
    return this.getNavigationCss(
      this.css.navigationButton,
      this.css.navigation.next
    );
  }
  public get completedCss() {
    var css = this.css;
    return css.body + " " + css.completedPage;
  }
  private getNavigationCss(main: string, btn: string) {
    var res = "";
    if (main) res = main;
    if (btn) res += " " + btn;
    return res;
  }
  /**
   * Gets or sets a list of triggers in the survey.
   * @see SurveyTrigger
   */
  public get triggers(): Array<SurveyTrigger> {
    return this.getPropertyValue("triggers");
  }
  public set triggers(val: Array<SurveyTrigger>) {
    this.setPropertyValue("triggers", val);
  }
  /**
   * Gets or sets a list of calculated values in the survey.
   * @see CalculatedValue
   */
  public get calculatedValues(): Array<CalculatedValue> {
    return this.getPropertyValue("calculatedValues");
  }
  public set calculatedValues(val: Array<CalculatedValue>) {
    this.setPropertyValue("calculatedValues", val);
  }
  /**
   * Gets or sets an identifier of a survey model loaded from the [api.surveyjs.io](https://api.surveyjs.io) service. When specified, the survey JSON is automatically loaded from [api.surveyjs.io](https://api.surveyjs.io) service.
   * @see loadSurveyFromService
   * @see onLoadedSurveyFromService
   */
  public get surveyId(): string {
    return this.getPropertyValue("surveyId", "");
  }
  public set surveyId(val: string) {
    this.setPropertyValue("surveyId", val);
  }
  /**
   * Gets or sets an identifier of a survey model saved to the [api.surveyjs.io](https://api.surveyjs.io) service. When specified, the survey data is automatically saved to the [api.surveyjs.io](https://api.surveyjs.io) service.
   * @see onComplete
   * @see surveyShowDataSaving
   */
  public get surveyPostId(): string {
    return this.getPropertyValue("surveyPostId", "");
  }
  public set surveyPostId(val: string) {
    this.setPropertyValue("surveyPostId", val);
  }
  /**
   * Gets or sets user's identifier (e.g., e-mail or unique customer id) in your web application.
   * If you load survey or post survey results from/to [api.surveyjs.io](https://api.surveyjs.io) service, then the library do not allow users to run the same survey the second time.
   * On the second run, the user will see the survey complete page.
   */
  public get clientId(): string {
    return this.getPropertyValue("clientId", "");
  }
  public set clientId(val: string) {
    this.setPropertyValue("clientId", val);
  }
  /**
   * Gets or sets a cookie name used to save information about completing the survey.
   * If the property is not empty, before starting the survey, the Survey library checks if the cookie with this name exists.
   * If it is `true`, the survey goes to complete mode and a user sees the survey complete page. On completing the survey the cookie with this name is created.
   */
  public get cookieName(): string {
    return this.getPropertyValue("cookieName", "");
  }
  public set cookieName(val: string) {
    this.setPropertyValue("cookieName", val);
  }
  /**
   * Gets or sets whether to save survey results on completing every page. If the property value is set to `true`, the `onPartialSend` event is fired.
   * @see onPartialSend
   * @see clientId
   */
  public get sendResultOnPageNext(): boolean {
    return this.getPropertyValue("sendResultOnPageNext", false);
  }
  public set sendResultOnPageNext(val: boolean) {
    this.setPropertyValue("sendResultOnPageNext", val);
  }
  /**
   * Gets or sets whether to show the progress on saving/sending data into the [api.surveyjs.io](https://api.surveyjs.io) service.
   * @see surveyPostId
   */
  public get surveyShowDataSaving(): boolean {
    return this.getPropertyValue("surveyShowDataSaving", false);
  }
  public set surveyShowDataSaving(val: boolean) {
    this.setPropertyValue("surveyShowDataSaving", val);
  }
  /**
   * Gets or sets whether the first input is focused on showing a next or a previous page.
   */
  public get focusFirstQuestionAutomatic(): boolean {
    return this.getPropertyValue("focusFirstQuestionAutomatic", true);
  }
  public set focusFirstQuestionAutomatic(val: boolean) {
    this.setPropertyValue("focusFirstQuestionAutomatic", val);
  }
  /**
   * Gets or sets whether the first input is focused if the current page has errors.
   * Set this property to `false` (the default value is `true`) if you do not want to bring the focus to the first question that has error on the page.
   */
  public get focusOnFirstError(): boolean {
    return this.getPropertyValue("focusOnFirstError", true);
  }
  public set focusOnFirstError(val: boolean) {
    this.setPropertyValue("focusOnFirstError", val);
  }
  /**
   * Gets or sets the navigation buttons position.
   * Possible values: 'bottom' (default), 'top', 'both' and 'none'. Set it to 'none' to hide 'Prev', 'Next' and 'Complete' buttons.
   * It makes sense if you are going to create a custom navigation, have only a single page, or the `goNextPageAutomatic` property is set to `true`.
   * @see goNextPageAutomatic
   * @see showPrevButton
   */
  public get showNavigationButtons(): string | any {
    return this.getPropertyValue("showNavigationButtons");
  }
  public set showNavigationButtons(val: string | any) {
    if (val === true || val === undefined) {
      val = "bottom";
    }
    if (val === false) {
      val = "none";
    }
    this.setPropertyValue("showNavigationButtons", val);
  }
  /**
   * Gets or sets whether the Survey displays "Prev" button in its pages. Set it to `false` to prevent end-users from going back to their answers.
   * @see showNavigationButtons
   */
  public get showPrevButton(): boolean {
    return this.getPropertyValue("showPrevButton", true);
  }
  public set showPrevButton(val: boolean) {
    this.setPropertyValue("showPrevButton", val);
  }
  /**
   * Gets or sets whether the Survey displays survey title in its pages. Set it to `false` to hide a survey title.
   * @see title
   */
  public get showTitle(): boolean {
    return this.getPropertyValue("showTitle", true);
  }
  public set showTitle(val: boolean) {
    this.setPropertyValue("showTitle", val);
  }
  /**
   * Gets or sets whether the Survey displays page titles. Set it to `false` to hide page titles.
   * @see PageModel.title
   */
  public get showPageTitles(): boolean {
    return this.getPropertyValue("showPageTitles", true);
  }
  public set showPageTitles(val: boolean) {
    this.setPropertyValue("showPageTitles", val);
  }
  /**
   * On finishing the survey the complete page is shown. Set the property to `false`, to hide the complete page.
   * @see data
   * @see onComplete
   * @see navigateToUrl
   */
  public get showCompletedPage(): boolean {
    return this.getPropertyValue("showCompletedPage", true);
  }
  public set showCompletedPage(val: boolean) {
    this.setPropertyValue("showCompletedPage", val);
  }
  /**
   * Set this property to a url you want to navigate after a user completing the survey.
   * By default it uses after calling onComplete event. In case calling options.showDataSaving callback in onComplete event, navigateToUrl will be used on calling options.showDataSavingSuccess callback.
   */
  public get navigateToUrl(): string {
    return this.getPropertyValue("navigateToUrl");
  }
  public set navigateToUrl(val: string) {
    this.setPropertyValue("navigateToUrl", val);
  }
  /**
   * Gets or sets a list of URL condition items. If the expression of this item returns `true`, then survey will navigate to the item URL.
   * @see UrlConditionItem
   * @see navigateToUrl
   */
  public get navigateToUrlOnCondition(): Array<UrlConditionItem> {
    return this.getPropertyValue("navigateToUrlOnCondition");
  }
  public set navigateToUrlOnCondition(val: Array<UrlConditionItem>) {
    this.setPropertyValue("navigateToUrlOnCondition", val);
  }

  public getNavigateToUrl(): string {
    var item = this.getExpressionItemOnRunCondition(
      this.navigateToUrlOnCondition
    );
    var url = !!item ? (<UrlConditionItem>item).url : this.navigateToUrl;
    if (!!url) {
      url = this.processText(url, true);
    }
    return url;
  }
  private navigateTo() {
    var url = this.getNavigateToUrl();
    var options = { url: url };
    this.onNavigateToUrl.fire(this, options);
    if (!options.url || !window || !window.location) return;
    window.location.href = options.url;
  }
  /**
   * Gets or sets the required question mark. The required question mark is a char or string that is rendered in the required questions' titles.
   * @see Question.title
   */
  public get requiredText(): string {
    return this.getPropertyValue("requiredText", "*");
  }
  public set requiredText(val: string) {
    this.setPropertyValue("requiredText", val);
  }
  /**
   * Gets or sets whether to hide all required errors.
   */
  public hideRequiredErrors: boolean = false;
  beforeSettingQuestionErrors(
    question: IQuestion,
    errors: Array<SurveyError>
  ): void {
    if (this.hideRequiredErrors) {
      for (var i = 0; i < errors.length; i++) {
        if (errors[i].getErrorType() == "required") {
          errors[i].visible = false;
        }
      }
    }
    this.onSettingQuestionErrors.fire(this, {
      question: question,
      errors: errors,
    });
  }
  /**
   * Gets or sets the first question index. The first question index is '1' by default. You may start it from '100' or from 'A', by setting '100' or 'A' to this property.
   * You can set the start index to "(1)" or "# A)" or "a)" to render question number as (1), # A) and a) accordingly.
   * @see Question.title
   * @see requiredText
   */
  public get questionStartIndex(): string {
    return this.getPropertyValue("questionStartIndex", "");
  }
  public set questionStartIndex(val: string) {
    this.setPropertyValue("questionStartIndex", val);
  }
  /**
   * Gets or sets whether the "Others" option text is stored as question comment.
   *
   * By default the entered text in the "Others" input in the checkbox/radiogroup/dropdown is stored as `"question name " + "-Comment"`. The value itself is `"question name": "others"`.
   * Set this property to `false`, to store the entered text directly in the `"question name"` key.
   * @see commentPrefix
   */
  public get storeOthersAsComment(): boolean {
    return this.getPropertyValue("storeOthersAsComment", true);
  }
  public set storeOthersAsComment(val: boolean) {
    this.setPropertyValue("storeOthersAsComment", val);
  }
  /**
   * Specifies the default maximum length for questions like text and comment, including matrix cell questions.
   *
   * The default value is `0`, that means that the text and comment have the same max length as the standard HTML input - 524288 characters: https://www.w3schools.com/tags/att_input_maxlength.asp.
   * @see maxOthersLength
   */
  public get maxTextLength(): number {
    return this.getPropertyValue("maxTextLength", 0);
  }
  public set maxTextLength(val: number) {
    this.setPropertyValue("maxTextLength", val);
  }
  /**
   * Gets or sets the default maximum length for question comments and others
   *
   * The default value is `0`, that means that the question comments have the same max length as the standard HTML input - 524288 characters: https://www.w3schools.com/tags/att_input_maxlength.asp.
   * @see Question.hasComment
   * @see Question.hasOther
   * @see maxTextLength
   */
  public get maxOthersLength(): number {
    return this.getPropertyValue("maxOthersLength", 0);
  }
  public set maxOthersLength(val: number) {
    this.setPropertyValue("maxOthersLength", val);
  }

  /**
   * Gets or ses whether a user can navigate the next page automatically after answering all the questions on a page without pressing the "Next" button.
   * The available options:
   *
   * - `true` - navigate the next page and submit survey data automatically.
   * - `autogonext` - navigate the next page automatically but do not submit survey data.
   * - `false` - do not navigate the next page and do not submit survey data automatically.
   * @see showNavigationButtons
   */
  public get goNextPageAutomatic(): boolean | "autogonext" {
    return this.getPropertyValue("goNextPageAutomatic", false);
  }
  public set goNextPageAutomatic(val: boolean | "autogonext") {
    this.setPropertyValue("goNextPageAutomatic", val);
  }
  /**
   * Gets or sets whether a survey is automatically completed when `goNextPageAutomatic = true`. Set it to `false` if you do not want to submit survey automatically on completing the last survey page.
   * @see goNextPageAutomatic
   */
  public get allowCompleteSurveyAutomatic(): boolean {
    return this.getPropertyValue("allowCompleteSurveyAutomatic", true);
  }
  public set allowCompleteSurveyAutomatic(val: boolean) {
    this.setPropertyValue("allowCompleteSurveyAutomatic", val);
  }
  /**
   * Gets or sets a value that specifies how the survey validates the question answers.
   *
   * The following options are available:
   *
   * - `onNextPage` (default) - check errors on navigating to the next page or on completing the survey.
   * - `onValueChanged` - check errors on every question value (i.e., answer) changing.
   * - `onComplete` - to validate all visible questions on complete button click. If there are errors on previous pages, then the page with the first error becomes the current.
   */
  public get checkErrorsMode(): string {
    return this.getPropertyValue("checkErrorsMode");
  }
  public set checkErrorsMode(val: string) {
    this.setPropertyValue("checkErrorsMode", val);
  }
  /**
   * Gets or sets a value that specifies how the survey updates its questions' text values.
   *
   * The following options are available:
   *
   * - `onBlur` (default) - the value is updated after an input loses the focus.
   * - `onTyping` - update the value of text questions, "text" and "comment", on every key press.
   *
   * Note, that setting to "onTyping" may lead to a performance degradation, in case you have many expressions in the survey.
   */
  public get textUpdateMode(): string {
    return this.getPropertyValue("textUpdateMode");
  }
  public set textUpdateMode(val: string) {
    this.setPropertyValue("textUpdateMode", val);
  }
  /**
   * Gets or sets a value that specifies how the invisible data is included in survey data.
   *
   * The following options are available:
   *
   * - `none` - include the invisible values into the survey data.
   * - `onHidden` - clear the question value when it becomes invisible. If a question has value and it was invisible initially then survey clears the value on completing.
   * - `onComplete` (default) - clear invisible question values on survey complete. In this case, the invisible questions will not be stored on the server.
   * @see Question.visible
   * @see onComplete
   */
  public get clearInvisibleValues(): any {
    return this.getPropertyValue("clearInvisibleValues");
  }
  public set clearInvisibleValues(val: any) {
    if (val === true) val = "onComplete";
    if (val === false) val = "none";
    this.setPropertyValue("clearInvisibleValues", val);
  }
  /**
   * Call this function to remove all question values from the survey, that end-user will not be able to enter.
   * For example the value that doesn't exists in a radiogroup/dropdown/checkbox choices or matrix rows/columns.
   * Please note, this function doesn't clear values for invisible questions or values that doesn't associated with questions.
   * In fact this function just call clearIncorrectValues function of all questions in the survey
   * @see Question.clearIncorrectValues
   * @see Page.clearIncorrectValues
   * @see Panel.clearIncorrectValues
   */
  public clearIncorrectValues() {
    for (var i = 0; i < this.pages.length; i++) {
      this.pages[i].clearIncorrectValues();
    }
  }

  /**
   * Gets or sets the survey locale. The default value it is empty, this means the 'en' locale is used.
   * You can set it to 'de' - German, 'fr' - French and so on. The library has built-in localization for several languages. The library has a multi-language support as well.
   */
  public get locale(): string {
    return this.localeValue;
  }
  public set locale(value: string) {
    surveyLocalization.currentLocale = value;
    this.localeValue = surveyLocalization.currentLocale;
    this.setPropertyValue("locale", this.localeValue);
    this.locStrsChanged();
    this.onLocaleChanged();
    this.onLocaleChangedEvent.fire(this, value);
  }
  /**
   * Returns an array of locales that are used in the current survey.
   */
  public getUsedLocales(): Array<string> {
    var locs = new Array<string>();
    this.addUsedLocales(locs);
    //Replace the default locale with the real one
    var index = locs.indexOf("default");
    if (index > -1) {
      var defaultLoc = surveyLocalization.defaultLocale;
      //Remove the defaultLoc
      var defIndex = locs.indexOf(defaultLoc);
      if (defIndex > -1) {
        locs.splice(defIndex, 1);
      }
      index = locs.indexOf("default");
      locs[index] = defaultLoc;
    }
    return locs;
  }
  protected onLocaleChanged() {}
  //ILocalizableOwner
  getLocale() {
    return this.locale;
  }
  public locStrsChanged() {
    super.locStrsChanged();
    if (this.currentPage) {
      this.currentPage.locStrsChanged();
    }
  }
  public getMarkdownHtml(text: string): string {
    return this.getSurveyMarkdownHtml(this, text);
  }
  public getProcessedText(text: string) {
    return this.processText(text, true);
  }
  getLocString(str: string) {
    return surveyLocalization.getString(str);
  }
  //ISurveyErrorOwner
  getErrorCustomText(text: string, error: SurveyError): string {
    var options = { text: text, name: error.getErrorType(), error: error };
    this.onErrorCustomText.fire(this, options);
    return options.text;
  }
  /**
   * Returns the text that is displayed when there are no any visible pages and questiona.
   */
  public get emptySurveyText(): string {
    return this.getLocString("emptySurvey");
  }
  /**
   * Gets or sets a survey title.
   * @see description
   */
  public get title(): string {
    return this.getLocalizableStringText("title");
  }
  public set title(value: string) {
    this.setLocalizableStringText("title", value);
  }
  get locTitle(): LocalizableString {
    return this.getLocalizableString("title");
  }
  /**
   * Gets or sets a survey description. The survey description is displayed under a survey title.
   * @see title
   */
  public get description(): string {
    return this.getLocalizableStringText("description");
  }
  public set description(value: string) {
    this.setLocalizableStringText("description", value);
  }
  get locDescription(): LocalizableString {
    return this.getLocalizableString("description");
  }
  /**
   * Gets or sets a survey logo.
   * @see title
   */
  public get logo(): string {
    return this.getLocalizableStringText("logo");
  }
  public set logo(value: string) {
    this.setLocalizableStringText("logo", value);
  }
  get locLogo(): LocalizableString {
    return this.getLocalizableString("logo");
  }
  /**
   * Gets or sets a survey logo width.
   * @see logo
   */
  public get logoWidth(): number {
    return this.getPropertyValue("logoWidth", 300);
  }
  public set logoWidth(value: number) {
    this.setPropertyValue("logoWidth", value);
  }
  /**
   * Gets or sets a survey logo height.
   * @see logo
   */
  public get logoHeight(): number {
    return this.getPropertyValue("logoHeight", 200);
  }
  public set logoHeight(value: number) {
    this.setPropertyValue("logoHeight", value);
  }
  /**
   * Gets or sets a survey logo position.
   * @see logo
   */
  public get logoPosition(): string {
    return this.getPropertyValue("logoPosition", "left");
  }
  public set logoPosition(value: string) {
    this.setPropertyValue("logoPosition", value);
  }
  public get hasLogo() {
    return !!this.logo && this.logoPosition !== "none";
  }
  public get isLogoBefore() {
    return (
      this.hasLogo &&
      (this.logoPosition === "left" || this.logoPosition === "top")
    );
  }
  public get isLogoAfter() {
    return (
      this.hasLogo &&
      (this.logoPosition === "right" || this.logoPosition === "bottom")
    );
  }
  public get logoClassNames(): string {
    var logoClasses: { [index: string]: string } = {
      left: "sv-logo--left",
      right: "sv-logo--right",
      top: "sv-logo--top",
      bottom: "sv-logo--bottom",
    };
    return this.css.logo + " " + logoClasses[this.logoPosition];
  }
  /**
   * The logo fit mode.
   * @see logo
   */
  public get logoFit(): string {
    return this.getPropertyValue("logoFit");
  }
  public set logoFit(val: string) {
    this.setPropertyValue("logoFit", val);
  }
  /**
   * Gets or sets the HTML content displayed on the complete page. Use this property to change the default complete page text.
   * @see showCompletedPage
   * @see completedHtmlOnCondition
   * @see locale
   */
  public get completedHtml(): string {
    return this.getLocalizableStringText("completedHtml");
  }
  public set completedHtml(value: string) {
    this.setLocalizableStringText("completedHtml", value);
  }
  get locCompletedHtml(): LocalizableString {
    return this.getLocalizableString("completedHtml");
  }
  /**
   * The list of HTML condition items. If the expression of this item returns `true`, then a survey will use this item HTML instead of `completedHtml`.
   * @see HtmlConditionItem
   * @see completeHtml
   */
  public get completedHtmlOnCondition(): Array<HtmlConditionItem> {
    return this.getPropertyValue("completedHtmlOnCondition");
  }
  public set completedHtmlOnCondition(val: Array<HtmlConditionItem>) {
    this.setPropertyValue("completedHtmlOnCondition", val);
  }
  /**
   * Calculates a given expression and returns a result value.
   * @param expression
   */
  public runExpression(expression: string): any {
    if (!expression) return null;
    var values = this.getFilteredValues();
    var properties = this.getFilteredProperties();
    return new ExpressionRunner(expression).run(values, properties);
  }
  /**
   * Calculates a given expression and returns `true` or `false`.
   * @param expression
   */
  public runCondition(expression: string): boolean {
    if (!expression) return false;
    var values = this.getFilteredValues();
    var properties = this.getFilteredProperties();
    return new ConditionRunner(expression).run(values, properties);
  }
  public get renderedCompletedHtml(): string {
    var item = this.getExpressionItemOnRunCondition(
      this.completedHtmlOnCondition
    );
    return !!item ? (<HtmlConditionItem>item).html : this.completedHtml;
  }
  private getExpressionItemOnRunCondition(
    items: Array<ExpressionItem>
  ): ExpressionItem {
    if (items.length == 0) return null;
    var values = this.getFilteredValues();
    var properties = this.getFilteredProperties();
    for (var i = 0; i < items.length; i++) {
      if (items[i].runCondition(values, properties)) {
        return items[i];
      }
    }
    return null;
  }

  /**
   * The HTML content displayed to an end user that has already completed the survey.
   * @see clientId
   * @see locale
   */
  public get completedBeforeHtml(): string {
    return this.getLocalizableStringText("completedBeforeHtml");
  }
  public set completedBeforeHtml(value: string) {
    this.setLocalizableStringText("completedBeforeHtml", value);
  }
  get locCompletedBeforeHtml(): LocalizableString {
    return this.getLocalizableString("completedBeforeHtml");
  }
  /**
   * The HTML that shows on loading survey Json from the [api.surveyjs.io](https://api.surveyjs.io) service.
   * @see surveyId
   * @see locale
   */
  public get loadingHtml(): string {
    return this.getLocalizableStringText("loadingHtml");
  }
  public set loadingHtml(value: string) {
    this.setLocalizableStringText("loadingHtml", value);
  }
  get locLoadingHtml(): LocalizableString {
    return this.getLocalizableString("loadingHtml");
  }
  /**
   * Gets or sets the 'Start' button caption.
   * The 'Start' button is shown on the started page. Set the `firstPageIsStarted` property to `true`, to display the started page.
   * @see firstPageIsStarted
   * @see locale
   */
  public get startSurveyText(): string {
    return this.getLocalizableStringText(
      "startSurveyText",
      this.getLocString("startSurveyText")
    );
  }
  public set startSurveyText(newValue: string) {
    this.setLocalizableStringText("startSurveyText", newValue);
  }
  get locStartSurveyText(): LocalizableString {
    return this.getLocalizableString("startSurveyText");
  }
  /**
   * Gets or sets the 'Prev' button caption.
   * @see locale
   */
  public get pagePrevText(): string {
    return this.getLocalizableStringText(
      "pagePrevText",
      this.getLocString("pagePrevText")
    );
  }
  public set pagePrevText(newValue: string) {
    this.setLocalizableStringText("pagePrevText", newValue);
  }
  get locPagePrevText(): LocalizableString {
    return this.getLocalizableString("pagePrevText");
  }
  /**
   * Gets or sets the 'Next' button caption.
   * @see locale
   */
  public get pageNextText(): string {
    return this.getLocalizableStringText(
      "pageNextText",
      this.getLocString("pageNextText")
    );
  }
  public set pageNextText(newValue: string) {
    this.setLocalizableStringText("pageNextText", newValue);
  }
  get locPageNextText(): LocalizableString {
    return this.getLocalizableString("pageNextText");
  }
  /**
   *  Gets or sets the 'Complete' button caption.
   * @see locale
   */
  public get completeText(): string {
    return this.getLocalizableStringText(
      "completeText",
      this.getLocString("completeText")
    );
  }
  public set completeText(newValue: string) {
    this.setLocalizableStringText("completeText", newValue);
  }
  get locCompleteText(): LocalizableString {
    return this.getLocalizableString("completeText");
  }
  /**
   *  Gets or sets the 'Preview' button caption.
   * @see locale
   * @see showPreviewBeforeComplete
   * @see editText
   * @see showPreview
   */
  public get previewText(): string {
    return this.getLocalizableStringText(
      "previewText",
      this.getLocString("previewText")
    );
  }
  public set previewText(newValue: string) {
    this.setLocalizableStringText("previewText", newValue);
  }
  get locPreviewText(): LocalizableString {
    return this.getLocalizableString("previewText");
  }
  /**
   *  Gets or sets the 'Edit' button caption.
   * @see locale
   * @see showPreviewBeforeComplete
   * @see previewText
   * @see cancelPreview
   */
  public get editText(): string {
    return this.getLocalizableStringText(
      "editText",
      this.getLocString("editText")
    );
  }
  public set editText(newValue: string) {
    this.setLocalizableStringText("editText", newValue);
  }
  get locEditText(): LocalizableString {
    return this.getLocalizableString("editText");
  }

  /**
   * Set the pattern for question title. Default is "numTitleRequire", 1. What is your name? *,
   * You can set it to numRequireTitle: 1. * What is your name?
   * You can set it to requireNumTitle: * 1. What is your name?
   * You can set it to numTitle (remove require symbol completely): 1. What is your name?
   * @see QuestionModel.title
   */
  public get questionTitlePattern(): string {
    return this.getPropertyValue("questionTitlePattern", "numTitleRequire");
  }
  public set questionTitlePattern(val: string) {
    if (
      val !== "numRequireTitle" &&
      val !== "requireNumTitle" &&
      val != "numTitle"
    ) {
      val = "numTitleRequire";
    }
    this.setPropertyValue("questionTitlePattern", val);
  }
  getQuestionTitlePatternOptions(): Array<any> {
    var res = new Array<any>();
    var title = this.getLocString("questionTitlePatternText");
    var num = !!this.questionStartIndex ? this.questionStartIndex : "1.";
    res.push({
      value: "numTitleRequire",
      text: num + " " + title + " " + this.requiredText,
    });
    res.push({
      value: "numRequireTitle",
      text: num + " " + this.requiredText + " " + title,
    });
    res.push({
      value: "requireNumTitle",
      text: this.requiredText + " " + num + " " + title,
    });
    res.push({
      value: "numTitle",
      text: num + " " + title,
    });
    return res;
  }
  /**
   * Gets or sets a question title template. Obsolete, please use questionTitlePattern
   * @see QuestionModel.title
   * @see questionTitlePattern
   */
  public get questionTitleTemplate(): string {
    return this.getLocalizableStringText("questionTitleTemplate");
  }
  public set questionTitleTemplate(value: string) {
    this.setLocalizableStringText("questionTitleTemplate", value);
    this.questionTitlePattern = this.getNewTitlePattern(value);
    this.questionStartIndex = this.getNewQuestionTitleElement(
      value,
      "no",
      this.questionStartIndex,
      "1"
    );
    this.requiredText = this.getNewQuestionTitleElement(
      value,
      "require",
      this.requiredText,
      "*"
    );
  }
  private getNewTitlePattern(template: string): string {
    if (!!template) {
      var strs = [];
      while (template.indexOf("{") > -1) {
        template = template.substr(template.indexOf("{") + 1);
        var ind = template.indexOf("}");
        if (ind < 0) break;
        strs.push(template.substr(0, ind));
        template = template.substr(ind + 1);
      }
      if (strs.length > 1) {
        if (strs[0] == "require") return "requireNumTitle";
        if (strs[1] == "require" && strs.length == 3) return "numRequireTitle";
        if (strs.indexOf("require") < 0) return "numTitle";
      }
      if (strs.length == 1 && strs[0] == "title") {
        return "numTitle";
      }
    }
    return "numTitleRequire";
  }
  private getNewQuestionTitleElement(
    template: string,
    name: string,
    currentValue: string,
    defaultValue: string
  ): string {
    name = "{" + name + "}";
    if (!template || template.indexOf(name) < 0) return currentValue;
    var ind = template.indexOf(name);
    var prefix = "";
    var postfix = "";
    var i = ind - 1;
    for (; i >= 0; i--) {
      if (template[i] == "}") break;
    }
    if (i < ind - 1) {
      prefix = template.substr(i + 1, ind - i - 1);
    }
    ind += name.length;
    i = ind;
    for (; i < template.length; i++) {
      if (template[i] == "{") break;
    }
    if (i > ind) {
      postfix = template.substr(ind, i - ind);
    }
    i = 0;
    while (i < prefix.length && prefix.charCodeAt(i) < 33) i++;
    prefix = prefix.substr(i);
    i = postfix.length - 1;
    while (i >= 0 && postfix.charCodeAt(i) < 33) i--;
    postfix = postfix.substr(0, i + 1);
    if (!prefix && !postfix) return currentValue;
    var value = !!currentValue ? currentValue : defaultValue;
    return prefix + value + postfix;
  }
  get locQuestionTitleTemplate(): LocalizableString {
    return this.getLocalizableString("questionTitleTemplate");
  }
  getUpdatedQuestionTitle(question: IQuestion, title: string): string {
    if (this.onGetQuestionTitle.isEmpty) return title;
    var options = { question: question, title: title };
    this.onGetQuestionTitle.fire(this, options);
    return options.title;
  }
  /**
   * Gets or sets whether the survey displays page numbers on pages titles.
   */
  public get showPageNumbers(): boolean {
    return this.getPropertyValue("showPageNumbers", false);
  }
  public set showPageNumbers(value: boolean) {
    if (value === this.showPageNumbers) return;
    this.setPropertyValue("showPageNumbers", value);
    this.updateVisibleIndexes();
  }
  /**
   * Gets or sets a value that specifies how the question numbers are displayed.
   *
   * The following options are available:
   *
   * - `on` - display question numbers
   * - `onpage` - display question numbers, start numbering on every page
   * - `off` - turn off the numbering for questions titles
   */
  public get showQuestionNumbers(): string {
    return this.getPropertyValue("showQuestionNumbers");
  }
  public set showQuestionNumbers(value: string) {
    value = value.toLowerCase();
    value = value === "onpage" ? "onPage" : value;
    if (value === this.showQuestionNumbers) return;
    this.setPropertyValue("showQuestionNumbers", value);
    this.updateVisibleIndexes();
  }
  /**
   * Gets or sets the survey progress bar position.
   *
   * The following options are available:
   *
   * - `top` - show progress bar in the top
   * - `bottom` - show progress bar in the bottom
   * - `both` - show progress bar in both sides: top and bottom.
   */
  public get showProgressBar(): string {
    return this.getPropertyValue("showProgressBar");
  }
  public set showProgressBar(newValue: string) {
    this.setPropertyValue("showProgressBar", newValue.toLowerCase());
  }
  /**
   * Gets or sets the type of info in the progress bar.
   *
   * The following options are available:
   *
   * - `pages` (default),
   * - `questions`,
   * - `correctQuestions`.
   */
  public get progressBarType(): string {
    return this.getPropertyValue("progressBarType");
  }
  public set progressBarType(newValue: string) {
    this.setPropertyValue("progressBarType", newValue.toLowerCase());
  }
  public get isShowProgressBarOnTop(): boolean {
    return this.showProgressBar === "top" || this.showProgressBar === "both";
  }
  public get isShowProgressBarOnBottom(): boolean {
    return this.showProgressBar === "bottom" || this.showProgressBar === "both";
  }
  /**
   * Returns the text/HTML that is rendered as a survey title.
   */
  public get processedTitle() {
    return this.locTitle.renderedHtml;
  }
  /**
   * Gets or sets the question title location.
   *
   * The following options are available:
   *
   * - `bottom` - show a question title to bottom
   * - `left` - show a question title to left
   * - `top` - show a question title to top.
   *
   * > Some questions, for example matrixes, do not support 'left' value. The title for them will be displayed to the top.
   */
  public get questionTitleLocation(): string {
    return this.getPropertyValue("questionTitleLocation");
  }
  public set questionTitleLocation(value: string) {
    this.setPropertyValue("questionTitleLocation", value.toLowerCase());
    if (!this.isLoadingFromJson) {
      this.updateElementCss();
    }
  }
  protected updateElementCss() {
    var pages = this.visiblePages;
    for (var i = 0; i < pages.length; i++) {
      pages[i].updateElementCss();
    }
  }
  /**
   * Gets or sets the error message position.
   *
   * The following options are available:
   *
   * - `top` - to show question error(s) over the question,
   * - `bottom` - to show question error(s) under the question.
   */
  public get questionErrorLocation(): string {
    return this.getPropertyValue("questionErrorLocation");
  }
  public set questionErrorLocation(value: string) {
    this.setPropertyValue("questionErrorLocation", value.toLowerCase());
  }
  /**
   * Gets or sets the question description position.
   *
   * The following options are available:
   *
   * - `underTitle` - show question description under the question title,
   * - `underInput` - show question description under the question input instead of question title.
   */
  public get questionDescriptionLocation(): string {
    return this.getPropertyValue("questionDescriptionLocation");
  }
  public set questionDescriptionLocation(value: string) {
    this.setPropertyValue("questionDescriptionLocation", value);
  }
  /**
   * Gets or sets the survey edit mode.
   *
   * The following options are available:
   *
   * - `edit` (default) - make a survey editable,
   * - `display` - make a survey read-only.
   */
  public get mode(): string {
    return this.getPropertyValue("mode");
  }
  public set mode(value: string) {
    value = value.toLowerCase();
    if (value == this.mode) return;
    if (value != "edit" && value != "display") return;
    this.setPropertyValue("mode", value);
  }
  private onModeChanged() {
    for (var i = 0; i < this.pages.length; i++) {
      var page = this.pages[i];
      page.setPropertyValue("isReadOnly", page.isReadOnly);
    }
  }
  /**
   * Gets or sets an object that stores the survey results/data. You can set it directly as `{ 'question name': questionValue, ... }`
   *
   * > If you set the `data` property after creating the survey, you may need to set the `currentPageNo` to `0`, if you are using `visibleIf` properties for questions/pages/panels to ensure that you are starting from the first page.
   * @see setValue
   * @see getValue
   * @see mergeData
   * @see currentPageNo
   */
  public get data(): any {
    var result: { [index: string]: any } = {};
    for (var key in this.valuesHash) {
      var dataValue = this.getDataValueCore(this.valuesHash, key);
      if (dataValue !== undefined) {
        result[key] = dataValue;
      }
    }
    this.setCalcuatedValuesIntoResult(result);
    return result;
  }
  public set data(data: any) {
    this.valuesHash = {};
    this.setDataCore(data);
  }
  /**
   * Merge the values into survey.data. It works as survey.data, except it doesn't clean the existing data, but overrides them.
   * @param data data to merge. It should be an object {keyValue: Value, ...}
   * @see data
   * @see setValue
   */
  public mergeData(data: any) {
    if (!data) return;
    this.setDataCore(data);
  }
  public setDataCore(data: any) {
    if (data) {
      for (var key in data) {
        this.setDataValueCore(this.valuesHash, key, data[key]);
      }
    }
    this.updateAllQuestionsValue();
    this.notifyAllQuestionsOnValueChanged();
    this.notifyElementsOnAnyValueOrVariableChanged("");
    this.runConditions();
  }
  private setCalcuatedValuesIntoResult(result: any) {
    for (var i = 0; i < this.calculatedValues.length; i++) {
      var calValue = this.calculatedValues[i];
      if (
        calValue.includeIntoResult &&
        !!calValue.name &&
        this.getVariable(calValue.name) !== undefined
      ) {
        result[calValue.name] = this.getVariable(calValue.name);
      }
    }
  }
  getAllValues(): any {
    return this.data;
  }
  /**
   * Returns survey result data as an array of plain objects: with question `title`, `name`, `value`, and `displayValue`.
   *
   * For complex questions (like matrix, etc.) `isNode` flag is set to `true` and data contains array of nested objects (rows).
   *
   * Set `options.includeEmpty` to `false` if you want to skip empty answers.
   */
  public getPlainData(
    options: {
      includeEmpty?: boolean;
      includeQuestionTypes?: boolean;
      calculations?: Array<{
        propertyName: string;
      }>;
    } = {
      includeEmpty: true,
      includeQuestionTypes: false,
    }
  ) {
    var result: Array<any> = [];
    this.getAllQuestions().forEach((question) => {
      var resultItem = (<Question>question).getPlainData(options);
      if (!!resultItem) {
        result.push(resultItem);
      }
    });
    return result;
  }
  private conditionVersion = 0;
  getFilteredValues(): any {
    var values: { [index: string]: any } = {};
    for (var key in this.variablesHash) values[key] = this.variablesHash[key];
    for (var key in this.valuesHash)
      values[key] = this.getDataValueCore(this.valuesHash, key);
    values["conditionVersion"] = ++this.conditionVersion;
    return values;
  }
  getFilteredProperties(): any {
    return { survey: this };
  }

  public getDataValueCore(valuesHash: any, key: string) {
    return valuesHash[key];
  }
  public setDataValueCore(valuesHash: any, key: string, value: any) {
    valuesHash[key] = value;
  }
  public deleteDataValueCore(valuesHash: any, key: string) {
    delete valuesHash[key];
  }
  // protected iterateDataValuesHash(func: (hash: any, key: any) => void) {
  //   var keys: any[] = [];
  //   for (var key in this.valuesHash) {
  //     keys.push(key);
  //   }
  //   keys.forEach(key => func(this.valuesHash, key));
  // }

  /**
   * Returns all comments from the data.
   * @see data
   */
  public get comments(): any {
    var result: { [index: string]: any } = {};
    for (var key in this.valuesHash) {
      if (key.indexOf(this.commentPrefix) > 0) {
        result[key] = this.getDataValueCore(this.valuesHash, key);
      }
    }
    return result;
  }
  /**
   * Returns a list of visible pages. If all pages are visible, then this property returns the same list as the `pages` property.
   * @see pages
   * @see PageModel.visible
   * @see PageModel.visibleIf
   */
  public get visiblePages(): Array<PageModel> {
    if (this.isDesignMode) return this.pages;
    var result = new Array<PageModel>();
    for (var i = 0; i < this.pages.length; i++) {
      if (this.pages[i].isVisible) {
        result.push(this.pages[i]);
      }
    }
    return result;
  }
  /**
   * Returns `true` if the survey contains no pages. The survey is empty.
   */
  public get isEmpty(): boolean {
    return this.pages.length == 0;
  }
  /**
   * Deprecated. Use the `pageCount` property instead.
   */
  get PageCount(): number {
    return this.pageCount;
  }
  /**
   * Returns the survey page count.
   * @see visiblePageCount
   * @see pages
   */
  public get pageCount(): number {
    return this.pages.length;
  }
  /**
   * Returns a number of visible pages within the survey.
   * @see pageCount
   * @see visiblePages
   */
  public get visiblePageCount(): number {
    return this.visiblePages.length;
  }
  /**
   * Returns the started page. This property works if the `firstPageIsStarted` property is set to `true`.
   * @see firstPageIsStarted
   */
  public get startedPage(): PageModel {
    var page =
      this.firstPageIsStarted && this.pages.length > 0 ? this.pages[0] : null;
    if (!!page) {
      page.onFirstRendering();
    }
    return page;
  }
  /**
   * Gets or sets the current survey page. If a survey is rendered, then this property returns a page that a user can see/edit.
   */
  public get currentPage(): any {
    var vPages = this.visiblePages;
    if (this.currentPageValue != null) {
      if (vPages.indexOf(this.currentPageValue) < 0) {
        if (
          !this.onContainsPageCallback ||
          !this.onContainsPageCallback(this.currentPageValue)
        ) {
          this.currentPage = null;
        }
      }
    }
    if (this.currentPageValue == null && vPages.length > 0) {
      this.currentPage = vPages[0];
    }
    return this.currentPageValue;
  }
  public set currentPage(value: any) {
    var newPage = this.getPageByObject(value);
    if (!!value && !newPage) return;
    var vPages = this.visiblePages;
    if (newPage != null && vPages.indexOf(newPage) < 0) return;
    if (newPage == this.currentPageValue) return;
    var oldValue = this.currentPageValue;
    if (!this.currentPageChanging(newPage, oldValue)) return;
    if (!!newPage) {
      newPage.onFirstRendering();
    }
    this.currentPageValue = newPage;
    if (!!newPage) {
      newPage.updateCustomWidgets();
      newPage.setWasShown(true);
    }
    this.locStrsChanged();
    this.currentPageChanged(newPage, oldValue);
  }
  private getPageByObject(value: any): PageModel {
    if (!value) return null;
    if (value.getType && value.getType() == "page") return value;
    if (typeof value === "string" || value instanceof String)
      return this.getPageByName(String(value));
    if (!isNaN(value)) {
      var index = Number(value);
      var vPages = this.visiblePages;
      if (value < 0 || value >= vPages.length) return null;
      return vPages[index];
    }
    return value;
  }
  /**
   * The zero-based index of the current page in the visible pages array.
   */
  public get currentPageNo(): number {
    return this.visiblePages.indexOf(this.currentPage);
  }
  public set currentPageNo(value: number) {
    var vPages = this.visiblePages;
    if (value < 0 || value >= vPages.length) return;
    this.currentPage = vPages[value];
  }
  /**
   * Gets or sets the question display order. Use this property to randomize questions. You can randomize questions on a specific page.
   *
   * The following options are available:
   *
   * - `random` - randomize questions
   * - `initial` - keep questions in the same order, as in a survey model.
   * @see SurveyPage.questionsOrder
   */
  public get questionsOrder() {
    return this.getPropertyValue("questionsOrder");
  }
  public set questionsOrder(val: string) {
    this.setPropertyValue("questionsOrder", val);
  }

  /**
   * Sets the input focus to the first question with the input field.
   */
  public focusFirstQuestion() {
    var page = this.currentPage;
    if (page) {
      page.scrollToTop();
      page.focusFirstQuestion();
    }
  }
  scrollToTopOnPageChange() {
    var page = this.currentPage;
    if (!page) return;
    page.scrollToTop();
    if (this.focusFirstQuestionAutomatic) {
      page.focusFirstQuestion();
    }
  }
  /**
   * Returns the current survey state:
   *
   * - `loading` - loading from the JSON,
   * - `completed` - a user has completed the survey,
   * - `starting` - the started page is showing,
   * - `running` - a user answers questions right now,
   * - `empty` - there is nothing to show in the current survey.
   */
  public get state(): string {
    if (this.isLoading) return "loading";
    if (this.isCompleted) return "completed";
    if (this.isCompletedBefore) return "completedbefore";
    if (
      !this.isDesignMode &&
      this.isEditMode &&
      this.isStartedState &&
      this.startedPage
    )
      return "starting";
    if (this.isShowingPreview) return this.currentPage ? "preview" : "empty";
    return this.currentPage ? "running" : "empty";
  }
  private get isCompleted(): boolean {
    return this.getPropertyValue("isCompleted", false);
  }
  private set isCompleted(val: boolean) {
    this.setPropertyValue("isCompleted", val);
  }
  private get isShowingPreview(): boolean {
    return this.getPropertyValue("isShowingPreview", false);
  }
  private set isShowingPreview(val: boolean) {
    if (this.isShowingPreview == val) return;
    this.setPropertyValue("isShowingPreview", val);
    this.onShowingPreviewChanged();
  }
  private get isStartedState(): boolean {
    return this.getPropertyValue("isStartedState", false);
  }
  private set isStartedState(val: boolean) {
    this.setPropertyValue("isStartedState", val);
  }
  private get isCompletedBefore(): boolean {
    return this.getPropertyValue("isCompletedBefore", false);
  }
  private set isCompletedBefore(val: boolean) {
    this.setPropertyValue("isCompletedBefore", val);
  }
  private get isLoading(): boolean {
    return this.getPropertyValue("isLoading", false);
  }
  private set isLoading(val: boolean) {
    this.setPropertyValue("isLoading", val);
  }

  public get completedState(): string {
    return this.completedStateValue;
  }
  get completedStateText(): string {
    return this.completedStateTextValue;
  }
  protected setCompletedState(value: string, text: string) {
    this.completedStateValue = value;
    if (!text) {
      if (value == "saving") text = this.getLocString("savingData");
      if (value == "error") text = this.getLocString("savingDataError");
      if (value == "success") text = this.getLocString("savingDataSuccess");
    }
    this.completedStateTextValue = text;
  }
  /**
   * Clears the survey data and state. If the survey has a `completed` state, it will get a `running` state.
   * @param clearData clear the data
   * @param gotoFirstPage make the first page as a current page.
   * @see data
   * @see state
   * @see currentPage
   */
  public clear(clearData: boolean = true, gotoFirstPage: boolean = true) {
    if (clearData) {
      this.data = null;
      this.variablesHash = {};
    }
    this.timeSpent = 0;
    for (var i = 0; i < this.pages.length; i++) {
      this.pages[i].timeSpent = 0;
      this.pages[i].setWasShown(false);
    }
    this.isCompleted = false;
    this.isCompletedBefore = false;
    this.isLoading = false;
    this.isStartedState = this.firstPageIsStarted;
    if (gotoFirstPage && this.visiblePageCount > 0) {
      this.currentPage = this.visiblePages[0];
    }
    if (clearData) {
      this.updateValuesWithDefaults();
    }
  }
  public mergeValues(src: any, dest: any) {
    if (!dest || !src) return;
    for (var key in src) {
      var value = src[key];
      if (value && typeof value === "object") {
        if (!dest[key]) dest[key] = {};
        this.mergeValues(value, dest[key]);
      } else {
        dest[key] = value;
      }
    }
  }
  private updateValuesWithDefaults() {
    if (this.isDesignMode || this.isLoading) return;
    for (var i = 0; i < this.pages.length; i++) {
      var questions = this.pages[i].questions;
      for (var j = 0; j < questions.length; j++) {
        questions[j].updateValueWithDefaults();
      }
    }
  }
  protected updateCustomWidgets(page: PageModel) {
    if (!page) return;
    page.updateCustomWidgets();
  }
  protected currentPageChanging(newValue: PageModel, oldValue: PageModel) {
    var options = {
      oldCurrentPage: oldValue,
      newCurrentPage: newValue,
      allowChanging: true,
      isNextPage: this.isNextPage(newValue, oldValue),
      isPrevPage: this.isPrevPage(newValue, oldValue),
    };
    this.onCurrentPageChanging.fire(this, options);
    return options.allowChanging;
  }
  protected currentPageChanged(newValue: PageModel, oldValue: PageModel) {
    this.onCurrentPageChanged.fire(this, {
      oldCurrentPage: oldValue,
      newCurrentPage: newValue,
      isNextPage: this.isNextPage(newValue, oldValue),
      isPrevPage: this.isPrevPage(newValue, oldValue),
    });
  }
  private isNextPage(newValue: PageModel, oldValue: PageModel): boolean {
    if (!newValue || !oldValue) return false;
    return newValue.visibleIndex == oldValue.visibleIndex + 1;
  }
  private isPrevPage(newValue: PageModel, oldValue: PageModel): boolean {
    if (!newValue || !oldValue) return false;
    return newValue.visibleIndex + 1 == oldValue.visibleIndex;
  }
  /**
   * Returns the progress that a user made while going through the survey.
   */
  public getProgress(): number {
    if (this.currentPage == null) return 0;
    if (this.progressBarType === "questions") {
      var questions = this.getQuestionsWithInput();
      var answeredQuestionsCount = questions.reduce(
        (a: number, b: Question) => a + (b.isEmpty() ? 0 : 1),
        0
      );
      return Math.ceil((answeredQuestionsCount * 100) / questions.length);
    }
    if (this.progressBarType === "correctQuestions") {
      var questions = this.getQuestionsWithInput();
      var correctAnswersCount = this.getCorrectedAnswerCount();
      return Math.ceil((correctAnswersCount * 100) / questions.length);
    }
    var index = this.visiblePages.indexOf(this.currentPage) + 1;
    return Math.ceil((index * 100) / this.visiblePageCount);
  }
  private getQuestionsWithInput(): Array<Question> {
    var allQuestions = this.getAllQuestions();
    var questions = new Array<Question>();
    for (var i = 0; i < allQuestions.length; i++) {
      if (allQuestions[i].hasInput) {
        questions.push(allQuestions[i]);
      }
    }
    return questions;
  }
  /**
   * Returns the navigation buttons (i.e., 'Prev', 'Next', or 'Complete') position.
   */
  public get isNavigationButtonsShowing(): string {
    if (this.isDesignMode) return "none";
    var page = this.currentPage;
    if (!page) return "none";
    if (page.navigationButtonsVisibility === "show") {
      return "bottom";
    }
    if (page.navigationButtonsVisibility === "hide") {
      return "none";
    }
    return this.showNavigationButtons;
  }
  /**
   * Returns `true` if the survey is in edit mode.
   * @see mode
   */
  public get isEditMode(): boolean {
    return this.mode == "edit";
  }
  public get isCompleteButtonVisible(): boolean {
    return (
      this.isEditMode &&
      (!this.isShowPreviewBeforeComplete || this.state == "preview")
    );
  }
  public get isPreviewButtonVisible(): boolean {
    return (
      this.isEditMode &&
      this.isShowPreviewBeforeComplete &&
      this.state == "running"
    );
  }
  public get isCancelPreviewButtonVisible(): boolean {
    return (
      this.isEditMode &&
      this.isShowPreviewBeforeComplete &&
      this.state == "preview"
    );
  }
  /**
   * Returns `true` if the survey is in display mode or in preview mode.
   * @see mode
   * @see showPreviewBeforeComplete
   */
  public get isDisplayMode(): boolean {
    return this.mode == "display" || this.state == "preview";
  }
  public get isUpdateValueTextOnTyping(): boolean {
    return this.textUpdateMode == "onTyping";
  }
  /**
   * Returns `true` if the survey is in design mode. It is used by SurveyJS Editor.
   * @see setDesignMode
   */
  public get isDesignMode(): boolean {
    return this._isDesignMode;
  }
  private _isDesignMode: boolean = false;
  /**
   * Sets the survey into design mode.
   * @param value use true to set the survey into the design mode.
   */
  public setDesignMode(value: boolean) {
    this._isDesignMode = value;
    this.onQuestionsOnPageModeChanged("standard");
  }
  /**
   * Gets or sets whether to show all elements in the survey, regardless their visibility. The default value is `false`.
   */
  public get showInvisibleElements(): boolean {
    return this.getPropertyValue("showInvisibleElements", false);
  }
  public set showInvisibleElements(val: boolean) {
    var visPages = this.visiblePages;
    this.setPropertyValue("showInvisibleElements", val);
    if (this.isLoadingFromJson) return;
    this.runConditions();
    this.updateAllElementsVisibility(visPages);
  }
  private updateAllElementsVisibility(visPages: Array<PageModel>) {
    for (var i = 0; i < this.pages.length; i++) {
      var page = this.pages[i];
      page.updateElementVisibility();
      if (visPages.indexOf(page) > -1 != page.isVisible) {
        this.onPageVisibleChanged.fire(this, {
          page: page,
          visible: page.isVisible,
        });
      }
    }
  }
  public get areInvisibleElementsShowing(): boolean {
    return this.isDesignMode || this.showInvisibleElements;
  }
  public get areEmptyElementsHidden(): boolean {
    return (
      this.isShowingPreview &&
      this.showPreviewBeforeComplete == "showAnsweredQuestions"
    );
  }
  /**
   * Returns `true`, if a user has already completed the survey in this browser and there is a cookie about it. Survey goes to `completed` state if the function returns `true`.
   * @see cookieName
   * @see setCookie
   * @see deleteCookie
   * @see state
   */
  public get hasCookie(): boolean {
    if (!this.cookieName) return false;
    var cookies = document.cookie;
    return cookies && cookies.indexOf(this.cookieName + "=true") > -1;
  }
  /**
   * Set the cookie with `cookieName` in user's browser. It is done automatically on survey complete if the `cookieName` property value is not empty.
   * @see cookieName
   * @see hasCookie
   * @see deleteCookie
   */
  public setCookie() {
    if (!this.cookieName) return;
    document.cookie =
      this.cookieName + "=true; expires=Fri, 31 Dec 9999 0:0:0 GMT";
  }
  /**
   * Deletes the cookie with `cookieName` from the browser.
   * @see cookieName
   * @see hasCookie
   * @see setCookie
   */
  public deleteCookie() {
    if (!this.cookieName) return;
    document.cookie = this.cookieName + "=;";
  }
  /**
   * Gets or sets whether the survey must ignore validation like required questions and others, on `nextPage` and `completeLastPage` function calls. The default is `false`.
   * @see nextPage
   * @see completeLastPage
   * @see mode
   */
  public ignoreValidation: boolean = false;
  /**
   * Navigates user to the next page.
   *
   * Returns `false` in the following cases:
   *
   * - if the current page is the last page.
   * - if the current page contains errors (for example, a required question is empty).
   * @see isCurrentPageHasErrors
   * @see prevPage
   * @see completeLastPage
   */
  public nextPage(): boolean {
    if (this.isLastPage) return false;
    return this.doCurrentPageComplete(false);
  }
  private hasErrorsOnNavigate(doComplete: boolean): boolean {
    if (this.ignoreValidation || !this.isEditMode) return false;
    if (this.checkErrorsMode == "onComplete") {
      if (!this.isLastPage) return false;
      if (this.hasErrors(true, true)) return true;
    } else {
      if (this.isCurrentPageHasErrors) return true;
    }
    return this.checkForAsyncQuestionValidation(doComplete);
  }
  private asyncValidationQuesitons: Array<Question>;
  private checkForAsyncQuestionValidation(doComplete: boolean): boolean {
    this.clearAsyncValidationQuesitons();
    var questions: Array<Question> = this.currentPage.questions;
    for (var i = 0; i < questions.length; i++) {
      if (questions[i].isRunningValidators) {
        questions[i].onCompletedAsyncValidators = (hasErrors: boolean) => {
          this.onCompletedAsyncQuestionValidators(doComplete, hasErrors);
        };
        this.asyncValidationQuesitons.push(questions[i]);
      }
    }
    return this.asyncValidationQuesitons.length > 0;
  }
  private clearAsyncValidationQuesitons() {
    if (!!this.asyncValidationQuesitons) {
      var asynQuestions = this.asyncValidationQuesitons;
      for (var i = 0; i < asynQuestions.length; i++) {
        asynQuestions[i].onCompletedAsyncValidators = null;
      }
    }
    this.asyncValidationQuesitons = [];
  }
  private onCompletedAsyncQuestionValidators(
    doComplete: boolean,
    hasErrors: boolean
  ) {
    if (hasErrors) {
      this.clearAsyncValidationQuesitons();
      return;
    }
    var asynQuestions = this.asyncValidationQuesitons;
    for (var i = 0; i < asynQuestions.length; i++) {
      if (asynQuestions[i].isRunningValidators) return;
    }
    this.doCurrentPageCompleteCore(doComplete);
  }
  /**
   * Returns `true`, if the current page contains errors, for example, the required question is empty or a question validation is failed.
   * @see nextPage
   */
  public get isCurrentPageHasErrors(): boolean {
    return this.checkIsCurrentPageHasErrors();
  }
  /**
   * Returns `true`, if any of the survey pages contains errors.
   * @param fireCallback set it to `true`, to show errors in UI.
   * @param focusOnFirstError set it to `true` to focus on the first question that doesn't pass the validation and make the page, where the question is located, the current.
   */
  public hasErrors(
    fireCallback: boolean = true,
    focusOnFirstError: boolean = false
  ): boolean {
    var visPages = this.visiblePages;
    var firstErrorPage = null;
    var res = false;
    for (var i = 0; i < visPages.length; i++) {
      if (visPages[i].hasErrors(fireCallback, focusOnFirstError)) {
        if (!firstErrorPage) firstErrorPage = visPages[i];
        res = true;
      }
    }
    if (focusOnFirstError && !!firstErrorPage) {
      this.currentPage = firstErrorPage;
    }
    return res;
  }
  /**
   * Checks whether survey elements (pages, panels, and questions) have unique question names.
   * You can check for unique names for individual page and panel (and all their elements) or a question.
   * If the parameter is not specified, then a survey checks that all its elements have unique names.
   * @param element page, panel or question, it is `null` by default, that means all survey elements will be checked
   */
  public ensureUniqueNames(element: ISurveyElement = null) {
    if (element == null) {
      for (var i = 0; i < this.pages.length; i++) {
        this.ensureUniqueName(this.pages[i]);
      }
    } else {
      this.ensureUniqueName(element);
    }
  }
  private ensureUniqueName(element: ISurveyElement) {
    if (element.isPage) {
      this.ensureUniquePageName(element);
    }
    if (element.isPanel) {
      this.ensureUniquePanelName(element);
    }
    if (element.isPage || element.isPanel) {
      var elements = (<IPanel>element).elements;
      for (var i = 0; i < elements.length; i++) {
        this.ensureUniqueNames(elements[i]);
      }
    } else {
      this.ensureUniqueQuestionName(element);
    }
  }
  private ensureUniquePageName(element: ISurveyElement) {
    return this.ensureUniqueElementName(
      element,
      (name: string): ISurveyElement => {
        return this.getPageByName(name);
      }
    );
  }
  private ensureUniquePanelName(element: ISurveyElement) {
    return this.ensureUniqueElementName(
      element,
      (name: string): ISurveyElement => {
        return this.getPanelByName(name);
      }
    );
  }
  private ensureUniqueQuestionName(element: ISurveyElement) {
    return this.ensureUniqueElementName(
      element,
      (name: string): ISurveyElement => {
        return this.getQuestionByName(name);
      }
    );
  }
  private ensureUniqueElementName(
    element: ISurveyElement,
    getElementByName: (name: string) => ISurveyElement
  ) {
    var existingElement = getElementByName(element.name);
    if (!existingElement || existingElement == element) return;
    var newName = this.getNewName(element.name);
    while (!!getElementByName(newName)) {
      var newName = this.getNewName(element.name);
    }
    element.name = newName;
  }
  private getNewName(name: string): string {
    var pos = name.length;
    while (pos > 0 && name[pos - 1] >= "0" && name[pos - 1] <= "9") {
      pos--;
    }
    var base = name.substr(0, pos);
    var num = 0;
    if (pos < name.length) {
      num = parseInt(name.substr(pos));
    }
    num++;
    return base + num;
  }
  private checkIsCurrentPageHasErrors(
    isFocuseOnFirstError: boolean = undefined
  ): boolean {
    return this.checkIsPageHasErrors(this.currentPage, isFocuseOnFirstError);
  }
  private checkIsPageHasErrors(
    page: PageModel,
    isFocuseOnFirstError: boolean = undefined
  ): boolean {
    if (isFocuseOnFirstError === undefined) {
      isFocuseOnFirstError = this.focusOnFirstError;
    }
    if (!page) return true;
    var res = page.hasErrors(true, isFocuseOnFirstError);
    this.fireValidatedErrorsOnPage(page);
    return res;
  }
  private fireValidatedErrorsOnPage(page: PageModel) {
    if (this.onValidatedErrorsOnCurrentPage.isEmpty || !page) return;
    var questionsOnPage = page.questions;
    var questions = new Array<Question>();
    var errors = new Array<SurveyError>();
    for (var i = 0; i < questionsOnPage.length; i++) {
      var q = questionsOnPage[i];
      if (q.errors.length > 0) {
        questions.push(q);
        for (var j = 0; j < q.errors.length; j++) {
          errors.push(q.errors[j]);
        }
      }
    }
    this.onValidatedErrorsOnCurrentPage.fire(this, {
      questions: questions,
      errors: errors,
      page: page,
    });
  }
  /**
   * Navigates user to a previous page. If the current page is the first page, `prevPage` returns `false`. `prevPage` does not perform any checks, required questions can be empty.
   * @see isFirstPage
   */
  public prevPage(): boolean {
    if (this.isFirstPage) return false;
    var vPages = this.visiblePages;
    var index = vPages.indexOf(this.currentPage);
    this.currentPage = vPages[index - 1];
  }
  /**
   * Completes the survey, if the current page is the last one. It returns `false` if the last page has errors.
   * If the last page has no errors, `completeLastPage` calls `doComplete` and returns `true`.
   * @see isCurrentPageHasErrors
   * @see nextPage
   * @see doComplete
   */
  public completeLastPage(): boolean {
    var res = this.doCurrentPageComplete(true);
    if (res) {
      this.cancelPreview();
    }
    return res;
  }
  /**
   * Show preview for the survey. Go to the "preview" state
   * @see showPreviewBeforeComplete
   * @see cancelPreview
   * @see state
   */
  public showPreview(): boolean {
    if (this.hasErrorsOnNavigate(true)) return false;
    this.isShowingPreview = true;
    return true;
  }
  /**
   * Canel preview and go back to the "running" state.
   * @param curPage - a new current page. If the parameter is underfined then the last page becomes current.
   * @see showPreviewBeforeComplete
   * @see showPreview
   * @see state
   */
  public cancelPreview(curPage: any = null) {
    if (!this.isShowingPreview) return;
    this.isShowingPreview = false;
    if (Helpers.isValueEmpty(curPage) && this.visiblePageCount > 0) {
      curPage = this.visiblePageCount - 1;
    }
    if (curPage !== null) {
      this.currentPage = curPage;
    }
  }
  public cancelPreviewByPage(panel: IPanel): any {
    var pageIndex = this.getVisiblePageIndexByRootPanel(panel);
    this.cancelPreview(pageIndex > -1 ? pageIndex : undefined);
  }
  private getVisiblePageIndexByRootPanel(panel: IPanel): number {
    if (!panel) return -1;
    var panels = this.getAllPanels();
    var index = 0;
    for (var i = 0; i < panels.length; i++) {
      if (panels[i].parent === this.currentPageValue) {
        if (panels[i] == panel) return index;
        index++;
      }
    }
    return -1;
  }
  protected doCurrentPageComplete(doComplete: boolean): boolean {
    if (this.hasErrorsOnNavigate(doComplete)) return false;
    return this.doCurrentPageCompleteCore(doComplete);
  }
  private doCurrentPageCompleteCore(doComplete: boolean): boolean {
    if (this.doServerValidation()) return false;
    if (doComplete) {
      this.doComplete();
    } else {
      this.doNextPage();
    }
    return true;
  }
  /**
   * Obsolete use the `questionsOnPageMode` property instead.
   * @see questionsOnPageMode
   */
  public get isSinglePage(): boolean {
    return this.questionsOnPageMode == "singlePage";
  }
  public set isSinglePage(val: boolean) {
    this.questionsOnPageMode = val ? "singlePage" : "standard";
  }
  /**
   * Gets or sets a value that specifies how the survey combines questions, panels, and pages.
   *
   * The following options are available:
   *
   * - `singlePage` - combine all survey pages in a single page. Pages will be converted to panels.
   * - `questionPerPage` - show one question per page. Survey will create a separate page for every question.
   */
  public get questionsOnPageMode(): string {
    return this.getPropertyValue("questionsOnPageMode", "standard");
  }
  public set questionsOnPageMode(val: string) {
    this.setPropertyValue("questionsOnPageMode", val);
  }
  /**
   * Gets or sets whether the first survey page is a start page. Set this property to `true`, to make the first page a starting page.
   * An end user cannot navigate to the start page and the start page does not affect a survey progress.
   */
  public get firstPageIsStarted(): boolean {
    return this.getPropertyValue("firstPageIsStarted", false);
  }
  public set firstPageIsStarted(val: boolean) {
    this.setPropertyValue("firstPageIsStarted", val);
  }
  isPageStarted(page: IPage): boolean {
    return (
      this.firstPageIsStarted && this.pages.length > 0 && this.pages[0] === page
    );
  }
  /**
   * Set this property to "showAllQuestions" or "showAnsweredQuestions" to preview results to a user before he/she completes the survey.
   */
  public get showPreviewBeforeComplete(): string {
    return this.getPropertyValue("showPreviewBeforeComplete", "noPreview");
  }
  public set showPreviewBeforeComplete(val: string) {
    this.setPropertyValue("showPreviewBeforeComplete", val);
  }
  public get isShowPreviewBeforeComplete(): boolean {
    var preview = this.showPreviewBeforeComplete;
    return preview == "showAllQuestions" || preview == "showAnsweredQuestions";
  }
  protected onFirstPageIsStartedChanged() {
    if (this.pages.length == 0) return;
    this.isStartedState = this.firstPageIsStarted;
    this.pageVisibilityChanged(this.pages[0], !this.firstPageIsStarted);
  }
  runningPages: any = null;
  private onShowingPreviewChanged() {
    if (this.isDesignMode) return;
    if (this.isShowingPreview) {
      this.runningPages = this.pages.slice(0, this.pages.length);
      this.setupPagesForPageModes(true);
    } else {
      if (this.runningPages) {
        this.restoreOrigionalPages(this.runningPages);
      }
      this.runningPages = null;
    }
    this.updateAllElementsVisibility(this.pages);
    this.updateVisibleIndexes();
    this.currentPageNo = 0;
  }
  origionalPages: any = null;
  protected onQuestionsOnPageModeChanged(oldValue: string) {
    if (this.isShowingPreview) return;
    if (this.questionsOnPageMode == "standard" || this.isDesignMode) {
      if (this.origionalPages) {
        this.restoreOrigionalPages(this.origionalPages);
      }
      this.origionalPages = null;
    } else {
      if (!oldValue || oldValue == "standard") {
        this.origionalPages = this.pages.slice(0, this.pages.length);
      }
      this.setupPagesForPageModes(this.isSinglePage);
    }
    this.updateVisibleIndexes();
  }
  private restoreOrigionalPages(originalPages: Array<PageModel>) {
    this.questionHashesClear();
    this.pages.splice(0, this.pages.length);
    for (var i = 0; i < originalPages.length; i++) {
      this.pages.push(originalPages[i]);
    }
  }
  private setupPagesForPageModes(isSinglePage: boolean) {
    this.questionHashesClear();
    var startIndex = this.firstPageIsStarted ? 1 : 0;
    super.startLoadingFromJson();
    var newPages = this.createPagesForQuestionOnPageMode(
      isSinglePage,
      startIndex
    );
    var deletedLen = this.pages.length - startIndex;
    this.pages.splice(startIndex, deletedLen);
    for (var i = 0; i < newPages.length; i++) {
      this.pages.push(newPages[i]);
    }
    super.endLoadingFromJson();
    for (var i = 0; i < newPages.length; i++) {
      newPages[i].endLoadingFromJson();
      newPages[i].setSurveyImpl(this);
    }
    this.doElementsOnLoad();
  }
  private createPagesForQuestionOnPageMode(
    isSinglePage: boolean,
    startIndex: number
  ): Array<PageModel> {
    if (isSinglePage) {
      return [this.createSinglePage(startIndex)];
    }
    return this.createPagesForEveryQuestion(startIndex);
  }
  private createSinglePage(startIndex: number): PageModel {
    var single = this.createNewPage("all");
    single.setSurveyImpl(this);
    for (var i = startIndex; i < this.pages.length; i++) {
      var page = this.pages[i];
      var panel = Serializer.createClass("panel");
      single.addPanel(panel);
      var json = new JsonObject().toJsonObject(page);
      new JsonObject().toObject(json, panel);
      if (!this.showPageTitles) {
        panel.title = "";
      }
    }
    return single;
  }
  private createPagesForEveryQuestion(startIndex: number): Array<PageModel> {
    var res: Array<PageModel> = [];
    for (var i = startIndex; i < this.pages.length; i++) {
      var originalPage = this.pages[i];
      // Initialize randomization
      originalPage.setWasShown(true);
      for (var j = 0; j < originalPage.elements.length; j++) {
        var originalElement = originalPage.elements[j];
        var element = Serializer.createClass(originalElement.getType());
        if (!element) continue;
        var jsonObj = new JsonObject();
        //Deserialize page properties only, excluding elements
        jsonObj.lightSerializing = true;
        var pageJson = jsonObj.toJsonObject(originalPage);

        var page = <PageModel>Serializer.createClass(originalPage.getType());
        page.fromJSON(pageJson);
        page.name = "page" + (res.length + 1);
        page.setSurveyImpl(this);
        res.push(page);
        var json = new JsonObject().toJsonObject(originalElement);
        new JsonObject().toObject(json, element);
        page.addElement(element);
      }
    }
    return res;
  }
  /**
   * Gets whether the current page is the first one.
   */
  public get isFirstPage(): boolean {
    if (this.currentPage == null) return true;
    return this.visiblePages.indexOf(this.currentPage) == 0;
  }
  public get isShowPrevButton(): boolean {
    if (this.isFirstPage || !this.showPrevButton) return false;
    var page = this.visiblePages[this.currentPageNo - 1];
    return this.getPageMaxTimeToFinish(page) <= 0;
  }
  /**
   * Gets whether the current page is the last one.
   */
  public get isLastPage(): boolean {
    if (this.currentPage == null) return true;
    var vPages = this.visiblePages;
    return vPages.indexOf(this.currentPage) == vPages.length - 1;
  }
  /**
   * Completes the survey.
   *
   * Calling this function performs the following tasks:
   *
   * - writes cookie if the `cookieName` property is not empty
   * - sets the survey into `completed` state
   * - fires the `onComplete` event
   * - calls `sendResult` function.
   *
   * Calling the `doComplete` function does not perform any validation, unlike the `completeLastPage` function.
   * It calls `navigateToUrl` after calling `onComplete` event.
   * In case calling `options.showDataSaving` callback in the `onComplete` event, `navigateToUrl` is used on calling `options.showDataSavingSuccess` callback.
   * @see completeLastPage
   * @see cookieName
   * @see state
   * @see onComplete
   * @see surveyPostId
   * @see completeLastPage
   * @see navigateToUrl
   * @see navigateToUrlOnCondition
   */
  public doComplete(isCompleteOnTrigger: boolean = false) {
    var onCompletingOptions = {
      allowComplete: true,
      isCompleteOnTrigger: isCompleteOnTrigger,
    };
    this.onCompleting.fire(this, onCompletingOptions);
    if (!onCompletingOptions.allowComplete) return;
    let previousCookie = this.hasCookie;
    this.stopTimer();
    this.setCompleted();
    this.clearUnusedValues();
    this.setCookie();
    var self = this;
    var savingDataStarted = false;
    var onCompleteOptions = {
      isCompleteOnTrigger: isCompleteOnTrigger,
      showDataSaving: function (text: string) {
        savingDataStarted = true;
        self.setCompletedState("saving", text);
      },
      showDataSavingError: function (text: string) {
        self.setCompletedState("error", text);
      },
      showDataSavingSuccess: function (text: string) {
        self.setCompletedState("success", text);
        self.navigateTo();
      },
      showDataSavingClear: function (text: string) {
        self.setCompletedState("", "");
      },
    };
    this.onComplete.fire(this, onCompleteOptions);
    if (!previousCookie && this.surveyPostId) {
      this.sendResult();
    }
    if (!savingDataStarted) {
      this.navigateTo();
    }
  }
  /**
   * Starts the survey. Changes the survey mode from "starting" to "running". Call this function if your survey has a start page, otherwise this function does nothing.
   * @see firstPageIsStarted
   */
  public start(): boolean {
    if (!this.firstPageIsStarted) return false;
    if (this.checkIsPageHasErrors(this.startedPage, true)) return false;
    this.isStartedState = false;
    this.startTimerFromUI();
    this.onStarted.fire(this, {});
    return true;
  }
  /**
   * Gets whether the question values on the current page are validating on the server at the current moment.
   * @see onServerValidateQuestions
   */
  public get isValidatingOnServer(): boolean {
    return this.getPropertyValue("isValidatingOnServer", false);
  }
  private setIsValidatingOnServer(val: boolean) {
    if (val == this.isValidatingOnServer) return;
    this.setPropertyValue("isValidatingOnServer", val);
    this.onIsValidatingOnServerChanged();
  }
  protected onIsValidatingOnServerChanged() {}
  protected doServerValidation(): boolean {
    if (
      !this.onServerValidateQuestions ||
      this.onServerValidateQuestions.isEmpty
    )
      return false;
    var self = this;
    var options = {
      data: <{ [index: string]: any }>{},
      errors: {},
      survey: this,
      complete: function () {
        self.completeServerValidation(options);
      },
    };
    for (var i = 0; i < this.currentPage.questions.length; i++) {
      var question = this.currentPage.questions[i];
      if (!question.visible) continue;
      var value = this.getValue(question.getValueName());
      if (!this.isValueEmpty(value))
        options.data[question.getValueName()] = value;
    }
    this.setIsValidatingOnServer(true);

    if (typeof this.onServerValidateQuestions === "function") {
      this.onServerValidateQuestions(this, options);
    } else {
      this.onServerValidateQuestions.fire(this, options);
    }

    return true;
  }
  private completeServerValidation(options: any) {
    this.setIsValidatingOnServer(false);
    if (!options && !options.survey) return;
    var self = options.survey;
    var hasErrors = false;
    if (options.errors) {
      for (var name in options.errors) {
        var question = self.getQuestionByName(name);
        if (question && question["errors"]) {
          hasErrors = true;
          question["addError"](new CustomError(options.errors[name], this));
        }
      }
    }
    if (!hasErrors) {
      if (self.isLastPage) self.doComplete();
      else self.doNextPage();
    }
  }
  protected doNextPage() {
    this.checkOnPageTriggers();
    if (!this.isCompleted) {
      if (this.sendResultOnPageNext) {
        this.sendResult(this.surveyPostId, this.clientId, true);
      }
      var vPages = this.visiblePages;
      var index = vPages.indexOf(this.currentPage);
      this.currentPage = vPages[index + 1];
    } else {
      this.doComplete(true);
    }
  }
  public setCompleted() {
    this.isCompleted = true;
  }
  /**
   * Returns the HTML content for the complete page.
   * @see completedHtml
   */
  public get processedCompletedHtml(): string {
    var html = this.renderedCompletedHtml;
    if (html) {
      return this.processHtml(html);
    }
    return "<h3>" + this.getLocString("completingSurvey") + "</h3>";
  }
  /**
   * Returns the HTML content, that is shown to a user that had completed the survey before.
   * @see completedHtml
   * @see cookieName
   */
  public get processedCompletedBeforeHtml(): string {
    if (this.completedBeforeHtml) {
      return this.processHtml(this.completedBeforeHtml);
    }
    return "<h3>" + this.getLocString("completingSurveyBefore") + "</h3>";
  }
  /**
   * Returns the HTML content, that is shows when a survey loads the survey JSON.
   */
  public get processedLoadingHtml(): string {
    if (this.loadingHtml) {
      return this.processHtml(this.loadingHtml);
    }
    return "<h3>" + this.getLocString("loadingSurvey") + "</h3>";
  }
  /**
   * Returns the text for the current progress.
   */
  public get progressText(): string {
    if (this.currentPage == null) return "";
    if (this.progressBarType === "questions") {
      var questions = this.getQuestionsWithInput();
      var answeredQuestionsCount = questions.reduce(
        (a: number, b: Question) => a + (b.isEmpty() ? 0 : 1),
        0
      );
      return this.getLocString("questionsProgressText")["format"](
        answeredQuestionsCount,
        questions.length
      );
    }
    if (this.progressBarType === "correctQuestions") {
      var questions = this.getQuestionsWithInput();
      var correctAnswersCount = this.getCorrectedAnswerCount();
      return this.getLocString("questionsProgressText")["format"](
        correctAnswersCount,
        questions.length
      );
    }
    var vPages = this.visiblePages;
    var index = vPages.indexOf(this.currentPage) + 1;
    return this.getLocString("progressText")["format"](index, vPages.length);
  }
  protected afterRenderSurvey(htmlElement: any) {
    this.onAfterRenderSurvey.fire(this, {
      survey: this,
      htmlElement: htmlElement,
    });
  }
  updateQuestionCssClasses(question: IQuestion, cssClasses: any) {
    this.onUpdateQuestionCssClasses.fire(this, {
      question: question,
      cssClasses: cssClasses,
    });
  }
  updatePanelCssClasses(panel: IPanel, cssClasses: any) {
    this.onUpdatePanelCssClasses.fire(this, {
      panel: panel,
      cssClasses: cssClasses,
    });
  }
  updatePageCssClasses(page: IPage, cssClasses: any) {
    this.onUpdatePageCssClasses.fire(this, {
      page: page,
      cssClasses: cssClasses,
    });
  }
  afterRenderPage(htmlElement: any) {
    if (this.onAfterRenderPage.isEmpty) return;
    this.onAfterRenderPage.fire(this, {
      page: this.currentPage,
      htmlElement: htmlElement,
    });
  }
  afterRenderHeader(htmlElement: any) {
    if (this.onAfterRenderHeader.isEmpty) return;
    this.onAfterRenderHeader.fire(this, {
      htmlElement: htmlElement,
    });
  }
  afterRenderQuestion(question: IQuestion, htmlElement: any) {
    this.onAfterRenderQuestion.fire(this, {
      question: question,
      htmlElement: htmlElement,
    });
  }
  afterRenderQuestionInput(question: IQuestion, htmlElement: any) {
    if (this.onAfterRenderQuestionInput.isEmpty) return;
    let id = (<Question>question).inputId;
    if (!!id && htmlElement.id !== id && typeof document !== "undefined") {
      let el = document.getElementById(id);
      if (!!el) {
        htmlElement = el;
      }
    }
    this.onAfterRenderQuestionInput.fire(this, {
      question: question,
      htmlElement: htmlElement,
    });
  }
  afterRenderPanel(panel: IElement, htmlElement: any) {
    this.onAfterRenderPanel.fire(this, {
      panel: panel,
      htmlElement: htmlElement,
    });
  }
  matrixBeforeRowAdded(options: any) {
    this.onMatrixBeforeRowAdded.fire(this, options);
  }
  matrixRowAdded(question: IQuestion, row: any) {
    this.onMatrixRowAdded.fire(this, { question: question, row: row });
  }
  getQuestionByValueNameFromArray(
    valueName: string,
    name: string,
    index: number
  ): IQuestion {
    var questions = this.getQuestionsByValueNameCore(valueName);
    if (!questions) return;
    for (var i = 0; i < questions.length; i++) {
      var res = questions[i].getQuestionFromArray(name, index);
      if (!!res) return res;
    }
    return null;
  }
  matrixRowRemoved(question: IQuestion, rowIndex: number, row: any) {
    this.onMatrixRowRemoved.fire(this, {
      question: question,
      rowIndex: rowIndex,
      row: row,
    });
  }
  matrixAllowRemoveRow(
    question: IQuestion,
    rowIndex: number,
    row: any
  ): boolean {
    var options = {
      question: question,
      rowIndex: rowIndex,
      row: row,
      allow: true,
    };
    this.onMatrixAllowRemoveRow.fire(this, options);
    return options.allow;
  }
  matrixCellCreated(question: IQuestion, options: any) {
    options.question = question;
    this.onMatrixCellCreated.fire(this, options);
  }
  matrixAfterCellRender(question: IQuestion, options: any) {
    options.question = question;
    this.onMatrixAfterCellRender.fire(this, options);
  }
  matrixCellValueChanged(question: IQuestion, options: any) {
    options.question = question;
    this.onMatrixCellValueChanged.fire(this, options);
  }
  matrixCellValueChanging(question: IQuestion, options: any) {
    options.question = question;
    this.onMatrixCellValueChanging.fire(this, options);
  }
  matrixCellValidate(question: IQuestion, options: any): SurveyError {
    options.question = question;
    this.onMatrixCellValidate.fire(this, options);
    return options.error ? new CustomError(options.error, this) : null;
  }
  dynamicPanelAdded(question: IQuestion) {
    this.onDynamicPanelAdded.fire(this, { question: question });
  }
  dynamicPanelRemoved(question: IQuestion, panelIndex: number, panel: IPanel) {
    var questions = !!panel ? (<PanelModelBase>panel).questions : [];
    for (var i = 0; i < questions.length; i++) {
      questions[i].clearOnDeletingContainer();
    }
    this.onDynamicPanelRemoved.fire(this, {
      question: question,
      panelIndex: panelIndex,
      panel: panel,
    });
  }
  dynamicPanelItemValueChanged(question: IQuestion, options: any) {
    options.question = question;
    this.onDynamicPanelItemValueChanged.fire(this, options);
  }
  dragAndDropAllow(options: any): boolean {
    options.allow = true;
    this.onDragDropAllow.fire(this, options);
    return options.allow;
  }

  scrollElementToTop(
    element: ISurveyElement,
    question: IQuestion,
    page: IPage,
    id: string
  ): any {
    var options = {
      element: element,
      question: question,
      page: page,
      elementId: id,
      cancel: false,
    };
    this.onScrollingElementToTop.fire(this, options);
    if (!options.cancel) {
      SurveyElement.ScrollElementToTop(options.elementId);
    }
  }

  /**
   * Uploads a file to server.
   * @param question a file question object
   * @param name a question name
   * @param file an uploaded file
   * @param storeDataAsText set it to `true` to encode file content into the survey results
   * @param uploadingCallback a call back function to get the status on uploading the file
   */
  public uploadFiles(
    question: IQuestion,
    name: string,
    files: File[],
    uploadingCallback: (status: string, data: any) => any
  ) {
    if (this.onUploadFiles.isEmpty) {
      uploadingCallback("error", files);
    } else {
      this.onUploadFiles.fire(this, {
        question: question,
        name: name,
        files: files || [],
        callback: uploadingCallback,
      });
    }
    if (this.surveyPostId) {
      this.uploadFilesCore(name, files, uploadingCallback);
    }
  }
  /**
   * Downloads a file from server
   * @param name a question name
   * @param fileValue a single file question value
   * @param callback a call back function to get the status on downloading the file and the downloaded file content
   */
  public downloadFile(
    questionName: string,
    fileValue: any,
    callback: (status: string, data: any) => any
  ) {
    if (this.onDownloadFile.isEmpty) {
      !!callback && callback("success", fileValue.content || fileValue);
    }
    this.onDownloadFile.fire(this, {
      name: questionName,
      content: fileValue.content || fileValue,
      fileValue: fileValue,
      callback: callback,
    });
  }
  /**
   * Clears files from server.
   * @param name a question name
   * @param value a file question value
   * @param callback a call back function to get the status of the clearing operation
   */
  public clearFiles(
    name: string,
    value: any,
    fileName: string,
    callback: (status: string, data: any) => any
  ) {
    if (this.onClearFiles.isEmpty) {
      !!callback && callback("success", value);
    }
    this.onClearFiles.fire(this, {
      name: name,
      value: value,
      fileName: fileName,
      callback: callback,
    });
  }
  updateChoicesFromServer(
    question: IQuestion,
    choices: Array<ItemValue>,
    serverResult: any
  ): Array<ItemValue> {
    var options = {
      question: question,
      choices: choices,
      serverResult: serverResult,
    };
    this.onLoadChoicesFromServer.fire(this, options);
    return options.choices;
  }

  protected createSurveyService(): dxSurveyService {
    return new dxSurveyService();
  }
  protected uploadFilesCore(
    name: string,
    files: File[],
    uploadingCallback: (status: string, data: any) => any
  ) {
    var responses: Array<any> = [];
    files.forEach((file) => {
      if (uploadingCallback) uploadingCallback("uploading", file);
      this.createSurveyService().sendFile(
        this.surveyPostId,
        file,
        (success: boolean, response: any) => {
          if (success) {
            responses.push({ content: response, file: file });
            if (responses.length === files.length) {
              if (uploadingCallback) uploadingCallback("success", responses);
            }
          } else {
            if (uploadingCallback)
              uploadingCallback("error", { response: response, file: file });
          }
        }
      );
    });
  }
  getPage(index: number): PageModel {
    return this.pages[index];
  }
  /**
   * Adds an existing page to the survey.
   * @param page a newly added page
   * @see addNewPage
   */
  public addPage(page: PageModel) {
    if (page == null) return;
    this.pages.push(page);
    this.updateVisibleIndexes();
  }
  /**
   * Creates a new page and adds it to a survey. Generates a new name if the `name` parameter is not specified.
   * @param name a page name
   * @see addPage
   */
  public addNewPage(name: string = null) {
    var page = this.createNewPage(name);
    this.addPage(page);
    return page;
  }
  /**
   * Removes a page from a survey.
   * @param page
   */
  public removePage(page: PageModel) {
    var index = this.pages.indexOf(page);
    if (index < 0) return;
    this.pages.splice(index, 1);
    if (this.currentPageValue == page) {
      this.currentPage = this.pages.length > 0 ? this.pages[0] : null;
    }
    this.updateVisibleIndexes();
  }
  /**
   * Returns a question by its name.
   * @param name a question name
   * @param caseInsensitive
   * @see getQuestionByValueName
   */
  public getQuestionByName(
    name: string,
    caseInsensitive: boolean = false
  ): Question {
    if (!name) return null;
    if (caseInsensitive) {
      name = name.toLowerCase();
    }
    var hash: HashTable<any> = !!caseInsensitive
      ? this.questionHashes.namesInsensitive
      : this.questionHashes.names;
    var res = hash[name];
    if (!res) return null;
    return res[0];
  }
  /**
   * Returns a question by its value name
   * @param valueName a question name
   * @param caseInsensitive
   * @see getQuestionByName
   * @see Question.valueName
   */
  public getQuestionByValueName(
    valueName: string,
    caseInsensitive: boolean = false
  ): IQuestion {
    var res = this.getQuestionsByValueNameCore(valueName, caseInsensitive);
    return !!res ? res[0] : null;
  }
  private getQuestionsByValueNameCore(
    valueName: string,
    caseInsensitive: boolean = false
  ): Array<Question> {
    var hash: HashTable<any> = !!caseInsensitive
      ? this.questionHashes.valueNamesInsensitive
      : this.questionHashes.valueNames;
    var res = hash[valueName];
    if (!res) return null;
    return res;
  }
  /**
   * Gets a list of questions by their names.
   * @param names an array of question names
   * @param caseInsensitive
   */
  public getQuestionsByNames(
    names: string[],
    caseInsensitive: boolean = false
  ): IQuestion[] {
    var result: IQuestion[] = [];
    if (!names) return result;
    for (var i: number = 0; i < names.length; i++) {
      if (!names[i]) continue;
      var question = this.getQuestionByName(names[i], caseInsensitive);
      if (question) result.push(question);
    }
    return result;
  }
  /**
   * Returns a page on which an element (question or panel) is placed.
   * @param element Question or Panel
   */
  public getPageByElement(element: IElement): PageModel {
    for (var i: number = 0; i < this.pages.length; i++) {
      var page = this.pages[i];
      if (page.containsElement(element)) return page;
    }
    return null;
  }
  /**
   * Returns a page on which a question is located.
   * @param question
   */
  public getPageByQuestion(question: IQuestion): PageModel {
    return this.getPageByElement(question);
  }
  /**
   * Returns a page by it's name.
   * @param name
   */
  public getPageByName(name: string): PageModel {
    for (var i: number = 0; i < this.pages.length; i++) {
      if (this.pages[i].name == name) return this.pages[i];
    }
    return null;
  }
  /**
   * Returns a list of pages by their names.
   * @param names a list of page names
   */
  public getPagesByNames(names: string[]): PageModel[] {
    var result: PageModel[] = [];
    if (!names) return result;
    for (var i: number = 0; i < names.length; i++) {
      if (!names[i]) continue;
      var page = this.getPageByName(names[i]);
      if (page) result.push(page);
    }
    return result;
  }
  /**
   * Returns a list of all questions in a survey.
   * @param visibleOnly set it `true`, if you want to get only visible questions
   */
  public getAllQuestions(
    visibleOnly: boolean = false,
    includingDesignTime: boolean = false
  ): Array<Question> {
    var result = new Array<Question>();
    for (var i: number = 0; i < this.pages.length; i++) {
      this.pages[i].addQuestionsToList(
        result,
        visibleOnly,
        includingDesignTime
      );
    }
    return result;
  }
  /**
   * Returns quiz questions. All visible questions that has input(s) widgets.
   * @see getQuizQuestionCount
   */
  public getQuizQuestions(): Array<IQuestion> {
    var result = new Array<IQuestion>();
    var startIndex = this.firstPageIsStarted ? 1 : 0;
    for (var i = startIndex; i < this.pages.length; i++) {
      if (!this.pages[i].isVisible) continue;
      var questions = this.pages[i].questions;
      for (var j = 0; j < questions.length; j++) {
        var q = questions[j];
        if (q.quizQuestionCount > 0) {
          result.push(q);
        }
      }
    }
    return result;
  }
  /**
   * Returns a panel by its name.
   * @param name a panel name
   * @param caseInsensitive
   * @see getQuestionByName
   */
  public getPanelByName(
    name: string,
    caseInsensitive: boolean = false
  ): IPanel {
    var panels = this.getAllPanels();
    if (caseInsensitive) name = name.toLowerCase();
    for (var i: number = 0; i < panels.length; i++) {
      var panelName = panels[i].name;
      if (caseInsensitive) panelName = panelName.toLowerCase();
      if (panelName == name) return panels[i];
    }
    return null;
  }
  /**
   * Returns a list of all survey's panels.
   */
  public getAllPanels(
    visibleOnly: boolean = false,
    includingDesignTime: boolean = false
  ): Array<IPanel> {
    var result = new Array<IPanel>();
    for (var i: number = 0; i < this.pages.length; i++) {
      this.pages[i].addPanelsIntoList(result, visibleOnly, includingDesignTime);
    }
    return result;
  }
  protected createNewPage(name: string) {
    return new PageModel(name);
  }
  protected questionOnValueChanging(valueName: string, newValue: any): any {
    if (this.onValueChanging.isEmpty) return newValue;
    var options = {
      name: valueName,
      question: this.getQuestionByValueName(valueName),
      value: newValue,
      oldValue: this.getValue(valueName),
    };
    this.onValueChanging.fire(this, options);
    return options.value;
  }
  protected updateQuestionValue(valueName: string, newValue: any) {
    if (this.isLoadingFromJson) return;
    var questions = this.getQuestionsByValueNameCore(valueName);
    if (!!questions) {
      for (var i: number = 0; i < questions.length; i++) {
        if (this.isTwoValueEquals(questions[i].value, newValue)) continue;
        questions[i].updateValueFromSurvey(newValue);
      }
    }
  }
  protected notifyQuestionOnValueChanged(valueName: string, newValue: any) {
    if (this.isLoadingFromJson) return;
    var questions = this.getQuestionsByValueNameCore(valueName);
    if (!!questions) {
      for (var i: number = 0; i < questions.length; i++) {
        var question = questions[i];
        if (this.checkErrorsMode == "onValueChanged") {
          var oldErrorCount = question.errors.length;
          question.hasErrors(true, { isOnValueChanged: true });
          if (oldErrorCount > 0 || question.errors.length > 0) {
            this.fireValidatedErrorsOnPage(<PageModel>question.page);
          }
        }
        question.onSurveyValueChanged(newValue);
        this.onValueChanged.fire(this, {
          name: valueName,
          question: question,
          value: newValue,
        });
      }
    } else {
      this.onValueChanged.fire(this, {
        name: valueName,
        question: null,
        value: newValue,
      });
    }
    this.notifyElementsOnAnyValueOrVariableChanged(valueName);
  }
  private notifyElementsOnAnyValueOrVariableChanged(name: string) {
    if (this.isEndLoadingFromJson === "processing") return;
    for (var i = 0; i < this.pages.length; i++) {
      this.pages[i].onAnyValueChanged(name);
    }
    if (!this.isEndLoadingFromJson) {
      this.locStrsChanged();
    }
  }
  private updateAllQuestionsValue() {
    var questions = this.getAllQuestions();
    for (var i: number = 0; i < questions.length; i++) {
      var q = <Question>questions[i];
      var valName = q.getValueName();
      q.updateValueFromSurvey(this.getValue(valName));
      if (q.requireUpdateCommentValue) {
        q.updateCommentFromSurvey(this.getComment(valName));
      }
    }
  }
  private notifyAllQuestionsOnValueChanged() {
    var questions = this.getAllQuestions();
    for (var i: number = 0; i < questions.length; i++) {
      questions[i].onSurveyValueChanged(
        this.getValue(questions[i].getValueName())
      );
    }
  }
  private checkOnPageTriggers() {
    var questions = this.getCurrentPageQuestions(true);
    var values: { [index: string]: any } = {};
    for (var i = 0; i < questions.length; i++) {
      var question = questions[i];
      var name = question.getValueName();
      values[name] = this.getValue(name);
    }
    this.checkTriggers(values, true);
  }
  private getCurrentPageQuestions(
    includeInvsible: boolean = false
  ): Array<Question> {
    var result: Array<Question> = [];
    var page = this.currentPage;
    if (!page) return result;
    for (var i = 0; i < page.questions.length; i++) {
      var question = page.questions[i];
      if ((!includeInvsible && !question.visible) || !question.name) continue;
      result.push(question);
    }
    return result;
  }
  private isTriggerIsRunning: boolean = false;
  private checkTriggers(key: any, isOnNextPage: boolean) {
    if (
      this.isCompleted ||
      this.triggers.length == 0 ||
      this.isTriggerIsRunning
    )
      return;
    this.isTriggerIsRunning = true;
    var values = this.getFilteredValues();
    var properties = this.getFilteredProperties();
    for (var i: number = 0; i < this.triggers.length; i++) {
      var trigger = this.triggers[i];
      if (trigger.isOnNextPage == isOnNextPage) {
        trigger.checkExpression(key, values, properties);
      }
    }
    this.isTriggerIsRunning = false;
  }
  private doElementsOnLoad() {
    for (var i = 0; i < this.pages.length; i++) {
      this.pages[i].onSurveyLoad();
    }
  }
  private runConditions() {
    if (this.isCompleted || this.isEndLoadingFromJson === "processing") return;
    var pages = this.pages;
    var values = this.getFilteredValues();
    var properties = this.getFilteredProperties();
    var oldCurrentPageIndex = this.pages.indexOf(this.currentPageValue);
    for (var i = 0; i < this.calculatedValues.length; i++) {
      this.calculatedValues[i].resetCalculation();
    }
    for (var i = 0; i < this.calculatedValues.length; i++) {
      this.calculatedValues[i].doCalculation(
        this.calculatedValues,
        values,
        properties
      );
    }
    for (var i = 0; i < pages.length; i++) {
      pages[i].runCondition(values, properties);
    }
    this.checkIfNewPagesBecomeVisible(oldCurrentPageIndex);
  }
  private checkIfNewPagesBecomeVisible(oldCurrentPageIndex: number) {
    var newCurrentPageIndex = this.pages.indexOf(this.currentPageValue);
    if (newCurrentPageIndex <= oldCurrentPageIndex + 1) return;
    for (var i = oldCurrentPageIndex + 1; i < newCurrentPageIndex; i++) {
      if (this.pages[i].isVisible) {
        this.currentPage = this.pages[i];
        break;
      }
    }
  }
  /**
   * Sends a survey result to the [api.surveyjs.io](https://api.surveyjs.io) service.
   * @param postId [api.surveyjs.io](https://api.surveyjs.io) service postId
   * @param clientId Typically a customer e-mail or an identifier
   * @param isPartialCompleted Set it to `true` if the survey is not completed yet and the results are intermediate
   * @see surveyPostId
   * @see clientId
   */
  public sendResult(
    postId: string = null,
    clientId: string = null,
    isPartialCompleted: boolean = false
  ) {
    if (!this.isEditMode) return;
    if (isPartialCompleted && this.onPartialSend) {
      this.onPartialSend.fire(this, null);
    }

    if (!postId && this.surveyPostId) {
      postId = this.surveyPostId;
    }
    if (!postId) return;
    if (clientId) {
      this.clientId = clientId;
    }
    if (isPartialCompleted && !this.clientId) return;
    var self = this;
    if (this.surveyShowDataSaving) {
      this.setCompletedState("saving", "");
    }
    this.createSurveyService().sendResult(
      postId,
      this.data,
      function (success: boolean, response: any, request: any) {
        if (self.surveyShowDataSaving) {
          if (success) {
            self.setCompletedState("success", "");
          } else {
            self.setCompletedState("error", "");
          }
        }
        self.onSendResult.fire(self, {
          success: success,
          response: response,
          request: request,
        });
      },
      this.clientId,
      isPartialCompleted
    );
  }
  /**
   * Calls the [api.surveyjs.io](https://api.surveyjs.io) service and, on callback, fires the `onGetResult` event with all answers that your users made for a question.
   * @param resultId [api.surveyjs.io](https://api.surveyjs.io) service resultId
   * @param name The question name
   * @see onGetResult
   */
  public getResult(resultId: string, name: string) {
    var self = this;
    this.createSurveyService().getResult(resultId, name, function (
      success: boolean,
      data: any,
      dataList: any[],
      response: any
    ) {
      self.onGetResult.fire(self, {
        success: success,
        data: data,
        dataList: dataList,
        response: response,
      });
    });
  }
  /**
   * Loads the survey JSON from the [api.surveyjs.io](https://api.surveyjs.io) service.
   * If `clientId` is not `null` and a user had completed a survey before, the survey switches to `completedbefore` state.
   * @param surveyId [api.surveyjs.io](https://api.surveyjs.io) service surveyId
   * @param clientId users' indentifier, for example an e-mail or a unique customer id in your web application.
   * @see state
   * @see onLoadedSurveyFromService
   */
  public loadSurveyFromService(
    surveyId: string = null,
    cliendId: string = null
  ) {
    if (surveyId) {
      this.surveyId = surveyId;
    }
    if (cliendId) {
      this.clientId = cliendId;
    }
    var self = this;
    this.isLoading = true;
    this.onLoadingSurveyFromService();
    if (cliendId) {
      this.createSurveyService().getSurveyJsonAndIsCompleted(
        this.surveyId,
        this.clientId,
        function (
          success: boolean,
          json: string,
          isCompleted: string,
          response: any
        ) {
          self.isLoading = false;
          if (success) {
            self.isCompletedBefore = isCompleted == "completed";
            self.loadSurveyFromServiceJson(json);
          }
        }
      );
    } else {
      this.createSurveyService().loadSurvey(this.surveyId, function (
        success: boolean,
        result: string,
        response: any
      ) {
        self.isLoading = false;
        if (success) {
          self.loadSurveyFromServiceJson(result);
        }
      });
    }
  }
  private loadSurveyFromServiceJson(json: any) {
    if (!json) return;
    this.fromJSON(json);
    this.notifyAllQuestionsOnValueChanged();
    this.onLoadSurveyFromService();
    this.onLoadedSurveyFromService.fire(this, {});
  }
  protected onLoadingSurveyFromService() {}
  protected onLoadSurveyFromService() {}
  private updateVisibleIndexes() {
    if (this.isLoadingFromJson || !!this.isEndLoadingFromJson) return;
    this.updatePageVisibleIndexes(this.showPageNumbers);
    if (this.showQuestionNumbers == "onPage") {
      var visPages = this.visiblePages;
      for (var i = 0; i < visPages.length; i++) {
        visPages[i].setVisibleIndex(0);
      }
    } else {
      var index = this.showQuestionNumbers == "on" ? 0 : -1;
      for (var i = 0; i < this.pages.length; i++) {
        index += this.pages[i].setVisibleIndex(index);
      }
    }
  }
  private updatePageVisibleIndexes(showIndex: boolean) {
    var index = 0;
    for (var i = 0; i < this.pages.length; i++) {
      var isPageVisible = this.pages[i].isVisible;
      this.pages[i].visibleIndex = isPageVisible ? index++ : -1;
      this.pages[i].num =
        showIndex && isPageVisible ? this.pages[i].visibleIndex + 1 : -1;
    }
  }
  public fromJSON(json: any) {
    if (!json) return;
    this.questionHashesClear();
    this.jsonErrors = null;
    var jsonConverter = new JsonObject();
    jsonConverter.toObject(json, this);
    if (jsonConverter.errors.length > 0) {
      this.jsonErrors = jsonConverter.errors;
    }
  }
  public setJsonObject(jsonObj: any) {
    this.fromJSON(jsonObj);
  }
  private isEndLoadingFromJson: string = null;
  endLoadingFromJson() {
    this.isEndLoadingFromJson = "processing";
    this.isStartedState = this.firstPageIsStarted;
    this.onQuestionsOnPageModeChanged("standard");
    super.endLoadingFromJson();
    if (this.hasCookie) {
      this.doComplete();
    }
    this.doElementsOnLoad();
    this.isEndLoadingFromJson = "conditions";
    this.runConditions();
    this.notifyElementsOnAnyValueOrVariableChanged("");
    this.isEndLoadingFromJson = null;
    this.updateVisibleIndexes();
  }
  protected onBeforeCreating() {}
  protected onCreating() {}
  private getProcessedTextValue(textValue: TextPreProcessorValue): void {
    this.getProcessedTextValueCore(textValue);
    if (!this.onProcessTextValue.isEmpty) {
      var wasEmpty = this.isValueEmpty(textValue.value);
      this.onProcessTextValue.fire(this, textValue);
      textValue.isExists =
        textValue.isExists || (wasEmpty && !this.isValueEmpty(textValue.value));
    }
  }
  private getProcessedTextValueCore(textValue: TextPreProcessorValue): void {
    var name = textValue.name.toLocaleLowerCase();
    if (["no", "require", "title"].indexOf(name) !== -1) {
      return;
    }
    if (name === "pageno") {
      textValue.isExists = true;
      var page = this.currentPage;
      textValue.value = page != null ? this.visiblePages.indexOf(page) + 1 : 0;
      return;
    }
    if (name === "pagecount") {
      textValue.isExists = true;
      textValue.value = this.visiblePageCount;
      return;
    }
    if (name === "locale") {
      textValue.isExists = true;
      textValue.value = !!this.locale
        ? this.locale
        : surveyLocalization.defaultLocale;
      return;
    }
    if (name === "correctedanswers" || name === "correctedanswercount") {
      textValue.isExists = true;
      textValue.value = this.getCorrectedAnswerCount();
      return;
    }
    if (name === "incorrectedanswers" || name === "incorrectedanswercount") {
      textValue.isExists = true;
      textValue.value = this.getInCorrectedAnswerCount();
      return;
    }
    if (name === "questioncount") {
      textValue.isExists = true;
      textValue.value = this.getQuizQuestionCount();
      return;
    }
    var firstName = new ProcessValue().getFirstName(name, this.data);
    var variable = this.getVariable(name);
    if (variable !== undefined) {
      textValue.isExists = true;
      textValue.value = variable;
      return;
    }
    if (!!firstName) firstName = firstName.toLowerCase();
    var question = this.getQuestionByValueName(firstName, true);
    if (question) {
      textValue.isExists = true;
      name = question.getValueName() + name.substr(firstName.length);
      name = name.toLocaleLowerCase();
      var values: { [index: string]: any } = {};
      values[firstName] = textValue.returnDisplayValue
        ? question.getDisplayValue(false, undefined)
        : question.value;
      textValue.value = new ProcessValue().getValue(name, values);
      return;
    }
    var value = this.getValue(textValue.name);
    if (value !== undefined) {
      textValue.isExists = true;
      textValue.value = value;
    }
  }
  private clearUnusedValues() {
    var questions = this.getAllQuestions();
    for (var i: number = 0; i < questions.length; i++) {
      questions[i].clearUnusedValues();
    }
    if (this.clearInvisibleValues != "none") {
      this.clearInvisibleQuestionValues();
    }
  }
  hasVisibleQuestionByValueName(valueName: string): boolean {
    var questions = this.getQuestionsByValueNameCore(valueName);
    if (!questions) return false;
    for (var i: number = 0; i < questions.length; i++) {
      if (questions[i].isVisible) return true;
    }
    return false;
  }
  questionCountByValueName(valueName: string): number {
    var questions = this.getQuestionsByValueNameCore(valueName);
    return !!questions ? questions.length : 0;
  }
  private clearInvisibleQuestionValues() {
    var questions = this.getAllQuestions();
    for (var i: number = 0; i < questions.length; i++) {
      questions[i].clearValueIfInvisible();
    }
  }
  /**
   * Returns a variable value. Variable, unlike values, are not stored in the survey results.
   * @param name A variable name
   * @see SetVariable
   */
  public getVariable(name: string): any {
    if (!name) return null;
    name = name.toLowerCase();
    var res = this.variablesHash[name];
    if (!Helpers.isValueEmpty(res)) return res;
    if (name.indexOf(".") > -1 || name.indexOf("[") > -1) {
      if (new ProcessValue().hasValue(name, this.variablesHash))
        return new ProcessValue().getValue(name, this.variablesHash);
    }
    return res;
  }
  /**
   * Sets a variable value. Variable, unlike values, are not stored in the survey results.
   * @param name A variable name
   * @param newValue A variable new value
   * @see GetVariable
   */
  public setVariable(name: string, newValue: any) {
    if (!name) return;
    name = name.toLowerCase();
    this.variablesHash[name] = newValue;
    this.notifyElementsOnAnyValueOrVariableChanged(name);
    this.runConditions();
  }
  //ISurvey data
  protected getUnbindValue(value: any): any {
    return Helpers.getUnbindValue(value);
  }
  /**
   * Returns a question value (answer) by a question's name.
   * @param name A question name
   * @see data
   * @see setValue
   */
  public getValue(name: string): any {
    if (!name || name.length == 0) return null;
    var value = this.getDataValueCore(this.valuesHash, name);
    return this.getUnbindValue(value);
  }
  /**
   * Sets a question value (answer). It runs all triggers and conditions (`visibleIf` properties).
   *
   * Goes to the next page if `goNextPageAutomatic` is `true` and all questions on the current page are answered correctly.
   * @param name A question name
   * @param newValue A new question value
   * @see data
   * @see getValue
   * @see PageModel.visibleIf
   * @see Question.visibleIf
   * @see goNextPageAutomatic
   */
  public setValue(
    name: string,
    newQuestionValue: any,
    locNotification: any = false,
    allowNotifyValueChanged: boolean = true
  ) {
    var newValue = newQuestionValue;
    if (allowNotifyValueChanged)
      newValue = this.questionOnValueChanging(name, newQuestionValue);
    if (
      this.isValueEqual(name, newValue) &&
      this.isTwoValueEquals(newValue, newQuestionValue)
    )
      return;
    if (this.isValueEmpty(newValue)) {
      this.deleteDataValueCore(this.valuesHash, name);
    } else {
      newValue = this.getUnbindValue(newValue);
      this.setDataValueCore(this.valuesHash, name, newValue);
    }
    this.updateQuestionValue(name, newValue);
    if (locNotification === true) return;
    var triggerKeys: { [index: string]: any } = {};
    triggerKeys[name] = newValue;
    this.checkTriggers(triggerKeys, false);
    this.runConditions();
    if (allowNotifyValueChanged)
      this.notifyQuestionOnValueChanged(name, newValue);
    if (locNotification !== "text") {
      this.tryGoNextPageAutomatic(name);
    }
  }
  private isValueEqual(name: string, newValue: any): boolean {
    if (newValue === "" || newValue === undefined) newValue = null;
    var oldValue = this.getValue(name);
    if (oldValue === "" || oldValue === undefined) oldValue = null;
    if (newValue === null || oldValue === null) return newValue === oldValue;
    return this.isTwoValueEquals(newValue, oldValue);
  }
  protected doOnPageAdded(page: PageModel) {
    page.setSurveyImpl(this);
    if (!page.name) page.name = this.generateNewName(this.pages, "page");
    this.questionHashesPanelAdded(page);
    var options = { page: page };
    this.onPageAdded.fire(this, options);
  }
  private generateNewName(elements: Array<any>, baseName: string): string {
    var keys: { [index: string]: any } = {};
    for (var i = 0; i < elements.length; i++) keys[elements[i]["name"]] = true;
    var index = 1;
    while (keys[baseName + index]) index++;
    return baseName + index;
  }
  protected tryGoNextPageAutomatic(name: string) {
    if (
      !!this.isEndLoadingFromJson ||
      !this.goNextPageAutomatic ||
      !this.currentPage
    )
      return;
    var question = <Question>this.getQuestionByValueName(name);
    if (
      !question ||
      (!!question &&
        (!question.visible || !question.supportGoNextPageAutomatic()))
    )
      return;
    if (question.hasErrors(false) && !question.supportGoNextPageError()) return;
    var questions = this.getCurrentPageQuestions();
    if (questions.indexOf(question) < 0) return;
    for (var i = 0; i < questions.length; i++) {
      if (questions[i].hasInput && questions[i].isEmpty()) return;
    }
    if (!this.checkIsCurrentPageHasErrors(false)) {
      if (!this.isLastPage) {
        this.nextPage();
      } else {
        if (
          this.goNextPageAutomatic === true &&
          this.allowCompleteSurveyAutomatic
        ) {
          this.completeLastPage();
        }
      }
    }
  }
  /**
   * Returns the comment value.
   * @param name A comment's name.
   * @see setComment
   */
  public getComment(name: string): string {
    var result = this.data[name + this.commentPrefix];
    if (result == null) result = "";
    return result;
  }
  /**
   * Sets a comment value.
   * @param name A comment name.
   * @param newValue A new comment value.
   * @see getComment
   */
  public setComment(
    name: string,
    newValue: string,
    locNotification: any = false
  ) {
    if (!newValue) newValue = "";
    if (Helpers.isTwoValueEquals(newValue, this.getComment(name))) return;
    var commentName = name + this.commentPrefix;
    if (Helpers.isValueEmpty(newValue)) {
      this.deleteDataValueCore(this.valuesHash, commentName);
    } else {
      this.setDataValueCore(this.valuesHash, commentName, newValue);
    }
    var questions = this.getQuestionsByValueNameCore(name);
    if (!!questions) {
      for (var i: number = 0; i < questions.length; i++) {
        questions[i].updateCommentFromSurvey(newValue);
      }
    }
    if (locNotification !== "text") {
      this.tryGoNextPageAutomatic(name);
    }
    var question = this.getQuestionByName(name);
    if (question) {
      this.onValueChanged.fire(this, {
        name: commentName,
        question: question,
        value: newValue,
      });
    }
  }
  /**
   * Removes a value from the survey results.
   * @param {string} name The name of the value. Typically it is a question name.
   */
  public clearValue(name: string) {
    this.setValue(name, null);
    this.setComment(name, null);
  }
  /**
   * Gets or sets whether to clear value on disable items in checkbox, dropdown and radiogroup questions.
   * By default, values are not cleared on disabled the corresponded items. This property is not persisted in survey JSON and you have to set it in code.
   */
  public get clearValueOnDisableItems(): boolean {
    return this.getPropertyValue("clearValueOnDisableItems", false);
  }
  public set clearValueOnDisableItems(val: boolean) {
    this.setPropertyValue("clearValueOnDisableItems", val);
  }
  questionVisibilityChanged(question: IQuestion, newValue: boolean) {
    this.updateVisibleIndexes();
    this.onVisibleChanged.fire(this, {
      question: question,
      name: question.name,
      visible: newValue,
    });
    if (
      question &&
      !question.visible &&
      this.clearInvisibleValues == "onHidden"
    ) {
      question.clearValue();
    }
  }
  pageVisibilityChanged(page: IPage, newValue: boolean) {
    this.updateVisibleIndexes();
    this.onPageVisibleChanged.fire(this, { page: page, visible: newValue });
  }
  panelVisibilityChanged(panel: IPanel, newValue: boolean) {
    this.updateVisibleIndexes();
    this.onPanelVisibleChanged.fire(this, { panel: panel, visible: newValue });
  }
  questionCreated(question: IQuestion): any {
    this.onQuestionCreated.fire(this, { question: question });
  }
  questionAdded(
    question: IQuestion,
    index: number,
    parentPanel: any,
    rootPanel: any
  ) {
    if (!question.name) {
      question.name = this.generateNewName(
        this.getAllQuestions(false, true),
        "question"
      );
    }
    if (!!(<Question>question).page) {
      this.questionHashesAdded(<Question>question);
    }
    if (!this.isLoadingFromJson) {
      this.updateVisibleIndexes();
    }
    this.onQuestionAdded.fire(this, {
      question: question,
      name: question.name,
      index: index,
      parentPanel: parentPanel,
      rootPanel: rootPanel,
    });
  }
  questionRemoved(question: IQuestion) {
    this.questionHashesRemoved(
      <Question>question,
      question.name,
      question.getValueName()
    );
    this.updateVisibleIndexes();
    this.onQuestionRemoved.fire(this, {
      question: question,
      name: question.name,
    });
  }
  questionRenamed(
    question: IQuestion,
    oldName: string,
    oldValueName: string
  ): any {
    this.questionHashesRemoved(<Question>question, oldName, oldValueName);
    this.questionHashesAdded(<Question>question);
  }
  private questionHashes = {
    names: {},
    namesInsensitive: {},
    valueNames: {},
    valueNamesInsensitive: {},
  };
  private questionHashesClear() {
    this.questionHashes.names = {};
    this.questionHashes.namesInsensitive = {};
    this.questionHashes.valueNames = {};
    this.questionHashes.valueNamesInsensitive = {};
  }
  private questionHashesPanelAdded(panel: PanelModelBase) {
    if (this.isLoadingFromJson) return;
    var questions = panel.questions;
    for (var i = 0; i < questions.length; i++) {
      this.questionHashesAdded(questions[i]);
    }
  }
  private questionHashesAdded(question: Question) {
    this.questionHashAddedCore(
      this.questionHashes.names,
      question,
      question.name
    );
    this.questionHashAddedCore(
      this.questionHashes.namesInsensitive,
      question,
      question.name.toLowerCase()
    );
    this.questionHashAddedCore(
      this.questionHashes.valueNames,
      question,
      question.getValueName()
    );
    this.questionHashAddedCore(
      this.questionHashes.valueNamesInsensitive,
      question,
      question.getValueName().toLowerCase()
    );
  }
  private questionHashesRemoved(
    question: Question,
    name: string,
    valueName: string
  ) {
    if (!!name) {
      this.questionHashRemovedCore(this.questionHashes.names, question, name);
      this.questionHashRemovedCore(
        this.questionHashes.namesInsensitive,
        question,
        name.toLowerCase()
      );
    }
    if (!!valueName) {
      this.questionHashRemovedCore(
        this.questionHashes.valueNames,
        question,
        valueName
      );
      this.questionHashRemovedCore(
        this.questionHashes.valueNamesInsensitive,
        question,
        valueName.toLowerCase()
      );
    }
  }
  private questionHashAddedCore(hash: any, question: Question, name: string) {
    var res = hash[name];
    if (!!res) {
      var res = hash[name];
      if (res.indexOf(question) < 0) {
        res.push(question);
      }
    } else {
      hash[name] = [question];
    }
  }
  private questionHashRemovedCore(hash: any, question: Question, name: string) {
    var res = hash[name];
    if (!res) return;
    var index = res.indexOf(question);
    if (index > -1) {
      res.splice(index, 1);
    }
    if (res.length == 0) {
      delete hash[name];
    }
  }
  panelAdded(panel: IElement, index: number, parentPanel: any, rootPanel: any) {
    if (!panel.name) {
      panel.name = this.generateNewName(
        this.getAllPanels(false, true),
        "panel"
      );
    }
    this.questionHashesPanelAdded(<PanelModelBase>(<any>panel));
    this.updateVisibleIndexes();
    this.onPanelAdded.fire(this, {
      panel: panel,
      name: panel.name,
      index: index,
      parentPanel: parentPanel,
      rootPanel: rootPanel,
    });
  }
  panelRemoved(panel: IElement) {
    this.updateVisibleIndexes();
    this.onPanelRemoved.fire(this, { panel: panel, name: panel.name });
  }
  validateQuestion(question: IQuestion): SurveyError {
    if (this.onValidateQuestion.isEmpty) return null;
    var options = {
      name: question.name,
      question: question,
      value: question.value,
      error: <any>null,
    };
    this.onValidateQuestion.fire(this, options);
    return options.error ? new CustomError(options.error, this) : null;
  }
  validatePanel(panel: IPanel): SurveyError {
    if (this.onValidatePanel.isEmpty) return null;
    var options = {
      name: panel.name,
      panel: panel,
      error: <any>null,
    };
    this.onValidatePanel.fire(this, options);
    return options.error ? new CustomError(options.error, this) : null;
  }
  processHtml(html: string): string {
    var options = { html: html };
    this.onProcessHtml.fire(this, options);
    return this.processText(options.html, true);
  }
  processText(text: string, returnDisplayValue: boolean): string {
    return this.processTextEx(text, returnDisplayValue, false).text;
  }
  processTextEx(
    text: string,
    returnDisplayValue: boolean,
    doEncoding: boolean
  ): any {
    var res = {
      text: this.processTextCore(text, returnDisplayValue, doEncoding),
      hasAllValuesOnLastRun: true,
    };
    res.hasAllValuesOnLastRun = this.textPreProcessor.hasAllValuesOnLastRun;
    return res;
  }
  private processTextCore(
    text: string,
    returnDisplayValue: boolean,
    doEncoding: boolean = false
  ): string {
    if (this.isDesignMode) return text;
    return this.textPreProcessor.process(text, returnDisplayValue, doEncoding);
  }
  getSurveyMarkdownHtml(element: Base, text: string): string {
    var options = { element: element, text: text, html: <any>null };
    this.onTextMarkdown.fire(this, options);
    return options.html;
  }
  /**
   * Returns an amount of corrected quiz answers.
   */
  public getCorrectedAnswerCount(): number {
    return this.getCorrectedAnswerCountCore(true);
  }
  /**
   * Returns quiz question number. It may be different from `getQuizQuestions.length` because some widgets like matrix may have several questions.
   * @see getQuizQuestions
   */
  public getQuizQuestionCount(): number {
    var questions = this.getQuizQuestions();
    var res = 0;
    for (var i = 0; i < questions.length; i++) {
      res += (<Question>questions[i]).quizQuestionCount;
    }
    return res;
  }
  /**
   * Returns an amount of incorrect quiz answers.
   */
  public getInCorrectedAnswerCount(): number {
    return this.getCorrectedAnswerCountCore(false);
  }
  private getCorrectedAnswerCountCore(isCorrect: boolean): number {
    var questions = this.getQuizQuestions();
    var counter = 0;
    var options = {
      question: <IQuestion>null,
      result: false,
      correctAnswers: 0,
      incorrectAnswers: 0,
    };
    for (var i = 0; i < questions.length; i++) {
      var q = <Question>questions[i];
      var quizQuestionCount = q.quizQuestionCount;
      options.question = q;
      options.correctAnswers = q.correctAnswerCount;
      options.incorrectAnswers = quizQuestionCount - options.correctAnswers;
      options.result = options.question.isAnswerCorrect();
      this.onIsAnswerCorrect.fire(this, options);
      if (isCorrect) {
        if (options.result || options.correctAnswers < quizQuestionCount) {
          var addCount = options.correctAnswers;
          if (addCount == 0 && options.result) addCount = 1;
          counter += addCount;
        }
      } else {
        if (!options.result || options.incorrectAnswers < quizQuestionCount) {
          counter += options.incorrectAnswers;
        }
      }
    }
    return counter;
  }
  getCorrectedAnswers(): number {
    return this.getCorrectedAnswerCount();
  }
  getInCorrectedAnswers(): number {
    return this.getInCorrectedAnswerCount();
  }
  /**
   * Gets or sets a timer panel position. The timer panel displays information about how much time an end user spends on a survey/page.
   *
   * The available options:
   * - `top` - display timer panel in the top.
   * - `bottom` - display timer panel in the bottom.
   * - `none` - do not display a timer panel.
   *
   * If the value is not equal to 'none', the survey calls the `startTimer()` method on survey rendering.
   * @see showTimerPanelMode
   * @see startTimer
   * @see stopTimer
   */
  public get showTimerPanel(): string {
    return this.getPropertyValue("showTimerPanel", "none");
  }
  public set showTimerPanel(val: string) {
    this.setPropertyValue("showTimerPanel", val);
  }
  public get isTimerPanelShowingOnTop() {
    return this.isTimerStarted && this.showTimerPanel == "top";
  }
  public get isTimerPanelShowingOnBottom() {
    return this.isTimerStarted && this.showTimerPanel == "bottom";
  }
  /**
   * Gets or set a value that specifies whether the timer displays information for the page or for the entire survey.
   *
   * The available options:
   *
   * - `page` - show timer information for page
   * - `survey` - show timer information for survey
   *
   * Use the `onTimerPanelInfoText` event to change the default text.
   * @see showTimerPanel
   * @see onTimerPanelInfoText
   */
  public get showTimerPanelMode(): string {
    return this.getPropertyValue("showTimerPanelMode", "all");
  }
  public set showTimerPanelMode(val: string) {
    this.setPropertyValue("showTimerPanelMode", val);
  }
  public get timerInfoText(): string {
    var options = { text: this.getTimerInfoText() };
    this.onTimerPanelInfoText.fire(this, options);
    var loc = new LocalizableString(this, true);
    loc.text = options.text;
    return loc.textOrHtml;
  }
  private getTimerInfoText() {
    var page = this.currentPage;
    if (!page) return "";
    var pageSpent = this.getDisplayTime(page.timeSpent);
    var surveySpent = this.getDisplayTime(this.timeSpent);
    var pageLimitSec = this.getPageMaxTimeToFinish(page);
    var pageLimit = this.getDisplayTime(pageLimitSec);
    var surveyLimit = this.getDisplayTime(this.maxTimeToFinish);
    if (this.showTimerPanelMode == "page")
      return this.getTimerInfoPageText(page, pageSpent, pageLimit);
    if (this.showTimerPanelMode == "survey")
      return this.getTimerInfoSurveyText(surveySpent, surveyLimit);
    if (this.showTimerPanelMode == "all") {
      if (pageLimitSec <= 0 && this.maxTimeToFinish <= 0) {
        return this.getLocString("timerSpentAll")["format"](
          pageSpent,
          surveySpent
        );
      }
      if (pageLimitSec > 0 && this.maxTimeToFinish > 0) {
        return this.getLocString("timerLimitAll")["format"](
          pageSpent,
          pageLimit,
          surveySpent,
          surveyLimit
        );
      }
      let pageText = this.getTimerInfoPageText(page, pageSpent, pageLimit);
      let surveyText = this.getTimerInfoSurveyText(surveySpent, surveyLimit);
      return pageText + " " + surveyText;
    }
    return "";
  }
  private getTimerInfoPageText(
    page: PageModel,
    pageSpent: string,
    pageLimit: string
  ): string {
    return this.getPageMaxTimeToFinish(page) > 0
      ? this.getLocString("timerLimitPage")["format"](pageSpent, pageLimit)
      : this.getLocString("timerSpentPage")["format"](pageSpent, pageLimit);
  }
  private getTimerInfoSurveyText(
    surveySpent: string,
    surveyLimit: string
  ): string {
    return this.maxTimeToFinish > 0
      ? this.getLocString("timerLimitSurvey")["format"](
          surveySpent,
          surveyLimit
        )
      : this.getLocString("timerSpentSurvey")["format"](
          surveySpent,
          surveyLimit
        );
  }
  private getDisplayTime(val: number): string {
    var min = Math.floor(val / 60);
    var sec = val % 60;
    var res = "";
    if (min > 0) {
      res += min + " " + this.getLocString("timerMin");
    }
    if (res && sec == 0) return res;
    if (res) res += " ";
    return res + sec + " " + this.getLocString("timerSec");
  }
  private timerFunc: any = null;
  /**
   * Starts a timer that will calculate how much time end-user spends on the survey or on pages.
   * @see stopTimer
   * @see timeSpent
   */
  public startTimer() {
    if (this.isTimerStarted || this.isDesignMode) return;
    var self = this;
    this.timerFunc = function () {
      self.doTimer();
    };
    this.isTimerStarted = true;
    SurveyTimer.instance.start(this.timerFunc);
  }
  startTimerFromUI() {
    if (this.showTimerPanel != "none" && this.state === "running") {
      this.startTimer();
    }
  }
  /**
   * Stops the timer.
   * @see startTimer
   * @see timeSpent
   */
  public stopTimer() {
    if (!this.isTimerStarted) return;
    this.isTimerStarted = false;
    SurveyTimer.instance.stop(this.timerFunc);
  }
  /**
   * Returns the time in seconds an end user spends on the survey
   * @see startTimer
   * @see PageModel.timeSpent
   */
  public timeSpent = 0;
  /**
   * Gets or sets the maximum time in seconds that end user has to complete a survey. If the value is 0 or less, an end user has no time limit to finish a survey.
   * @see startTimer
   * @see maxTimeToFinishPage
   */
  public get maxTimeToFinish(): number {
    return this.getPropertyValue("maxTimeToFinish", 0);
  }
  public set maxTimeToFinish(val: number) {
    this.setPropertyValue("maxTimeToFinish", val);
  }
  /**
   * Gets or sets the maximum time in seconds that end user has to complete a page in the survey. If the value is 0 or less, an end user has no time limit.
   *
   * You may override this value for every page.
   * @see startTimer
   * @see maxTimeToFinish
   * @see PageModel.maxTimeToFinish
   */
  public get maxTimeToFinishPage(): number {
    return this.getPropertyValue("maxTimeToFinishPage", 0);
  }
  public set maxTimeToFinishPage(val: number) {
    this.setPropertyValue("maxTimeToFinishPage", val);
  }
  private getPageMaxTimeToFinish(page: PageModel) {
    if (!page || page.maxTimeToFinish < 0) return 0;
    return page.maxTimeToFinish > 0
      ? page.maxTimeToFinish
      : this.maxTimeToFinishPage;
  }
  protected doTimer() {
    var page = this.currentPage;
    if (page) {
      page.timeSpent = page.timeSpent + 1;
    }
    this.timeSpent = this.timeSpent + 1;
    this.onTimer.fire(this, {});
    if (this.maxTimeToFinish > 0 && this.maxTimeToFinish == this.timeSpent) {
      this.completeLastPage();
    }
    if (page) {
      var pageLimit = this.getPageMaxTimeToFinish(page);
      if (pageLimit > 0 && pageLimit == page.timeSpent) {
        if (this.isLastPage) {
          this.completeLastPage();
        } else {
          this.nextPage();
        }
      }
    }
  }
  //ISurveyImplementor
  geSurveyData(): ISurveyData {
    return this;
  }
  getSurvey(): ISurvey {
    return this;
  }
  getTextProcessor(): ITextProcessor {
    return this;
  }
  //ISurveyTriggerOwner
  getObjects(pages: string[], questions: string[]): any[] {
    var result: any[] = [];
    Array.prototype.push.apply(result, this.getPagesByNames(pages));
    Array.prototype.push.apply(result, this.getQuestionsByNames(questions));
    return result;
  }
  setTriggerValue(name: string, value: any, isVariable: boolean) {
    if (!name) return;
    if (isVariable) {
      this.setVariable(name, value);
    } else {
      var processor = new ProcessValue();
      var firstName = processor.getFirstName(name);
      if (firstName == name) {
        this.setValue(name, value);
      } else {
        if (!this.getValue(firstName)) return;
        var data = this.getUnbindValue(this.getFilteredValues());
        processor.setValue(data, name, value);
        this.setValue(firstName, data[firstName]);
      }
    }
  }
  copyTriggerValue(name: string, fromName: string) {
    if (!name || !fromName) return;
    var processor = new ProcessValue();
    var value = processor.getValue(fromName, this.getFilteredValues());
    this.setTriggerValue(name, value, false);
  }
  focusQuestion(name: string): boolean {
    var question = this.getQuestionByName(name, true);
    if (!question || !question.isVisible || !question.page) return false;
    this.currentPage = question.page;
    setInterval(function () {
      question.focus(), 1;
    });
    return true;
  }
  /**
   * Use this method to dispose survey model properly.
   */
  public dispose() {
    for (var i = 0; i < this.pages.length; i++) {
      this.pages[i].dispose();
    }
    this.pages.splice(0, this.pages.length);
  }
}

Serializer.addClass("survey", [
  {
    name: "locale",
    choices: () => {
      return surveyLocalization.getLocales();
    },
    onGetValue: (obj: any): any => {
      return obj.locale == surveyLocalization.defaultLocale ? null : obj.locale;
    },
  },
  { name: "title", serializationProperty: "locTitle" },
  { name: "description:text", serializationProperty: "locDescription" },
  { name: "logo", serializationProperty: "locLogo" },
  { name: "logoWidth:number", default: 300, minValue: 0 },
  { name: "logoHeight:number", default: 200, minValue: 0 },
  {
    name: "logoFit",
    default: "contain",
    choices: ["none", "contain", "cover", "fill"],
  },
  {
    name: "logoPosition",
    default: "left",
    choices: ["none", "left", "right", "top", "bottom"],
  },
  { name: "focusFirstQuestionAutomatic:boolean", default: true },
  { name: "focusOnFirstError:boolean", default: true },
  { name: "completedHtml:html", serializationProperty: "locCompletedHtml" },
  {
    name: "completedBeforeHtml:html",
    serializationProperty: "locCompletedBeforeHtml",
  },
  {
    name: "completedHtmlOnCondition:htmlconditions",
    className: "htmlconditionitem",
  },
  { name: "loadingHtml:html", serializationProperty: "locLoadingHtml" },
  { name: "pages:surveypages", className: "page" },
  {
    name: "questions",
    alternativeName: "elements",
    baseClassName: "question",
    visible: false,
    isLightSerializable: false,
    onGetValue: function (obj: any): any {
      return null;
    },
    onSetValue: function (obj: any, value: any, jsonConverter: any) {
      var page = obj.addNewPage("");
      jsonConverter.toObject({ questions: value }, page);
    },
  },
  {
    name: "triggers:triggers",
    baseClassName: "surveytrigger",
    classNamePart: "trigger",
  },
  {
    name: "calculatedValues:calculatedvalues",
    className: "calculatedvalue",
  },
  { name: "surveyId", visible: false },
  { name: "surveyPostId", visible: false },
  { name: "surveyShowDataSaving:boolean", visible: false },
  "cookieName",
  "sendResultOnPageNext:boolean",
  {
    name: "showNavigationButtons",
    default: "bottom",
    choices: ["none", "top", "bottom", "both"],
  },
  { name: "showPrevButton:boolean", default: true },
  { name: "showTitle:boolean", default: true },
  { name: "showPageTitles:boolean", default: true },
  { name: "showCompletedPage:boolean", default: true },
  "navigateToUrl",
  {
    name: "navigateToUrlOnCondition:urlconditions",
    className: "urlconditionitem",
  },
  {
    name: "questionsOrder",
    default: "initial",
    choices: ["initial", "random"],
  },
  "showPageNumbers:boolean",
  {
    name: "showQuestionNumbers",
    default: "on",
    choices: ["on", "onPage", "off"],
  },
  {
    name: "questionTitleLocation",
    default: "top",
    choices: ["top", "bottom", "left"],
  },
  {
    name: "questionDescriptionLocation",
    default: "underTitle",
    choices: ["underInput", "underTitle"],
  },
  { name: "questionErrorLocation", default: "top", choices: ["top", "bottom"] },
  {
    name: "showProgressBar",
    default: "off",
    choices: ["off", "top", "bottom", "both"],
  },
  {
    name: "progressBarType",
    default: "pages",
    choices: ["pages", "questions", "correctQuestions"],
  },
  { name: "mode", default: "edit", choices: ["edit", "display"] },
  { name: "storeOthersAsComment:boolean", default: true },
  { name: "maxTextLength:number", default: 0, minValue: 0 },
  { name: "maxOthersLength:number", default: 0, minValue: 0 },
  "goNextPageAutomatic:boolean",
  {
    name: "clearInvisibleValues",
    default: "onComplete",
    choices: ["none", "onComplete", "onHidden"],
  },
  {
    name: "checkErrorsMode",
    default: "onNextPage",
    choices: ["onNextPage", "onValueChanged", "onComplete"],
  },
  {
    name: "textUpdateMode",
    default: "onBlur",
    choices: ["onBlur", "onTyping"],
  },
  { name: "startSurveyText", serializationProperty: "locStartSurveyText" },
  { name: "pagePrevText", serializationProperty: "locPagePrevText" },
  { name: "pageNextText", serializationProperty: "locPageNextText" },
  { name: "completeText", serializationProperty: "locCompleteText" },
  { name: "previewText", serializationProperty: "locPreviewText" },
  { name: "editText", serializationProperty: "locEditText" },
  { name: "requiredText", default: "*" },
  {
    name: "questionStartIndex",
    visibleIf: function (survey: any) {
      return !survey || survey.showQuestionNumbers !== "off";
    },
  },
  {
    name: "questionTitlePattern",
    default: "numTitleRequire",
    dependsOn: ["questionStartIndex", "requiredText"],
    choices: (obj: any) => {
      if (!obj) return [];
      return obj.getQuestionTitlePatternOptions();
    },
  },
  {
    name: "questionTitleTemplate",
    visible: false,
    isSerializable: false,
    serializationProperty: "locQuestionTitleTemplate",
  },
  { name: "firstPageIsStarted:boolean", default: false },
  {
    name: "isSinglePage:boolean",
    default: false,
    visible: false,
    isSerializable: false,
  },
  {
    name: "questionsOnPageMode",
    default: "standard",
    choices: ["singlePage", "standard", "questionPerPage"],
  },
  {
    name: "showPreviewBeforeComplete",
    default: "noPreview",
    choices: ["noPreview", "showAllQuestions", "showAnsweredQuestions"],
  },
  { name: "maxTimeToFinish:number", default: 0, minValue: 0 },
  { name: "maxTimeToFinishPage:number", default: 0, minValue: 0 },
  {
    name: "showTimerPanel",
    default: "none",
    choices: ["none", "top", "bottom"],
  },
  {
    name: "showTimerPanelMode",
    default: "all",
    choices: ["all", "page", "survey"],
  },
]);
