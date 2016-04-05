/// <reference path="base.ts" />
/// <reference path="trigger.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="template.ko.html.ts" />
/// <reference path="dxSurveyService.ts" />

module Survey {
    export class Survey extends Base implements ISurvey, ISurveyTriggerOwner {
        public surveyId: string = null;
        public surveyPostId: string = null;
        public clientId: string = null;
        public sendResultOnPageNext: boolean = false;

        public commentPrefix: string = "-Comment";
        public title: string = "";
        public showNavigationButtons: boolean = true;
        public showTitle: boolean = true;
        public showPageTitles: boolean = true;
        public showPageNumbers: boolean = false;
        public showQuestionNumbers: string = "on";
        public requiredText: string = "* ";
        public pagePrevText: string = "Previous";
        public pageNextText: string = "Next";
        public completeText: string = "Complete";
        //public showProgressBar: boolean = false; TODO
        public pages: Array<Page> = new Array<Page>();
        public triggers: Array<SurveyTrigger> = new Array<SurveyTrigger>();
        private currentPageValue: Page = null;
        private valuesHash: HashTable<any> = {};
        private renderedElement: HTMLElement;

        public onComplete: Event<(sender: Survey) => any, any> = new Event<(sender: Survey) => any, any>();
        public onRendered: Event<(sender: Survey) => any, any> = new Event<(sender: Survey) => any, any>();
        public onCurrentPageChanged: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();
        public onValueChanged: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();
        public onVisibleChanged: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();
        public onQuestionAdded: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();
        public onQuestionRemoved: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();
        public onValidateQuestion: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();
        public onSendResult: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();
        public onGetResult: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();
        public jsonErrors: Array<JsonError> = null;

        public mode: string = "normal";

        koCurrentPage: any; koIsFirstPage: any; koIsLastPage: any; dummyObservable: any; 

