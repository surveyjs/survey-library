// <reference path="question.ts" />
// <reference path="question_baseselect.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class QuestionCheckboxModel extends QuestionCheckboxBase {
        constructor(public name: string) {
            super(name);
        }
        public get isOtherSelected(): boolean {
            if (!this.value) return false;
            return this.value.indexOf(this.otherItem.value) >= 0;
        }

        public getType(): string {
            return "checkbox";
        }
    }
    JsonObject.metaData.addClass("checkbox", [], function () { return new QuestionCheckboxModel(""); }, "checkboxbase");
    QuestionFactory.Instance.registerQuestion("checkbox", (name) => { var q = new QuestionCheckboxModel(name); q.choices = QuestionFactory.DefaultChoices; return q; });
}