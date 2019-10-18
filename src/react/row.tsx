import * as React from "react";
import { SurveyQuestion, ISurveyCreator } from "./reactquestion";
import { SurveyModel } from "../survey";
import { QuestionRowModel, PanelModel } from "../panel";
import { Question } from "../question";
import { SurveyElementBase } from "./reactquestionelement";
import { IElement, Base } from "../base";
import { ReactElementFactory } from "./element-factory";

export class SurveyRow extends SurveyElementBase {
  constructor(props: any) {
    super(props);
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
  render(): JSX.Element {
    if (this.row == null || this.survey == null || this.creator == null)
      return null;
    if (this.row.visible) {
      var elements = this.row.elements.map(element =>
        this.createElement(element)
      );
      return <div className={this.css.row}>{elements}</div>;
    }
    return null;
  }
  protected createElement(element: IElement): JSX.Element {
    var elementType = element.getType();
    if (!ReactElementFactory.Instance.isElementRegisgered(elementType)) {
      elementType = "question";
    }
    return ReactElementFactory.Instance.createElement(elementType, {
      key: element.name,
      element: element,
      creator: this.creator,
      survey: this.survey,
      css: this.css
    });
  }
}
