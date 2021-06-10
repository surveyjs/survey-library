import * as ko from "knockout";
import { ActionBar, AdaptiveElement, IActionBarItem, Base } from "survey-core";
import { ResponsivityManager } from "survey-core";
import { ImplementorBase } from "../../kobase";

const template = require("./action-bar.html");

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
  constructor(model: AdaptiveElement) {
    super(model);

    model.items.forEach((item) => {
      new ImplementorBase(item.stateItem);
    });
  }
}

ko.components.register("sv-action-bar", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const model: ActionBarViewModel = new ActionBarViewModel(params.items, params.handleClick);
      new AdaptiveElementImplementor(model);
      const container: HTMLDivElement =
        componentInfo.element.nextElementSibling;
      const manager: ResponsivityManager = new ResponsivityManager(
        container,
        model,
        "span.sv-action"
      );
      ko.utils.domNodeDisposal.addDisposeCallback(container, () =>
        manager.dispose()
      );
      return model;
    },
  },
  template: template,
});
