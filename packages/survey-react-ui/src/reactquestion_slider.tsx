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
    this.question.refreshInputRange(this.rangeInputRef.current);
  }

  protected get question(): QuestionSliderModel {
    return this.questionBase as QuestionSliderModel;
  }

  protected getStateElement(): Base {
    return this.question;
  }

  protected renderElement(): React.JSX.Element {
    const { cssClasses, showLabels, sliderType, getTrackPercentLeft, getTrackPercentRight, allowDragRange, setValueByClickOnPath } = this.question;

    const rangeInput = (sliderType === "single" && allowDragRange) ? null : this.getRangeInput();
    const thumbsAndInputs = this.getInputsAndThumbs();
    const labels = showLabels ? this.getLabels() : null;

    const rangeLeftPercent = getTrackPercentLeft() + "%";
    const rangeRightPercent = getTrackPercentRight() + "%";

    return (
      <div className={this.question.rootCss} ref={(div) => (this.setControl(div))}>
        {rangeInput}
        <div className={cssClasses.visualContainer} onPointerUp={ (e)=>{ setValueByClickOnPath(e.nativeEvent as PointerEvent, this.control); }}>
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
      tooltip = <div className={`${cssClasses.tooltip} ${tooltipVisibility === "auto" ? cssClasses.tooltipOnHoverMode : ""}`}>
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
      onKeyDown={ (e)=>{ this.handleKeyDown(e); } } onKeyUp={ (e)=>{ this.handleKeyUp(e); } }
      disabled={isDisabledAttr}
    />;
    return input;
  }

  private getRangeInput() {
    const { renderedMax: max, renderedMin: min, step, cssClasses, handleRangeOnChange, handleRangePointerUp } = this.question;
    return <input name={"range-input"} ref={this.rangeInputRef} className={cssClasses.input} type="range"
      min={min} max={max} step={step} tabIndex={-1} onChange={(e)=>{ handleRangeOnChange(e.nativeEvent as InputEvent); }}
      onPointerDown={ (e)=>{ this.handleRangePointerDown(e); } } onPointerUp={(e)=>{ handleRangePointerUp(e.nativeEvent as PointerEvent, this.control); }} />;
  }

  private getLabels() {
    const labels = [];
    const { renderedMax: max, renderedMin: min, labelCount, showEdgeLabels, customLabels, cssClasses, step, labelFormat } = this.question;
    const fullRange = max - min;

    for (let i = 0; i < labelCount; i++) {
      let labelStep = i * fullRange / (labelCount - 1);
      let position = labelStep / fullRange * 100;

      if (!showEdgeLabels && (i === 0 || i === labelCount - 1)) continue;

      const isDecimal = step % 1 != 0;
      const labelText:string = customLabels.length > 0 ? customLabels[i].text : isDecimal ? "" + (labelStep + min) : "" + Math.round(labelStep + min);

      const label = <React.Fragment key={"label-" + i}>
        <div className={`${cssClasses.label} ${labelText.length > 10 ? cssClasses.labelLongMod : ""}`}
          style={{ left: position + "%" }} onPointerUp={ (e)=>{ this.handleLabelPointerUp(e, labelText); } }>
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

  private handleOnChange = (event: React.ChangeEvent<HTMLInputElement>, inputNumber: number): void => {
    if (!this.oldValue) return; // Firefox raise one more OnChange after PointerUp and break the value
    const { allowSwap, ensureMaxRangeBorders, ensureMinRangeBorders, getRenderedValue, setSliderValue } = this.question;
    const renderedValue:number[] = getRenderedValue();

    let newValue: number = +event.target.value; // TODO target

    if (renderedValue.length > 1) {
      newValue = ensureMaxRangeBorders(newValue, inputNumber);
      if (!allowSwap) {
        newValue = ensureMinRangeBorders(newValue, inputNumber);
      }
    }

    renderedValue.splice(inputNumber, 1, newValue);

    setSliderValue(renderedValue);
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
    this.question.animatedThumb = false;
  };

  private handlePointerUp = (e, inputNumber:number) => {
    e.stopPropagation();
    const { step, focusedThumb, getRenderedValue, allowSwap, renderedMinRangeLength, getClosestToStepValue, refreshInputRange, setSliderValue } = this.question;
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

    setSliderValue(renderedValue);
    refreshInputRange(this.rangeInputRef.current);
    this.oldValue = null;
  };

  private handleLabelPointerUp = (event: React.PointerEvent<HTMLDivElement>, labelText: string) => {
    const newValue = +labelText;
    if (isNaN(newValue)) return;
    this.question.setValueByClick(newValue, event.target as HTMLInputElement);
  };

  private handleRangePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const { dragOrClickHelper, allowDragRange, step, prepareInputRangeForMoving } = this.question;

    if (step) {
      const input = this.rangeInputRef.current as HTMLInputElement; //TODO
      input.step = "0.1";
    }

    if (allowDragRange) {
      event.persist();
      dragOrClickHelper.dragHandler = () => { prepareInputRangeForMoving.call(this, event, this.control); };
      dragOrClickHelper.onPointerDown(event);
    }
  }

  private handleOnFocus = (event: React.ChangeEvent<HTMLInputElement>, inputNumber: number): void => {
    this.question.focusedThumb = inputNumber;
  };

  private handleOnBlur = (event: React.ChangeEvent<HTMLInputElement>, inputNumber: number): void => {
    this.question.focusedThumb = null;
  };

  private handleKeyDown = (e)=> {
    this.oldValue = this.question.getRenderedValue();
    this.question.animatedThumb = true;
  };

  private handleKeyUp = (e)=> {
    this.oldValue = null;
  };
}
ReactQuestionFactory.Instance.registerQuestion("slider", (props) => {
  return React.createElement(SurveyQuestionSlider, props);
});
