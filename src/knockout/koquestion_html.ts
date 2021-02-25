import { Serializer } from "survey-core";
import { QuestionFactory } from "survey-core";
import { QuestionImplementor } from "./koquestion";
import { QuestionHtmlModel } from "survey-core";

export class QuestionHtml extends QuestionHtmlModel {
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
}

Serializer.overrideClassCreator("html", function () {
  return new QuestionHtml("");
});
QuestionFactory.Instance.registerQuestion("html", (name) => {
  return new QuestionHtml(name);
});
