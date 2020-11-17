import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { QuestionHtmlModel } from "../question_html";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionHtml extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionHtmlModel {
    return this.questionBase as QuestionHtmlModel;
  }
  protected canRender(): boolean {
    return super.canRender() && !!this.question.html;
  }
  protected renderElement(): JSX.Element {
    var htmlValue = { __html: this.question.locHtml.renderedHtml };
    return (
      <div
        className={this.question.cssClasses.root}
        dangerouslySetInnerHTML={htmlValue}
      />
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("html", (props) => {
  return React.createElement(SurveyQuestionHtml, props);
});
