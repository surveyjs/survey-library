/// <reference path="../../question_multipletext.ts" />
/// <reference path="../reactquestionmultipletext.tsx" />
/// <reference path="../../../typings/react/react.d.ts" />
class ReactSurveyQuestionmultipletext extends ReactSurveyQuestionmultipletextBase {
    constructor(props: any) {
        super(props);
    }
    protected get mainClassName(): string { return "table"; }
    protected renderItem(item: Survey.MultipleTextItemModel): JSX.Element {
        return <ReactSurveyQuestionmultipletextItem item={item} />;
    }
}

class ReactSurveyQuestionmultipletextItem extends ReactSurveyQuestionmultipletextItemBase {
    constructor(props: any) {
        super(props);
    }
    protected get mainClassName(): string { return "form-control"; }
}