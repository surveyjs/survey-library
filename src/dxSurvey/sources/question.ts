/// <reference path="questionfactory.ts" />
/// <reference path="error.ts" />
module dxSurvey {
    export class Question extends Base {
        public data: ISurveyData;
        private questionValue: any;
        private isRequiredValue: boolean = false;
        private hasCommentValue: boolean = false;
        private hasOtherValue: boolean = false;
        errors: Array<SurveyError> = [];
        koValue: any; koComment : any; koErrors: any;

        constructor(public name: string) {
            super();
            if (this.isKO) {
                this.koValue = ko.observable(this.value);
                this.koComment = ko.observable(this.comment);
                this.koErrors = ko.observableArray(this.errors);
                var self = this;
                this.koValue.subscribe(function (newValue) {
                    self.setNewValue(newValue);
                });
                this.koComment.subscribe(function (newValue) {
                    self.setNewComment(newValue);
                });

            }
        }
        public getType(): string {
            throw new Error('This method is abstract');
        }
        public supportComment(): boolean { return false; }
        public supportOther(): boolean { return false; }
        get isRequired(): boolean { return this.isRequiredValue; }
        set isRequired(val: boolean) { this.isRequiredValue = val; }
        get hasComment(): boolean { return this.hasCommentValue; }
        set hasComment(val: boolean) {
            if (!this.supportComment()) return;
            this.hasCommentValue = val;
            if (this.hasComment) this.hasOther = false;
        }
        get hasOther(): boolean { return this.hasOtherValue; }
        set hasOther(val: boolean) {
            if (!this.supportOther()) return;
            this.hasOtherValue = val;
            if (this.hasOther) this.hasComment = false;
        }
        get value(): any {
            if (this.data != null) return this.data.getValue(this.name);
            return this.questionValue;
        }
        set value(newValue: any) {
            this.setNewValue(newValue);
            if (this.isKO) {
                this.koValue(this.value);
            }
        }
        get comment(): string { return this.data != null ? this.data.getComment(this.name) : ""; }
        set comment(newValue: string) {
            this.setNewComment(newValue);
            if (this.isKO) {
                this.koComment(this.comment);
            }
        }
        isEmpty(): boolean { return this.value == null; }
        public hasErrors(): boolean {
            this.checkForErrors();
            return this.errors.length > 0;
        }
        private checkForErrors() {
            this.errors = [];
            if (this.isRequired) {
                if (this.isEmpty()) {
                    this.errors.push(new AnswerRequiredError());
                }
            }
            if (this.isKO) {
               this.koErrors(this.errors);
            }
        }
        private setNewValue(newValue: any) {
            if (this.data != null) {
                this.data.setValue(this.name, newValue);
            }
            this.questionValue = newValue;
        }
        private setNewComment(newValue: string) {
            if (this.data != null) {
                this.data.setComment(this.name, newValue);
            }
        }
    }
}