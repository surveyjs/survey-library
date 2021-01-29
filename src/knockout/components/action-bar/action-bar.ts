import * as ko from "knockout";
import { IActionBarItem } from "../../../action-bar";
import { Base } from "../../../base";
import { property } from "../../../jsonobject";
import { ResponsibilityManager } from "../../../utils/resonsibilitymanager";
import { PopupModel } from "../popup/popup";

const template = require("./action-bar.html");

export * from "./action-bar-item";
export * from "./action-bar-separator";
export * from "./action-bar-item-dropdown";
export class ActionBarItem extends Base implements IActionBarItem {
  constructor(item: IActionBarItem) {
    super();
    Object.assign(this, item);
  }
  @property() id: string;
  @property() visible?: boolean;
  @property() title?: string;
  @property() tooltip?: string;
  @property() enabled?: boolean;
  @property() showTitle?: boolean | (() => boolean);
  @property() action?: (context?: any) => void;
  @property() css?: string;
  @property() innerCss?: string;
  @property() data?: any;
  @property() popupModel?: any;
  @property() active?: boolean | (() => boolean);
  @property() needSeparator?: boolean;
  @property() template?: string;
  @property() component?: string;
  @property() iconName?: string;
  @property() items?: any;
}
/**
 * The toolbar item description.
 */
export abstract class AdaptiveElement {
  public items: ko.ObservableArray<any> = ko.observableArray();
  public invisibleItems: ko.ObservableArray<any> = ko.observableArray();
  public showTitles = ko.observable(true);
  protected dotsItem: AdaptiveActionBarItemWrapper; // (...) button

  constructor() {
    this.dotsItem = new AdaptiveActionBarItemWrapper(
      this,
      new ActionBarItem({
        id: "dotsItem-id",
        component: "sv-action-bar-item-dropdown",
        css: "sv-dots",
        innerCss: "sv-dots__item",
        iconName: "icon-dots",
        showTitle: false,
        action: (item: any) => {
          this.dotsItemPopupModel.toggleVisibility();
        },

        popupModel: this.dotsItemPopupModel,
      })
    );
  }

  public invisibleItemSelected(item: any): void {
    if (!!item && typeof item.action === "function") {
      item.action();
    }
  }

  protected dotsItemPopupModel: PopupModel = new PopupModel("sv-list", {
    onItemSelect: (item: any) => {
      this.invisibleItemSelected(item);
      this.dotsItemPopupModel.toggleVisibility();
    },
    items: this.invisibleItems,
  });

  public showFirstN(visibleItemsCount: number) {
    let leftItemsToShow = visibleItemsCount;
    this.invisibleItems([]);
    ko.unwrap(this.items).forEach((item: any) => {
      if (item === this.dotsItem) return;
      item.isVisible(leftItemsToShow > 0);
      if (leftItemsToShow <= 0) {
        this.invisibleItems.push(item);
      }
      leftItemsToShow--;
    });
    var index = this.items.indexOf(this.dotsItem);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    if (visibleItemsCount < this.items().length) {
      this.items.splice(visibleItemsCount, 0, this.dotsItem);
    }
  }
}

export class AdaptiveActionBarItemWrapper implements IActionBarItem {
  constructor(private owner: AdaptiveElement, private item: IActionBarItem) {}

  public get id(): string {
    return this.item.id;
  }
  public get visible(): boolean {
    return ko.unwrap(this.item.visible);
  }
  public get title(): string {
    return ko.unwrap(this.item.title);
  }
  public get tooltip(): string {
    return ko.unwrap(this.item.tooltip);
  }
  public get enabled(): boolean {
    return ko.unwrap(this.item.enabled);
  }
  //public get showTitle(): any { return ko.unwrap(this.item.showTitle); }
  public showTitle = <() => boolean>ko.computed(() => {
    return (
      this.owner.showTitles() &&
      (ko.unwrap(this.item.showTitle) || this.item.showTitle === undefined)
    );
  });

  public action() {
    this.item.action && this.item.action();
  }
  public get css(): string {
    return ko.unwrap(this.item.css);
  }
  public get innerCss(): string {
    return ko.unwrap(this.item.innerCss);
  }
  public get data(): any {
    return ko.unwrap(this.item.data);
  }
  public get popupModel(): any {
    return ko.unwrap(this.item.popupModel);
  }
  public get active(): boolean {
    return <boolean>ko.unwrap(this.item.active);
  }
  public get needSeparator(): boolean {
    return ko.unwrap(this.item.needSeparator);
  }
  public get template(): string {
    return this.item.template;
  }
  public get component(): string {
    return ko.unwrap(this.item.component);
  }
  public get iconName(): string {
    return ko.unwrap(this.item.iconName);
  }
  public get items(): any {
    return ko.unwrap(this.item.items);
  }
  public isVisible = ko.observable(true);
}

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
    return this.showTitles();
  }
  public readonly canGrow = true;
  public shrink() {
    this.showTitles(false);
  }
  public grow() {
    this.showTitles(true);
  }

  dispose() {
    this.itemsSubscription.dispose();
  }
}

ko.components.register("sv-action-bar", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const model = new ActionBarViewModel(params.items);
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
      let updateVisibleItems = setInterval(() => {
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
