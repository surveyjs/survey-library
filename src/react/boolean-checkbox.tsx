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
          <span className={cssClasses.materialDecorator}>
            { this.question.svgIcon ?
              <svg
                className={cssClasses.itemDecorator}
              >
                <use xlinkHref={this.question.svgIcon}></use>
              </svg>:
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
