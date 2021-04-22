import React from "react";
import {
  AdaptiveActionBarItemWrapper,
  AdaptiveElement,
  IActionBarItem,
  Base,
  ResponsivityManager,
} from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SurveyAction } from "./action-bar-item";

export * from "./action-bar-item";
export * from "./action-bar-item-dropdown";
export * from "./action-bar-separator";

interface IActionBarProps {
  items: Array<IActionBarItem>;
}

export class SurveyActionBar extends SurveyElementBase<IActionBarProps, any> {
  private adaptiveElement = new AdaptiveElement();
  private manager: ResponsivityManager;
  private rootRef: React.RefObject<HTMLDivElement>;
  private updateVisibleItems: any;

  constructor(props: IActionBarProps) {
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
    this.manager = new ResponsivityManager(
      container,
      this.adaptiveElement,
      "span.sv-action"
    );
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
        onClick={function(event) {
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
        return (
          <SurveyAction item={item} key={"item" + itemIndex}></SurveyAction>
        );
      }
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-action-bar", props => {
  return React.createElement(
    SurveyActionBar,
    (props as any) as IActionBarProps
  );
});
