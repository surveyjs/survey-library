/// <reference path="../survey.ts" />
/// <reference path="../question_checkbox.ts" />
/// <reference path="../../typings/react/react.d.ts" />
class ReactSurveyQuestioncheckboxBase extends React.Component<any, any> {
    protected question: Survey.QuestionCheckboxModel;
    constructor(props: any) {
        super(props);
        this.question = props.question;
    }
    componentWillReceiveProps(nextProps: any) {
        this.question = nextProps.question;
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
    protected renderItem(key: string, item: any): JSX.Element {
        return <ReactSurveyQuestioncheckboxItemBase key={key} question={this.question} item={item} />;
    }
}
class ReactSurveyQuestioncheckboxItemBase extends React.Component<any, any> {
    protected question: Survey.QuestionCheckboxModel;
    protected item: Survey.ItemValue;
    constructor(props: any) {
        super(props);
        this.item = props.item;
        this.question = props.question;
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    componentWillReceiveProps(nextProps: any) {
        this.item = nextProps.item;
        this.question = nextProps.question;
    }
    handleOnChange(event) {
        var newValue = this.question.value;
        if (!newValue) {
            newValue = [];
        }
        var index = newValue.indexOf(this.item.value);
        if (event.target.checked) {
            if (index < 0) {
                newValue.push(this.item.value);
            }
        } else {
            if (index > -1) {
                newValue.splice(index, 1);
            }
        }
        this.question.value = newValue;
        this.setState({ value: this.question.value });
    }
    render(): JSX.Element {
        if (!this.item || !this.question) return null;
        var itemWidth = this.question.colCount > 0 ? (100 / this.question.colCount) + "%" : "100%";
        var marginRight = this.question.colCount == 0 ? "5px" : "0px";
        var divStyle = { width: itemWidth, marginRight: marginRight };
        var isChecked = this.question.value && this.question.value.indexOf(this.item.value) > -1;
        var otherItem = (this.item.value === this.question.otherItem.value && isChecked) ? this.renderOther() : null;
        return this.renderCheckbox(isChecked, divStyle, otherItem);
    }
    protected get mainClassName(): string { return ""; }
    protected get labelClassName(): string { return ""; }
    protected get commentClassName(): string { return ""; }
    protected get textStyle(): any { return null; }
    protected renderCheckbox(isChecked: boolean, divStyle: any, otherItem: JSX.Element): JSX.Element {
        return (<div className={this.mainClassName} style={divStyle}>
                <label className={this.labelClassName}>
                    <input type="checkbox"  checked={isChecked} onChange={this.handleOnChange} />
                    <span style={this.textStyle}>{this.item.text}</span>
                    </label>
                {otherItem}
            </div>);
    }
    protected renderOther(): JSX.Element {
        return (<div className={this.commentClassName}><ReactSurveyQuestionCommentItem  question={this.question} /></div>);
    }
}