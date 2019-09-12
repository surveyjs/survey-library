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
    this.state = { value: this.question.checkedValue };
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.setState({ value: this.question.checkedValue });
  }
  protected get question(): QuestionBooleanModel {
    return this.questionBase as QuestionBooleanModel;
  }
  handleOnChange(event: any) {
    this.question.checkedValue = event.target.checked;
    this.setState({ value: this.question.checkedValue });
  }
  componentDidMount() {
    this.updateIndeterminate();
  }
  componentDidUpdate() {
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
    var allowHover = !isChecked && !isDisabled;
    var itemClass = cssClasses.item;
    if (isDisabled) itemClass += " " + cssClasses.itemDisabled;
    if (isChecked) itemClass += " " + cssClasses.itemChecked;
    else if (isChecked === null)
      itemClass += " " + cssClasses.itemIndeterminate;
    if (allowHover) itemClass += " " + cssClasses.itemHover;
    return itemClass;
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    var text = this.renderLocString(this.question.locDisplayLabel);
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
            checked={this.question.checkedValue}
            onChange={this.handleOnChange}
            aria-label={this.question.locTitle.renderedHtml}
          />
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
          <span className={cssClasses.label}>{text}</span>
        </label>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("boolean", props => {
  return React.createElement(SurveyQuestionBoolean, props);
});
