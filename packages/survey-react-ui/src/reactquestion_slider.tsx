import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { Base, QuestionSliderModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactElement } from "react";

export class SurveyQuestionSlider extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.rangeInputRef = React.createRef();
  }
  componentDidMount() {
    super.componentDidMount();
    this.refreshInputRange();
  }

  protected get question(): QuestionSliderModel {
    return this.questionBase as QuestionSliderModel;
  }

  protected getStateElement(): Base {
    return this.question;
  }

  protected renderElement(): React.JSX.Element {
    const { cssClasses, showLabels, sliderType } = this.question;

    const inputs = this.getInputs();
    const rangeInput = sliderType === "single" ? null : this.getRangeInput();
    const thumbs = this.getThumbs();
    const ticks = showLabels ? this.getTicks() : null;

    const value = this.getRenderedValue();
    const leftPercent = this.getPercent(Math.min(value[0], value[value.length - 1]));
    const rightPercent = this.getPercent(Math.max(value[0], value[value.length - 1]));

    const rangeLeftPercent = leftPercent + "%";
    const rangeRightPercent = (100 - rightPercent) + "%";

    return (
      <div className={this.question.rootCss} ref={(div) => (this.setControl(div))}>
        <div className={cssClasses.visualSliderContainer} onPointerUp={ (e)=>{ this.moveThumbByClick(e); }}>
          <div className={cssClasses.inverseTrackLeft} style={{ width: rangeLeftPercent }}></div>
          <div className={cssClasses.inverseTrackRight} style={{ width: rangeRightPercent }}></div>
          <div className={cssClasses.rangeTrack} style={{ left: rangeLeftPercent, right: rangeRightPercent }} ></div>
          {thumbs}
        </div>
        <div className={cssClasses.ticksContainer}>
          <div>
            {ticks}
          </div>
        </div>
        {inputs}
        {rangeInput}
      </div>
    );
  }

  private rangeInputRef:React.RefObject<HTMLInputElement>;

  private getInputs() {
    const inputs = [];
    const { max, min, step, cssClasses } = this.question;

    let value:number[] = this.getRenderedValue();

    for (let i = 0; i < value.length; i++) {
      const input = <input className={cssClasses.input} key={"input-"+i} type="range" value={value[i]} min={min} max={max} step={step} onChange={ (e)=>{ this.handleOnChange(e, i); } } onFocus={ (e)=>{ this.handleOnFocus(e, i); } } onBlur={ (e)=>{ this.handleOnBlur(e, i); } } onPointerUp={ (e)=>{ this.handlePointerUp(e); } }/>;
      inputs.push(input);
    }
    return inputs;
  }

  private getRangeInput() {
    const { max, min, step, cssClasses, allowDragRange } = this.question;
    if (!allowDragRange) return null;
    return <input name={"range-input"} ref={this.rangeInputRef} className={cssClasses.input} type="range" min={min} max={max} step={step} tabIndex={-1} onChange={ (e)=>{ this.handleRangeOnChange(e); } } onPointerDown={ (e)=>{ this.handleRangePointerDown(e); } } onPointerUp={ (e)=>{ this.handleRangePointerUp(e); } } />;
  }

  private getThumbs() {
    const thumbs = [];
    const { isIndeterminate, cssClasses, tooltipFormat, focusedThumb, tooltipVisibility } = this.question;

    let value:number[] = this.getRenderedValue();

    for (let i = 0; i < value.length; i++) {
      let percent: string = this.getPercent(value[i]) + "%";

      let tooltip: ReactElement | null = null;
      if (tooltipVisibility !== "never") {
        tooltip = <div className={`${cssClasses.tooltip} ${tooltipVisibility === "onhover" ? cssClasses.tooltipOnHoverMode : ""}`} style={{ left: percent }}>
          <span className={cssClasses.tooltipValue} id={"sign-value-"+i}>{isIndeterminate? "—" : tooltipFormat.replace("{0}", ""+value[i]) }</span>
        </div>;
      }

      // TODO all keys should be generated ids
      const thumb = <React.Fragment key={"thumb-"+i}>
        <span className={`${cssClasses.thumb} ${i === focusedThumb ? cssClasses.thumbFocusedMode : ""}`} style={{ left: percent }}></span>
        {tooltip}
      </React.Fragment>;
      thumbs.push(thumb);
    }
    return thumbs;
  }

  private getTicks() {
    const ticks = [];
    const { max, min, tickCount, showEdgeLabels, ticks: customTicks, cssClasses, step, labelFormat } = this.question;
    const fullRange = max - min;

    for (let i = 0; i < tickCount; i++) {
      let tickStep = i * fullRange / (tickCount - 1);
      let position = tickStep / fullRange * 100;

      if (!showEdgeLabels && (i === 0 || i === tickCount - 1)) continue;

      const isDecimal = step % 1 != 0;
      const tickText:string = customTicks.length > 0 ? customTicks[i].text : isDecimal ? ""+(tickStep + min) : ""+Math.round(tickStep + min);

      const tick = <React.Fragment key={"tick-"+i}>
        <div className={`${cssClasses.tick} ${tickText.length > 10 ? cssClasses.tickLong : ""}`} style={{ left: position + "%" }}>{labelFormat.replace("{0}", ""+tickText)}</div>
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
    const { max, min, renderedmaxRangeLength: maxRangeLength, sliderType } = this.question;
    let result = this.question.value.slice();

    if (sliderType === "single") {
      if (typeof result === "undefined" || result.length === 0) {
        this.question.isIndeterminate = true;
        return [min];
      } else {
        return [result];
      }
    }

    if (result.length === 0) {
      const fullRange = max - min;
      this.question.isIndeterminate = true;
      if (fullRange > maxRangeLength) return [(fullRange - maxRangeLength) / 2, (fullRange + maxRangeLength) / 2];
      return [min, max]; // TODO support several values 3 and more
    }

    return result;
  }

  private refreshInputRange() {
    if (!this.question.allowDragRange) return;
    const renderedValue = this.getRenderedValue();
    const percentLastValue = this.getPercent(renderedValue[renderedValue.length - 1]);
    const percentFirstValue = this.getPercent(renderedValue[0]);
    let percent: number = percentLastValue - percentFirstValue;

    const inputNode = this.rangeInputRef.current;
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-width", `calc(${percent}% - 20px - 20px)`); //TODO 20px is thumb width remove hardcode
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-left", `calc(${percentFirstValue}% + 20px)`); //TODO 10px
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-position", "absolute");
  }

  private handleOnChange = (event: React.ChangeEvent<HTMLInputElement>, inputNumber: number): void => {
    const renderedValue:number[] = this.getRenderedValue();

    let newValue: number = +event.target.value;

    if (renderedValue.length > 1) {
      newValue = this.ensureRightBorder(newValue, inputNumber);
      newValue = this.ensureLeftBorder(newValue, inputNumber);
    }

    renderedValue.splice(inputNumber, 1, newValue);
    // renderedValue.sort((a, b)=>a-b);
    this.question.value = renderedValue;
  }

  private handlePointerUp(e) {
    const renderedValue:number[] = this.getRenderedValue();
    renderedValue.sort((a, b)=>a-b);
    this.question.value = renderedValue;
    this.refreshInputRange();
  }

  private oldInputValue: number | null = null;

  private handleRangePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const { dragOrClickHelper, allowDragRange } = this.question;
    if (allowDragRange) {
      event.persist();
      dragOrClickHelper.dragHandler = this.prepareInputRangeForMoving.bind(this);
      dragOrClickHelper.onPointerDown(event);
    }
  }
  private isRangeMoving = false;
  private prepareInputRangeForMoving(event: React.PointerEvent<HTMLDivElement>) {
    const { max, min } = this.question;

    this.isRangeMoving = true;

    const inputNode = this.rangeInputRef.current;
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-width", "20px");
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-left", "initial");
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-position", "static");

    const leftPercent = ((event.clientX - this.control.getBoundingClientRect().x) / this.control.getBoundingClientRect().width) * 100;
    const newInputValue = leftPercent/100*(max-min) + min;
    inputNode.value = ""+newInputValue;
    this.oldInputValue = newInputValue;
  }

  private handleRangePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (this.isRangeMoving) {
      this.refreshInputRange();
      this.isRangeMoving = false;
      return;
    }

    const inputNode = this.rangeInputRef.current;
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-width", "0px");
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-left", "initial");
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-position", "static");
    this.moveThumbByClick(event);
  }

  private moveThumbByClick = (event: React.PointerEvent<HTMLDivElement>) => {
    console.log("handle click!");
    const { max, min, maxRangeLength, minRangeLength } = this.question;

    const percent = ((event.clientX - this.control.getBoundingClientRect().x) / this.control.getBoundingClientRect().width) * 100;
    let newValue = Math.round(percent/100*(max-min) + min);

    const renderedValue = this.getRenderedValue();
    let thumbIndex = 0;

    for (let i = 0; i < renderedValue.length; i++) {
      const currentMinValueDiff = Math.abs(renderedValue[thumbIndex] - newValue);
      const newMinValueDiff = Math.abs(renderedValue[i] - newValue);
      if (newMinValueDiff < currentMinValueDiff) {
        thumbIndex = i;
      }
    }

    // TODO ensure all borders logic ensureBorders(newValue) {...}; rendederValue = ensureBorders(newValue);
    if (renderedValue.length > 1) {
      newValue = this.ensureRightBorder(newValue, thumbIndex);
      newValue = this.ensureLeftBorder(newValue, thumbIndex);
    }
    renderedValue[thumbIndex] = newValue;
    this.question.value = renderedValue;
    this.refreshInputRange();
  }

  private handleRangeOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!this.isRangeMoving) return;
    const { step, max, min } = this.question;
    const diff = +event.target.value > this.oldInputValue ? -step : step;
    this.oldInputValue = +event.target.value;

    const renderedValue = this.getRenderedValue();
    let borderArrived = false;
    for (let i = 0; i < renderedValue.length; i++) {
      const newVal = renderedValue[i] - diff;
      if (newVal <= max && newVal >= min) {
        renderedValue[i] -= diff;
      } else {
        borderArrived = true;
      }
    }

    if (borderArrived) { borderArrived = false; return; }
    this.question.value = renderedValue;
  }

  private handleOnFocus = (event: React.ChangeEvent<HTMLInputElement>, inputNumber: number): void => {
    this.question.focusedThumb = inputNumber;
  }

  private handleOnBlur = (event: React.ChangeEvent<HTMLInputElement>, inputNumber: number): void => {
    this.question.focusedThumb = null;
  }

  private ensureLeftBorder(newValue:number, inputNumber):number {
    const { renderedminRangeLength: minRangeLength, renderedmaxRangeLength: maxRangeLength, allowSwap } = this.question;

    if (allowSwap) return newValue;

    const value:number[] = this.getRenderedValue();
    const prevValueBorder = value[inputNumber - 1];
    const nextValueBorder = value[inputNumber + 1];

    if (nextValueBorder - newValue > maxRangeLength) return value[inputNumber];
    if (inputNumber <= 0) return newValue;

    return Math.max(newValue, prevValueBorder + minRangeLength);
  }

  private ensureRightBorder(newValue, inputNumber):number {
    const { renderedminRangeLength: minRangeLength, renderedmaxRangeLength: maxRangeLength, allowSwap } = this.question;

    if (allowSwap) return newValue;

    const value:number[] = this.getRenderedValue();
    const nextValueBorder = value[inputNumber + 1];
    const prevValueBorder = value[inputNumber - 1];

    if (newValue - prevValueBorder > maxRangeLength) return value[inputNumber];
    if (inputNumber === value.length-1) return newValue;

    return Math.min(newValue, nextValueBorder - minRangeLength);
  }
}
ReactQuestionFactory.Instance.registerQuestion("slider", (props) => {
  return React.createElement(SurveyQuestionSlider, props);
});
