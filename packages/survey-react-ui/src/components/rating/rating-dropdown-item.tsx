import React from "react";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";

interface IRatingItemProps {
  item: any;
}

export class RatingDropdownItem extends SurveyElementBase<IRatingItemProps, any> {
  get item(): any {
    return this.props.item;
  }
  getStateElement() {
    return this.item;
  }
  render(): React.JSX.Element | null {
    if (!this.item) return null;
    const item = this.props.item;
    const description = this.renderDescription(item);

    return (
      <div className="sd-rating-dropdown-item">
        <span className="sd-rating-dropdown-item_text">{item.title}</span>
        {description}
      </div>
    );
  }
  renderDescription(item: any) {
    if (!item.description) return null;

    return (
      <div className="sd-rating-dropdown-item_description">
        {this.renderLocString(item.description, undefined, "locString")}
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-rating-dropdown-item", (props) => {
  return React.createElement(RatingDropdownItem, props);
});
