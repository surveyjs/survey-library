import * as ko from "knockout";
import { QuestionImplementor } from "./koquestion";
import { QuestionRatingModel } from "../question_rating";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { Question } from "../question";

class QuestionRatingImplementor extends QuestionImplementor {
  koVisibleRateValues: any;
  koChange: any;
  koCss: any;
  constructor(question: Question) {
    super(question);
    this.koVisibleRateValues = ko.observableArray();
    (<any>this.question)["koVisibleRateValues"] = this.koVisibleRateValues;
    var self = this;
    this.koChange = function(val: any) {
      self.question.value = val.itemValue;
    };
    (<any>this.question)["koChange"] = this.koChange;
    (<QuestionRating>this.question).rateValuesChangedCallback = function() {
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
  constructor(public name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionRatingImplementor(this);
  }
}

Serializer.overrideClassCreator("rating", function() {
  return new QuestionRating("");
});

QuestionFactory.Instance.registerQuestion("rating", name => {
  return new QuestionRating(name);
});
