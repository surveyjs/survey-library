import React from "react";
import { ListModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { Popup } from "../popup/popup";

interface IListItemProps {
  model: ListModel;
  item: any;
}

export class ListItemGroup extends SurveyElementBase<IListItemProps, any> {
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

    const newElement = ReactElementFactory.Instance.createElement("sv-list-item-content", { item: this.item, key: "content" + this.item.id, model: this.model });
    return <>
      {newElement}
      <Popup model={this.item?.popupModel}></Popup>
    </>;
  }
}

ReactElementFactory.Instance.registerElement("sv-list-item-group", (props) => {
  return React.createElement(ListItemGroup, props);
});
