import * as ko from "knockout";
import { QuestionImplementor } from "./koquestion";
import { QuestionRatingModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { Question } from "../question";

export class QuestionRatingImplementor extends QuestionImplementor {
  koVisibleRateValues: any;
  protected onCreated() {}
  constructor(question: Question) {
    super(question);
    this.onCreated();
    this.koVisibleRateValues = this.setObservaleObj(
      "koVisibleRateValues",
      ko.observableArray()
    );
    (<QuestionRating>this.question).rateValuesChangedCallback = () => {
      this.onRateValuesChanged();
    };
    this.setObservaleObj("koGetCss", (val: any) => {
      var itemCss = this.question.cssClasses.item;
      var selected = this.question.cssClasses.selected;
      var disabled = this.question.cssClasses.disabled;
      var result = itemCss;
      if (this.question.value == val.value) {
        result = result + " " + selected;
      }
      if (this.question.isReadOnly) {
        result = result + " " + disabled;
      }
      return result;
    });
  }
  protected onRateValuesChanged() {
    this.koVisibleRateValues(this.getValues());
  }
  private getValues(): Array<any> {
    return (<QuestionRating>this.question).visibleRateValues;
  }
  public dispose() {
    (<QuestionRating>this.question).rateValuesChangedCallback = undefined;
    super.dispose();
  }
}

export class QuestionRating extends QuestionRatingModel {
  private _implementor: QuestionRatingImplementor;
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionRatingImplementor(this);
  }
  public dispose() {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}

Serializer.overrideClassCreator("rating", function() {
  return new QuestionRating("");
});

QuestionFactory.Instance.registerQuestion("rating", name => {
  return new QuestionRating(name);
});
