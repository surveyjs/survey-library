import React from "react";
import { Action } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { ReactSurveyElement } from "../../reactquestion_element";

export class SurveyNavigationButton extends ReactSurveyElement {
  protected get item(): Action {
    return this.props.item;
  }
  protected canRender(): boolean {
    return this.item.isVisible;
  }
  protected renderElement(): JSX.Element {
    return (
      <input
        className={this.item.innerCss}
        type="button"
        disabled={this.item.disabled}
        onMouseDown={this.item.data && this.item.data.mouseDown}
        onClick={this.item.action}
        title={this.item.getTooltip()}
        value={this.item.title}
      />
    );
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-nav-btn",
  (props) => {
    return React.createElement(SurveyNavigationButton, props);
  }
);