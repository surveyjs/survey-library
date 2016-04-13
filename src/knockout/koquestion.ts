/// <reference path="../question.ts" />
module Survey {
    export class QuestionImplementor {
        private isUpdating: boolean = false;
        public question: Question;
        koValue: any; koComment: any; koErrors: any; koVisible: any; koNo: any;
        constructor(question: Question) {
            this.question = question;
            var self = this;
            question.valueChangedCallback = function () { self.onValueChanged(); };
            question.commentChangedCallback = function () { self.onCommentChanged(); };
            question.visibilityChangedCallback = function () { self.onVisibilityChanged(); };
            question.visibleIndexChangedCallback = function () { self.onVisibleIndexChanged(); };
            question.errorsChangedCallback = function () { self.onErrorsChanged(); };
            this.koValue = this.createkoValue();
            this.koComment = ko.observable(this.question.comment);
            this.koErrors = ko.observableArray(this.question.errors);
            this.koVisible = ko.observable(this.question.visible);
            this.koNo = ko.observable(this.getNo());
            this.koValue.subscribe(function (newValue) {
                self.updateValue(newValue);
            });
            this.koComment.subscribe(function (newValue) {
                self.updateComment(newValue);
            });
            this.question["koValue"] = this.koValue;
            this.question["koComment"] = this.koComment;
            this.question["koErrors"] = this.koErrors;
            this.question["koVisible"] = this.koVisible;
            this.question["koNo"] = this.koNo;
        }
        protected onValueChanged() {
            if (this.isUpdating) return;
            this.setkoValue(this.question.value);
        }
        protected onCommentChanged() {
            if (this.isUpdating) return;
            this.koComment(this.question.comment);
        }
        protected onVisibilityChanged() {
            this.koVisible(this.question.visible);
        }
        protected onVisibleIndexChanged() {
            this.koNo(this.getNo());
        }
        protected onErrorsChanged() {
            this.koErrors(this.question.errors);
        }
        protected createkoValue(): any { return ko.observable(this.question.value); }
        protected setkoValue(newValue: any) {
            this.koValue(newValue);
        }
        protected updateValue(newValue: any) {
            this.isUpdating = true;
            this.question.value = newValue;
            this.isUpdating = false;
        }
        protected updateComment(newValue: any) {
            this.isUpdating = true;
            this.question.comment = newValue;
            this.isUpdating = false;
        }
        protected getNo(): string {
            return this.question.visibleIndex > -1 ? this.question.visibleIndex + 1 + ". " : "";
        }
    }
}