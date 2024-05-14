import React from "react";
import { QuestionRatingModel, RenderedRatingItem } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { attachKey2click } from "../../reactSurvey";
import { SvgIcon } from "../svg-icon/svg-icon";
import { IRatingItemProps, RatingItemBase } from "./rating-item";

export class RatingItemStar extends RatingItemBase {
  render(): JSX.Element | null {
    return (
      <label onMouseDown={this.handleOnMouseDown}
        className={this.question.getItemClass(this.item.itemValue)}
        onMouseOver={e => this.question.onItemMouseIn(this.item)}
        onMouseOut={e => this.question.onItemMouseOut(this.item)}
      >
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
        <SvgIcon
          className={"sv-star"}
          size={"auto"}
          iconName={this.question.itemStarIcon}
          title={this.item.text}
        ></SvgIcon>
        <SvgIcon
          className={"sv-star-2"}
          size={"auto"}
          iconName={this.question.itemStarIconAlt}
          title={this.item.text}
        ></SvgIcon>
      </label>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-rating-item-star", (props) => {
  return React.createElement(RatingItemStar, props);
});
