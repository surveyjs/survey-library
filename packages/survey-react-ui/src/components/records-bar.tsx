import * as React from "react";
import { Base, QuestionRecordsBar } from "survey-core";
import { ReactElementFactory } from "../element-factory";
import { SurveyElementBase } from "../reactquestion_element";

interface IRecordsBarProps {
  model: QuestionRecordsBar;
}

// The bar under the records of a dynamic panel and a dynamic matrix: the pager, and the sort menu under it.
export class SurveyRecordsBar extends SurveyElementBase<IRecordsBarProps, any> {
  get model(): QuestionRecordsBar {
    return this.props.model;
  }
  protected getStateElement(): Base {
    return this.model;
  }
  protected renderElement(): React.JSX.Element | null {
    if (!this.model.isVisible) return null;
    const css = this.model.cssClasses;
    return <div className={css.root}>
      {this.model.showPager ? <div className={css.pager}>
        {ReactElementFactory.Instance.createElement("sv-action-bar", { model: this.model.pagerActions })}
      </div> : null}
      {this.model.showViewActions ? <div className={css.viewActions}>
        {ReactElementFactory.Instance.createElement("sv-action-bar", { model: this.model.viewActions })}
      </div> : null}
    </div>;
  }
}

ReactElementFactory.Instance.registerElement("sv-records-bar", (props) => {
  return React.createElement(SurveyRecordsBar, (props as any) as IRecordsBarProps);
});
