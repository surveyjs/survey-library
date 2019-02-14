import * as React from "react";
import { SurveyModel } from "../survey";

export class SurveyTimerPanel extends React.Component<any, any> {
  protected survey: SurveyModel;

  constructor(props: any) {
    super(props);
    this.survey = props.survey;
  }
  update = () => {
    this.setState({ timeSpent: this.survey.timeSpent });
  }
  componentWillMount() {
    this.survey.onTimer.add(this.update);
  }
  componentWillUnmount() {
    this.survey.onTimer.remove(this.update);
  }
  componentWillReceiveProps(nextProps: any) {
    this.survey = nextProps.survey;
  }
  render(): JSX.Element {
    return <div>{this.survey.timerInfoText}</div>;
  }
}
