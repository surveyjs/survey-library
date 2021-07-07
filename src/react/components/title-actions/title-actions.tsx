import React from "react";
import { ISurveyElement, RendererFactory } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SurveyActionBar } from "../action-bar/action-bar";
import { TitleContent } from "../title-content/title-content";

export class TitleActions extends React.Component<any, any> {
  protected get cssClasses() {
    return this.props.cssClasses;
  }
  protected get element(): ISurveyElement {
    return this.props.element;
  }

  render() {
    const titleContent: JSX.Element = !this.element.isPage ? (
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
        <SurveyActionBar model={this.element.getTitleToolbar()}></SurveyActionBar>
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
