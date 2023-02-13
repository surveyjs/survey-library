import * as React from "react";
import { createTOCListModel } from "survey-core";
import { SurveyNavigationBase } from "./reactSurveyNavigationBase";
import { ReactElementFactory } from "./element-factory";
import { List } from "./components/list/list";

export class SurveyProgressToc extends SurveyNavigationBase {
  render(): JSX.Element {
    var listModel = createTOCListModel(this.props.model);
    return (
      <div className={this.props.containerCss}>
        <List model={listModel} />
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-progress-toc", (props) => {
  return React.createElement(SurveyProgressToc, props);
});
