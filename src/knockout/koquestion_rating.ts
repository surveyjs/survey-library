/// <reference path="../question_rating.ts" />
module Survey {
    class QuestionRatingImplementor extends QuestionImplementor {
        koVisibleRateValues: any;
        constructor(question: Question) {
            super(question);
            this.koVisibleRateValues = ko.observableArray((<QuestionRating>this.question).visibleRateValues);
            this.question["koVisibleRateValues"] = this.koVisibleRateValues;
            var self = this;
            (<QuestionRating>this.question).rateValuesChangedCallback = function () { self.onRateValuesChanged(); };
        }
        protected onRateValuesChanged() {
            this.koVisibleRateValues((<QuestionRating>this.question).visibleRateValues);
        }
    }

    export class QuestionRating extends QuestionRatingModel {
        constructor(public name: string) {
            super(name);
            new QuestionRatingImplementor(this);
        }
    }

    JsonObject.metaData.overrideClassCreatore("rating", function () { return new QuestionRating(""); });
    QuestionFactory.Instance.registerQuestion("rating", (name) => { return new QuestionRating(name); });
}