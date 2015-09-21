// <reference path="question.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class QuestionSelectBase extends Question {
        otherItem: ItemValue = new ItemValue("other", "Other (describe)");
        public choicesValues: Array<ItemValue> = new Array<ItemValue>();
        koOtherVisible: any;
        constructor(name: string) {
            super(name);
            if (this.isKO) {
                var self = this;
                this.koOtherVisible = ko.computed(function () { return self.iskoOtherVisible(); });
            }
        }
        protected iskoOtherVisible(): boolean {
            return this.koValue() == this.otherItem.value;
        }
        get choices(): Array<any> { return this.choicesValues; }
        set choices(newValue: Array<any>) {
            ItemValue.setData(this.choicesValues, newValue);
        }
        get visibleChoices(): Array<ItemValue> {
            if (!this.hasOther) return this.choices;
            var result = this.choices.slice();
            result.push(this.otherItem);
            return result;
        }
        public supportComment(): boolean { return true; }
        public supportOther(): boolean { return true; }
    }
    JsonObject.metaData.addClass("selectbase", ["choices"], null, "question");
    JsonObject.metaData.setPropertyValues("selectbase", "choices", null, null,
        function (obj: any) { return ItemValue.getData(obj.choices); },
        function (obj: any, value: any) { ItemValue.setData(obj.choices, value); });
}