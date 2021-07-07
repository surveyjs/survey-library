import React from "react";
import { ReactElementFactory } from "../../element-factory";
import { Popup } from "../popup/popup";
import { SurveyActionBarItem } from "./action-bar-item";

export class SurveyActionBarItemDropdown extends SurveyActionBarItem {
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
  return React.createElement(SurveyActionBarItemDropdown, props);
});
