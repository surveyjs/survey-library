import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase,
} from "./reactquestionelement";
import { QuestionBooleanModel } from "../question_boolean";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { OtherEmptyError } from "../error";

export class SurveyQuestionBoolean extends SurveyQuestionElementBase {
  private checkRef: React.RefObject<HTMLInputElement>;
  constructor(props: any) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnLabelClick = this.handleOnLabelClick.bind(this);
    this.handleOnSwitchClick = this.handleOnSwitchClick.bind(this);
    this.checkRef = React.createRef();
  }
  protected get question(): QuestionBooleanModel {
    return this.questionBase as QuestionBooleanModel;
  }
  private preventDefaults(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
  private doCheck(value: boolean) {
    this.question.checkedValue = value;
    this.setState({ value: this.question.checkedValue });
  }
  handleOnChange(event: any) {
    this.doCheck(event.target.checked);
  }
  handleOnClick(event: any) {
    if (this.question.isIndeterminate) {
      this.preventDefaults(event);
      this.question.checkedValue = true;
      this.setState({ value: this.question.checkedValue });
    }
  }
  handleOnSwitchClick(event: any) {
    if (this.question.isIndeterminate) {
      this.preventDefaults(event);
      var isRightClick =
        event.nativeEvent.offsetX / event.target.offsetWidth > 0.5;
      var isRtl =
        document.defaultView.getComputedStyle(event.target).direction == "rtl";
      var value = isRtl ? !isRightClick : isRightClick;
      return this.doCheck(value);
    }
  }
  handleOnLabelClick(event: any, value: boolean) {
    if (this.question.isIndeterminate) {
      this.preventDefaults(event);
      this.doCheck(value);
    }
  }

  protected updateDomElement() {
    if (!this.question) return;
    var el = this.checkRef.current;
    if (el) {
      el.indeterminate = this.question.isIndeterminate;
    }
    this.control = el;
    super.updateDomElement();
  }
  private getItemClass(): string {
    var cssClasses = this.question.cssClasses;
    var isChecked = this.question.checkedValue;
    var isDisabled = this.question.isReadOnly;
    var itemClass = cssClasses.item;
    if (isDisabled) itemClass += " " + cssClasses.itemDisabled;
    if (isChecked) itemClass += " " + cssClasses.itemChecked;
    else if (isChecked === null)
      itemClass += " " + cssClasses.itemIndeterminate;
    return itemClass;
  }
  private getLabelClass(checked: boolean): string {
    var question = this.question;
    var cssClasses = this.question.cssClasses;
    return (
      cssClasses.label +
      " " +
      (question.checkedValue === !checked || question.isReadOnly
        ? question.cssClasses.disabledLabel
        : "")
    );
  }
  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    var itemClass = this.getItemClass();
    return (
      <div className={cssClasses.root}>
        <label className={itemClass} onClick={this.handleOnClick}>
          <input
            ref={this.checkRef}
            type="checkbox"
            value={
              this.question.checkedValue === null
                ? ""
                : this.question.checkedValue
            }
            id={this.question.inputId}
            className={cssClasses.control}
            disabled={this.isDisplayMode}
            checked={this.question.checkedValue || false}
            onChange={this.handleOnChange}
            aria-label={this.question.locTitle.renderedHtml}
            aria-invalid={this.question.errors.length > 0}
            aria-describedby={
              this.question.errors.length > 0
                ? this.question.id + "_errors"
                : null
            }
          />
          {(this.question.renderAs === "default" || this.question.renderAs === "switch") && (
          <span
            className={this.getLabelClass(false)}
            onClick={(event) => this.handleOnLabelClick(event, false)}
          >
            {this.question.locLabelFalse.renderedHtml}
          </span>
          )}
          {(this.question.renderAs === "default" || this.question.renderAs === "switch") && (
          <div className={cssClasses.switch} onClick={this.handleOnSwitchClick}>
            <span className={cssClasses.slider} />
          </div>
          )}
          {(this.question.renderAs === "default" || this.question.renderAs === "switch") && (
          <span
            className={this.getLabelClass(true)}
            onClick={(event) => this.handleOnLabelClick(event, true)}
          >
            {this.question.locLabelTrue.renderedHtml}
          </span>
          )}

          {this.question.renderAs === "checkbox" && (
          <span className={cssClasses.materialDecorator}>
            <svg viewBox="0 0 24 24" className={cssClasses.itemDecorator}>
              <rect
                className={cssClasses.uncheckedPath}
                x="5"
                y="10"
                width="14"
                height="4"
              />
              <polygon
                className={cssClasses.checkedPath}
                points="19,10 14,10 14,5 10,5 10,10 5,10 5,14 10,14 10,19 14,19 14,14 19,14 "
              />
              <path
                className={cssClasses.indeterminatePath}
                d="M22,0H2C0.9,0,0,0.9,0,2v20c0,1.1,0.9,2,2,2h20c1.1,0,2-0.9,2-2V2C24,0.9,23.1,0,22,0z M21,18L6,3h15V18z M3,6l15,15H3V6z"
              />
            </svg>
            <span className="check" />
          </span>
          )}
          {this.question.renderAs === "checkbox" && (
          <span className={cssClasses.label}>{this.question.locDisplayLabel.text}</span>
          )}
        </label>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("boolean", (props) => {
  return React.createElement(SurveyQuestionBoolean, props);
});
