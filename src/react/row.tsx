import * as React from "react";
import { ISurveyCreator } from "./reactquestion";
import { SurveyModel } from "survey-core";
import { QuestionRowModel } from "survey-core";
import { SurveyElementBase } from "./reactquestion_element";
import { IElement, Base } from "survey-core";
import { ReactElementFactory } from "./element-factory";
import { settings } from "survey-core";
import { ReactSurveyModel } from "./reactsurveymodel";
import { Question } from "../question";

export class SurveyRow extends SurveyElementBase<any, any> {
  private rootRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.rootRef = React.createRef();
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
    return !!this.row && !!this.survey && !!this.creator && this.row.visible;
  }
  protected renderElementContent(): JSX.Element {
    var elements = null;
    elements = this.row.visibleElements.map((element, index) => {
      const innerElement = this.createElement(element, index);
      const css = (element as Question).cssClasses;
      return (
        <div
          className={css.questionWrapper}
          style={(element as any).rootStyle}
          data-key={innerElement.key}
          key={innerElement.key}
          onFocus={(element as Question).focusIn}
        >
          {this.row.isNeedRender ? innerElement : ReactElementFactory.Instance.createElement(element.skeletonComponentName, { element: element, css: this.css, })}
        </div>
      );
    });

    return (
      <div ref={this.rootRef} className={this.row.getRowCss()} >
        {elements}
      </div>
    );
  }
  protected renderElement(): JSX.Element {
    const survey: ReactSurveyModel = this.survey as ReactSurveyModel;
    const content = this.renderElementContent();
    const wrapper = survey.wrapRow(content, this.row);
    return wrapper || content;
  }
  componentDidMount() {
    super.componentDidMount();
    var el = this.rootRef.current;
    if (!!el && !this.row.isNeedRender) {
      var rowContainerDiv = el;
      setTimeout(() => {
        this.row.startLazyRendering(rowContainerDiv);
      }, 10);
    }
  }
  public shouldComponentUpdate(nextProps: any, nextState: any): boolean {
    if (nextProps.row !== this.row) {
      nextProps.row.isNeedRender = this.row.isNeedRender;
      this.stopLazyRendering();
    }
    return true;
  }
  private stopLazyRendering() {
    this.row.stopLazyRendering();
    this.row.isNeedRender = !this.row.isLazyRendering();
  }
  componentWillUnmount() {
    super.componentWillUnmount();
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
