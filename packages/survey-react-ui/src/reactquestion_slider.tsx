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
    const { cssClasses, showLabels, sliderType, getRenderedValue } = this.question;

    const inputs = this.getInputs();
    const rangeInput = sliderType === "single" ? null : this.getRangeInput();
    const thumbs = this.getThumbs();
    const labels = showLabels ? this.getLabels() : null;

    const value = getRenderedValue();
    const leftPercent = sliderType === "single" ? this.getPercent(Math.min(value, 0)) : this.getPercent(Math.min(...value));
    const rightPercent = sliderType === "single" ? this.getPercent(Math.max(value, 0)) : this.getPercent(Math.max(...value));

    const rangeLeftPercent = leftPercent + "%";
    const rangeRightPercent = (100 - rightPercent) + "%";

    return (
      <div className={this.question.rootCss} ref={(div) => (this.setControl(div))}>
        <div className={cssClasses.visualContainer} onPointerUp={ (e)=>{ this.setValueByClick(e); }}>
          <div className={cssClasses.visualContainerSlider}>
            <div className={cssClasses.inverseTrackLeft} style={{ width: rangeLeftPercent }}></div>
            <div className={cssClasses.inverseTrackRight} style={{ width: rangeRightPercent }}></div>
            <div className={cssClasses.rangeTrack} style={{ left: rangeLeftPercent, right: rangeRightPercent }} ></div>
            {thumbs}
          </div>
        </div>
        <div className={cssClasses.labelsContainer}>
          <div>
            {labels}
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
    const { max, min, step, cssClasses, getRenderedValue, isDisabledAttr, isReadOnlyAttr } = this.question;

    let value:number[] = getRenderedValue();

    for (let i = 0; i < value.length; i++) {
      const input = <input className={cssClasses.input} id={"sjs-slider-input-" + i} key={"input-" + i} type="range" value={value[i]} min={min} max={max} step={step}
        onChange={ (e)=>{ this.handleOnChange(e, i); } } onFocus={ (e)=>{ this.handleOnFocus(e, i); } } onBlur={ (e)=>{ this.handleOnBlur(e, i); } }
        onPointerDown={ (e)=>{ this.handlePointerDown(e); } } onPointerUp={ (e)=>{ this.handlePointerUp(e, i); } }
        disabled={isDisabledAttr}
      />;
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
    const { isIndeterminate, cssClasses, thumbContainerCss, tooltipFormat, focusedThumb, tooltipVisibility, step, getRenderedValue } = this.question;

    let value:number[] = getRenderedValue();

    for (let i = 0; i < value.length; i++) {
      let percent: string = this.getPercent(value[i]) + "%";

      let tooltip: ReactElement | null = null;
      let toolTipValue = step ? this.getClosestToStepValue(value[i]) : value[i];

      if (tooltipVisibility !== "never") {
        tooltip = <React.Fragment>
          <div className={`${cssClasses.tooltip} ${tooltipVisibility === "onhover" ? cssClasses.tooltipOnHoverMode : ""}`} style={{ left: percent }}>
            <div className={cssClasses.tooltipPanel}>
              <div className={cssClasses.tooltipValue} >{isIndeterminate ? "—" : tooltipFormat.replace("{0}", "" + toolTipValue)}</div>
            </div>
            <div className={cssClasses.tooltipPointer}>
              <svg viewBox="0 0 12 6" fill="black" xmlns="http://www.w3.org/2000/svg">
                <path id="Pointer" d="M6 6L12 0L5.24537e-07 -1.04907e-06L6 6Z" />
              </svg>
            </div>
          </div>
        </React.Fragment>;
      }

      // TODO all keys should be generated ids
      const thumb = <React.Fragment key={"thumb-" + i}>
        <div className={`${thumbContainerCss} ${i === focusedThumb ? cssClasses.thumbContainerFocusedMode : ""}`} style={{ left: percent }}>
          <div className={cssClasses.thumb}>
            <div className={cssClasses.thumbDot}></div>
          </div>
        </div>
        {tooltip}
      </React.Fragment>;
      thumbs.push(thumb);
    }
    return thumbs;
  }

  private getLabels() {
    const labels = [];
    const { max, min, labelCount, showEdgeLabels, labels: customLabels, cssClasses, step, labelFormat } = this.question;
    const fullRange = max - min;

    for (let i = 0; i < labelCount; i++) {
      let labelStep = i * fullRange / (labelCount - 1);
      let position = labelStep / fullRange * 100;

      if (!showEdgeLabels && (i === 0 || i === labelCount - 1)) continue;

      const isDecimal = step % 1 != 0;
      const labelText:string = customLabels.length > 0 ? customLabels[i].text : isDecimal ? "" + (labelStep + min) : "" + Math.round(labelStep + min);

      const label = <React.Fragment key={"label-" + i}>
        <div className={`${cssClasses.label} ${labelText.length > 10 ? cssClasses.labelLongMod : ""}`} style={{ left: position + "%" }}>
          <div className={cssClasses.labelTick}></div>
          <div className={cssClasses.labelText}>
            {labelFormat.replace("{0}", "" + labelText)}
          </div>
        </div>
      </React.Fragment>;

      labels.push(label);
    }

    return labels;
  }

  private getPercent(value:number):number {
    const { max, min } = this.question;
    const fullRange = max - min;
    return (Math.abs(value - min) / fullRange) * 100;
  }

  private refreshInputRange() {
    const { allowDragRange, getRenderedValue } = this.question;
    if (!allowDragRange) return;
    if (!this.rangeInputRef.current) return;
    const renderedValue = getRenderedValue();
    const percentLastValue = this.getPercent(renderedValue[renderedValue.length - 1]);
    const percentFirstValue = this.getPercent(renderedValue[0]);
    let percent: number = percentLastValue - percentFirstValue;

    const inputNode = this.rangeInputRef.current;
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-width", `calc(${percent}% - 20px - 20px)`); //TODO 20px is thumb width remove hardcode
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-left", `calc(${percentFirstValue}% + 20px)`);
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-position", "absolute");
  }

  private handleOnChange = (event: React.ChangeEvent<HTMLInputElement>, inputNumber: number): void => {
    const { allowSwap, ensureMaxRangeBorders, ensureMinRangeBorders, getRenderedValue } = this.question;
    const renderedValue:number[] = getRenderedValue();

    let newValue: number = +event.target.value;

    if (renderedValue.length > 1) {
      newValue = ensureMaxRangeBorders(newValue, inputNumber);
      if (!allowSwap) {
        newValue = ensureMinRangeBorders(newValue, inputNumber);
      }
    }

    renderedValue.splice(inputNumber, 1, newValue);

    this.setSliderValue(renderedValue);
  };

  private oldValue;
  private handlePointerDown = (e)=> {
    const { step, getRenderedValue } = this.question;
    const renderedValue = getRenderedValue();
    if (step) {
      for (let i = 0; i < renderedValue.length; i++) {
        const input:any = document.getElementById(`sjs-slider-input-${i}`); //TODO
        input.step = 0.1;
      }
    }
    const value = this.question.value;
    this.oldValue = Array.isArray(value) ? value.slice() : value;
  };

  private handlePointerUp = (e, inputNumber:number) => {
    const { step, focusedThumb, getRenderedValue, allowSwap, renderedminRangeLength, value } = this.question;
    let renderedValue:number[] = getRenderedValue();
    const focusedThumbValue = renderedValue[focusedThumb];

    renderedValue.sort((a, b)=>a - b);

    if (allowSwap) {
      for (let i = 0; i < value.length - 1; i++) {
        if (Math.abs(value[i] - value[i + 1]) < renderedminRangeLength) {
          renderedValue = this.oldValue;
          break;
        }
      }
    }

    this.question.focusedThumb = renderedValue.indexOf(focusedThumbValue);
    if (step) {
      for (let i = 0; i < renderedValue.length; i++) {
        renderedValue[i] = this.getClosestToStepValue(renderedValue[i]);
        const input:any = document.getElementById(`sjs-slider-input-${i}`); //TODO
        input.step = step;
      }
    }
    this.setSliderValue(renderedValue);
    this.refreshInputRange();
    this.oldValue = null;
  };

  private setValueByClick = (event: React.PointerEvent<HTMLDivElement>) => {
    const { max, min, step, allowSwap, ensureMaxRangeBorders, ensureMinRangeBorders, getRenderedValue } = this.question;

    const percent = ((event.clientX - this.control.getBoundingClientRect().x) / this.control.getBoundingClientRect().width) * 100;
    let newValue = Math.round(percent / 100 * (max - min) + min);

    const renderedValue = getRenderedValue();
    let thumbIndex = 0;

    for (let i = 0; i < renderedValue.length; i++) {
      const currentMinValueDiff = Math.abs(renderedValue[thumbIndex] - newValue);
      const newMinValueDiff = Math.abs(renderedValue[i] - newValue);
      if (newMinValueDiff < currentMinValueDiff) {
        thumbIndex = i;
      }
    }

    if (renderedValue.length > 1) {
      newValue = ensureMaxRangeBorders(newValue, thumbIndex);
      newValue = ensureMinRangeBorders(newValue, thumbIndex);
    }
    renderedValue[thumbIndex] = newValue;

    if (step) {
      const currentValue = getRenderedValue();
      for (let i = 0; i < renderedValue.length; i++) {
        const currentValueStep = currentValue[i] / step;
        const newValueStep = renderedValue[i] / step;
        const newValueRound = Math.round(newValueStep);

        if (newValueRound === currentValueStep) {
          if (newValueStep > currentValueStep) {
            renderedValue[i] = renderedValue[i] + step;
          } else if (newValueStep < currentValueStep) {
            renderedValue[i] = renderedValue[i] - step;
          }
        }

        renderedValue[i] = this.getClosestToStepValue(renderedValue[i]);
      }
    }

    this.setSliderValue(renderedValue);
    this.refreshInputRange();
  };

  private getClosestToStepValue(value: number): number {
    const { step } = this.question;
    return Math.round(value / step) * step;
  }

  private oldInputValue: number | null = null;

  private handleRangePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const { dragOrClickHelper, allowDragRange, step } = this.question;

    if (step) {
      const input = this.rangeInputRef.current as HTMLInputElement; //TODO
      input.step = "0.1";
    }

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
    const newInputValue = leftPercent / 100 * (max - min) + min;
    inputNode.value = "" + newInputValue;
    this.oldInputValue = newInputValue;
  }

  private handleRangePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const { step, getRenderedValue } = this.question;
    if (this.isRangeMoving) {
      this.refreshInputRange();
      this.isRangeMoving = false;
      if (step) {
        const input = this.rangeInputRef.current as HTMLInputElement; //TODO
        input.step = "" + step;

        const renderedValue:number[] = getRenderedValue();
        for (let i = 0; i < renderedValue.length; i++) {
          renderedValue[i] = this.getClosestToStepValue(renderedValue[i]);
        }
        this.setSliderValue(renderedValue);
      }
      return;
    }

    const inputNode = this.rangeInputRef.current;
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-width", "0px");
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-left", "initial");
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-position", "static");
    this.setValueByClick(event);
  }

  private handleRangeOnChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!this.isRangeMoving) return;
    const { max, min, getRenderedValue } = this.question;
    //const diff = +event.target.value > this.oldInputValue ? -step : step;
    const diff = this.oldInputValue - +event.target.value;
    this.oldInputValue = +event.target.value;

    const renderedValue = getRenderedValue();
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
    this.setSliderValue(renderedValue);
  };

  private handleOnFocus = (event: React.ChangeEvent<HTMLInputElement>, inputNumber: number): void => {
    this.question.focusedThumb = inputNumber;
  };

  private handleOnBlur = (event: React.ChangeEvent<HTMLInputElement>, inputNumber: number): void => {
    this.question.focusedThumb = null;
  };

  private setSliderValue(newValue) {
    if (!this.question.isReadOnly && !this.question.isDisabledAttr && !this.question.isPreviewStyle && !this.question.isDisabledStyle) {
      this.question.value = newValue;
    }
  }
}
ReactQuestionFactory.Instance.registerQuestion("slider", (props) => {
  return React.createElement(SurveyQuestionSlider, props);
});
