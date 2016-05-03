/// <reference path="../reactquestionmatrix.tsx" />
/// <reference path="../../../typings/react/react.d.ts" />
class ReactSurveyQuestionmatrix extends ReactSurveyQuestionmatrixBase {
    constructor(props: any) {
        super(props);
    }
    protected get mainClassName() { return "sv_q_matrix"; }
}