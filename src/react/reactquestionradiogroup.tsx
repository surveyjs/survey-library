import * as React from 'react';
import {SurveyQuestionElementBase} from "./reactquestionelement";
import {QuestionRadiogroupModel} from "../question_radiogroup";
import {ItemValue} from "../itemvalue";
import {SurveyQuestionCommentItem} from "./reactquestioncomment";
import {ReactQuestionFactory} from "./reactquestionfactory";

export class SurveyQuestionRadiogroup extends SurveyQuestionElementBase {
    constructor(props: any) {
        super(props);
        this.state = { choicesChanged: 0 };
        var self = this;
        this.question.choicesChangedCallback = function () {
            self.state.choicesChanged = self.state.choicesChanged + 1;
            self.setState(self.state);
        };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    protected get question(): QuestionRadiogroupModel { return this.questionBase as QuestionRadiogroupModel; }
    componentWillReceiveProps(nextProps: any) {
        super.componentWillReceiveProps(nextProps);
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    handleOnChange(event) {
        this.question.value = event.target.value;
        this.setState({ value: this.question.value });
    }
    render(): JSX.Element {
        if (!this.question) return null;
        return (
            <div className={this.css.root}>
                {this.getItems() }
            </div>);
    }
    protected getItems(): Array<any> {
        var items = [];
        for (var i = 0; i < this.question.visibleChoices.length; i++) {
            var item = this.question.visibleChoices[i];
            var key = "item" + i;
            items.push(this.renderItem(key, item, i == 0));
        }
        return items;
    }
    protected get textStyle(): any { return { marginLeft: "3px", display: "inline", position: 'static' }; }
    private renderItem(key: string, item: ItemValue, isFirst: boolean): JSX.Element {
        var itemWidth = this.question.colCount > 0 ? (100 / this.question.colCount) + "%" : "";
        var marginRight = this.question.colCount == 0 ? "5px" : "0px";
        var divStyle = { marginRight: marginRight, marginLeft: '0px', display: 'inline-block'};
        if (itemWidth) {
            divStyle["width"] = itemWidth;
        }
        var isChecked = this.question.value == item.value;
        var otherItem = (isChecked && item.value === this.question.otherItem.value) ? this.renderOther() : null;
        return this.renderRadio(key, item, isChecked, divStyle, otherItem, isFirst);
    }
    protected renderRadio(key: string, item: ItemValue, isChecked: boolean, divStyle: any, otherItem: JSX.Element, isFirst: boolean): JSX.Element {
        var id = isFirst ? this.question.inputId : null;
        var itemText = this.renderLocString(item.locText, this.textStyle);
        return (
            <div key={key} className={this.css.item} style={divStyle}>
                <label className={this.css.label}>
                    <input id={id} type="radio" name={this.question.name + "_" + this.questionBase.id} checked={isChecked} value={item.value} disabled={this.isDisplayMode} onChange={this.handleOnChange} />
                    <span className="circle"></span>
                    <span className="check"></span>
                    {itemText}
                </label>
                {otherItem}
            </div>
        );
    }
    protected renderOther(): JSX.Element {
        return (<div className={this.css.other}><SurveyQuestionCommentItem  question={this.question} css={this.rootCss} isDisplayMode={this.isDisplayMode}/></div>);
    }
}

ReactQuestionFactory.Instance.registerQuestion("radiogroup", (props) => {
    return React.createElement(SurveyQuestionRadiogroup, props);
});
