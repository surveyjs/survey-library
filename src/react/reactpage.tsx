import * as React from 'react';
import {SurveyQuestion} from './reactquestion'
import {PageModel} from "../page";
import {SurveyModel} from "../survey";
import {ISurveyCreator} from "./reactquestion";
import {QuestionRowModel} from "../page";
import {QuestionBase} from "../questionbase";

export class SurveyPage extends React.Component<any, any> {
    private page: PageModel;
    private survey: SurveyModel;
    private creator: ISurveyCreator;
    protected css: any;
    constructor(props: any) {
        super(props);
        this.page = props.page;
        this.survey = props.survey;
        this.creator = props.creator;
        this.css = props.css;
    }
    componentWillReceiveProps(nextProps: any) {
        this.page = nextProps.page;
        this.survey = nextProps.survey;
        this.creator = nextProps.creator;
        this.css = nextProps.css;
    }
    componentDidMount() {
        var el = this.refs["root"];
        if (el && this.survey) this.survey.afterRenderPage(el);
    }
    render(): JSX.Element {
        if (this.page == null || this.survey == null || this.creator == null) return null;
        var title = this.renderTitle();
        var rows = [];
        var questionRows = this.page.rows;
        for (var i = 0; i < questionRows.length; i++) {
            rows.push(this.createRow(questionRows[i], i));
        }
        return (
            <div ref="root">
                {title}
                {rows}
                </div>
        );
    }
    protected createRow(row: QuestionRowModel, index: number): JSX.Element {
        var rowName = "row" + (index + 1);
        return <SurveyRow key={rowName} row={row} survey={this.survey} creator={this.creator} css={this.css} />;
    }
    protected renderTitle(): JSX.Element {
        if (!this.page.title || !this.survey.showPageTitles) return null;
        var text = this.page.processedTitle;
        if (this.page.num > 0) {
            text = this.page.num + ". " + text;
        }
        return (<h4 className={this.css.pageTitle}>{text}</h4>);
    }
}

export class SurveyRow extends React.Component<any, any> {
    private row: QuestionRowModel;
    private survey: SurveyModel;
    private creator: ISurveyCreator;
    protected css: any;
    constructor(props: any) {
        super(props);
        this.setProperties(props);
    }
    componentWillReceiveProps(nextProps: any) {
        this.setProperties(nextProps);
    }
    private setProperties(props: any) {
        this.row = props.row;
        if (this.row) {
            var self = this;
            this.row.visibilityChangedCallback = function () { self.setState({ visible: self.row.visible }); }
        }
        this.survey = props.survey;
        this.creator = props.creator;
        this.css = props.css;
    }
    render(): JSX.Element {
        if (this.row == null || this.survey == null || this.creator == null) return null;
        var questions = null;
        if (this.row.visible) {
            questions = [];
            for (var i = 0; i < this.row.questions.length; i++) {
                var question = this.row.questions[i];
                questions.push(this.createQuestion(question));
            }
        }
        var style = this.row.visible ?  {} : { display: "none" };
        return (
            <div className={this.css.row} style={style}>
                {questions}
            </div>
        );
    }
    protected createQuestion(question: QuestionBase): JSX.Element {
        return <SurveyQuestion key={question.name} question={question} creator={this.creator} css={this.css} />;
    }
}