// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class QuestionRating extends Question {
        static defaultRateValues: string[] = ["1", "2", "3", "4", "5"];
        public rateValues: string[] = [];
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
        get visibleRateValues(): string[] {
            if (this.rateValues.length > 0) return this.rateValues;
            return QuestionRating.defaultRateValues;
        }
        public getType(): string {
            return "rating";
        }
        public supportComment(): boolean { return true; }
        public supportOther(): boolean { return true; }
    }
    JsonObject.metaData.addClass("rating", ["rateValues", "mininumRateDescription", "maximumRateDescription"], function () { return new QuestionRating(""); }, "question");
    QuestionFactory.Instance.registerQuestion("rating", (name) => { return new QuestionRating(name); });
}