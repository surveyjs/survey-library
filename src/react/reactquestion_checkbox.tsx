import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase,
} from "./reactquestion_element";
import { SurveyQuestionCommentItem } from "./reactquestion_comment";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactSurveyModel } from "./reactsurveymodel";
import { QuestionCheckboxModel } from "../question_checkbox";
import { Base } from "../base";
import { ItemValue } from "../itemvalue";

export class SurveyQuestionCheckbox extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionCheckboxModel {
    return this.questionBase as QuestionCheckboxModel;
  }
  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    return (
      <fieldset
        className={cssClasses.root}
        ref={(fieldset) => (this.control = fieldset)}
      >
        <legend
          role="checkbox"
          aria-label={this.question.ariaLabel} />
        {this.question.hasColumns
          ? this.getColumns(cssClasses)
          : this.getItems(cssClasses)}
      </fieldset>
    );
  }
  protected getColumns(cssClasses: any) {
    return this.question.columns.map((column: any, ci: number) => {
      var items = column.map((item: any, ii: number) =>
        this.renderItem(
          "item" + ii,
          item,
          ci === 0 && ii === 0,
          cssClasses,
          "" + ci + ii
        )
      );
      return (
        <div key={"column" + ci} className={this.question.getColumnClass()}>
          {items}
        </div>
      );
    });
  }
  protected getItems(cssClasses: any): Array<any> {
    var renderedItems = [];
    for (var i = 0; i < this.question.visibleChoices.length; i++) {
      var item = this.question.visibleChoices[i];
      var key = "item" + i;
      var renderedItem = this.renderItem(key, item, i == 0, cssClasses, "" + i);
      renderedItems.push(renderedItem);
    }
    return renderedItems;
  }
  protected get textStyle(): any {
    return null;
  }
  protected renderItem(
    key: string,
    item: any,
    isFirst: boolean,
    cssClasses: any,
    index: string
  ): JSX.Element {
    const renderedItem = (
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
    const survey = this.question.survey as ReactSurveyModel;
    let wrappedItem = null;
    if(!!survey) {
      wrappedItem = survey.wrapItemValue(renderedItem, this.question, item);
    }
    return wrappedItem ?? renderedItem;
  }
}
export class SurveyQuestionCheckboxItem extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
  }
  protected getStateElement(): Base {
    return this.item;
  }
  protected get question(): QuestionCheckboxModel {
    return this.props.question;
  }
  protected get item(): ItemValue {
    return this.props.item;
  }
  protected get textStyle(): any {
    return this.props.textStyle;
  }
  protected get isFirst(): any {
    return this.props.isFirst;
  }
  protected get index(): number {
    return this.props.index;
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
  handleOnChange = (event: any) => {
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
  selectAllChanged = (event: any) => {
    this.question.toggleSelectAll();
  }
  protected canRender(): boolean {
    return !!this.item && !!this.question;
  }
  protected renderElement(): JSX.Element {
    var isChecked = this.question.isItemSelected(this.item);
    var otherItem = this.question.isOtherItem(this.item) && isChecked
      ? this.renderOther()
      : null;
    return this.renderCheckbox(isChecked, otherItem);
  }
  protected get inputStyle(): any {
    return null;//{ marginRight: "3px" };
  }
  protected renderCheckbox(
    isChecked: boolean,
    otherItem: JSX.Element
  ): JSX.Element {
    var id = this.question.getItemId(this.item);
    var text = !this.hideCaption ? this.renderLocString(this.item.locText) : "";
    let itemClass = this.question.getItemClass(this.item);
    let labelClass = this.question.getLabelClass(this.item);
    var onItemChanged =
      this.item == this.question.selectAllItem
        ? this.selectAllChanged
        : this.handleOnChange;

    var locText: any = this.item.locText;

    return (
      <div className={itemClass}>
        <label className={labelClass}>
          <input
            className={this.cssClasses.itemControl}
            type="checkbox"
            name={this.question.name}
            value={this.item.value}
            id={id}
            style={this.inputStyle}
            disabled={!this.question.getItemEnabled(this.item)}
            checked={isChecked}
            onChange={onItemChanged}
            aria-required={this.question.ariaRequired}
            aria-label={this.question.ariaLabel}
            aria-invalid={this.question.ariaInvalid}
            aria-describedby={this.question.ariaDescribedBy}
          />
          {
            this.cssClasses.materialDecorator ?
              <span className={this.cssClasses.materialDecorator}>
                { this.question.itemSvgIcon ?
                  <svg
                    className={this.cssClasses.itemDecorator}
                  >
                    <use xlinkHref={this.question.itemSvgIcon}></use>
                  </svg>:
                  null
                }
              </span> :
              null
          }
          <span className={this.cssClasses.controlLabel} title={locText.renderedHtml}>
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

ReactQuestionFactory.Instance.registerQuestion("checkbox", (props) => {
  return React.createElement(SurveyQuestionCheckbox, props);
});
