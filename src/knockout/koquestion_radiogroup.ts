/// <reference path="../question_radiogroup.ts" />
namespace Survey {
    export class QuestionRadiogroup extends QuestionRadiogroupModel {
        constructor(public name: string) {
            super(name);
            new QuestionCheckboxBaseImplementor(this);
        }
    }

    JsonObject.metaData.overrideClassCreatore("radiogroup", function () { return new QuestionRadiogroup(""); });
    QuestionFactory.Instance.registerQuestion("radiogroup", (name) => { var q = new QuestionRadiogroup(name); q.choices = QuestionFactory.DefaultChoices; return q; });
}