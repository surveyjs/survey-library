import * as React from "react";
import { createTOCListModel, getTocRootCss } from "survey-core";
import { SurveyNavigationBase } from "./reactSurveyNavigationBase";
import { ReactElementFactory } from "./element-factory";
import { List } from "./components/list/list";

export class SurveyProgressToc extends SurveyNavigationBase {
  render(): JSX.Element {
    const listModel = createTOCListModel(this.props.model);
    const rootCss = getTocRootCss(this.props.model);
    return (
      <div className={rootCss}>
        <List model={listModel} />
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-progress-toc", (props) => {
  return React.createElement(SurveyProgressToc, props);
});
