/// <reference path="../survey.ts" />
/// <reference path="../question_radiogroup.ts" />
// <reference path="../question_baseselect.ts" />
/// <reference path="../../typings/react/react.d.ts" />
class ReactSurveyQuestionradiogroupBase extends React.Component<any, any> {
    protected question: Survey.QuestionRadiogroupModel;
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
        this.setState({ value: this.question.value });
    }
    protected getItems(): Array<any> {
        var items = [];
        for (var i = 0; i < this.question.visibleChoices.length; i++) {
            var item = this.question.visibleChoices[i];
            var key = "item" + i;
            items.push(this.renderItem(key, item));
        }
        return items;
    }
    protected get mainClassName(): string { return ""; }
    protected get labelClassName(): string { return ""; }
    protected get commentClassName(): string { return ""; }
    protected get textStyle(): any { return null; }
    private renderItem(key: string, item: Survey.ItemValue): JSX.Element {
        var itemWidth = this.question.colCount > 0 ? (100 / this.question.colCount) + "%" : "100%";
        var marginRight = this.question.colCount == 0 ? "5px" : "0px";
        var divStyle = { width: itemWidth, marginRight: marginRight };
        var isChecked = this.question.value == item.value;
        var otherItem = (isChecked && item.value === this.question.otherItem.value) ? this.renderOther() : null;
        return this.renderRadio(item, isChecked, divStyle, otherItem);
    }
    protected renderRadio(item: Survey.ItemValue, isChecked: boolean, divStyle: any, otherItem: JSX.Element): JSX.Element {
        return (<div className={this.mainClassName} style={divStyle}>
                <label className={this.labelClassName}>
                    <input type="radio"  checked={isChecked} value={item.value} onChange={this.handleOnChange} />
                    <span style={this.textStyle}>{item.text}</span>
                    </label>
                {otherItem}
            </div>);
    }
    protected renderOther(): JSX.Element {
        return (<div className={this.commentClassName}><ReactSurveyQuestionCommentItem  question={this.question} /></div>);
    }
}