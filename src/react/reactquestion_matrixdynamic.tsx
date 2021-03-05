import * as React from "react";
import { QuestionMatrixDynamicModel } from "../question_matrixdynamic";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionMatrixDropdownBase } from "./reactquestion_matrixdropdownbase";

export class SurveyQuestionMatrixDynamic extends SurveyQuestionMatrixDropdownBase {
  constructor(props: any) {
    super(props);
    this.handleOnRowAddClick = this.handleOnRowAddClick.bind(this);
  }
  protected get matrix(): QuestionMatrixDynamicModel {
    return this.questionBase as QuestionMatrixDynamicModel;
  }
  handleOnRowAddClick(event: any) {
    this.matrix.addRow();
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
    var text = this.renderLocString(this.matrix.locEmptyRowsText);
    var textDiv = <div className={cssClasses.emptyRowsText}>{text}</div>;
    var btn = this.renderAddRowButton(cssClasses, true);
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
    var btnCss =
      cssClasses.button +
      " " +
      cssClasses.buttonAdd +
      (isEmptySection ? " " + cssClasses.emptyRowsButton : "");
    return (
      <div className={cssClasses.footer}>
        <button
          className={cssClasses.button + " " + cssClasses.buttonAdd}
          type="button"
          onClick={this.handleOnRowAddClick}
        >
          <span>{this.matrix.addRowText}</span>
          <span className={cssClasses.iconAdd} />
        </button>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrixdynamic", (props) => {
  return React.createElement(SurveyQuestionMatrixDynamic, props);
});
