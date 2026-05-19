import * as React from "react";
import { SurveyProgressModel } from "survey-core";
import { SurveyNavigationBase } from "./reactSurveyNavigationBase";
import { ReactElementFactory } from "./element-factory";

export class SurveyProgress extends SurveyNavigationBase {
  constructor(props: any) {
    super(props);
  }
  protected get isTop(): boolean {
    return this.props.isTop;
  }
  protected get model(): any {
    return this.props.model;
  }
  protected get progress(): number {
    return this.model.progressValue;
  }
  protected get progressText(): string {
    return this.model.progressText;
  }
  protected get progressBarAriaLabel(): string {
    return this.model.progressBarAriaLabel;
  }
  render(): React.JSX.Element {
    var progressStyle = {
      width: this.progress + "%",
    };
    return (
      <div className={this.model.getProgressCssClasses(this.props.container)}>
        <div
          style={progressStyle}
          className={this.model.css.progressBar}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={this.progressBarAriaLabel}
        >
          <span
            className={SurveyProgressModel.getProgressTextInBarCss(this.model.css)}
          >
            {this.progressText}
          </span>
        </div>
        <span
          className={SurveyProgressModel.getProgressTextUnderBarCss(this.model.css)}
        >
          {this.progressText}
        </span>
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-progress-pages", props => {
  return React.createElement(SurveyProgress, props);
});
ReactElementFactory.Instance.registerElement("sv-progress-questions", props => {
  return React.createElement(SurveyProgress, props);
});
ReactElementFactory.Instance.registerElement(
  "sv-progress-correctquestions",
  props => {
    return React.createElement(SurveyProgress, props);
  }
);
ReactElementFactory.Instance.registerElement(
  "sv-progress-requiredquestions",
  props => {
    return React.createElement(SurveyProgress, props);
  }
);
