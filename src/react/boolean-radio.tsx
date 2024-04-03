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
            aria-errormessage = { this.question.ariaErrormessage }
            checked={value === this.question.booleanValueRendered}
            disabled = { this.question.isInputReadOnly }
            className = { cssClasses.itemRadioControl }
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
    this.question.booleanValue = event.nativeEvent.target.value == "true";
  }
  protected renderElement(): JSX.Element {
    const cssClasses = this.question.cssClasses;
    return (
      <div className={cssClasses.rootRadio}>
        <fieldset role="presentation" className= { cssClasses.radioFieldset }>
          {!this.question.swapOrder ?
            (<>{this.renderRadioItem(false, this.question.locLabelFalse)}
              {this.renderRadioItem(true, this.question.locLabelTrue)}</>)
            :
            (<>{this.renderRadioItem(true, this.question.locLabelTrue)}
              {this.renderRadioItem(false, this.question.locLabelFalse)}</>)
          }
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
