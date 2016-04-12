/// <reference path="../survey.ts" />
module Survey {
    export class Survey extends SurveyModel {
        private renderedElement: HTMLElement;
        public onRendered: Event<(sender: SurveyModel) => any, any> = new Event<(sender: SurveyModel) => any, any>();

        koCurrentPage: any; koIsFirstPage: any; koIsLastPage: any; dummyObservable: any; 

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
            element.innerHTML = template.ko.html;
            self.applyBinding();
            self.onRendered.fire(self, {});
        }
        protected createNewPage(name: string) { return new Page(name); }
        protected onBeforeCreating() {
            var self = this;
            this.dummyObservable = ko.observable(0);
            this.koCurrentPage = ko.computed(function () { self.dummyObservable(); return self.currentPage; });
            this.koIsFirstPage = ko.computed(function () { self.dummyObservable(); return self.isFirstPage; });
            this.koIsLastPage = ko.computed(function () { self.dummyObservable(); return self.isLastPage; });
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