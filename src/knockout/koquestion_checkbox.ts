/// <reference path="../question_checkbox.ts" />
/// <reference path="koquestion_baseselect.ts" />
module Survey {
    class QuestionCheckboxImplementor extends QuestionCheckboxBaseImplementor {
        constructor(question: Question) {
            super(question);
        }
        protected createkoValue(): any {
            return this.question.value ? ko.observableArray(this.question.value) : ko.observableArray();
        }
        protected setkoValue(newValue: any) {
            if (newValue) {
                this.koValue([].concat(newValue));
            } else {
                this.koValue([]);
            }
        }
    }
    export class QuestionCheckbox extends QuestionCheckboxModel {
        constructor(public name: string) {
            super(name);
            new QuestionCheckboxImplementor(this);
        }
    }

    JsonObject.metaData.overrideClassCreatore("checkbox", function () { return new QuestionCheckbox(""); });
    QuestionFactory.Instance.registerQuestion("checkbox", (name) => { var q = new QuestionCheckbox(name); q.choices = QuestionFactory.DefaultChoices; return q; });
}