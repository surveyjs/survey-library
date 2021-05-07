import * as React from "react";
import { SurveyElementErrors } from "./reactquestion";
import { SurveyElementBase } from "./reactquestion_element";
import { ReactElementFactory } from "./element-factory";

import { SurveyPanelBase } from "./panel-base";
import { PanelModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
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
    var title = this.renderTitle();
    var description = this.renderDescription();
    var errors = (
      <SurveyElementErrors
        element={this.panelBase}
        cssClasses={this.panelBase.cssClasses}
        creator={this.creator}
      />
    );
    var style = {
      paddingLeft: this.panel.innerPaddingLeft,
      display: !this.panel.isCollapsed ? "block" : "none",
    };
    var content = null;
    if (!this.panel.isCollapsed || this.hasBeenExpanded) {
      this.hasBeenExpanded = true;
      var rows = this.renderRows(this.panelBase.cssClasses);
      var className = this.panelBase.cssClasses.panel.content;
      content = this.renderContent(style, rows, className);
    }
    var bottom = this.renderBottom();
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
  protected renderContent(
    style: any,
    rows: JSX.Element[],
    className: string
  ): JSX.Element {
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
    var titleStyle = this.panel.cssClasses.panel.title;
    if (this.panel.isCollapsed || this.panel.isExpanded) {
      titleStyle += " " + this.panel.cssClasses.panel.titleExpandable;
    }

    if (this.panel.containsErrors) {
      titleStyle += " " + this.panel.cssClasses.panel.titleOnError;
    }

    return (
      <h4
        className={titleStyle}
        onClick={() => {
          this.panel.toggleState();
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

ReactElementFactory.Instance.registerElement("panel", props => {
  return React.createElement(SurveyPanel, props);
});
