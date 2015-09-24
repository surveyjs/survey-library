// <reference path="question.ts" />
// <reference path="question_baseselect.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class QuestionRadiogroup extends QuestionCheckboxBase {
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "radiogroup";
        }
    }
    JsonObject.metaData.addClass("radiogroup", [], function () { return new QuestionRadiogroup(""); }, "checkboxbase");
    QuestionFactory.Instance.registerQuestion("radiogroup", (name) => { return new QuestionRadiogroup(name); });
}