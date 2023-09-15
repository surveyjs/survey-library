import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { QuestionImageModel } from "survey-core";

export class QuestionImage extends QuestionImageModel {
  private _implementor: QuestionImplementor;
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionImplementor(this);
  }
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}

Serializer.overrideClassCreator("image", function() {
  return new QuestionImage("");
});
QuestionFactory.Instance.registerQuestion("image", name => {
  return new QuestionImage(name);
});
