import * as React from "react";
import { QuestionBooleanModel, CssClassBuilder, Base } from "survey-core";
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
  protected getStateElement(): Base {
    return this.question;
  }
  protected get question(): QuestionBooleanModel {
    return this.questionBase as QuestionBooleanModel;
  }
  /*
  private get allowClick(): boolean {
    return this.question.isIndeterminate && !this.isDisplayMode;
  }
  */
  private doCheck(value: boolean) {
    this.question.checkedValue = value;
  }
  handleOnChange(event: any) {
    this.doCheck(event.target.checked);
  }
  handleOnClick(event: any) {
    this.question.onLabelClick(event, true);
  }
  handleOnSwitchClick(event: any) {
    this.question.onSwitchClickModel(event.nativeEvent);
  }
  handleOnLabelClick(event: any, value: boolean) {
    this.question.onLabelClick(event, value);
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
  protected renderElement(): JSX.Element {
    const cssClasses = this.question.cssClasses;
    const itemClass: string = this.question.getItemCss();
    return (
      <div className={cssClasses.root}>
        <label className={itemClass} onClick={this.handleOnClick}>
          <input
            ref={this.checkRef}
            type="checkbox"
            name={this.question.name}
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
            aria-required={this.question.ariaRequired}
            aria-label={this.question.ariaLabel}
            aria-invalid={this.question.ariaInvalid}
            aria-describedby={this.question.ariaDescribedBy}
          />
          <span
            className={this.question.getLabelCss(false)}
            onClick={(event) => this.handleOnLabelClick(event, false)}
          >
            {this.renderLocString(this.question.locLabelFalse)}
          </span>
          <div className={cssClasses.switch} onClick={this.handleOnSwitchClick}>
            <span className={cssClasses.slider}>
              {
                this.question.isDeterminated && cssClasses.sliderText ?
                  <span className={cssClasses.sliderText}>{ this.renderLocString(this.question.getCheckedLabel()) }</span>
                  : null
              }
            </span>
          </div>
          <span
            className={this.question.getLabelCss(true)}
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
