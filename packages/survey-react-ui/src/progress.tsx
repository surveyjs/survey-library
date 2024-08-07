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
  protected get progress(): number {
    return this.survey.progressValue;
  }
  protected get progressText(): string {
    return this.survey.progressText;
  }
  render(): JSX.Element {
    var progressStyle = {
      width: this.progress + "%",
    };
    return (
      <div className={this.survey.getProgressCssClasses(this.props.container)}>
        <div
          style={progressStyle}
          className={this.css.progressBar}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="progress"
        >
          <span
            className={SurveyProgressModel.getProgressTextInBarCss(this.css)}
          >
            {this.progressText}
          </span>
        </div>
        <span
          className={SurveyProgressModel.getProgressTextUnderBarCss(this.css)}
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
