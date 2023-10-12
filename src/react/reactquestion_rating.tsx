import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { QuestionRatingModel, RenderedRatingItem } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactElementFactory } from "./element-factory";

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

  protected renderItem(
    item: any,
    index: Number
  ): JSX.Element {
    const renderedItem = ReactElementFactory.Instance.createElement(this.question.itemComponent, {
      question: this.question,
      item: item,
      index: index,
      key: "value" + index,
      handleOnClick: this.handleOnClick,
      isDisplayMode: this.isDisplayMode
    });
    return renderedItem;
  }

  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    var minText = this.question.minRateDescription
      ? this.renderLocString(this.question.locMinRateDescription)
      : null;
    var maxText = this.question.maxRateDescription
      ? this.renderLocString(this.question.locMaxRateDescription)
      : null;
    return (
      <div className={this.question.ratingRootCss} ref={(div) => (this.setControl(div))}>
        <fieldset role="radiogroup">
          <legend role="presentation" className={"sv-hidden"}></legend>
          {!!this.question.hasMinLabel ? <span className={cssClasses.minText}>{minText}</span>: null}
          {this.question.renderedRateItems.map((item, index) => this.renderItem(item, index))}
          {!!this.question.hasMaxLabel ? <span className={cssClasses.maxText}>{maxText}</span>: null}
        </fieldset>
      </div>
    );
  }

}
ReactQuestionFactory.Instance.registerQuestion("rating", (props) => {
  return React.createElement(SurveyQuestionRating, props);
});
