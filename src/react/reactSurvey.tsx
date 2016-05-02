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
    protected get mainClassName(): string { return ""; }
    protected get mainPageClassName(): string { return ""; }
    protected get titleClassName(): string { return ""; }
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

    private updateSurvey(newProps: any) {
        if (newProps && newProps.json) {
            this.survey = new Survey.SurveyModel(newProps.json);
        } else {
            this.survey = new Survey.SurveyModel();
        }
        if (newProps && newProps.data) {
            this.survey.data = newProps.data;
        }
        //TODO
        this.survey.currentPage = this.survey.visiblePages.length > 0 ? this.survey.visiblePages[0] : null;
        var self = this;
        this.survey.onCurrentPageChanged.add((sender, options) => {
            self.changeState();
        });
        this.survey.onVisibleChanged.add((sender, options) => {
            if (options.question && options.question.react) {
                var state = options.question.react.state;
                state.visible = options.question.visible;
                options.question.react.setState(state);
            }
        });
        this.survey.onValueChanged.add((sender, options) => {
            if (!newProps) return;
            if (newProps.data) {
                newProps.data[options.name] = options.value;
            }
            if (newProps.onValueChanged) {
                newProps.onValueChanged(sender, options);
            }
        });
    }
    private changeState() {
        this.forceUpdate(); //probably change it later.
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

