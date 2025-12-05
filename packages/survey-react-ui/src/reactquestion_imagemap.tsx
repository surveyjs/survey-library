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
      <div style={{ position: "relative", userSelect: "none" }} ref={(root) => (this.setControl(root))}>

        <img id={`imagemap-${this.question.id}-background`} style={{ display: "block", width: "100%" }} src={this.question.imageLink} />

        <canvas id={`imagemap-${this.question.id}-canvas-selected`} style={{ position: "absolute", top: 0, left: 0, width: "100%" }}></canvas>

        <canvas id={`imagemap-${this.question.id}-canvas-hover`} style={{ position: "absolute", top: 0, left: 0, width: "100%" }}></canvas>

        <img
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0 }}
          src={this.question.imageLink}
          useMap={`#imagemap-${ this.question.id }`}
        />

        <map name={`imagemap-${ this.question.id }`}></map>

      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("imagemap", (props) => {
  return React.createElement(SurveyQuestionImageMap, props);
});
