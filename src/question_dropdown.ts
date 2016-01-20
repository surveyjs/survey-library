// <reference path="question_selectbase.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class QuestionDropdown extends QuestionSelectBase {
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "dropdown";
        }
    }
    JsonObject.metaData.addClass("dropdown", [], function () { return new QuestionDropdown(""); }, "selectbase");
    QuestionFactory.Instance.registerQuestion("dropdown", (name) => { var q = new QuestionDropdown(name); q.choices = QuestionFactory.DefaultChoices; return q; });
}