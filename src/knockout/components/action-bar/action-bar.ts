import * as ko from "knockout";
import { ObjectWrapper } from "../../../utils/objectwrapper";
import { ResponsibilityManager } from "../../../utils/resonsibilitymanager";

const template = require("./action-bar.html");

export * from "./action-bar-item";
export * from "./action-bar-separator";
export * from "./action-bar-item-dropdown";
export * from "./action-bar-item-modal";

export interface IActionBarItem {
  /**
   * Unique string id
   */
  id: string;
  /**
   * Set this property to false to make the toolbar item invisible.
   */
  visible?: ko.Computed<boolean> | ko.Observable<boolean> | boolean;
  /**
   * Toolbar item title
   */
  title: ko.Computed<string> | string;
  /**
   * Toolbar item tooltip
   */
  tooltip?: ko.Computed<string> | string;
  /**
   * Set this property to false to disable the toolbar item.
   */
  enabled?: ko.Computed<boolean> | ko.Observable<boolean> | boolean;

  /**
   * Set this property to false to hide the toolbar item title.
   */
  showTitle?: ko.Computed<boolean> | ko.Observable<boolean> | boolean;
  /**
   * A callback that calls on toolbar item click.
   */
  action?: () => void;
  /**
   * Toolbar item css class
   */
  css?: ko.Computed<string> | string;
  /**
   * Toolbar inner element css class
   */
  innerCss?: ko.Computed<string> | string;
  /**
   * Toolbar item data object. Used as data for custom template or component rendering
   */
  data?: any;
  /**
   * Toolbar item template name
   */
  template?: string;
  /**
   * Toolbar item component name
   */
  component?: ko.Computed<string> | string;
  /**
   * Toolbar item icon name
   */
  iconName?: string;
  /**
   * Toolbar item child items. Can be used as contianer for options
   */
  items?: ko.ObservableArray<IActionBarItem>;
}

/**
 * The toolbar item description.
 */

export class ActionBarViewModel {
  public itemsSubscription: ko.Computed;
  public items: ko.ObservableArray = ko.observableArray();
  public invisibleItems: ko.ObservableArray<IActionBarItem> = ko.observableArray();
  private _showTitles = ko.observable(true);
  private dotsItem = {
    component: "sv-action-bar-item-dropdown",
    items: this.invisibleItems,
    innerCss: "sv-dots",
    iconName: "icon-dots",
    visible: () => true,
    verticalPosition: "bottom",
    horizontalPosition: "left",
    action: (item: any) => {
      this.invisibleItemSelected(item);
      return true;
    },
    closeOnAction: true,
  };

  constructor(_items: ko.MaybeObservableArray<IActionBarItem>) {
    this.itemsSubscription = ko.computed(() => {
      var items = ko.unwrap(_items);
      items.forEach((item) => {
        var wrappedItem: any = new ObjectWrapper(item, [
          "action",
          "showTitle",
          "visible",
        ]);
        var showTitle = item.showTitle;
        wrappedItem.showTitle = ko.computed(() => {
          return (
            this._showTitles() &&
            (ko.unwrap(showTitle) || showTitle === undefined)
          );
        });
        wrappedItem.visible = ko.observable(
          ko.unwrap(item.visible) || item.visible === undefined
        );
        this.items.push(wrappedItem);
      });
    });
  }

  get hasItems() {
    return (ko.unwrap(this.items) || []).length > 0;
  }

  public showFirstN(visibleItemsCount: number) {
    let leftItemsToShow = visibleItemsCount;
    this.invisibleItems([]);
    ko.unwrap(this.items).forEach((item: any) => {
      if (item === this.dotsItem) return;
      item.visible(leftItemsToShow > 0);
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
  public get canShrink() {
    return this._showTitles();
  }
  public readonly canGrow = true;
  public shrink() {
    this._showTitles(false);
  }
  public grow() {
    this._showTitles(true);
  }

  public invisibleItemSelected = (model: any) => {
    model.action();
  };

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
