import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { QuestionHtmlModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionHtml extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionHtmlModel {
    return this.questionBase as QuestionHtmlModel;
  }
  componentDidMount() {
    this.reactOnStrChanged();
  }
  componentWillUnmount() {
    this.question.locHtml.onChanged = function () {};
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    this.reactOnStrChanged();
  }
  private reactOnStrChanged() {
    this.question.locHtml.onChanged = () => {
      this.setState({ changed: !!this.state && this.state.changed ? this.state.changed + 1 : 1 });
    };
  }
  protected canRender(): boolean {
    return super.canRender() && !!this.question.html;
  }
  protected renderElement(): JSX.Element {
    var htmlValue = { __html: this.question.locHtml.renderedHtml };
    return (
      <div
        className={this.question.renderCssRoot}
        dangerouslySetInnerHTML={htmlValue}
      />
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("html", (props) => {
  return React.createElement(SurveyQuestionHtml, props);
});
