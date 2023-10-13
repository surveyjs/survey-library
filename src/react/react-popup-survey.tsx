import * as React from "react";
import { Survey } from "./reactSurvey";
import { SurveyElementBase } from "./reactquestion_element";
import { Base, PopupSurveyModel } from "survey-core";
import { SvgIcon } from "./components/svg-icon/svg-icon";

export class PopupSurvey extends Survey {
  protected popup: PopupSurveyModel;
  constructor(props: any) {
    super(props);
    this.handleOnExpanded = this.handleOnExpanded.bind(this);
  }
  protected getStateElements(): Array<Base> {
    return [this.popup, this.popup.survey];
  }
  handleOnExpanded(event: any) {
    this.popup.changeExpandCollapse();
  }
  protected canRender(): boolean {
    return super.canRender() && this.popup.isShowing;
  }
  protected renderElement(): JSX.Element {
    var header = this.renderWindowHeader();
    var body = this.popup.isExpanded ? this.renderBody() : null;
    let style: React.CSSProperties = {
      position: "fixed",
      bottom: 3,
      right: 10
    };
    if (!!this.popup.renderedWidth) {
      style.width = this.popup.renderedWidth;
      style.maxWidth = this.popup.renderedWidth;
    }
    return (
      <div className={this.popup.cssRoot} style={style}>
        {header}
        {body}
      </div>
    );
  }
  protected renderWindowHeader(): JSX.Element {
    var styleA = { width: "100%", cursor: "pointer" };
    var styleTitle = { paddingRight: "10px" };
    var glyphClassName = this.popup.cssButton;
    glyphClassName = "glyphicon pull-right " + glyphClassName;
    var title = SurveyElementBase.renderLocString(this.survey.locTitle);
    return (
      <div className={this.popup.cssHeaderRoot}>
        <span onClick={this.handleOnExpanded} style={styleA}>
          <span className={this.popup.cssHeaderTitle} style={styleTitle}>
            {title}
          </span>
          <span className={glyphClassName} aria-hidden="true" />
        </span>
        {this.popup.allowClose ? (
          <span
            className={this.popup.cssHeaderButton}
            onClick={() => { this.popup.hide(); }}
            style={{ transform: "rotate(45deg)", float: "right", cursor: "pointer", width: "24px", height: "24px" }}
          >
            <SvgIcon iconName={"icon-expanddetail"} size={16}>
            </SvgIcon>
          </span>
        ) : null}
        {this.popup.isExpanded ? (
          <span
            className={this.popup.cssHeaderButton}
            onClick={this.handleOnExpanded}
            style={{ float: "right", cursor: "pointer", width: "24px", height: "24px" }}
          >
            <SvgIcon iconName={"icon-collapsedetail"} size={16}>
            </SvgIcon>
          </span>
        ) : null}
      </div>
    );
  }
  protected renderBody(): JSX.Element {
    return <div className={this.popup.cssBody} onScroll={() => this.popup.onScroll()}>{this.doRender()}</div>;
  }
  protected createSurvey(newProps: any) {
    if (!newProps) newProps = {};
    super.createSurvey(newProps);
    this.popup = new PopupSurveyModel(null, this.survey);
    if (newProps.closeOnCompleteTimeout) {
      this.popup.closeOnCompleteTimeout = newProps.closeOnCompleteTimeout;
    }
    this.popup.allowClose = newProps.allowClose;
    this.popup.isShowing = true;
    if (!this.popup.isExpanded && (newProps.expanded || newProps.isExpanded))
      this.popup.expand();
  }
}
/**
 * Obsolete. Please use PopupSurvey
 */
export class SurveyWindow extends PopupSurvey {}
