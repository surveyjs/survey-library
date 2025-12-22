import * as React from "react";
import { QuestionRatingModel, RenderedRatingItem } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { attachKey2click } from "../../reactSurvey";
import { SvgIcon } from "../svg-icon/svg-icon";
import { IRatingItemProps, RatingItemBase } from "./rating-item";

export class RatingItemStar extends RatingItemBase {
  render(): React.JSX.Element | null {
    return (
      <label
        className={this.item.className}
        onMouseDown={this.handleOnMouseDown}
        onMouseOver={e => this.question.onItemMouseIn(this.item)}
        onMouseOut={e => this.question.onItemMouseOut(this.item)}
        title={this.item.text}
      >
        <input
          type="radio"
          className="sv-visuallyhidden"
          name={this.question.questionName}
          id={this.question.getInputId(this.index)}
          value={this.item.value}
          disabled={this.question.isDisabledAttr}
          readOnly={this.question.isReadOnlyAttr}
          checked={this.question.value == this.item.value}
          onClick={this.props.handleOnClick}
          onChange={() => { }}
          aria-label={this.question.ariaLabel}
        />
        <SvgIcon
          className={"sv-star"}
          size={"auto"}
          iconName={this.question.itemStarIcon}
        ></SvgIcon>
        <SvgIcon
          className={"sv-star-2"}
          size={"auto"}
          iconName={this.question.itemStarIconAlt}
        ></SvgIcon>
      </label>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-rating-item-star", (props) => {
  return React.createElement(RatingItemStar, props);
});
