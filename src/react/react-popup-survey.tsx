import * as React from "react";
import { Survey } from "./reactSurvey";
import { Base } from "../base";
import { PopupSurveyModel } from "../popup-survey";
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
    let style: React.CSSProperties = {};
    if (!!this.popup.renderedWidth) {
      style.width = this.popup.renderedWidth;
      style.maxWidth = this.popup.renderedWidth;
    }
    return (
      <div className={this.popup.cssRoot} style={style}>
        <div className={this.popup.cssRootContent}>
          {header}
          {body}
        </div>
      </div>
    );
  }
  protected renderWindowHeader(): JSX.Element {
    var popup = this.popup;
    var headerCss = popup.cssHeaderRoot;
    var titleCollapsed: JSX.Element | null = null;
    var expandCollapseIcon;
    var closeButton: JSX.Element | null = null;

    if (popup.isCollapsed) {
      headerCss += " " + popup.cssRootCollapsedMod;
      titleCollapsed = this.renderTitleCollapsed(popup);
      expandCollapseIcon = this.renderExpandIcon();
    } else {
      expandCollapseIcon = this.renderCollapseIcon();
    }

    if (popup.allowClose) {
      closeButton = this.renderCloseButton(this.popup);
    }

    return (
      <div className={popup.cssHeaderRoot}>
        {titleCollapsed}
        <div className={popup.cssHeaderButtonsContainer}>
          <div className={popup.cssHeaderCollapseButton} onClick={this.handleOnExpanded}>
            {expandCollapseIcon}
          </div>
          {closeButton}
        </div>
      </div>
    );
  }
  protected renderTitleCollapsed(popup: PopupSurveyModel): JSX.Element | null {
    if (!popup.locTitle) return null;
    return <div className={popup.cssHeaderTitleCollapsed}>{popup.locTitle.renderedHtml}</div>;
  }
  protected renderExpandIcon(): JSX.Element {
    /* see https://github.com/surveyjs/service/issues/1668#issuecomment-1880963345 */
    return <svg className="sv-svg-icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 13H4C2.9 13 2 12.1 2 11V5C2 3.9 2.9 3 4 3H12C13.1 3 14 3.9 14 5V11C14 12.1 13.1 13 12 13ZM4 5V11H12V5H4Z"/>
    </svg>;
    //return <SvgIcon iconName={"icon-restore_16x16"} size={16}></SvgIcon>;
  }
  protected renderCollapseIcon(): JSX.Element {
    /* see https://github.com/surveyjs/service/issues/1668#issuecomment-1880963345 */
    return <svg className="sv-svg-icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 9H3C2.45 9 2 8.55 2 8C2 7.45 2.45 7 3 7H13C13.55 7 14 7.45 14 8C14 8.55 13.55 9 13 9Z"/>
    </svg>;
    // return <SvgIcon iconName={"icon-minimize_16x16"} size={16}></SvgIcon>;
  }
  protected renderCloseButton(popup: PopupSurveyModel): JSX.Element {
    /* see https://github.com/surveyjs/service/issues/1668#issuecomment-1880963345 */
    return (
      <div className={popup.cssHeaderCloseButton} onClick={() => { popup.hide(); }}>
        <svg className="sv-svg-icon" role="img" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.43 8.0025L13.7 3.7225C14.09 3.3325 14.09 2.6925 13.7 2.2925C13.31 1.9025 12.67 1.9025 12.27 2.2925L7.99 6.5725L3.72 2.3025C3.33 1.9025 2.69 1.9025 2.3 2.3025C1.9 2.6925 1.9 3.3325 2.3 3.7225L6.58 8.0025L2.3 12.2825C1.91 12.6725 1.91 13.3125 2.3 13.7125C2.69 14.1025 3.33 14.1025 3.73 13.7125L8.01 9.4325L12.29 13.7125C12.68 14.1025 13.32 14.1025 13.72 13.7125C14.11 13.3225 14.11 12.6825 13.72 12.2825L9.44 8.0025H9.43Z"/>
        </svg>
        {/* <SvgIcon iconName={"icon-close_16x16"} size={16}></SvgIcon> */}
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
