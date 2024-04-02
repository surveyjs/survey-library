import * as React from "react";
import { Base, PopupSurveyModel } from "survey-core";
import { Survey } from "./reactSurvey";
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
    var body = this.renderBody();
    let style: React.CSSProperties = {};
    if (!!this.popup.renderedWidth) {
      style.width = this.popup.renderedWidth;
      style.maxWidth = this.popup.renderedWidth;
    }
    return (
      <div className={this.popup.cssRoot} style={style} onScroll={() => this.popup.onScroll()}>
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
    var allowFullScreenButon: JSX.Element | null = null;

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

    if (popup.allowFullScreen) {
      allowFullScreenButon = this.renderAllowFullScreenButon(this.popup);
    }

    return (
      <div className={popup.cssHeaderRoot}>
        {titleCollapsed}
        <div className={popup.cssHeaderButtonsContainer}>
          {allowFullScreenButon}
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
    return <SvgIcon iconName={"icon-restore_16x16"} size={16}></SvgIcon>;
  }
  protected renderCollapseIcon(): JSX.Element {
    return <SvgIcon iconName={"icon-minimize_16x16"} size={16}></SvgIcon>;
  }
  protected renderCloseButton(popup: PopupSurveyModel): JSX.Element {
    return (
      <div className={popup.cssHeaderCloseButton} onClick={() => { popup.hide(); }}>
        <SvgIcon iconName={"icon-close_16x16"} size={16}></SvgIcon>
      </div>
    );
  }
  protected renderAllowFullScreenButon(popup: PopupSurveyModel): JSX.Element {
    let Icon;

    if (popup.isFullScreen) {
      Icon = <SvgIcon iconName={"icon-back-to-panel_16x16"} size={16}></SvgIcon>;
    } else {
      Icon = <SvgIcon iconName={"icon-full-screen_16x16"} size={16}></SvgIcon>;
    }

    return (
      <div className={popup.cssHeaderFullScreenButton} onClick={() => { popup.toggleFullScreen(); }}>
        {Icon}
      </div>
    );
  }
  protected renderBody(): JSX.Element {
    return <div className={this.popup.cssBody}>{this.doRender()}</div>;
  }
  protected createSurvey(newProps: any) {
    if (!newProps) newProps = {};
    super.createSurvey(newProps);
    this.popup = new PopupSurveyModel(null, this.survey);
    if (newProps.closeOnCompleteTimeout) {
      this.popup.closeOnCompleteTimeout = newProps.closeOnCompleteTimeout;
    }
    this.popup.allowClose = newProps.allowClose;
    this.popup.allowFullScreen = newProps.allowFullScreen;
    this.popup.isShowing = true;
    if (!this.popup.isExpanded && (newProps.expanded || newProps.isExpanded))
      this.popup.expand();
  }
}
/**
 * Obsolete. Please use PopupSurvey
 */
export class SurveyWindow extends PopupSurvey {}
