/// <reference path="../survey.ts" />
/// <reference path="../question.ts" />
/// <reference path="../question_html.ts" />
/// <reference path="../../typings/index.d.ts" />
class ReactSurveyQuestionhtml extends React.Component<any, any> {
    private question: Survey.QuestionHtmlModel;
    constructor(props: any) {
        super(props);
        this.question = props.question;
    }
    componentWillReceiveProps(nextProps: any) {
        this.question = nextProps.question;
    }
    render(): JSX.Element {
        if (!this.question || !this.question.html) return null;
        var htmlValue = { __html: this.question.processedHtml }
        return (<div dangerouslySetInnerHTML={htmlValue} /> );
    }
}
