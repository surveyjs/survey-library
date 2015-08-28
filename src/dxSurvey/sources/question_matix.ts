// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class QuestionMatrix extends Question {
        public columns: string[] = [];
        public rows: string[] = [];
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "matrix";
        }
    }
    JsonObject.metaData.addClass("matrix", ["columns", "rows"], function () { return new QuestionMatrix(""); }, "question");
    QuestionFactory.Instance.registerQuestion("matrix", (name) => { return new QuestionMatrix(name); });
}