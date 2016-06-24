// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class QuestionWysiwygModel extends Question {
        public rows: number = 4;
        public cols: number = 50;
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "wysiwyg";
        }
        isEmpty(): boolean {
            return super.isEmpty() || this.value == "";
        }
    }
    JsonObject.metaData.addClass("wysiwyg", ["cols:number", "rows:number"], function () { return new QuestionWysiwygModel(""); }, "question");
    JsonObject.metaData.setPropertyValues("wysiwyg", "cols", null, 50);
    JsonObject.metaData.setPropertyValues("wysiwyg", "rows", null, 4);
    QuestionFactory.Instance.registerQuestion("wysiwyg", (name) => { return new QuestionWysiwygModel(name); });
}
