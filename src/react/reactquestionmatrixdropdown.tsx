/// <reference path="../survey.ts" />
/// <reference path="../question_matrixdropdown.ts" />
/// <reference path="../../typings/react/react.d.ts" />
class ReactSurveyQuestionmatrixdropdownBase extends React.Component<any, any> {
    private question: Survey.QuestionMatrixDropdownModel;
    constructor(props: any) {
        super(props);
        this.question = props.question;
    }
    componentWillReceiveProps(nextProps: any) {
        this.question = nextProps.question;
    }
    render(): JSX.Element {
        if (!this.question) return null;
        var headers = [];
        for (var i = 0; i < this.question.columns.length; i++) {
            var column = this.question.columns[i];
            var key = "column" + i;
            headers.push(<th key={key}>{column.title}</th>);
        }
        var rows = [];
        var visibleRows = this.question.visibleRows;
        for (var i = 0; i < visibleRows.length; i++) {
            var row = visibleRows[i];
            var key = "row" + i;
            rows.push(<ReactSurveyQuestionmatrixdropdownRow key={key} row={row} />);
        }
        return (
            <table className={this.mainClassName}>
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
        );
    }
    protected get mainClassName() { return ""; }
}

class ReactSurveyQuestionmatrixdropdownRow extends React.Component<any, any> {
    private row: Survey.MatrixDropdownRowModel;
    constructor(props: any) {
        super(props);
        this.row = props.row;
    }
    componentWillReceiveProps(nextProps: any) {
        this.row = nextProps.row;
    }
    render(): JSX.Element {
        if (!this.row) return null;
        var tds = [];
        for (var i = 0; i < this.row.cells.length; i++) {
            var select = this.renderSelect(this.row.cells[i]);
            tds.push(<td key={"row" + i}>{select}</td>);
        }
        return (<tr><td>{this.row.text}</td>{tds}</tr>);
    }
    protected renderSelect(cell: Survey.MatrixDropdownCellModel): JSX.Element {
        return <ReactSurveyQuestionmatrixdropdownCell cell={cell} />
    }
}

class ReactSurveyQuestionmatrixdropdownCell extends React.Component<any, any> {
    private cell: Survey.MatrixDropdownCellModel;
    constructor(props: any) {
        super(props);
        this.cell = props.cell;
        this.state = { value: this.cell.value };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    handleOnChange(event) {
        this.cell.value = event.target.value;
        this.setState({ value: this.cell.value });
    }
    componentWillReceiveProps(nextProps: any) {
        this.cell = nextProps.cell;
        this.state = { value: this.cell.value };
    }
    render(): JSX.Element {
        if (!this.cell) return null;
        var options = this.getOptions();
        return (<select value={this.state.value} onChange={this.handleOnChange}>
              <option value="">{this.cell.optionsCaption}</option>
              {options}
            </select>);
    }
    protected getOptions(): Array<any> {
        var options = [];
        for (var i = 0; i < this.cell.choices.length; i++) {
            var item = this.cell.choices[i];
            var key = "op" + i;
            var option = <option key={key} value={item.value}>{item.text}</option>;
            options.push(option);
        }
        return options;
    }
}
