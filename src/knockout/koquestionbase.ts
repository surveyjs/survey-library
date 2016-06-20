/// <reference path="../questionbase.ts" />
module Survey {
    export class QuestionImplementorBase {
        koVisible: any; koNo: any; koErrors: any;
        constructor(public question: QuestionBase) {
            var self = this;
            question.visibilityChangedCallback = function () { self.onVisibilityChanged(); };
            this.koVisible = ko.observable(this.question.visible);
            this.koErrors = ko.observableArray();
            this.question["koVisible"] = this.koVisible;
            this.question["koErrors"] = this.koErrors;
        }
        protected onVisibilityChanged() {
            this.koVisible(this.question.visible);
        }
    }
}