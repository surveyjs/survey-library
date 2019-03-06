import * as React from "react";
import { SurveyQuestion, ISurveyCreator } from "./reactquestion";
import { SurveyModel } from "../survey";
import { QuestionRowModel, PanelModel } from "../panel";
import { Question } from "../question";
import { SurveyElementBase } from "./reactquestionelement";
import { IElement } from "../base";
import { ReactElementFactory } from "./element-factory";

export class SurveyRow extends SurveyElementBase {
  private row: QuestionRowModel;
  private survey: SurveyModel;
  private creator: ISurveyCreator;
  protected css: any;
  constructor(props: any) {
    super(props);
    this.setProperties(props);
  }
  componentWillMount() {
    this.makeBaseElementReact(this.row);
  }
  componentWillUnmount() {
    this.unMakeBaseElementReact(this.row);
  }
  componentWillReceiveProps(nextProps: any) {
    this.unMakeBaseElementReact(this.row);
    this.setProperties(nextProps);
    this.makeBaseElementReact(this.row);
  }
  private setProperties(props: any) {
    this.row = props.row;
    this.survey = props.survey;
    this.creator = props.creator;
    this.css = props.css;
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
