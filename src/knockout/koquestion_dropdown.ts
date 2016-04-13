/// <reference path="../question_dropdown.ts" />
module Survey {
    export class QuestionDropdown extends QuestionDropdownModel {
        constructor(public name: string) {
            super(name);
            new QuestionSelectBaseImplementor(this);
        }
    }

    JsonObject.metaData.overrideClassCreatore("dropdown", function () { return new QuestionDropdown(""); });
    QuestionFactory.Instance.registerQuestion("dropdown", (name) => { var q = new QuestionDropdown(name); q.choices = QuestionFactory.DefaultChoices; return q; });
}