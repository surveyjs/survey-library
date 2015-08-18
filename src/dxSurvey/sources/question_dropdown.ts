// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
module dxSurvey {
    export class QuestionDropdown extends Question {
        choices: Array<string> = new Array<string>();
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "dropdown";
        }
    }
    QuestionFactory.Instance.registerQuestion("dropdown", (name) => { return new QuestionDropdown(name); });
}