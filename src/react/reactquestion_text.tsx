import * as React from "react";
import { SurveyQuestionUncontrolledElement } from "./reactquestion_element";
import { QuestionTextModel } from "../question_text";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionText extends SurveyQuestionUncontrolledElement<QuestionTextModel> {
  private _isWaitingForEnter = false;
  //controlRef: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);
    //this.controlRef = React.createRef();
  }
  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    var onBlur = !this.question.isInputTextUpdate
      ? this.updateValueOnEvent
      : null;
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
      }
    }
    var placeHolder =
      this.question.inputType === "range" || this.question.isReadOnly
        ? ""
        : this.question.placeHolder;
    var dataList = this.renderDataList();
    return (
      <React.Fragment>
        <input
          id={this.question.inputId}
          disabled={this.isDisplayMode}
          className={cssClasses.root}
          type={this.question.inputType}
          //ref={this.controlRef}
          ref={(input) => (this.control = input)}
          maxLength={this.question.getMaxLength()}
          min={this.question.renderedMin}
          max={this.question.renderedMax}
          step={this.question.renderedStep}
          size={this.question.size}
          placeholder={placeHolder}
          list={this.question.dataListId}
          autoComplete={this.question.autoComplete}
          onBlur={onBlur}
          // onChange={this.updateValueOnEvent}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          onCompositionUpdate={onCompositionUpdate}
          aria-required={this.question.isRequired}
          aria-label={this.question.locTitle.renderedHtml}
          aria-invalid={this.question.errors.length > 0}
          aria-describedby={
            this.question.errors.length > 0
              ? this.question.id + "_errors"
              : null
          }
        />
        {dataList}
      </React.Fragment>
    );
  }
  private renderDataList(): JSX.Element {
    if (!this.question.dataListId) return null;
    var items = this.question.dataList;
    if (items.length == 0) return null;
    var options = [];
    for (var i = 0; i < items.length; i++) {
      options.push(<option value={items[i]}></option>);
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
