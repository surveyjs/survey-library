import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { Base, QuestionSliderModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactElement } from "react";
import { ReactElementFactory } from "./element-factory";

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
    const value:number[] = this.question.renderedValue;

    for (let i = 0; i < value.length; i++) {
      const thumbAndInput = <React.Fragment key={i}>
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
      getPercent, renderedValue, getTooltipValue
    } = this.question;
    const value = renderedValue[i];
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
      renderedMax: max, renderedMin: min, step, cssClasses, isDisabledAttr, renderedValue,
      handleOnChange, handlePointerDown, handlePointerUp, handleKeyDown, handleKeyUp,
      handleOnFocus, handleOnBlur
    } = this.question;

    const value = renderedValue[i];

    const input = <input className={cssClasses.input} id={"sjs-slider-input-" + i} type="range"
      min={min} max={max} step={step} value={value}
      onChange={ (e)=>{ handleOnChange(e.nativeEvent as InputEvent, i); } }
      onPointerDown={ (e)=>{ handlePointerDown(e.nativeEvent); } } onPointerUp={ (e)=>{ e.stopPropagation(); handlePointerUp(e.nativeEvent); } }
      onKeyDown={ (e)=>{ handleKeyDown(e.nativeEvent); } } onKeyUp={ (e)=>{ handleKeyUp(e.nativeEvent); } }
      onFocus={ ()=>{ handleOnFocus(i); } } onBlur={ ()=>{ handleOnBlur(); } }
      disabled={isDisabledAttr}
      aria-required={this.question.a11y_input_ariaRequired}
      aria-label={this.question.a11y_input_ariaLabel}
      aria-labelledby={this.question.a11y_input_ariaLabelledBy}
      aria-describedby={this.question.a11y_input_ariaDescribedBy}
      aria-invalid={this.question.a11y_input_ariaInvalid}
      aria-errormessage={this.question.a11y_input_ariaErrormessage}
    />;
    return input;
  }

  private getRangeInput() {
    const { renderedMax: max, renderedMin: min, step, cssClasses, handleRangeOnChange, handleRangePointerDown, handleRangePointerUp } = this.question;
    return <input name={"range-input"} ref={this.rangeInputRef} className={cssClasses.input} type="range" aria-hidden="true"
      min={min} max={max} step={step} tabIndex={-1} onChange={(e)=>{ handleRangeOnChange(e.nativeEvent as InputEvent); }}
      onPointerDown={ (e)=>{ e.persist(); handleRangePointerDown(e.nativeEvent, this.control); } }
      onPointerUp={(e)=>{ handleRangePointerUp(e.nativeEvent, this.control); }} />;
  }

  private getLabels() {
    const labels = [];
    const { renderedLabels, cssClasses } = this.question;

    for (let i = 0; i < renderedLabels.length; i++) {
      const label = ReactElementFactory.Instance.createElement("sv-slider-label-item", { item: renderedLabels[i], question: this.question, key: renderedLabels[i].id });
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
