import * as ko from "knockout";

const template = require("./action-bar.html");

export * from "./action-bar-item";
export * from "./action-bar-separator";
export * from "./action-bar-item-dropdown";

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
  showTitle?: ko.Computed<boolean> | boolean;
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
   * Toolbar item data object. Used as data for custom template rendering
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
  icon?: string;
  /**
   * Toolbar item child items. Can be used as contianer for options
   */
  items?: ko.ObservableArray<IActionBarItem>;
}

/**
 * The toolbar item description.
 */
export class ActionBarViewModel {
  items: ko.MaybeObservableArray<IActionBarItem>;
  constructor(items: Array<IActionBarItem>) {
    this.items = items;
  }
  get hasItems() {
    return (ko.unwrap(this.items) || []).length > 0;
  }
}

ko.components.register("sv-action-bar", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return new ActionBarViewModel(params.items);
    },
  },
  template: template,
});
