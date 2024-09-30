import * as React from "react";
import { SurveyModel } from "survey-core";

export class SurveyNavigationBase extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { update: 0 };
  }
  protected get survey(): SurveyModel {
    return this.props.survey;
  }
  protected get css(): any {
    return this.props.css || this.survey.css;
  }
  private updateStateFunction: any = null;
  componentDidMount() {
    if (this.survey) {
      var self = this;
      this.updateStateFunction = function () {
        self.setState({ update: self.state.update + 1 });
      };
      this.survey.onPageVisibleChanged.add(this.updateStateFunction);
    }
  }
  componentWillUnmount() {
    if (this.survey && this.updateStateFunction) {
      this.survey.onPageVisibleChanged.remove(this.updateStateFunction);
      this.updateStateFunction = null;
    }
  }
}
