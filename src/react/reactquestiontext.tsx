/// <reference path="../question_text.ts" />
class ReactSurveyQuestiontext extends React.Component<any, any> {
    private question: Survey.QuestionTextModel;
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
    render(): JSX.Element {
        if (!this.question) return null;
        return (
            <input className={this.css} type="text" value={this.question.value} onChange={this.handleOnChange} />
        );
    }
}