/// <reference path="../survey.ts" />
/// <reference path="../question_matrixdynamic.ts" />
/// <reference path="reactquestion.tsx" />
/// <reference path="../../typings/index.d.ts" />
class ReactSurveyQuestionmatrixdynamic extends React.Component<any, any> {
    private question: Survey.QuestionMatrixDynamicModel;
    protected css: any;
    protected rootCss: any;
    protected creator: Survey.IReactSurveyCreator;
    constructor(props: any) {
        super(props);
        this.setProperties(props);
    }
    componentWillReceiveProps(nextProps: any) {
        this.setProperties(nextProps);
    }
    private setProperties(nextProps: any) {
        this.question = nextProps.question;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
        this.creator = nextProps.creator;
        var self = this;
        this.state = { rowCounter: 0 };
        this.question.rowCountChangedCallback = function () {
            self.state.rowCounter = self.state.rowCounter + 1;
            self.setState(self.state);
        }
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
            headers.push(<th key={key} style={columnStyle}>{this.question.getColumnTitle(column) }</th>);
        }
        var rows = [];
        var visibleRows = this.question.visibleRows;
        for (var i = 0; i < visibleRows.length; i++) {
            var row = visibleRows[i];
            var key = "row" + i;
            rows.push(<ReactSurveyQuestionmatrixdynamicRow key={key} row={row} question={this.question} index={i} css={this.css} rootCss={this.rootCss} creator={this.creator} />);
        }
        var divStyle = this.question.horizontalScroll ? { overflowX: 'scroll' } : {};
        return (
            <div>
                <div  style={divStyle}>
                    <table className={this.css.root}>
                        <thead>
                            <tr>
                                {headers}
                                <th></th>
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
        return <input className={this.css.button} type="button" onClick={this.handleOnRowAddClick} value={this.question.addRowText} />;
    }
}

class ReactSurveyQuestionmatrixdynamicRow extends React.Component<any, any> {
    private row: Survey.MatrixDynamicRowModel;
    private question: Survey.QuestionMatrixDynamicModel;
    private index: number;
    protected css: any;
    protected rootCss: any;
    protected creator: Survey.IReactSurveyCreator;
    constructor(props: any) {
        super(props);
        this.setProperties(props);
    }
    componentWillReceiveProps(nextProps: any) {
        this.setProperties(nextProps);
    }
    private setProperties(nextProps: any) {
        this.row = nextProps.row;
        this.question = nextProps.question;
        this.index = nextProps.index;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
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
            var errors = <ReactSurveyQuestionErrors question={cell.question} css={this.rootCss} creator={this.creator} />
            var select = this.renderQuestion(cell);
            tds.push(<td key={"row" + i}>{errors}{select}</td>);
        }
        var removeButton = this.renderButton();
        tds.push(<td key={"row" + this.row.cells.length + 1}>{removeButton}</td>);
        return (<tr>{tds}</tr>);
    }
    protected renderQuestion(cell: Survey.MatrixDropdownCell): JSX.Element {
        return this.creator.createQuestionElement(cell.question);
    }
    protected renderButton(): JSX.Element {
        return <input className={this.css.button} type="button" onClick={this.handleOnRowRemoveClick} value={this.question.removeRowText} />;
    }
}