/// <reference path="questionfactory.ts" />
module dxSurvey {
    export class Question extends Base {
        public data: ISurveyData;
        questionValue: any;
        koValue: any;
        _isRequired: boolean;

        constructor(public name: string) {
            super();
            if (this.isKO) {
                this.koValue = ko.observable(this.value);
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
        public isFilledOut(): boolean {
            if (this.isRequired) {
                return this.value != null;
            }
            return true;
        }
        private setNewValue(newValue: any) {
            if (this.data != null) {
                this.data.setValue(this.name, newValue);
            }
            this.questionValue = newValue;
        }
    }
}