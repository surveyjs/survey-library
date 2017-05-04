import * as React from 'react';
import {SurveyElementBase, SurveyQuestionElementBase} from "./reactquestionelement";
import {QuestionCommentModel} from "../question_comment";
import {Question} from "../question";
import {ReactQuestionFactory} from "./reactquestionfactory";

export class SurveyQuestionComment extends SurveyQuestionElementBase {
    constructor(props: any) {
        super(props);
        this.state = { value: this.question.value || '' };
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
    }
    protected get question(): QuestionCommentModel { return this.questionBase as QuestionCommentModel; }
    componentWillReceiveProps(nextProps: any) {
        super.componentWillReceiveProps(nextProps);
        this.state = { value: this.question.value || '' };
    }
    handleOnChange(event) {
        this.setState({ value: event.target.value });
    }
    handleOnBlur(event) {
        this.question.value = event.target.value;
        this.setState({ value: this.question.value || '' });
    }
    render(): JSX.Element {
        if (!this.question) return null;
        if (this.isDisplayMode)
            return (<div id={this.question.inputId} className={this.css}>{this.question.value}</div>)
        return (
            <textarea id={this.question.inputId} className={this.css} type="text" value={this.state.value} placeholder={this.question.placeHolder} onBlur={this.handleOnBlur} onChange={this.handleOnChange} cols={this.question.cols} rows={this.question.rows} />
        );
    }
}

export class SurveyQuestionCommentItem extends SurveyElementBase {
    private question: Question;
    private comment: string;
    constructor(props: any) {
        super(props);
        this.question = props.question;
        this.comment = this.question.comment;
        this.state = { value: this.comment };
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
    }
    handleOnChange(event) {
        this.comment = event.target.value;
        this.setState({ value: this.comment });
    }
    handleOnBlur(event) {
        this.question.comment = this.comment;
    }
    componentWillReceiveProps(nextProps: any) {
        this.question = nextProps.question;
    }
    render(): JSX.Element {
        if (!this.question) return null;
        if (this.isDisplayMode)
            return (<div className={this.css.question.comment}>{this.comment}</div>);
        return (<input type="text" className={this.css.question.comment} value={this.state.value} onChange={this.handleOnChange} onBlur={this.handleOnBlur} />);
    }
}

ReactQuestionFactory.Instance.registerQuestion("comment", (props) => {
    return React.createElement(SurveyQuestionComment, props);
});
