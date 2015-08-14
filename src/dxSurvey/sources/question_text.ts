// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
module dxSurvey {
    export class QuestionText extends Question {
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "text";
        }
    }
    QuestionFactory.Instance.registerQuestion("text", (name) => { return new QuestionText(name); });
}