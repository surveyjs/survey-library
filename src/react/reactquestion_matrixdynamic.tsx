import * as React from "react";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionMatrixDropdownBase } from "./reactquestion_matrixdropdownbase";
import { QuestionMatrixDynamicModel } from "survey-core";
import { ReactElementFactory } from "./element-factory";
import { ReactSurveyElement } from "./reactquestion_element";

export class SurveyQuestionMatrixDynamic extends SurveyQuestionMatrixDropdownBase {
  constructor(props: any) {
    super(props);
    this.handleOnRowAddClick = this.handleOnRowAddClick.bind(this);
  }
  protected get matrix(): QuestionMatrixDynamicModel {
    return this.questionBase as QuestionMatrixDynamicModel;
  }
  handleOnRowAddClick(event: any) {
    this.matrix.addRowUI();
  }
  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    var showTable = this.question.renderedTable.showTable;
    var mainDiv = showTable
      ? this.renderTableDiv()
      : this.renderNoRowsContent(cssClasses);
    return (
      <div>
        {this.renderAddRowButtonOnTop(cssClasses)}
        {mainDiv}
        {this.renderAddRowButtonOnBottom(cssClasses)}
      </div>
    );
  }
  protected renderAddRowButtonOnTop(cssClasses: any): JSX.Element | null {
    if (!this.matrix.renderedTable.showAddRowOnTop) return null;
    return this.renderAddRowButton(cssClasses);
  }
  protected renderAddRowButtonOnBottom(cssClasses: any): JSX.Element | null {
    if (!this.matrix.renderedTable.showAddRowOnBottom) return null;
    return this.renderAddRowButton(cssClasses);
  }
  protected renderNoRowsContent(cssClasses: any): JSX.Element {
    const text: JSX.Element = this.renderLocString(this.matrix.locEmptyRowsText);
    const textDiv: JSX.Element = <div className={cssClasses.emptyRowsText}>{text}</div>;
    const btn: JSX.Element|undefined = this.matrix.renderedTable.showAddRow ? this.renderAddRowButton(cssClasses, true) : undefined;
    return (
      <div className={cssClasses.emptyRowsSection}>
        {textDiv}
        {btn}
      </div>
    );
  }
  protected renderAddRowButton(
    cssClasses: any,
    isEmptySection: boolean = false
  ): JSX.Element {
    return ReactElementFactory.Instance.createElement("sv-matrixdynamic-add-btn", {
      question: this.question, cssClasses, isEmptySection
    });
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrixdynamic", (props) => {
  return React.createElement(SurveyQuestionMatrixDynamic, props);
});

export class SurveyQuestionMatrixDynamicAddButton extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
    this.handleOnRowAddClick = this.handleOnRowAddClick.bind(this);
  }
  protected get matrix(): QuestionMatrixDynamicModel {
    return this.props.question as QuestionMatrixDynamicModel;
  }
  handleOnRowAddClick(event: any) {
    this.matrix.addRowUI();
  }
  protected renderElement(): JSX.Element {
    const addRowText: JSX.Element = this.renderLocString(this.matrix.locAddRowText);
    const addButton = (<button
      className={this.matrix.getAddRowButtonCss(this.props.isEmptySection)}
      type="button"
      disabled={this.matrix.isInputReadOnly}
      onClick={
        this.matrix.isDesignMode ? undefined : this.handleOnRowAddClick
      }
    >
      {addRowText}
      <span className={this.props.cssClasses.iconAdd} />
    </button>);
    return (
      this.props.isEmptySection ? addButton : <div className={this.props.cssClasses.footer}>{addButton}</div>
    );
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-matrixdynamic-add-btn",
  (props) => {
    return React.createElement(SurveyQuestionMatrixDynamicAddButton, props);
  }
);
