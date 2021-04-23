import * as ko from "knockout";
import {
  ActionBar,
  AdaptiveActionBarItemWrapper,
  AdaptiveElement,
  IActionBarItem,
  ResponsivityManager,
} from "survey-core";
import { ImplementorBase } from "../../kobase";

const template = require("./action-bar.html");

export * from "./action-bar-item";
export * from "./action-bar-item-dropdown";
export * from "./action-bar-separator";

export class ActionBarViewModel extends ActionBar {
  public itemsSubscription: any;

  constructor(_items: Array<IActionBarItem>) {
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

    model.items.forEach(item => {
      new ImplementorBase(item);
    });
  }
}

ko.components.register("sv-action-bar", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const model = new ActionBarViewModel(params.items);
      new AdaptiveElementImplementor(model);

      const container: HTMLDivElement = componentInfo.element.nextElementSibling;
      const manager: ResponsivityManager = new ResponsivityManager(container, model, 'span.sv-action');
      const updateVisibleItems = setInterval(() => {
        manager.process();
        ko.tasks.runEarly();
      }, 100);
      ko.utils.domNodeDisposal.addDisposeCallback(container, () => {
        clearInterval(updateVisibleItems);
      });
      return model;
    },
  },
  template: template,
});
