import * as React from "react";
import { Survey } from "./reactSurvey";
import { ReactSurveyModel, ReactWindowModel } from "./reactsurveymodel";
import { SurveyModel } from "../survey";
import { SurveyElementBase } from "./reactquestionelement";

export class SurveyWindow extends Survey {
  protected window: ReactWindowModel;
  constructor(props: any) {
    super(props);
    this.handleOnExpanded = this.handleOnExpanded.bind(this);
  }
  componentWillReceiveProps(nextProps: any) {
    this.updateSurvey(nextProps);
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
  protected updateSurvey(newProps: any) {
    if (!newProps) newProps = {};
    if (newProps.window) {
      this.window = newProps.window;
    } else {
      if (newProps.json) {
        this.window = new ReactWindowModel(newProps.json);
      } else {
        if (newProps.model) {
          this.window = new ReactWindowModel(null, newProps.model);
        }
      }
    }
    if (!this.window) {
      this.window = new ReactWindowModel();
    }
    if (newProps.closeOnCompleteTimeout) {
      this.window.closeOnCompleteTimeout = newProps.closeOnCompleteTimeout;
    }

    if (newProps.expanded || newProps.isExpanded) this.window.expand();
    this.window.isShowing = true;

    super.updateSurvey(newProps);
    this.setState({
      expanded: this.window.isExpanded,
      isShowing: this.window.isShowing
    });
    var self = this;
    this.window.expandedChangedCallback = function() {
      self.setState({ expanded: self.window.isExpanded });
    };
    this.window.showingChangedCallback = function() {
      self.setState({ isShowing: self.window.isShowing });
    };
    this.window.closeWindowOnCompleteCallback = function() {
      self.window.hide();
    };
  }
}
