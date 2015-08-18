/// <reference path="questionfactory.ts" />
/// <reference path="error.ts" />
module dxSurvey {
    export class Question extends Base {
        public data: ISurveyData;
        questionValue: any;
        _isRequired: boolean;
        errors: Array<SurveyError> = [];
        koValue: any; koErrors: any;

        constructor(public name: string) {
            super();
            if (this.isKO) {
                this.koValue = ko.observable(this.value);
                this.koErrors = ko.observableArray(this.errors);
                var self = this;
                this.koValue.subscribe(function (newValue) {
                    self.setNewValue(newValue);
                });

            }
        }
        public getType(): string {
            throw new Error('This method is abstract');
        }
        get isRequired(): boolean { return this._isRequired; }
        set isRequired(val: boolean) { this._isRequired = val; }
        get value(): any {
            if (this.data != null) return this.data.getValue(this.name);
            return this.questionValue;
        }
        set value(newValue: any) {
            this.setNewValue(newValue);
            if (this.isKO) {
                this.koValue(newValue);
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
    }
}