        constructor(jsonObj: any = null, renderedElement: any = null) {
            super();
            var self = this;
            this.pages.push = function (value) {
                value.data = self;
                return Array.prototype.push.call(this, value);
            };
            this.triggers.push = function (value) {
                value.setOwner(self);
                return Array.prototype.push.call(this, value);
            };
            if (ko) {
                this.dummyObservable = ko.observable(0);
                this.koCurrentPage = ko.computed(function () { self.dummyObservable(); return self.currentPage; });
                this.koIsFirstPage = ko.computed(function () { self.dummyObservable(); return self.isFirstPage; });
                this.koIsLastPage = ko.computed(function () { self.dummyObservable(); return self.isLastPage; });
            }
            if (jsonObj) {
                this.setJsonObject(jsonObj);
                if (this.surveyId) {
                    this.loadSurveyFromService(this.surveyId, renderedElement);
                }
            }
            this.onCreating();
            this.render(renderedElement);
        }
        public getType(): string { return "survey"; }
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
                    this.checkTriggers(key, data[key]);
                }
            }
            this.notifyAllQuestionsOnValueChanged();
        }
        public get comments(): any {
            var result = {};
            for (var key in this.valuesHash) {
                if (key.indexOf(this.commentPrefix) > -1) {
                    result[key] = this.valuesHash[key];
                }
            }
            return result;
        }
        get visiblePages(): Array<Page> {
            if (this.isDesignMode) return this.pages;
            var result = new Array<Page>();
            for (var i = 0; i < this.pages.length; i++) {
                if (this.pages[i].isVisible) {
                    result.push(this.pages[i]);
                }
            }
            return result;
        }
        get isEmpty(): boolean { return this.pages.length == 0; }
        get PageCount(): number {
            return this.pages.length;
        }
        get visiblePageCount(): number {
            return this.visiblePages.length;
        }
        get currentPage(): Page {
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
        set currentPage(value: Page) {
            var vPages = this.visiblePages;
            if (value != null && vPages.indexOf(value) < 0) return;
            if (value == this.currentPageValue) return;
            var oldValue = this.currentPageValue;
            this.currentPageValue = value;
            this.updateKoCurrentPage();
            this.onCurrentPageChanged.fire(this, { 'oldCurrentPage': oldValue, 'newCurrentPage': value });
        }
        public get isDesignMode(): boolean { return this.mode == "designer"; }
        private updateKoCurrentPage() {
            if (this.isKO) {
                this.dummyObservable(this.dummyObservable() + 1);
            }
        }
        nextPage(): boolean {
            if (this.isLastPage) return false;
            if (this.isCurrentPageHasErrors) return false;
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
            return this.currentPage.hasErrors();
        }
        prevPage(): boolean {
            if (this.isFirstPage) return false;
            var vPages = this.visiblePages;
            var index = vPages.indexOf(this.currentPage);
            this.currentPage = vPages[index - 1];
        }
        completeLastPage() : boolean {
            if (this.isCurrentPageHasErrors) return false;
            this.onComplete.fire(this, null);
            if (this.surveyPostId) {
                this.sendResult();
            }
            return true;
        }
        get isFirstPage() {
            if (this.currentPage == null) return true;
            return this.visiblePages.indexOf(this.currentPage) == 0;
        }
        get isLastPage() {
            if (this.currentPage == null) return true;
            var vPages = this.visiblePages;
            return vPages.indexOf(this.currentPage) == vPages.length - 1;
        }
        getPage(index: number): Page {
            return this.pages[index];
        }
        addPage(page: Page) {
            if (page == null) return;
            this.pages.push(page);
        }
        addNewPage(name: string) {
            var page = new Page(name);
            this.addPage(page);
            return page;
        }
        removePage(page: Page) {
            var index = this.pages.indexOf(page);
            if (index < 0) return;
            this.pages.splice(index, 1);
            if (this.currentPageValue == page) {
                this.currentPage = this.pages.length > 0 ? this.pages[0] : null;
            }
        }
        public getQuestionByName(name: string): IQuestion {
            var questions = this.getAllQuestions();
            for (var i: number = 0; i < questions.length; i++) {
                if(questions[i].name == name) return questions[i];
            }
            return null;
        }
        public getQuestionsByNames(names: string[]): IQuestion[] {
            var result = [];
            if (!names) return result;
            for (var i: number = 0; i < names.length; i++) {
                if (!names[i]) continue;
                var question = this.getQuestionByName(names[i]);
                if (question) result.push(question);
            }
            return result;
        }
        public getPageByQuestion(question: IQuestion): Page {
            for (var i: number = 0; i < this.pages.length; i++) {
                var page = this.pages[i];
                if (page.questions.indexOf(<Question>question) > -1) return page;
            }
            return null;
        }
        public getPageByName(name: string): Page {
            for (var i: number = 0; i < this.pages.length; i++) {
                if (this.pages[i].name == name) return this.pages[i];
            }
            return null;
        }
        public getPagesByNames(names: string[]): Page[]{
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
        private notifyQuestionOnValueChanged(name: string, newValue: any) {
            var questions = this.getAllQuestions();
            for (var i: number = 0; i < questions.length; i++) {
                if (questions[i].name != name) continue;
                questions[i].onSurveyValueChanged(newValue);
            }
            this.onValueChanged.fire(this, { 'name': name, 'value': newValue });
        }
        private notifyAllQuestionsOnValueChanged() {
            var questions = this.getAllQuestions();
            for (var i: number = 0; i < questions.length; i++) {
                questions[i].onSurveyValueChanged(this.getValue(questions[i].name));
            }
        }
        private checkTriggers(name: string, newValue: any) {
            for (var i: number = 0; i < this.triggers.length; i++) {
                if (this.triggers[i].name == name) {
                    this.triggers[i].check(newValue);
                }
            }
        }
        public render(element: any = null) {
            var self = this;
            if (element && typeof element == "string") {
                    element = document.getElementById(element);
            }
            if (element) {
                this.renderedElement = element;
            }
            element = this.renderedElement;
            if (!element || this.isEmpty) return;
            this.onBeforeRender();
            if (this.isKO) {
                element.innerHTML = template.ko.html;
                self.applyBinding();
            }
            self.onRendered.fire(self, {});
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
        public loadSurveyFromService(surveyId: string = null, element: any = null) {
            if (surveyId) {
                this.surveyId = surveyId;
            }
            var self = this;
            new dxSurveyService().loadSurvey(this.surveyId, function (success: boolean, result: string, response: any) {
                if (success && result) {
                    self.setJsonObject(result);
                    self.render(element);
                }
            });
        }
        onBeforeRender() {
            this.updateVisibleIndexes();
        }
        private applyBinding() {
            if (!this.isKO || this.renderedElement == null) return;
            this.updateKoCurrentPage();
            ko.cleanNode(this.renderedElement);
            ko.applyBindings(this, this.renderedElement);
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
                questions[i].setVisibleIndex(showIndex && questions[i].visible ? (index++) : -1);
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
        }
        protected onCreating() { }
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
            }
            this.notifyQuestionOnValueChanged(name, newValue);
            this.checkTriggers(name, newValue);
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
        questionAdded(question: IQuestion, index: number) {
            this.onQuestionAdded.fire(this, { 'question': question, 'name': question.name, 'index': index });
        }
        questionRemoved(question: IQuestion) {
            this.onQuestionRemoved.fire(this, { 'question': question, 'name': question.name });
        }

        validateQuestion(name: string): SurveyError {
            if (this.onValidateQuestion.isEmpty) return null;
            var options = { name: name, value: this.getValue(name), error: null };
            this.onValidateQuestion.fire(this, options);
            return options.error ? new CustomError(options.error) : null;
        }
        //ISurveyTriggerOwner
        getObjects(pages: string[], questions: string[]): any[]{
            var result = [];
            Array.prototype.push.apply(result, this.getPagesByNames(pages));
            Array.prototype.push.apply(result, this.getQuestionsByNames(questions));
            return result;
        }
    }

    JsonObject.metaData.addClass("survey", ["title", "pages", "questions", "triggers:triggers", "surveyId", "surveyPostId", "sendResultOnPageNext:boolean",
        "showNavigationButtons:boolean", "showTitle:boolean", "showPageTitles:boolean", "showPageNumbers:boolean", "showQuestionNumbers",
        "requiredText", "pagePrevText", "pageNextText", "completeText"]);
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
    JsonObject.metaData.setPropertyValues("survey", "requiredText", null, "* ");
    JsonObject.metaData.setPropertyValues("survey", "pagePrevText", null, "Previous");
    JsonObject.metaData.setPropertyValues("survey", "pageNextText", null, "Next");
    JsonObject.metaData.setPropertyValues("survey", "completeText", null, "Complete");
    JsonObject.metaData.setPropertyClassInfo("survey", "triggers", "surveytrigger", "trigger");
    JsonObject.metaData.setPropertyClassInfo("survey", "questions", "question");
}