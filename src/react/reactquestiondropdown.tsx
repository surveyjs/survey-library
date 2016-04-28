/// <reference path="../survey.ts" />
/// <reference path="../question_dropdown.ts" />
/// <reference path="../../typings/react/react.d.ts" />
class ReactSurveyQuestiondropdown extends React.Component<any, any> {
    private question: Survey.QuestionDropdownModel;
    constructor(props: any) {
        super(props);
        this.question = props.question;
        this.state = { value: this.question.value };
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
        var options = [];
        for (var i = 0; i < this.question.visibleChoices.length; i++) {
            var item = this.question.visibleChoices[i];
            var key = "item" + i;
            var option = <option key={key} value={item.value}>{item.text}</option>;
            options.push(option);
        }
        var comment = null;
        if (this.question.value === this.question.otherItem.value) {
            comment = <div><ReactSurveyQuestionCommentItem question={this.question}/></div>
        }
        return (
            <div>
            <select value={this.state.value} onChange={this.handleOnChange}>
                {options}
            </select>
            {comment}
            </div>
        );
    }
}