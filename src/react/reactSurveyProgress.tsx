import * as React from "react";
import { SurveyModel } from "../survey";
import { SurveyNavigationBase } from "./reactSurveyNavigationBase";

export class SurveyProgress extends SurveyNavigationBase {
  constructor(props: any) {
    super(props);
  }
  protected get isTop(): boolean {
    return this.props.isTop;
  }
  protected get progress(): number {
    return this.survey.getProgress();
  }
  protected get progressText(): string {
    return this.survey.progressText;
  }
  render(): JSX.Element {
    var style = this.isTop ? {} : { marginTop: "1em" };
    var progressStyle = {
      width: this.progress + "%"
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
            className={
              this.css.progressText + " " + this.css.progressTextInBar
            }
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
