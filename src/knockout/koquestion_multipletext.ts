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

    export class QuestionMultipleTextImplementor extends QuestionImplementor {
        koRows: any;
        constructor(question: Question) {
            super(question);
            this.koRows = ko.observableArray(this.getRows());
            this.question["koRows"] = this.koRows;
            this.onColCountChanged();
            var self = this;
            (<QuestionMultipleTextModel>this.question).colCountChangedCallback = function () { self.onColCountChanged(); };
        }
        protected onColCountChanged() {
            this.koRows(this.getRows());
        }
        protected getRows(): Array<any> {
            var colCount = (<QuestionMultipleTextModel>this.question).colCount;
            var items = (<QuestionMultipleTextModel>this.question).items;
            var rows = [];
            var index = 0;
            for (var i = 0; i < items.length; i++) {
                if (index == 0) {
                    rows.push([]);
                }
                rows[rows.length - 1].push(items[i]);
                index++;
                if (index >= colCount) {
                    index = 0;
                }
            }
            return rows;
        }
    }

    export class QuestionMultipleText extends QuestionMultipleTextModel {
        constructor(public name: string) {
            super(name);
            new QuestionMultipleTextImplementor(this);
        }
        protected createTextItem(name: string, title: string): MultipleTextItemModel {
            return new MultipleTextItem(name, title);
        }
    }

    JsonObject.metaData.overrideClassCreatore("multipletextitem", function () { return new MultipleTextItem(""); });
    JsonObject.metaData.overrideClassCreatore("multipletext", function () { return new QuestionMultipleText(""); });
    QuestionFactory.Instance.registerQuestion("multipletext", (name) => { var q = new QuestionMultipleText(name); q.AddItem("text1"); q.AddItem("text2"); return q; });
}