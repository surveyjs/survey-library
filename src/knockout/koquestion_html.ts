import * as ko from "knockout";
import { JsonObject } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionImplementorBase } from "./koquestionbase";
import { QuestionHtmlModel } from "../question_html";

export class QuestionHtml extends QuestionHtmlModel {
  constructor(public name: string) {
    super(name);
    new QuestionImplementorBase(this);
  }
}

JsonObject.metaData.overrideClassCreatore("html", function() {
  return new QuestionHtml("");
});
QuestionFactory.Instance.registerQuestion("html", name => {
  return new QuestionHtml(name);
});
