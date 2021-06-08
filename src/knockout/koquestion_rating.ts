import * as ko from "knockout";
import { QuestionImplementor } from "./koquestion";
import {
  QuestionRatingModel,
  Serializer,
  QuestionFactory,
  Question,
} from "survey-core";

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

QuestionFactory.Instance.registerQuestion("rating", (name) => {
  return new QuestionRating(name);
});
