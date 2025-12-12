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
        <img className={this.question.cssClasses.background} id={`imagemap-${this.question.id}-background`} src={this.question.imageLink} />
        <canvas className={this.question.cssClasses.canvas.preview} id={`imagemap-${this.question.id}-canvas-preview`}></canvas>
        <canvas className={this.question.cssClasses.canvas.hover} id={`imagemap-${this.question.id}-canvas-hover`}></canvas>
        <canvas className={this.question.cssClasses.canvas.selected} id={`imagemap-${this.question.id}-canvas-selected`}></canvas>
        <img
          className={this.question.cssClasses.map}
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
