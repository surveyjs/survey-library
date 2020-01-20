import * as ko from "knockout";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionImplementor } from "./koquestion";
import { QuestionHtmlModel } from "../question_html";

export class QuestionHtml extends QuestionHtmlModel {
  constructor(public name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionImplementor(this);
  }
}

Serializer.overrideClassCreator("html", function() {
  return new QuestionHtml("");
});
QuestionFactory.Instance.registerQuestion("html", name => {
  return new QuestionHtml(name);
});
