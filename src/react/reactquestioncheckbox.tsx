import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase
} from "./reactquestionelement";
import { SurveyQuestionCommentItem } from "./reactquestioncomment";
import { QuestionCheckboxModel } from "../question_checkbox";
import { ItemValue } from "../itemvalue";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionCheckbox extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionCheckboxModel {
    return this.questionBase as QuestionCheckboxModel;
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    return (
      <fieldset className={cssClasses.root}>
        <legend aria-label={this.question.locTitle.renderedHtml} />
        {this.question.hasColumns
          ? this.getColumns(cssClasses)
          : this.getItems(cssClasses)}
      </fieldset>
    );
  }
  protected getColumns(cssClasses: any) {
    return this.question.columns.map((column: any, ci: number) => {
      var items = column.map((item: any, ii: number) =>
        this.renderItem("item" + ii, item, ci === 0 && ii === 0, cssClasses, ii)
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
    for (var i = 0; i < this.question.visibleChoices.length; i++) {
      var item = this.question.visibleChoices[i];
      var key = "item" + i;
      items.push(this.renderItem(key, item, i == 0, cssClasses, i));
    }
    return items;
  }
  protected get textStyle(): any {
    return null;
  }
  protected renderItem(
    key: string,
    item: any,
    isFirst: boolean,
    cssClasses: any,
    index: number
  ): JSX.Element {
    return (
      <SurveyQuestionCheckboxItem
        key={key}
        question={this.question}
        cssClasses={cssClasses}
        isDisplayMode={this.isDisplayMode}
        item={item}
        textStyle={this.textStyle}
        isFirst={isFirst}
        index={index}
      />
    );
  }
}
export class SurveyQuestionCheckboxItem extends ReactSurveyElement {
  protected question: QuestionCheckboxModel;
  protected item: ItemValue;
  protected textStyle: any;
  protected isFirst: any;
  protected index: number;
  constructor(props: any) {
    super(props);
    this.item = props.item;
    this.question = props.question;
    this.textStyle = props.textStyle;
    this.isFirst = props.isFirst;
    this.index = props.index;
    this.handleOnChange = this.handleOnChange.bind(this);
    this.selectAllChanged = this.selectAllChanged.bind(this);
  }
  public shouldComponentUpdate(): boolean {
    return (
      !this.question.customWidget ||
      !!this.question.customWidgetData.isNeedRender ||
      !!this.question.customWidget.widgetJson.isDefaultRender ||
      !!this.question.customWidget.widgetJson.render
    );
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.item = nextProps.item;
    this.textStyle = nextProps.textStyle;
    this.question = nextProps.question;
    this.isFirst = nextProps.isFirst;
  }
  componentWillMount() {
    this.makeBaseElementReact(this.item);
  }
  componentWillUnmount() {
    this.unMakeBaseElementReact(this.item);
  }
  handleOnChange(event: any) {
    var newValue = [].concat(this.question.renderedValue || []);
    var index = newValue.indexOf(this.item.value);
    if (event.target.checked) {
      if (index < 0) {
        newValue.push(this.item.value);
      }
    } else {
      if (index > -1) {
        newValue.splice(index, 1);
      }
    }
    this.question.renderedValue = newValue;
  }
  selectAllChanged(event: any) {
    this.question.toggleSelectAll();
  }
  render(): JSX.Element {
    if (!this.item || !this.question) return null;
    var isChecked = this.question.isItemSelected(this.item);
    var isDisabled = this.question.isReadOnly || !this.item.isEnabled;
    var otherItem =
      this.item.value === this.question.otherItem.value && isChecked
        ? this.renderOther()
        : null;
    return this.renderCheckbox(isChecked, isDisabled, otherItem);
  }
  protected get inputStyle(): any {
    return { marginRight: "3px" };
  }
  private getItemClass(isChecked: boolean, isDisabled: boolean): string {
    var cssClasses = this.question.cssClasses;
    var allowHover = !isChecked && !isDisabled;
    var itemClass = cssClasses.item;
    if (isDisabled) itemClass += " " + cssClasses.itemDisabled;
    if (isChecked) itemClass += " " + cssClasses.itemChecked;
    if (allowHover) itemClass += " " + cssClasses.itemHover;
    if (!this.question.hasColumns) {
      itemClass +=
        this.question.colCount === 0
          ? " " + this.cssClasses.itemInline
          : " sv-q-col-" + this.question.colCount;
    }
    return itemClass;
  }
  protected renderCheckbox(
    isChecked: boolean,
    isDisabled: boolean,
    otherItem: JSX.Element
  ): JSX.Element {
    var id = this.question.inputId + "_" + this.index;
    var text = this.renderLocString(this.item.locText);
    let itemClass = this.getItemClass(isChecked, isDisabled);

    var onItemChanged =
      this.item == this.question.selectAllItem
        ? this.selectAllChanged
        : this.handleOnChange;

    var locText: any = this.item.locText;

    return (
      <div className={itemClass}>
        <label className={this.cssClasses.label}>
          <input
            className={this.cssClasses.itemControl}
            type="checkbox"
            value={this.item.value}
            id={id}
            style={this.inputStyle}
            disabled={this.isDisplayMode || !this.item.isEnabled}
            checked={isChecked}
            onChange={onItemChanged}
            aria-required={this.question.isRequired}
            aria-label={locText.renderedHtml}
          />
          <span className={this.cssClasses.materialDecorator}>
            <svg viewBox="0 0 24 24" className={this.cssClasses.itemDecorator}>
              <path d="m5,14.519865l2,-2l3,3l7,-7l2,2l-9,9l-5,-5z" />
            </svg>
            <span className="check" />
          </span>
          <span
            className={this.cssClasses.controlLabel}
            title={locText["koRenderedHtml"]}
          >
            {text}
          </span>
        </label>
        {otherItem}
      </div>
    );
  }
  protected renderOther(): JSX.Element {
    return (
      <div className="form-group">
        <SurveyQuestionCommentItem
          question={this.question}
          otherCss={this.cssClasses.other}
          cssClasses={this.cssClasses}
          isDisplayMode={this.isDisplayMode}
        />
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("checkbox", props => {
  return React.createElement(SurveyQuestionCheckbox, props);
});
