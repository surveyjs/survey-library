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

  protected handleOnChange1 = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue: number = +event.target.value;
    this.question.value.splice(0, 1, newValue);
  }

  protected handleOnChange2 = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue: number = +event.target.value;
    this.question.value.splice(1, 1, newValue);
  }

  private getValue1() {
    const value = this.question.value[0];
    return value ?? 0;
  }

  private getValue2() {
    const value = this.question.value[1];
    return value ?? 0;
  }

  protected renderElement(): React.JSX.Element {
    return (
      <div className={this.question.rootCss} ref={(div) => (this.setControl(div))}>
        {/* <input type="range" min="0" max="100" value={this.getValue1()} step="1" onInput={this.handleOnInput1}/> */}
        <input type="range" value={this.getValue1()} min={0} max={100} step="1" onChange={this.handleOnChange1} />
        <input type="range" value={this.getValue2()} min={0} max={100} step="1" onChange={this.handleOnChange2} />
      </div>
    );
  }

}
ReactQuestionFactory.Instance.registerQuestion("rangeslider", (props) => {
  return React.createElement(SurveyQuestionRangeSlider, props);
});
