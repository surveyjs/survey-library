/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="..//reactQuestion.tsx" />

class ReactSurveyQuestion extends ReactSurveyQuestionBase {
    constructor(props: any) {
        super(props);
    }
    protected get errorClassName() { return "alert alert-danger" };
    protected renderErrors(): JSX.Element {
        var errors = [];
        for (var i = 0; i < this.question.errors.length; i++) {
            var error = this.question.errors[i];
            var key = "error" + i;
            errors.push(<div  key={key}>
                <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                <span>error.getText()</span>
                </div>
            );
        }
        return (<div className={this.errorClassName}>{errors}</div>);
    }
}