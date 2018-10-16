import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestionelement";
import { QuestionDropdownModel } from "../question_dropdown";
import { SurveyQuestionCommentItem } from "./reactquestioncomment";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { browser, compareVersions, isMobile } from "../utils/utils";

export class SurveyQuestionDropdown extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = { value: this.getStateValue(), choicesChanged: 0 };
    var self = this;
    this.question.choicesChangedCallback = function() {
      self.setState({
        choicesChanged: self.state.choicesChanged + 1,
        value: self.question.value
      });
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  protected get question(): QuestionDropdownModel {
    return this.questionBase as QuestionDropdownModel;
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.setState({ value: this.getStateValue() });
  }
  handleOnChange(event: any) {
    this.question.value = event.target.value;
    this.setState({ value: this.getStateValue() });
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    var comment =
      this.question.hasOther &&
      this.question.value === this.question.otherItem.value
        ? this.renderOther(cssClasses)
        : null;
    var select = this.renderSelect(cssClasses);
    return (
      <div className={cssClasses.root}>
        {select}
        {comment}
      </div>
    );
  }
  protected renderSelect(cssClasses: any): JSX.Element {
    if (this.isDisplayMode) {
      var isOtherSelected =
        this.question.value === this.question.otherItem.value;
      return (
        <div id={this.question.inputId} className={cssClasses.control}>
          {isOtherSelected
            ? this.question.otherText
            : this.question.displayValue}
        </div>
      );
    }
    var options = [];
    for (var i = 0; i < this.question.visibleChoices.length; i++) {
      var item = this.question.visibleChoices[i];
      var key = "item" + i;
      var option = (
        <option key={key} value={item.value}>
          {item.text}
        </option>
      );
      options.push(option);
    }

    let onChange = null;
    if (
      browser.msie ||
      (browser.firefox && compareVersions(browser.version, "51") < 0) ||
      (browser.firefox && isMobile())
    ) {
      onChange = this.handleOnChange;
    }
    return (
      <div className={cssClasses.selectWrapper}>
        <select
          id={this.question.inputId}
          className={cssClasses.control}
          value={this.state.value}
          onChange={onChange}
          onInput={this.handleOnChange}
          aria-label={this.question.locTitle.renderedHtml}
        >
          <option value="">{this.question.optionsCaption}</option>
          {options}
        </select>
      </div>
    );
  }
  protected renderOther(cssClasses: any): JSX.Element {
    return (
      <div className="form-group">
        <SurveyQuestionCommentItem
          question={this.question}
          otherCss={cssClasses.other}
          cssClasses={cssClasses}
          isDisplayMode={this.isDisplayMode}
        />
      </div>
    );
  }
  private getStateValue(): any {
    return !this.question.isEmpty() ? this.question.value : "";
  }
}

ReactQuestionFactory.Instance.registerQuestion("dropdown", props => {
  return React.createElement(SurveyQuestionDropdown, props);
});
