import React from "react";
import { IAction, ListModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { attachKey2click } from "../../reactSurvey";
import { SurveyActionBarItemDropdown } from "../action-bar/action-bar-item-dropdown";
import { SvgIcon } from "../svg-icon/svg-icon";

interface IListProps {
  model: ListModel;
}

export class List extends SurveyElementBase<IListProps, any> {
  get model(): ListModel {
    return this.props.model;
  }
  handleKeydown = (event: any) => {
    this.model.onKeyDown(event);
  };
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
        onKeyDown={this.handleKeydown}
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
    return items.map((item: IAction, itemIndex: number) => {
      const style = {
        paddingLeft: this.model.getItemIndent(item),
        display: item.visible === undefined || item.visible ? null : "none",
      };
      const className = this.model.getItemClass(item);
      const content = [];
      if(!item.component) {
        const icon = item.iconName ? (
          <SvgIcon
            key={1}
            className="sv-list__item-icon"
            iconName={item.iconName}
            size={24}
          ></SvgIcon>
        ) : null;
        content.push(icon);
        content.push(<span key={2}>{item.title}</span>);
      } else {
        content.push(ReactElementFactory.Instance.createElement(item.component, { item: item, }));
      }

      return attachKey2click(
        <li
          style={style}
          key={itemIndex}
          className={className}
          onClick={() => {
            this.model.selectItem(item);
          }}
        >
          {content}
        </li>
      );
    });
  }
}

ReactElementFactory.Instance.registerElement("sv-list", (props) => {
  return React.createElement(List, props);
});
