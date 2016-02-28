// <reference path="question.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class QuestionSelectBase extends Question {
        static otherItemText: string = "Other (describe)";
        otherItem: ItemValue = new ItemValue("other", QuestionSelectBase.otherItemText);
        public choicesValues: Array<ItemValue> = new Array<ItemValue>();
        public otherErrorText: string = null;
        choicesOrderValue: string = "none";
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
        get choicesOrder(): string { return this.choicesOrderValue; }
        set choicesOrder(newValue: string) {
            if (newValue == this.choicesOrderValue) return;
            this.choicesOrderValue = newValue;
        }
        get otherText(): string { return this.otherItem.text; }
        set otherText(value: string) { this.otherItem.text = value; }
        get visibleChoices(): Array<ItemValue> {
            if (!this.hasOther && this.choicesOrder == "none") return this.choices;
            var result = this.sortVisibleChoices(this.choices.slice());
            if (this.hasOther) {
                result.push(this.otherItem);
            }
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
        sortVisibleChoices(array: Array<ItemValue>): Array<ItemValue> {
            var order = this.choicesOrder.toLowerCase();
            if (order == "asc") return this.sortArray(array, 1);
            if (order == "desc") return this.sortArray(array, -1);
            if (order == "random") return this.randomizeArray(array);
            return array;
        }
        sortArray(array: Array<ItemValue>, mult: number): Array<ItemValue> {
            return array.sort(function (a, b) {
                if (a.text < b.text) return -1 * mult;
                if (a.text > b.text) return 1 * mult;
                return 0;
            });
        }
        randomizeArray(array: Array<ItemValue>): Array<ItemValue> {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }
    }

    export class QuestionCheckboxBase extends QuestionSelectBase {
        private colCountValue: number = 1;
        koWidth: any;
        constructor(public name: string) {
            super(name);
            if (this.isKO) {
                var self = this;
                this.koWidth = ko.computed(function () { self.dummyObservable(); return self.colCount > 0 ? (100 / self.colCount) + '%' : ""; });
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
        koAfterRender(el, con) {
            var tEl = el[0];
            if (tEl.nodeName == "#text") tEl.data = "";
            tEl = el[el.length - 1];
            if (tEl.nodeName == "#text") tEl.data = "";
        }
    }
    JsonObject.metaData.addClass("selectbase", ["hasComment:boolean", "hasOther:boolean", "!choices:itemvalues", "choicesOrder", "otherText", "otherErrorText"], null, "question");
    JsonObject.metaData.setPropertyValues("selectbase", "choices", null, null,
        function (obj: any) { return ItemValue.getData(obj.choices); },
        function (obj: any, value: any) { ItemValue.setData(obj.choices, value); });
    JsonObject.metaData.setPropertyValues("selectbase", "choicesOrder", null, "none");
    JsonObject.metaData.setPropertyChoices("selectbase", "choicesOrder", ["none", "asc", "desc", "random"]);
    JsonObject.metaData.setPropertyValues("selectbase", "otherText", null, QuestionSelectBase.otherItemText);

    JsonObject.metaData.addClass("checkboxbase", ["colCount:number"], null, "selectbase");
    JsonObject.metaData.setPropertyValues("checkboxbase", "colCount", null, 1);
    JsonObject.metaData.setPropertyChoices("checkboxbase", "colCount", [0, 1, 2, 3, 4]);
}