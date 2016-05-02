/// <reference path="../reactquestioncheckbox.tsx" />
/// <reference path="../../question_checkbox.ts" />
/// <reference path="../../../typings/react/react.d.ts" />
class ReactSurveyQuestioncheckbox extends ReactSurveyQuestioncheckboxBase {
    constructor(props: any) {
        super(props);
    }
    render(): JSX.Element {
        if (!this.question) return null;
        return (
            <div>
            {this.getItems() }
            </div>);
    }
    protected renderItem(key: string, item: any): JSX.Element {
        return <ReactSurveyQuestioncheckboxItem key={key} question={this.question} item={item} />;
    }
}
class ReactSurveyQuestioncheckboxItem extends ReactSurveyQuestioncheckboxItemBase {
    constructor(props: any) {
        super(props);
    }
    protected get mainClassName(): string { return "sv_qcbc"; }
    protected get labelClassName(): string { return "sv_q_checkbox"; }
    protected get commentClassName(): string { return "sv_q_other"; }
}