import * as React from "react";
import { ISurveyCreator } from "./reactquestion";
import { SurveyModel, Question, QuestionRowModel, IElement, Base } from "survey-core";
import { SurveyElementBase } from "./reactquestion_element";
import { ReactElementFactory } from "./element-factory";
import { ReactSurveyElementsWrapper } from "./reactsurveymodel";

export class SurveyRowElement extends SurveyElementBase<any, any> {
  private rootRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
  }
  protected getStateElement(): any {
    return this.element;
  }
  private get element(): IElement {
    return this.props.element;
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
  protected renderElement(): JSX.Element {
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
        data-key={innerElement.key}
        key={innerElement.key}
        onFocus={focusIn}
      >
        {this.row.isNeedRender ? innerElement : ReactElementFactory.Instance.createElement(element.skeletonComponentName, { element: element, css: this.css, })}
      </div>
    );
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
