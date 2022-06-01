import * as React from "react";
import { RendererFactory } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionBoolean } from "./boolean";

export class SurveyQuestionBooleanCheckbox extends SurveyQuestionBoolean {
  constructor(props: any) {
    super(props);
  }
  protected renderElement(): JSX.Element {
    const cssClasses = this.question.cssClasses;
    const itemClass = this.question.getItemCss();
    return (
      <div className={cssClasses.root}>
        <label className={itemClass}>
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
            className={cssClasses.controlCheckbox}
            disabled={this.isDisplayMode}
            checked={this.question.checkedValue || false}
            onChange={this.handleOnChange}
            aria-required={this.question.ariaRequired}
            aria-label={this.question.ariaLabel}
            aria-invalid={this.question.ariaInvalid}
            aria-describedby={this.question.ariaDescribedBy}
          />
          <span className={cssClasses.materialDecorator}>
            { this.question.svgIcon ?
              <svg
                className={cssClasses.itemDecorator}
              >
                <use xlinkHref={this.question.svgIcon}></use>
              </svg>:null
            }
            <span className="check" />
          </span>
          {this.question.titleLocation === "hidden" && (
            <span className={this.question.getLabelCss(false)}>
              {this.renderLocString(this.question.locDisplayLabel)}
            </span>
          )}
        </label>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion(
  "sv-boolean-checkbox",
  (props) => {
    return React.createElement(SurveyQuestionBooleanCheckbox, props);
  }
);

RendererFactory.Instance.registerRenderer(
  "boolean",
  "checkbox",
  "sv-boolean-checkbox"
);
