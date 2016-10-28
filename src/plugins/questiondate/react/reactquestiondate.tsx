import * as React from 'react';
import QuestionDateModel from "../question_date";
import {ReactQuestionFactory} from "../../../react/reactquestionfactory";


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
    handleOnChange(event) {
        this.question.value = event.target.value;
        this.setState({ value: this.question.value });
    }
    componentWillReceiveProps(nextProps: any) {
        this.question = nextProps.question;
        this.css = nextProps.css;
    }
    componentDidMount() {
        var scriptText = "$(function () { $('#" + this.getDateId() + "').datepicker(); });";
        var rootId = this.getDivId();
        var scriptEl = document.createElement("script");
        scriptEl.type = "text\/javascript";
        scriptEl.text = scriptText;
        document.getElementById(rootId).appendChild(scriptEl);
    }
    render(): JSX.Element {
        if (!this.question) return null;
        var inputId = "date_" + this.question.name;
        return (
            <div id={this.getDivId()}>
                <input className={this.css} id={this.getDateId()} type="text" value={this.question.value || ''} onChange={this.handleOnChange} />
            </div>
        );
    }
    private getDateId(): string { return "date_" + this.question.name; }
    private getDivId(): string { return "rootDate_" + this.question.name; }
}

ReactQuestionFactory.Instance.registerQuestion("date", (props) => {
    return React.createElement(SurveyQuestionDate, props);
});