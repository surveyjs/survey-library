import * as React from "react";
import QuestionDateModel from "../question_date";
import { ReactQuestionFactory } from "../../react/reactquestionfactory";

export default class SurveyQuestionDate extends React.Component<any, any> {
  private question: QuestionDateModel;
  protected css: any;
  constructor(props: any) {
    super(props);
    this.question = props.question;
    this.css = props.css;
    this.state = { value: this.question.value };
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  handleOnChange(event: any) {
    this.question.value = event.target.value;
    this.setState({ value: this.question.value });
  }
  componentWillReceiveProps(nextProps: any) {
    this.question = nextProps.question;
    this.css = nextProps.css;
  }
  componentDidMount() {
    var funcText = this.question.getjQueryScript(this.getDateId());
    var scriptText = "$(function () { " + funcText + " });";
    var rootId = this.getDivId();
    var scriptEl = document.createElement("script");
    scriptEl.type = "text/javascript";
    scriptEl.text = scriptText;
    document.getElementById(rootId).appendChild(scriptEl);
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
