/// <reference path="base.ts" />
/// <reference path="page.ts" />
/// <reference path="trigger.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="dxSurveyService.ts" />

module Survey {
    export class SurveyModel extends Base implements ISurvey, ISurveyTriggerOwner {
        public surveyId: string = null;
        public surveyPostId: string = null;
        public clientId: string = null;
        public sendResultOnPageNext: boolean = false;

        public commentPrefix: string = "-Comment";
        public title: string = "";
        public showNavigationButtons: boolean = true;
        public showTitle: boolean = true;
        public showPageTitles: boolean = true;
        public requiredText: string = "* ";
        public showProgressBar: string = "off";
        public pages: Array<PageModel> = new Array<PageModel>();
        public triggers: Array<SurveyTrigger> = new Array<SurveyTrigger>();
        private currentPageValue: PageModel = null;
        private valuesHash: HashTable<any> = {};
        private pagePrevTextValue: string;
        private pageNextTextValue: string;
        private completeTextValue: string;
        private showPageNumbersValue: boolean = false;
        private showQuestionNumbersValue: string = "on";
        private localeValue: string = "";

        public onComplete: Event<(sender: SurveyModel) => any, any> = new Event<(sender: SurveyModel) => any, any>();
        public onCurrentPageChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onValueChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onVisibleChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onPageVisibleChanged: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onQuestionAdded: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onQuestionRemoved: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onValidateQuestion: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onSendResult: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public onGetResult: Event<(sender: SurveyModel, options: any) => any, any> = new Event<(sender: SurveyModel, options: any) => any, any>();
        public jsonErrors: Array<JsonError> = null;

        public mode: string = "normal";


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
            this.onBeforeCreating();
            if (jsonObj) {
                this.setJsonObject(jsonObj);
                if (this.surveyId) {
                    this.loadSurveyFromService(this.surveyId, renderedElement);
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
        public get pagePrevText() { return (this.pagePrevTextValue) ? this.pagePrevTextValue : surveyLocalization.getString("pagePrevText"); }
        public set pagePrevText(newValue: string) { this.pagePrevTextValue = newValue; }
        public get pageNextText() { return (this.pageNextTextValue) ? this.pageNextTextValue : surveyLocalization.getString("pageNextText"); }
        public set pageNextText(newValue: string) { this.pageNextTextValue = newValue; }
        public get completeText() { return (this.completeTextValue) ? this.completeTextValue : surveyLocalization.getString("completeText"); }
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
                    this.checkTriggers(key, data[key]);
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
        protected currentPageChanged(newValue: PageModel, oldValue: PageModel) {
            this.onCurrentPageChanged.fire(this, { 'oldCurrentPage': oldValue, 'newCurrentPage': newValue });
        }
        public get isDesignMode(): boolean { return this.mode == "designer"; }
        public nextPage(): boolean {
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
        public prevPage(): boolean {
            if (this.isFirstPage) return false;
            var vPages = this.visiblePages;
            var index = vPages.indexOf(this.currentPage);
            this.currentPage = vPages[index - 1];
        }
        public completeLastPage() : boolean {
            if (this.isCurrentPageHasErrors) return false;
            this.onComplete.fire(this, null);
            if (this.surveyPostId) {
                this.sendResult();
            }
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
        public get progressText(): string {
            if (this.currentPage == null) return "";
            var vPages = this.visiblePages;
            var index = vPages.indexOf(this.currentPage) + 1;
            return surveyLocalization.getString("progressText")["format"](index, vPages.length);
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
                    self.onLoadSurveyFromService(element);
                }
            });
        }
        protected onLoadSurveyFromService(element: any) {
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
            this.updateVisibleIndexes();
        }
        protected onBeforeCreating() { }
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
        pageVisibilityChanged(page: IPage, newValue: boolean) {
            this.updateVisibleIndexes();
            this.onPageVisibleChanged.fire(this, { 'page': page, 'visible': newValue });
        }
        questionAdded(question: IQuestion, index: number) {
            this.updateVisibleIndexes();
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
        //ISurveyTriggerOwner
        getObjects(pages: string[], questions: string[]): any[]{
            var result = [];
            Array.prototype.push.apply(result, this.getPagesByNames(pages));
            Array.prototype.push.apply(result, this.getQuestionsByNames(questions));
            return result;
        }
    }

    JsonObject.metaData.addClass("survey", ["locale", "title", "pages", "questions", "triggers:triggers", "surveyId", "surveyPostId", "sendResultOnPageNext:boolean",
        "showNavigationButtons:boolean", "showTitle:boolean", "showPageTitles:boolean", "showPageNumbers:boolean", "showQuestionNumbers", "showProgressBar",
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
    JsonObject.metaData.setPropertyValues("survey", "showProgressBar", null, "off");
    JsonObject.metaData.setPropertyChoices("survey", "showProgressBar", ["off", "top", "bottom"]);
    JsonObject.metaData.setPropertyValues("survey", "requiredText", null, "* ");
    JsonObject.metaData.setPropertyValues("survey", "pagePrevText", null, null, function (obj: any) { return obj.pagePrevTextValue; });
    JsonObject.metaData.setPropertyValues("survey", "pageNextText", null, null, function (obj: any) { return obj.pageNextTextValue; });
    JsonObject.metaData.setPropertyValues("survey", "completeText", null, null, function (obj: any) { return obj.completeTextValue; });
    JsonObject.metaData.setPropertyClassInfo("survey", "triggers", "surveytrigger", "trigger");
    JsonObject.metaData.setPropertyClassInfo("survey", "questions", "question");
    JsonObject.metaData.setPropertyChoices("survey", "locale", null, () => { return surveyLocalization.getLocales() });
}