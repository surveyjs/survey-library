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
  private root: React.RefObject<HTMLTableRowElement> = React.createRef();
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

  componentDidMount(): void {
    super.componentDidMount();
    if(this.root.current) {
      this.model.setRootElement(this.root.current);
    }
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.model.setRootElement(undefined as any);
  }

  public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    if (!super.shouldComponentUpdate(nextProps, nextState)) return false;
    if (nextProps.model !== this.model) {
      if(nextProps.element) {
        nextProps.element.setRootElement(this.root.current);
      }
      if(this.model) {
        this.model.setRootElement(undefined as any);
      }
    }
    return true;
  }

  render() {
    const model = this.model;
    if(!model.visible) return null;
    return (
      <tr
        ref={this.root}
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
