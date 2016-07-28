// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class QuestionTextModel extends Question {
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
    JsonObject.metaData.addClass("text", [{ name: "size:number", default: 25 }], function () { return new QuestionTextModel(""); }, "question");
    QuestionFactory.Instance.registerQuestion("text", (name) => { return new QuestionTextModel(name); });
}