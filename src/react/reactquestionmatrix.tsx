import * as React from 'react';
import {SurveyElementBase, SurveyQuestionElementBase} from "./reactquestionelement";
import {QuestionMatrixModel} from "../question_matrix";
import {MatrixRowModel} from "../question_matrix";
import {ReactQuestionFactory} from "./reactquestionfactory";
import {ItemValue} from "../itemvalue";

export class SurveyQuestionMatrix extends SurveyQuestionElementBase {
    constructor(props: any) {
        super(props);
    }
    protected get question(): QuestionMatrixModel { return this.questionBase as QuestionMatrixModel; }
    render(): JSX.Element {
        if (!this.question) return null;
        var firstTH = this.question.hasRows ? <th></th> : null;
        var headers = [];
        for (var i = 0; i < this.question.columns.length; i++) {
            var column = this.question.columns[i];
            var key = "column" + i;
            var columText = this.renderLocString(column.locText);
            headers.push(<th key={key}>{columText}</th>);
        }
        var rows = [];
        var visibleRows = this.question.visibleRows;
        for (var i = 0; i < visibleRows.length; i++) {
            var row = visibleRows[i];
            var key = "row" + i;
            rows.push(<SurveyQuestionMatrixRow key={key} question={this.question} css={this.css} rootCss={this.rootCss} isDisplayMode={this.isDisplayMode} row={row} isFirst={i == 0} />);
        }
        return (
            <table className={this.css.root}>
                <thead>
                    <tr>
                        {firstTH}
                        {headers}
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
           </table>
        );
    }
}

export class SurveyQuestionMatrixRow extends SurveyElementBase {
    private question: QuestionMatrixModel;
    private row: MatrixRowModel;
    private isFirst: boolean;
    constructor(props: any) {
        super(props);
        this.question = props.question;
        this.row = props.row;
        this.isFirst = props.isFirst;
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    handleOnChange(event) {
        this.row.value = event.target.value;
        this.setState({ value: this.row.value });
    }
    componentWillReceiveProps(nextProps: any) {
        super.componentWillReceiveProps(nextProps);
        this.question = nextProps.question;
        this.row = nextProps.row;
        this.isFirst = nextProps.isFirst;
    }
    render(): JSX.Element {
        if (!this.row) return null;
        var firstTD = null;
        if(this.question.hasRows) {
            var rowText = this.renderLocString(this.row.locText);
             firstTD = <td>{rowText}</td>;
        }
        var tds = [];
        for (var i = 0; i < this.question.columns.length; i++) {
            var column = this.question.columns[i];
            var key = "value" + i;
            var isChecked = this.row.value == column.value;
            var inputId = this.isFirst && i == 0 ? this.question.inputId : null;
            var labelStyle = { margin: '0', position: 'absolute' };
            var td =
                <td key={key}>
                    <label className={this.css.label} style={labelStyle}>
                        <input id={inputId} type="radio" className={this.css.itemValue} name={this.row.fullName}
                               value={column.value} disabled={this.isDisplayMode} checked={isChecked}
                               onChange={this.handleOnChange}/>
                        <span className="circle"></span>
                        <span className="check"></span>
                    </label>
                </td>;
            tds.push(td);
        }
        return (<tr>{firstTD}{tds}</tr>);
    }
}

ReactQuestionFactory.Instance.registerQuestion("matrix", (props) => {
    return React.createElement(SurveyQuestionMatrix, props);
});
