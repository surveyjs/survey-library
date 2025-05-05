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

    return (
      <div className={this.question.rootCss} ref={(div) => (this.setControl(div))}>
        {rangeInput}
        <div className={cssClasses.visualContainer} onPointerUp={ (e)=>{ setValueByClickOnPath(e.nativeEvent as PointerEvent, this.control); }}>
          <div className={cssClasses.visualContainerSlider}>
            <div className={cssClasses.inverseTrackLeft} style={{ width: getTrackPercentLeft() + "%" }}></div>
            <div className={cssClasses.inverseTrackRight} style={{ width: getTrackPercentRight() + "%" }}></div>
            <div className={cssClasses.rangeTrack} style={{ left: getTrackPercentLeft() + "%", right: getTrackPercentRight() + "%" }} ></div>
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
    const {
      cssClasses, getThumbContainerCss, tooltipVisibility, tooltipCss,
      getPercent, getRenderedValue, getTooltipValue
    } = this.question;
    const value = getRenderedValue()[i];
    let tooltip: ReactElement | null = null;

    if (tooltipVisibility !== "never") {
      tooltip = <div className={tooltipCss}>
        <div className={cssClasses.tooltipPanel}>
          <div className={cssClasses.tooltipValue} >{getTooltipValue(i)}</div>
        </div>
      </div>;
    }

    const thumb =
      <div className={getThumbContainerCss(i)} style={{ left: getPercent(value) + "%" }}>
        {tooltip}
        <div className={cssClasses.thumb}>
          <div className={cssClasses.thumbDot}></div>
        </div>
      </div>;

    return thumb;
  }

  private getInput(i:number) {
    const {
      renderedMax: max, renderedMin: min, step, cssClasses, isDisabledAttr, getRenderedValue,
      handleOnChange, handlePointerDown, handlePointerUp, handleKeyDown, handleKeyUp,
      handleOnFocus, handleOnBlur
    } = this.question;

    const value = getRenderedValue()[i];

    const input = <input className={cssClasses.input} id={"sjs-slider-input-" + i} key={"input-" + i} type="range"
      value={value} min={min} max={max} step={step}
      onChange={ (e)=>{ handleOnChange(e.nativeEvent as InputEvent, i); } }
      onPointerDown={ (e)=>{ handlePointerDown(e.nativeEvent); } } onPointerUp={ (e)=>{ handlePointerUp(e.nativeEvent); } }
      onKeyDown={ (e)=>{ handleKeyDown(e.nativeEvent); } } onKeyUp={ (e)=>{ handleKeyUp(e.nativeEvent); } }
      onFocus={ ()=>{ handleOnFocus(i); } } onBlur={ ()=>{ handleOnBlur(); } }
      disabled={isDisabledAttr}
    />;
    return input;
  }

  private getRangeInput() {
    const { renderedMax: max, renderedMin: min, step, cssClasses, handleRangeOnChange, handleRangePointerDown, handleRangePointerUp } = this.question;
    return <input name={"range-input"} ref={this.rangeInputRef} className={cssClasses.input} type="range"
      min={min} max={max} step={step} tabIndex={-1} onChange={(e)=>{ handleRangeOnChange(e.nativeEvent as InputEvent); }}
      onPointerDown={ (e)=>{ e.persist(); handleRangePointerDown(e.nativeEvent, this.control); } }
      onPointerUp={(e)=>{ handleRangePointerUp(e.nativeEvent, this.control); }} />;
  }

  private getLabels() {
    const labels = [];
    const {
      renderedMax: max, renderedMin: min, labelCount, showEdgeLabels,
      customLabels, cssClasses, step, labelFormat, handleLabelPointerUp
    } = this.question;
    const fullRange = max - min;

    for (let i = 0; i < labelCount; i++) {
      let labelStep = i * fullRange / (labelCount - 1);
      let position = labelStep / fullRange * 100;

      if (!showEdgeLabels && (i === 0 || i === labelCount - 1)) continue;

      const isDecimal = step % 1 != 0;
      const labelText:string = customLabels.length > 0 ? customLabels[i].text : isDecimal ? "" + (labelStep + min) : "" + Math.round(labelStep + min);

      const label = <React.Fragment key={"label-" + i}>
        <div className={`${cssClasses.label} ${labelText.length > 10 ? cssClasses.labelLongMod : ""}`}
          style={{ left: position + "%" }} onPointerUp={ (e)=>{ handleLabelPointerUp(e.nativeEvent, labelText); } }>
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
}
ReactQuestionFactory.Instance.registerQuestion("slider", (props) => {
  return React.createElement(SurveyQuestionSlider, props);
});
