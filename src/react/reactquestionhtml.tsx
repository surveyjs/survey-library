import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestionelement";
import { QuestionHtmlModel } from "../question_html";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionHtml extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionHtmlModel {
    return this.questionBase as QuestionHtmlModel;
  }
  render(): JSX.Element {
    if (!this.question || !this.question.html) return null;
    var htmlValue = { __html: this.question.locHtml.renderedHtml };
    return <div dangerouslySetInnerHTML={htmlValue} />;
  }
}

ReactQuestionFactory.Instance.registerQuestion("html", props => {
  return React.createElement(SurveyQuestionHtml, props);
});
