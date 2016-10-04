import * as React from 'react';
import QuestionCommentModel from "../question_comment";
import Question from "../question";

export default class ReactSurveyQuestioncomment extends React.Component<any, any> {
    private question: QuestionCommentModel;
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
    }
    render(): JSX.Element {
        if (!this.question) return null;
        return (
            <textarea className={this.css} type="text" value={this.state.value} onChange={this.handleOnChange} cols={this.question.cols} rows={this.question.rows} />
        );
    }
}

export class ReactSurveyQuestionCommentItem extends React.Component<any, any> {
    private question: Question;
    private comment: string;
    protected css: any;
    constructor(props: any) {
        super(props);
        this.question = props.question;
        this.css = props.css;
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
        return (<input type="text" className={this.css.question.comment} value={this.state.value} onChange={this.handleOnChange} onBlur={this.handleOnBlur} />);
    }
}