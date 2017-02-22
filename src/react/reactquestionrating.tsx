import * as React from 'react';
import {SurveyQuestionElementBase} from "./reactquestionelement";
import {SurveyQuestionCommentItem} from "./reactquestioncomment";
import {QuestionRatingModel} from "../question_rating";
import {ItemValue} from "../base";
import {ReactQuestionFactory} from "./reactquestionfactory";

export class SurveyQuestionRating extends SurveyQuestionElementBase {
    constructor(props: any) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    protected get question(): QuestionRatingModel { return this.questionBase as QuestionRatingModel; }
    handleOnChange(event) {
        this.question.value = event.target.value;
        this.setState({ value: this.question.value });
    }
    render(): JSX.Element {
        if (!this.question) return null;
        var values = [];
        var minText = this.question.mininumRateDescription ? this.question.mininumRateDescription + " " : "";
        var maxText = this.question.maximumRateDescription ? " " + this.question.maximumRateDescription : "";
        for (var i = 0; i < this.question.visibleRateValues.length; i++) {
            var minTextValue = i == 0 ? minText : "";
            var maxTextValue = i == this.question.visibleRateValues.length - 1 ? maxText : "";
            values.push(this.renderItem("value" + i, this.question.visibleRateValues[i], minTextValue, maxTextValue));
        }
        var comment = this.question.hasOther ? this.renderOther() : null;
        return (
            <div className={this.css.root}>
                {values}
                {comment}
            </div>
        );
    }
    protected renderItem(key: string, item: ItemValue, minText: string, maxText: string): JSX.Element {
        var isChecked = this.question.value == item.value;
        var className = this.css.item;
        if (isChecked) className += " active";
        var min = minText ? <span>{minText}</span> : null;
        var max = maxText ? <span>{maxText}</span> : null;
        return <label key={key} className={className}>
            <input type="radio" style={{ display: "none" }} name={this.question.name} value={item.value} disabled={this.isDisplayMode} checked={this.question.value == item.value} onChange={this.handleOnChange} />
            {min}
            <span>{item.text}</span>
            {max}
            </label>;
    }
    protected renderOther(): JSX.Element {
        return (<div className={this.css.other}><SurveyQuestionCommentItem  question={this.question} css={this.rootCss} isDisplayMode={this.isDisplayMode}/></div>);
    }
}
ReactQuestionFactory.Instance.registerQuestion("rating", (props) => {
    return React.createElement(SurveyQuestionRating, props);
});