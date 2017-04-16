import * as React from 'react';
import {SurveyQuestion} from './reactquestion'
import {PageModel} from "../page";
import {SurveyModel} from "../survey";
import {ISurveyCreator} from "./reactquestion";
import {QuestionRowModel, PanelModel} from "../panel";
import {QuestionBase} from "../questionbase";
import {SurveyElementBase} from "./reactquestionelement";

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
        var text = SurveyElementBase.renderLocString(this.page.locTitle);
        return (<h4 className={this.css.pageTitle}>{text}</h4>);
    }
}

export class SurveyPanel extends React.Component<any, any> {
    private panel: PanelModel;
    private survey: SurveyModel;
    private creator: ISurveyCreator;
    protected css: any;
    constructor(props: any) {
        super(props);
        this.panel = props.panel;
        this.survey = props.survey;
        this.creator = props.creator;
        this.css = props.css;
    }
    componentWillReceiveProps(nextProps: any) {
        this.panel = nextProps.panel;
        this.survey = nextProps.survey;
        this.creator = nextProps.creator;
        this.css = nextProps.css;
    }
    componentDidMount() {
        var el = this.refs["root"];
        if (el && this.survey) this.survey.afterRenderPage(el);
    }
    render(): JSX.Element {
        if (this.panel == null || this.survey == null || this.creator == null) return null;
        var title = this.renderTitle();
        var rows = [];
        var questionRows = this.panel.rows;
        for (var i = 0; i < questionRows.length; i++) {
            rows.push(this.createRow(questionRows[i], i));
        }
        var style = { "marginLeft": this.panel.innerIndent * this.css.question.indent + 'px' };
        return (
            <div ref="root">
                {title}
                <div style={style}>
                    {rows}
                </div>
            </div>
        );
    }
    protected createRow(row: QuestionRowModel, index: number): JSX.Element {
        var rowName = "row" + (index + 1);
        return <SurveyRow key={rowName} row={row} survey={this.survey} creator={this.creator} css={this.css} />;
    }
    protected renderTitle(): JSX.Element {
        if (!this.panel.title) return null;
        var text = SurveyElementBase.renderLocString(this.panel.locTitle);
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
            for (var i = 0; i < this.row.elements.length; i++) {
                let question = this.row.elements[i] as QuestionBase;
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
        if (question.isPanel) {
            return <SurveyPanel key={question.name} panel={question} creator={this.creator} survey={this.survey} css={this.css} />;
        } else {
            return <SurveyQuestion key={question.name} question={question} creator={this.creator} css={this.css} />;
        }
    }
}
