import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase,
} from "./reactquestion_element";
import { SurveyQuestionCommentValueItem } from "./reactquestion_comment";
import { ReactSurveyElementsWrapper } from "./reactsurveymodel";
import { Base, ItemValue, SurveyModel, QuestionSelectBase } from "survey-core";
import { ReactElementFactory } from "./element-factory";
import { SurveyPanel } from "./panel";

export class SurveyQuestionSelectbase extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionSelectBase {
    return this.questionBase as QuestionSelectBase;
  }
  protected renderElement(): React.JSX.Element {
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
        {this.renderHeader()}
        {this.question.hasColumns
          ? this.getColumnedBody(cssClasses)
          : this.getBody(cssClasses)}
        {this.getFooter()}
      </fieldset>
    );
  }
  protected renderHeader(): React.JSX.Element | null { return null; }
  protected getFooter(): React.JSX.Element | null {
    if (this.question.hasFootItems) {
      const items = this.question.footItems.map((item: any, ii: number) =>
        this.renderItem(
          item,
          false,
          this.question.cssClasses
        )
      );
      return <>{items}</>;
    }
    return null;
  }
  protected getStateValue(): any { return undefined; }
  protected isItemChecked(item: ItemValue, value: any): boolean { return false; }
  protected getColumnedBody(cssClasses: any) {
    return (
      <div className={cssClasses.rootMultiColumn}>
        {this.getColumns(cssClasses)}
      </div>
    );
  }
  protected getColumns(cssClasses: any) {
    const value = this.getStateValue();
    return this.question.columns.map((column: Array<ItemValue>, ci: number) => {
      var items = column.map((item: any, ii: number) =>
        this.renderItem(item, ci === 0 && ii === 0, cssClasses, "" + ci + ii, this.isItemChecked(item, value))
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
    } else {
      return <>{this.getItems(cssClasses, this.question.bodyItems)}</>;
    }
  }
  protected getItems(cssClasses: any, choices: Array<ItemValue>): Array<any> {
    const items: Array<React.JSX.Element> = [];
    const value = this.getStateValue();
    for (let i = 0; i < choices.length; i++) {
      const item = choices[i];
      const renderedItem = this.renderItem(item, i == 0, cssClasses, "" + i, this.isItemChecked(item, value));
      if (!!renderedItem) {
        items.push(renderedItem);
      }
    }
    return items;
  }
  protected get textStyle(): any {
    return null;
  }
  protected renderItem(
    item: any,
    isFirst: boolean,
    cssClasses: any,
    index?: string,
    isChecked?: boolean
  ): React.JSX.Element {
    const renderedItem = ReactElementFactory.Instance.createElement(this.question.itemComponent, {
      key: item.uniqueId,
      question: this.question,
      cssClasses: cssClasses,
      isDisplayMode: this.isDisplayMode,
      item: item,
      textStyle: this.textStyle,
      index: index,
      isFirst: isFirst,
      isChecked: isChecked,
      creator: this.props.creator,
    });
    const survey = this.question.survey as SurveyModel;
    let wrappedItem: React.JSX.Element | null = null;
    if (!!survey && !!renderedItem) {
      wrappedItem = ReactSurveyElementsWrapper.wrapItemValue(survey, renderedItem, this.question, item);
    }
    return wrappedItem ?? renderedItem;
  }
}
export class SurveyQuestionSelectBaseItem extends ReactSurveyElement {
  protected rootRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.rootRef = React.createRef();
  }
  protected getStateElement(): Base {
    return this.item;
  }
  protected get question(): QuestionSelectBase {
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
  protected get hideCaption(): boolean {
    return this.props.hideCaption === true;
  }
  protected get ariaLabel(): string {
    return this.props.ariaLabel || null;
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
  public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    if (!super.shouldComponentUpdate(nextProps, nextState)) return false;
    return (
      !this.question.customWidget ||
      !!this.question.customWidgetData.isNeedRender ||
      !!this.question.customWidget.widgetJson.isDefaultRender ||
      !!this.question.customWidget.widgetJson.render
    );
  }
  handleOnChange = (event: any) => {
    this.doOnItemChange(event);
  };
  protected doOnItemChange(event: any): void {}
  protected canRender(): boolean {
    return !!this.item && !!this.question;
  }
  protected renderElement(): React.JSX.Element {
    return <>
      {this.renderElementContent()}
      {this.renderPanel()}
      {this.renderComment()}
    </>;
  }
  protected renderElementContent(): React.JSX.Element | null {
    return null;
  }
  protected get inputStyle(): any {
    return null;//{ marginRight: "3px" };
  }
  protected renderComment(): React.JSX.Element | null {
    if (!this.item.isCommentShowing) return null;
    return <div className={this.question.getCommentAreaCss(true)}>
      <SurveyQuestionCommentValueItem
        question={this.question}
        item={this.item}
        cssClasses={this.question.cssClasses}
      />
    </div>;
  }
  protected renderPanel(): React.JSX.Element | null {
    if (this.item.renderedIsPanelShowing) {
      const panel = this.item.panel;
      return (
        <SurveyPanel
          key={panel.id}
          element={panel}
          survey={this.question.survey}
          cssClasses={this.props.cssClasses}
          isDisplayMode={this.isDisplayMode}
          creator={this.props.creator}
        />);
    }
    return null;
  }
  componentDidMount(): void {
    super.componentDidMount();
    if (!this.question.isDesignMode) {
      this.item.setRootElement(this.rootRef.current as HTMLElement);
    }
  }
  componentWillUnmount(): void {
    super.componentWillUnmount();
    if (!this.question.isDesignMode) {
      this.item.setRootElement(undefined as any);
    }
  }
}