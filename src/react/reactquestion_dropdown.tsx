import * as React from "react";
import {
  SurveyQuestionUncontrolledElement,
  ReactSurveyElement,
} from "./reactquestion_element";
import { QuestionDropdownModel } from "survey-core";
import { SurveyQuestionCommentItem } from "./reactquestion_comment";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ItemValue } from "survey-core";
import { Base } from "survey-core";

export class SurveyQuestionDropdown extends SurveyQuestionUncontrolledElement<QuestionDropdownModel> {
  constructor(props: any) {
    super(props);
  }
  protected setValueCore(newValue: any) {
    this.questionBase.renderedValue = newValue;
  }
  protected getValueCore(): any {
    return this.questionBase.renderedValue;
  }
  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    var comment = this.question.isOtherSelected
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
      var isOtherSelected = this.question.isOtherSelected;
      return (
        // @ts-ignore
        <div id={this.question.inputId} className={cssClasses.control} disabled>
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
      var option = <SurveyQuestionOptionItem key={key} item={item} />;
      options.push(option);
    }
    var captionOption = this.question.showOptionsCaption ? (
      <option value="">{this.question.optionsCaption}</option>
    ) : null;

    return (
      <div className={cssClasses.selectWrapper}>
        <select
          id={this.question.inputId}
          className={cssClasses.control}
          ref={(select) => (this.control = select)}
          onChange={this.updateValueOnEvent}
          onInput={this.updateValueOnEvent}
          aria-label={this.question.locTitle.renderedHtml}
          aria-invalid={this.question.errors.length > 0}
          aria-describedby={
            this.question.errors.length > 0
              ? this.question.id + "_errors"
              : null
          }
        >
          {captionOption}
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
}

export class SurveyQuestionOptionItem extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
  }
  protected getStateElement(): Base {
    return this.item;
  }
  private get item(): ItemValue {
    return this.props.item;
  }
  protected canRender(): boolean {
    return !!this.item;
  }
  protected renderElement(): JSX.Element {
    return (
      <option value={this.item.value} disabled={!this.item.isEnabled}>
        {this.item.text}
      </option>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("dropdown", (props) => {
  return React.createElement(SurveyQuestionDropdown, props);
});
