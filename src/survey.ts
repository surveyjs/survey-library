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

export class SurveyModel extends Base implements ISurvey, ISurveyTriggerOwner, ILocalizableOwner {
    public surveyId: string = null;
    public surveyPostId: string = null;
    public clientId: string = null;
    public cookieName: string = null;
    public sendResultOnPageNext: boolean = false;

    public commentPrefix: string = "-Comment";
    public focusFirstQuestionAutomatic: boolean = true;
    public showNavigationButtons: boolean = true;
    public showTitle: boolean = true;
    public showPageTitles: boolean = true;
    public showCompletedPage: boolean = true;
    public requiredText: string = "*";
    public questionStartIndex: string = "";
    public showProgressBar: string = "off";
    public storeOthersAsComment: boolean = true;
    public goNextPageAutomatic: boolean = false;
    public pages: Array<PageModel> = new Array<PageModel>();
    public triggers: Array<SurveyTrigger> = new Array<SurveyTrigger>();
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

    public onComplete: Event<(sender: SurveyModel) => any, any> = new Event<(sender: SurveyModel) => any, any>();
    public onPartialSend: Event<(sender: SurveyModel) => any, any> = new Event<(sender: SurveyModel) => any, any>();
    public onCurrentPageChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onValueChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onVisibleChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onPageVisibleChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onQuestionAdded: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onQuestionRemoved: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onPanelAdded: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onPanelRemoved: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onValidateQuestion: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onServerValidateQuestions: (sender: SurveyModel, options: any) => any;
    public onProcessHtml: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onTextMarkdown: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onSendResult: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onGetResult: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onUploadFile: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onAfterRenderSurvey: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onAfterRenderPage: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onAfterRenderQuestion: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public onAfterRenderPanel: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
    public jsonErrors: Array<JsonError> = null;

