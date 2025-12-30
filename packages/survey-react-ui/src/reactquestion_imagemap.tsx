import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { QuestionImageMapModel } from "survey-core";

export class SurveyQuestionImageMap extends SurveyQuestionElementBase {

  constructor(props: any) {
    super(props);
    this.state = { width: undefined, height: undefined, scale: undefined };
  }

  protected get question(): QuestionImageMapModel {
    return this.questionBase as QuestionImageMapModel;
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  public renderElement(): React.JSX.Element {

    return (
      <div className={this.question.cssClasses.root} ref={(root) => (this.setControl(root))}>
        <img className={this.question.cssClasses.bg} id={`${this.question.id}-bg`} src={this.question.imageLink} />
        <svg className={this.question.cssClasses.svg} id={`${this.question.id}-svg`}></svg>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("imagemap", (props) => {
  return React.createElement(SurveyQuestionImageMap, props);
});
