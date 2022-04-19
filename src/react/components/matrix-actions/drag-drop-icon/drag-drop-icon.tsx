import React from "react";
import { QuestionMatrixDropdownModelBase } from "survey-core";
import { ReactElementFactory } from "../../../element-factory";
import { ReactSurveyElement } from "../../../reactquestion_element";

export class SurveyQuestionMatrixDynamicDragDropIcon extends ReactSurveyElement {
  private get question(): QuestionMatrixDropdownModelBase {
    return this.props.item.data.question;
  }

  protected renderElement(): JSX.Element {
    if(this.question.iconDragElement) {
      return (<svg className={this.question.cssClasses.dragElementDecorator} >
        <use xlinkHref={this.question.iconDragElement}></use>
      </svg>);
    } else {
      return (<span className={this.question.cssClasses.iconDrag} />);
    }
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-matrix-drag-drop-icon",
  (props) => {
    return React.createElement(SurveyQuestionMatrixDynamicDragDropIcon, props);
  }
);
