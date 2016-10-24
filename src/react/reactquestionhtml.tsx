import * as React from 'react';
import QuestionHtmlModel from "../question_html";
import ReactQuestionFactory from "./reactquestionfactory";

export default class SurveyQuestionHtml extends React.Component<any, any> {
    private question: QuestionHtmlModel;
    constructor(props: any) {
        super(props);
        this.question = props.question;
    }
    componentWillReceiveProps(nextProps: any) {
        this.question = nextProps.question;
    }
    render(): JSX.Element {
        if (!this.question || !this.question.html) return null;
        var htmlValue = { __html: this.question.processedHtml };
        return (<div dangerouslySetInnerHTML={htmlValue} /> );
    }
}

ReactQuestionFactory.Instance.registerQuestion("html", (props) => {
    return React.createElement(SurveyQuestionHtml, props);
});
