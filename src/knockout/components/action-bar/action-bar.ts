import * as ko from "knockout";
import { AdaptiveActionContainer, IAction } from "survey-core";
import { ResponsivityManager } from "survey-core";
import { ImplementorBase } from "../../kobase";

const template = require("./action-bar.html");

export * from "./action";
export * from "./action-bar-item";
export * from "./action-bar-item-dropdown";
export * from "./action-bar-separator";

export class ActionBarViewModel extends AdaptiveActionContainer {
  public itemsSubscription: any;

  constructor(_items: Array<IAction>, public handleClick = true) {
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

  constructor(model: AdaptiveActionContainer) {
    super(model);

    this.itemsSubscription = ko.computed(() => {
      ((<any>model).renderedActions || (<any>model).items || (<any>model).actions).forEach((item: any) => {
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
        ".sv-action:not(.sv-dots)>.sv-action__content"
      );
      ko.utils.domNodeDisposal.addDisposeCallback(container, () =>
        manager.dispose()
      );
      return model;
    },
  },
  template: template,
});
