// <reference path="question.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class QuestionSelectBase extends Question {
        static otherItemText: string = "Other (describe)";
        otherItem: ItemValue = new ItemValue("other", QuestionSelectBase.otherItemText);
        public choicesValues: Array<ItemValue> = new Array<ItemValue>();
        public otherErrorText: string = null;
        koOtherVisible: any;
        constructor(name: string) {
            super(name);
            if (this.isKO) {
                var self = this;
                this.koOtherVisible = ko.computed(function () { self.koValue(); return self.isOtherSelected(); });
            }
        }
        protected isOtherSelected(): boolean {
            return this.value == this.otherItem.value;
        }
        get choices(): Array<any> { return this.choicesValues; }
        set choices(newValue: Array<any>) {
            ItemValue.setData(this.choicesValues, newValue);
        }
        get otherText(): string { return this.otherItem.text; }
        set otherText(value: string) { this.otherItem.text = value; }
        get visibleChoices(): Array<ItemValue> {
            if (!this.hasOther) return this.choices;
            var result = this.choices.slice();
            result.push(this.otherItem);
            return result;
        }
        public supportComment(): boolean { return true; }
        public supportOther(): boolean { return true; }
        protected onCheckForErrors(errors: Array<SurveyError>) {
            super.onCheckForErrors(errors);
            if (!this.isOtherSelected() || this.comment) return;
            var text = this.otherErrorText;
            if (!text) {
                text = "Please enter the others value.";
            }
            errors.push(new CustomError(text));
        }
    }
    export class QuestionCheckboxBase extends QuestionSelectBase {
        private colCountValue: number = 1;
        koClass: any;
        constructor(public name: string) {
            super(name);
            if (this.isKO) {
                var self = this;
                this.koClass = ko.computed(function () { self.dummyObservable(); return "dxsv_qcbc" + self.colCount; });
            }
        }
        public get colCount(): number { return this.colCountValue; }
        public set colCount(value: number) {
            if (value < 0 || value > 4) return;
            this.colCountValue = value;
            if (this.isKO) {
                this.dummyObservable(this.dummyObservable() + 1);
            }
        }
    }
    JsonObject.metaData.addClass("selectbase", ["choices", "otherText", "otherErrorText"], null, "question");
    JsonObject.metaData.setPropertyValues("selectbase", "choices", null, null,
        function (obj: any) { return ItemValue.getData(obj.choices); },
        function (obj: any, value: any) { ItemValue.setData(obj.choices, value); });
    JsonObject.metaData.setPropertyValues("selectbase", "otherText", null, QuestionSelectBase.otherItemText);

    JsonObject.metaData.addClass("checkboxbase", ["colCount"], null, "selectbase");
    JsonObject.metaData.setPropertyValues("checkboxbase", "colCount", null, 1);
}