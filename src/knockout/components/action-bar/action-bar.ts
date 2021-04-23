import * as ko from "knockout";
import {
  AdaptiveActionBarItemWrapper,
  AdaptiveElement,
  IActionBarItem,
} from "survey-core";
import { ResponsivityManager } from "survey-core";
import { ImplementorBase } from "../../kobase";

const template = require("./action-bar.html");

export * from "./action-bar-item";
export * from "./action-bar-separator";
export * from "./action-bar-item-dropdown";

export class ActionBarViewModel extends AdaptiveElement {
  public itemsSubscription: any;

  constructor(_items: Array<IActionBarItem>) {
    super();
    this.itemsSubscription = ko.computed(() => {
      const wrappers: AdaptiveActionBarItemWrapper[] = [];
      ko.unwrap(_items).forEach(item => {
        const wrapper = new AdaptiveActionBarItemWrapper(this, item);
        wrappers.push(wrapper);
      });
      this.items = wrappers;
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
        !!ko.tasks && ko.tasks.runEarly();
      }, 100);
      ko.utils.domNodeDisposal.addDisposeCallback(container, () => {
        clearInterval(updateVisibleItems);
      });
      return model;
    },
  },
  template: template,
});
