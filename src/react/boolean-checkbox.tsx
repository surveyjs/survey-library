import * as React from "react";
import { RendererFactory } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionBoolean } from "./boolean";
import { TitleActions } from "./components/title/title-actions";
import { SurveyElementBase } from "./reactquestion_element";

export class SurveyQuestionBooleanCheckbox extends SurveyQuestionBoolean {
  constructor(props: any) {
    super(props);
  }
  protected renderElement(): JSX.Element {
    const cssClasses = this.question.cssClasses;
    const itemClass = this.question.getCheckboxItemCss();
    const description = this.question.canRenderLabelDescription ?
      SurveyElementBase.renderQuestionDescription(this.question) : null;
    return (
      <div className={cssClasses.rootCheckbox}>
        <div className={itemClass}>
          <label className={cssClasses.checkboxLabel}>
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
              className={cssClasses.controlCheckbox}
              disabled={this.isDisplayMode}
              checked={this.question.booleanValue || false}
              onChange={this.handleOnChange}
              aria-required={this.question.ariaRequired}
              aria-label={this.question.ariaLabel}
              aria-invalid={this.question.ariaInvalid}
              aria-errormessage={this.question.ariaErrormessage}
            />
            <span className={cssClasses.checkboxMaterialDecorator}>
              {this.question.svgIcon ?
                <svg
                  className={cssClasses.checkboxItemDecorator}
                >
                  <use xlinkHref={this.question.svgIcon}></use>
                </svg> : null
              }
              <span className="check" />
            </span>
            {this.question.isLabelRendered && (
              <span className={cssClasses.checkboxControlLabel} id={this.question.labelRenderedAriaID}>
                <TitleActions element={this.question} cssClasses={this.question.cssClasses}></TitleActions>
              </span>
            )}
          </label>
          {description}
        </div>
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
