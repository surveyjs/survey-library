import * as ko from "knockout";
import { QuestionImplementor } from "./koquestion";
import { QuestionRatingModel } from "../question_rating";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { Question } from "../question";

class QuestionRatingImplementor extends QuestionImplementor {
  koVisibleRateValues: any;
  koChange: any;
  koCss: any;
  constructor(question: Question) {
    super(question);
    this.koVisibleRateValues = ko.observableArray(this.getValues());
    this.question["koVisibleRateValues"] = this.koVisibleRateValues;
    var self = this;
    this.koChange = function(val) {
      self.koValue(val.itemValue);
    };
    this.question["koChange"] = this.koChange;
    (<QuestionRating>this.question).rateValuesChangedCallback = function() {
      self.onRateValuesChanged();
    };
    this.question["koGetCss"] = function(val) {
      var css = (<QuestionRating>self.question).itemCss;
      var selected = (<QuestionRating>self.question).selectedCss;
      return self.question["koValue"]() == val.value
        ? css + " " + selected
        : css;
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
  public itemCss: string;
  public selectedCss: string;
  constructor(public name: string) {
    super(name);
    new QuestionRatingImplementor(this);
  }
  protected onSetData() {
    var css = this.survey ? this.survey["css"] : null;
    if (css && css.rating) {
      this.itemCss = css.rating.item;
      this.selectedCss = css.rating.selected;
    }
  }
}

JsonObject.metaData.overrideClassCreatore("rating", function() {
  return new QuestionRating("");
});

QuestionFactory.Instance.registerQuestion("rating", name => {
  return new QuestionRating(name);
});
