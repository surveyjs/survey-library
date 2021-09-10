import * as React from "react";
import { PageModel } from "survey-core";
import { SurveyElementBase } from "./reactquestion_element";
import { PanelModelBase } from "survey-core";
import { SurveyPanelBase } from "./panel-base";
import { TitleElement } from "./components/title/title-element";

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
  protected renderElement(): JSX.Element {
    var title = this.renderTitle();
    var description = this.renderDescription();
    var rows = this.renderRows(this.panelBase.cssClasses);
    return (
      <div ref={this.rootRef} className={this.panelBase.cssClasses.page.root}>
        {title}
        {description}
        {rows}
      </div>
    );
  }
  protected renderTitle(): JSX.Element {
    return <TitleElement element={this.page}></TitleElement>;
  }
  protected renderDescription(): JSX.Element {
    if (!this.page._showDescription) return null;
    var text = SurveyElementBase.renderLocString(this.page.locDescription);
    return (
      <div className={this.panelBase.cssClasses.page.description}>{text}</div>
    );
  }
}
