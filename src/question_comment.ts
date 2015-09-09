// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class QuestionComment extends Question {
        public rows: number = 3;
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "comment";
        }
        isEmpty(): boolean {
            return super.isEmpty() || this.value == "";
        }
    }
    JsonObject.metaData.addClass("comment", ["rows"], function () { return new QuestionComment(""); }, "question");
    JsonObject.metaData.setPropertyValues("comment", "rows", null, 3);
    QuestionFactory.Instance.registerQuestion("comment", (name) => { return new QuestionComment(name); });
}