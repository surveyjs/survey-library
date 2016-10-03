/// <reference path="../survey.ts" />
/// <reference path="../question.ts" />
/// <reference path="../surveyStrings.ts" />
/// <reference path="reactQuestioncomment.tsx" />

namespace Survey {
    export interface IReactSurveyCreator {
        createQuestionElement(question: QuestionBase): JSX.Element;
        renderError(key: string, errorText: string): JSX.Element;
        questionTitleLocation(): string;
    }
}

class ReactSurveyQuestion extends React.Component<any, any> {
    private questionBase: Survey.QuestionBase;
    protected question: Survey.Question;
    private creator: Survey.IReactSurveyCreator;
    protected css: any;
    constructor(props: any) {
        super(props);
        this.setQuestion(props.question);
        this.creator = props.creator;
        this.css = props.css;
    }
    componentWillReceiveProps(nextProps: any) {
        this.creator = nextProps.creator;
        this.css = nextProps.css;
        this.setQuestion(nextProps.question);
    }
    private setQuestion(question) {
        this.questionBase = question;
        this.question = question instanceof Survey.Question ? question : null;
        var value = this.question ? this.question.value : null;
        this.state = { visible: this.questionBase.visible, value: value, error: 0, renderWidth: 0 };
        var self = this;
        if (this.questionBase) {
            this.questionBase.renderWidthChangedCallback = function () {
                self.state.renderWidth = self.state.renderWidth + 1;
                self.setState(self.state);
            }
        }
    }
    render(): JSX.Element {
        if (!this.questionBase || !this.creator) return null;
        this.questionBase["react"] = this; //TODO
        if (!this.questionBase.visible) return null;
        var className = "ReactSurveyQuestion" + this.questionBase.getType();
        var questionRender = this.creator.createQuestionElement(this.questionBase);
        var title = this.questionBase.hasTitle ? this.renderTitle() : null;
        var titleTop = this.creator.questionTitleLocation() == "top" ? title : null;
        var titleBottom = this.creator.questionTitleLocation() == "bottom" ? title : null;
        var comment = (this.question && this.question.hasComment) ? this.renderComment() : null;
        var errors = this.renderErrors();
        var marginLeft = (this.questionBase.indent > 0) ? this.questionBase.indent * this.css.question.indent + "px" : null;
        var paddingRight = (this.questionBase.rightIndent > 0) ? this.questionBase.rightIndent * this.css.question.indent + "px" : null;
        var rootStyle = { display: 'inline-block', verticalAlign: 'top' };
        if (this.question.renderWidth) rootStyle["width"] = this.question.renderWidth;
        if (marginLeft) rootStyle["marginLeft"] = marginLeft;
        if (paddingRight) rootStyle["paddingRight"] = paddingRight;
        return (
            <div id={this.questionBase.id} className={this.css.question.root} style={rootStyle}>
                {titleTop}
                {errors}
                {questionRender}
                {comment}
                {titleBottom}
            </div>
        );
    }
    protected renderTitle(): JSX.Element {
        var titleText = this.question.fullTitle;
        return (<h5 className={this.css.question.title}>{titleText}</h5>);
    }
    protected renderComment(): JSX.Element {
        return (<div>
                <div>{this.question.commentText}</div>
                <div className={this.css.question.comment}>
                <ReactSurveyQuestionCommentItem  question={this.question}/>
                </div>
            </div>);
    }
    protected renderErrors(): JSX.Element {
        return <ReactSurveyQuestionErrors question={this.question} css={this.css} creator={this.creator} />
    }
}

class ReactSurveyQuestionErrors extends React.Component<any, any> {
    protected question: Survey.Question;
    private creator: Survey.IReactSurveyCreator;
    protected css: any;
    constructor(props: any) {
        super(props);
        this.setQuestion(props.question);
        this.creator = props.creator;
        this.css = props.css;
    }
    componentWillReceiveProps(nextProps: any) {
        this.setQuestion(nextProps.question);
        this.creator = nextProps.creator;
        this.css = nextProps.css;
    }
    private setQuestion(question) {
        this.question = question instanceof Survey.Question ? question : null;
        if (this.question) {
            var self = this;
            this.question.errorsChangedCallback = function () {
                self.state.error = self.state.error + 1;
                self.setState(self.state);
            }
        }
        this.state = { error: 0 };
    }
    render(): JSX.Element {
        if (!this.question || this.question.errors.length == 0) return null;
        var errors = [];
        for (var i = 0; i < this.question.errors.length; i++) {
            var errorText = this.question.errors[i].getText();
            var key = "error" + i;
            errors.push(this.creator.renderError(key, errorText));
        }
        return (<div className={this.css.error.root}>{errors}</div>);
    }
}