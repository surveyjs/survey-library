import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestionelement";
import { QuestionHtmlModel } from "../question_html";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionHtml extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = { htmlChanged: 0 };
  }
  protected get question(): QuestionHtmlModel {
    return this.questionBase as QuestionHtmlModel;
  }
  componentDidMount() {
    if (this.question) {
      var self = this;
      this.question.locHtml.onStrChanged = function() {
        self.setState({ htmlChanged: self.state.htmlChanged + 1 });
      };
    }
  }
  componentWillUnmount() {
    if (this.question) {
      this.question.locHtml.onStrChanged = null;
    }
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
