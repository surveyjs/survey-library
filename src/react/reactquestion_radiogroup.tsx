import * as React from "react";
import { SurveyQuestionElementBase, ReactSurveyElement } from "./reactquestion_element";
import { QuestionRadiogroupModel } from "survey-core";
import { ItemValue } from "survey-core";
import { SurveyQuestionCommentItem } from "./reactquestion_comment";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { Base } from "survey-core";
import { ReactSurveyModel } from "./reactsurveymodel";
import { ReactElementFactory } from "./element-factory";

export class SurveyQuestionRadiogroup extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionRadiogroupModel {
    return this.questionBase as QuestionRadiogroupModel;
  }
  protected renderElement(): JSX.Element {
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
        role="presentation"
        ref={(fieldset) => (this.control = fieldset)}
      >
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
        <div key={"column" + ci} className={this.question.getColumnClass()} role="presentation">
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
      var renderedItem = this.renderItem(item, value, cssClasses, "" + i);
      items.push(renderedItem);
    }
    return items;
  }
  protected get textStyle(): any {
    return null;//{ display: "inline", position: "static" };
  }
  private renderItem(
    item: ItemValue,
    value: any,
    cssClasses: any,
    index: string
  ): JSX.Element {
    var key = "item" + index;
    const renderedItem = (
      <SurveyQuestionRadioItem
        key={key}
        question={this.question}
        cssClasses={cssClasses}
        isDisplayMode={this.isDisplayMode}
        item={item}
        textStyle={this.textStyle}
        index={index}
        isChecked={value === item.value}
      />
    );
    const survey = this.question.survey as ReactSurveyModel;
    let wrappedItem = null;
    if (!!survey) {
      wrappedItem = survey.wrapItemValue(renderedItem, this.question, item);
    }
    return wrappedItem ?? renderedItem;
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
  protected canRender(): boolean {
    return !!this.question && !!this.item;
  }
  protected renderElement(): JSX.Element {
    var otherItem =
      this.question.isOtherItem(this.item) && this.question.isOtherSelected
        ? this.renderOther(this.cssClasses)
        : null;

    var itemText = !this.hideCaption
      ? this.renderLocString(this.item.locText, this.textStyle)
      : "";
    var itemClass = this.question.getItemClass(this.item);
    var labelClass = this.question.getLabelClass(this.item);
    var locText: any = this.item.locText;
    var controlLabelClass = this.question.getControlLabelClass(this.item);

    return (
      <div
        className={itemClass}
        role="presentation"
      >
        <label className={labelClass} aria-label={locText.renderedHtml}>
          <input
            aria-required={this.question.ariaRequired}
            aria-invalid={this.question.ariaInvalid}
            aria-describedby={this.question.ariaDescribedBy}
            className={this.cssClasses.itemControl}
            id={this.question.getItemId(this.item)}
            type="radio"
            name={this.question.questionName}
            checked={this.isChecked}
            value={this.item.value}
            disabled={!this.question.getItemEnabled(this.item)}
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
          <span className={controlLabelClass} title={locText.renderedHtml}>
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

ReactElementFactory.Instance.registerElement("survey-radiogroup-item", (props: any) => {
  return React.createElement(SurveyQuestionRadioItem, props);
});

ReactQuestionFactory.Instance.registerQuestion("radiogroup", (props) => {
  return React.createElement(SurveyQuestionRadiogroup, props);
});
