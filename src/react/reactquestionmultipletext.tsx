/// <reference path="../survey.ts" />
/// <reference path="../question_multipletext.ts" />
/// <reference path="../../typings/react/react.d.ts" />
class ReactSurveyQuestionmultipletextBase extends React.Component<any, any> {
    private question: Survey.QuestionMultipleTextModel;
    constructor(props: any) {
        super(props);
        this.question = props.question;
    }
    componentWillReceiveProps(nextProps: any) {
        this.question = nextProps.question;
    }
    render(): JSX.Element {
        if (!this.question) return null;
        var tableRows = this.question.getRows();
        var rows = [];
        for (var i = 0; i < tableRows.length; i++) {
            rows.push(this.renderRow("item" + i, tableRows[i]));
        }
        return (
            <table className={this.mainClassName}>
                <tbody>
                {rows}
                </tbody>
            </table>
        );
    }
    protected get mainClassName(): string { return ""; }
    protected renderRow(key: string, items: Array<Survey.MultipleTextItemModel>) {
        var tds = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            tds.push(<td key={"label" + i}>{item.title}</td>);
            tds.push(<td key={"value" + i}>{this.renderItem(item)}</td>);
        }
        return <tr key={key}>{tds}</tr>;
    }
    protected renderItem(item: Survey.MultipleTextItemModel): JSX.Element {
        return <ReactSurveyQuestionmultipletextItemBase item={item} />;
    }
}

class ReactSurveyQuestionmultipletextItemBase extends React.Component<any, any> {
    private item: Survey.MultipleTextItemModel;
    constructor(props: any) {
        super(props);
        this.item = props.item;
        this.state = { value: this.item.value };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    handleOnChange(event) {
        this.item.value = event.target.value;
        this.setState({ value: this.item.value });
    }
    componentWillReceiveProps(nextProps: any) {
        this.item = nextProps.item;
    }
    render(): JSX.Element {
        if (!this.item) return null;
        var style = { float: "left" };
        return (<input  className={this.mainClassName} style={style} type="text" value={this.state.value} onChange={this.handleOnChange} />);
    }
    protected get mainClassName(): string { return ""; }
}