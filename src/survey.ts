/// <reference path="base.ts" />
/// <reference path="page.ts" />
/// <reference path="trigger.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="dxSurveyService.ts" />
/// <reference path="textPreProcessor.ts" />

module Survey {
    export class SurveyModel extends Base implements ISurvey, ISurveyTriggerOwner {
        public surveyId: string = null;
        public surveyPostId: string = null;
        public clientId: string = null;
        public cookieName: string = null;
        public sendResultOnPageNext: boolean = false;

        public commentPrefix: string = "-Comment";
        public title: string = "";
        public showNavigationButtons: boolean = true;
        public showTitle: boolean = true;
        public showPageTitles: boolean = true;
        public completedHtml: string = "";
        public requiredText: string = "* ";
        public showProgressBar: string = "off";
        public storeOthersAsComment: boolean = true;
        public pages: Array<PageModel> = new Array<PageModel>();
        public triggers: Array<SurveyTrigger> = new Array<SurveyTrigger>();
        private currentPageValue: PageModel = null;
        private valuesHash: HashTable<any> = {};
        private variablesHash: HashTable<any> = {};
        private pagePrevTextValue: string;
        private pageNextTextValue: string;
        private completeTextValue: string;
        private showPageNumbersValue: boolean = false;
        private showQuestionNumbersValue: string = "on";
        private localeValue: string = "";
        private isCompleted: boolean = false;
        private isLoading: boolean = false;
        private processedTextValues: HashTable<any> = {};
        private textPreProcessor: TextPreProcessor;

        public onComplete: Event<(sender: SurveyModel) => any, any> = new Event<(sender: SurveyModel) => any, any>();
        public onCurrentPageChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onValueChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onVisibleChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onPageVisibleChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onQuestionAdded: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onQuestionRemoved: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onValidateQuestion: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onProcessHtml: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onSendResult: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onGetResult: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onUploadFile: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public jsonErrors: Array<JsonError> = null;

        public mode: string = "normal";


