// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
namespace Survey {
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
    JsonObject.metaData.addClass("comment", [{ name: "cols:number", default: 50 }, { name: "rows:number", default: 4 }], function () { return new QuestionCommentModel(""); }, "question");
    QuestionFactory.Instance.registerQuestion("comment", (name) => { return new QuestionCommentModel(name); });
}