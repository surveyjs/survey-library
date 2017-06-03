import {JsonObject} from "./jsonobject";
import {Base, ISurvey, HashTable, IQuestion, IElement, IConditionRunner, IPage, SurveyError, Event} from "./base";
import {ISurveyTriggerOwner, SurveyTrigger} from "./trigger";
import {PageModel} from "./page";
import {TextPreProcessor} from "./textPreProcessor";
import {ProcessValue} from "./conditionProcessValue";
import {dxSurveyService} from "./dxSurveyService";
import {JsonError} from "./jsonobject";
import {surveyLocalization} from "./surveyStrings";
import {QuestionBase} from "./questionbase";
import {CustomError} from "./error";
import {CustomWidgetCollection} from './questionCustomWidgets';
import {ILocalizableOwner, LocalizableString} from "./localizablestring";

/**
 * Survey object contains information about the survey. Pages, Questions, flow logic and etc.
 */
export class SurveyModel extends Base implements ISurvey, ISurveyTriggerOwner, ILocalizableOwner {
    /**
     * Set this property to automatically load survey Json from [dxsurvey.com](http://www.dxsurvey.com) service.
     * @see loadSurveyFromService
     */
    public surveyId: string = null;
    /**
     * Set this property to automatically save the data into the [dxsurvey.com](http://www.dxsurvey.com) service.
     * @see onComplete
     */
    public surveyPostId: string = null;
    /**
     * Use this property as indentificator for a user, for example e-mail or unique customer id in your web application. If you are loading survey or posting survey results  from/to [dxsurvey.com](http://www.dxsurvey.com) service, then the library do not allow to run the same survey the second time. On the second run, the user will see the 'Thank you' page.
     */
    public clientId: string = null;
    /**
     * If the property is not empty, before starting to run the survey, the library checkes if the cookie with this name exists. If it is true, the survey goes to complete mode and an user sees the 'Thank you' page. On completing the survey the cookie with this name is created.
     */
    public cookieName: string = null;
    /**
     * Set it to true, to save results on completing every page. onPartialSend event is fired.
     * @see onPartialSend
     * @see clientId
     */
    public sendResultOnPageNext: boolean = false;
    /**
     * You may show comments input for the most of questions. The entered text in the comment input will be saved as 'question name' + 'commentPrefix'.
     * @see data
     */
    public commentPrefix: string = "-Comment";
    /**
     * On showing the next or previous page, a first input is focused, if the property set to true.
     */
    public focusFirstQuestionAutomatic: boolean = true;
    /**
     * Set it to false to hide 'Prev', 'Next' and 'Complete' buttons. It makes sense if you are going to create a custom navigation or have just one page or on setting goNextPageAutomatic property.
     * @see goNextPageAutomatic
     */
    public showNavigationButtons: boolean = true;
    /**
     * Set it to false hide survey title.
     * @see title
     */
    public showTitle: boolean = true;
    /**
     * Set it to false to hide page titles.
     * @see PageModel.title
     */
    public showPageTitles: boolean = true;
    /**
     * On finishing the survey the 'Thank you', page on complete, is shown. Set the property to false, to hide the 'Thank you' page.
     * @see data
     * @see onComplete
     */
    public showCompletedPage: boolean = true;
    /**
     * A char/string that will be rendered in the title required questions.
     * @see QuestionBase.title
     */
    public requiredText: string = "*";
    /**
     * By default the first question index is 1. You may start it from 100 or from 'A', by setting 100 or 'A' to this property.
     * @see QuestionBase.title
     * @see requiredText
     */
    public questionStartIndex: string = "";
    private showProgressBarValue: string = "off";
    /**
     * By default the entered text in the others input in the checkbox/radiogroup/dropdown are stored as "question name " + "-Comment". The value itself is "question name": "others". Set this property to false, to store the entered text directly in the "question name" key.
     * @see commentPrefix
     */
    public storeOthersAsComment: boolean = true;
    /**
     * Set it true if you want to go to the next page without pressing 'Next' button when all questions are anwered.
    * @see showNavigationButtons 
     */
    public goNextPageAutomatic: boolean = false;
    /**
     * The list of all pages in the survey, including invisible.
     * @see PageModel
     * @see visiblePages
     */
    public pages: Array<PageModel> = new Array<PageModel>();
    /**
     * The list of triggers in the survey.
     * @see SurveyTrigger
     */
    public triggers: Array<SurveyTrigger> = new Array<SurveyTrigger>();
    /**
     * Set it to true, to remove from data property values of invisible questions on survey complete. In this case, the invisible questions will not be stored on the server.
     * @see QuestionBase.visible
     * @see oncComplete
     */
    public clearInvisibleValues: boolean = false;

    private locTitleValue : LocalizableString;
    private locCompletedHtmlValue : LocalizableString;
    private locPagePrevTextValue : LocalizableString;
    private locPageNextTextValue : LocalizableString;
    private locCompleteTextValue : LocalizableString;
    private locQuestionTitleTemplateValue: LocalizableString;

