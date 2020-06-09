import * as React from "react";
import { SurveyElementErrors } from "./reactquestion";
import { SurveyElementBase } from "./reactquestionelement";
import { ReactElementFactory } from "./element-factory";

import { SurveyPanelBase } from "./panel-base";
import { PanelModel } from "../panel";

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
  render(): JSX.Element {
    if (this.panelBase == null || this.survey == null || this.creator == null)
      return null;
    if (!this.panelBase.isVisible) return null;
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
    var rootStyle: { [index: string]: any } = {};
    if (this.panel.renderWidth) {
      rootStyle["width"] = this.panel.renderWidth;
      rootStyle["flexGrow"] = 1;
      rootStyle["flexShrink"] = 1;
      rootStyle["flexBasis"] = this.panel.renderWidth;
      rootStyle["minWidth"] = this.panel["minWidth"];
      rootStyle["maxWidth"] = this.panel["maxWidth"];
    }
    var bottom = this.renderBottom();
    return (
      <div
        ref="root"
        className={this.panelBase.cssClasses.panel.container}
        style={rootStyle}
      >
        {title}
        {description}
        {errors}
        {content}
        {bottom}
      </div>
    );
  }
  protected renderContent(
    style: any,
    rows: JSX.Element[],
    className: string
  ): JSX.Element {
    return (
      <div style={style} className={className}>
        {rows}
      </div>
    );
  }
  private TitleKeyIndex = 0;
  private getTitleKey = () => {
    this.TitleKeyIndex++;
    return this.panel.name + "-titleKey-" + this.TitleKeyIndex;
  };

  protected renderTitle(): JSX.Element {
    if (!this.panelBase.title) return null;
    var getSpaceSpan = () => {
      return (
        <span data-key={this.getTitleKey()} key={this.getTitleKey()}>
          &nbsp;
        </span>
      );
    };
    var number = null;
    var numberSpace = null;
    if (!!this.panel.no) {
      number = (
        <span
          data-key={this.getTitleKey()}
          key={this.getTitleKey()}
          style={{ position: "static" }}
        >
          {this.panel.no}
        </span>
      );
      numberSpace = getSpaceSpan();
    }

    var text = SurveyElementBase.renderLocString(
      this.panelBase.locTitle,
      null,
      this.getTitleKey()
    );
    var expandCollapse = null;
    var titleStyle = this.panel.cssClasses.panel.title;
    if (this.panel.isCollapsed || this.panel.isExpanded) {
      titleStyle += " " + this.panel.cssClasses.panel.titleExpandable;
      var iconCss = this.panel.cssClasses.panel.icon;
      if (!this.panel.isCollapsed)
        iconCss += " " + this.panel.cssClasses.panel.iconExpanded;
      var changeExpanded = () => {
        if (this.panel.isCollapsed) {
          this.panel.expand();
        } else {
          this.panel.collapse();
        }
      };
      expandCollapse = <span className={iconCss} />;
    }

    return (
      <h4 className={titleStyle} onClick={changeExpanded}>
        {number}
        {numberSpace}
        {text}
        {expandCollapse}
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
