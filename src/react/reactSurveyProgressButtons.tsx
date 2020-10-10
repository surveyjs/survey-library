import * as React from "react";
import { SurveyNavigationBase } from "./reactSurveyNavigationBase";
import { ReactElementFactory } from "./element-factory";

export class SurveyProgressButtons extends SurveyNavigationBase {
  constructor(props: any) {
    super(props);
  }
  render(): JSX.Element {
    return (
      <div>Progress Buttons Navigations</div>
    );
  }
}

ReactElementFactory.Instance.registerElement("survey-progress-buttons", (props) => {
  return React.createElement(SurveyProgressButtons, props);
});