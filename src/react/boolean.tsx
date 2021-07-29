import * as React from "react";
import { QuestionBooleanModel, CssClassBuilder } from "survey-core";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionBoolean extends SurveyQuestionElementBase {
  protected checkRef: React.RefObject<HTMLInputElement>;
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
  private get allowClick(): boolean {
    return this.question.isIndeterminate && !this.isDisplayMode;
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
    if (this.allowClick) {
      this.preventDefaults(event);
      this.question.checkedValue = true;
      this.setState({ value: this.question.checkedValue });
    }
  }
  handleOnSwitchClick(event: any) {
    if (this.allowClick) {
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
    if (this.allowClick) {
      this.preventDefaults(event);
      this.doCheck(value);
    }
  }

  protected updateDomElement() {
    if (!this.question) return;
    const el = this.checkRef.current;
    if (el) {
      el.indeterminate = this.question.isIndeterminate;
    }
    this.control = el;
    super.updateDomElement();
  }
  private getLabelClass(checked: boolean): string {
    const question: QuestionBooleanModel = this.question;
    return new CssClassBuilder()
      .append(question.cssClasses.label)
      .append(question.cssClasses.disabledLabel,
        question.checkedValue === !checked || question.isReadOnly)
      .toString();
  }
  private getCheckedLabel() {
    if (this.question.checkedValue === true) {
      return this.question.locLabelTrue;
    } else if (this.question.checkedValue === false) {
      return this.question.locLabelFalse;
    }
  }
  protected renderElement(): JSX.Element {
    const cssClasses = this.question.cssClasses;
    const itemClass: string = this.question.getItemCss();
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
          <span
            className={this.getLabelClass(false)}
            onClick={(event) => this.handleOnLabelClick(event, false)}
          >
            {this.renderLocString(this.question.locLabelFalse)}
          </span>
          <div className={cssClasses.switch} onClick={this.handleOnSwitchClick}>
            <span className={cssClasses.slider}>
              <span className={cssClasses.sliderText}>
                {this.question.checkedValue !== null
                  ? this.renderLocString(this.getCheckedLabel())
                  : null}
              </span>
            </span>
          </div>
          <span
            className={this.getLabelClass(true)}
            onClick={(event) => this.handleOnLabelClick(event, true)}
          >
            {this.renderLocString(this.question.locLabelTrue)}
          </span>
        </label>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("boolean", (props) => {
  return React.createElement(SurveyQuestionBoolean, props);
});
