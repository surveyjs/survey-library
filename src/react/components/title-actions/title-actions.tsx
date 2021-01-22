import React from "react";
import { ISurveyElement } from "../../../base";
import { RendererFactory } from "../../../rendererFactory";
import { ReactElementFactory } from "../../element-factory";
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
    return (
      <div className="sv-title-actions">
        <span className="sv-title-actions__title">
          <TitleContent
            element={this.element}
            cssClasses={this.cssClasses}
          ></TitleContent>
        </span>
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
