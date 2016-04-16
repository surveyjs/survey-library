// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class QuestionRatingModel extends Question {
        static defaultRateValues: ItemValue[] = [];
        private rates: ItemValue[] = [];
        public mininumRateDescription: string = null;
        public maximumRateDescription: string = null;

        rateValuesChangedCallback: () => void;

        constructor(public name: string) {
            super(name);
        }
        get rateValues(): Array<any> { return this.rates; }
        set rateValues(newValue: Array<any>) {
            ItemValue.setData(this.rates, newValue);
            this.fireCallback(this.rateValuesChangedCallback);
        }
        get visibleRateValues(): ItemValue[] {
            if (this.rateValues.length > 0) return this.rateValues;
            return QuestionRatingModel.defaultRateValues;
        }
        public getType(): string {
            return "rating";
        }
        public supportComment(): boolean { return true; } 
        public supportOther(): boolean { return true; }
    }
    ItemValue.setData(QuestionRatingModel.defaultRateValues, [1, 2, 3, 4, 5]);
    JsonObject.metaData.addClass("rating", ["hasComment:boolean", "rateValues:itemvalues", "mininumRateDescription", "maximumRateDescription"], function () { return new QuestionRatingModel(""); }, "question");
    JsonObject.metaData.setPropertyValues("rating", "rateValues", null, null,
        function (obj: any) { return ItemValue.getData(obj.rateValues); },
        function (obj: any, value: any) { obj.rateValues = value; });
    QuestionFactory.Instance.registerQuestion("rating", (name) => { return new QuestionRatingModel(name); });
}