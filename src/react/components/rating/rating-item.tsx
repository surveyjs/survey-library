import React from "react";
import { QuestionRatingModel, RenderedRatingItem } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { attachKey2click } from "../../reactSurvey";
import { SvgIcon } from "../svg-icon/svg-icon";

interface IRatingItemProps {
  question: QuestionRatingModel;
  data: RenderedRatingItem;
  index: any;
  handleOnClick: any;
}

export class RatingItem extends SurveyElementBase<IRatingItemProps, any> {
  get question(): QuestionRatingModel {
    return this.props.question;
  }
  get item(): RenderedRatingItem {
    return this.props.data;
  }
  get index(): any {
    return this.props.index;
  }
  getStateElement() {
    return this.item;
  }
  render(): JSX.Element | null {
    var itemText = this.renderLocString(this.item.locText);
    return (
      <label className={this.question.getItemClass(this.item.itemValue)}>
        <input
          type="radio"
          className="sv-visuallyhidden"
          name={this.question.name}
          id={this.question.getInputId(this.index)}
          value={this.item.value}
          disabled={this.isDisplayMode}
          checked={this.question.value == this.item.value}
          onClick={this.props.handleOnClick}
          onChange={() => { }}
          aria-required={this.question.ariaRequired}
          aria-label={this.question.ariaLabel}
          aria-invalid={this.question.ariaInvalid}
          aria-describedby={this.question.ariaDescribedBy}
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
