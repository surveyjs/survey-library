import * as React from "react";
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
    var style = this.isTop ? {} : { marginTop: "1em" };
    var progressStyle = {
      width: this.progress + "%",
    };
    return (
      <div className={this.css.progress} style={style}>
        <div
          style={progressStyle}
          className={this.css.progressBar}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span
            className={this.css.progressText + " " + this.css.progressTextInBar}
          >
            {this.progressText}
          </span>
        </div>
        <span
          className={
            this.css.progressText + " " + this.css.progressTextUnderBar
          }
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
  "sv-progress-correctQuestions",
  props => {
    return React.createElement(SurveyProgress, props);
  }
);
ReactElementFactory.Instance.registerElement(
  "sv-progress-requiredQuestions",
  props => {
    return React.createElement(SurveyProgress, props);
  }
);
