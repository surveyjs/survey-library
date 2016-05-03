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
            <form className={"form-inline"}>
            {this.getItems()}
            </form>);
    }
    protected renderItem(key: string, item: any): JSX.Element {
        return <ReactSurveyQuestioncheckboxItem key={key} question={this.question} item={item} />;
    }
}
class ReactSurveyQuestioncheckboxItem extends ReactSurveyQuestioncheckboxItemBase {
    constructor(props: any) {
        super(props);
    }
    protected get mainClassName(): string { return "checkbox"; }
    protected get labelClassName(): string { return "checkbox"; }
    protected get textStyle(): any { return { marginLeft: "3px" }; }
}