import * as React from "react";
import { ListModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";

interface IListLoadingProps {
  model: ListModel;
}

export class ListLoading extends SurveyElementBase<IListLoadingProps, any> {
  get model(): ListModel {
    return this.props.model;
  }
  getStateElement() {
    return this.model;
  }
  render(): React.JSX.Element {
    const loadingText = this.model.getLocalizationString("loadingData");
    return (
      <div className={this.model.cssClasses.emptyContainer}>
        <div className={this.model.cssClasses.emptyText} aria-label={loadingText}>{loadingText}</div>
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-list-loading", (props) => {
  return React.createElement(ListLoading, props);
});
