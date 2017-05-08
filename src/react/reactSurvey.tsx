import * as React from 'react';
import {ReactSurveyModel} from "./reactsurveymodel";
import {SurveyPage} from "./reactpage";
import {SurveyNavigation} from "./reactSurveyNavigation";
import {QuestionBase} from "../questionbase";
import {ISurveyCreator} from "./reactquestion";
import {ReactQuestionFactory} from "./reactquestionfactory";
import {surveyCss} from "../defaultCss/cssstandard";
import {SurveyProgress} from "./reactSurveyProgress";
import {SurveyPageId} from "../base";
import {SurveyElementBase} from "./reactquestionelement";

export class Survey extends React.Component<any, any> implements ISurveyCreator {
    public static get cssType(): string { return surveyCss.currentType; }
    public static set cssType(value: string) { surveyCss.currentType = value; }
    protected survey: ReactSurveyModel;
    private isCurrentPageChanged: boolean = false;
    constructor(props: any) {
        super(props);

        this.updateSurvey(props);
    }
    componentWillReceiveProps(nextProps: any) {
        this.updateSurvey(nextProps);
    }
    componentDidUpdate() {
        if (this.isCurrentPageChanged) {
            this.isCurrentPageChanged = false;
            if (this.survey.focusFirstQuestionAutomatic) {
                this.survey.focusFirstQuestion();
            }
        }
    }
    componentDidMount() {
        var el = this.refs["root"];
        if (el && this.survey) this.survey.doAfterRenderSurvey(el);
    }
    render(): JSX.Element {
        if (this.survey.state == "completed") return this.renderCompleted();
        if (this.survey.state == "loading") return this.renderLoading();
        return this.renderSurvey();
    }
    public get css(): any { return surveyCss.getCss(); }
    public set css(value: any) {
        this.survey.mergeCss(value, this.css);
    }
    protected renderCompleted(): JSX.Element {
        if(!this.survey.showCompletedPage) return null;
        var htmlValue = { __html: this.survey.processedCompletedHtml };
        return (<div dangerouslySetInnerHTML={htmlValue} />);
    }
    protected renderLoading(): JSX.Element {
        var htmlValue = { __html: this.survey.processedLoadingHtml };
        return (<div dangerouslySetInnerHTML={htmlValue} />);
    }
    protected renderSurvey(): JSX.Element {
        var title = this.survey.title && this.survey.showTitle ? this.renderTitle() : null;
        var currentPage = this.survey.currentPage ? this.renderPage() : null;
        var topProgress = this.survey.showProgressBar == "top" ? this.renderProgress(true) : null;
        var bottomProgress = this.survey.showProgressBar == "bottom" ? this.renderProgress(false) : null;
        var buttons = (currentPage && this.survey.showNavigationButtons) ? this.renderNavigation() : null;
        if (!currentPage) {
            currentPage = this.renderEmptySurvey();
        }
        return (
            <div ref="root" className={this.css.root}>
                {title}
                <div id={SurveyPageId} className={this.css.body}>
                    {topProgress}
                    {currentPage}
                    {bottomProgress}
                </div>
                {buttons}
            </div>
        );
    }
    protected renderTitle(): JSX.Element {
        var title = SurveyElementBase.renderLocString(this.survey.locTitle);
        return <div className={this.css.header}><h3>{title}</h3></div>;
    }
    protected renderPage(): JSX.Element {
        return <SurveyPage survey={this.survey} page={this.survey.currentPage} css={this.css} creator={this} />;
    }
    protected renderProgress(isTop: boolean): JSX.Element {
        return <SurveyProgress survey={this.survey} css={this.css} isTop={isTop}  />;
    }
    protected renderNavigation(): JSX.Element {
        return <SurveyNavigation survey = {this.survey} css={this.css}/>;
    }
    protected renderEmptySurvey(): JSX.Element {
        return (<span>{this.survey.emptySurveyText}</span>);
    }

