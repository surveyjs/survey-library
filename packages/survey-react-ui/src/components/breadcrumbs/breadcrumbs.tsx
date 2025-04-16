import * as React from "react";
import {
  Base,
  Action,
  ActionContainer
} from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SvgIcon } from "../svg-icon/svg-icon";
import { SurveyAction } from "../action-bar/action-bar-item";

interface IBreadcrumbsProps {
  model: ActionContainer;
  css: any;
}

export class SurveyBreadcrumbs extends SurveyElementBase<IBreadcrumbsProps, any> {
  constructor(props: IBreadcrumbsProps) {
    super(props);
  }
  protected getStateElement() {
    return this.props.model;
  }
  get items() {
    return this.props.model.actions;
  }

  get css() {
    return this.props.css;
  }

  renderElement(): any {
    if (!this.items || !this.items.length) return null;
    const items = this.renderItems();
    return (
      <div className={this.css.breadcrumbsRoot}>
        {items}
      </div>
    );
  }
  renderItems() {
    const result = [];
    this.items.concat([]).forEach(
      (item: Action, itemIndex: number) => {
        if (itemIndex) {
          result.push(<SvgIcon
            key={item.renderedId + "_separator"}
            className={this.css.breadcrumbsSeparator}
            iconName={"arrowright-16x16"}
            size={"auto"}
          ></SvgIcon >);
        }
        result.push(<SurveyAction key={item.renderedId} item={item}></SurveyAction>);
      }
    );
    return result;
  }
}

ReactElementFactory.Instance.registerElement("sv-breadcrumbs", (props) => {
  return React.createElement(
    SurveyBreadcrumbs,
    (props as any) as IBreadcrumbsProps
  );
});
