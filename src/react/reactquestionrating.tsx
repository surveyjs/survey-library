import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestionelement";
import { SurveyQuestionCommentItem } from "./reactquestioncomment";
import { QuestionRatingModel } from "../question_rating";
import { ItemValue } from "../itemvalue";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionRating extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  protected get question(): QuestionRatingModel {
    return this.questionBase as QuestionRatingModel;
  }
  handleOnChange(event: any) {
    this.question.value = event.target.value;
    this.setState({ value: this.question.value });
  }
  render(): JSX.Element {
    if (!this.question) return null;
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
          minTextValue,
          maxTextValue,
          cssClasses
        )
      );
    }
    var comment = this.question.hasOther ? this.renderOther(cssClasses) : null;
    return (
      <div className={cssClasses.root} ref={div => (this.control = div)}>
        {values}
        {comment}
      </div>
    );
  }
  protected renderItem(
    key: string,
    item: ItemValue,
    minText: JSX.Element,
    maxText: JSX.Element,
    cssClasses: any
  ): JSX.Element {
    var isChecked = this.question.value == item.value;
    var className = cssClasses.item;
    if (isChecked) className += " " + cssClasses.selected;
    if (this.isDisplayMode) className += " " + cssClasses.disabled;

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
          value={item.value}
          disabled={this.isDisplayMode}
          checked={this.question.value == item.value}
          onChange={this.handleOnChange}
          aria-required={this.question.isRequired}
          aria-label={item.locText.text}
          aria-invalid={this.question.errors.length > 0}
          aria-describedby={this.question.errors.length > 0 ? this.question.id + '_errors' : null}  
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
ReactQuestionFactory.Instance.registerQuestion("rating", props => {
  return React.createElement(SurveyQuestionRating, props);
});
