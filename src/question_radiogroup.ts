// <reference path="question.ts" />
// <reference path="question_baseselect.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class QuestionRadiogroupModel extends QuestionCheckboxBase {
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "radiogroup";
        }
        supportGoNextPageAutomatic() { return true; }
    }
    JsonObject.metaData.addClass("radiogroup", [], function () { return new QuestionRadiogroupModel(""); }, "checkboxbase");
    QuestionFactory.Instance.registerQuestion("radiogroup", (name) => { var q = new QuestionRadiogroupModel(name); q.choices = QuestionFactory.DefaultChoices; return q;});
}