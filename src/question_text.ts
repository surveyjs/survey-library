// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class QuestionText extends Question {
        public size: number = 25;
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
    JsonObject.metaData.addClass("text", ["size"], function () { return new QuestionText(""); }, "question");
    JsonObject.metaData.setPropertyValues("text", "size", null, 25);
    QuestionFactory.Instance.registerQuestion("text", (name) => { return new QuestionText(name); });
}