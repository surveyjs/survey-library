import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionImplementor } from "./koquestion";
import { QuestionImageModel } from "../question_image";

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
