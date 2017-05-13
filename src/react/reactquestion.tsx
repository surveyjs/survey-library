import * as React from 'react';
import {QuestionBase} from '../questionbase';
import {Question} from '../question';
import {SurveyQuestionCommentItem} from './reactquestioncomment';
import {SurveyElementBase} from './reactquestionelement';
import {SurveyCustomWidget} from './custom-widget';

export interface ISurveyCreator {
    createQuestionElement(question: QuestionBase): JSX.Element;
    renderError(key: string, errorText: string): JSX.Element;
    questionTitleLocation(): string;
}

export class SurveyQuestion extends React.Component<any, any> {
    private questionBase: QuestionBase;
    protected question: Question;
    private creator: ISurveyCreator;
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
        this.question = question instanceof Question ? question : null;
        var value = this.question ? this.question.value : null;
        this.state = {
            visible: this.questionBase.visible, value: value, error: 0, renderWidth: 0,
            visibleIndexValue: -1, isReadOnly : this.questionBase.isReadOnly
        };
    }
    componentDidMount() {
        if (this.questionBase) {
            var self = this;
            this.questionBase["react"] = self;
            this.questionBase.renderWidthChangedCallback = function () {
                self.state.renderWidth = self.state.renderWidth + 1;
                self.setState(self.state);
            }
            this.questionBase.visibleIndexChangedCallback = function() {
                self.state.visibleIndexValue = self.questionBase.visibleIndex;
                self.setState(self.state);
            }
            this.questionBase.readOnlyChangedCallback = function() {
                self.state.isReadOnly = self.questionBase.isReadOnly;
                self.setState(self.state);
            }
            var el = this.refs["root"];
            if (el && this.questionBase.survey) this.questionBase.survey.afterRenderQuestion(this.questionBase, el);
        }
    }
    componentWillUnmount() {
        var el = this.refs["root"];
        if (this.questionBase) {
            this.questionBase["react"] = null;
            this.questionBase.renderWidthChangedCallback = null;
            this.questionBase.visibleIndexChangedCallback = null;
            this.questionBase.readOnlyChangedCallback = null;
        }
    }
    render(): JSX.Element {
        if (!this.questionBase || !this.creator) return null;
        if (!this.questionBase.visible) return null;
        var questionRender = this.renderQuestion();
        var title = this.questionBase.hasTitle ? this.renderTitle() : null;
        var titleTop = this.creator.questionTitleLocation() == "top" ? title : null;
        var titleBottom = this.creator.questionTitleLocation() == "bottom" ? title : null;
        var comment = (this.question && this.question.hasComment) ? this.renderComment() : null;
        var errors = this.renderErrors();
        var paddingLeft = (this.questionBase.indent > 0) ? this.questionBase.indent * this.css.question.indent + "px" : null;
        var paddingRight = (this.questionBase.rightIndent > 0) ? this.questionBase.rightIndent * this.css.question.indent + "px" : null;
        var rootStyle = { display: 'inline-block', verticalAlign: 'top' };
        if (this.questionBase.renderWidth) rootStyle["width"] = this.questionBase.renderWidth;
        if (paddingLeft) rootStyle["paddingLeft"] = paddingLeft;
        if (paddingRight) rootStyle["paddingRight"] = paddingRight;
        return (
            <div ref="root" id={this.questionBase.id} className={this.css.question.root} style={rootStyle}>
                {titleTop}
                {errors}
                {questionRender}
                {comment}
                {titleBottom}
            </div>
        );
    }
    protected renderQuestion(): JSX.Element {
        var customWidget = this.questionBase.customWidget;
        if (!customWidget) {
            return this.creator.createQuestionElement(this.questionBase);
        }
        return <SurveyCustomWidget creator={this.creator} question={this.questionBase}></SurveyCustomWidget>
    }
    protected renderTitle(): JSX.Element {
        var titleText = SurveyElementBase.renderLocString(this.question.locTitle);
        return (<h5 className={this.css.question.title}>{titleText}</h5>);
    }
    protected renderComment(): JSX.Element {
        var commentText = SurveyElementBase.renderLocString(this.question.locCommentText);
        return (<div>
                <div>{commentText}</div>
                <SurveyQuestionCommentItem  question={this.question} css={this.css} />
            </div>);
    }
    protected renderErrors(): JSX.Element {
        return <SurveyQuestionErrors question={this.question} css={this.css} creator={this.creator} />
    }
}

export class SurveyQuestionErrors extends React.Component<any, any> {
    protected question: Question;
    private creator: ISurveyCreator;
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
        this.question = question instanceof Question ? question : null;
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
