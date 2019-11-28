import * as React from "react";
import { ISurveyCreator } from "./reactquestion";
import { SurveyModel } from "../survey";
import { QuestionRowModel, PanelModel, PanelModelBase } from "../panel";
import { SurveyElementBase } from "./reactquestionelement";
import { Base } from "../base";
import { SurveyRow } from "./row";

export class SurveyPanelBase extends SurveyElementBase {
  constructor(props: any) {
    super(props);
  }
  protected getStateElement(): Base {
    return this.panelBase;
  }
  protected get survey(): SurveyModel {
    return this.getSurvey();
  }
  protected get creator(): ISurveyCreator {
    return this.props.creator;
  }
  protected get css(): any {
    return this.getCss();
  }
  public get panelBase(): PanelModelBase {
    return this.getPanelBase();
  }
  protected getPanelBase(): PanelModelBase {
    return this.props.element;
  }
  protected getSurvey(): SurveyModel {
    return this.props.survey;
  }
  protected getCss(): any {
    return this.props.css;
  }
  componentDidMount() {
    super.componentDidMount();
    this.doAfterRender();
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    var el: any = this.refs["root"];
    if (!!el) {
      el.removeAttribute("data-rendered");
    }
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    if (
      !!prevProps.page &&
      !!this.survey &&
      !!this.survey.currentPage &&
      prevProps.page.name === this.survey.currentPage.name
    )
      return;
    this.doAfterRender();
  }
  private doAfterRender() {
    var el: any = this.refs["root"];
    if (el && this.survey) {
      if (this.panelBase.isPanel) {
        this.survey.afterRenderPanel(this.panelBase as PanelModel, el);
      } else {
        this.survey.afterRenderPage(el);
      }
    }
  }
  protected renderRows(css: any): Array<JSX.Element> {
    var rows = [];
    var questionRows = this.panelBase.rows;
    for (var i = 0; i < questionRows.length; i++) {
      rows.push(this.createRow(questionRows[i], i, css));
    }
    return rows;
  }
  protected createRow(
    row: QuestionRowModel,
    index: number,
    css: any
  ): JSX.Element {
    var rowName = "row" + (index + 1);
    return (
      <SurveyRow
        key={rowName}
        row={row}
        survey={this.survey}
        creator={this.creator}
        css={css}
      />
    );
  }
}
