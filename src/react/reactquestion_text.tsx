import * as React from "react";
import { SurveyQuestionUncontrolledElement } from "./reactquestion_element";
import { QuestionTextModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionText extends SurveyQuestionUncontrolledElement<
  QuestionTextModel
> {
  private _isWaitingForEnter = false;
  //controlRef: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);
    //this.controlRef = React.createRef();
  }
  protected renderInput() {
    const inputClass = (this.question as QuestionTextModel).getControlClass();
    var onKeyDown = null;
    var onKeyUp = null;
    var onCompositionUpdate = null;
    if (this.question.isInputTextUpdate) {
      onKeyDown = (e: any) => (this._isWaitingForEnter = e.keyCode === 229);
      onKeyUp = (e: any) => {
        if (!this._isWaitingForEnter || e.keyCode === 13) {
          this.updateValueOnEvent(e);
          this._isWaitingForEnter = false;
        }
      };
      onCompositionUpdate = (e: any) => {
        e.persist();
        setTimeout(() => {
          this.updateValueOnEvent(e);
        }, 1);
      };
    } else {
      //https://github.com/surveyjs/survey-library/issues/3384
      onKeyUp = (e: any) => {
        if (e.keyCode === 13) {
          this.updateValueOnEvent(e);
        }
      };
    }

    var onChange = (e: any) => {
      if (e.target === document.activeElement) {
        if (this.question.isInputTextUpdate) {
          this.updateValueOnEvent(e);
        }
      } else {
        this.updateValueOnEvent(e);
      }
    };
    var placeHolder = this.question.renderedPlaceHolder;
    if (this.question.isReadOnlyRenderDiv()) {
      return <div>{this.question.value}</div>;
    }
    return (
      <input
        id={this.question.inputId}
        disabled={this.isDisplayMode}
        className={inputClass}
        type={this.question.inputType}
        //ref={this.controlRef}
        ref={(input) => (this.control = input)}
        style={this.question.inputStyle}
        maxLength={this.question.getMaxLength()}
        min={this.question.renderedMin}
        max={this.question.renderedMax}
        step={this.question.renderedStep}
        size={this.question.inputSize}
        placeholder={placeHolder}
        list={this.question.dataListId}
        autoComplete={this.question.autoComplete}
        onBlur={this.updateValueOnEvent}
        onChange={onChange}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        onCompositionUpdate={onCompositionUpdate}
        aria-required={this.question.ariaRequired}
        aria-label={this.question.ariaLabel}
        aria-invalid={this.question.ariaInvalid}
        aria-describedby={this.question.ariaDescribedBy}
      />
    );
  }
  protected renderElement(): JSX.Element {
    return (
      this.question.dataListId ?
        <div>
          { this.renderInput() }
          { this.renderDataList() }
        </div>:
        this.renderInput()
    );
  }
  private renderDataList(): JSX.Element {
    if (!this.question.dataListId) return null;
    var items = this.question.dataList;
    if (items.length == 0) return null;
    var options = [];
    for (var i = 0; i < items.length; i++) {
      options.push(<option key={"item"+i} value={items[i]}></option>);
    }
    return <datalist id={this.question.dataListId}>{options}</datalist>;
  }
  // protected updateDomElement() {
  //   this.control = this.controlRef.current;
  //   super.updateDomElement();
  // }
}

ReactQuestionFactory.Instance.registerQuestion("text", (props) => {
  return React.createElement(SurveyQuestionText, props);
});
