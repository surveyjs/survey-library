import * as ko from "knockout";

import { PopupBase, PopupModel } from "../../../popup";
import { ImplementorBase } from "../../kobase";
const template = require("html-loader?interpolate!val-loader!./popup.html");
export class PopupViewModel {
  private container: HTMLElement;
  private popupBase: PopupBase;
  constructor(public model: PopupModel, targetElement: HTMLElement) {
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    this.container.innerHTML = template;
    ko.applyBindings(this, this.container);

    this.popupBase = new PopupBase(model, targetElement);
    this.popupBase.container = this.container;
    new ImplementorBase(this.popupBase);

    ko.applyBindings(this.popupBase, this.container);
  }

  set isVisible(val: boolean) {
    this.popupBase.isVisible = val;
  }

  public dispose() {
    this.model.onToggleVisibility = undefined;
    ko.cleanNode(this.container);
    this.container.remove();
    this.container = undefined;
  }

  public static showModal(
    componentName: string,
    data: any,
    onApply: () => void,
    onCancel?: () => void
  ) {
    const popupModel = new PopupModel(
      componentName,
      data,
      "top",
      "left",
      false,
      true,
      onCancel,
      onApply
    );

    const popupViewModel: PopupViewModel = new PopupViewModel(
      popupModel,
      undefined
    );

    popupViewModel.isVisible = true;
  }

  public static showDropDownMenu(items: any[], target: HTMLElement) {
    const popupModel = new PopupModel(
      "sv-list",
      items /*, "top", "left", true*/
    );

    const popupViewModel: PopupViewModel = new PopupViewModel(
      popupModel,
      target
    );
    popupViewModel.isVisible = true;
  }
}

ko.components.register("sv-popup", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const viewModel = new PopupViewModel(
        params.model,
        componentInfo.element.parentElement
      );
      return viewModel;
    },
  },
  template: "<div></div>",
});
