import * as React from "react";
import {
  SurveyQuestionElementBase,
  ReactSurveyElement
} from "./reactquestionelement";
import { QuestionRadiogroupModel } from "../question_radiogroup";
import { ItemValue } from "../itemvalue";
import { SurveyQuestionCommentItem } from "./reactquestioncomment";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionRadiogroup extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = { value: this.getStateValue() };
  }
  protected get question(): QuestionRadiogroupModel {
    return this.questionBase as QuestionRadiogroupModel;
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.setState({ value: this.getStateValue() });
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
        <legend aria-label={this.question.locTitle.renderedHtml} />
        {this.getItems(cssClasses)}
        {clearButton}
      </fieldset>
    );
  }
  protected getItems(cssClasses: any): Array<any> {
    var items = [];
    for (var i = 0; i < this.question.visibleChoices.length; i++) {
      var item = this.question.visibleChoices[i];
      items.push(this.renderItem(item, cssClasses, i));
    }
    return items;
  }
  protected get textStyle(): any {
    return { marginLeft: "3px", display: "inline", position: "static" };
  }
  private renderItem(
    item: ItemValue,
    cssClasses: any,
    index: number
  ): JSX.Element {
    var key = "item" + index;
    return (
      <SurveyQuestionRadioItem
        key={key}
        question={this.question}
        cssClasses={cssClasses}
        isDisplayMode={this.isDisplayMode}
        item={item}
        textStyle={this.textStyle}
        index={index}
        isChecked={this.state.value == item.value}
      />
    );
  }
  private getStateValue(): any {
    return !this.question.isEmpty() ? this.question.value : "";
  }
}

export class SurveyQuestionRadioItem extends ReactSurveyElement {
  protected question: QuestionRadiogroupModel;
  protected item: ItemValue;
  protected textStyle: any;
  protected index: number;
  protected isChecked: boolean;
  constructor(props: any) {
    super(props);
    this.updateProps(props);
  }
  public shouldComponentUpdate(): boolean {
    return (
      !this.question.customWidget ||
      !!this.question.customWidgetData.isNeedRender ||
      !!this.question.customWidget.widgetJson.render
    );
  }
  componentWillMount() {
    this.makeBaseElementReact(this.item);
  }
  componentWillUnmount() {
    this.unMakeBaseElementReact(this.item);
  }
  componentWillReceiveProps(nextProps: any) {
    this.unMakeBaseElementReact(this.item);
    super.componentWillReceiveProps(nextProps);
    this.updateProps(nextProps);
    this.makeBaseElementReact(this.item);
  }
  private updateProps(props: any) {
    this.item = props.item;
    this.question = props.question;
    this.textStyle = props.textStyle;
    this.index = props.index;
    this.isChecked = props.isChecked;
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  handleOnChange(event: any) {
    this.question.value = this.item.value;
  }
  render(): JSX.Element {
    if (!this.item || !this.question) return null;
    var otherItem =
      this.isChecked && this.item.value === this.question.otherItem.value
        ? this.renderOther(this.cssClasses)
        : null;

    var id = this.question.inputId + "_" + this.index;
    var itemText = this.renderLocString(this.item.locText, this.textStyle);
    let itemClass =
      this.cssClasses.item +
      (this.question.colCount === 0
        ? " sv_q_radiogroup_inline"
        : " sv-q-col-" + this.question.colCount);

    if (this.isChecked) itemClass += " checked";

    return (
      <div className={itemClass}>
        <label className={this.cssClasses.label}>
          <input
            className={this.cssClasses.itemControl}
            id={id}
            type="radio"
            name={this.question.name + "_" + this.question.id}
            checked={this.isChecked}
            value={this.item.value}
            disabled={this.isDisplayMode || !this.item.isEnabled}
            onChange={this.handleOnChange}
            aria-label={this.item.locText.renderedHtml}
          />
          <span className={this.cssClasses.materialDecorator} />
          <span className="check" />
          <span className={this.cssClasses.controlLabel}>{itemText}</span>
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
