import * as React from 'react';
import {SurveyElementBase, SurveyQuestionElementBase} from "./reactquestionelement";
import {QuestionMatrixDynamicModel} from "../question_matrixdynamic";
import {ISurveyCreator, SurveyQuestionErrors} from "./reactquestion";
import {MatrixDynamicRowModel} from "../question_matrixdynamic";
import {MatrixDropdownCell} from "../question_matrixdropdownbase";
import {ReactQuestionFactory} from "./reactquestionfactory";
import {SurveyCustomWidget} from './custom-widget';

export class SurveyQuestionMatrixDynamic extends SurveyQuestionElementBase {
    constructor(props: any) {
        super(props);
        this.setProperties(props);
    }
    protected get question(): QuestionMatrixDynamicModel { return this.questionBase as QuestionMatrixDynamicModel; }
    componentWillReceiveProps(nextProps: any) {
        super.componentWillReceiveProps(nextProps);
        this.setProperties(nextProps);
    }
    private setProperties(nextProps: any) {
        var self = this;
        this.state = { rowCounter: 0 };
        this.question.rowCountChangedCallback = function () {
            self.state.rowCounter = self.state.rowCounter + 1;
            self.setState(self.state);
        };
        this.handleOnRowAddClick = this.handleOnRowAddClick.bind(this);
    }
    handleOnRowAddClick(event) {
        this.question.addRow();
    }
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
            rows.push(<SurveyQuestionMatrixDynamicRow key={i} row={row} question={this.question} index={i} css={this.css} rootCss={this.rootCss} isDisplayMode={this.isDisplayMode} creator={this.creator} />);
        }
        var divStyle = this.question.horizontalScroll ? { overflowX: 'scroll' } : {};
        var btnDeleteTD = !this.isDisplayMode ? <th></th> : null;
        return (
            <div>
                <div  style={divStyle}>
                    <table className={this.css.root}>
                        <thead>
                            <tr>
                                {headers}
                                {btnDeleteTD}
                             </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
                {this.renderAddRowButton() }
            </div>
        );
    }
    protected renderAddRowButton(): JSX.Element {
        if (this.isDisplayMode || !this.question.canAddRow) return null;
        return <input className={this.css.button} type="button" onClick={this.handleOnRowAddClick} value={this.question.addRowText} />;
    }
}

export class SurveyQuestionMatrixDynamicRow extends SurveyElementBase {
    private row: MatrixDynamicRowModel;
    private question: QuestionMatrixDynamicModel;
    private index: number;
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
        this.question = nextProps.question;
        this.index = nextProps.index;
        this.creator = nextProps.creator;
        this.handleOnRowRemoveClick = this.handleOnRowRemoveClick.bind(this);
    }
    handleOnRowRemoveClick(event) {
        this.question.removeRow(this.index);
    }
    render(): JSX.Element {
        if (!this.row) return null;
        var tds = [];
        for (var i = 0; i < this.row.cells.length; i++) {
            var cell = this.row.cells[i];
            var errors = <SurveyQuestionErrors question={cell.question} css={this.rootCss} creator={this.creator} />;
            var select = this.renderQuestion(cell);
            tds.push(<td key={"row" + i}>{errors}{select}</td>);
        }
        if (!this.isDisplayMode && this.question.canRemoveRow) {
            var removeButton = this.renderButton();
            tds.push(<td key={"row" + this.row.cells.length + 1}>{removeButton}</td>);
        }
        return (<tr>{tds}</tr>);
    }
    protected renderQuestion(cell: MatrixDropdownCell): JSX.Element {
        var customWidget = cell.question.customWidget;
        if (!customWidget) {
            return this.creator.createQuestionElement(cell.question);
        }
        return <SurveyCustomWidget creator={this.creator} question={cell.question}></SurveyCustomWidget>
    }
    protected renderButton(): JSX.Element {
        return <input className={this.css.button} type="button" onClick={this.handleOnRowRemoveClick} value={this.question.removeRowText} />;
    }
}

ReactQuestionFactory.Instance.registerQuestion("matrixdynamic", (props) => {
    return React.createElement(SurveyQuestionMatrixDynamic, props);
});
