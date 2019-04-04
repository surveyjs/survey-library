import * as React from "react";
import { SurveyElementErrors } from "./reactquestion";
import { SurveyElementBase } from "./reactquestionelement";
import { ReactElementFactory } from "./element-factory";

import { SurveyPanelBase } from "./panel-base";
import { PanelModel } from "../panel";

export class SurveyPanel extends SurveyPanelBase {
  constructor(props: any) {
    super(props);
    this.panelBase = props.element;
  }
  componentWillReceiveProps(nextProps: any) {
    this.unMakeBaseElementReact(this.panelBase);
    super.componentWillReceiveProps(nextProps);
    this.panelBase = nextProps.element;
    this.makeBaseElementReact(this.panelBase);
  }
  public get panel(): PanelModel {
    return this.panelBase as PanelModel;
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

    var rows = this.renderRows();
    var style = {
      paddingLeft: this.panel.innerPaddingLeft,
      display: !this.panel.isCollapsed ? "block" : "none"
    };
    var rootStyle: { [index: string]: any } = {};
    if (this.panel.renderWidth) rootStyle["width"] = this.panel.renderWidth;
    var bottom = this.renderBottom();
    return (
      <div ref="root" className={this.css.panel.container} style={rootStyle}>
        {title}
        {description}
        {errors}
        {this.renderContent(style, rows)}
        {bottom}
      </div>
    );
  }
  protected renderContent(style: any, rows: JSX.Element[]): JSX.Element {
    return <div style={style}>{rows}</div>;
  }
  protected renderTitle(): JSX.Element {
    if (!this.panelBase.title) return null;
    var text = SurveyElementBase.renderLocString(this.panelBase.locTitle);
    var expandCollapse = null;
    var titleStyle = this.css.panel.title;
    if (this.panel.isCollapsed || this.panel.isExpanded) {
      titleStyle += " sv_p_title_expandable";
      var iconCss = "sv_panel_icon";
      if (!this.panel.isCollapsed) iconCss += " sv_expanded";
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
        {text}
        {expandCollapse}
      </h4>
    );
  }
  protected renderDescription(): JSX.Element {
    if (!this.panelBase.description) return null;
    var text = SurveyElementBase.renderLocString(this.panelBase.locDescription);
    return <div className={this.css.panel.description}>{text}</div>;
  }
  protected renderBottom(): JSX.Element {
    return null;
  }
}

ReactElementFactory.Instance.registerElement("panel", props => {
  return React.createElement(SurveyPanel, props);
});
