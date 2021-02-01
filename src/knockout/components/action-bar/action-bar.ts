import * as ko from "knockout";
import {
  AdaptiveActionBarItemWrapper,
  AdaptiveElement,
  IActionBarItem,
} from "../../../action-bar";
import { ResponsibilityManager } from "../../../utils/resonsibilitymanager";
import { ImplementorBase } from "../../kobase";

const template = require("./action-bar.html");

export * from "./action-bar-item";
export * from "./action-bar-separator";
export * from "./action-bar-item-dropdown";
export class ActionBarViewModel extends AdaptiveElement {
  public itemsSubscription: ko.Computed;

  constructor(_items: ko.MaybeObservableArray<IActionBarItem>) {
    super();
    this.itemsSubscription = ko.computed(() => {
      var items = ko.unwrap(_items);
      items.forEach((item) => {
        this.items.push(new AdaptiveActionBarItemWrapper(this, item));
      });
    });
  }

  get hasItems() {
    return (ko.unwrap(this.items) || []).length > 0;
  }

  public get canShrink() {
    return this.showTitles;
  }
  public readonly canGrow = true;
  public shrink() {
    this.showTitles = false;
  }
  public grow() {
    this.showTitles = true;
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
