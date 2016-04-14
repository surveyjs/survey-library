/// <reference path="../questionbase.ts" />
module Survey {
    export class QuestionImplementorBase {
        koVisible: any; koNo: any; koErrors: any;
        constructor(public question: QuestionBase) {
            var self = this;
            question.visibilityChangedCallback = function () { self.onVisibilityChanged(); };
            question.visibleIndexChangedCallback = function () { self.onVisibleIndexChanged(); };
            this.koVisible = ko.observable(this.question.visible);
            this.koErrors = ko.observableArray();
            this.koNo = ko.observable(this.getNo());
            this.question["koVisible"] = this.koVisible;
            this.question["koNo"] = this.koNo;
            this.question["koErrors"] = this.koErrors;
        }
        protected onVisibilityChanged() {
            this.koVisible(this.question.visible);
        }
        protected onVisibleIndexChanged() {
            this.koNo(this.getNo());
        }
        protected getNo(): string {
            return this.question.visibleIndex > -1 ? this.question.visibleIndex + 1 + ". " : "";
        }
    }
}