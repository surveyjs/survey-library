import React from "react";
import ReactDOM from "react-dom";
import { QuestionMatrixDropdownRenderedRow } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";

interface IMAtrixRowProps {
  model: QuestionMatrixDropdownRenderedRow;
}

export class MatrixRow extends SurveyElementBase<IMAtrixRowProps, any> {
  constructor(props: IMAtrixRowProps) {
    super(props);
  }
  get model(): QuestionMatrixDropdownRenderedRow {
    return this.props.model;
  }
  protected getStateElement() {
    return this.model;
  }
  render() {
    const model = this.model;
    return (
      <tr
        className={model.className}
        data-sv-drop-target-matrix-row={model.row && model.row.id}
      >
        {this.props.children}
      </tr>
    );
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-matrix-row",
  (props: IMAtrixRowProps) => {
    return React.createElement(MatrixRow, props);
  }
);
