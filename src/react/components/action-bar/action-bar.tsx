import React from "react";
import {
  AdaptiveActionBarItemWrapper,
  AdaptiveElement,
  IActionBarItem,
} from "../../../action-bar";
import { ReactElementFactory } from "../../element-factory";
import { ActionBarSeparator } from "./action-bar-separator";
import { SurveyElementBase } from "../../reactquestion_element";
import { Base } from "../../../base";
import { ResponsibilityManager } from "../../../entries/knockout";
export { ActionBarItem } from "./action-bar-item";
// export * from "./action-bar-separator";

export class ActionBar extends SurveyElementBase {
  private adaptiveElement = new AdaptiveElement();
  private manager: ResponsibilityManager;
  private rootRef: React.RefObject<HTMLDivElement>;
  private updateVisibleItems: any;

  constructor(props: any) {
    super(props);

    const sourceItems: Array<IActionBarItem> = this.props.items;
    this.adaptiveElement.items = sourceItems.map(
      (item: IActionBarItem, itemIndex: number) => {
        return new AdaptiveActionBarItemWrapper(this.adaptiveElement, item);
      }
    );
    this.rootRef = React.createRef();
  }
  componentDidMount() {
    super.componentDidMount();

    const container = this.rootRef.current;
    this.manager = new ResponsibilityManager(container, this.adaptiveElement);
    this.manager.getItemSizes = () => {
      const widths: number[] = [];
      container
        .querySelectorAll("span.sv-action")
        .forEach((actionContainer) => {
          widths.push((actionContainer as HTMLDivElement).offsetWidth);
        });
      return widths;
    };

    this.updateVisibleItems = setInterval(() => {
      this.manager.process();
    }, 100);
  }
  componentWillUnmount() {
    clearInterval(this.updateVisibleItems);
    super.componentWillUnmount();
  }

  protected getStateElement(): Base {
    return this.adaptiveElement;
  }
  render(): any {
    if (!this.hasItems) {
      return null;
    }

    const items = this.renderItems();
    return (
      <div
        ref={this.rootRef}
        className="sv-action-bar"
        onClick={function (event) {
          event.stopPropagation();
        }}
      >
        {items}
      </div>
    );
  }

  get hasItems(): boolean {
    return (this.adaptiveElement.items || []).length > 0;
  }

  renderItems() {
    return this.adaptiveElement.items.map(
      (item: AdaptiveActionBarItemWrapper, itemIndex: number) => {
        if (!item.visible && item.visible !== undefined) {
          return null;
        }

        const itemComponent = ReactElementFactory.Instance.createElement(
          item.component || "sv-action-bar-item",
          {
            item: item,
            key: "item" + itemIndex,
          }
        );
        return itemComponent;
      }
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-action-bar", (props) => {
  return React.createElement(ActionBar, props);
});
