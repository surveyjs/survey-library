import * as React from 'react';
import {SurveyQuestionElementBase} from "./reactquestionelement";
import {QuestionDropdownModel} from "../question_dropdown";
import {SurveyQuestionCommentItem} from "./reactquestioncomment";
import {ReactQuestionFactory} from "./reactquestionfactory";
import {browser, compareVersions} from "../utils";

export class SurveyQuestionDropdown extends SurveyQuestionElementBase {
    constructor(props: any) {
        super(props);
        this.state = { value: this.question.value || '', choicesChanged: 0 };
        var self = this;
        this.question.choicesChangedCallback = function () {
            self.state.choicesChanged = self.state.choicesChanged + 1;
            self.setState(self.state);
        };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    protected get question(): QuestionDropdownModel { return this.questionBase as QuestionDropdownModel; }
    componentWillReceiveProps(nextProps: any) {
        super.componentWillReceiveProps(nextProps);
        this.state.value = this.question.value || '';
    }
    handleOnChange(event) {
        this.question.value = event.target.value;
        this.setState({ value: this.question.value || '' });
    }
    render(): JSX.Element {
        if (!this.question) return null;
        var comment = this.question.value === this.question.otherItem.value ? this.renderOther() : null;
        var select = this.renderSelect();
        return (
            <div className={this.css.root}>
            {select}
            {comment}
            </div>
        );
    }
    protected renderSelect(): JSX.Element {
        if (this.isDisplayMode)  return (<div id={this.question.inputId} className={this.css.control}>{this.question.value}</div>);
        var options = [];
        for (var i = 0; i < this.question.visibleChoices.length; i++) {
            var item = this.question.visibleChoices[i];
            var key = "item" + i;
            var option = <option key={key} value={item.value} selected={this.state.value == item.value}>{item.text}</option>;
            options.push(option);
        }

        let onChange = null;
        if (browser.msie || (browser.firefox && compareVersions(browser.version, '51') < 0)) {
            onChange = this.handleOnChange;
        }
        return (
            <select id={this.question.inputId} className={this.css.control} value={this.state.value} onChange={onChange} onInput={this.handleOnChange}>
            <option value="">{this.question.optionsCaption}</option>
            {options}
            </select>
        );
    }
    protected renderOther(): JSX.Element {
        var style = { marginTop: "3px" };
        return <div style={style}><SurveyQuestionCommentItem question={this.question} css={this.rootCss} otherCss={this.css.other} isDisplayMode={this.isDisplayMode}/></div>;
    }
}

ReactQuestionFactory.Instance.registerQuestion("dropdown", (props) => {
    return React.createElement(SurveyQuestionDropdown, props);
});
