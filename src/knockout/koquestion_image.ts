import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { QuestionImageModel } from "survey-core";

export class QuestionImage extends QuestionImageModel {
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
}

Serializer.overrideClassCreator("image", function () {
  return new QuestionImage("");
});
QuestionFactory.Instance.registerQuestion("image", (name) => {
  return new QuestionImage(name);
});
