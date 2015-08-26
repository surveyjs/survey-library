// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class QuestionText extends Question {
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "text";
        }
        isEmpty(): boolean {
            return super.isEmpty() || this.value == "";
        }
    }
    JsonObject.metaData.addClass("text", [], function () { return new QuestionText(""); }, "question");
    QuestionFactory.Instance.registerQuestion("text", (name) => { return new QuestionText(name); });
}