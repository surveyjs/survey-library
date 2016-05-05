/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../survey.ts" />
/// <reference path="reactPage.tsx" />
/// <reference path="reactQuestion.tsx" />
/// <reference path="reactSurveyNavigation.tsx" />

class ReactSurveyBase extends React.Component<any, any> implements Survey.IReactSurveyCreator {
    protected survey: Survey.SurveyModel;
    constructor(props: any) {
        super(props);
        this.updateSurvey(props);
    }
    componentWillReceiveProps(nextProps: any) {
        this.updateSurvey(nextProps);
    }
    render(): JSX.Element {
        return this.renderSurvey();
    }
    protected get mainClassName(): string { return ""; }
    protected get mainPageClassName(): string { return ""; }
    protected get titleClassName(): string { return ""; }
    protected renderSurvey(): JSX.Element {
        var title = this.survey.title && this.survey.showTitle ? this.renderTitle() : null;
        var currentPage = this.survey.currentPage ? this.renderPage() : null;
        var topProgress = this.survey.showProgressBar == "top" ? this.renderProgress(true) : null;
        var bottomProgress = this.survey.showProgressBar == "bottom" ? this.renderProgress(false) : null;
        var buttons = (currentPage) ? this.renderNavigation() : null;
        if (!currentPage) {
            currentPage = this.renderEmptySurvey();
        }
        return (
            <div className={this.mainClassName}>
            {title}
            {topProgress}
            <div className={this.mainPageClassName}>
                {currentPage}
                </div>
            {bottomProgress}
            {buttons}
                </div>
        );
    }
    protected renderTitle(): JSX.Element {
        return <div className={this.titleClassName}><h3>{this.survey.title}</h3></div>;
    }
    protected renderPage(): JSX.Element {
        return <ReactSurveyPage survey={this.survey} page={this.survey.currentPage} creator={this} />;
    }
    protected renderProgress(isTop: boolean): JSX.Element {
        return null;
    }
    protected renderNavigation(): JSX.Element {
        return null;
    }
    protected renderEmptySurvey(): JSX.Element {
        return (<span>{this.survey.emptySurveyText}</span>);
    }

    protected updateSurvey(newProps: any) {
        if (newProps && newProps.json) {
            this.survey = new Survey.SurveyModel(newProps.json);
        } else {
            this.survey = new Survey.SurveyModel();
        }
        if (newProps && newProps.data) {
            this.survey.data = newProps.data;
        }
        this.state = { pageIndexChange: 0 };
        this.setSurveyEvents(newProps);
    }
    protected setSurveyEvents(newProps: any) {
        var self = this;
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
            if (newProps && newProps.onCurrentPageChanged) newProps.onCurrentPageChanged(sender, options);
        });
        if (!newProps) return;
        this.survey.onValueChanged.add((sender, options) => {
            if (newProps.data) newProps.data[options.name] = options.value;
            if (newProps.onValueChanged) newProps.onValueChanged(sender, options);
        });
        this.survey.onComplete.add((sender) => { if (newProps.onComplete) newProps.onComplete(sender); });
        this.survey.onPageVisibleChanged.add((sender, options) => { if (newProps.onPageVisibleChanged) newProps.onPageVisibleChanged(sender, options); });
        this.survey.onQuestionAdded.add((sender, options) => { if (newProps.onQuestionAdded) newProps.onQuestionAdded(sender, options); });
        this.survey.onQuestionRemoved.add((sender, options) => { if (newProps.onQuestionRemoved) newProps.onQuestionRemoved(sender, options); });
        this.survey.onValidateQuestion.add((sender, options) => { if (newProps.onValidateQuestion) newProps.onValidateQuestion(sender, options); });
        this.survey.onSendResult.add((sender, options) => { if (newProps.onSendResult) newProps.onSendResult(sender, options); });
        this.survey.onGetResult.add((sender, options) => { if (newProps.onGetResult) newProps.onGetResult(sender, options); });
        this.survey.onProcessHtml.add((sender, options) => { if (newProps.onProcessHtml) newProps.onProcessHtml(sender, options); });
    }
    //IReactSurveyCreator
    public createQuestion(question: Survey.QuestionBase): JSX.Element {
        return <ReactSurveyQuestionBase key={question.name} question={question} creator={this} />;
    }
    public createQuestionElement(question: Survey.QuestionBase): JSX.Element {
        var className = "ReactSurveyQuestion" + question.getType();
        return React.createElement(window[className], { question: question });
    }

}

