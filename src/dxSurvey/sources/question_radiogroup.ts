// <reference path="question_selectbase.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class QuestionRadiogroup extends QuestionSelectBase {
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "radiogroup";
        }
    }
    JsonObject.metaData.addClass("radiogroup", [], function () { return new QuestionRadiogroup(""); }, "selectbase");
    QuestionFactory.Instance.registerQuestion("radiogroup", (name) => { return new QuestionRadiogroup(name); });
}