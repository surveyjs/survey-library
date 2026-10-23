import * as React from "react";
import { Action, ActionContainer, Base } from "survey-core";
import { ReactElementFactory } from "../element-factory";
import { SurveyElementBase } from "../reactquestion_element";

interface ISortBarLevelProps {
  item: Action;
}

// One level of the sort bar: an item of the bar that holds the level's own action bar (field, direction, remove).
export class SurveySortBarLevel extends SurveyElementBase<ISortBarLevelProps, any> {
  get item(): Action {
    return this.props.item;
  }
  protected getStateElement(): Base {
    return this.item;
  }
  protected renderElement(): React.JSX.Element | null {
    return ReactElementFactory.Instance.createElement("sv-action-bar", { model: this.item.data as ActionContainer });
  }
}

ReactElementFactory.Instance.registerElement("sv-sort-bar-level", (props) => {
  return React.createElement(SurveySortBarLevel, (props as any) as ISortBarLevelProps);
});
