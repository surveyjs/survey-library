import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { SurveyQuestionCommentItem } from "./reactquestion_comment";
import { QuestionRatingModel } from "survey-core";
import { RenderedRatingItem } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionRating extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }
  protected get question(): QuestionRatingModel {
    return this.questionBase as QuestionRatingModel;
  }
  handleOnClick(event: any) {
    this.question.setValueFromClick(event.target.value);
    this.setState({ value: this.question.value });
  }
  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    var minText = this.question.minRateDescription
      ? this.renderLocString(this.question.locMinRateDescription)
      : null;
    var maxText = this.question.maxRateDescription
      ? this.renderLocString(this.question.locMaxRateDescription)
      : null;
    var comment = this.question.hasOther ? this.renderOther(cssClasses) : null;
    return (
      <div className={cssClasses.root} ref={(div) => (this.control = div)}>
        <fieldset role="radiogroup">
          <legend role="presentation" className={"sv-hidden"}></legend>
          {!!this.question.hasMinLabel ? <span className={cssClasses.minText}>{minText}</span>: null}
          {this.question.renderedRateItems.map((item, i) => this.renderItem("value" + i, item, i, cssClasses))}
          {!!this.question.hasMaxLabel ? <span className={cssClasses.maxText}>{maxText}</span>: null}
        </fieldset>
        {comment}
      </div>
    );
  }
  protected renderItem(
    key: string,
    item: RenderedRatingItem,
    index: number,
    cssClasses: any
  ): JSX.Element {
    var itemText = this.renderLocString(item.locText);
    return (
      <label key={key} className={this.question.getItemClass(item.itemValue)}>
        <input
          type="radio"
          className="sv-visuallyhidden"
          name={this.question.name}
          id={this.question.inputId + "_" + index}
          value={item.value}
          disabled={this.isDisplayMode}
          checked={this.question.value == item.value}
          onClick={this.handleOnClick}
          onChange={()=>{}}
          aria-required={this.question.ariaRequired}
          aria-label={this.question.ariaLabel}
          aria-invalid={this.question.ariaInvalid}
          aria-describedby={this.question.ariaDescribedBy}
        />
        <span className={cssClasses.itemText}>{itemText}</span>
      </label>
    );
  }
  protected renderOther(cssClasses: any): JSX.Element {
    return (
      <div className={cssClasses.other}>
        <SurveyQuestionCommentItem
          question={this.question}
          cssClasses={cssClasses}
          isDisplayMode={this.isDisplayMode}
        />
      </div>
    );
  }
}
ReactQuestionFactory.Instance.registerQuestion("rating", (props) => {
  return React.createElement(SurveyQuestionRating, props);
});
