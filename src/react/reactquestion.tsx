/// <reference path="../survey.ts" />
/// <reference path="../question.ts" />
/// <reference path="../surveyStrings.ts" />
/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="reactQuestioncomment.tsx" />

module Survey {
    export interface IReactSurveyCreator {
        createQuestion(question: QuestionBase): JSX.Element;
        createQuestionElement(question: QuestionBase): JSX.Element;
    }
}

class ReactSurveyQuestionBase extends React.Component<any, any> {
    private questionBase: Survey.QuestionBase;
    protected question: Survey.Question;
    private creator: Survey.IReactSurveyCreator;
    constructor(props: any) {
        super(props);
        this.setQuestion(props.question);
        this.creator = props.creator;
    }
    componentWillReceiveProps(nextProps: any) {
        this.creator = nextProps.creator;
        this.setQuestion(nextProps.question);
    }
    private setQuestion(question) {
        this.questionBase = question;
        this.question = question instanceof Survey.Question ? question : null;
        if (this.question) {
            var self = this;
            this.question.errorsChangedCallback = function () {
                self.state.error = self.state.error + 1;
                self.setState(self.state);
            }
        }
        this.state = { visible: this.questionBase.visible, error: 0 };
    }
    render(): JSX.Element {
        if (!this.questionBase || !this.creator) return null;
        this.question["react"] = this; //TODO
        if (!this.questionBase.visible) return null;
        var className = "ReactSurveyQuestion" + this.questionBase.getType();
        var questionRender = this.creator.createQuestionElement(this.questionBase);
        var title = this.questionBase.hasTitle ? this.renderTitle() : null;
        var comment = (this.question && this.question.hasComment) ? this.renderComment() : null;
        var errors = (this.question && this.question.errors.length > 0) ? this.renderErrors() : null;
        return (
            <div className={this.mainClassName}>
                {title}
                {errors}
                {questionRender}
                {comment}
            </div>
        );
    }
    protected get mainClassName() { return "" };
    protected get titleClassName() { return "" };
    protected get errorClassName() { return "" };
    protected renderTitle(): JSX.Element {
        var titleText = "";
        if (this.question.visibleIndex > -1) {
            titleText = (this.question.visibleIndex + 1).toString() + ". ";
        }
        if (this.question.isRequired) {
            titleText += this.question.requiredText;
        }
        titleText += this.question.title
        return (<h5 className={this.titleClassName}>{titleText}</h5>);
    }
    protected renderComment(): JSX.Element {
        var otherText = Survey.surveyLocalization.getString("otherItemText");
        return (<div>
                <div>{otherText}</div>
                <ReactSurveyQuestionCommentItem  question={this.question} />
            </div>);
    }
    protected renderErrors(): JSX.Element {
        var errors = [];
        for (var i = 0; i < this.question.errors.length; i++) {
            var errorText = this.question.errors[i].getText();
            var key = "error" + i;
            errors.push(this.renderError(key, errorText));
        }
        return (<div className={this.errorClassName}>{errors}</div>);
    }
    protected renderError(key: string, errorText: string): JSX.Element {
        return <div key={key}>{errorText}</div>;
    }
}