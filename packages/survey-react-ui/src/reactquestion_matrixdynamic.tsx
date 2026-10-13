import * as React from "react";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionMatrixDropdownBase } from "./reactquestion_matrixdropdownbase";
import { QuestionMatrixDynamicModel } from "survey-core";
import { ReactElementFactory } from "./element-factory";
import { ReactSurveyElement } from "./reactquestion_element";
import { PageHeightLock } from "./components/dynamic-data/page-height-lock";

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
  // Prototype (#11873): only the creation is gated on pageSize, an existing lock has to see
  // pageSize going back to 0 to release itself.
  private pageHeightLock: PageHeightLock | undefined;
  private updatePageHeightLock(): void {
    if (!this.pageHeightLock && this.matrix.pageSize > 0) {
      this.pageHeightLock = new PageHeightLock(this.matrix);
    }
    if (this.pageHeightLock) {
      this.pageHeightLock.update(this.control);
    }
  }
  componentDidMount(): void {
    super.componentDidMount();
    this.updatePageHeightLock();
  }
  componentDidUpdate(prevProps: any, prevState: any): void {
    super.componentDidUpdate(prevProps, prevState);
    this.updatePageHeightLock();
  }
  componentWillUnmount(): void {
    super.componentWillUnmount();
    if (this.pageHeightLock) {
      this.pageHeightLock.dispose();
    }
    this.pageHeightLock = undefined;
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
        {this.renderRecordsBar()}
        {this.renderBottomToolbar()}
      </div>
    );
  }
  // The records bar under the table and above the "Add row" toolbar: the pager, and the sort toolbar under it.
  protected renderRecordsBar(): React.JSX.Element | null {
    return ReactElementFactory.Instance.createElement("sv-records-bar", { model: this.matrix.recordsBar });
  }
  protected renderToolbar(location: "top" | "bottom"): React.JSX.Element | null {
    if (!this.matrix.getShowToolbar(location)) return null;
    return <div className={this.matrix.getToolbarCssClass(location)}>
      {ReactElementFactory.Instance.createElement("sv-action-bar", { model: this.matrix.toolbar })}
    </div>;
  }
  protected renderTopToolbar(): React.JSX.Element | null {
    return this.renderToolbar("top");
  }
  protected renderBottomToolbar(): React.JSX.Element | null {
    return this.renderToolbar("bottom");
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