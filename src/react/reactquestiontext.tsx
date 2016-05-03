/// <reference path="../survey.ts" />
/// <reference path="../question_text.ts" />
/// <reference path="../../typings/react/react.d.ts" />
class ReactSurveyQuestiontextBase extends React.Component<any, any> {
    private question: Survey.QuestionTextModel;
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
            <input className={this.mainClassName} type="text" value={this.state.value} onChange={this.handleOnChange} />
        );
    }
    protected get mainClassName() { return ""; }
}