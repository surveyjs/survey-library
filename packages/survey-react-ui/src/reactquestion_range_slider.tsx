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
    const { cssClasses, isShowTicks } = this.question;

    const inputs = this.getInputs();
    const thumbs = this.getThumbs();
    const ticks = isShowTicks ? this.getTicks() : null;

    const value = this.getRenderedValue();
    const leftPercent = this.getPercent(value[0]);
    const rightPercent = this.getPercent(value[value.length - 1]);

    const rangeLeftPercent = leftPercent + "%";
    const rangeRightPercent = (100 - rightPercent) + "%";

    return (
      <div className={this.question.rootCss} ref={(div) => (this.setControl(div))}>
        <div className={cssClasses.visualSliderContainer}>
          <div className={cssClasses.inverseTrackLeft} style={{ width: rangeLeftPercent }}></div>
          <div className={cssClasses.inverseTrackRight} style={{ width: rangeRightPercent }}></div>
          <div className={cssClasses.rangeTrack} style={{ left: rangeLeftPercent, right: rangeRightPercent }}></div>
          {thumbs}
        </div>
        <div className={cssClasses.ticksContainer}>
          <div>
            {ticks}
          </div>
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
    const { isIndeterminate, cssClasses, valueFormat } = this.question;

    let value:number[] = this.getRenderedValue();

    for (let i = 0; i < value.length; i++) {
      let percent: string = this.getPercent(value[i]) + "%";

      // TODO all keys should be generated ids
      const thumb = <React.Fragment key={"thumb-"+i}>
        <span className={cssClasses.thumb} style={{ left: percent }} ></span>

        <div className={cssClasses.tooltip} style={{ left: percent }}>
          <span className={cssClasses.tooltipValue} id={"sign-value-"+i}>{isIndeterminate? "—" : value[i] + valueFormat}</span>
        </div>
      </React.Fragment>;
      thumbs.push(thumb);
    }
    return thumbs;
  }

  private getTicks() {
    const ticks = [];
    const { max, min, ticks: ticksCount, isShowMinMaxTicks } = this.question;
    const fullRange = max - min;

    for (let i = 0; i < ticksCount; i++) {
      let tickStep = i * fullRange / (ticksCount - 1);
      let position = tickStep / fullRange * 100;

      if (!isShowMinMaxTicks && (i === 0 || i === ticksCount - 1)) continue;

      const tick = <React.Fragment key={"tick-"+i}>
        <div className={this.question.cssClasses.tick} style={{ left: position + "%" }}>{Math.round(tickStep)}</div>
      </React.Fragment>;

      ticks.push(tick);
    }

    return ticks;
  }

  private getPercent(value:number):number {
    const { max, min } = this.question;
    const fullRange = max - min;
    return ((value - min)/fullRange)*100;
  }

  private getRenderedValue() {
    const { max, min, maxSelectedRange } = this.question;
    let value = this.question.value;

    if (!Array.isArray(value)) {
      value = typeof value === "undefined" ? [] : [value];
    }

    if (value.length === 0) {
      const fullRange = max - min;
      this.question.isIndeterminate = true;
      if (fullRange > maxSelectedRange) return [(fullRange - maxSelectedRange) / 2, (fullRange + maxSelectedRange) / 2];
      return [min, max];
    }

    return value;
  }

  private handleOnChange = (event: React.ChangeEvent<HTMLInputElement>, inputNumber: number): void => {
    const value:number[] = this.getRenderedValue();

    let newValue: number = +event.target.value;

    if (value.length > 1) {
      newValue = this.ensureRightBorder(newValue, inputNumber);
      newValue = this.ensureLeftBorder(newValue, inputNumber);
    }

    const renderedValue = this.getRenderedValue();
    renderedValue.splice(inputNumber, 1, newValue);
    this.question.value = renderedValue;
  }

  private ensureLeftBorder(newValue:number, inputNumber):number {
    const { minSelectedRange, maxSelectedRange } = this.question;
    const value:number[] = this.getRenderedValue();
    const prevValueBorder = value[inputNumber - 1];
    const nextValueBorder = value[inputNumber + 1];

    if (nextValueBorder - newValue > maxSelectedRange) return value[inputNumber];
    if (inputNumber <= 0) return newValue;

    return Math.max(newValue, prevValueBorder + minSelectedRange);
  }

  private ensureRightBorder(newValue, inputNumber):number {
    const value:number[] = this.getRenderedValue();
    const { minSelectedRange, maxSelectedRange } = this.question;
    const nextValueBorder = value[inputNumber + 1];
    const prevValueBorder = value[inputNumber - 1];

    if (newValue - prevValueBorder > maxSelectedRange) return value[inputNumber];
    if (inputNumber === value.length-1) return newValue;

    return Math.min(newValue, nextValueBorder - minSelectedRange);
  }
}
ReactQuestionFactory.Instance.registerQuestion("rangeslider", (props) => {
  return React.createElement(SurveyQuestionRangeSlider, props);
});
