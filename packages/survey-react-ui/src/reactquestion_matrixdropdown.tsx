import * as React from "react";
import { SurveyQuestionMatrixDropdownBase } from "./reactquestion_matrixdropdownbase";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionMatrixDropdown extends SurveyQuestionMatrixDropdownBase {
  constructor(props: any) {
    super(props);
  }
  // A fragment: a matrix that does not page renders the table alone, as before the pager.
  protected renderElement(): React.JSX.Element {
    return (
      <>
        {this.renderTableDiv()}
        {this.renderRecordsBar()}
      </>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrixdropdown", props => {
  return React.createElement(SurveyQuestionMatrixDropdown, props);
});
