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
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
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
    this.question.booleanValue = value;
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
  handleOnKeyDown(event: any) {
    this.question.onKeyDownCore(event);
  }

  protected updateDomElement() {
    if (!this.question) return;
    const el = this.checkRef.current;
    if (el) {
      el.indeterminate = this.question.isIndeterminate;
    }
    this.setControl(el);
    super.updateDomElement();
  }
  protected renderElement(): JSX.Element {
    const cssClasses = this.question.cssClasses;
    const itemClass: string = this.question.getItemCss();
    return (
      <div className={cssClasses.root} onKeyDown={this.handleOnKeyDown}>
        <label className={itemClass} onClick={this.handleOnClick}>
          <input
            ref={this.checkRef}
            type="checkbox"
            name={this.question.name}
            value={
              this.question.booleanValue === null
                ? ""
                : this.question.booleanValue
            }
            id={this.question.inputId}
            className={cssClasses.control}
            disabled={this.isDisplayMode}
            checked={this.question.booleanValue || false}
            onChange={this.handleOnChange}
            role={this.question.a11y_input_ariaRole}
            aria-required={this.question.a11y_input_ariaRequired}
            aria-label={this.question.a11y_input_ariaLabel}
            aria-labelledby={this.question.a11y_input_ariaLabelledBy}
            aria-describedby={this.question.a11y_input_ariaDescribedBy}
            aria-invalid={this.question.a11y_input_ariaInvalid}
            aria-errormessage={this.question.a11y_input_ariaErrormessage}
          />
          <div className={cssClasses.sliderGhost} onClick={(event) => this.handleOnLabelClick(event, this.question.swapOrder)}>
            <span className={this.question.getLabelCss(this.question.swapOrder)}>
              {this.renderLocString(this.question.locLabelLeft)}
            </span>
          </div>
          <div className={cssClasses.switch} onClick={this.handleOnSwitchClick}>
            <span className={cssClasses.slider} style={{ marginLeft: this.question.thumbMargin }}>
              {
                this.question.isDeterminated && cssClasses.sliderText ?
                  <span className={cssClasses.sliderText}>{this.renderLocString(this.question.getCheckedLabel())}</span>
                  : null
              }
            </span>
          </div>
          <div className={cssClasses.sliderGhost} onClick={(event) => this.handleOnLabelClick(event, !this.question.swapOrder)}>
            <span className={this.question.getLabelCss(!this.question.swapOrder)}>
              {this.renderLocString(this.question.locLabelRight)}
            </span>
          </div>
        </label>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("boolean", (props) => {
  return React.createElement(SurveyQuestionBoolean, props);
});
