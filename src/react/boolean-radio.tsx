import * as React from "react";
import { RendererFactory } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionBoolean } from "./boolean";

export class SurveyQuestionBooleanRadio extends SurveyQuestionBoolean {
  constructor(props: any) {
    super(props);
  }
  private renderRadioItem(value: any, locText: any): JSX.Element {
    const cssClasses = this.question.cssClasses;
    return (
      <div role="presentation" className={ this.question.getRadioItemClass(cssClasses, value) }>
        <label className= { cssClasses.radioLabel }>
          <input
            type="radio"
            name = { this.question.name }
            value = { value }
            aria-describedby = { this.question.ariaDescribedBy }
            checked = { value === this.question.value }
            disabled = { this.question.isInputReadOnly }
            className = { cssClasses.itemControl }
            onChange={ this.handleOnChange }
          />
          { this.question.cssClasses.materialRadioDecorator?
            (<span className={ cssClasses.materialRadioDecorator }>
              { this.question.itemSvgIcon ?
                (<svg className={cssClasses.itemRadioDecorator}>
                  <use xlinkHref={this.question.itemSvgIcon}></use>
                </svg>):null}
            </span>):null}
          <span className= { cssClasses.radioControlLabel }>
            { this.renderLocString(locText) }
          </span>
        </label>
      </div>
    );
  }
  handleOnChange = (event: any) => {
    this.question.value = event.nativeEvent.target.value;
  }
  protected renderElement(): JSX.Element {
    const cssClasses = this.question.cssClasses;
    return (
      <div className={cssClasses.root}>
        <fieldset role="presentation" className= { cssClasses.radioFieldset }>
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