        constructor(jsonObj: any = null) {
            super();
            var self = this;
            this.textPreProcessor = new TextPreProcessor();
            this.textPreProcessor.onHasValue = function (name: string) { return self.processedTextValues[name.toLowerCase()]; };
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
        }
        public getLocString(str: string) { return surveyLocalization.getString(str); }
        public get emptySurveyText(): string { return this.getLocString("emptySurvey"); }
        public get pagePrevText() { return (this.pagePrevTextValue) ? this.pagePrevTextValue : this.getLocString("pagePrevText"); }
        public set pagePrevText(newValue: string) { this.pagePrevTextValue = newValue; }
        public get pageNextText() { return (this.pageNextTextValue) ? this.pageNextTextValue : this.getLocString("pageNextText"); }
        public set pageNextText(newValue: string) { this.pageNextTextValue = newValue; }
        public get completeText() { return (this.completeTextValue) ? this.completeTextValue : this.getLocString("completeText"); }
        public set completeText(newValue: string) { this.completeTextValue = newValue; }
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
                    this.valuesHash[key] = data[key];
                    this.checkTriggers(key, data[key], false);
                }
            }
            this.notifyAllQuestionsOnValueChanged();
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
            this.currentPageChanged(value, oldValue);
            
        }
        public get state(): string {
            if (this.isLoading) return "loading";
            if (this.isCompleted) return "completed";
            return (this.currentPage) ? "running" : "empty"
        }
        public clear() {
            this.data = null;
            this.variablesHash = {};
            this.isCompleted = false;
            if (this.visiblePageCount > 0) {
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
        protected currentPageChanged(newValue: PageModel, oldValue: PageModel) {
            this.onCurrentPageChanged.fire(this, { 'oldCurrentPage': oldValue, 'newCurrentPage': newValue });
        }
        public getProgress(): number {
            if (this.currentPage == null) return 0;
            var index = this.visiblePages.indexOf(this.currentPage) + 1;
            return Math.ceil((index * 100 / this.visiblePageCount));
        }
        public get isDesignMode(): boolean { return this.mode == "designer"; }
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
            if (this.isCurrentPageHasErrors) return false;
            this.checkOnPageTriggers();
            if (this.sendResultOnPageNext && this.clientId) {
                this.sendResult(this.surveyPostId, this.clientId, true);
            }
            var vPages = this.visiblePages;
            var index = vPages.indexOf(this.currentPage);
            this.currentPage = vPages[index + 1];
            return true;
        }
        get isCurrentPageHasErrors(): boolean {
            if (this.currentPage == null) return true;
            return this.currentPage.hasErrors(true);
        }
        public prevPage(): boolean {
            if (this.isFirstPage) return false;
            var vPages = this.visiblePages;
            var index = vPages.indexOf(this.currentPage);
            this.currentPage = vPages[index - 1];
        }
        public completeLastPage() : boolean {
            if (this.isCurrentPageHasErrors) return false;
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
            this.setCookie();
            this.setCompleted();
            this.onComplete.fire(this, null);
            if (this.surveyPostId) {
                this.sendResult();
            }
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
        public getPageByQuestion(question: IQuestion): PageModel {
            for (var i: number = 0; i < this.pages.length; i++) {
                var page = this.pages[i];
                if (page.questions.indexOf(<QuestionBase>question) > -1) return page;
            }
            return null;
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
            var page = this.currentPage;
            for (var i = 0; i < page.questions.length; i++) {
                var question = page.questions[i];
                if (!question.visible || !question.name) continue;
                var value = this.getValue(question.name);
                this.checkTriggers(question.name, value, true);
            }
        }
        private checkTriggers(name: string, newValue: any, isOnNextPage: boolean) {
            for (var i: number = 0; i < this.triggers.length; i++) {
                var trigger = this.triggers[i];
                if (trigger.name == name && trigger.isOnNextPage == isOnNextPage) {
                    trigger.check(newValue);
                }
            }
        }
        public sendResult(postId: string = null, clientId: string = null, isPartialCompleted: boolean = false) {
            if (!postId && this.surveyPostId) {
                postId = this.surveyPostId;
            }
            if (!postId) return;
            if (clientId) {
                this.clientId = clientId;
            }
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
        private setJsonObject(jsonObj: any) {
            if (!jsonObj) return;
            this.jsonErrors = null;
            var jsonConverter = new JsonObject();
            jsonConverter.toObject(jsonObj, this);
            if (jsonConverter.errors.length > 0) {
                this.jsonErrors = jsonConverter.errors;
            }
            this.updateProcessedTextValues();
            if (this.hasCookie) {
                this.doComplete();
            }
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
        private getProcessedTextValue(name: string): any {
            var name = name.toLowerCase();
            var val = this.processedTextValues[name];
            if (!val) return null;
            if (val == "question") {
                var question = this.getQuestionByName(name, true);
                return question != null ? this.getValue(question.name) : null;
            }
            if (val == "value") {
                return this.getValue(name);
            }
            if (val == "variable") {
                return this.getVariable(name);
            }
            return val(name);
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
        getValue(name: string): any {
            if (!name || name.length == 0) return null;
            return this.valuesHash[name];
        }
        setValue(name: string, newValue: any) {
            if (newValue == "" || newValue == null) {
                delete this.valuesHash[name];
            } else {
                this.valuesHash[name] = newValue;
                this.processedTextValues[name.toLowerCase()] = "value";
            }
            this.notifyQuestionOnValueChanged(name, newValue);
            this.checkTriggers(name, newValue, false);
        }
        getComment(name: string): string {
            var result = this.data[name + this.commentPrefix];
            if (result == null) result = "";
            return result;
        }
        setComment(name: string, newValue: string) {
            name = name + this.commentPrefix;
            if (newValue == "" || newValue == null) {
                delete this.valuesHash[name];
            } else {
                this.valuesHash[name] = newValue;
            }
        }
        questionVisibilityChanged(question: IQuestion, newValue: boolean) {
            this.updateVisibleIndexes();
            this.onVisibleChanged.fire(this, { 'question': question, 'name': question.name, 'visible': newValue });
        }
        pageVisibilityChanged(page: IPage, newValue: boolean) {
            this.updateVisibleIndexes();
            this.onPageVisibleChanged.fire(this, { 'page': page, 'visible': newValue });
        }
        questionAdded(question: IQuestion, index: number) {
            this.updateVisibleIndexes();
            this.addQuestionToProcessedTextValues(question);
            this.onQuestionAdded.fire(this, { 'question': question, 'name': question.name, 'index': index });
        }
        questionRemoved(question: IQuestion) {
            this.updateVisibleIndexes();
            this.onQuestionRemoved.fire(this, { 'question': question, 'name': question.name });
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

    JsonObject.metaData.addClass("survey", ["locale", "title", "completedHtml:html", "pages", "questions", "triggers:triggers", "surveyId", "surveyPostId", "cookieName", "sendResultOnPageNext:boolean",
        "showNavigationButtons:boolean", "showTitle:boolean", "showPageTitles:boolean", "showPageNumbers:boolean", "showQuestionNumbers", "showProgressBar",
        "storeOthersAsComment:boolean", "requiredText", "pagePrevText", "pageNextText", "completeText"]);
    JsonObject.metaData.setPropertyValues("survey", "pages", "page");
    JsonObject.metaData.setPropertyValues("survey", "questions", null, null,
        function (obj) { return null; },
        function (obj, value, jsonConverter) {
            var page = obj.addNewPage("");
            jsonConverter.toObject({ questions: value }, page);
        });
    JsonObject.metaData.setPropertyValues("survey", "showNavigationButtons", null, true);
    JsonObject.metaData.setPropertyValues("survey", "showTitle", null, true);
    JsonObject.metaData.setPropertyValues("survey", "showPageTitles", null, true);
    JsonObject.metaData.setPropertyValues("survey", "showQuestionNumbers", null, "on");
    JsonObject.metaData.setPropertyChoices("survey", "showQuestionNumbers", ["on", "onPage", "off"]);
    JsonObject.metaData.setPropertyValues("survey", "showProgressBar", null, "off");
    JsonObject.metaData.setPropertyChoices("survey", "showProgressBar", ["off", "top", "bottom"]);
    JsonObject.metaData.setPropertyValues("survey", "storeOthersAsComment", null, true);
    JsonObject.metaData.setPropertyValues("survey", "requiredText", null, "* ");
    JsonObject.metaData.setPropertyValues("survey", "pagePrevText", null, null, function (obj: any) { return obj.pagePrevTextValue; });
    JsonObject.metaData.setPropertyValues("survey", "pageNextText", null, null, function (obj: any) { return obj.pageNextTextValue; });
    JsonObject.metaData.setPropertyValues("survey", "completeText", null, null, function (obj: any) { return obj.completeTextValue; });
    JsonObject.metaData.setPropertyClassInfo("survey", "triggers", "surveytrigger", "trigger");
    JsonObject.metaData.setPropertyClassInfo("survey", "questions", "question");
    JsonObject.metaData.setPropertyChoices("survey", "locale", null, () => { return surveyLocalization.getLocales() });
}