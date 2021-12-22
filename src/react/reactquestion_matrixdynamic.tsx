import * as React from "react";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionMatrixDropdownBase } from "./reactquestion_matrixdropdownbase";
import { QuestionMatrixDynamicModel } from "survey-core";

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
  protected renderAddRowButtonOnTop(cssClasses: any): JSX.Element {
    if (!this.matrix.renderedTable.showAddRowOnTop) return null;
    return this.renderAddRowButton(cssClasses);
  }
  protected renderAddRowButtonOnBottom(cssClasses: any): JSX.Element {
    if (!this.matrix.renderedTable.showAddRowOnBottom) return null;
    return this.renderAddRowButton(cssClasses);
  }
  protected renderNoRowsContent(cssClasses: any): JSX.Element {
    const text: JSX.Element = this.renderLocString(this.matrix.locEmptyRowsText);
    const textDiv: JSX.Element = <div className={cssClasses.emptyRowsText}>{text}</div>;
    const btn: JSX.Element = this.renderAddRowButton(cssClasses, true);
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
    const addRowText: JSX.Element = this.renderLocString(this.matrix.locAddRowText);
    const addButton = (<button
      className={this.question.getAddRowButtonCss(isEmptySection)}
      type="button"
      disabled={this.question.isInputReadOnly}
      onClick={
        this.question.isDesignMode ? undefined : this.handleOnRowAddClick
      }
    >
      {addRowText}
      <span className={cssClasses.iconAdd} />
    </button>);
    return (
      isEmptySection ? addButton : <div className={cssClasses.footer}>{addButton}</div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrixdynamic", (props) => {
  return React.createElement(SurveyQuestionMatrixDynamic, props);
});
