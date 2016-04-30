/// <reference path="../survey.ts" />
/// <reference path="../question_rating.ts" />
/// <reference path="../../typings/react/react.d.ts" />
class ReactSurveyQuestionrating extends React.Component<any, any> {
    private question: Survey.QuestionRatingModel;
    constructor(props: any) {
        super(props);
        this.question = props.question;
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    handleOnChange(event) {
        this.question.value = event.target.value;
        this.setState({ value: this.question.value });
    }
    componentWillReceiveProps(nextProps: any) {
        this.question = nextProps.question;
    }
    render(): JSX.Element {
        if (!this.question) return null;
        var headers = [];
        var values = [];
        for (var i = 0; i < this.question.visibleRateValues.length; i++) {
            var keyHeader = "header" + i;
            var keyValue = "value" + i;
            var item = this.question.visibleRateValues[i];
            headers.push(<th key={keyHeader}>{item.text}</th>);
            values.push(<td key={keyValue}>
                  <input type="radio" name={this.question.name} value={item.value} checked={this.question.value == item.value} onChange={this.handleOnChange} />
                </td>);
        }
        var comment = null;
        if (this.question.hasOther) {
            comment = <div><ReactSurveyQuestionCommentItem question={this.question}/></div>
        }
        return (
            <div>
                <table className="sv_q_rating">
                    <thead>
                        <tr>
                            <th></th>
                            {headers}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.question.mininumRateDescription}</td>
                            {values}
                            <td>{this.question.maximumRateDescription}</td>
                        </tr>
                    </tbody>
                </table>
                {comment}
            </div>
        );
    }
}