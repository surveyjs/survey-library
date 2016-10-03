/// <reference path="../survey.ts" />
/// <reference path="../question_checkbox.ts" />
class ReactSurveyQuestioncheckbox extends React.Component<any, any> {
    protected question: Survey.QuestionCheckboxModel;
    protected css: any;
    protected rootCss: any;
    constructor(props: any) {
        super(props);
        this.question = props.question;
        this.css = props.css;
        this.rootCss = props.rootCss;
        this.state = { choicesChanged: 0 };
        var self = this;
        this.question.choicesChangedCallback = function () {
            self.state.choicesChanged = self.state.choicesChanged + 1;
            self.setState(self.state);
        }
    }
    componentWillReceiveProps(nextProps: any) {
        this.question = nextProps.question;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
    }
    render(): JSX.Element {
        if (!this.question) return null;
        return (
            <form className={this.css.root}>
            {this.getItems() }
                </form>);
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
    protected get textStyle(): any { return null; }
    protected renderItem(key: string, item: any): JSX.Element {
        return <ReactSurveyQuestioncheckboxItem key={key} question={this.question} css={this.css} rootCss={this.rootCss} item={item} textStyle={this.textStyle} />;
    }
}
class ReactSurveyQuestioncheckboxItem extends React.Component<any, any> {
    protected question: Survey.QuestionCheckboxModel;
    protected item: Survey.ItemValue;
    protected css: any;
    protected rootCss: any;
    protected textStyle: any;
    constructor(props: any) {
        super(props);
        this.item = props.item;
        this.question = props.question;
        this.css = props.css;
        this.rootCss = props.rootCss;
        this.textStyle = props.textStyle;
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    componentWillReceiveProps(nextProps: any) {
        this.item = nextProps.item;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
        this.textStyle = nextProps.textStyle;
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
        var itemWidth = this.question.colCount > 0 ? (100 / this.question.colCount) + "%" : "";
        var marginRight = this.question.colCount == 0 ? "5px" : "0px";
        var divStyle = { marginRight: marginRight };
        if (itemWidth) {
            divStyle["width"] = itemWidth;
        }
        var isChecked = this.question.value && this.question.value.indexOf(this.item.value) > -1;
        var otherItem = (this.item.value === this.question.otherItem.value && isChecked) ? this.renderOther() : null;
        return this.renderCheckbox(isChecked, divStyle, otherItem);
    }
    protected get inputStyle(): any { return { marginRight: "3px" }; }
    protected renderCheckbox(isChecked: boolean, divStyle: any, otherItem: JSX.Element): JSX.Element {
        return (<div className={this.css.item} style={divStyle}>
                <label className={this.css.item}>
                    <input type="checkbox" style={this.inputStyle}  checked={isChecked} onChange={this.handleOnChange} />
                    <span>{this.item.text}</span>
                    </label>
                {otherItem}
            </div>);
    }
    protected renderOther(): JSX.Element {
        return (<div className={this.css.other}><ReactSurveyQuestionCommentItem  question={this.question} css={this.rootCss} /></div>);
    }
}