    constructor(jsonObj: any = null) {
        super();
        var self = this;
        this.locTitleValue = new LocalizableString(this);
        this.locTitleValue.onRenderedHtmlCallback = function(text) { return self.processedTitle; };
        this.locCompletedHtmlValue = new LocalizableString(this);
        this.locPagePrevTextValue = new LocalizableString(this);
        this.locPageNextTextValue = new LocalizableString(this);
        this.locCompleteTextValue = new LocalizableString(this);
        this.locQuestionTitleTemplateValue = new LocalizableString(this);
        
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
    public get locale(): string { return this.localeValue; }
    public set locale(value: string) {
        this.localeValue = value;
        surveyLocalization.currentLocale = value;
        for(var i = 0; i < this.pages.length; i ++) {
            this.pages[i].onLocaleChanged();
        }
    }
    //ILocalizableOwner
    public getLocale() { return this.locale; }
    public getMarkdownHtml(text: string)  { 
        var options = {text: text, html: null}
        this.onTextMarkdown.fire(this, options);
        return options.html; 
    }
    public getLocString(str: string) { return surveyLocalization.getString(str); }

    public get emptySurveyText(): string { return this.getLocString("emptySurvey"); }
    public get title(): string { return this.locTitle.text; }
    public set title(value: string) { this.locTitle.text = value; }
    public get locTitle(): LocalizableString { return this.locTitleValue; }
    public get completedHtml(): string { return this.locCompletedHtml.text;}
    public set completedHtml(value: string) { this.locCompletedHtml.text = value;}
    public get locCompletedHtml(): LocalizableString { return this.locCompletedHtmlValue;}
    public get pagePrevText(): string { return this.locPagePrevText.text ? this.locPagePrevText.text : this.getLocString("pagePrevText"); }
    public set pagePrevText(newValue: string) { this.locPagePrevText.text = newValue; }
    public get locPagePrevText(): LocalizableString { return this.locPagePrevTextValue;}
    public get pageNextText(): string { return this.locPageNextText.text ? this.locPageNextText.text : this.getLocString("pageNextText"); }
    public set pageNextText(newValue: string) { this.locPageNextText.text = newValue; }
    public get locPageNextText(): LocalizableString { return this.locPageNextTextValue;}
    public get completeText(): string { return this.locCompleteText.text ? this.locCompleteText.text : this.getLocString("completeText"); }
    public set completeText(newValue: string) { this.locCompleteText.text = newValue; }
    public get locCompleteText(): LocalizableString { return this.locCompleteTextValue;}
    public get questionTitleTemplate(): string { return this.locQuestionTitleTemplate.text;}
    public set questionTitleTemplate(value: string) { this.locQuestionTitleTemplate.text = value;}
    public getQuestionTitleTemplate(): string { return this.locQuestionTitleTemplate.textOrHtml; }
    public get locQuestionTitleTemplate(): LocalizableString { return this.locQuestionTitleTemplateValue; }

    public get showPageNumbers(): boolean { return this.showPageNumbersValue; }
    public set showPageNumbers(value: boolean) {
        if (value === this.showPageNumbers) return;
        this.showPageNumbersValue = value;
        this.updateVisibleIndexes();
    }
    public get showQuestionNumbers(): string { return this.showQuestionNumbersValue; };
    public set showQuestionNumbers(value: string) {
        if (value === this.showQuestionNumbers) return;
        this.showQuestionNumbersValue = value;
        this.updateVisibleIndexes();
    };
    public get processedTitle() { return this.processText(this.locTitle.textOrHtml); }
    public get questionTitleLocation(): string { return this.questionTitleLocationValue; };
    public set questionTitleLocation(value: string) {
        if (value === this.questionTitleLocationValue) return;
        this.questionTitleLocationValue = value;
    };
    public get mode(): string { return this.modeValue; }
    public set mode(value: string) {
        if (value == this.mode) return;
        if (value != "edit" && value != "display") return;
        this.modeValue = value;
    }
    public get data(): any {
        var result = {};
        for (var key in this.valuesHash) {
            result[key] = this.valuesHash[key];
        }
        return result;
    }
    protected _setDataValue(data: any, key: string) {
        this.valuesHash[key] = data[key];
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
    public get comments(): any {
        var result = {};
        for (var key in this.valuesHash) {
            if (key.indexOf(this.commentPrefix) > 0) {
                result[key] = this.valuesHash[key];
            }
        }
        return result;
    }
    get visiblePages(): Array<PageModel> {
        if (this.isDesignMode) return this.pages;
        var result = new Array<PageModel>();
        for (var i = 0; i < this.pages.length; i++) {
            if (this.pages[i].isVisible) {
                result.push(this.pages[i]);
            }
        }
        return result;
    }
    public get isEmpty(): boolean { return this.pages.length == 0; }
    public get PageCount(): number {
        return this.pages.length;
    }
    public get visiblePageCount(): number {
        return this.visiblePages.length;
    }
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
    public get currentPageNo(): number {
        return this.visiblePages.indexOf(this.currentPage);
    }
    public set currentPageNo(value: number) {
        var vPages = this.visiblePages;
        if (value < 0 || value >= this.visiblePages.length) return;
        this.currentPage = this.visiblePages[value];
    }
    public focusFirstQuestion() {
        if (this.currentPageValue) {
            this.currentPageValue.scrollToTop();
            this.currentPageValue.focusFirstQuestion();
        }
    }
    public get state(): string {
        if (this.isLoading) return "loading";
        if (this.isCompleted) return "completed";
        return (this.currentPage) ? "running" : "empty"
    }
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
    public getProgress(): number {
        if (this.currentPage == null) return 0;
        var index = this.visiblePages.indexOf(this.currentPage) + 1;
        return Math.ceil((index * 100 / this.visiblePageCount));
    }
    public get isNavigationButtonsShowing(): boolean {
        if (this.isDesignMode) return false;
        var page = this.currentPage;
        if (!page) return false;
        return page.navigationButtonsVisibility == "show" ||
            (page.navigationButtonsVisibility != "hide" && this.showNavigationButtons);
    }
    public get isEditMode(): boolean { return this.mode == "edit"; }
    public get isDisplayMode(): boolean { return this.mode == "display"; }
    public get isDesignMode(): boolean { return this.isDesignModeValue; }
    public setDesignMode(value: boolean) {
        this.isDesignModeValue = value;
    }
    public get hasCookie(): boolean {
        if (!this.cookieName) return false;
        var cookies = document.cookie;
        return cookies && cookies.indexOf(this.cookieName + "=true") > -1;
    }
    public setCookie() {
        if (!this.cookieName) return;
        document.cookie = this.cookieName + "=true; expires=Fri, 31 Dec 9999 0:0:0 GMT";
    }
    public deleteCookie() {
        if (!this.cookieName) return;
        document.cookie = this.cookieName + "=;";
    }
    public nextPage(): boolean {
        if (this.isLastPage) return false;
        if (this.isEditMode && this.isCurrentPageHasErrors) return false;
        if (this.doServerValidation()) return false;
        this.doNextPage();
        return true;
    }
    get isCurrentPageHasErrors(): boolean {
        if (this.currentPage == null) return true;
        return this.currentPage.hasErrors(true, true);
    }
    public prevPage(): boolean {
        if (this.isFirstPage) return false;
        var vPages = this.visiblePages;
        var index = vPages.indexOf(this.currentPage);
        this.currentPage = vPages[index - 1];
    }
    public completeLastPage() : boolean {
        if (this.isEditMode && this.isCurrentPageHasErrors) return false;
        if (this.doServerValidation()) return false;
        this.doComplete();
        return true;
    }
    public get isFirstPage(): boolean { 
        if (this.currentPage == null) return true;
        return this.visiblePages.indexOf(this.currentPage) == 0;
    }
    public get isLastPage(): boolean {
        if (this.currentPage == null) return true;
        var vPages = this.visiblePages;
        return vPages.indexOf(this.currentPage) == vPages.length - 1;
    }
    public doComplete() {
        this.clearUnusedValues();
        this.setCookie();
        this.setCompleted();
        this.onComplete.fire(this, null);
        if (this.surveyPostId) {
            this.sendResult();
        }
    }
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
            if (value) options.data[question.name] = value;
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
    public get processedCompletedHtml(): string {
        if (this.completedHtml) {
            return this.processHtml(this.completedHtml);
        }
        return "<h3>" + this.getLocString("completingSurvey") + "</h3>";
    }
    public get processedLoadingHtml(): string {
        return "<h3>" + this.getLocString("loadingSurvey") + "</h3>";
    }
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
    addPage(page: PageModel) {
        if (page == null) return;
        this.pages.push(page);
        this.updateVisibleIndexes();
    }
    addNewPage(name: string) {
        var page = this.createNewPage(name);
        this.addPage(page);
        return page;
    }
    removePage(page: PageModel) {
        var index = this.pages.indexOf(page);
        if (index < 0) return;
        this.pages.splice(index, 1);
        if (this.currentPageValue == page) {
            this.currentPage = this.pages.length > 0 ? this.pages[0] : null;
        }
        this.updateVisibleIndexes();
    }
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
    public getPageByElement(element: IElement): PageModel {
        for (var i: number = 0; i < this.pages.length; i++) {
            var page = this.pages[i];
            if(page.containsElement(element)) return page;
        }
        return null;
    }
    public getPageByQuestion(question: IQuestion): PageModel {
        return this.getPageByElement(question);
    }
    public getPageByName(name: string): PageModel {
        for (var i: number = 0; i < this.pages.length; i++) {
            if (this.pages[i].name == name) return this.pages[i];
        }
        return null;
    }
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
        }
        this.onValueChanged.fire(this, { 'name': name, 'question': question, 'value': newValue });
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
    public getResult(resultId: string, name: string) {
        var self = this;
        new dxSurveyService().getResult(resultId, name, function (success: boolean, data: any, dataList: any[], response: any) {
            self.onGetResult.fire(self, { success: success, data: data, dataList: dataList, response: response });
        });
    }
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
        this.isLoadingFromJsonValue = false;
        this.updateProcessedTextValues();
        if (this.hasCookie) {
            this.doComplete();
        }
        this.doElementsOnLoad();
        this.runConditions();
        this.updateVisibleIndexes();
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
    public getVariable(name: string): any {
        if (!name) return null;
        return this.variablesHash[name];
    }
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
    public getValue(name: string): any {
        if (!name || name.length == 0) return null;
        var value = this.valuesHash[name];
        return this.getUnbindValue(value);
    }
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
            if (questions[i].hasInput && !this.getValue(questions[i].name)) return;
        }
        if (!this.currentPage.hasErrors(true, false)) {
            if (!this.isLastPage) {
                this.nextPage();
            } else {
                this.doComplete();
            }
        }
    }
    public getComment(name: string): string {
        var result = this.data[name + this.commentPrefix];
        if (result == null) result = "";
        return result;
    }
    public setComment(name: string, newValue: string) {
        name = name + this.commentPrefix;
        if (newValue === "" || newValue === null) {
            delete this.valuesHash[name];
        } else {
            this.valuesHash[name] = newValue;
            this.tryGoNextPageAutomatic(name);
        }
    }
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
    { name: "questions", baseClassName: "question", visible: false, onGetValue: function (obj) { return null; }, onSetValue: function (obj, value, jsonConverter) { var page = obj.addNewPage(""); jsonConverter.toObject({ questions: value }, page); } },
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