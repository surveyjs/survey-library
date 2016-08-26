/// <reference path="../survey.ts" />
module Survey {
    export class SurveyBase extends SurveyModel {
        private renderedElement: HTMLElement;
        private cssValue: any;
        public onRendered: Event<(sender: SurveyModel) => any, any> = new Event<(sender: SurveyModel) => any, any>();

        koCurrentPage: any; koIsFirstPage: any; koIsLastPage: any; dummyObservable: any; koState: any;
        koProgress: any; koProgressText: any;

        constructor(jsonObj: any = null, renderedElement: any = null, css: any = null) {
            super(jsonObj);
            if (css) {
                this.css = css;
            }
            if (renderedElement) {
                this.renderedElement = renderedElement;
            }
            if (typeof ko === 'undefined') throw new Error('knockoutjs library is not loaded.');
            this.render(renderedElement);
        }
        public get cssNavigationComplete() { return this.getNavigationCss(this.css.navigationButton, this.css.navigation.complete); }
        public get cssNavigationPrev() { return this.getNavigationCss(this.css.navigationButton, this.css.navigation.prev); }
        public get cssNavigationNext() { return this.getNavigationCss(this.css.navigationButton, this.css.navigation.next); }
        private getNavigationCss(main: string, btn: string) {
            var res = "";
            if (main) res = main;
            if (btn) res += ' ' + btn;
            return res;
        }
        public get css(): any { return this.cssValue; }
        public set css(value: any) {
            this.mergeValues(value, this.cssValue);
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
            if (!element) return;
            element.innerHTML = this.getTemplate();
            self.applyBinding();
            self.onRendered.fire(self, {});
        }
        public loadSurveyFromService(surveyId: string = null, renderedElement: any = null) {
            if (renderedElement) {
                this.renderedElement = renderedElement;
            }
            super.loadSurveyFromService(surveyId);
        }
        protected setCompleted() {
            super.setCompleted();
            this.updateKoCurrentPage();
        }
        protected createNewPage(name: string) { return new Page(name); }
        protected createCssObject(): any { return null; }
        protected getTemplate(): string { throw new Error("Please override this method"); }
        protected onBeforeCreating() {
            var self = this;
            this.cssValue = this.createCssObject();
            this.dummyObservable = ko.observable(0);
            this.koCurrentPage = ko.computed(function () { self.dummyObservable(); return self.currentPage; });
            this.koIsFirstPage = ko.computed(function () { self.dummyObservable(); return self.isFirstPage; });
            this.koIsLastPage = ko.computed(function () { self.dummyObservable(); return self.isLastPage; });
            this.koProgressText = ko.computed(function () { self.dummyObservable(); return self.progressText; });
            this.koProgress = ko.computed(function () { self.dummyObservable(); return self.getProgress(); });
            this.koState = ko.computed(function () { self.dummyObservable(); return self.state; });
        }
        protected currentPageChanged(newValue: PageModel, oldValue: PageModel) {
            this.updateKoCurrentPage();
            super.currentPageChanged(newValue, oldValue);
        }
        protected onLoadSurveyFromService() {
            this.render();
        }
        protected onLoadingSurveyFromService() {
            this.render();
        }
        private applyBinding() {
            if (!this.renderedElement) return;
            this.updateKoCurrentPage();
            ko.cleanNode(this.renderedElement);
            ko.applyBindings(this, this.renderedElement);
        }
        private updateKoCurrentPage() {
            this.dummyObservable(this.dummyObservable() + 1);
        }
    }
}