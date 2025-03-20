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
    const cssClasses = this.question.cssClasses;

    const inputs = this.getInputs();
    const thumbs = this.getThumbs();

    const value = this.getRenderedValue();
    const leftPercent = this.getPercent(value[0]);
    const rightPercent = this.getPercent(value[value.length - 1]);

    const rangeLeftPercent = leftPercent + "%";
    const rangeRightPercent = (100 - rightPercent) + "%";

    return (
      <div className={this.question.rootCss} ref={(div) => (this.setControl(div))}>
        <div className={cssClasses.visualContainer}>
          <div className={cssClasses.inverseTrackLeft} style={{ width: rangeLeftPercent }}></div>
          <div className={cssClasses.inverseTrackRight} style={{ width: rangeRightPercent }}></div>
          <div className={cssClasses.rangeTrack} style={{ left: rangeLeftPercent, right: rangeRightPercent }}></div>
          {thumbs}
        </div>
        {inputs}
      </div>
    );
  }

  private getInputs() {
    const inputs = [];
    const cssClasses = this.question.cssClasses;
    const { max, min, step } = this.question;

    let value:number[] = this.getRenderedValue();

    for (let i = 0; i < value.length; i++) {
      const input = <input className={cssClasses.input} key={"input-"+i} type="range" value={value[i]} min={min} max={max} step={step} onChange={ (e)=>{ this.handleOnChange(e, i); } } />;
      inputs.push(input);
    }
    return inputs;
  }

  private getThumbs() {
    const thumbs = [];
    const cssClasses = this.question.cssClasses;

    let value:number[] = this.getRenderedValue();

    for (let i = 0; i < value.length; i++) {
      let percent: string = this.getPercent(value[i]) + "%";

      // TODO all keys should be generated ids
      const thumb = <React.Fragment key={"thumb-"+i}>
        <span className={cssClasses.thumb} style={{ left: percent }} ></span>

        <div className={cssClasses.tooltip} style={{ left: percent }}>
          <span className={cssClasses.tooltipValue} id={"sign-value-"+i}>{value[i]}</span>
        </div>
      </React.Fragment>;
      thumbs.push(thumb);
    }
    return thumbs;
  }

  private getPercent(value:number):number {
    const { max, min } = this.question;
    const fullRange = max - min;
    return ((value - min)/fullRange)*100;
  }

  private getRenderedValue() {
    const { max, min } = this.question;
    const value = this.question.value;
    if (value.length === 0) {
      return [min, max];
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
