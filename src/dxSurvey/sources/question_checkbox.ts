// <reference path="question_baseselect.ts" />
/// <reference path="questionfactory.ts" />
module dxSurvey {
    export class QuestionCheckbox extends QuestionSelectBase {
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "checkbox";
        }
    }
    QuestionFactory.Instance.registerQuestion("checkbox", (name) => { return new QuestionCheckbox(name); });
}