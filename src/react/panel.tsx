import * as React from "react";
import { SurveyElementErrors } from "./reactquestion";
import { SurveyElementBase } from "./reactquestion_element";
import { ReactElementFactory } from "./element-factory";

import { SurveyPanelBase } from "./panel-base";
import { PanelModel, doKey2ClickUp } from "survey-core";
import { ReactSurveyModel } from "./reactsurveymodel";

export class SurveyPanel extends SurveyPanelBase {
  private hasBeenExpanded: boolean = false;
  constructor(props: any) {
    super(props);
    this.handleEditClick = this.handleEditClick.bind(this);
  }
  public get panel(): PanelModel {
    return this.panelBase as PanelModel;
  }
  handleEditClick(event: any) {
    this.panel.cancelPreview();
  }
  protected renderElement(): JSX.Element {
    const title: JSX.Element = this.renderTitle();
    const description: JSX.Element = this.renderDescription();
    const errors = (
      <SurveyElementErrors
        element={this.panelBase}
        cssClasses={this.panelBase.cssClasses}
        creator={this.creator}
      />
    );
    const style = {
      paddingLeft: this.panel.innerPaddingLeft,
      display: !this.panel.isCollapsed ? "block" : "none",
    };
    let content: JSX.Element = null;
    if (!this.panel.isCollapsed || this.hasBeenExpanded) {
      this.hasBeenExpanded = true;
      const rows: JSX.Element[] = this.renderRows(this.panelBase.cssClasses);
      const className: string = this.panelBase.cssClasses.panel.content;
      content = this.renderContent(style, rows, className);
    }
    const bottom: JSX.Element = this.renderBottom();
    return (
      <div
        ref={this.rootRef}
        className={this.panelBase.cssClasses.panel.container}
      >
        {title}
        {description}
        {errors}
        {content}
        {bottom}
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
    return (
      <div style={style} className={className} id={this.panel.contentId}>
        {rows}
      </div>
    );
  }
  protected renderTitle(): JSX.Element {
    if (!this.panelBase.title) return null;
    const titleComponent = ReactElementFactory.Instance.createElement(
      this.panel.getTitleComponentName(),
      { element: this.panel, cssClasses: this.panel.cssClasses.panel }
    );
    return (
      <h4
        className={this.panel.cssTitle}
        tabIndex={this.panel.titleTabIndex}
        aria-expanded={this.panel.titleAriaExpanded}
        onClick={() => {
          return this.panel.toggleState();
        }}
        onKeyUp={(evt) => {
          doKey2ClickUp(evt.nativeEvent);
        }}
      >
        {titleComponent}
      </h4>
    );
  }
  protected renderDescription(): JSX.Element {
    if (!this.panelBase.description) return null;
    var text = SurveyElementBase.renderLocString(this.panelBase.locDescription);
    return (
      <div className={this.panel.cssClasses.panel.description}>{text}</div>
    );
  }
  protected renderBottom(): JSX.Element {
    if (!this.panel.hasEditButton || !this.survey) return;
    return (
      <div className={this.panel.cssClasses.panel.footer}>
        <input
          className={this.survey.cssNavigationEdit}
          type="button"
          onClick={this.handleEditClick}
          value={this.survey.editText}
        />
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("panel", (props) => {
  return React.createElement(SurveyPanel, props);
});
