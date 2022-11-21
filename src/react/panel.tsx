import * as React from "react";
import { SurveyElementErrors } from "./reactquestion";
import { SurveyElementBase } from "./reactquestion_element";
import { ReactElementFactory } from "./element-factory";

import { SurveyPanelBase } from "./panel-base";
import { PanelModel, doKey2ClickUp, SurveyModel } from "survey-core";
import { ReactSurveyElementsWrapper } from "./reactsurveymodel";
import { SurveyActionBar } from "./components/action-bar/action-bar";
import { TitleElement } from "./components/title/title-element";
import { SurveyElementHeader } from "./element-header";

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
        id={this.panelBase.id}

      >
        {header}
        {errors}
        {content}
      </div>
    );
  }
  protected renderHeader() {
    if (!this.panel.hasTitle && !this.panel.hasDescription) {
      return null;
    }
    return <SurveyElementHeader element={this.panel}></SurveyElementHeader>;
  }
  protected wrapElement(element: JSX.Element): JSX.Element {
    const survey: SurveyModel = this.panel.survey as SurveyModel;
    let wrapper: JSX.Element;
    if (survey) {
      wrapper = ReactSurveyElementsWrapper.wrapElement(survey, element, this.panel);
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
