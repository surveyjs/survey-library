/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="..//reactQuestion.tsx" />

class ReactSurveyQuestion extends ReactSurveyQuestionBase {
    constructor(props: any) {
        super(props);
    }
    protected get errorClassName() { return "alert alert-danger" };
    protected renderError(key: string, errorText: string): JSX.Element {
        return <div  key={key}>
                <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                <span> {errorText}</span>
            </div>
    }

}