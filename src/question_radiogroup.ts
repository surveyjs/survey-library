// <reference path="question.ts" />
// <reference path="question_baseselect.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class QuestionRadiogroup extends QuestionCheckboxBase {
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "radiogroup";
        }
    }
    JsonObject.metaData.addClass("radiogroup", [], function () { return new QuestionRadiogroup(""); }, "checkboxbase");
    QuestionFactory.Instance.registerQuestion("radiogroup", (name) => { var q = new QuestionRadiogroup(name); q.choices = QuestionFactory.DefaultChoices; return q;});
}