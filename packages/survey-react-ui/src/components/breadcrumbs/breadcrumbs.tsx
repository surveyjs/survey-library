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
  model: ActionContainer;
}

export class SurveyBreadcrumbs extends SurveyElementBase<IBreadcrumbsProps, any> {
  constructor(props: IBreadcrumbsProps) {
    super(props);
  }

  get model() {
    return this.props.model;
  }

  protected getStateElement(): Base {
    return this.model;
  }

  renderElement(): any {
    if (!this.model.hasActions) return null;
    const items = this.renderItems();
    return (
      <div>
        {items}
      </div>
    );
  }
  renderItems() {
    return this.model.actions.concat([]).map(
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
