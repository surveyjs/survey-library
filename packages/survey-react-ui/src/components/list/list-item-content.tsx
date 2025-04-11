import * as React from "react";
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
  render(): React.JSX.Element | null {
    if (!this.item) return null;

    const text = this.renderLocString(this.item.locTitle, undefined, "locString");
    const icon = (this.item.iconName) ?
      <SvgIcon
        className={this.model.cssClasses.itemIcon}
        iconName={this.item.iconName}
        size={this.item.iconSize}
        aria-label={this.item.title}
      ></SvgIcon> : null;

    const markerIcon = (this.item.markerIconName) ?
      <SvgIcon
        className={this.item.cssClasses.itemMarkerIcon}
        iconName={this.item.markerIconName}
        size={"auto"}
      ></SvgIcon> : null;

    return <>
      {icon}
      {text}
      {markerIcon}
    </>;
  }
}

ReactElementFactory.Instance.registerElement("sv-list-item-content", (props) => {
  return React.createElement(ListItemContent, props);
});
