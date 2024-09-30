import React from "react";
import { SurveyElement, RendererFactory } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyActionBar } from "../action-bar/action-bar";
import { TitleContent } from "./title-content";

export class TitleActions extends React.Component<any, any> {
  protected get cssClasses() {
    return this.props.cssClasses;
  }
  protected get element(): SurveyElement {
    return this.props.element;
  }

  render(): JSX.Element {
    const titleContent: JSX.Element = <TitleContent element={this.element} cssClasses={this.cssClasses}></TitleContent>;
    if(!this.element.hasTitleActions) return titleContent;
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
