import * as React from 'react';
import QuestionDropdownModel from "../question_dropdown";
import {SurveyQuestionCommentItem} from "./reactquestioncomment";
import ReactQuestionFactory from "./reactquestionfactory";

export default class SurveyQuestionDropdown extends React.Component<any, any> {
    private question: QuestionDropdownModel;
    protected css: any;
    protected rootCss: any;

    constructor(props: any) {
        super(props);
        this.question = props.question;
        this.css = props.css;
        this.rootCss = props.rootCss;
        this.state = { value: this.question.value, choicesChanged: 0 };
        var self = this;
        this.question.choicesChangedCallback = function () {
            self.state.choicesChanged = self.state.choicesChanged + 1;
            self.setState(self.state);
        };
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
        var options = [];
        for (var i = 0; i < this.question.visibleChoices.length; i++) {
            var item = this.question.visibleChoices[i];
            var key = "item" + i;
            var option = <option key={key} value={item.value}>{item.text}</option>;
            options.push(option);
        }
        var comment = this.question.value === this.question.otherItem.value ? this.renderOther() : null;
        return (
            <div>
            <select className={this.css} value={this.state.value} onChange={this.handleOnChange}>
              <option value="">{this.question.optionsCaption}</option>
              {options}
            </select>
            {comment}
            </div>
        );
    }
    protected renderOther(): JSX.Element {
        var style = { marginTop: "3px" };
        return <div style={style}><SurveyQuestionCommentItem question={this.question} css={this.rootCss}/></div>;
    }
}

ReactQuestionFactory.Instance.registerQuestion("dropdown", (props) => {
    return React.createElement(SurveyQuestionDropdown, props);
});