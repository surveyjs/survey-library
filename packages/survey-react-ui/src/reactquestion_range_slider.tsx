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

    var input:any = event.target;
    var otherInput:any = document.getElementById("input2");
    input.value = Math.min(input.value, otherInput.value - 10);
    let percent = (input.value/parseInt(input.max))*100;
    document.getElementById("inverse-left").style.width = percent + "%";
    document.getElementById("range").style.left = percent + "%";
    document.getElementById("thumb-left").style.left = percent + "%";
    document.getElementById("sign-left").style.left = percent + "%";
    document.getElementById("sign-value-left").innerHTML = input.value;
  }

  protected handleOnChange2 = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue: number = +event.target.value;
    this.question.value.splice(1, 1, newValue);

    var input:any = event.target;
    var otherInput:any = document.getElementById("input1");
    input.value = Math.max(input.value, otherInput.value-(-10));
    let percent = (input.value/parseInt(input.max))*100;
    document.getElementById("inverse-right").style.width = (100 - percent) + "%";
    document.getElementById("range").style.right = (100 - percent) + "%";
    document.getElementById("thumb-right").style.left = percent + "%";
    document.getElementById("sign-right").style.left = percent + "%";
    document.getElementById("sign-value-right").innerHTML = input.value;
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
        <div id="slider">
          <div>
            <div id="inverse-left" style={{ width: "0%" }}></div>
            <div id="inverse-right" style={{ width: "0%" }}></div>
            <div id="range" style={{ left: "0%", right: "0%" }}></div>

            <span id="thumb-left" style={{ left: "0%" }} ></span>
            <span id="thumb-right" style={{ left: "100%" }} ></span>

            <div id="sign-left" style={{ left: "0%" }}>
              <span id="sign-value-left">0</span>
            </div>
            <div id="sign-right" style={{ left: "100%" }} >
              <span id="sign-value-right">100</span>
            </div>
          </div>

          <input id="input1" type="range" value={this.getValue1()} min={0} max={100} step="1" onChange={this.handleOnChange1} />
          <input id="input2" type="range" value={this.getValue2()} min={0} max={100} step="1" onChange={this.handleOnChange2} />
        </div>

      </div>
    );
  }

}
ReactQuestionFactory.Instance.registerQuestion("rangeslider", (props) => {
  return React.createElement(SurveyQuestionRangeSlider, props);
});
