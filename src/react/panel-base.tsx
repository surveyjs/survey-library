import * as React from "react";
import { ISurveyCreator } from "./reactquestion";
import { SurveyModel } from "../survey";
import { QuestionRowModel, PanelModel, PanelModelBase } from "../panel";
import { SurveyElementBase } from "./reactquestionelement";
import { Base } from "../base";
import { SurveyRow } from "./row";

export class SurveyPanelBase extends SurveyElementBase {
  protected rootRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.rootRef = React.createRef();
  }
  protected getStateElement(): Base {
    return this.panelBase;
  }
  protected modifyNonStateProps(nonStateProps: Array<string>) {
    super.modifyNonStateProps(nonStateProps);
    nonStateProps.push("elements");
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
    var el = this.rootRef.current;
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
    var el = this.rootRef.current;
    if (el && this.survey) {
      if (this.panelBase.isPanel) {
        this.survey.afterRenderPanel(this.panelBase as PanelModel, el);
      } else {
        this.survey.afterRenderPage(el);
      }
    }
  }
  private renderedRowsCache: any = {};
  protected renderRows(css: any): Array<JSX.Element> {
    if (this.changedStatePropName !== "rows") {
      this.renderedRowsCache = {};
    }
    var rows = [];
    var questionRows = this.panelBase.rows;
    for (var i = 0; i < questionRows.length; i++) {
      var row = this.renderedRowsCache[questionRows[i].id];
      if (!row) {
        row = this.createRow(questionRows[i], css);
        this.renderedRowsCache[questionRows[i].id] = row;
      }
      rows.push(row);
    }
    return rows;
  }
  protected createRow(row: QuestionRowModel, css: any): JSX.Element {
    return (
      <SurveyRow
        key={row.id}
        row={row}
        survey={this.survey}
        creator={this.creator}
        css={css}
      />
    );
  }
}
