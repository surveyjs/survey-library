/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="../../survey.ts" />
/// <reference path="../reactSurveyNavigation.tsx" />

class ReactSurveyNavigation extends ReactSurveyNavigationBase {
    constructor(props: any) {
        super(props);
    }
    protected get mainClassName() { return "sv_nav"; }
}