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
  protected renderElement(): React.JSX.Element {
    var cssClasses = this.question.cssClasses;
    var showTable = this.question.renderedTable.showTable;
    var mainDiv = showTable
      ? this.renderTableDiv()
      : this.renderNoRowsContent(cssClasses);
    return (
      <div>
        {this.renderTopToolbar()}
        {mainDiv}
        {this.renderBottomToolbar()}
      </div>
    );
  }
  protected renderTopToolbar(): React.JSX.Element | null {
    if (!this.matrix.getShowToolbar("top")) return null;
    return ReactElementFactory.Instance.createElement("sv-action-bar", { model: this.matrix.toolbar });
  }
  protected renderBottomToolbar(): React.JSX.Element | null {
    if (!this.matrix.getShowToolbar("bottom")) return null;
    return ReactElementFactory.Instance.createElement("sv-action-bar", { model: this.matrix.toolbar });
  }
  protected renderNoRowsContent(cssClasses: any): React.JSX.Element {
    return ReactElementFactory.Instance.createElement("sv-placeholder-matrixdynamic", { cssClasses: cssClasses, question: this.matrix });
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrixdynamic", (props) => {
  return React.createElement(SurveyQuestionMatrixDynamic, props);
});

export class SurveyQuestionMatrixDynamicPlaceholder extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
  }
  protected renderElement(): React.JSX.Element {
    const cssClasses = this.props.cssClasses;
    const matrix = this.props.question as QuestionMatrixDynamicModel;
    const text: React.JSX.Element = this.renderLocString(matrix.locNoRowsText);
    const textDiv: React.JSX.Element = <div className={cssClasses.noRowsText}>{text}</div>;
    const toolbar: React.JSX.Element | undefined = matrix.getShowToolbar() ? ReactElementFactory.Instance.createElement("sv-action-bar", { model: matrix.toolbar }) : null;
    return (
      <div className={cssClasses.noRowsSection}>
        {textDiv}
        {toolbar}
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-placeholder-matrixdynamic",
  (props) => { return React.createElement(SurveyQuestionMatrixDynamicPlaceholder, props); });