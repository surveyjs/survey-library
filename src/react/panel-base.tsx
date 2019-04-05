import * as React from "react";
import { ISurveyCreator } from "./reactquestion";
import { SurveyModel } from "../survey";
import { QuestionRowModel, PanelModel, PanelModelBase } from "../panel";
import { SurveyElementBase } from "./reactquestionelement";
import { SurveyRow } from "./row";

export class SurveyPanelBase extends SurveyElementBase {
  private panelValue: PanelModelBase;
  protected survey: SurveyModel;
  protected creator: ISurveyCreator;
  protected css: any;
  constructor(props: any) {
    super(props);
    this.survey = props.survey;
    this.creator = props.creator;
    this.css = props.css;
  }
  componentWillReceiveProps(nextProps: any) {
    this.survey = nextProps.survey;
    this.creator = nextProps.creator;
    this.css = nextProps.css;
  }
  public get panelBase(): PanelModelBase {
    return this.panelValue;
  }
  public set panelBase(val: PanelModelBase) {
    this.panelValue = val;
  }
  componentWillMount() {
    this.makeBaseElementReact(this.panelBase);
  }
  componentDidMount() {
    this.doAfterRender();
  }
  componentWillUnmount() {
    this.unMakeBaseElementReact(this.panelBase);
    var el: any = this.refs["root"];
    if (!!el) {
      el.removeAttribute("data-rendered");
    }
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    if (
      !!prevProps.page &&
      !!this.survey &&
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
  protected renderRows(): Array<JSX.Element> {
    var rows = [];
    var questionRows = this.panelBase.rows;
    for (var i = 0; i < questionRows.length; i++) {
      rows.push(this.createRow(questionRows[i], i));
    }
    return rows;
  }
  protected createRow(row: QuestionRowModel, index: number): JSX.Element {
    var rowName = "row" + (index + 1);
    return (
      <SurveyRow
        key={rowName}
        row={row}
        survey={this.survey}
        creator={this.creator}
        css={this.css}
      />
    );
  }
}
