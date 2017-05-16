import * as React from 'react';
import {SurveyElementBase, SurveyQuestionElementBase} from "./reactquestionelement";
import {QuestionMatrixDropdownModel} from "../question_matrixdropdown";
import {ISurveyCreator, SurveyQuestionErrors} from "./reactquestion";
import {MatrixDropdownRowModel} from "../question_matrixdropdown";
import {MatrixDropdownCell} from "../question_matrixdropdownbase";
import {ReactQuestionFactory} from "./reactquestionfactory";
import {SurveyCustomWidget} from './custom-widget';

export class SurveyQuestionMatrixDropdown extends SurveyQuestionElementBase {
    constructor(props: any) {
        super(props);
    }
    protected get question(): QuestionMatrixDropdownModel { return this.questionBase as QuestionMatrixDropdownModel; }
    render(): JSX.Element {
        if (!this.question) return null;
        var headers = [];
        for (var i = 0; i < this.question.columns.length; i++) {
            var column = this.question.columns[i];
            var key = "column" + i;
            var minWidth = this.question.getColumnWidth(column);
            var columnStyle = minWidth ? { minWidth: minWidth } : {};
            var columnTitle = this.renderLocString(column.locTitle);
            headers.push(<th key={key} style={columnStyle}>{columnTitle}</th>);
        }
        var rows = [];
        var visibleRows = this.question.visibleRows;
        for (var i = 0; i < visibleRows.length; i++) {
            var row = visibleRows[i];
            rows.push(<SurveyQuestionMatrixDropdownRow key={i} row={row} css={this.css} rootCss={this.rootCss} isDisplayMode={this.isDisplayMode} creator={this.creator} />);
        }
        var divStyle = this.question.horizontalScroll ? { overflowX: 'scroll'} : {};
        return (
            <div  style={divStyle}>
                <table className={this.css.root}>
                    <thead>
                        <tr>
                            <th></th>
                            {headers}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}

export class SurveyQuestionMatrixDropdownRow extends SurveyElementBase {
    private row: MatrixDropdownRowModel;
    protected creator: ISurveyCreator;
    constructor(props: any) {
        super(props);
        this.setProperties(props);
    }
    componentWillReceiveProps(nextProps: any) {
        super.componentWillReceiveProps(nextProps);
        this.setProperties(nextProps);
    }
    private setProperties(nextProps: any) {
        this.row = nextProps.row;
        this.creator = nextProps.creator;
    }
    render(): JSX.Element {
        if (!this.row) return null;
        var tds = [];
        for (var i = 0; i < this.row.cells.length; i++) {
            var cell = this.row.cells[i];
            var errors = <SurveyQuestionErrors question={cell.question} css={this.rootCss} creator={this.creator} />
            var select = this.renderSelect(cell);
            tds.push(<td key={"row" + i} className={this.css.itemValue}>{errors}{select}</td>);
        }
        var rowText = this.renderLocString(this.row.locText);
        return (<tr><td>{rowText}</td>{tds}</tr>);
    }
    protected renderSelect(cell: MatrixDropdownCell): JSX.Element {
        var customWidget = cell.question.customWidget;
        if (!customWidget) {
            return this.creator.createQuestionElement(cell.question);
        }
        return <SurveyCustomWidget creator={this.creator} question={cell.question}></SurveyCustomWidget>
    }
}

ReactQuestionFactory.Instance.registerQuestion("matrixdropdown", (props) => {
    return React.createElement(SurveyQuestionMatrixDropdown, props);
});
