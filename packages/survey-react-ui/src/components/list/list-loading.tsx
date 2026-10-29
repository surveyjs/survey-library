import * as React from "react";
import { ListModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { LoadingIndicatorComponent } from "../loading-indicator";

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
    return (
      <div className={this.model.cssClasses.emptyContainer} role="status" aria-label={this.model.getLocalizationString("loadingData")}>
        <LoadingIndicatorComponent />
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-list-loading", (props) => {
  return React.createElement(ListLoading, props);
});
