import * as React from "react";
import { ISurveyCreator } from "./reactquestion";
import { SurveyModel } from "survey-core";
import { QuestionRowModel, PanelModel, PanelModelBase } from "survey-core";
import { SurveyElementBase } from "./reactquestion_element";
import { Base } from "survey-core";
import { SurveyRow } from "./row";

export class SurveyPanelBase extends SurveyElementBase<any, any> {
  protected rootRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.rootRef = React.createRef();
  }
  protected getStateElement(): Base {
    return this.panelBase;
  }
  protected canUsePropInState(key: string): boolean {
    return key !== "elements" && super.canUsePropInState(key);
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
    return this.props.element || this.props.question;
  }
  protected getSurvey(): SurveyModel {
    return (
      this.props.survey || (!!this.panelBase ? this.panelBase.survey : null)
    );
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
  protected canRender(): boolean {
    return (
      super.canRender() && !!this.survey && !!this.panelBase
      && this.panelBase.isVisible && !!this.panelBase.survey
    );
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
