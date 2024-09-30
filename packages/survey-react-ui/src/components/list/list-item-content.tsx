import React from "react";
import { ListModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SvgIcon } from "../svg-icon/svg-icon";

interface IListItemProps {
  model: ListModel;
  item: any;
}

export class ListItemContent extends SurveyElementBase<IListItemProps, any> {
  get model(): ListModel {
    return this.props.model;
  }
  get item(): any {
    return this.props.item;
  }
  getStateElement() {
    return this.item;
  }
  render(): JSX.Element | null {
    if (!this.item) return null;

    const content: Array<JSX.Element> = [];
    const text = this.renderLocString(this.item.locTitle, undefined, "locString");
    if(this.item.iconName) {
      const icon = <SvgIcon
        key={"icon"}
        className={this.model.cssClasses.itemIcon}
        iconName={this.item.iconName}
        size={this.item.iconSize}
        aria-label={this.item.title}
      ></SvgIcon>;
      content.push(icon);
      content.push(<span key={"text"}>{text}</span>);
    } else {
      content.push(text);
    }

    if(this.item.markerIconName) {
      const icon = <SvgIcon
        key={"marker"}
        className={this.item.cssClasses.itemMarkerIcon}
        iconName={this.item.markerIconName}
        size={this.item.markerIconSize}
      ></SvgIcon>;
      content.push(icon);
    }

    return <>
      {content}
    </>;
  }
}

ReactElementFactory.Instance.registerElement("sv-list-item-content", (props) => {
  return React.createElement(ListItemContent, props);
});
