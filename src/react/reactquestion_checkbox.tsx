import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase,
} from "./reactquestion_element";
import { SurveyQuestionOtherValueItem } from "./reactquestion_comment";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactSurveyElementsWrapper } from "./reactsurveymodel";
import { Base, ItemValue, SurveyModel, QuestionCheckboxModel } from "survey-core";
import { ReactElementFactory } from "./element-factory";

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
        className={this.question.getSelectBaseRootCss()}
        ref={(fieldset) => (this.setControl(fieldset))}
        role={this.question.a11y_input_ariaRole}
        aria-required={this.question.a11y_input_ariaRequired}
        aria-label={this.question.a11y_input_ariaLabel}
        aria-labelledby={this.question.a11y_input_ariaLabelledBy}
        aria-describedby={this.question.a11y_input_ariaDescribedBy}
        aria-invalid={this.question.a11y_input_ariaInvalid}
        aria-errormessage={this.question.a11y_input_ariaErrormessage}
      >
        <legend className={"sv-hidden"}>{this.question.locTitle.renderedHtml}</legend>
        {this.getHeader()}
        {this.question.hasColumns
          ? this.getColumnedBody(cssClasses)
          : this.getBody(cssClasses)}
        {this.getFooter()}
        {this.question.isOtherSelected ? this.renderOther() : null}
      </fieldset>
    );
  }

  protected getHeader() {
    if (this.question.hasHeadItems) {
      return this.question.headItems.map((item: any, ii: number) =>
        this.renderItem(
          "item_h" + ii,
          item,
          false,
          this.question.cssClasses
        )
      );
    }
  }
  protected getFooter() {
    if (this.question.hasFootItems) {
      return this.question.footItems.map((item: any, ii: number) =>
        this.renderItem(
          "item_f" + ii,
          item,
          false,
          this.question.cssClasses
        )
      );
    }
  }
  protected getColumnedBody(cssClasses: any) {
    return (
      <div className={cssClasses.rootMultiColumn}>
        {this.getColumns(cssClasses)}
      </div>
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
        <div key={"column" + ci} className={this.question.getColumnClass()} role="presentation">
          {items}
        </div>
      );
    });
  }

  protected getBody(cssClasses: any): JSX.Element {
    if (this.question.blockedRow) {
      return <div className={cssClasses.rootRow}>{this.getItems(cssClasses, this.question.dataChoices)}</div>;
    }
    else return <>{this.getItems(cssClasses, this.question.bodyItems)}</>;
  }
  protected getItems(cssClasses: any, choices: Array<ItemValue>): Array<any> {
    var renderedItems:Array<JSX.Element> = [];
    for (var i = 0; i < choices.length; i++) {
      var item = choices[i];
      var key = "item" + i;
      var renderedItem = this.renderItem(key, item, i == 0, cssClasses, "" + i);
      if(!!renderedItem) {
        renderedItems.push(renderedItem);
      }
    }
    return renderedItems;
  }
  protected get textStyle(): any {
    return null;
  }
  protected renderOther(): JSX.Element {
    let cssClasses = this.question.cssClasses;
    return (
      <div className={this.question.getCommentAreaCss(true)}>
        <SurveyQuestionOtherValueItem
          question={this.question}
          otherCss={cssClasses.other}
          cssClasses={cssClasses}
          isDisplayMode={this.isDisplayMode}
        />
      </div>
    );
  }
  protected renderItem(
    key: string,
    item: any,
    isFirst: boolean,
    cssClasses: any,
    index?: string
  ): JSX.Element {
    const renderedItem = ReactElementFactory.Instance.createElement(this.question.itemComponent, {
      key: key,
      question: this.question,
      cssClasses: cssClasses,
      isDisplayMode: this.isDisplayMode,
      item: item,
      textStyle: this.textStyle,
      index: index,
      isFirst: isFirst,
    });
    const survey = this.question.survey as SurveyModel;
    let wrappedItem: JSX.Element | null = null;
    if (!!survey && !!renderedItem) {
      wrappedItem = ReactSurveyElementsWrapper.wrapItemValue(survey, renderedItem, this.question, item);
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
  public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    if (!super.shouldComponentUpdate(nextProps, nextState)) return false;
    if(!this.question) return false;
    return (
      !this.question.customWidget ||
      !!this.question.customWidgetData.isNeedRender ||
      !!this.question.customWidget.widgetJson.isDefaultRender ||
      !!this.question.customWidget.widgetJson.render
    );
  }
  handleOnChange = (event: any) => {
    this.question.clickItemHandler(this.item, event.target.checked);
  }
  protected canRender(): boolean {
    return !!this.item && !!this.question;
  }
  protected renderElement(): JSX.Element {
    var isChecked = this.question.isItemSelected(this.item);
    return this.renderCheckbox(isChecked, null);
  }
  protected get inputStyle(): any {
    return null;//{ marginRight: "3px" };
  }
  protected renderCheckbox(
    isChecked: boolean,
    otherItem: JSX.Element | null
  ): JSX.Element {
    const id = this.question.getItemId(this.item);
    const itemClass = this.question.getItemClass(this.item);
    const labelClass = this.question.getLabelClass(this.item);
    const itemLabel = !this.hideCaption ? <span className={this.cssClasses.controlLabel}>{this.renderLocString(this.item.locText, this.textStyle)}</span> : null;

    return (
      <div className={itemClass} role="presentation">
        <label className={labelClass}>
          <input
            className={this.cssClasses.itemControl}
            type="checkbox"
            role="option"
            name={this.question.name + this.item.id}
            value={this.item.value}
            id={id}
            style={this.inputStyle}
            disabled={!this.question.getItemEnabled(this.item)}
            checked={isChecked}
            onChange={this.handleOnChange}
          />
          {
            this.cssClasses.materialDecorator ?
              <span className={this.cssClasses.materialDecorator}>
                {this.question.itemSvgIcon ?
                  <svg
                    className={this.cssClasses.itemDecorator}
                  >
                    <use xlinkHref={this.question.itemSvgIcon}></use>
                  </svg> :
                  null
                }
              </span> :
              null
          }
          {itemLabel}
        </label>
        {otherItem}
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("survey-checkbox-item", (props: any) => {
  return React.createElement(SurveyQuestionCheckboxItem, props);
});

ReactQuestionFactory.Instance.registerQuestion("checkbox", (props) => {
  return React.createElement(SurveyQuestionCheckbox, props);
});
