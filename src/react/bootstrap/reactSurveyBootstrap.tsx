/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="../../survey.ts" />
/// <reference path="reactSurveyProgressBootstrap.tsx" />
/// <reference path="reactSurveyNavigationBootstrap.tsx" />

class ReactSurvey extends ReactSurveyBase {
    constructor(props: any) {
        super(props);
    }
    protected renderProgress(isTop: Boolean): JSX.Element {
        return <ReactSurveyProgress survey = {this.survey} isTop = {isTop} />;
    }
    protected renderNavgation(): JSX.Element {
        return <ReactSurveyNavigation survey = {this.survey}/>;
    }
    protected get titleClassName(): string { return "panel-heading"; }
    protected get emptySurveyClassName(): string { return "panel-body"; }

}