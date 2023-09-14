import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { QuestionHtmlModel } from "survey-core";

export class QuestionHtml extends QuestionHtmlModel {
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

Serializer.overrideClassCreator("html", function() {
  return new QuestionHtml("");
});
QuestionFactory.Instance.registerQuestion("html", name => {
  return new QuestionHtml(name);
});
