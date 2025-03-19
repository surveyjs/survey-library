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

  protected renderElement(): React.JSX.Element {
    const inputs = this.getInputs();
    const thumbs = this.getThumbs();

    const value = this.getRenderedValue();
    const leftPercent = this.getPercent(value[0]);
    const rightPercent = this.getPercent(value[value.length - 1]);

    const rangeLeftPercent = leftPercent + "%";
    const rangeRightPercent = (100 - rightPercent) + "%";

    return (
      <div className={this.question.rootCss} ref={(div) => (this.setControl(div))}>
        <div id="slider">
          <div>
            <div id="inverse-left" style={{ width: rangeLeftPercent }}></div>
            <div id="inverse-right" style={{ width: rangeRightPercent }}></div>
            <div id="range" style={{ left: rangeLeftPercent, right: rangeRightPercent }}></div>
            {thumbs}
          </div>
          {inputs}
        </div>

      </div>
    );
  }

  private getInputs() {
    let value:number[] = this.getRenderedValue();
    const { max, min, step } = this.question;

    const inputs = [];
    for (let i = 0; i < value.length; i++) {
      const input = <input id={"input-"+i} key={"input-"+i} type="range" value={value[i]} min={min} max={max} step={step} onChange={ (e)=>{ this.handleOnChange(e, i); } } />;
      inputs.push(input);
    }
    return inputs;
  }

  private getThumbs() {
    let value:number[] = this.getRenderedValue();

    const thumbs = [];
    for (let i = 0; i < value.length; i++) {
      let percent: string = this.getPercent(value[i]) + "%";

      const thumb = <React.Fragment key={"thumb-"+i}>
        <span id={"thumb-"+i} style={{ left: percent }} ></span>

        <div id={"sign-"+i} style={{ left: percent }}>
          <span id={"sign-value-"+i}>{value[i]}</span>
        </div>
      </React.Fragment>;
      thumbs.push(thumb);
    }
    return thumbs;
  }

  private getPercent(value:number):number {
    const max = this.question.max;
    return ((value/max)*100);
  }

  private getRenderedValue() {
    const value = this.question.value;
    if (value.length === 0) {
      return [0, 100];
    }
    return value;
  }

  private handleOnChange = (event: React.ChangeEvent<HTMLInputElement>, inputNumber: number): void => {
    const minDiff = this.question.minDiff;
    let value:number[] = this.getRenderedValue();

    let newThumbValue: number;

    if (inputNumber === 0) {
      newThumbValue = Math.min(+event.target.value, value[inputNumber + 1] - minDiff);
    } else if (inputNumber === value.length-1) {
      newThumbValue = Math.max(+event.target.value, value[inputNumber - 1]-(-minDiff));
    } else {
      newThumbValue = Math.min(+event.target.value, value[inputNumber + 1] - minDiff);
      newThumbValue = Math.max(newThumbValue, value[inputNumber - 1]-(-minDiff));
    }

    const renderedValue = this.getRenderedValue();
    renderedValue.splice(inputNumber, 1, newThumbValue);
    this.question.value = renderedValue;
  }
}
ReactQuestionFactory.Instance.registerQuestion("rangeslider", (props) => {
  return React.createElement(SurveyQuestionRangeSlider, props);
});
