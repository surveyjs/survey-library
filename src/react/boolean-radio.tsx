import * as React from "react";
import { RendererFactory } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionBoolean } from "./boolean";

export class SurveyQuestionBooleanRadio extends SurveyQuestionBoolean {
  constructor(props: any) {
    super(props);
  }
  private renderRadioItem(value, locText): JSX.Element {
    const cssClasses = this.question.cssClasses;
    return (
      <div role="presentation" className={ cssClasses.radioItem }>
        <label>
          <input
            type="radio"
            name = { this.question.name }
            aria-describedby = { this.question.ariaDescribedBy }
            checked = { value === this.question.value }
            disabled = { this.question.isInputReadOnly }
          />
          { this.question.cssClasses.materialRadioDecorator?
            (<span className={ cssClasses.materialRadioDecorator }>
              { this.question.itemSvgIcon ?
                (<svg className={cssClasses.itemRadioDecorator}>
                  <use xlinkHref={this.question.itemSvgIcon}></use>
                </svg>):null}
            </span>):null}
          <span>
            { this.renderLocString(locText) }
          </span>
        </label>
      </div>
    );
  }
  protected renderElement(): JSX.Element {
    const cssClasses = this.question.cssClasses;
    return (
      <div className={cssClasses.root}>
        <fieldset role="presentation">
          { this.renderRadioItem(false, this.question.locLabelFalse) }
          { this.renderRadioItem(true, this.question.locLabelTrue) }
        </fieldset>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion(
  "sv-boolean-radio",
  (props) => {
    return React.createElement(SurveyQuestionBooleanRadio, props);
  }
);

RendererFactory.Instance.registerRenderer(
  "boolean",
  "radio",
  "sv-boolean-radio"
);
