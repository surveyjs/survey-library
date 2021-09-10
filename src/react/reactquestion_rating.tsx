import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { SurveyQuestionCommentItem } from "./reactquestion_comment";
import { QuestionRatingModel } from "survey-core";
import { ItemValue } from "survey-core";
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
    var values = [];
    var minText = this.question.minRateDescription
      ? this.renderLocString(this.question.locMinRateDescription)
      : null;
    var maxText = this.question.maxRateDescription
      ? this.renderLocString(this.question.locMaxRateDescription)
      : null;
    for (var i = 0; i < this.question.visibleRateValues.length; i++) {
      var minTextValue = i == 0 ? minText : null;
      var maxTextValue =
        i == this.question.visibleRateValues.length - 1 ? maxText : null;
      values.push(
        this.renderItem(
          "value" + i,
          this.question.visibleRateValues[i],
          i,
          minTextValue,
          maxTextValue,
          cssClasses
        )
      );
    }
    var comment = this.question.hasOther ? this.renderOther(cssClasses) : null;
    return (
      <div className={cssClasses.root} ref={(div) => (this.control = div)}>
        <fieldset role="radiogroup">
          <legend aria-label={this.question.locTitle.renderedHtml} />
          {values}
        </fieldset>
        {comment}
      </div>
    );
  }
  protected renderItem(
    key: string,
    item: ItemValue,
    index: number,
    minText: JSX.Element,
    maxText: JSX.Element,
    cssClasses: any
  ): JSX.Element {
    const className = this.question.getItemClass(item);
    var itemText = this.renderLocString(item.locText);
    var minTextBlock = !!minText ? (
      <span className={cssClasses.minText}>{minText}</span>
    ) : null;
    var maxTextBlock = !!maxText ? (
      <span className={cssClasses.maxText}>{maxText}</span>
    ) : null;
    return (
      <label key={key} className={className}>
        <input
          type="radio"
          className="sv-visuallyhidden"
          name={this.question.name}
          id={this.question.inputId + "_" + index}
          value={item.value}
          disabled={this.isDisplayMode}
          checked={this.question.value == item.value}
          readOnly
          onClick={this.handleOnClick}
          aria-required={this.question.ariaRequired}
          aria-label={this.question.ariaLabel}
          aria-invalid={this.question.ariaInvalid}
          aria-describedby={this.question.ariaDescribedBy}
        />
        {minTextBlock}
        <span className={cssClasses.itemText}>{itemText}</span>
        {maxTextBlock}
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
