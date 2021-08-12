import React from "react";
import { QuestionMatrixDropdownModelBase } from "survey-core";
import { ReactElementFactory } from "../../../element-factory";
import { ReactSurveyElement } from "../../../reactquestion_element";

export class SurveyQuestionMatrixDynamicDragDropIcon extends ReactSurveyElement {
  private get question(): QuestionMatrixDropdownModelBase {
    return this.props.item.data.question;
  }
  private get row(): QuestionMatrixDropdownModelBase {
    return this.props.item.data.row;
  }

  onPointerDownHandler(event: any) {
    this.question.startDragMatrixRow(event.nativeEvent, this.row);
  }

  protected renderElement(): JSX.Element {
    return (
      <span
        className={this.question.cssClasses.iconDrag}
        onPointerDown={(event: any) => this.onPointerDownHandler(event)}
      />
    );
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-matrix-drag-drop-icon",
  (props) => {
    return React.createElement(SurveyQuestionMatrixDynamicDragDropIcon, props);
  }
);
