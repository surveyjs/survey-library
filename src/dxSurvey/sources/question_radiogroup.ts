// <reference path="question_selectbase.ts" />
/// <reference path="questionfactory.ts" />
module dxSurvey {
    export class QuestionRadiogroup extends QuestionSelectBase {
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "radiogroup";
        }
    }
    QuestionFactory.Instance.registerQuestion("radiogroup", (name) => { return new QuestionRadiogroup(name); });
}