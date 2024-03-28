import * as React from "react";
import { ISurveyCreator } from "./reactquestion";
import { SurveyModel, Question, QuestionRowModel, IElement, Base } from "survey-core";
import { SurveyElementBase } from "./reactquestion_element";
import { SurveyRowElement } from "./element";
import { ReactElementFactory } from "./element-factory";
import { ReactSurveyElementsWrapper } from "./reactsurveymodel";

export class SurveyRow extends SurveyElementBase<any, any> {
  private rootRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.rootRef = React.createRef();
    this.recalculateCss();
  }
  private recalculateCss() {
    this.row.visibleElements.map(element => (element as Question).cssClasses);
  }
  protected getStateElement(): Base {
    return this.row;
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
  protected canRender(): boolean {
    return !!this.row && !!this.survey && !!this.creator;
  }
  protected renderElementContent(): JSX.Element {
    const elements = this.row.visibleElements.map((element, elementIndex) => {
      const index = elementIndex ? "-" + elementIndex : 0;
      const key = element.name + index;
      return (
        <SurveyRowElement
          element={element}
          index={elementIndex}
          row={this.row}
          survey={this.survey}
          creator={this.creator}
          css={this.css}
          key={key}
        >
        </SurveyRowElement>
      );
    });

    return (
      <div ref={this.rootRef} className={this.row.getRowCss()} >
        {elements}
      </div>
    );
  }
  protected renderElement(): JSX.Element {
    const survey: SurveyModel = this.survey as SurveyModel;
    const content = this.renderElementContent();
    const wrapper = ReactSurveyElementsWrapper.wrapRow(survey, content, this.row);
    return wrapper || content;
  }
  componentDidMount() {
    super.componentDidMount();
    var el = this.rootRef.current;
    if(this.rootRef.current) {
      this.row.setRootElement(this.rootRef.current);
    }
    if (!!el && !this.row.isNeedRender) {
      var rowContainerDiv = el;
      setTimeout(() => {
        this.row.startLazyRendering(rowContainerDiv);
      }, 10);
    }
  }
  public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    if (!super.shouldComponentUpdate(nextProps, nextState)) return false;
    if (nextProps.row !== this.row) {
      nextProps.row.isNeedRender = this.row.isNeedRender;
      nextProps.row.setRootElement(this.rootRef.current);
      this.row.setRootElement(undefined);
      this.stopLazyRendering();
    }
    this.recalculateCss();
    return true;
  }
  private stopLazyRendering() {
    this.row.stopLazyRendering();
    this.row.isNeedRender = !this.row.isLazyRendering();
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    this.row.setRootElement(undefined);
    this.stopLazyRendering();
  }

  protected createElement(element: IElement, elementIndex?: number): JSX.Element {
    const index = elementIndex ? "-" + elementIndex : 0;
    var elementType = element.getType();
    if (!ReactElementFactory.Instance.isElementRegistered(elementType)) {
      elementType = "question";
    }
    return ReactElementFactory.Instance.createElement(elementType, {
      key: element.name + index,
      element: element,
      creator: this.creator,
      survey: this.survey,
      css: this.css,
    });
  }
}
