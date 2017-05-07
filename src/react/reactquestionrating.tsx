import * as React from 'react';
import {SurveyQuestionElementBase} from "./reactquestionelement";
import {SurveyQuestionCommentItem} from "./reactquestioncomment";
import {QuestionRatingModel} from "../question_rating";
import {ItemValue} from "../itemvalue";
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
        var minText = this.question.minRateDescription ? this.renderLocString(this.question.locMinRateDescription) : null;
        var maxText = this.question.maxRateDescription ? this.renderLocString(this.question.locMaxRateDescription) : null;
        for (var i = 0; i < this.question.visibleRateValues.length; i++) {
            var minTextValue = i == 0 ? minText : null;
            var maxTextValue = i == this.question.visibleRateValues.length - 1 ? maxText : null;
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
    protected renderItem(key: string, item: ItemValue, minText: JSX.Element, maxText: JSX.Element): JSX.Element {
        var isChecked = this.question.value == item.value;
        var className = this.css.item;
        if (isChecked) className += " active";
        var itemText = this.renderLocString(item.locText);
        return <label key={key} className={className}>
            <input type="radio" style={{ display: "none" }} name={this.question.name} value={item.value} disabled={this.isDisplayMode} checked={this.question.value == item.value} onChange={this.handleOnChange} />
            {minText}
            {itemText}
            {maxText}
            </label>;
    }
    protected renderOther(): JSX.Element {
        return (<div className={this.css.other}><SurveyQuestionCommentItem  question={this.question} css={this.rootCss} isDisplayMode={this.isDisplayMode}/></div>);
    }
}
ReactQuestionFactory.Instance.registerQuestion("rating", (props) => {
    return React.createElement(SurveyQuestionRating, props);
});
