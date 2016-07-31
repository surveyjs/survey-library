/// <reference path="../survey.ts" />
/// <reference path="../question_matrixdropdown.ts" />
/// <reference path="../../typings/react/react.d.ts" />
class ReactSurveyQuestionmatrixdropdown extends React.Component<any, any> {
    private question: Survey.QuestionMatrixDropdownModel;
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
            rows.push(<ReactSurveyQuestionmatrixdropdownRow key={key} row={row} css={this.css} rootCss={this.rootCss} creator={this.creator} />);
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

class ReactSurveyQuestionmatrixdropdownRow extends React.Component<any, any> {
    private row: Survey.MatrixDropdownRowModel;
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
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
        this.creator = nextProps.creator;
    }
    render(): JSX.Element {
        if (!this.row) return null;
        var tds = [];
        for (var i = 0; i < this.row.cells.length; i++) {
            var cell = this.row.cells[i];
            var errors = <ReactSurveyQuestionErrors question={cell.question} css={this.rootCss} creator={this.creator} />
            var select = this.renderSelect(cell);
            tds.push(<td key={"row" + i}>{errors}{select}</td>);
        }
        return (<tr><td>{this.row.text}</td>{tds}</tr>);
    }
    protected renderSelect(cell: Survey.MatrixDropdownCell): JSX.Element {
        return this.creator.createQuestionElement(cell.question);
    }
}