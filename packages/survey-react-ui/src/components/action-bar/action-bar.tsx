import * as React from "react";
import {
  Base,
  Action,
  ActionContainer
} from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SurveyAction } from "./action-bar-item";

export * from "./action-bar-item-dropdown";
export * from "./action-bar-separator";

interface IActionBarProps {
  model: ActionContainer<Action>;
  handleClick?: boolean;
}

export class SurveyActionBar extends SurveyElementBase<IActionBarProps, any> {
  private rootRef: React.RefObject<HTMLDivElement>;

  constructor(props: IActionBarProps) {
    super(props);
    this.rootRef = React.createRef();
  }

  private get handleClick() {
    return this.props.handleClick !== undefined ? this.props.handleClick : true;
  }

  get model() {
    return this.props.model;
  }

  componentDidMount() {
    super.componentDidMount();
    if (!this.model.hasActions) return;
    const container: HTMLDivElement | null = this.rootRef.current;
    if (!!container) {
      this.model.initResponsivityManager(container, (callback) => { setTimeout(callback, 100); });
    }
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    this.model.resetResponsivityManager();
  }
  componentDidUpdate(prevProps: IActionBarProps, prevState: any): void {
    super.componentDidUpdate(prevProps, prevState);
    if (prevProps.model != this.props.model) {
      prevProps.model.resetResponsivityManager();
    }
    if (!!this.model.hasActions) {
      const container: HTMLDivElement | null = this.rootRef.current;
      if (!!container) {
        this.model.initResponsivityManager(container, (callback) => { setTimeout(callback, 100); });
      }
    }
  }

  protected getStateElement(): Base {
    return this.model;
  }

  renderElement(): any {
    if (!this.model.hasActions) return null;
    const items = this.renderItems();
    return (
      <div
        ref={this.rootRef}
        className={this.model.getRootCss()}
        onClick={this.handleClick ? function (event) {
          event.stopPropagation();
        } : undefined}
      >
        {items}
      </div>
    );
  }
  renderItems() {
    return this.model.renderedActions.concat([]).map(
      (item: Action, itemIndex: number) => {
        return (
          <SurveyAction item={item} key={item.renderedId}></SurveyAction>
        );
      }
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-action-bar", (props) => {
  return React.createElement(
    SurveyActionBar,
    (props as any) as IActionBarProps
  );
});
