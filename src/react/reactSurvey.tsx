/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../survey.ts" />
/// <reference path="reactsurveymodel.tsx" />
/// <reference path="reactPage.tsx" />
/// <reference path="reactQuestion.tsx" />
/// <reference path="reactSurveyNavigation.tsx" />

class ReactSurveyBase extends React.Component<any, any> implements Survey.IReactSurveyCreator {
    protected survey: ReactSurveyModel;
    protected css: any;
    constructor(props: any) {
        super(props);
        this.css = this.createCssObject();
        if (!this.css) throw "You should not return null for createCssObject() method.";
        this.updateSurvey(props);
    }
    componentWillReceiveProps(nextProps: any) {
        this.updateSurvey(nextProps);
    }
    render(): JSX.Element {
        if (this.survey.state == "completed") return this.renderCompleted();
        if (this.survey.state == "loading") return this.renderLoading();
        return this.renderSurvey();
    }
    protected createCssObject(): any { return null; }
    protected renderCompleted(): JSX.Element {
        var htmlValue = { __html: this.survey.processedCompletedHtml }
        return (<div dangerouslySetInnerHTML={htmlValue} />);
    }
    protected renderLoading(): JSX.Element {
        var htmlValue = { __html: this.survey.processedLoadingHtml }
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
            <div className={this.css.root}>
                {title}
                <div className={this.css.body}>
                    {topProgress}
                    {currentPage}
                    {bottomProgress}
                </div>
                {buttons}
            </div>
        );
    }
    protected renderTitle(): JSX.Element {
        return <div className={this.css.header}><h3>{this.survey.title}</h3></div>;
    }
    protected renderPage(): JSX.Element {
        return <ReactSurveyPage survey={this.survey} page={this.survey.currentPage} css={this.css} creator={this} />;
    }
    protected renderProgress(isTop: boolean): JSX.Element {
        return null;
    }
    protected renderNavigation(): JSX.Element {
        return <ReactSurveyNavigation survey = {this.survey} css={this.css}/>;
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
        this.survey.onCurrentPageChanged.add((sender, options) => {
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
        this.survey.onPageVisibleChanged.add((sender, options) => { if (newProps.onPageVisibleChanged) newProps.onPageVisibleChanged(sender, options); });
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
    }
    protected getReactQuestionClass(question: Survey.QuestionBase): any {
        var className = "ReactSurveyQuestion" + question.getType();
        return window[className];
    }
    //IReactSurveyCreator
    public createQuestionElement(question: Survey.QuestionBase): JSX.Element {
        var questionCss = this.css[question.getType()];
        return React.createElement(this.getReactQuestionClass(question), { question: question, css: questionCss, rootCss: this.css });
    }
    public renderError(key: string, errorText: string): JSX.Element {
        return <div key={key} className={this.css.error.item}>{errorText}</div>;
    }

}

