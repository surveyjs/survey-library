import * as React from "react";
import {
  SurveyQuestionElementBase,
  ReactSurveyElement
} from "./reactquestionelement";
import { QuestionRadiogroupModel } from "../question_radiogroup";
import { ItemValue } from "../itemvalue";
import { SurveyQuestionCommentItem } from "./reactquestioncomment";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { Base } from "../base";

export class SurveyQuestionRadiogroup extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionRadiogroupModel {
    return this.questionBase as QuestionRadiogroupModel;
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    var clearButton = null;
    if (this.question.canShowClearButton) {
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
      <fieldset
        className={cssClasses.root}
        ref={fieldset => (this.control = fieldset)}
      >
        <legend aria-label={this.question.locTitle.renderedHtml} />
        {this.question.hasColumns
          ? this.getColumns(cssClasses)
          : this.getItems(cssClasses)}
        {clearButton}
      </fieldset>
    );
  }
  protected getColumns(cssClasses: any) {
    var value = this.getStateValue();
    return this.question.columns.map((column: any, ci: number) => {
      var items = column.map((item: any, ii: number) =>
        this.renderItem(item, value, cssClasses, "" + ci + ii)
      );
      return (
        <div key={"column" + ci} className={this.question.getColumnClass()}>
          {items}
        </div>
      );
    });
  }
  protected getItems(cssClasses: any): Array<any> {
    var items = [];
    var value = this.getStateValue();
    for (var i = 0; i < this.question.visibleChoices.length; i++) {
      var item = this.question.visibleChoices[i];
      items.push(this.renderItem(item, value, cssClasses, "" + i));
    }
    return items;
  }
  protected get textStyle(): any {
    return { marginLeft: "3px", display: "inline", position: "static" };
  }
  private renderItem(
    item: ItemValue,
    value: any,
    cssClasses: any,
    index: string
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
        isChecked={value === item.value}
        isDisabled={this.question.isReadOnly || !item.isEnabled}
      />
    );
  }
  private getStateValue(): any {
    return !this.question.isEmpty() ? this.question.renderedValue : "";
  }
}

export class SurveyQuestionRadioItem extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  protected getStateElement(): Base {
    return this.item;
  }
  protected get question(): QuestionRadiogroupModel {
    return this.props.question;
  }
  protected get item(): ItemValue {
    return this.props.item;
  }
  protected get textStyle(): any {
    return this.props.textStyle;
  }
  protected get index(): number {
    return this.props.index;
  }
  protected get isChecked(): boolean {
    return this.props.isChecked;
  }
  protected get isDisabled(): boolean {
    return this.props.isDisabled;
  }
  private get hideCaption(): boolean {
    return this.props.hideCaption === true;
  }
  public shouldComponentUpdate(): boolean {
    return (
      !this.question.customWidget ||
      !!this.question.customWidgetData.isNeedRender ||
      !!this.question.customWidget.widgetJson.isDefaultRender ||
      !!this.question.customWidget.widgetJson.render
    );
  }
  handleOnChange(event: any) {
    this.question.renderedValue = this.item.value;
  }
  getItemClass(isChecked: boolean, isDisabled: boolean) {
    var itemClass = this.cssClasses.item;
    var allowHover = !isDisabled && !isChecked;
    if (isDisabled) itemClass += " " + this.cssClasses.itemDisabled;
    if (isChecked) itemClass += " " + this.cssClasses.itemChecked;
    if (allowHover) itemClass += " " + this.cssClasses.itemHover;
    if (!this.question.hasColumns) {
      itemClass +=
        this.question.colCount === 0
          ? " " + this.cssClasses.itemInline
          : " sv-q-col-" + this.question.colCount;
    }
    return itemClass;
  }
  render(): JSX.Element {
    if (!this.item || !this.question) return null;
    var otherItem =
      this.isChecked && this.item.value === this.question.otherItem.value
        ? this.renderOther(this.cssClasses)
        : null;

    var id = this.question.inputId + "_" + this.index;
    var itemText = !this.hideCaption
      ? this.renderLocString(this.item.locText, this.textStyle)
      : "";
    var itemClass = this.getItemClass(this.isChecked, this.isDisabled);
    var labelClass = this.question.getLabelClass(this.isChecked);
    var locText: any = this.item.locText;
    var controlLabelClass = this.question.getControlLabelClass(this.isChecked);

    return (
      <div className={itemClass}>
        <label className={labelClass}>
          <input
            className={this.cssClasses.itemControl}
            id={id}
            type="radio"
            name={this.question.name + "_" + this.question.id}
            checked={this.isChecked}
            value={this.item.value}
            disabled={this.isDisplayMode || !this.item.isEnabled}
            onChange={this.handleOnChange}
            aria-required={this.question.isRequired}
            aria-label={locText.renderedHtml}
            aria-invalid={this.question.errors.length > 0}
            aria-describedby={this.question.errors.length > 0 ? this.question.id + '_errors' : null}    
            role="radio"
          />
          <span className={this.cssClasses.materialDecorator}>
            <svg
              className={this.cssClasses.itemDecorator}
              viewBox="-12 -12 24 24"
            >
              <circle r="6" cx="0" cy="0" />
            </svg>
          </span>
          <span className="check" />
          <span className={controlLabelClass} title={locText["koRenderedHtml"]}>
            {itemText}
          </span>
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
