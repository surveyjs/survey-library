/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="..//reactQuestion.tsx" />

class ReactSurveyQuestion extends ReactSurveyQuestionBase {
    constructor(props: any) {
        super(props);
    }
    protected get mainClassName() { return "sv_q" };
    protected get titleClassName() { return "sv_q_title" };
    protected get errorClassName() { return "sv_q_erbox" };
}