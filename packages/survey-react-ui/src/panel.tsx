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
  protected renderElement(): React.JSX.Element {
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
      display: this.panel.renderedIsExpanded ? undefined : "none",
    };
    let content: React.JSX.Element | null = null;
    if (this.panel.renderedIsExpanded) {
      // this.hasBeenExpanded = true;
      const rows: React.JSX.Element[] = this.renderRows(this.panelBase.cssClasses);
      const className: string = this.panelBase.cssClasses.panel.content;
      content = this.renderContent(style, rows, className);
    }
    const focusIn = () => {
      if (this.panelBase) (this.panelBase as PanelModel).focusIn();
    };
    return (
      <div
        ref={this.rootRef}
        className={(this.panelBase as PanelModel).getContainerCss()}
        onFocus={focusIn}
        id={this.panelBase.id}

      >
        {this.panel.showErrorsAbovePanel ? errors : null}
        {header}
        {this.panel.showErrorsAbovePanel ? null : errors}
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
  protected wrapElement(element: React.JSX.Element): React.JSX.Element {
    const survey: SurveyModel = this.panel.survey as SurveyModel;
    let wrapper: React.JSX.Element | null = null;
    if (survey) {
      wrapper = ReactSurveyElementsWrapper.wrapElement(survey, element, this.panel);
    }
    return wrapper ?? element;
  }
  protected renderContent(style: any, rows: React.JSX.Element[], className: string): React.JSX.Element {
    const bottom: React.JSX.Element | null = this.renderBottom();
    return (
      <div
        style={style} className={className}
        id={this.panel.contentId}
        role={this.panel.ariaRole}
        aria-labelledby={this.panel.ariaLabelledBy}
        aria-label={this.panel.ariaLabel}>
        {rows}
        {bottom}
      </div>
    );
  }
  protected renderTitle(): React.JSX.Element | null {
    if (!this.panelBase.title) return null;
    return <TitleElement element={this.panelBase}></TitleElement>;
  }
  protected renderDescription(): React.JSX.Element | null {
    if (!this.panelBase.description) return null;
    var text = SurveyElementBase.renderLocString(this.panelBase.locDescription);
    return (
      <div className={this.panel.cssClasses.panel.description}>{text}</div>
    );
  }
  protected renderBottom(): React.JSX.Element | null {
    const footerToolbar = this.panel.getFooterToolbar();
    if (!footerToolbar.hasActions) return null;
    return <SurveyActionBar model={footerToolbar}></SurveyActionBar>;
  }
  protected getIsVisible(): boolean {
    return this.panelBase.getIsContentVisible();
  }

}

ReactElementFactory.Instance.registerElement("panel", (props) => {
  return React.createElement(SurveyPanel, props);
});
