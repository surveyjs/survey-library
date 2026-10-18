import * as React from "react";
import { ISurveyCreator } from "./reactquestion";
import { Base, SurveyModel, QuestionRowModel, PanelModel, PanelModelBase } from "survey-core";
import { SurveyElementBase } from "./reactquestion_element";
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
  protected get survey(): SurveyModel | null {
    return this.getSurvey();
  }
  protected get creator(): ISurveyCreator {
    return this.props.creator;
  }
  protected get css(): any {
    return this.getCss();
  }
  protected getPanelFromProps(props: any): PanelModelBase {
    return this.props.element || this.props.question;
  }
  public get panelBase(): PanelModelBase {
    return this.getPanelFromProps(this.props);
  }
  protected getPanelBase(): PanelModelBase {
    return this.props.element || this.props.question;
  }
  protected getSurvey(): SurveyModel | null {
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
    if (this.panelBase) {
      this.panelBase.beforeDestroy();
    }
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    if (
      !!prevProps.page &&
      !!this.survey &&
      !!this.survey.activePage &&
      prevProps.page.id === this.survey.activePage.id
    )
      return;
    const prevPanel = this.getPanelFromProps(prevProps);
    if (prevPanel) {
      prevPanel.beforeDestroy();
    }
    this.doAfterRender();
  }
  private doAfterRender() {
    var el = this.rootRef.current;
    if (el && this.survey) {
      if (this.panelBase.isPanel) {
        this.panelBase.afterRender(el);
      } else {
        this.survey.afterRenderPage(el);
      }
    }
  }

  protected getIsVisible() {
    return this.panelBase.isVisible;
  }

  protected canRender(): boolean {
    return (
      super.canRender() && !!this.survey && !!this.panelBase && !!this.panelBase.survey && this.getIsVisible()
    );
  }
  protected renderRows(css: any): Array<React.JSX.Element> {
    return this.panelBase.visibleRows.map((row) => this.createRow(row, css));
  }
  protected createRow(row: QuestionRowModel, css: any): React.JSX.Element {
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
