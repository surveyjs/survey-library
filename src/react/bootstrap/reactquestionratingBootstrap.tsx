/// <reference path="../../survey.ts" />
/// <reference path="../../question_rating.ts" />
/// <reference path="../../../typings/react/react.d.ts" />
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
        var values = [];
        for (var i = 0; i < this.question.visibleRateValues.length; i++) {
            var minText = i == 0 ? this.question.mininumRateDescription + " " : null;
            var maxText = i == this.question.visibleRateValues.length - 1 ? " " + this.question.maximumRateDescription : null;
            values.push(this.renderItem("value" + i, this.question.visibleRateValues[i], minText, maxText));
        }
        var comment = this.question.hasOther ? this.renderOther() : null;
        return (
            <div className="btn-group" data-toggle="buttons">
                {values}
                {comment}
            </div>
        );
    }
    protected renderItem(key: string, item: Survey.ItemValue, minText: string, maxText: string): JSX.Element {
        var isChecked = this.question.value == item.value;
        var className = "btn btn-default";
        if (isChecked) className += " active";
        var min = minText ? <span>{minText}</span> : null;
        var max = maxText ? <span>{maxText}</span> : null;
        return <label key={key} className={className}>
            <input type="radio" name={this.question.name} value={item.value} checked={this.question.value == item.value} onChange={this.handleOnChange} />
            {min}
            <span>{item.text}</span>
            {max}
            </label>;
    }
    protected renderOther(): JSX.Element {
        return <div><ReactSurveyQuestionCommentItem question={this.question}/></div>;
    }
}