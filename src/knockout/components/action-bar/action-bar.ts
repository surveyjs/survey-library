import * as ko from "knockout";

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
  public visibleItems: ko.ObservableArray<IActionBarItem>;
  public showInvisibleItems = ko.observable(false);
  public invisibleItems: ko.ObservableArray<IActionBarItem> = ko.observableArray();
  private _showTitles = ko.observable(true);

  constructor(_items: ko.MaybeObservableArray<IActionBarItem>) {
    this.itemsSubscription = ko.computed(() => {
      var items = ko.unwrap(_items);
      items.forEach((item) => {
        //TODO
        var showTitle = item.showTitle;
        item.showTitle = ko.computed(() => {
          return (
            this._showTitles() &&
            (ko.unwrap(showTitle) || showTitle === undefined)
          );
        });
        item.visible = ko.observable(
          ko.unwrap(item.visible) || item.visible === undefined
        );
        //
      });
      this.items(items);
    });
  }

  get hasItems() {
    return (ko.unwrap(this.items) || []).length > 0;
  }

  public showFirstN(visibleItemsCount: number) {
    let leftItemsToShow = visibleItemsCount;
    this.invisibleItems([]);
    ko.unwrap(this.items).forEach((item: any) => {
      item.visible(leftItemsToShow >= 0);
      if (leftItemsToShow < 0) {
        this.invisibleItems.push(item);
      }
      leftItemsToShow--;
    });
  }

  public hideTitles() {
    this._showTitles(false);
  }
  public showTitles() {
    this._showTitles(true);
  }

  public invisibleItemSelected = (model: any) => {
    this.showInvisibleItems(false);
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
      var previousWidth = 0;
      let updateVisibleItems = setInterval(() => {
        var container: HTMLDivElement = componentInfo.element;
        var style = window.getComputedStyle(container);

        var widthWithMargins =
          container.offsetWidth +
          parseFloat(style.marginLeft) +
          parseFloat(style.marginRight);
        if (!!container) {
          let delta = container.scrollWidth - container.offsetWidth;
          if (delta > 5 || widthWithMargins - previousWidth > 56) {
            if (delta > 5) {
              model.hideTitles();
              model.showFirstN(
                Math.floor((container.offsetWidth - 16) / 56) - 2
              );
            } else if (widthWithMargins - previousWidth > 56) {
              model.showTitles();
              model.showFirstN(Number.MAX_VALUE);
              ko.tasks.runEarly();
            }
            previousWidth = widthWithMargins;
          }
        }
      }, 100);
      ko.utils.domNodeDisposal.addDisposeCallback(componentInfo.element, () => {
        clearInterval(updateVisibleItems);
        model.dispose();
      });
      return model;
    },
  },
  template: template,
});
