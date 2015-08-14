// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
module dxSurvey {
    export class QuestionCheckbox extends Question {
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "checkbox";
        }
    }
    QuestionFactory.Instance.registerQuestion("checkbox", (name) => { return new QuestionCheckbox(name); });
}