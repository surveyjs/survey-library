import * as React from "react";
import { SurveyQuestionElementBase, ReactSurveyElement } from "./reactquestion_element";
import { QuestionRadiogroupModel } from "survey-core";
import { ItemValue } from "survey-core";
import { SurveyQuestionCommentItem } from "./reactquestion_comment";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { Base, SurveyModel } from "survey-core";
import { ReactSurveyElementsWrapper } from "./reactsurveymodel";
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
    if (this.question.showClearButtonInContent) {
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
        className={this.question.getSelectBaseRootCss()}
        role="presentation"
        ref={(fieldset) => (this.control = fieldset)}
      >
        {this.question.hasColumns
          ? this.getColumnedBody(cssClasses)
          : this.getBody(cssClasses)}
        {this.getFooter()}
        {this.question.isOtherSelected ? this.renderOther(cssClasses) : null}
        {clearButton}
      </fieldset>
    );
  }
  protected getFooter() {
    if (this.question.hasFootItems) {
      return this.question.footItems.map((item: any, ii: number) =>
        this.renderItem(
          "item_f" + ii,
          item,
          false,
          this.question.cssClasses,
          null
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
    var value = this.getStateValue();
    return this.question.columns.map((column: any, ci: number) => {
      var items = column.map((item: any, ii: number) =>
        this.renderItem("item" + ci + ii, item, value, cssClasses, "" + ci + ii)
      );
      return (
        <div key={"column" + ci} className={this.question.getColumnClass()} role="presentation">
          {items}
        </div>
      );
    });
  }

  protected getBody(cssClasses: any): JSX.Element {
    if(this.question.blockedRow) {
      return <div className={cssClasses.rootRow}>{this.getItems(cssClasses, this.question.dataChoices)}</div>;
    }
    else return <>{this.getItems(cssClasses, this.question.bodyItems)}</>;
  }

  protected getItems(cssClasses: any, choices: Array <ItemValue>): Array<any> {
    var items = [];
    var value = this.getStateValue();
    for (var i = 0; i < choices.length; i++) {
      var item = choices[i];
      var renderedItem = this.renderItem("item" + i, item, value, cssClasses, "" + i);
      items.push(renderedItem);
    }
    return items;
  }
  protected get textStyle(): any {
    return null;//{ display: "inline", position: "static" };
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
  private renderItem(
    key: string,
    item: ItemValue,
    value: any,
    cssClasses: any,
    index: string
  ): JSX.Element {
    const renderedItem = ReactElementFactory.Instance.createElement(this.question.itemComponent, {
      key: key,
      question: this.question,
      cssClasses: cssClasses,
      isDisplayMode: this.isDisplayMode,
      item: item,
      textStyle: this.textStyle,
      index: index,
      isChecked: value === item.value,
    });
    const survey = this.question.survey as SurveyModel;
    let wrappedItem = null;
    if (!!survey) {
      wrappedItem = ReactSurveyElementsWrapper.wrapItemValue(survey, renderedItem, this.question, item);
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
  public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    if (!super.shouldComponentUpdate(nextProps, nextState)) return false;
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
        <label className={labelClass} aria-label={this.question.getAriaItemLabel(this.item)}>
          <input
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
          <span className={controlLabelClass}>
            {itemText}
          </span>
        </label>
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