    protected updateSurvey(newProps: any) {
        if (newProps) {
            if (newProps.model) {
                this.survey = newProps.model;
            } else {
                if (newProps.json) {
                    this.survey = new ReactSurveyModel(newProps.json);
                }
            }
        } else {
            this.survey = new ReactSurveyModel();
        }
        if (newProps) {
            if (newProps.clientId) this.survey.clientId = newProps.clientId;
            if (newProps.data) this.survey.data = newProps.data;
            if (newProps.css) this.survey.mergeCss(newProps.css, this.css);
        }

        //set the first page
        var dummy = this.survey.currentPage;

        this.state = { pageIndexChange: 0, isCompleted: false, modelChanged: 0 };
        this.setSurveyEvents(newProps);
    }
    protected setSurveyEvents(newProps: any) {
        var self = this;
        this.survey.renderCallback = function () {
            self.state.modelChanged = self.state.modelChanged + 1;
            self.setState(self.state);
        };
        this.survey.onComplete.add((sender) => { self.state.isCompleted = true; self.setState(self.state); });
        this.survey.onPartialSend.add((sender) => { self.setState(self.state); });
        this.survey.onCurrentPageChanged.add((sender, options) => {
            self.isCurrentPageChanged = true;
            self.state.pageIndexChange = self.state.pageIndexChange + 1;
            self.setState(self.state);
            if (newProps && newProps.onCurrentPageChanged) newProps.onCurrentPageChanged(sender, options);
        });
        this.survey.onVisibleChanged.add((sender, options) => {
            if (options.question && options.question.react) {
                var state = options.question.react.state;
                state.visible = options.question.visible;
                options.question.react.setState(state);
            }
        });
        this.survey.onValueChanged.add((sender, options) => {
            if (options.question && options.question.react) {
                var state = options.question.react.state;
                state.value = options.value;
                options.question.react.setState(state);
            }
        });
        if (!newProps) return;
        this.survey.onValueChanged.add((sender, options) => {
            if (newProps.data) newProps.data[options.name] = options.value;
            if (newProps.onValueChanged) newProps.onValueChanged(sender, options);
        });
        if (newProps.onComplete) {
            this.survey.onComplete.add((sender) => { newProps.onComplete(sender); });
        }
        if (newProps.onPartialSend) {
            this.survey.onPartialSend.add((sender) => { newProps.onPartialSend(sender); });
        }
        this.survey.onPageVisibleChanged.add((sender, options) => { if (newProps.onPageVisibleChanged) newProps.onPageVisibleChanged(sender, options); });
        if (newProps.onServerValidateQuestions) {
            this.survey.onServerValidateQuestions = newProps.onServerValidateQuestions;
        }
        if (newProps.onQuestionAdded) {
            this.survey.onQuestionAdded.add((sender, options) => { newProps.onQuestionAdded(sender, options); });
        }
        if (newProps.onQuestionRemoved) {
            this.survey.onQuestionRemoved.add((sender, options) => { newProps.onQuestionRemoved(sender, options); });
        }
        if (newProps.onValidateQuestion) {
            this.survey.onValidateQuestion.add((sender, options) => { newProps.onValidateQuestion(sender, options); });
        }
        if (newProps.onSendResult) {
            this.survey.onSendResult.add((sender, options) => { newProps.onSendResult(sender, options); });
        }
        if (newProps.onGetResult) {
            this.survey.onGetResult.add((sender, options) => { newProps.onGetResult(sender, options); });
        }
        if (newProps.onProcessHtml) {
            this.survey.onProcessHtml.add((sender, options) => { newProps.onProcessHtml(sender, options); });
        }
        if (newProps.onAfterRenderSurvey) {
            this.survey.onAfterRenderSurvey.add((sender, options) => { newProps.onAfterRenderSurvey(sender, options); });
        }
        if (newProps.onAfterRenderPage) {
            this.survey.onAfterRenderPage.add((sender, options) => { newProps.onAfterRenderPage(sender, options); });
        }
        if (newProps.onAfterRenderQuestion) {
            this.survey.onAfterRenderQuestion.add((sender, options) => { newProps.onAfterRenderQuestion(sender, options); });
        }
        if(newProps.onTextMarkdown) {
            this.survey.onTextMarkdown.add((sender, options) => { newProps.onTextMarkdown(sender, options); });
        }
    }

    //ISurveyCreator
    public createQuestionElement(question: QuestionBase): JSX.Element {
        var questionCss = this.css[question.getType()];
        return ReactQuestionFactory.Instance.createQuestion(question.getType(), {
            question: question, css: questionCss, rootCss: this.css, isDisplayMode: question.isReadOnly, creator: this
        });
    }
    public renderError(key: string, errorText: string): JSX.Element {
        return <div key={key} className={this.css.error.item}>{errorText}</div>;
    }
    public questionTitleLocation(): string { return this.survey.questionTitleLocation; }
}
