import * as React from "react";
import { SurveyTimerModel } from "survey-core";

export class SurveyTimerPanel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  protected get survey(): SurveyTimerModel {
    return this.props.timerModel;
  }
  render(): JSX.Element {
    return <div>{this.survey.text}</div>;
  }
}
