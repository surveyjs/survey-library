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
    const { cssClasses, showLabels, sliderType, getTrackPercentLeft, getTrackPercentRight } = this.question;

    const rangeInput = sliderType === "single" ? null : this.getRangeInput();
    const thumbsAndInputs = this.getInputsAndThumbs();
    const labels = showLabels ? this.getLabels() : null;

    const rangeLeftPercent = getTrackPercentLeft() + "%";
    const rangeRightPercent = getTrackPercentRight() + "%";

    return (
      <div className={this.question.rootCss} ref={(div) => (this.setControl(div))}>
        {rangeInput}
        <div className={cssClasses.visualContainer} onPointerUp={ (e)=>{ this.setValueByClick(e); }}>
          <div className={cssClasses.visualContainerSlider}>
            <div className={cssClasses.inverseTrackLeft} style={{ width: rangeLeftPercent }}></div>
            <div className={cssClasses.inverseTrackRight} style={{ width: rangeRightPercent }}></div>
            <div className={cssClasses.rangeTrack} style={{ left: rangeLeftPercent, right: rangeRightPercent }} ></div>
            {thumbsAndInputs}
          </div>
        </div>
        {labels}
      </div>
    );
  }

  private rangeInputRef:React.RefObject<HTMLInputElement>;

  private getInputsAndThumbs() {
    const inputsAndThumbs = [];
    const value:number[] = this.question.getRenderedValue();

    for (let i = 0; i < value.length; i++) {
      // TODO all keys should be generated ids
      const thumbAndInput = <React.Fragment key={"thumb-" + i}>
        {this.getInput(i)}
        {this.getThumb(i)}
      </React.Fragment>;
      inputsAndThumbs.push(thumbAndInput);
    }
    return inputsAndThumbs;
  }

  private getThumb(i: number) {
    const { cssClasses, thumbContainerCss, tooltipFormat, focusedThumb, step, tooltipVisibility, getPercent, getClosestToStepValue, getRenderedValue } = this.question;

    const value = getRenderedValue()[i];
    let percent: string = getPercent(value) + "%";

    let tooltip: ReactElement | null = null;
    let toolTipValue = step ? getClosestToStepValue(value) : value;

    if (tooltipVisibility !== "never") {
      tooltip = <div className={`${cssClasses.tooltip} ${tooltipVisibility === "onhover" ? cssClasses.tooltipOnHoverMode : ""}`}>
        <div className={cssClasses.tooltipPanel}>
          <div className={cssClasses.tooltipValue} >{tooltipFormat.replace("{0}", "" + toolTipValue)}</div>
        </div>
      </div>;
    }

    const thumb =
      <div className={`${thumbContainerCss} ${i === focusedThumb ? cssClasses.thumbContainerFocusedMode : ""}`} style={{ left: percent }}>
        {tooltip}
        <div className={cssClasses.thumb}>
          <div className={cssClasses.thumbDot}></div>
        </div>
      </div>;

    return thumb;
  }

  private getInput(i:number) {
    const { renderedMax: max, renderedMin: min, step, cssClasses, isDisabledAttr, getRenderedValue } = this.question;

    const value = getRenderedValue()[i];

    const input = <input className={cssClasses.input} id={"sjs-slider-input-" + i} key={"input-" + i} type="range" value={value} min={min} max={max} step={step}
      onChange={ (e)=>{ this.handleOnChange(e, i); } } onFocus={ (e)=>{ this.handleOnFocus(e, i); } } onBlur={ (e)=>{ this.handleOnBlur(e, i); } }
      onPointerDown={ (e)=>{ this.handlePointerDown(e); } } onPointerUp={ (e)=>{ this.handlePointerUp(e, i); } }
      disabled={isDisabledAttr}
    />;
    return input;
  }

  private getRangeInput() {
    const { renderedMax: max, renderedMin: min, step, cssClasses, allowDragRange } = this.question;
    if (!allowDragRange) return null;
    return <input name={"range-input"} ref={this.rangeInputRef} className={cssClasses.input} type="range" min={min} max={max} step={step} tabIndex={-1} onChange={ (e)=>{ this.handleRangeOnChange(e); } } onPointerDown={ (e)=>{ this.handleRangePointerDown(e); } } onPointerUp={ (e)=>{ this.handleRangePointerUp(e); } } />;
  }

  private getLabels() {
    const labels = [];
    const { renderedMax: max, renderedMin: min, labelCount, showEdgeLabels, labels: customLabels, cssClasses, step, labelFormat } = this.question;
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
    return <div className={cssClasses.labelsContainer}>
      <div>
        {labels}
      </div>
    </div>;
  }

  private refreshInputRange() {
    const { allowDragRange, getRenderedValue, getPercent } = this.question;
    if (!allowDragRange) return;
    if (!this.rangeInputRef.current) return;
    const renderedValue = getRenderedValue();
    const percentLastValue = getPercent(renderedValue[renderedValue.length - 1]);
    const percentFirstValue = getPercent(renderedValue[0]);
    let percent: number = percentLastValue - percentFirstValue;

    const inputNode = this.rangeInputRef.current;
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-width", `calc(${percent}% - 20px - 20px)`); //TODO 20px is thumb width remove hardcode
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-left", `calc(${percentFirstValue}% + 20px)`);
    inputNode.style.setProperty("--sjs-range-slider-range-input-thumb-position", "absolute");
  }

  private handleOnChange = (event: React.ChangeEvent<HTMLInputElement>, inputNumber: number): void => {
    if (!this.oldValue) return; // Firefox raise one more OnChange after PointerUp and break the value
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
    e.stopPropagation();
    const { step, focusedThumb, getRenderedValue, allowSwap, renderedMinRangeLength, value, getClosestToStepValue } = this.question;
    let renderedValue:number[] = getRenderedValue();
    const focusedThumbValue = renderedValue[focusedThumb];

    renderedValue.sort((a, b)=>a - b);

    this.question.focusedThumb = renderedValue.indexOf(focusedThumbValue);
    if (step) {
      for (let i = 0; i < renderedValue.length; i++) {
        renderedValue[i] = getClosestToStepValue(renderedValue[i]);
        const input:any = document.getElementById(`sjs-slider-input-${i}`); //TODO
        input.step = step;
      }
    }

    if (allowSwap) {
      for (let i = 0; i < renderedValue.length - 1; i++) {
        if (Math.abs(renderedValue[i] - renderedValue[i + 1]) < renderedMinRangeLength) {
          renderedValue = this.oldValue;
          break;
        }
      }
    }

    this.setSliderValue(renderedValue);
    this.refreshInputRange();
    this.oldValue = null;
  };

  private setValueByClick = (event: React.PointerEvent<HTMLDivElement>) => {
    const { renderedMax: max, renderedMin: min, step, getClosestToStepValue, ensureMaxRangeBorders, ensureMinRangeBorders, getRenderedValue } = this.question;

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

        renderedValue[i] = getClosestToStepValue(renderedValue[i]);
      }
    }

    this.setSliderValue(renderedValue);
    this.refreshInputRange();
  };

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
    const { renderedMax: max, renderedMin: min } = this.question;

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
    const { step, getRenderedValue, getClosestToStepValue } = this.question;
    if (this.isRangeMoving) {
      this.refreshInputRange();
      this.isRangeMoving = false;
      if (step) {
        const input = this.rangeInputRef.current as HTMLInputElement; //TODO
        input.step = "" + step;

        const renderedValue:number[] = getRenderedValue();
        for (let i = 0; i < renderedValue.length; i++) {
          renderedValue[i] = getClosestToStepValue(renderedValue[i]);
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
    const { renderedMax: max, renderedMin: min, getRenderedValue } = this.question;
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
