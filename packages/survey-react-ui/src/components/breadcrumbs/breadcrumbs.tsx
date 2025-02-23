import * as React from "react";
import {
  Base,
  Action,
  ActionContainer
} from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SurveyBreadcrumbsItem } from "./breadcrumbs-item";

interface IBreadcrumbsProps {
  items: Action[];
}

export class SurveyBreadcrumbs extends SurveyElementBase<IBreadcrumbsProps, any> {
  constructor(props: IBreadcrumbsProps) {
    super(props);
  }

  get items() {
    return this.props.items;
  }

  renderElement(): any {
    if (!this.items || !this.items.length) return null;
    const items = this.renderItems();
    return (
      <div>
        {items}
      </div>
    );
  }
  renderItems() {
    return this.items.concat([]).map(
      (item: Action, itemIndex: number) => {
        return (
          <SurveyBreadcrumbsItem item={item} key={item.renderedId}></SurveyBreadcrumbsItem>
        );
      }
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-breadcrumbs", (props) => {
  return React.createElement(
    SurveyBreadcrumbs,
    (props as any) as IBreadcrumbsProps
  );
});
