import React from "react";
import {
  ActionBar,
  IActionBarItem,
  Base,
  ResponsivityManager,
  Action,
  ActionContainer
} from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SurveyActionV2 } from "./action-bar-item-v2";

export * from "./action-bar-item-v2";
export * from "./action-bar-item-dropdown";
export * from "./action-bar-separator";

interface IActionBarPropsV2 {
  model: ActionContainer<Action>;
  handleClick?: boolean;
}

export class SurveyActionBarV2 extends SurveyElementBase<IActionBarPropsV2, any> {
  //private model = new ActionBar();
  private manager: ResponsivityManager;
  private rootRef: React.RefObject<HTMLDivElement>;

  constructor(props: IActionBarPropsV2) {
    super(props);
    this.rootRef = React.createRef();
    //this.model.setItems(this.props.items);
  }

  private get handleClick() {
    return this.props.handleClick !== undefined ? this.props.handleClick : true;
  }

  get model() {
    return this.props.model;
  }

  componentDidMount() {
    super.componentDidMount();
    if (!this.hasItems) return;
    const container: HTMLDivElement = this.rootRef.current;
    this.manager = new ResponsivityManager(
      container,
      (this.model as any),
      "span.sv-action:not(.sv-dots)"
    );
  }
  componentWillUnmount() {
    this.manager && this.manager.dispose();
    super.componentWillUnmount();
  }
  /*componentDidUpdate(prevProps: any) {
    if(prevProps.items !== this.props.items){
      this.model.setItems(this.props.items);
    }
  }*/

  protected getStateElement(): Base {
    return this.model;
  }
  renderElement(): any {
    if (!this.hasItems) return null;
    const items = this.renderItems();
    return (
      <div
        ref={this.rootRef}
        className="sv-action-bar"
        onClick={this.handleClick ? function(event) {
          event.stopPropagation();
        } : undefined}
      >
        {items}
      </div>
    );
  }

  get hasItems(): boolean {
    return (this.model.actions || []).length > 0;
  }

  renderItems() {
    return this.model.actions.map(
      (item: Action, itemIndex: number) => {
        if (!item.visible && item.visible !== undefined) {
          return null;
        }
        return (
          <SurveyActionV2 item={item} key={"item" + itemIndex}></SurveyActionV2>
        );
      }
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-action-bar-v2", (props) => {
  return React.createElement(
    SurveyActionBarV2,
    (props as any) as IActionBarPropsV2
  );
});
