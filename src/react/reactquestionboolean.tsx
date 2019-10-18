import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase
} from "./reactquestionelement";
import { QuestionBooleanModel } from "../question_boolean";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { OtherEmptyError } from "../error";

export class SurveyQuestionBoolean extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  protected get question(): QuestionBooleanModel {
    return this.questionBase as QuestionBooleanModel;
  }
  handleOnChange(event: any) {
    this.question.checkedValue = event.target.checked;
    this.setState({ value: this.question.checkedValue });
  }
  componentDidMount() {
    super.componentDidMount();
    this.updateIndeterminate();
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.updateIndeterminate();
  }
  private updateIndeterminate() {
    if (!this.question) return;
    var el: any = this.refs["check"];
    if (el) {
      el["indeterminate"] = this.question.isIndeterminate;
    }
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
        <label className={itemClass}>
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
          />
          <span className={this.getLabelClass(false)}>
            {this.question.locLabelFalse.renderedHtml}
          </span>
          <div className={cssClasses.switch}>
            <span className={cssClasses.slider} />
          </div>
          <span className={this.getLabelClass(true)}>
            {this.question.locLabelTrue.renderedHtml}
          </span>
        </label>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("boolean", props => {
  return React.createElement(SurveyQuestionBoolean, props);
});
