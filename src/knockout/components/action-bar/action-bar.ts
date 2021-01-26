import { timeStamp } from "console";
import * as ko from "knockout";
import { ObjectWrapper } from "../../../utils/objectwrapper";
import { ResponsibilityManager } from "../../../utils/resonsibilitymanager";
import { PopupModel } from "../popup/popup";

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
  visible?: any;
  /**
   * Toolbar item title
   */
  title: any;
  /**
   * Toolbar item tooltip
   */
  tooltip?: any;
  /**
   * Set this property to false to disable the toolbar item.
   */
  enabled?: any;
  /**
   * Set this property to false to hide the toolbar item title.
   */
  showTitle?: any;
  /**
   * A callback that calls on toolbar item click.
   */
  action?: () => void;
  /**
   * Toolbar item css class
   */
  css?: any;
  /**
   * Toolbar inner element css class
   */
  innerCss?: any;
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
  component?: any;
  /**
   * Toolbar item icon name
   */
  iconName?: string;
  /**
   * Toolbar item child items. Can be used as contianer for options
   */
  items?: any;
}

/**
 * The toolbar item description.
 */
export abstract class AdaptiveElement {
  public items: ko.ObservableArray<any> = ko.observableArray();
  public invisibleItems: ko.ObservableArray<any> = ko.observableArray();

  public invisibleItemSelected(item: any) : void {
    if (!!item && typeof item.action === "function")
      item.action();
  };

  protected dotsItemPopupModel = new PopupModel(
    "sv-list",
    {
      onItemSelect: (item: any) => {
        this.invisibleItemSelected(item);
        this.dotsItemPopupModel.toggleVisibility();
      },
      items: this.invisibleItems
    },
    undefined
  );

  protected dotsItem = {
    // (...) button
    component: "sv-action-bar-item-dropdown",
    css: "sv-dots",
    innerCss: "sv-dots__item",
    iconName: "icon-dots",
    isVisible: () => true,
    showTitle: false,
    action: (item: any) => {
      this.dotsItemPopupModel.toggleVisibility();
    },

    popupModel: this.dotsItemPopupModel
  };
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

export class ActionBarViewModel extends AdaptiveElement {
  public itemsSubscription: ko.Computed;
  private _showTitles = ko.observable(true);

  constructor(_items: ko.MaybeObservableArray<IActionBarItem>) {
    super();
    this.itemsSubscription = ko.computed(() => {
      var items = ko.unwrap(_items);
      items.forEach((item) => {
        var wrappedItem: any = new ObjectWrapper(item, ["action", "showTitle"]);
        var showTitle = item.showTitle;
        wrappedItem.showTitle = ko.computed(() => {
          return (
            this._showTitles() &&
            (ko.unwrap(showTitle) || showTitle === undefined)
          );
        });
        wrappedItem.isVisible = ko.observable(true);

        this.items.push(wrappedItem);
      });
    });
  }

  get hasItems() {
    return (ko.unwrap(this.items) || []).length > 0;
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
