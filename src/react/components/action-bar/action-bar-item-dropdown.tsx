import React from "react";
import { ReactElementFactory } from "../../element-factory";
import { Popup } from "../popup/popup";
import { ActionBarItem } from "./action-bar-item";

export class ActionBarItemDropdown extends ActionBarItem {
  renderButtonContent() {
    const buttonContent = super.renderButtonContent();
    return (
      <>
        {buttonContent}
        <Popup model={this.item.popupModel}></Popup>
      </>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-action-bar-item-dropdown", (props) => {
  return React.createElement(ActionBarItemDropdown, props);
});
