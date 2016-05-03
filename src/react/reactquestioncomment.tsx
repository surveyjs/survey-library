/// <reference path="../survey.ts" />
/// <reference path="../question.ts" />
/// <reference path="../question_comment.ts" />
/// <reference path="../../typings/react/react.d.ts" />
class ReactSurveyQuestioncommentBase extends React.Component<any, any> {
    private question: Survey.QuestionCommentModel;
    constructor(props: any) {
        super(props);
        this.question = props.question;
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
            <textarea className={this.mainClassName} type="text" value={this.state.value} onChange={this.handleOnChange} cols={this.question.cols} rows={this.question.rows} />
        );
    }
    protected get mainClassName() { return ""; }
}

class ReactSurveyQuestionCommentItem extends React.Component<any, any> {
    private question: Survey.Question;
    constructor(props: any) {
        super(props);
        this.question = props.question;
        this.state = { value: this.question.comment };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    handleOnChange(event) {
        this.question.comment = event.target.value;
        this.setState({ value: this.question.comment });
    }
    componentWillReceiveProps(nextProps: any) {
        this.question = nextProps.question;
    }
    render(): JSX.Element {
        if (!this.question) return null;
        return (<input type="text" value={this.state.value} onChange={this.handleOnChange} />);
    }
}