import * as ko from "knockout";
import {
  ActionBar,
  AdaptiveElement,
  IActionBarItem,
  Base,
  Action,
  AdaptiveActionContainer,
} from "survey-core";
import { ResponsivityManager } from "survey-core";
import { ImplementorBase } from "../../kobase";

const template = require("./action-bar.html");

export * from "./action";
export * from "./action-bar-item";
export * from "./action-bar-item-dropdown";
export * from "./action-bar-separator";

export class ActionBarViewModel extends ActionBar {
  public itemsSubscription: any;

  constructor(_items: Array<IActionBarItem>, public handleClick = true) {
    super();
    this.itemsSubscription = ko.computed(() => {
      this.setItems(ko.unwrap(_items));
    });
  }

  dispose() {
    super.dispose();
    this.itemsSubscription.dispose();
  }
}

export class AdaptiveElementImplementor extends ImplementorBase {
  private itemsSubscription: any;

  constructor(model: AdaptiveElement | AdaptiveActionContainer) {
    super(model);

    this.itemsSubscription = ko.computed(() => {
      ((<any>model).items || (<any>model).actions).forEach((item: any) => {
        if (!!item.stateItem) {
          new ImplementorBase(item.stateItem);
        } else {
          new ImplementorBase(item);
        }
      });
    });
  }

  dispose() {
    super.dispose();
    this.itemsSubscription.dispose();
  }
}

ko.components.register("sv-action-bar", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const handleClick =
        params.handleClick !== undefined ? params.handleClick : true;
      let model = { model: params.model, handleClick: handleClick };
      new ImplementorBase(params.model);

      const container: HTMLDivElement =
        componentInfo.element.nextElementSibling;
      const manager: ResponsivityManager = new ResponsivityManager(
        container,
        params.model,
        "span.sv-action:not(.sv-dots)"
      );
      ko.utils.domNodeDisposal.addDisposeCallback(container, () =>
        manager.dispose()
      );
      return model;
    },
  },
  template: template,
});
