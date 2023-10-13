import React from "react";
import { ActionDropdownViewModel, getActionDropdownButtonTarget } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { Popup } from "../popup/popup";
import { SurveyActionBarItem } from "./action-bar-item";

export class SurveyActionBarItemDropdown extends SurveyActionBarItem {
  private viewModel: ActionDropdownViewModel;
  constructor(props: any) {
    super(props);
    this.viewModel = new ActionDropdownViewModel(this.item);
  }
  renderInnerButton() {
    const button = super.renderInnerButton();
    return (
      <>
        {button}
        <Popup model={this.item.popupModel} getTarget={getActionDropdownButtonTarget}></Popup>
      </>
    );
  }
  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.viewModel.dispose();
  }
}

ReactElementFactory.Instance.registerElement("sv-action-bar-item-dropdown", (props) => {
  return React.createElement(SurveyActionBarItemDropdown, props);
});
