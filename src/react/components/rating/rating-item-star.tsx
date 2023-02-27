import React from "react";
import { QuestionRatingModel, RenderedRatingItem } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { attachKey2click } from "../../reactSurvey";
import { SvgIcon } from "../svg-icon/svg-icon";
import { IRatingItemProps, RatingItem } from "./rating-item";

export class RatingItemStar extends SurveyElementBase<IRatingItemProps, any> {
  get question(): QuestionRatingModel {
    return this.props.question;
  }
  get item(): RenderedRatingItem {
    return this.props.item;
  }
  get index(): any {
    return this.props.index;
  }
  getStateElement() {
    return this.item;
  }
  render(): JSX.Element | null {
    return (
      <label
        className={this.question.getItemClass(this.item.itemValue)}
        onMouseOver={e => this.question.onItemMouseIn(this.item)}
        onMouseOut={e => this.question.onItemMouseOut(this.item)}
      >
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
        <SvgIcon
          className={"sv-star"}
          size={48}
          iconName={"icon-rating-star"}
          title={this.item.text}
        ></SvgIcon>
        <SvgIcon
          className={"sv-star-2"}
          size={48}
          iconName={"icon-rating-star-2"}
          title={this.item.text}
        ></SvgIcon>
      </label>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-rating-item-star", (props) => {
  return React.createElement(RatingItemStar, props);
});
