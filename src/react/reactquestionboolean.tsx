import * as React from 'react';
import {ReactSurveyElement, SurveyQuestionElementBase} from "./reactquestionelement";
import {QuestionBooleanModel} from "../question_boolean";
import {ReactQuestionFactory} from "./reactquestionfactory";

export class SurveyQuestionBoolean extends SurveyQuestionElementBase {
    constructor(props: any) {
        super(props);
        this.state = { value: this.question.checkedValue };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    componentWillReceiveProps(nextProps: any) {
        super.componentWillReceiveProps(nextProps);
        this.state.value =  this.question.checkedValue;
    }
    protected get question(): QuestionBooleanModel { return this.questionBase as QuestionBooleanModel; }
    handleOnChange(event) {
        this.question.checkedValue = event.target.checked;
        this.setState({ value: this.question.checkedValue });
    }
    componentDidMount() {
        this.updateIndeterminate();
    }
    componentDidUpdate() {
        this.updateIndeterminate();
    }
    private updateIndeterminate() {
        if(!this.question) return;
        var el = this.refs["check"];
        if (el) {
            el["indeterminate"] = this.question.isIndeterminate;
        }
    }
    
    render(): JSX.Element {
        if (!this.question) return null;
        var cssClasses = this.question.cssClasses;
        var text = this.renderLocString(this.question.locDisplayLabel);
        return (
            <div className={cssClasses.item}>
                <label className={cssClasses.item}>
                    <input ref="check" type="checkbox" value={this.question.checkedValue} id={this.question.inputId}  disabled={this.isDisplayMode} checked={this.question.checkedValue} onChange={this.handleOnChange} aria-label={this.question.locTitle.renderedHtml}/>
                    <span className="checkbox-material" style={{"marginRight": "3px"}}><span className="check"></span></span>
                    <span>{text}</span>
                </label>
            </div>);
    }
}

ReactQuestionFactory.Instance.registerQuestion("boolean", (props) => {
    return React.createElement(SurveyQuestionBoolean, props);
});
