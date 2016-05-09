/// <reference path="../survey.ts" />
module Survey {
    export class SurveyBase extends SurveyModel {
        private renderedElement: HTMLElement;
        public onRendered: Event<(sender: SurveyModel) => any, any> = new Event<(sender: SurveyModel) => any, any>();

        koCurrentPage: any; koIsFirstPage: any; koIsLastPage: any; dummyObservable: any; koState: any;
        koProgress: any; koProgressText: any;

        constructor(jsonObj: any = null, renderedElement: any = null) {
            super(jsonObj, renderedElement);
            if (typeof ko === 'undefined') throw new Error('knockoutjs library is not loaded.');
            this.render(renderedElement);
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
            element.innerHTML = this.getTemplate();
            self.applyBinding();
            self.onRendered.fire(self, {});
        }
        public completeLastPage(): boolean {
            var result = super.completeLastPage();
            this.updateKoCurrentPage();
            return result;
        }
        protected createNewPage(name: string) { return new Page(name); }
        protected getTemplate(): string { throw new Error("Please override this method"); }
        protected onBeforeCreating() {
            var self = this;
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
        protected onLoadSurveyFromService(element: any) {
            this.render(element);
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