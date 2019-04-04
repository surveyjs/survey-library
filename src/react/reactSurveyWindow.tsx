import * as React from "react";
import { Survey } from "./reactSurvey";
import { ReactWindowModel } from "./reactsurveymodel";
import { SurveyElementBase } from "./reactquestionelement";

export class SurveyWindow extends Survey {
  protected window: ReactWindowModel;
  constructor(props: any) {
    super(props);
    this.handleOnExpanded = this.handleOnExpanded.bind(this);
  }
  componentWillReceiveProps(nextProps: any) {
    this.unMakeBaseElementReact(this.window);
    this.updateSurvey(nextProps, this.props);
    this.makeBaseElementReact(this.window);
  }
  handleOnExpanded(event: any) {
    this.window.isExpanded = !this.window.isExpanded;
  }
  render(): JSX.Element {
    if (!this.window.isShowing) return null;
    var header = this.renderHeader();
    var body = this.window.isExpanded ? this.renderBody() : null;
    let style: React.CSSProperties = {
      position: "fixed",
      bottom: 3,
      right: 10,
      maxWidth: "60%"
    };
    return (
      <div className={this.css.window.root} style={style}>
        {header}
        {body}
      </div>
    );
  }
  protected renderHeader(): JSX.Element {
    var styleA = { width: "100%", cursor: "pointer" };
    var styleTitle = { paddingRight: "10px" };
    var glyphClassName = this.window.isExpanded
      ? this.css.window.header.buttonCollapsed
      : this.css.window.header.buttonExpanded;
    glyphClassName = "glyphicon pull-right " + glyphClassName;
    var title = SurveyElementBase.renderLocString(this.survey.locTitle);
    return (
      <div className={this.css.window.header.root}>
        <span onClick={this.handleOnExpanded} style={styleA}>
          <span className={this.css.window.header.title} style={styleTitle}>
            {title}
          </span>
          <span className={glyphClassName} aria-hidden="true" />
        </span>
        {this.window.isExpanded ? (
          <span
            onClick={this.handleOnExpanded}
            style={{ float: "right", cursor: "pointer" }}
          >
            <span className={this.css.window.header.title} style={styleTitle}>
              X
            </span>
          </span>
        ) : null}
      </div>
    );
  }
  protected renderBody(): JSX.Element {
    return <div className={this.css.window.body}>{this.doRender()}</div>;
  }
  protected updateSurvey(newProps: any, prevProps: any) {
    if (!newProps) newProps = {};
    super.updateSurvey(newProps, prevProps);
    this.window = new ReactWindowModel(null, this.survey);
    if (newProps.closeOnCompleteTimeout) {
      this.window.closeOnCompleteTimeout = newProps.closeOnCompleteTimeout;
    }
    if (newProps.expanded || newProps.isExpanded) this.window.expand();
    this.window.isShowing = true;
    var self = this;
    this.window.closeWindowOnCompleteCallback = function() {
      self.window.hide();
    };
  }
  componentWillMount() {
    super.componentWillMount();
    this.makeBaseElementReact(this.window);
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    this.unMakeBaseElementReact(this.window);
  }
}
