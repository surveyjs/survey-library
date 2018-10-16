import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestionelement";
import { QuestionRadiogroupModel } from "../question_radiogroup";
import { ItemValue } from "../itemvalue";
import { SurveyQuestionCommentItem } from "./reactquestioncomment";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionRadiogroup extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = { choicesChanged: 0 };
    var self = this;
    this.question.choicesChangedCallback = function() {
      self.setState({ choicesChanged: self.state.choicesChanged + 1 });
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  protected get question(): QuestionRadiogroupModel {
    return this.questionBase as QuestionRadiogroupModel;
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  handleOnChange(event: any) {
    this.question.value = event.target.value;
    this.setState({ value: this.question.value });
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    var clearButton = null;
    if (this.question.showClearButton) {
      clearButton = (
        <div>
          <input
            type="button"
            className={this.question.cssClasses.clearButton}
            onClick={() => this.question.clearValue()}
            value={this.question.clearButtonCaption}
          />
        </div>
      );
    }
    return (
      <fieldset className={cssClasses.root}>
        {this.getItems(cssClasses)}
        {clearButton}
        <legend style={{ display: "none" }}>
          {this.question.locTitle.renderedHtml}
        </legend>
      </fieldset>
    );
  }
  protected getItems(cssClasses: any): Array<any> {
    var items = [];
    for (var i = 0; i < this.question.visibleChoices.length; i++) {
      var item = this.question.visibleChoices[i];
      var key = "item" + i;
      items.push(this.renderItem(key, item, i === 0, cssClasses));
    }
    return items;
  }
  protected get textStyle(): any {
    return { marginLeft: "3px", display: "inline", position: "static" };
  }
  private renderItem(
    key: string,
    item: ItemValue,
    isFirst: boolean,
    cssClasses: any
  ): JSX.Element {
    var isChecked = this.question.value == item.value;
    var otherItem =
      isChecked && item.value === this.question.otherItem.value
        ? this.renderOther(cssClasses)
        : null;
    return this.renderRadio(
      key,
      item,
      isChecked,
      otherItem,
      isFirst,
      cssClasses
    );
  }
  protected renderRadio(
    key: string,
    item: ItemValue,
    isChecked: boolean,
    otherItem: JSX.Element,
    isFirst: boolean,
    cssClasses: any
  ): JSX.Element {
    var id = this.question.inputId;
    var itemText = this.renderLocString(item.locText, this.textStyle);
    let itemClass =
      cssClasses.item +
      (this.question.colCount === 0
        ? " sv_q_radiogroup_inline"
        : " sv-q-col-" + this.question.colCount);

    if (isChecked) itemClass += " checked";

    return (
      <div key={key} className={itemClass}>
        <label className={cssClasses.label}>
          <input
            className={cssClasses.itemControl}
            id={id}
            type="radio"
            name={this.question.name + "_" + this.questionBase.id}
            checked={isChecked}
            value={item.value}
            disabled={this.isDisplayMode}
            onChange={this.handleOnChange}
            aria-label={item.locText.renderedHtml}
          />
          <span className={cssClasses.materialDecorator} />
          <span className="check" />
          <span className={cssClasses.controlLabel}>{itemText}</span>
        </label>
        {otherItem}
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

ReactQuestionFactory.Instance.registerQuestion("radiogroup", props => {
  return React.createElement(SurveyQuestionRadiogroup, props);
});
