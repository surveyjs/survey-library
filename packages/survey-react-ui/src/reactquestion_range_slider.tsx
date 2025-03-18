import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { Base, QuestionRangeSliderModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionRangeSlider extends SurveyQuestionElementBase {
  protected get question(): QuestionRangeSliderModel {
    return this.questionBase as QuestionRangeSliderModel;
  }

  protected getStateElement(): Base {
    return this.question;
  }

  protected handleOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue: number = +event.target.value;
    if (newValue >= 70) return;
    this.question.value = [newValue, 100];
  }

  private getValue() {
    const value = this.question.value[0];
    return value ?? 0;
  }

  protected renderElement(): React.JSX.Element {
    return (
      <div className={this.question.rootCss} ref={(div) => (this.setControl(div))}>
        <input type="range" min="0" max="100" value={this.getValue()} step="1" onChange={this.handleOnChange}/>
      </div>
    );
  }

}
ReactQuestionFactory.Instance.registerQuestion("rangeslider", (props) => {
  return React.createElement(SurveyQuestionRangeSlider, props);
});
