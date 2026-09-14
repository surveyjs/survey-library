import * as React from "react";
import { Base, MatrixDropdownRowModelBase, QuestionMatrixDropdownModelBase } from "survey-core";
import { ReactElementFactory } from "../../../element-factory";
import { ReactSurveyElement } from "../../../reactquestion_element";
import { SvgIcon } from "../../../components/svg-icon/svg-icon";

export class SurveyQuestionMatrixDynamicDragDropIcon extends ReactSurveyElement {
  private get question(): QuestionMatrixDropdownModelBase {
    return this.props.item.data.question;
  }
  private get row(): MatrixDropdownRowModelBase {
    return this.props.item.data.row;
  }
  protected getStateElement(): Base | null {
    return this.props.item;
  }
  protected renderElement(): React.JSX.Element | null {
    return <div onPointerDown={(event: any) => { this.question.onPointerDown(event.nativeEvent, this.row); }}>{this.renderIcon()}</div>;
  }
  protected renderIcon(): React.JSX.Element {
    if (this.question.iconDragElement) {
      return <SvgIcon
        className={this.question.cssClasses.dragElementDecorator}
        size={this.props.item.iconSize}
        iconName={this.props.item.iconName}
      ></SvgIcon>;
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
