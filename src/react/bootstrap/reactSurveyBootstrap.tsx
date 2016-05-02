/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="../../survey.ts" />
/// <reference path="reactSurveyProgressBootstrap.tsx" />
/// <reference path="reactSurveyNavigationBootstrap.tsx" />
/// <reference path="reactQuestionBootstrap.tsx" />

class ReactSurvey extends ReactSurveyBase {
    constructor(props: any) {
        super(props);
    }
    public createQuestion(question: Survey.QuestionBase): JSX.Element {
        return <ReactSurveyQuestion key={question.name} question={question} creator={this} />;
    }
    protected renderProgress(isTop: Boolean): JSX.Element {
        return <ReactSurveyProgress survey = {this.survey} isTop = {isTop} />;
    }
    protected renderNavigation(): JSX.Element {
        return <ReactSurveyNavigation survey = {this.survey}/>;
    }
    protected get titleClassName(): string { return "panel-heading"; }
    protected get mainPageClassName(): string { return "panel-body"; }
}