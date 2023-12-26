import * as ko from "knockout";
import { QuestionFactory, QuestionSignaturePadModel } from "survey-core";
import { Serializer } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { Question } from "survey-core";

export class QuestionSignaturePad extends QuestionSignaturePadModel {
  private _implementor: QuestionImplementor;
  constructor(name: string) {
    super(name);
  }
  public koOnBlur(data: any, event: any) {
    return this.onBlur(event);
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

Serializer.overrideClassCreator("signaturepad", function() {
  return new QuestionSignaturePad("");
});

QuestionFactory.Instance.registerQuestion("signaturepad", (name) => {
  return new QuestionSignaturePad(name);
});
