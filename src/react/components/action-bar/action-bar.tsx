import React from "react";
import { IActionBarItem } from "../../../base";
import { ReactElementFactory } from "../../element-factory";
import { ObjectWrapper } from "../../../utils/objectwrapper";
import { ActionBarSeparator } from "./action-bar-separator";
export { ActionBarItem } from "./action-bar-item";
// export * from "./action-bar-separator";

export class ActionBar extends React.Component<any, any> {
  private get items() {
    return this.props.items;
  }

  render(): any {
    var itemsContainer = null;
    if (this.hasItems) {
      const items = this.renderItems();
      itemsContainer = (
        <div
          className="sv-action-bar"
          onClick={function (event) {
            event.stopPropagation();
          }}
        >
          {items}
        </div>
      );
    }
    return itemsContainer;
  }

  get hasItems() {
    return (this.items || []).length > 0;
  }

  renderItems() {
    return this.items.map((item: IActionBarItem, itemIndex: number) => {
      (item as any).isVisible = true;
      var wrappedItem: any = new ObjectWrapper(item, ["action", "showTitle"]);
      const itemComponent = ReactElementFactory.Instance.createElement(
        item.component || "sv-action-bar-item",
        {
          item: wrappedItem,
        }
      );
      const separator = wrappedItem.needSeparator ? (
        <ActionBarSeparator></ActionBarSeparator>
      ) : null;
      var itemClass =
        "sv-action " + (!wrappedItem.isVisible ? "sv-action--hidden" : null);
      var itemContainer = null;
      if (item.visible || item.visible === undefined)
        itemContainer = (
          <span className={itemClass} key={"item" + itemIndex}>
            {separator}
            {itemComponent}
          </span>
        );
      return itemContainer;
    });
  }
}

ReactElementFactory.Instance.registerElement("sv-action-bar", (props) => {
  return React.createElement(ActionBar, props);
});
