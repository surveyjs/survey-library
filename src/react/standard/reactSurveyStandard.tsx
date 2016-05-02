/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="../../survey.ts" />
/// <reference path="reactSurveyProgressStandard.tsx" />
/// <reference path="reactSurveyNavigationStandard.tsx" />

class ReactSurvey extends ReactSurveyBase {
    constructor(props: any) {
        super(props);
    }
    public createQuestion(question: Survey.QuestionBase): JSX.Element {
        return <ReactSurveyQuestion key={question.name} question={question} creator={this} />;
    }
    protected get mainClassName(): string { return "sv_main"; }
    protected renderProgress(isTop: Boolean): JSX.Element {
        return <ReactSurveyProgress survey = {this.survey} isTop = {isTop} />;
    }
    protected renderNavigation(): JSX.Element {
        return <ReactSurveyNavigation survey = {this.survey}/>;
    }
}