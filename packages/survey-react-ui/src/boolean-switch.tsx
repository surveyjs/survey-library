import * as React from "react";
import { RendererFactory } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionBoolean } from "./boolean";
import { SurveyElementBase } from "./reactquestion_element";
import { attachKey2click } from "./reactSurvey";

export class SurveyQuestionBooleanSwitch extends SurveyQuestionBoolean {
  constructor(props: any) {
    super(props);
  }
  protected renderElement(): React.JSX.Element {
    const cssClasses = this.question.cssClasses;
    const buttonClass = this.question.getSwitchButtonCss();
    const button = attachKey2click(<div className={buttonClass} tabIndex={0}
      role="checkbox"
      aria-checked={this.question.booleanValue || false}
      aria-required={this.question.a11y_input_ariaRequired}
      aria-label={this.question.a11y_input_ariaLabel}
      aria-labelledby={this.question.a11y_input_ariaLabelledBy}
      aria-invalid={this.question.a11y_input_ariaInvalid}
      aria-errormessage={this.question.a11y_input_ariaErrormessage}
    >
      <div className={cssClasses.switchThumb}>
        <div className={cssClasses.switchThumbCircle}></div>
      </div>
    </div>, this.question, { processEsc: false });

    return (
      <div className={cssClasses.rootSwitch} onClick={() => this.question.booleanValue = !this.question.booleanValue}>
        {button}
        <div className={cssClasses.switchCaption}>
          <div className={cssClasses.switchTitle} id={this.question.labelRenderedAriaID}>
            {SurveyElementBase.renderLocString(this.question.locTitle)}
          </div>
        </div>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion(
  "sv-boolean-switch",
  (props) => {
    return React.createElement(SurveyQuestionBooleanSwitch, props);
  }
);

RendererFactory.Instance.registerRenderer(
  "boolean",
  "switch",
  "sv-boolean-switch"
);
