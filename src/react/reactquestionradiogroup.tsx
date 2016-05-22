/// <reference path="../survey.ts" />
/// <reference path="../question_radiogroup.ts" />
// <reference path="../question_baseselect.ts" />
/// <reference path="../../typings/react/react.d.ts" />
class ReactSurveyQuestionradiogroup extends React.Component<any, any> {
    protected question: Survey.QuestionRadiogroupModel;
    protected css: any;
    protected rootCss: any;
    constructor(props: any) {
        super(props);
        this.question = props.question;
        this.css = props.css;
        this.rootCss = props.rootCss;
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    componentWillReceiveProps(nextProps: any) {
        this.question = nextProps.question;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    handleOnChange(event) {
        this.question.value = event.target.value;
        this.setState({ value: this.question.value });
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
    protected get textStyle(): any { return { marginLeft: "3px" }; }
    private renderItem(key: string, item: Survey.ItemValue): JSX.Element {
        var itemWidth = this.question.colCount > 0 ? (100 / this.question.colCount) + "%" : "";
        var marginRight = this.question.colCount == 0 ? "5px" : "0px";
        var divStyle = { marginRight: marginRight };
        if (itemWidth) {
            divStyle["width"] = itemWidth;
        }
        var isChecked = this.question.value == item.value;
        var otherItem = (isChecked && item.value === this.question.otherItem.value) ? this.renderOther() : null;
        return this.renderRadio(key, item, isChecked, divStyle, otherItem);
    }
    protected renderRadio(key: string, item: Survey.ItemValue, isChecked: boolean, divStyle: any, otherItem: JSX.Element): JSX.Element {
        return (<div key={key} className={this.css.item} style={divStyle}>
                <label className={this.css.item}>
                    <input type="radio"  checked={isChecked} value={item.value} onChange={this.handleOnChange} />
                    <span style={this.textStyle}>{item.text}</span>
                    </label>
                {otherItem}
            </div>);
    }
    protected renderOther(): JSX.Element {
        return (<div className={this.css.other}><ReactSurveyQuestionCommentItem  question={this.question} css={this.rootCss} /></div>);
    }
}