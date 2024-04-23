import React from "react";
import { Base, QuestionRatingModel, RenderedRatingItem } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { attachKey2click } from "../../reactSurvey";
import { SvgIcon } from "../svg-icon/svg-icon";

export interface IRatingItemProps {
  question: QuestionRatingModel;
  item: RenderedRatingItem;
  index: any;
  handleOnClick: any;
  isDisplayMode: boolean;
}
export class RatingItemBase extends SurveyElementBase<IRatingItemProps, any> {
  constructor(props: any) {
    super(props);
    this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
  }
  get question(): QuestionRatingModel {
    return this.props.question;
  }
  get item(): RenderedRatingItem {
    return this.props.item;
  }
  get index(): any {
    return this.props.index;
  }
  getStateElement(): Base {
    return this.item;
  }
  handleOnMouseDown(event: any) {
    this.question.onMouseDown();
  }
}
export class RatingItem extends RatingItemBase {
  render(): JSX.Element | null {
    var itemText = this.renderLocString(this.item.locText);
    return (
      <label onMouseDown={this.handleOnMouseDown} className={this.question.getItemClassByText(this.item.itemValue, this.item.text)}>
        <input
          type="radio"
          className="sv-visuallyhidden"
          name={this.question.questionName}
          id={this.question.getInputId(this.index)}
          value={this.item.value}
          disabled={this.isDisplayMode}
          checked={this.question.value == this.item.value}
          onClick={this.props.handleOnClick}
          onChange={() => { }}
          aria-required={this.question.ariaRequired}
          aria-label={this.question.ariaLabel}
          aria-invalid={this.question.ariaInvalid}
          aria-errormessage={this.question.ariaErrormessage}
        />
        <span className={this.question.cssClasses.itemText}>{itemText}</span>
      </label>
    );
  }
  componentDidMount() {
    super.componentDidMount();
  }
}

ReactElementFactory.Instance.registerElement("sv-rating-item", (props) => {
  return React.createElement(RatingItem, props);
});
