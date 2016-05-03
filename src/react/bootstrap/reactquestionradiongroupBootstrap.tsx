/// <reference path="../reactquestionradiogroup.tsx" />
/// <reference path="../../question_radiogroup.ts" />
// <reference path="../../question_baseselect.ts" />
/// <reference path="../../../typings/react/react.d.ts" />
class ReactSurveyQuestionradiogroup extends ReactSurveyQuestionradiogroupBase {
    constructor(props: any) {
        super(props);
    }
    render(): JSX.Element {
        if (!this.question) return null;
        return (
            <div>
            {this.getItems() }
                </div>
        );
    }
    protected get mainClassName(): string { return "radio"; }
    protected get labelClassName(): string { return "radio"; }
}