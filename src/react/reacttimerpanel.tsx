import * as React from "react";
import { SurveyModel } from "survey-core";

export class SurveyTimerPanel extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  protected get survey(): SurveyModel {
    return this.props.survey;
  }
  update = () => {
    this.setState({ timeSpent: this.survey.timeSpent });
  };
  componentDidMount() {
    this.survey.onTimer.add(this.update);
  }
  componentWillUnmount() {
    this.survey.onTimer.remove(this.update);
  }
  render(): JSX.Element {
    return <div>{this.survey.timerInfoText}</div>;
  }
}
