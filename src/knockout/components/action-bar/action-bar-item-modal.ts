import { throws } from "assert";
import * as ko from "knockout";
import { IActionBarItem } from "./action-bar";

const template = require("./action-bar-item-modal.html");

export class ActionBarItemModalViewModel {
  public koIsVisible: any = ko.observable(false);

  constructor(private _item: IActionBarItem) {}

  public get icon() {
    return this._item.icon;
  }

  public get contentComponentName() {
    return this._item.data.contentComponentName;
  }

  public get contentComponentData() {
    return this._item.data.contentComponentData;
  }

  public get contentTemplateName() {
    return this._item.data.contentTemplateName;
  }

  public get onShow() {
    return this._item.data.onShow || function () {};
  }

  public get onApply() {
    return this._item.data.onApply || function () {};
  }

  public get onCancel() {
    return this._item.data.onCancel || function () {};
  }
}

ko.components.register("sv-action-bar-item-modal", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return new ActionBarItemModalViewModel(params.item);
    },
  },
  template: template,
});
