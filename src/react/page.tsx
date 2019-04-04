import * as React from "react";
import { PageModel } from "../page";
import { SurveyElementBase } from "./reactquestionelement";

import { SurveyPanelBase } from "./panel-base";

export class SurveyPage extends SurveyPanelBase {
  constructor(props: any) {
    super(props);
    this.panelBase = props.page;
  }
  componentWillReceiveProps(nextProps: any) {
    this.unMakeBaseElementReact(this.panelBase);
    super.componentWillReceiveProps(nextProps);
    this.panelBase = nextProps.page;
    this.makeBaseElementReact(this.panelBase);
  }
  public get page(): PageModel {
    return this.panelBase as PageModel;
  }
  render(): JSX.Element {
    if (this.page == null || this.survey == null || this.creator == null)
      return null;
    var title = this.renderTitle();
    var description = this.renderDescription();
    var rows = this.renderRows();
    return (
      <div ref="root" className={this.css.page.root}>
        {title}
        {description}
        {rows}
      </div>
    );
  }
  protected renderTitle(): JSX.Element {
    if (!this.page.title || !this.survey.showPageTitles) return null;
    var text = SurveyElementBase.renderLocString(this.page.locTitle);
    return <h4 className={this.css.pageTitle}>{text}</h4>;
  }
  protected renderDescription(): JSX.Element {
    if (!this.page.description || !this.survey.showPageTitles) return null;
    var text = SurveyElementBase.renderLocString(this.page.locDescription);
    return <div className={this.css.pageDescription}>{text}</div>;
  }
}
