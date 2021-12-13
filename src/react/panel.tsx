import * as React from "react";
import { SurveyElementErrors } from "./reactquestion";
import { SurveyElementBase } from "./reactquestion_element";
import { ReactElementFactory } from "./element-factory";

import { SurveyPanelBase } from "./panel-base";
import { PanelModel, doKey2ClickUp } from "survey-core";
import { ReactSurveyModel } from "./reactsurveymodel";
import { SurveyActionBar } from "./components/action-bar/action-bar";
import { TitleElement } from "./components/title/title-element";

export class SurveyPanel extends SurveyPanelBase {
  private hasBeenExpanded: boolean = false;
  constructor(props: any) {
    super(props);
  }
  public get panel(): PanelModel {
    return this.panelBase as PanelModel;
  }
  protected renderElement(): JSX.Element {
    const header = this.renderHeader();
    const errors = (
      <SurveyElementErrors
        element={this.panelBase}
        cssClasses={this.panelBase.cssClasses}
        creator={this.creator}
      />
    );
    const style = {
      paddingLeft: this.panel.innerPaddingLeft,
      display: !this.panel.isCollapsed ? undefined : "none",
    };
    let content: JSX.Element = null;
    if (!this.panel.isCollapsed || this.hasBeenExpanded) {
      this.hasBeenExpanded = true;
      const rows: JSX.Element[] = this.renderRows(this.panelBase.cssClasses);
      const className: string = this.panelBase.cssClasses.panel.content;
      content = this.renderContent(style, rows, className);
    }
    return (
      <div
        ref={this.rootRef}
        className={(this.panelBase as PanelModel).getContainerCss()}
        onFocus={(this.panelBase as PanelModel).focusIn}
      >
        {header}
        {errors}
        {content}
      </div>
    );
  }
  protected renderHeader() {
    if (!this.panelBase.hasTitle && !this.panelBase.hasDescription) {
      return null;
    }
    const title: JSX.Element = this.renderTitle();
    const description: JSX.Element = this.renderDescription();
    return (
      <div className={this.panelBase.cssClasses.panel.header}>
        {title}
        {description}
      </div>
    );
  }
  protected wrapElement(element: JSX.Element): JSX.Element {
    const survey: ReactSurveyModel = this.panel.survey as ReactSurveyModel;
    let wrapper: JSX.Element;
    if (survey) {
      wrapper = survey.wrapElement(element, this.panel);
    }
    return wrapper ?? element;
  }
  protected renderContent(style: any, rows: JSX.Element[], className: string): JSX.Element {
    const bottom: JSX.Element = this.renderBottom();
    return (
      <div style={style} className={className} id={this.panel.contentId}>
        {rows}
        {bottom}
      </div>
    );
  }
  protected renderTitle(): JSX.Element {
    if (!this.panelBase.title) return null;
    return <TitleElement element={this.panelBase}></TitleElement>;
  }
  protected renderDescription(): JSX.Element {
    if (!this.panelBase.description) return null;
    var text = SurveyElementBase.renderLocString(this.panelBase.locDescription);
    return (
      <div className={this.panel.cssClasses.panel.description}>{text}</div>
    );
  }
  protected renderBottom(): JSX.Element {
    const footerToolbar = this.panel.getFooterToolbar();
    if (!footerToolbar.hasActions) return null;
    return <SurveyActionBar model={footerToolbar}></SurveyActionBar>;
  }
}

ReactElementFactory.Instance.registerElement("panel", (props) => {
  return React.createElement(SurveyPanel, props);
});