    private currentPageValue: PageModel = null;
    private valuesHash: HashTable<any> = {};
    private variablesHash: HashTable<any> = {};
    private pagePrevTextValue: string;
    private pageNextTextValue: string;
    private completeTextValue: string;
    private showPageNumbersValue: boolean = false;
    private showQuestionNumbersValue: string = "on";
    private questionTitleLocationValue: string = "top";
    private localeValue: string = "";
    private isCompleted: boolean = false;
    private isLoading: boolean = false;
    private processedTextValues: HashTable<any> = {};
    private textPreProcessor: TextPreProcessor;
    private isValidatingOnServerValue: boolean = false;
    private modeValue: string = "edit";
    private isDesignModeValue: boolean = false;
    /**
     * The event is fired after a user click on 'Complete' button and finished the survey. You may use it to send the data to your web server.
     * @see data
     * @see clearInvisibleValues
     * @see completeLastPage
     * @see surveyPostId
     */
    public onComplete: Event<(sender: SurveyModel) => any, any> = new Event<(sender: SurveyModel) => any, any>();
    /**
     * The event is fired on clicking 'Next' page if sendResultOnPageNext is set to true. You may use it to save the intermidiate results, for example, if your survey is large enough.
     * @see sendResultOnPageNext
     */
    public onPartialSend: Event<(sender: SurveyModel) => any, any> = new Event<(sender: SurveyModel) => any, any>();
    /**
     * The event is fired when another page becomes the current. Typically it happens when a user click on 'Next' or 'Prev' buttons.
     * @see currentPage
     * @see currentPageNo
     * @see nextPage
     * @see prevPage
     * @see completeLastPage
     */
    public onCurrentPageChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired when the question value is changed. It can be done via UI by a user or programmatically on calling setValue method.
     * @see setValue
     */
    public onValueChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired on changing a question visibility.
     * @see QuestionBase.visibile
     * @see QuestionBase.visibileIf
     */
    public onVisibleChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired on changing a page visibility.
     * @see PageModel.visibile
     * @see PageModel.visibileIf
     */
    public onPageVisibleChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired on adding a new question into survey.
     * @see QuestionBase
     */
    public onQuestionAdded: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired on removing a question from survey
     * @see QuestionBase
     */
    public onQuestionRemoved: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired on adding a panel into survey
     * @see PanelModel
     */
    public onPanelAdded: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired on removing a panel from survey
     * @see PanelModel
     */
    public onPanelRemoved: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired on validating value in a question. There are following properties in options: options.name is a question name, options.value is the current question value and options.error is an empty string. Set your error to options.error and survey will show the error for the question and block completing the survey or going to the next page.
     */
    public onValidateQuestion: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * Use this event to validate data on your server.
     */
    public onServerValidateQuestions: (sender: SurveyModel, options: any) => any;
    /**
     * Use this event to modify the html before rendering, for example html on 'Thank you' page. Options has one parameter: Options.html.
     * @see completedHtml
     * @see QuestionHtmlModel.html
     */
    public onProcessHtml: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * Use this event to process the markdown text. 
     */
    public onTextMarkdown: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event fires when it get response from the [dxsurvey.com](http://www.dxsurvey.com) service on saving survey results. Use it to find out if the results have been saved successful.
     */
    public onSendResult: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * Use it to get results after calling the getResult method. It returns a simple analytic from [dxsurvey.com](http://www.dxsurvey.com) service.
     * @see getResult
     */
    public onGetResult: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired on uploading the file in QuestionFile. You may use it to change the file name or tells the library do not accept the file. There are three properties in options: options.name, options.file and options.accept.
     * @see uploadFile
     */
    public onUploadFile: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired right after survey is rendered in DOM. options.htmlElement is the root element.
     */
    public onAfterRenderSurvey: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired right after a page is rendred in DOM. Use it to modify html elements. There are two parameters in options: options.currentPage, options.htmlElement
     */
    public onAfterRenderPage: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired right after a question is rendred in DOM. Use it to modify html elements. There are two parameters in options: options.question, options.htmlElement
     */
    public onAfterRenderQuestion: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired right after a panel is rendred in DOM. Use it to modify html elements. There are two parameters in options: options.panel, options.htmlElement
     */
    public onAfterRenderPanel: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired on adding a new row in Matrix Dynamic quesiton. Options.question is a matrix question.
     * @see QuestionMatrixDynamicModel
     * @see QuestionMatrixDynamicModel.visibleRows
     */
    public onMatrixRowAdded: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired for every cell created in Matrix Dymic and Matrix Dropdown questions.
     * options.question - the matrix question
     * options.cell - the matrix cell
     * options.cellQuestion - the question/editor in the cell. You may customize it, change it's properties, like choices or visible.
     * options.rowValue - the value of the current row. To access the value of paticular column use: options.rowValue["columnValue"]
     * options.column - the matrix column object
     * options.columName - the matrix column name
     * options.row - the matrix row object
     * @see onMatrixCellValueChanged
     * @see QuestionMatrixDynamicModel
     * @see QuestionMatrixDropdownModel
     */
    public onMatrixCellCreated: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The event is fired when cell value is changed in Matrix Dymic and Matrix Dropdown questions.
     * options.columName - the matrix column name
     * options.value - a new value
     * options.row - the matrix row object
     * getCellQuestion(columnName) - the function that returns the cell question by column name.
     * @see onMatrixRowAdded
     * @see QuestionMatrixDynamicModel
     * @see QuestionMatrixDropdownModel
     */
    public onMatrixCellValueChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    /**
     * The list of errors on loading survey json. If the list is empty after loading a json then the json is correct and there is no errors in it.
     * @see JsonError
     */
    public jsonErrors: Array<JsonError> = null;

    constructor(jsonObj: any = null) {
        super();
        var self = this;
        this.locTitleValue = new LocalizableString(this, true);
        this.locTitleValue.onRenderedHtmlCallback = function(text) { return self.processedTitle; };
        this.locCompletedHtmlValue = new LocalizableString(this);
        this.locPagePrevTextValue = new LocalizableString(this);
        this.locPageNextTextValue = new LocalizableString(this);
        this.locCompleteTextValue = new LocalizableString(this);
        this.locQuestionTitleTemplateValue = new LocalizableString(this, true);

        this.textPreProcessor = new TextPreProcessor();
        this.textPreProcessor.onHasValue = function (name: string) { return self.hasProcessedTextValue(name); };
        this.textPreProcessor.onProcess = function (name: string) { return self.getProcessedTextValue(name); };
        this.pages.push = function (value) {
            value.data = self;
            return Array.prototype.push.call(this, value);
        };
        this.triggers.push = function (value) {
            value.setOwner(self);
            return Array.prototype.push.call(this, value);
        };
        this.updateProcessedTextValues();
        this.onBeforeCreating();
        if (jsonObj) {
            this.setJsonObject(jsonObj);
            if (this.surveyId) {
                this.loadSurveyFromService(this.surveyId);
            }
        }
        this.onCreating();
    }
    public getType(): string { return "survey"; }
    /**
     * Use it to change the survey locale. By default it is empty, 'en'. You may set it to 'de' - german, 'fr' - french and so on. The library has built-in localization for several languages. The library has a multi-language support as well.
     */
    public get locale(): string { return this.localeValue; }
    public set locale(value: string) {
        this.localeValue = value;
        surveyLocalization.currentLocale = value;
        for(var i = 0; i < this.pages.length; i ++) {
            this.pages[i].onLocaleChanged();
        }
    }
    //ILocalizableOwner
    getLocale() { return this.locale; }
    public getMarkdownHtml(text: string)  {
        var options = {text: text, html: null}
        this.onTextMarkdown.fire(this, options);
        return options.html;
    }
    getLocString(str: string) { return surveyLocalization.getString(str); }
    /**
     * Returns the text that renders when there is no any visible page and question.
     */
    public get emptySurveyText(): string { return this.getLocString("emptySurvey"); }
    /**
     * Survey title.
     */
    public get title(): string { return this.locTitle.text; }
    public set title(value: string) { this.locTitle.text = value; }
    get locTitle(): LocalizableString { return this.locTitleValue; }
    /**
     * The html that shows on completed ('Thank you') page. Set it to change the default text.
     * @see showCompletedPage
     * @see locale
     */
    public get completedHtml(): string { return this.locCompletedHtml.text;}
    public set completedHtml(value: string) { this.locCompletedHtml.text = value;}
    get locCompletedHtml(): LocalizableString { return this.locCompletedHtmlValue;}
    /**
     * A text that renders on the 'Prev' button. Set it to change the default text.
     * @see locale
     */
    public get pagePrevText(): string { return this.locPagePrevText.text ? this.locPagePrevText.text : this.getLocString("pagePrevText"); }
    public set pagePrevText(newValue: string) { this.locPagePrevText.text = newValue; }
    get locPagePrevText(): LocalizableString { return this.locPagePrevTextValue;}
    /**
     * A text that renders on the 'Next' button. Set it to change the default text.
     * @see locale
     */
    public get pageNextText(): string { return this.locPageNextText.text ? this.locPageNextText.text : this.getLocString("pageNextText"); }
    public set pageNextText(newValue: string) { this.locPageNextText.text = newValue; }
    get locPageNextText(): LocalizableString { return this.locPageNextTextValue;}
    /**
     * A text that renders on the 'Complete' button. Set it to change the default text.
     * @see locale
     */
    public get completeText(): string { return this.locCompleteText.text ? this.locCompleteText.text : this.getLocString("completeText"); }
    public set completeText(newValue: string) { this.locCompleteText.text = newValue; }
    get locCompleteText(): LocalizableString { return this.locCompleteTextValue;}
    /**
     * A template for a question title.
     * @see QuestionModel.title
     */
    public get questionTitleTemplate(): string { return this.locQuestionTitleTemplate.text;}
    public set questionTitleTemplate(value: string) { this.locQuestionTitleTemplate.text = value;}
    /**
     * Returns the question title template
     * @see questionTitleTemplate
     * @see QuestionModel.title
     */
    public getQuestionTitleTemplate(): string { return this.locQuestionTitleTemplate.textOrHtml; }
    get locQuestionTitleTemplate(): LocalizableString { return this.locQuestionTitleTemplateValue; }

    /**
     * Set this property to false to turn off the numbering on pages titles.
     */
    public get showPageNumbers(): boolean { return this.showPageNumbersValue; }
    public set showPageNumbers(value: boolean) {
        if (value === this.showPageNumbers) return;
        this.showPageNumbersValue = value;
        this.updateVisibleIndexes();
    }
    /**
     * Set this property to false to turn off the numbering on questions titles.
     */
    public get showQuestionNumbers(): string { return this.showQuestionNumbersValue; };
    public set showQuestionNumbers(value: string) {
        value = value.toLowerCase();
        value = (value === "onpage") ? "onPage" : value;
        if (value === this.showQuestionNumbers) return;
        this.showQuestionNumbersValue = value;
        this.updateVisibleIndexes();
    };
    /**
     * Set this property to "top" to show the progress bar on the bottom or to "bottom" to show it on the bottom.
     */
    public get showProgressBar(): string { return this.showProgressBarValue; }
    public set showProgressBar(newValue: string) {
      this.showProgressBarValue = newValue.toLowerCase();
    }
    /**
     * Returns the text/html that renders as survey title.
     */
    public get processedTitle() { return this.processText(this.locTitle.textOrHtml); }
    /**
     * Set this property to 'bottom' to show question title under the question.
     */
    public get questionTitleLocation(): string { return this.questionTitleLocationValue; };
    public set questionTitleLocation(value: string) {
        value = value.toLowerCase();
        if (value === this.questionTitleLocationValue) return;
        this.questionTitleLocationValue = value;
    };
    /**
     * Set this mode to 'display' to make the survey read-only. 
     */
    public get mode(): string { return this.modeValue; }
    public set mode(value: string) {
        value = value.toLowerCase();
        if (value == this.mode) return;
        if (value != "edit" && value != "display") return;
        this.modeValue = value;
        var questions = this.getAllQuestions();
        for(var i = 0; i < questions.length; i ++) {
            questions[i].onReadOnlyChanged();
        }
    }
    /**
     * An object that stores the survey results/data. You may set it directly as { 'question name': questionValue, ... }
     * @see setValue
     * @see getValue
     */
    public get data(): any {
        var result = {};
        for (var key in this.valuesHash) {
            result[key] = this.valuesHash[key];
        }
        return result;
    }
    public set data(data: any) {
        this.valuesHash = {};
        if (data) {
            for (var key in data) {
                this._setDataValue(data, key);
                this.checkTriggers(key, data[key], false);
                if (!this.processedTextValues[key.toLowerCase()]) {
                    this.processedTextValues[key.toLowerCase()] = "value";
                }
            }
        }
        this.notifyAllQuestionsOnValueChanged();
        this.runConditions();
    }
    protected _setDataValue(data: any, key: string) {
        this.valuesHash[key] = data[key];
    }
    /**
     * Returns all comments from the data.
     * @see data
     */
    public get comments(): any {
        var result = {};
        for (var key in this.valuesHash) {
            if (key.indexOf(this.commentPrefix) > 0) {
                result[key] = this.valuesHash[key];
            }
        }
        return result;
    }
    /**
     * Returns the list of visible pages. If all pages are visible then it is the same as pages property.
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
     * Returns true if there is no any page in the survey. The survey is empty.
     */
    public get isEmpty(): boolean { return this.pages.length == 0; }
    /**
     * depricated, misspelling, use pageCount property
     */
    get PageCount(): number { return this.pageCount; }
    /**
     * Returns the survey pages count.
     * @see visiblePageCount
     * @see pages
     */
    public get pageCount(): number {
        return this.pages.length;
    }
    /**
     * Returns the survey visible pages count
     * @see pageCount
     * @see visiblePages
     */
    public get visiblePageCount(): number {
        return this.visiblePages.length;
    }
    /**
     * Returns the current survey page. If survey is rendred then it is a page that a user can see/edit.
     */
    public get currentPage(): PageModel {
        var vPages = this.visiblePages;
        if (this.currentPageValue != null) {
            if (vPages.indexOf(this.currentPageValue) < 0) {
                this.currentPage = null;
            }
        }
        if (this.currentPageValue == null && vPages.length > 0) {
            this.currentPage = vPages[0];
        }
        return this.currentPageValue;
    }
    public set currentPage(value: PageModel) {
        var vPages = this.visiblePages;
        if (value != null && vPages.indexOf(value) < 0) return;
        if (value == this.currentPageValue) return;
        var oldValue = this.currentPageValue;
        this.currentPageValue = value;
        this.updateCustomWidgets(value);
        this.currentPageChanged(value, oldValue);
    }
    /**
     * The index of the current page in the visible pages array. It starts from 0.
     */
    public get currentPageNo(): number {
        return this.visiblePages.indexOf(this.currentPage);
    }
    public set currentPageNo(value: number) {
        var vPages = this.visiblePages;
        if (value < 0 || value >= this.visiblePages.length) return;
        this.currentPage = this.visiblePages[value];
    }
    /**
     * Set the input focuse to the first question with the input.
     */
    public focusFirstQuestion() {
        if (this.currentPageValue) {
            this.currentPageValue.scrollToTop();
            this.currentPageValue.focusFirstQuestion();
        }
    }
    /**
     * Returns the current survey state: 'loading' - loading from the json, 'completed' - a user has completed the survey, 'running' - a user answers a questions right now, 'empty' - there is nothing to show in the current survey.
     */
    public get state(): string {
        if (this.isLoading) return "loading";
        if (this.isCompleted) return "completed";
        return (this.currentPage) ? "running" : "empty"
    }
    /**
     * Clear the survey data and state. If the survey has a 'completed' state, it will have a 'running' state.
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
        this.isCompleted = false;
        if (gotoFirstPage && this.visiblePageCount > 0) {
            this.currentPage = this.visiblePages[0];
        }
    }
    protected mergeValues(src: any, dest: any) {
        if (!dest || !src) return;
        for (var key in src) {
            var value = src[key];
            if (value && typeof value === 'object') {
                if (!dest[key]) dest[key] = {};
                this.mergeValues(value, dest[key]);
            } else {
                dest[key] = value;
            }
        }
    }
    protected updateCustomWidgets(page: PageModel) {
        if (!page) return;
        for (var i = 0; i < page.questions.length; i++) {
            page.questions[i].customWidget = CustomWidgetCollection.Instance.getCustomWidget(page.questions[i]);
        }
    }
    protected currentPageChanged(newValue: PageModel, oldValue: PageModel) {
        this.onCurrentPageChanged.fire(this, { 'oldCurrentPage': oldValue, 'newCurrentPage': newValue });
    }
    /**
     * Returns the progress that a user made by answering on the survey.
     */
    public getProgress(): number {
        if (this.currentPage == null) return 0;
        var index = this.visiblePages.indexOf(this.currentPage) + 1;
        return Math.ceil((index * 100 / this.visiblePageCount));
    }
    /**
     * Returns true if navigation buttons: 'Prev', 'Next' or 'Complete' are shown.
     */
    public get isNavigationButtonsShowing(): boolean {
        if (this.isDesignMode) return false;
        var page = this.currentPage;
        if (!page) return false;
        return page.navigationButtonsVisibility == "show" ||
            (page.navigationButtonsVisibility != "hide" && this.showNavigationButtons);
    }
    /**
     * Returns true if the survey in the edit mode.
     * @see mode
     */
    public get isEditMode(): boolean { return this.mode == "edit"; }
    /**
     * Returns true if the survey in the display mode.
     * @see mode
     */
    public get isDisplayMode(): boolean { return this.mode == "display"; }
    /**
     * Returns true if the survey in the design mode. It is used by SurveyJS Editor
     * @see setDesignMode 
     */
    public get isDesignMode(): boolean { return this.isDesignModeValue; }
    /**
     * Call it to set the survey into the design mode.
     * @param value use true to set the survey into the design mode.
     */
    public setDesignMode(value: boolean) {
        this.isDesignModeValue = value;
    }
    /**
     * Returns true, if a user has already completed the survey on this browser and there is a cookie about it. Survey goes to 'completed' state if the function returns true.
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
     * Set the cookie with cookieName in the browser. It is done automatically on survey complete if cookieName is not empty.
     * @see cookieName
     * @see hasCookie
     * @see deleteCookie  
     */
    public setCookie() {
        if (!this.cookieName) return;
        document.cookie = this.cookieName + "=true; expires=Fri, 31 Dec 9999 0:0:0 GMT";
    }
    /**
     * Delete the cookie with cookieName in the browser. 
     * @see cookieName
     * @see hasCookie
     * @see setCookie  
     */
    public deleteCookie() {
        if (!this.cookieName) return;
        document.cookie = this.cookieName + "=;";
    }
    /**
     * Call it to go to the next page. It returns false, if it is the last page. If there is an error, for example required question is empty, the function returns false as well.
     * @see isCurrentPageHasErrors
     * @see prevPage
     * @see completeLastPage
     */
    public nextPage(): boolean {
        if (this.isLastPage) return false;
        if (this.isEditMode && this.isCurrentPageHasErrors) return false;
        if (this.doServerValidation()) return false;
        this.doNextPage();
        return true;
    }
    /**
     * Returns true, if there is any error on the current page. For example, the required question is empty or a question validation is failed.
     * @see nextPage
     */
    public get isCurrentPageHasErrors(): boolean {
        if (this.currentPage == null) return true;
        return this.currentPage.hasErrors(true, true);
    }
    /**
     * Call it to go to the previous page. It returns false if the current page is the first page already. It doesn't perform any checks, required questions can be empty.
     * @see isFirstPage
     */
    public prevPage(): boolean {
        if (this.isFirstPage) return false;
        var vPages = this.visiblePages;
        var index = vPages.indexOf(this.currentPage);
        this.currentPage = vPages[index - 1];
    }
    /**
     * Call it to complete the survey, if the current page is the last one. It returns false if there is an error on the page.
     * @see isCurrentPageHasErrors
     * @see nextPage
     */
    public completeLastPage() : boolean {
        if (this.isEditMode && this.isCurrentPageHasErrors) return false;
        if (this.doServerValidation()) return false;
        this.doComplete();
        return true;
    }
    /**
     * Returns true if the current page is the first one.
     */
    public get isFirstPage(): boolean {
        if (this.currentPage == null) return true;
        return this.visiblePages.indexOf(this.currentPage) == 0;
    }
    /**
     * Returns true if the current page is the last one.
     */
    public get isLastPage(): boolean {
        if (this.currentPage == null) return true;
        var vPages = this.visiblePages;
        return vPages.indexOf(this.currentPage) == vPages.length - 1;
    }
    /**
     * Call it to complete the survey. It writes cookie if cookieName property is not empty, set the survey into 'completed' state, fire onComplete event and sendResult into [dxsurvey.com](http://www.dxsurvey.com) service if surveyPostId property is not empty.
     * @see cookieName
     * @see state
     * @see onComplete
     * @see surveyPostId
     */
    public doComplete() {
        let previousCookie = this.hasCookie;
        this.clearUnusedValues();
        this.setCookie();
        this.setCompleted();
        this.onComplete.fire(this, null);
        if (!previousCookie && this.surveyPostId) {
            this.sendResult();
        }
    }
    /**
     * Returns true, if at the current moment the question values on the current page are validating on the server.
     * @see onServerValidateQuestions
     */
    public get isValidatingOnServer(): boolean { return this.isValidatingOnServerValue; }
    private setIsValidatingOnServer(val: boolean) {
        if (val == this.isValidatingOnServer) return;
        this.isValidatingOnServerValue = val;
        this.onIsValidatingOnServerChanged();
    }
    protected onIsValidatingOnServerChanged() { }
    protected doServerValidation(): boolean {
        if (!this.onServerValidateQuestions) return false;
        var self = this;
        var options = { data: {}, errors: {}, survey: this, complete : function () { self.completeServerValidation(options); } };
        for (var i = 0; i < this.currentPage.questions.length; i++) {
            var question = this.currentPage.questions[i];
            if (!question.visible) continue;
            var value = this.getValue(question.name);
            if (!Base.isValueEmpty(value)) options.data[question.name] = value;
        }
        this.setIsValidatingOnServer(true);
        this.onServerValidateQuestions(this, options);
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
                    question["addError"](new CustomError(options.errors[name]));
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
        if (this.sendResultOnPageNext) {
            this.sendResult(this.surveyPostId, this.clientId, true);
        }
        var vPages = this.visiblePages;
        var index = vPages.indexOf(this.currentPage);
        this.currentPage = vPages[index + 1];
    }
    protected setCompleted() {
        this.isCompleted = true;
    }
    /**
     * Returns the html for completed 'Thank you' page.
     * @see completedHtml
     */
    public get processedCompletedHtml(): string {
        if (this.completedHtml) {
            return this.processHtml(this.completedHtml);
        }
        return "<h3>" + this.getLocString("completingSurvey") + "</h3>";
    }
    /**
     * Returns the html that shows on loading the json.
     */
    public get processedLoadingHtml(): string {
        return "<h3>" + this.getLocString("loadingSurvey") + "</h3>";
    }
    /**
     * Returns the text for the current progress.
     */
    public get progressText(): string {
        if (this.currentPage == null) return "";
        var vPages = this.visiblePages;
        var index = vPages.indexOf(this.currentPage) + 1;
        return this.getLocString("progressText")["format"](index, vPages.length);
    }
    protected afterRenderSurvey(htmlElement) {
        this.onAfterRenderSurvey.fire(this, { survey: this, htmlElement: htmlElement });
    }
    afterRenderPage(htmlElement) {
        if (this.onAfterRenderPage.isEmpty) return;
        this.onAfterRenderPage.fire(this, { page: this.currentPage, htmlElement: htmlElement });
    }
    afterRenderQuestion(question: IQuestion, htmlElement) {
        this.onAfterRenderQuestion.fire(this, { question: question, htmlElement: htmlElement });
    }
    afterRenderPanel(panel: IElement, htmlElement) {
        this.onAfterRenderPanel.fire(this, { panel: panel, htmlElement: htmlElement });
    }
    matrixRowAdded(question: IQuestion) {
        this.onMatrixRowAdded.fire(this, {question: question});
    }
    matrixCellCreated(question: IQuestion, options: any) {
        options.question = question;
        this.onMatrixCellCreated.fire(this, options);
    }
    matrixCellValueChanged(question: IQuestion, options: any) {
        options.question = question;
        this.onMatrixCellValueChanged.fire(this, options);
    }
    /**
     * Upload the file into servey
     * @param name question name
     * @param file uploading file
     * @param storeDataAsText set it to true to encode file content into the survey results
     * @param uploadingCallback a call back function to get the status on uploading the file
     */
    public uploadFile(name: string, file: File, storeDataAsText: boolean, uploadingCallback: (status: string)=>any): boolean {
        var accept = true;
        this.onUploadFile.fire(this, { name: name, file: file, accept: accept });
        if (!accept) return false;
        if (!storeDataAsText && this.surveyPostId) {
            this.uploadFileCore(name, file, uploadingCallback);
        }
        return true;
    }
    protected uploadFileCore(name: string, file: File, uploadingCallback: (status: string) => any) {
        var self = this;
        if (uploadingCallback) uploadingCallback("uploading");
        new dxSurveyService().sendFile(this.surveyPostId, file, function (success: boolean, response: any) {
            if (uploadingCallback) uploadingCallback(success ? "success" : "error");
            if (success) {
                self.setValue(name, response);
            }
        });
    }
    getPage(index: number): PageModel {
        return this.pages[index];
    }
    /**
     * Add a page into the survey
     * @param page
     * @see addNewPage
     */
    public addPage(page: PageModel) {
        if (page == null) return;
        this.pages.push(page);
        this.updateVisibleIndexes();
    }
    /**
     * Creates a new page and adds it into the survey
     * @param name a page name
     * @see addPage
     */
    public addNewPage(name: string) {
        var page = this.createNewPage(name);
        this.addPage(page);
        return page;
    }
    /**
     * Remove the page from the survey
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
     * Returns a question by its name
     * @param name a question name
     * @param caseInsensitive 
     */
    public getQuestionByName(name: string, caseInsensitive: boolean = false): IQuestion {
        var questions = this.getAllQuestions();
        if (caseInsensitive) name = name.toLowerCase();
        for (var i: number = 0; i < questions.length; i++) {
            var questionName = questions[i].name;
            if (caseInsensitive) questionName = questionName.toLowerCase();
            if(questionName == name) return questions[i];
        }
        return null;
    }
    /**
     * Get a list of questions by their names
     * @param names the array of names
     * @param caseInsensitive 
     */
    public getQuestionsByNames(names: string[], caseInsensitive: boolean = false): IQuestion[] {
        var result = [];
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
            if(page.containsElement(element)) return page;
        }
        return null;
    }
    /**
     * Returns a page on which a question is located
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
     * Rertuns a list of pages by their names
     * @param names a list of pages names
     */
    public getPagesByNames(names: string[]): PageModel[]{
        var result = [];
        if (!names) return result;
        for (var i: number = 0; i < names.length; i++) {
            if (!names[i]) continue;
            var page = this.getPageByName(names[i]);
            if (page) result.push(page);
        }
        return result;
    }
    /**
     * Returns the list of all questions in the survey
     * @param visibleOnly set it true, if you want to get only visible questions
     */
    public getAllQuestions(visibleOnly: boolean = false): Array<IQuestion> {
        var result = new Array<IQuestion>();
        for (var i: number = 0; i < this.pages.length; i++) {
            this.pages[i].addQuestionsToList(result, visibleOnly);
        }
        return result;
    }
    protected createNewPage(name: string) { return new PageModel(name); }
    private notifyQuestionOnValueChanged(name: string, newValue: any) {
       var questions = this.getAllQuestions();
        var question = null;
        for (var i: number = 0; i < questions.length; i++) {
            if (questions[i].name != name) continue;
            question = questions[i];
            this.doSurveyValueChanged(question, newValue);
            this.onValueChanged.fire(this, { 'name': name, 'question': question, 'value': newValue });
        }
        if(!question) {
            this.onValueChanged.fire(this, { 'name': name, 'question': question, 'value': newValue });
        }
        for (var i: number = 0; i < questions.length; i++) {
            questions[i].onAnyValueChanged();
        }
    }
    private notifyAllQuestionsOnValueChanged() {
        var questions = this.getAllQuestions();
        for (var i: number = 0; i < questions.length; i++) {
            this.doSurveyValueChanged(questions[i], this.getValue(questions[i].name));
        }
    }
    protected doSurveyValueChanged(question: IQuestion, newValue: any) {
        question.onSurveyValueChanged(newValue);
    }
    private checkOnPageTriggers() {
        var questions = this.getCurrentPageQuestions();
        for (var i = 0; i < questions.length; i++) {
            var question = questions[i];
            var value = this.getValue(question.name);
            this.checkTriggers(question.name, value, true);
        }
    }
    private getCurrentPageQuestions(): Array<QuestionBase> {
        var result = [];
        var page = this.currentPage;
        if (!page) return result;
        for (var i = 0; i < page.questions.length; i++) {
            var question = page.questions[i];
            if (!question.visible || !question.name) continue;
            result.push(question);
        }
        return result;
    }
    private checkTriggers(name: string, newValue: any, isOnNextPage: boolean) {
        for (var i: number = 0; i < this.triggers.length; i++) {
            var trigger = this.triggers[i];
            if (trigger.name == name && trigger.isOnNextPage == isOnNextPage) {
                trigger.check(newValue);
            }
        }
    }
    private doElementsOnLoad() {
        for(var i = 0; i < this.pages.length; i ++) {
            this.pages[i].onSurveyLoad();
        }
    }
    private runConditions() {
        var pages = this.pages;
        for(var i = 0; i < pages.length; i ++) {
            pages[i].runCondition(this.valuesHash);
        }
    }
    /**
     * Send the survey result into [dxsurvey.com](http://www.dxsurvey.com) service.
     * @param postId [dxsurvey.com](http://www.dxsurvey.com) service postId
     * @param clientId Typically a customer e-mail or an identificator
     * @param isPartialCompleted Set it to true if the survey is not completed yet and it is an intermediate results
     * @see surveyPostId
     * @see clientId
     */
    public sendResult(postId: string = null, clientId: string = null, isPartialCompleted: boolean = false) {
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
        new dxSurveyService().sendResult(postId, this.data, function (success: boolean, response: any) {
            self.onSendResult.fire(self, { success: success, response: response});
        }, this.clientId, isPartialCompleted);
    }
    /**
     * It calls the [dxsurvey.com](http://www.dxsurvey.com) service and on callback fires onGetResult event with all answers that your users made for a question.
     * @param resultId [dxsurvey.com](http://www.dxsurvey.com) service resultId
     * @param name The question name
     * @see onGetResult
     */
    public getResult(resultId: string, name: string) {
        var self = this;
        new dxSurveyService().getResult(resultId, name, function (success: boolean, data: any, dataList: any[], response: any) {
            self.onGetResult.fire(self, { success: success, data: data, dataList: dataList, response: response });
        });
    }
    /**
     * Loads the survey Json from the [dxsurvey.com](http://www.dxsurvey.com) service.
     * @param surveyId [dxsurvey.com](http://www.dxsurvey.com) service surveyId
     */
    public loadSurveyFromService(surveyId: string = null) {
        if (surveyId) {
            this.surveyId = surveyId;
        }
        var self = this;
        this.isLoading = true;
        this.onLoadingSurveyFromService();
        new dxSurveyService().loadSurvey(this.surveyId, function (success: boolean, result: string, response: any) {
            self.isLoading = false;
            if (success && result) {
                self.setJsonObject(result);
                self.notifyAllQuestionsOnValueChanged();
                self.onLoadSurveyFromService();
            }
        });
    }
    protected onLoadingSurveyFromService() {
    }
    protected onLoadSurveyFromService() {
    }
    private checkPageVisibility(question: IQuestion, oldQuestionVisible: boolean) {
        var page = this.getPageByQuestion(question);
        if (!page) return;
        var newValue = page.isVisible;
        if (newValue != page.getIsPageVisible(question) || oldQuestionVisible) {
            this.pageVisibilityChanged(page, newValue);
        }
    }
    private updateVisibleIndexes() {
        this.updatePageVisibleIndexes(this.showPageNumbers);
        if (this.showQuestionNumbers == "onPage") {
            var visPages = this.visiblePages;
            for (var i = 0; i < visPages.length; i++) {
                this.updateQuestionVisibleIndexes(visPages[i].questions, true);
            }
        } else {
            this.updateQuestionVisibleIndexes(this.getAllQuestions(false), this.showQuestionNumbers == "on");
        }
    }
    private updatePageVisibleIndexes(showIndex: boolean) {
        var index = 0;
        for (var i = 0; i < this.pages.length; i++) {
            this.pages[i].visibleIndex = this.pages[i].visible ? (index++) : -1;
            this.pages[i].num = showIndex && this.pages[i].visible ? this.pages[i].visibleIndex + 1 : -1;
        }
    }
    private updateQuestionVisibleIndexes(questions: IQuestion[], showIndex: boolean) {
        var index = 0;
        for (var i = 0; i < questions.length; i++) {
            questions[i].setVisibleIndex(showIndex && questions[i].visible && questions[i].hasTitle ? (index++) : -1);
        }
    }
    private isLoadingFromJsonValue = false;
    /**
     * Returns true if the survey is loading from Json at the current moment.
     */
    public get isLoadingFromJson() { return this.isLoadingFromJsonValue; }
    private setJsonObject(jsonObj: any) {
        if (!jsonObj) return;
        this.jsonErrors = null;
        this.isLoadingFromJsonValue = true;
        var jsonConverter = new JsonObject();
        jsonConverter.toObject(jsonObj, this);
        if (jsonConverter.errors.length > 0) {
            this.jsonErrors = jsonConverter.errors;
        }
        this.runConditions();
        this.updateVisibleIndexes();
        this.updateProcessedTextValues();
        this.isLoadingFromJsonValue = false;
        if (this.hasCookie) {
            this.doComplete();
        }
        this.doElementsOnLoad();
    }
    protected onBeforeCreating() { }
    protected onCreating() { }
    private updateProcessedTextValues() {
        this.processedTextValues = {};
        var self = this;
        this.processedTextValues["pageno"] = function (name) { return self.currentPage != null ? self.visiblePages.indexOf(self.currentPage) + 1 : 0; }
        this.processedTextValues["pagecount"] = function (name) { return self.visiblePageCount; }
        var questions = this.getAllQuestions();
        for (var i = 0; i < questions.length; i++) {
            this.addQuestionToProcessedTextValues(questions[i]);
        }
    }
    private addQuestionToProcessedTextValues(question: IQuestion) {
        this.processedTextValues[question.name.toLowerCase()] = "question";
    }
    private hasProcessedTextValue(name: string): boolean {
        var firstName = new ProcessValue().getFirstName(name);
        return this.processedTextValues[firstName.toLowerCase()];
    }
    private getProcessedTextValue(name: string): any {
        var firstName = new ProcessValue().getFirstName(name);
        var val = this.processedTextValues[firstName.toLowerCase()];
        if (!val) return null;
        if (val == "variable") {
            return this.getVariable(name.toLowerCase());
        }
        if (val == "question") {
            var question = this.getQuestionByName(firstName, true);
            if (!question) return null;
            name = question.name + name.substr(firstName.length);
            return new ProcessValue().getValue(name, this.valuesHash);
        }
        if (val == "value") {
            return new ProcessValue().getValue(name, this.valuesHash);
        }
        return val(name);
    }
    private clearUnusedValues() {
        var questions = this.getAllQuestions();
        for (var i: number = 0; i < questions.length; i++) {
            questions[i].clearUnusedValues();
        }
        if (this.clearInvisibleValues) {
            this.clearInvisibleQuestionValues();
        }
    }
    private clearInvisibleQuestionValues() {
        var questions = this.getAllQuestions();
        for (var i: number = 0; i < questions.length; i++) {
            if (questions[i].visible) continue;
            this.clearValue(questions[i].name);
        }
    }
    /**
     * Returns a variable value. Variable, unlike values, are not stored in the survey results.
     * @param name A variable name
     * @see SetVariable
     */
    public getVariable(name: string): any {
        if (!name) return null;
        return this.variablesHash[name];
    }
    /**
     * Sets a variable value. Variable, unlike values, are not stored in the survey results.
     * @param name A variable name
     * @param newValue 
     * @see GetVariable
     */
    public setVariable(name: string, newValue: any) {
        if (!name) return;
        this.variablesHash[name] = newValue;
        this.processedTextValues[name.toLowerCase()] = "variable";
    }
    //ISurvey data
    protected getUnbindValue(value: any): any {
        if (value && value instanceof Object) {
            //do not return the same object instance!!!
            return JSON.parse(JSON.stringify(value));
        }
        return value;
    }
    /**
     * Returns a question value
     * @param name A question name
     * @see data
     * @see setValue
     */
    public getValue(name: string): any {
        if (!name || name.length == 0) return null;
        var value = this.valuesHash[name];
        return this.getUnbindValue(value);
    }
    /**
     * Sets a question value. It runs all triggers and conditions (visibleIf properties). Goes to the next page if goNextPageAutomatic is true and all questions on the current page are answered correctly.
     * @param name A question name
     * @param newValue
     * @see data
     * @see getValue
     * @see PageModel.visibleIf
     * @see QuestionBase.visibleIf
     * @see goNextPageAutomatic
     */
    public setValue(name: string, newValue: any) {
        if (this.isValueEqual(name, newValue)) return;
        if (newValue === "" || newValue === null) {
            delete this.valuesHash[name];
        } else {
            newValue = this.getUnbindValue(newValue);
            this.valuesHash[name] = newValue;
            this.processedTextValues[name.toLowerCase()] = "value";
        }
        this.notifyQuestionOnValueChanged(name, newValue);
        this.checkTriggers(name, newValue, false);
        this.runConditions();
        this.tryGoNextPageAutomatic(name);
    }
    private isValueEqual(name: string, newValue: any): boolean {
        if (newValue == "") newValue = null;
        var oldValue = this.getValue(name);
        if (newValue === null || oldValue === null) return newValue === oldValue;
        return this.isTwoValueEquals(newValue, oldValue);
    }
    protected tryGoNextPageAutomatic(name: string) {
        if (!this.goNextPageAutomatic || !this.currentPage) return;
        var question = this.getQuestionByName(name);
        if (question && (!question.visible || !question.supportGoNextPageAutomatic())) return;
        var questions = this.getCurrentPageQuestions();
        for (var i = 0; i < questions.length; i++) {
            var value = this.getValue(questions[i].name)
            if (questions[i].hasInput && Base.isValueEmpty(value)) return;
        }
        if (!this.currentPage.hasErrors(true, false)) {
            if (!this.isLastPage) {
                this.nextPage();
            } else {
                this.completeLastPage();
            }
        }
    }
    /**
     * Returns the comment value
     * @param name 
     * @see setComment
     */
    public getComment(name: string): string {
        var result = this.data[name + this.commentPrefix];
        if (result == null) result = "";
        return result;
    }
    /**
     * Set the comment value
     * @param name 
     * @param newValue
     * @see getComment 
     */
    public setComment(name: string, newValue: string) {
        var commentName = name + this.commentPrefix;
        if (newValue === "" || newValue === null) {
            delete this.valuesHash[commentName];
        } else {
            this.valuesHash[commentName] = newValue;
            this.tryGoNextPageAutomatic(name);
        }
        var question = this.getQuestionByName(name);
        if(question) {
            this.onValueChanged.fire(this, { 'name': commentName, 'question': question, 'value': newValue });
        }
    }
    /**
     * Remove the value from the survey result.
     * @param {string} name The name of the value. Typically it is a question name
     */
    public clearValue(name: string) {
        this.setValue(name, null);
        this.setComment(name, null);
    }
    questionVisibilityChanged(question: IQuestion, newValue: boolean) {
        this.updateVisibleIndexes();
        this.onVisibleChanged.fire(this, { 'question': question, 'name': question.name, 'visible': newValue });
        this.checkPageVisibility(question, !newValue);
    }
    pageVisibilityChanged(page: IPage, newValue: boolean) {
        this.updateVisibleIndexes();
        this.onPageVisibleChanged.fire(this, { 'page': page, 'visible': newValue });
    }
    questionAdded(question: IQuestion, index: number, parentPanel: any, rootPanel: any) {
        this.updateVisibleIndexes();
        this.addQuestionToProcessedTextValues(question);
        this.onQuestionAdded.fire(this, { 'question': question, 'name': question.name, 'index': index, 'parentPanel': parentPanel, 'rootPanel': rootPanel });
    }
    questionRemoved(question: IQuestion) {
        this.updateVisibleIndexes();
        this.onQuestionRemoved.fire(this, { 'question': question, 'name': question.name });
    }
    panelAdded(panel: IElement, index: number, parentPanel: any, rootPanel: any) {
        this.updateVisibleIndexes();
        this.onPanelAdded.fire(this, { 'panel': panel, 'name': panel.name, 'index': index, 'parentPanel': parentPanel, 'rootPanel': rootPanel });
    }
    panelRemoved(panel: IElement) {
        this.updateVisibleIndexes();
        this.onPanelRemoved.fire(this, { 'panel': panel, 'name': panel.name });
    }
    validateQuestion(name: string): SurveyError {
        if (this.onValidateQuestion.isEmpty) return null;
        var options = { name: name, value: this.getValue(name), error: null };
        this.onValidateQuestion.fire(this, options);
        return options.error ? new CustomError(options.error) : null;
    }
    processHtml(html: string): string {
        var options = { html: html };
        this.onProcessHtml.fire(this, options);
        return this.processText(options.html);
    }
    processText(text: string): string {
        return this.textPreProcessor.process(text);
    }
    processTextEx(text: string): any {
        var res = {text : this.textPreProcessor.process(text),  hasAllValuesOnLastRun: true};
        res.hasAllValuesOnLastRun = this.textPreProcessor.hasAllValuesOnLastRun;
        return res;
    }
    //ISurveyTriggerOwner
    getObjects(pages: string[], questions: string[]): any[]{
        var result = [];
        Array.prototype.push.apply(result, this.getPagesByNames(pages));
        Array.prototype.push.apply(result, this.getQuestionsByNames(questions));
        return result;
    }
    setTriggerValue(name: string, value: any, isVariable: boolean) {
        if (!name) return;
        if (isVariable) {
            this.setVariable(name, value);
        } else {
            this.setValue(name, value);
        }
    }
}

//Make localizable: completedHtml, pagePrevText, pageNextText, completeText

JsonObject.metaData.addClass("survey", [{ name: "locale", choices: () => { return surveyLocalization.getLocales() } },
    {name: "title", serializationProperty: "locTitle"}, { name: "focusFirstQuestionAutomatic:boolean", default: true},
    {name: "completedHtml:html", serializationProperty: "locCompletedHtml"}, { name: "pages", className: "page", visible: false },
    { name: "questions", alternativeName: "elements", baseClassName: "question", visible: false, onGetValue: function (obj) { return null; }, onSetValue: function (obj, value, jsonConverter) { var page = obj.addNewPage(""); jsonConverter.toObject({ questions: value }, page); } },
    { name: "triggers:triggers", baseClassName: "surveytrigger", classNamePart: "trigger" },
    "surveyId", "surveyPostId", "cookieName", "sendResultOnPageNext:boolean",
    { name: "showNavigationButtons:boolean", default: true }, { name: "showTitle:boolean", default: true },
    { name: "showPageTitles:boolean", default: true }, { name: "showCompletedPage:boolean", default: true },
    "showPageNumbers:boolean", { name: "showQuestionNumbers", default: "on", choices: ["on", "onPage", "off"] },
    { name: "questionTitleLocation", default: "top", choices: ["top", "bottom"] },
    { name: "showProgressBar", default: "off", choices: ["off", "top", "bottom"] },
    { name: "mode", default: "edit", choices: ["edit", "display"] },
    { name: "storeOthersAsComment:boolean", default: true }, "goNextPageAutomatic:boolean", "clearInvisibleValues:boolean",
    { name: "pagePrevText", serializationProperty: "locPagePrevText"},
    { name: "pageNextText", serializationProperty: "locPageNextText"},
    { name: "completeText", serializationProperty: "locCompleteText"},
    { name: "requiredText", default: "*" }, "questionStartIndex", {name: "questionTitleTemplate", serializationProperty: "locQuestionTitleTemplate"}]);
