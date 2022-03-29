import * as React from "react";
import { SurveyActionBar } from "./components/action-bar/action-bar";
import { SurveyNavigationBase } from "./reactSurveyNavigationBase";

export class SurveyNavigation extends SurveyNavigationBase {
  constructor(props: any) {
    super(props);
  }
  render(): JSX.Element {
    if (!this.survey || this.survey.isNavigationButtonsShowing === "none")
      return null;
    return (
      <div className={this.css.footer}>
        <SurveyActionBar model={this.survey.navigationBar}></SurveyActionBar>
      </div>
    );
  }
}
