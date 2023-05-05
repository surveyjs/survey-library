import * as React from "react";
import QuestionDateModel from "../question_date";
import { ReactQuestionFactory } from "../../react/reactquestionfactory";
import { settings } from "survey-core";

export default class SurveyQuestionDate extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { value: this.question.value };
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  private get question(): QuestionDateModel {
    return this.props.question;
  }
  protected get css(): any {
    return this.props.css;
  }

  handleOnChange(event: any) {
    this.question.value = event.target.value;
    this.setState({ value: this.question.value });
  }
  componentDidMount() {
    super.componentDidMount();
    var funcText = this.question.getjQueryScript(this.getDateId());
    var scriptText = "$(function () { " + funcText + " });";
    var rootId = this.getDivId();
    var scriptEl = document.createElement("script");
    scriptEl.type = "text/javascript";
    scriptEl.text = scriptText;
    settings.environment.root.getElementById(rootId).appendChild(scriptEl);
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var val = !this.question.isEmpty() ? this.question.value : "";
    return (
      <div id={this.getDivId()}>
        <input
          className={this.css}
          id={this.getDateId()}
          type="text"
          value={val}
          onChange={this.handleOnChange}
        />
      </div>
    );
  }
  private getDateId(): string {
    return "date_" + this.question.id;
  }
  private getDivId(): string {
    return "rootDate_" + this.question.id;
  }
}

//Tell json serializer to create exactly this class. Override it from the model that doesn't have any rendering functionality.
ReactQuestionFactory.Instance.registerQuestion("date", props => {
  return React.createElement(SurveyQuestionDate, props);
});
