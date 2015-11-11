// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class QuestionRating extends Question {
        static defaultRateValues: ItemValue[] = [];
        private rates: ItemValue[] = [];
        public mininumRateDescription: string = null;
        public maximumRateDescription: string = null;

        koVisibleRateValues: any;

        constructor(public name: string) {
            super(name);
            if (this.isKO) {
                var self = this;
                this.koVisibleRateValues = ko.computed(function () {
                    return self.visibleRateValues;
                });
            }
        }
        get rateValues(): Array<any> { return this.rates; }
        set rateValues(newValue: Array<any>) {
            ItemValue.setData(this.rates, newValue);
        }
        get visibleRateValues(): ItemValue[] {
            if (this.rateValues.length > 0) return this.rateValues;
            return QuestionRating.defaultRateValues;
        }
        public getType(): string {
            return "rating";
        }
        public supportComment(): boolean { return true; }
        public supportOther(): boolean { return true; }
    }
    ItemValue.setData(QuestionRating.defaultRateValues, [1, 2, 3, 4, 5]);
    JsonObject.metaData.addClass("rating", ["rateValues", "mininumRateDescription", "maximumRateDescription"], function () { return new QuestionRating(""); }, "question");
    JsonObject.metaData.setPropertyValues("rating", "rateValues", null, null,
        function (obj: any) { return ItemValue.getData(obj.rateValues); },
        function (obj: any, value: any) { ItemValue.setData(obj.rateValues, value); });
    QuestionFactory.Instance.registerQuestion("rating", (name) => { return new QuestionRating(name); });
}