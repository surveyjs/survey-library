// <reference path="question_baseselect.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class QuestionCheckbox extends QuestionSelectBase {
        constructor(public name: string) {
            super(name);
        }
        protected createkoValue(): any { return ko.observableArray(this.value); }
        protected setkoValue(newValue: any) {
            this.koValue([].concat(newValue));
        }
        protected iskoOtherVisible(): boolean {
            return this.koValue.indexOf(this.otherString) >= 0;
        }

        public getType(): string {
            return "checkbox";
        }
    }
    JsonObject.metaData.addClass("checkbox", [], function () { return new QuestionCheckbox(""); }, "selectbase");
    QuestionFactory.Instance.registerQuestion("checkbox", (name) => { return new QuestionCheckbox(name); });
}