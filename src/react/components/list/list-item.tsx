import React from "react";
import { ListModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { attachKey2click } from "../../reactSurvey";
import { SvgIcon } from "../svg-icon/svg-icon";

interface IListItemProps {
  model: ListModel;
  item: any;
}

export class ListItem extends SurveyElementBase<IListItemProps, any> {
  get model(): ListModel {
    return this.props.model;
  }
  get item(): any {
    return this.props.item;
  }
  handleKeydown = (event: any) => {
    this.model.onKeyDown(event);
  };
  getStateElement() {
    return this.item;
  }
  render() {
    if (!this.item) {
      return null;
    }
    const style = {
      paddingLeft: this.model.getItemIndent(this.item),
      display: this.item.visible === undefined || this.item.visible ? null : "none",
    };
    const className = this.model.getItemClass(this.item);
    const content = [];
    if (!this.item.component) {
      const icon = this.item.iconName ? (
        <SvgIcon
          key={1}
          className="sv-list__item-icon"
          iconName={this.item.iconName}
          size={24}
        ></SvgIcon>
      ) : null;
      content.push(icon);
      content.push(<span key={2}>{this.item.title}</span>);
    } else {
      content.push(ReactElementFactory.Instance.createElement(this.item.component, { item: this.item }));
    }

    return attachKey2click(
      <li
        style={style}
        className={className}
        onClick={() => {
          this.model.selectItem(this.item);
        }}
        onPointerDown={(event: any) => this.model.onPointerDown(event, this.item)}
      >
        {content}
      </li>
    );
  }

}

ReactElementFactory.Instance.registerElement("sv-list-item", (props) => {
  return React.createElement(ListItem, props);
});
