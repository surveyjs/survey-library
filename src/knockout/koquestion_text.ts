/// <reference path="../question_text.ts" />
namespace Survey {
    export class QuestionText extends QuestionTextModel {
        constructor(public name: string) {
            super(name);
            new QuestionImplementor(this);
        }
    }

    JsonObject.metaData.overrideClassCreatore("text", function () { return new QuestionText(""); });
    QuestionFactory.Instance.registerQuestion("text", (name) => { return new QuestionText(name); });
}