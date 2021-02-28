import React from "react";
import { ISurveyElement } from "survey-core";
import { RendererFactory } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { ActionBar } from "../action-bar/action-bar";

import { TitleContent } from "../title-content/title-content";

export class TitleActions extends React.Component<any, any> {
  protected get cssClasses() {
    return this.props.cssClasses;
  }
  protected get element(): ISurveyElement {
    return this.props.element;
  }

  render() {
    var titleContent = !this.element.isPage ? (
      <TitleContent
        element={this.element}
        cssClasses={this.cssClasses}
      ></TitleContent>
    ) : (
      <>{SurveyElementBase.renderLocString((this.element as any).locTitle)}</>
    );
    return (
      <div className="sv-title-actions">
        <span className="sv-title-actions__title">{titleContent}</span>
        <ActionBar items={this.element.getTitleActions()}></ActionBar>
      </div>
    );
  }
}

RendererFactory.Instance.registerRenderer(
  "element",
  "title-actions",
  "sv-title-actions"
);

ReactElementFactory.Instance.registerElement("sv-title-actions", (props) => {
  return React.createElement(TitleActions, props);
});
