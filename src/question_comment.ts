// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class QuestionCommentModel extends Question {
        public rows: number = 4;
        public cols: number = 50;
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
    JsonObject.metaData.addClass("comment", ["cols:number", "rows:number"], function () { return new QuestionCommentModel(""); }, "question");
    JsonObject.metaData.setPropertyValues("comment", "cols", null, 50);
    JsonObject.metaData.setPropertyValues("comment", "rows", null, 4);
    QuestionFactory.Instance.registerQuestion("comment", (name) => { return new QuestionCommentModel(name); });
}