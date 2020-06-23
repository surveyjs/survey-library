import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase,
} from "./reactquestionelement";
import { QuestionBooleanModel } from "../question_boolean";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { OtherEmptyError } from "../error";

export class SurveyQuestionBoolean extends SurveyQuestionElementBase {
  private isIndeterminateChange: boolean = false;
  constructor(props: any) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleOnLabelClick = this.handleOnLabelClick.bind(this);
    this.handleOnSwitchClick = this.handleOnSwitchClick.bind(this);
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
    var el: any = this.refs["check"];
    if (el) {
      el["indeterminate"] = this.question.isIndeterminate;
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
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    var itemClass = this.getItemClass();
    return (
      <div className={cssClasses.root}>
        <label className={itemClass} onClick={this.handleOnClick}>
          <input
            ref="check"
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
            aria-describedby={this.question.errors.length > 0 ? this.question.id + '_errors' : null}    
          />
          <span
            className={this.getLabelClass(false)}
            onClick={(event) => this.handleOnLabelClick(event, false)}
          >
            {this.question.locLabelFalse.renderedHtml}
          </span>
          <div className={cssClasses.switch} onClick={this.handleOnSwitchClick}>
            <span className={cssClasses.slider} />
          </div>
          <span
            className={this.getLabelClass(true)}
            onClick={(event) => this.handleOnLabelClick(event, true)}
          >
            {this.question.locLabelTrue.renderedHtml}
          </span>
        </label>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("boolean", (props) => {
  return React.createElement(SurveyQuestionBoolean, props);
});
