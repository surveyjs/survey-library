/// <reference path="../question_multipletext.ts" />
module Survey {
    export class MultipleTextItem extends MultipleTextItemModel {
        private isKOValueUpdating = false;
        koValue: any;
        constructor(public name: any = null, title: string = null) {
            super(name, title);
            this.koValue = ko.observable(this.value);
            var self = this;
            this.koValue.subscribe(function (newValue) {
                if (!self.isKOValueUpdating) {
                    self.value = newValue;
                }
            });
        }
        onValueChanged(newValue: any) {
            this.isKOValueUpdating = true;
            this.koValue(newValue);
            this.isKOValueUpdating = false;
        }
    }

    export class QuestionMultipleText extends QuestionMultipleTextModel {
        constructor(public name: string) {
            super(name);
            new QuestionImplementor(this);
        }
        protected createTextItem(name: string, title: string): MultipleTextItemModel {
            return new MultipleTextItem(name, title);
        }
    }

    JsonObject.metaData.overrideClassCreatore("multipletextitem", function () { return new MultipleTextItem(""); });
    JsonObject.metaData.overrideClassCreatore("multipletext", function () { return new QuestionMultipleText(""); });
    QuestionFactory.Instance.registerQuestion("multipletext", (name) => { var q = new QuestionMultipleText(name); q.AddItem("text1"); q.AddItem("text2"); return q; });
}