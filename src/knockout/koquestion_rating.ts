import * as ko from "knockout";
import { QuestionImplementor } from "./koquestion";
import { QuestionRatingModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { Question } from "../question";

class QuestionRatingImplementor extends QuestionImplementor {
  koVisibleRateValues: any;
  koCss: any;
  constructor(question: Question) {
    super(question);
    this.koVisibleRateValues = ko.observableArray();
    (<any>this.question)["koVisibleRateValues"] = this.koVisibleRateValues;
    var self = this;
    (<QuestionRating>this.question).rateValuesChangedCallback = function () {
      self.onRateValuesChanged();
    };
    (<any>this.question)["koGetCss"] = (val: any) => {
      var itemCss = self.question.cssClasses.item;
      var selected = self.question.cssClasses.selected;
      var disabled = self.question.cssClasses.disabled;
      var result = itemCss;

      if (this.question.value == val.value) {
        result = result + " " + selected;
      }

      if (this.question.isReadOnly) {
        result = result + " " + disabled;
      }

      return result;
    };
  }
  protected onRateValuesChanged() {
    this.koVisibleRateValues(this.getValues());
  }
  private getValues(): Array<any> {
    return (<QuestionRating>this.question).visibleRateValues;
  }
}

export class QuestionRating extends QuestionRatingModel {
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionRatingImplementor(this);
  }
}

Serializer.overrideClassCreator("rating", function () {
  return new QuestionRating("");
});

QuestionFactory.Instance.registerQuestion("rating", (name) => {
  return new QuestionRating(name);
});
