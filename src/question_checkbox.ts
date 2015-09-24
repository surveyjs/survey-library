// <reference path="question.ts" />
// <reference path="question_baseselect.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class QuestionCheckbox extends QuestionCheckboxBase {
        constructor(public name: string) {
            super(name);
        }
        protected createkoValue(): any {
            return this.value ? ko.observableArray(this.value) : ko.observableArray();
        }
        protected setkoValue(newValue: any) {
            if (newValue) {
                this.koValue([].concat(newValue));
            } else {
                this.koValue([]);
            }
        }
        protected isOtherSelected(): boolean {
            if (!this.value) return false;
            return this.value.indexOf(this.otherItem.value) >= 0;
        }

        public getType(): string {
            return "checkbox";
        }
    }
    JsonObject.metaData.addClass("checkbox", [], function () { return new QuestionCheckbox(""); }, "checkboxbase");
    QuestionFactory.Instance.registerQuestion("checkbox", (name) => { return new QuestionCheckbox(name); });
}