import * as React from "react";
import { ISurveyCreator } from "./reactquestion";
import { SurveyModel, Question, QuestionRowModel, IElement, Base, PanelModel } from "survey-core";
import { SurveyElementBase } from "./reactquestion_element";
import { ReactElementFactory } from "./element-factory";
import { ReactSurveyElementsWrapper } from "./reactsurveymodel";

export class SurveyRowElement extends SurveyElementBase<any, any> {
  private rootRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    (this.element as Question).cssClasses;
    this.rootRef = React.createRef();
  }
  protected getStateElement(): any {
    return this.element;
  }
  private get element(): PanelModel | Question {
    return this.props.element as any;
  }
  private get index(): number {
    return this.props.index;
  }
  private get row(): QuestionRowModel {
    return this.props.row;
  }
  private get survey(): SurveyModel {
    return this.props.survey;
  }
  private get creator(): ISurveyCreator {
    return this.props.creator;
  }
  protected get css(): any {
    return this.props.css;
  }

  componentDidMount(): void {
    super.componentDidMount();
    if (this.rootRef.current) {
      (this.element).setWrapperElement(this.rootRef.current);
    }
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.element.setWrapperElement(undefined);
  }

  public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    if (!super.shouldComponentUpdate(nextProps, nextState)) return false;
    if (nextProps.element !== this.element) {
      if (nextProps.element) {
        nextProps.element.setWrapperElement(this.rootRef.current);
      }
      if (this.element) {
        this.element.setWrapperElement(undefined);
      }
    }

    (this.element as Question).cssClasses;
    return true;
  }

  protected renderElement(): React.JSX.Element {
    const element = this.element;
    const innerElement = this.createElement(element, this.index);
    const css = (element as Question).cssClassesValue;
    const focusIn = () => {
      const el: any = element;
      if (el && el.isQuestion) {
        el.focusIn();
      }
    };
    return (
      <div
        className={css.questionWrapper}
        style={(element as any).rootStyle}
        data-key={element.name + this.index}
        onFocus={focusIn}
        ref={this.rootRef}
      >
        {innerElement}
      </div>
    );
  }

  protected createElement(element: IElement, elementIndex?: number): React.JSX.Element {
    if (!this.row.isNeedRender) {
      return ReactElementFactory.Instance.createElement(element.skeletonComponentName, { element: element, css: this.css, });
    }
    let elementType = (element as any).getTemplate();
    if (!ReactElementFactory.Instance.isElementRegistered(elementType)) {
      elementType = "question";
    }
    return ReactElementFactory.Instance.createElement(elementType, {
      element: element,
      creator: this.creator,
      survey: this.survey,
      css: this.css,
    });
  }
}
