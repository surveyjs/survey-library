import * as ko from "knockout";
import { QuestionImplementor } from "./koquestion";
import {
  QuestionRatingModel,
  Serializer,
  QuestionFactory,
  Question,
} from "survey-core";

export class QuestionRatingImplementor extends QuestionImplementor {
  protected onCreated() {}
  constructor(question: Question) {
    super(question);
    this.onCreated();
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
  public dispose(): void {
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
