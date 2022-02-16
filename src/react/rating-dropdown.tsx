import * as React from "react";
import {
  SurveyQuestionUncontrolledElement,
} from "./reactquestion_element";
import { QuestionRatingModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { RendererFactory } from "../rendererFactory";
import { SurveyQuestionOptionItem } from "./reactquestion_dropdown";

export class SurveyQuestionRatingDropdown extends SurveyQuestionUncontrolledElement<QuestionRatingModel> {
  constructor(props: any) {
    super(props);
  }
  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    var select = this.renderSelect(cssClasses);
    return (
      <div className={this.question.cssClasses.rootDropdown}>
        {select}
      </div>
    );
  }
  protected renderSelect(cssClasses: any): JSX.Element {
    if (this.isDisplayMode) {
      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <div id={this.question.inputId} className={this.question.getControlClass()} disabled>
          { this.question.readOnlyText }
        </div>
      );
    }

    return (
      <select
        id={this.question.inputId}
        className={this.question.getControlClass()}
        ref={(select) => (this.control = select)}
        onChange={this.updateValueOnEvent}
        onInput={this.updateValueOnEvent}
        aria-required={this.question.ariaRequired}
        aria-label={this.question.ariaLabel}
        aria-invalid={this.question.ariaInvalid}
        aria-describedby={this.question.ariaDescribedBy}
        required={this.question.isRequired}
      >
        <option value="">{this.question.optionsCaption}</option>
        { this.question.visibleRateValues.map((item, i) => <SurveyQuestionOptionItem key={"item" + i} item={item}/>) }
      </select>
    );
  }
}
ReactQuestionFactory.Instance.registerQuestion(
  "sv-rating-dropdown",
  (props) => {
    return React.createElement(SurveyQuestionRatingDropdown, props);
  }
);

RendererFactory.Instance.registerRenderer(
  "rating",
  "dropdown",
  "sv-rating-dropdown"
);
