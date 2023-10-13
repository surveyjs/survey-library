import React from "react";
import ReactDOM from "react-dom";
import { QuestionMatrixDropdownRenderedRow, QuestionMatrixDropdownModelBase } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";

interface IMatrixRowProps {
  model: QuestionMatrixDropdownRenderedRow;
  parentMatrix: QuestionMatrixDropdownModelBase;
}

export class MatrixRow extends SurveyElementBase<IMatrixRowProps, any> {
  constructor(props: IMatrixRowProps) {
    super(props);
  }
  get model(): QuestionMatrixDropdownRenderedRow {
    return this.props.model;
  }
  get parentMatrix(): QuestionMatrixDropdownModelBase {
    return this.props.parentMatrix;
  }
  protected getStateElement() {
    return this.model;
  }
  protected onPointerDownHandler = (event: any) => {
    this.parentMatrix.onPointerDown(event.nativeEvent, this.model.row);
  }

  render() {
    const model = this.model;
    if(!model.visible) return null;
    return (
      <tr
        className={model.className}
        data-sv-drop-target-matrix-row={model.row && model.row.id}
        onPointerDown={(event: any) => this.onPointerDownHandler(event)}
      >
        {this.props.children}
      </tr>
    );
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-matrix-row",
  (props: IMatrixRowProps) => {
    return React.createElement(MatrixRow, props);
  }
);
