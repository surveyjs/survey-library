import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { QuestionRangeSliderModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionRangeSlider extends SurveyQuestionElementBase {
  protected get question(): QuestionRangeSliderModel {
    return this.questionBase as QuestionRangeSliderModel;
  }

  protected renderElement(): React.JSX.Element {
    return (
      <div className={this.question.rootCss} ref={(div) => (this.setControl(div))}>
        Range Slider
      </div>
    );
  }

}
ReactQuestionFactory.Instance.registerQuestion("rangeslider", (props) => {
  return React.createElement(SurveyQuestionRangeSlider, props);
});
