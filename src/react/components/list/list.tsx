import React from "react";
import { IActionBarItem } from "survey-core";
import { ListModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SvgIcon } from "../svg-icon/svg-icon";

interface IListProps {
  model: ListModel;
}

export class List extends SurveyElementBase<IListProps, any> {
  get model(): ListModel {
    return this.props.model;
  }
  getStateElement() {
    return this.model;
  }
  render() {
    const items = this.renderItems();
    return (
      <ul
        className="sv-list"
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        {items}
      </ul>
    );
  }
  renderItems() {
    if (!this.model) {
      return null;
    }
    const items = this.model.items;
    if (!items) {
      return null;
    }
    return items.map((item: IActionBarItem, itemIndex: number) => {
      const style = item.visible === undefined || item.visible ? null : { display: "none" };
      const className = this.model.getItemClass(item);
      const icon = item.iconName ? (
        <SvgIcon
          className="sv-list__item-icon"
          iconName={item.iconName}
          size={24}
        ></SvgIcon>
      ) : null;
      return (
        <li
          style={style}
          key={itemIndex}
          className={className}
          onClick={() => {
            this.model.selectItem(item);
          }}
        >
          {icon}
          <span>{item.title}</span>
        </li>
      );
    });
  }
}

ReactElementFactory.Instance.registerElement("sv-list", (props) => {
  return React.createElement(List, props);
});
