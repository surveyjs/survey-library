/// <reference path="base.ts" />
/// <reference path="trigger.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="template.ko.html.ts" />

module Survey {
    export class Survey extends Base implements ISurveyData, ISurveyTriggerOwner {
        public serviceUrl: string = "https://dxsurvey.azurewebsites.net/api/Survey";
        //public serviceUrl: string = "http://localhost:49891/api/Survey";
        public surveyId: string = null;
        public surveyPostId: string = null;
        public commentPrefix: string = "-Comment";
        public title: string = "";
        public showTitle: boolean = true;
        public showPageTitles: boolean = true;
        public showPageNumbers: boolean = false;
        public showQuestionNumbers: string = "on";
        public requiredText: string = "* ";
        //public showProgressBar: boolean = false; TODO
        public pages: Array<Page> = new Array<Page>();
        public triggers: Array<SurveyTrigger> = new Array<SurveyTrigger>();
        private currentPageValue: Page = null;
        private valuesHash: HashTable<any> = {};
        private renderedElement: HTMLElement;

        public onComplete: Event<(sender: Survey) => any, any> = new Event<(sender: Survey) => any, any>();
        public onValueChanged: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();
        public onVisibleChanged: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();
        public onValidateQuestion: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();
        public onSendResult: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();
        public onGetResult: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();
        public jsonErrors: Array<JsonError> = null;

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
                if (typeof key.endsWith === 'function' && key.endsWith(this.commentPrefix)) {
                    result[key] = this.valuesHash[key];
                }
            }
            return result;
        }
        get visiblePages(): Array<Page> {
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
            this.currentPageValue = value;
            this.updateKoCurrentPage();
        }
        private updateKoCurrentPage() {
            if (this.isKO) {
                this.dummyObservable(this.dummyObservable() + 1);
            }
        }
        nextPage(): boolean {
            if (this.isLastPage) return false;
            if (this.isCurrentPageHasErrors) return false;
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
        private getAllQuestions(visibleOnly: boolean = false): Array<IQuestion> {
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
        }
        public sendResult(postId: string = null) {
            if (postId) {
                this.surveyPostId = postId;
            } 
            var xhr = new XMLHttpRequest();
            xhr.open('POST', this.serviceUrl);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            var data: string = JSON.stringify({ postId: this.surveyPostId, surveyResult: JSON.stringify(this.data) });
            xhr.setRequestHeader('Content-Length', data.length.toString());
            var self = this;
            xhr.onload = function () {
                self.onSendResult.fire(self, { success: xhr.status == 200, response: xhr.response });
            };
            xhr.send(data);
        }
        public getResult(resultId: string, name: string) {
            var xhr = new XMLHttpRequest();
            var data = 'resultId=' + resultId + '&name=' + name;
            xhr.open('GET', this.serviceUrl + '/GetResult?' + data);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var self = this;
            xhr.onload = function () {
                var result = null;
                var list = null;
                if (xhr.status == 200) {
                    result = JSON.parse(xhr.response);
                    list = [];
                    for (var key in result.QuestionResult) {
                        var el = { name: key, value: result.QuestionResult[key] };
                        list.push(el);
                    }    
                }
                self.onGetResult.fire(self, { success: xhr.status == 200, data: result, dataList: list, response: xhr.response });
            };
            xhr.send();
        }
        public loadSurveyFromService(surveyId: string = null, element: any = null) {
            if (surveyId) {
                this.surveyId = surveyId;
            } 
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.serviceUrl + '/GetJson?surveyId=' + this.surveyId);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var self = this;
            xhr.onload = function () {
                if (xhr.status == 200) {
                    var result = JSON.parse(xhr.response);
                    if (result) {
                        self.setJsonObject(result);
                        self.render(element);
                    }
                }
            };
            xhr.send();
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
                this.pages[i].visibleIndex = showIndex && this.pages[i].visible ? (index++) : -1;
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
        onQuestionVisibilityChanged(name: string, newValue: boolean) {
            this.updateVisibleIndexes();
            this.onVisibleChanged.fire(this, { 'name': name, 'visible': newValue });
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

    JsonObject.metaData.addClass("survey", ["title", "pages", "questions", "triggers", "surveyId", "surveyPostId",
            "showTitle", "showPageTitles", "showPageNumbers", "showQuestionNumbers", "requiredText"]);
    JsonObject.metaData.setPropertyValues("survey", "pages", "page");
    JsonObject.metaData.setPropertyValues("survey", "questions", null, null,
        function (obj) { return null; },
        function (obj, value, jsonConverter) {
            var page = obj.addNewPage("");
            jsonConverter.toObject({ questions: value }, page);
        });
    JsonObject.metaData.setPropertyValues("survey", "showTitle", null, true);
    JsonObject.metaData.setPropertyValues("survey", "showPageTitles", null, true);
    JsonObject.metaData.setPropertyValues("survey", "showQuestionNumbers", null, "on");
    JsonObject.metaData.setPropertyValues("survey", "requiredText", null, "* ");
    JsonObject.metaData.setPropertyClassInfo("survey", "triggers", "surveytrigger", "trigger");
    JsonObject.metaData.setPropertyClassInfo("survey", "questions", "question");
}