import * as React from "react";
import { SurveyModel } from "../survey";

export class SurveyTimerPanel extends React.Component<any, any> {
  protected survey: SurveyModel;
  protected css: any;
  constructor(props: any) {
    super(props);
    this.survey = props.survey;
    this.css = props.css;
    this.state = { timeSpent: 0 };
  }
  componentWillReceiveProps(nextProps: any) {
    this.survey = nextProps.survey;
    this.css = nextProps.css;
  }
  componentDidMount() {
    if (this.survey) {
      var self = this;
      this.survey.registerFunctionOnPropertyValueChanged(
        "timeSpent",
        function() {
          self.setState({ timeSpent: self.survey.timeSpent });
        },
        "timerPanel"
      );
    }
  }
  componentWillUnmount() {
    if (this.survey) {
      this.survey.unRegisterFunctionOnPropertyValueChanged(
        "timeSpent",
        "timerPanel"
      );
    }
  }
  render(): JSX.Element {
    if (!this.survey) return;
    return <div>{this.survey.timerInfoText}</div>;
  }
}
