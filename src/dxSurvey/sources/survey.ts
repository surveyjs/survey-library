/// <reference path="base.ts" />

module dxSurvey {
    export class Survey extends Base implements ISurveyData {
        pages: Array<Page> = new Array<Page>();
        private currentPage: Page = null;
        private valuesHash: HashTable<any> = {};
        private commentsHash: HashTable<string> = {};

        private renderedElement: HTMLElement;

        public onComplete: Event<(sender: Survey) => any, any> = new Event<(sender: Survey) => any, any>();

        constructor() {
            super();
            this.addDefaultPage();
        }
        get PageCount(): number {
            return this.pages.length;
        }
        get CurrentPage(): Page {
            if (this.currentPage != null) {
                if (this.pages.indexOf(this.currentPage) < 0) {
                    this.currentPage = null;
                }
            }
            if (this.currentPage == null && this.pages.length > 0) {
                this.currentPage = this.pages[0];
            }
            return this.currentPage;
        }
        set CurrentPage(value: Page) {
            if (value == null || this.pages.indexOf(value) < 0) return;
            this.currentPage = value;
            this.applyBinding();
        }
        nextPage(): boolean {
            if (this.isLastPage) return false;
            if (this.isCurrentPageHasErrors()) return false;
            var index = this.pages.indexOf(this.CurrentPage);
            this.CurrentPage = this.pages[index + 1];
            return true;
        }
        isCurrentPageHasErrors(): boolean {
            if (this.CurrentPage == null) return true;
            return this.CurrentPage.hasErrors();
        }
        prevPage(): boolean {
            if (this.isFirstPage) return false;
            var index = this.pages.indexOf(this.CurrentPage);
            this.CurrentPage = this.pages[index - 1];
        }
        completeLastPage() : boolean {
            if (this.isCurrentPageHasErrors()) return false;
            this.onComplete.fire(this, null);
            return true;
        }
        get isFirstPage() {
            if (this.CurrentPage == null) return true;
            return this.pages.indexOf(this.CurrentPage) == 0;
        }
        get isLastPage() {
            if (this.CurrentPage == null) return true;
            return this.pages.indexOf(this.CurrentPage) == this.pages.length - 1;
        }
        getPage(index: number): Page {
            return this.pages[index];
        }
        addPage(page: Page) {
            if (page == null) return;
            page.data = this;
            this.pages.push(page);
        }
        addNewPage(name: string) {
            var page = new Page(name);
            this.addPage(page);
            return page;
        }
        private addDefaultPage() {
            this.addPage(new Page("Page 1"));
        }
        public render(element: HTMLElement) {
            var self = this;
            this.renderedElement = element;
            if (this.isKO) {
                $(element).load("/templates/knockout.html", null, function () { self.applyBinding(); });
            }
        }
        private applyBinding() {
            if (!this.isKO || this.renderedElement == null) return;
            ko.cleanNode(this.renderedElement);
            ko.applyBindings(this, this.renderedElement);
        }
        //ISurvey data
        getValue(name: string): any {
            return this.valuesHash[name];
        }
        setValue(name: string, newValue: any) {
            this.valuesHash[name] = newValue;
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
    }
}