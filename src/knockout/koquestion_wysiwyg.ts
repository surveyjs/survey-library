/// <reference path="../question_wysiwyg.ts" />
module Survey {
    export class QuestionWysiwyg extends QuestionWysiwygModel {
        constructor(public name: string) {
            super(name);
            new QuestionImplementor(this);
        }
    }

    JsonObject.metaData.overrideClassCreatore("wysiwyg", function () { return new QuestionWysiwyg(""); });
    QuestionFactory.Instance.registerQuestion("wysiwyg", (name) => { return new QuestionWysiwyg(name); });
}
