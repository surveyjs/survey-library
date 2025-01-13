import * as React from "react";
import { SurveyQuestionElementBase, ReactSurveyElement } from "./reactquestion_element";
import { QuestionRadiogroupModel, ItemValue, Base, SurveyModel } from "survey-core";
import { SurveyQuestionOtherValueItem } from "./reactquestion_comment";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactSurveyElementsWrapper } from "./reactsurveymodel";
import { ReactElementFactory } from "./element-factory";

export class SurveyQuestionRadiogroup extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionRadiogroupModel {
    return this.questionBase as QuestionRadiogroupModel;
  }
  protected renderElement(): React.JSX.Element {
    var cssClasses = this.question.cssClasses;
    var clearButton: React.JSX.Element | null = null;
    if (this.question.showClearButtonInContent) {
      clearButton = (
        <div>
          <input
            type="button"
            className={this.question.cssClasses.clearButton}
            onClick={() => this.question.clearValue(true)}
            value={this.question.clearButtonCaption}
          />
        </div>
      );
    }
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
    var value = this.getStateValue();
    return this.question.columns.map((column: Array<ItemValue>, ci: number) => {
      var items = column.map((item: any, ii: number) =>
        this.renderItem(item, value, cssClasses, "" + ci + ii)
      );
      return (
        <div key={"column" + ci + this.question.getItemsColumnKey(column)} className={this.question.getColumnClass()} role="presentation">
          {items}
        </div>
      );
    });
  }

  protected getBody(cssClasses: any): React.JSX.Element {
    if (this.question.blockedRow) {
      return <div className={cssClasses.rootRow}>{this.getItems(cssClasses, this.question.dataChoices)}</div>;
    }
    else return <>{this.getItems(cssClasses, this.question.bodyItems)}</>;
  }

  protected getItems(cssClasses: any, choices: Array<ItemValue>): Array<any> {
    var items: Array<React.JSX.Element> = [];
    var value = this.getStateValue();
    for (var i = 0; i < choices.length; i++) {
      var item = choices[i];
      var renderedItem = this.renderItem(item, value, cssClasses, "" + i);
      items.push(renderedItem);
    }
    return items;
  }
  protected get textStyle(): any {
    return null;//{ display: "inline", position: "static" };
  }
  protected renderOther(cssClasses: any): React.JSX.Element {
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
  private renderItem(
    item: ItemValue,
    value: any,
    cssClasses: any,
    index?: string
  ): React.JSX.Element {
    const renderedItem = ReactElementFactory.Instance.createElement(this.question.itemComponent, {
      key: item.value,
      question: this.question,
      cssClasses: cssClasses,
      isDisplayMode: this.isDisplayMode,
      item: item,
      textStyle: this.textStyle,
      index: index,
      isChecked: value === item.value,
    });
    const survey = this.question.survey as SurveyModel;
    let wrappedItem: React.JSX.Element | null = null;
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
  private rootRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.rootRef = React.createRef();
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
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
    if (!this.question) return false;
    return (
      !this.question.customWidget ||
      !!this.question.customWidgetData.isNeedRender ||
      !!this.question.customWidget.widgetJson.isDefaultRender ||
      !!this.question.customWidget.widgetJson.render
    );
  }
  handleOnChange(event: any) {
    this.question.clickItemHandler(this.item);
  }
  handleOnMouseDown(event: any) {
    this.question.onMouseDown();
  }
  protected canRender(): boolean {
    return !!this.question && !!this.item;
  }

  public componentDidUpdate(prevProps: any, prevState: any): void {
    super.componentDidUpdate(prevProps, prevState);
    if (prevProps.item !== this.props.item && !this.question.isDesignMode) {
      if (this.props.item) {
        this.props.item.setRootElement(this.rootRef.current);
      }
      if (prevProps.item) {
        prevProps.item.setRootElement(undefined);
      }
    }
  }

  protected renderElement(): React.JSX.Element {
    var itemClass = this.question.getItemClass(this.item);
    var labelClass = this.question.getLabelClass(this.item);
    var controlLabelClass = this.question.getControlLabelClass(this.item);
    const itemLabel = !this.hideCaption ? <span className={controlLabelClass}>{this.renderLocString(this.item.locText, this.textStyle)}</span> : null;
    return (
      <div
        className={itemClass}
        role="presentation"
        ref={this.rootRef}
      >
        <label onMouseDown={this.handleOnMouseDown} className={labelClass}>
          <input
            aria-errormessage={this.question.ariaErrormessage}
            className={this.cssClasses.itemControl}
            id={this.question.getItemId(this.item)}
            type="radio"
            name={this.question.questionName}
            checked={this.isChecked}
            value={this.item.value}
            disabled={!this.question.getItemEnabled(this.item)}
            readOnly={this.question.isReadOnlyAttr}
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
      </div>
    );
  }
  componentDidMount(): void {
    super.componentDidMount();
    if (!this.question.isDesignMode) {
      this.item.setRootElement(this.rootRef.current as HTMLElement);
    }
  }
  public componentWillUnmount(): void {
    super.componentWillUnmount();
    if (!this.question.isDesignMode) {
      this.item.setRootElement(undefined as any);
    }
  }
}

ReactElementFactory.Instance.registerElement("survey-radiogroup-item", (props: any) => {
  return React.createElement(SurveyQuestionRadioItem, props);
});

ReactQuestionFactory.Instance.registerQuestion("radiogroup", (props) => {
  return React.createElement(SurveyQuestionRadiogroup, props);
});
