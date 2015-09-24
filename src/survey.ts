/// <reference path="base.ts" />
/// <reference path="jsonobject.ts" />

module dxSurvey {
    export class Survey extends Base implements ISurveyData {
        public static templateKnockout: string = "templates/dx.survey.ko.html";
        public title: string = "";
        public pages: Array<Page> = new Array<Page>();
        private currentPageValue: Page = null;
        private valuesHash: HashTable<any> = {};
        private commentsHash: HashTable<string> = {};
        private renderedElement: HTMLElement;
        private templateUrlValue: string = null;

        public onComplete: Event<(sender: Survey) => any, any> = new Event<(sender: Survey) => any, any>();
        public onValueChanged: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();
        public onVisibleChanged: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();
        public onValidateQuestion: Event<(sender: Survey, options: any) => any, any> = new Event<(sender: Survey, options: any) => any, any>();

        koCurrentPage: any; koIsFirstPage: any; koIsLastPage: any; dummyObservable: any; 

        constructor(jsonObj: any = null, renderedElement: any = null, templateUrl: string = null) {
            super();
            var self = this;
            this.pages.push = function (value) {
                value.data = self;
                return Array.prototype.push.call(this, value);
            };
            if (ko) {
                this.dummyObservable = ko.observable(0);
                this.koCurrentPage = ko.computed(function () { self.dummyObservable(); return self.currentPage; });
                this.koIsFirstPage = ko.computed(function () { self.dummyObservable(); return self.isFirstPage; });
                this.koIsLastPage = ko.computed(function () { self.dummyObservable(); return self.isLastPage; });
            }
            if (jsonObj) {
                new JsonObject().toObject(jsonObj, this);
            }
            this.render(renderedElement, templateUrl);
        }
        public getType(): string { return "survey"; }
        public get templateUrl() { return this.templateUrlValue ? this.templateUrlValue : Survey.templateKnockout; }
        public set templateUrl(value: string) { this.templateUrlValue = value; }
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
                }
            }
            this.notifyAllQuestionsOnValueChanged();
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
        public render(element: any = null, templateUrl: string = null) {
            this.templateUrl = templateUrl;
            var self = this;
            if (element && typeof element == "string") {
                    element = document.getElementById(element);
            }
            if (element) {
                this.renderedElement = element;
            }
            element = this.renderedElement;
            if (!element) return;
            this.onBeforeRender();
            if (this.isKO) {
                this.loadFile(this.templateUrl,
                    function (html: string) {
                        element.innerHTML = html;
                        self.applyBinding();
                    },
                    function (errorResult: string) { element.innerHTML = "Knockout template could not be loaded. " + errorResult; }
                    );
            }
        }
        onBeforeRender() {
            this.updateVisibleIndexes();
        }
        private loadFile(fileName: string, funcSuccess: Function, funcError: Function) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        funcSuccess(xmlhttp.responseText);
                    } else funcError(xmlhttp.responseText);
                }
            }
            xmlhttp.open("GET", fileName, true);
            xmlhttp.send();
        }
        private applyBinding() {
            if (!this.isKO || this.renderedElement == null) return;
            this.updateKoCurrentPage();
            ko.cleanNode(this.renderedElement);
            ko.applyBindings(this, this.renderedElement);
        }
        private updateVisibleIndexes() {
            var index = 0;
            var questions = this.getAllQuestions(true);
            for (var i = 0; i < questions.length; i++) {
                questions[i].setVisibleIndex(index++);
            } 
        }
        //ISurvey data
        getValue(name: string): any {
            if (!name || name.length == 0) return null;
            return this.valuesHash[name];
        }
        setValue(name: string, newValue: any) {
            this.valuesHash[name] = newValue;
            this.notifyQuestionOnValueChanged(name, newValue);
        }
        getComment(name: string): string {
            var result = this.commentsHash[name];
            if (result == null) result = "";
            return result;
        }
        setComment(name: string, newValue: string) {
            if (newValue == "" || newValue == null) {
                delete this.commentsHash[name];
            } else {
                this.commentsHash[name] = newValue;
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
    }

    JsonObject.metaData.addClass("survey", ["title", "pages", "questions"]);
    JsonObject.metaData.setPropertyValues("survey", "pages", "page");
    JsonObject.metaData.setPropertyValues("survey", "questions", "", null,
        function (obj) { return null; },
        function (obj, value) {
            var page = obj.addNewPage("");
            new dxSurvey.JsonObject().toObject({ questions: value }, page);
        });
}