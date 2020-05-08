import * as React from "react";
import { PageModel } from "../page";
import { SurveyElementBase } from "./reactquestionelement";
import { PanelModelBase } from "../panel";
import { SurveyPanelBase } from "./panel-base";

export class SurveyPage extends SurveyPanelBase {
  constructor(props: any) {
    super(props);
  }
  protected getPanelBase(): PanelModelBase {
    return this.props.page;
  }
  public get page(): PageModel {
    return this.panelBase as PageModel;
  }
  render(): JSX.Element {
    if (this.page == null || this.survey == null || this.creator == null)
      return null;
    var title = this.renderTitle();
    var description = this.renderDescription();
    var rows = this.renderRows(this.panelBase.cssClasses);
    return (
      <div ref="root" className={this.panelBase.cssClasses.page.root}>
        {title}
        {description}
        {rows}
      </div>
    );
  }
  protected renderTitle(): JSX.Element {
    if (!this.page._showTitle) return null;
    var text = SurveyElementBase.renderLocString(this.page.locTitle);
    return <h4 className={this.panelBase.cssClasses.page.title}>{text}</h4>;
  }
  protected renderDescription(): JSX.Element {
    if (!this.page._showDescription) return null;
    var text = SurveyElementBase.renderLocString(this.page.locDescription);
    return <div className={this.panelBase.cssClasses.page.description}>{text}</div>;
  }
}
