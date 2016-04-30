/// <reference path="../survey.ts" />
/// <reference path="../question_radiogroup.ts" />
/// <reference path="../../typings/react/react.d.ts" />
class ReactSurveyQuestionradiogroup extends React.Component<any, any> {
    private question: Survey.QuestionRadiogroupModel;
    constructor(props: any) {
        super(props);
        this.question = props.question;
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    componentWillReceiveProps(nextProps: any) {
        this.question = nextProps.question;
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    handleOnChange(event) {
        this.question.value = event.target.value;
    }
    render(): JSX.Element {
        if (!this.question) return null;
        var items = [];
        for (var i = 0; i < this.question.visibleChoices.length; i++) {
            var item = this.question.visibleChoices[i];
            var key = "item" + i;
            items.push(this.renderItem(item, key));
        }
        return (
            <div>
            {items}
            </div>
        );
    }
    private renderItem(item: Survey.ItemValue, key: string): JSX.Element {
        var itemWidth = this.question.colCount > 0 ? (100 / this.question.colCount) + "%" : "100%";
        var divStyle = { width: itemWidth };
        var comment = null;
        if (this.question.value === this.question.otherItem.value) {
            comment = <div><ReactSurveyQuestionCommentItem question={this.question}/></div>
        }
        return (
            <div key={key} className="sv_qcbc" style={divStyle}>
                <label className="sv_q_radiogroup">
                    <input type="radio" name={this.question.name} value={item.value}  checked={this.question.value} onChange={this.handleOnChange} />
                    <span>{item.text}</span>
                    </label>
                {comment}
                </div>
        );
    }
}