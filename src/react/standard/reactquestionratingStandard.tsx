/// <reference path="../../survey.ts" />
/// <reference path="../../question_rating.ts" />
/// <reference path="../../../typings/react/react.d.ts" />
class ReactSurveyQuestionrating extends React.Component<any, any> {
    private question: Survey.QuestionRatingModel;
    protected css: any;
    protected rootCss: any;
    constructor(props: any) {
        super(props);
        this.question = props.question;
        this.css = props.css;
        this.rootCss = props.rootCss;
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    handleOnChange(event) {
        this.question.value = event.target.value;
        this.setState({ value: this.question.value });
    }
    componentWillReceiveProps(nextProps: any) {
        this.question = nextProps.question;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
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
        var comment = this.question.hasOther ? this.renderOther() : null;
        return (
            <div>
                <table className={this.css.root}>
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
    protected renderOther(): JSX.Element {
        return (<div className={this.css.other}><ReactSurveyQuestionCommentItem  question={this.question} css={this.rootCss} /></div>);
    }
}