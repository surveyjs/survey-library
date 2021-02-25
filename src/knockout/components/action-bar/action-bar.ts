import * as ko from "knockout";
import {
  AdaptiveActionBarItemWrapper,
  AdaptiveElement,
  IActionBarItem,
} from "survey-core";
import { ResponsibilityManager } from "survey-core";
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
      ko.unwrap(_items).forEach((item) => {
        const wrapper = new AdaptiveActionBarItemWrapper(this, item);
        wrappers.push(wrapper);
      });
      this.items = wrappers;
    });
  }

  dispose() {
    this.itemsSubscription.dispose();
  }
}

export class AdaptiveElementImplementor extends ImplementorBase {
  constructor(model: AdaptiveElement) {
    super(model);

    model.items.forEach((item) => {
      new ImplementorBase(item);
    });
  }
}

ko.components.register("sv-action-bar", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const model = new ActionBarViewModel(params.items);
      new AdaptiveElementImplementor(model);

      var container: HTMLDivElement = componentInfo.element;
      var manager = new ResponsibilityManager(container, model);
      manager.getItemSizes = () => {
        var widths: number[] = [];
        container
          .querySelectorAll("span.sv-action")
          .forEach((actionContainer) => {
            widths.push((<HTMLDivElement>actionContainer).offsetWidth);
          });
        return widths;
      };
      const updateVisibleItems = setInterval(() => {
        manager.process();
        ko.tasks.runEarly();
      }, 100);
      ko.utils.domNodeDisposal.addDisposeCallback(componentInfo.element, () => {
        clearInterval(updateVisibleItems);
      });
      return model;
    },
  },
  template: template,
});
