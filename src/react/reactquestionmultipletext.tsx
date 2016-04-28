/// <reference path="../survey.ts" />
/// <reference path="../question_multipletext.ts" />
/// <reference path="../../typings/react/react.d.ts" />
class ReactSurveyQuestionmultipletext extends React.Component<any, any> {
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
        var rows = [];
        for (var i = 0; i < this.question.items.length; i++) {
            var item = this.question.items[i];
            var key = "item" + i;
            rows.push(<ReactSurveyQuestionmultipletextItem key={key} item={item} />);
        }
        return (
            <table>
                <tbody>
                {rows}
                </tbody>
            </table>
        );
    }
}

class ReactSurveyQuestionmultipletextItem extends React.Component<any, any> {
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
        return (
            <tr>
                <td>{this.item.title}</td>
                <td><input type="text" value={this.state.value} onChange={this.handleOnChange} /></td>
            </tr>
            
        );
    }
}