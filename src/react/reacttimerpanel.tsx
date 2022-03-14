import * as React from "react";
import { Base, SurveyTimerModel } from "survey-core";
import { ReactSurveyElement } from "./reactquestion_element";

export class SurveyTimerPanel extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
  }
  protected getStateElement(): Base {
    return this.timerModel;
  }
  protected get timerModel(): SurveyTimerModel {
    return this.props.timerModel;
  }
  render(): JSX.Element {
    return <div className={this.timerModel.survey.getCss().timerRoot}>{this.timerModel.text}</div>;
  }
}
