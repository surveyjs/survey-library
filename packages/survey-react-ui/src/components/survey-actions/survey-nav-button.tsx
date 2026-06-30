import * as React from "react";
import { Action } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { ReactSurveyElement } from "../../reactquestion_element";

export class SurveyNavigationButton extends ReactSurveyElement {
  private inputElement: HTMLInputElement | null = null;
  private inputParent: Node | null = null;
  protected get item(): Action {
    return this.props.item;
  }
  protected canRender(): boolean {
    return this.item.isVisible;
  }
  private setInputRef = (element: HTMLInputElement | null): void => {
    if (!element && !!this.inputElement && !!this.inputParent && this.inputElement.parentNode !== this.inputParent) {
      this.inputParent.appendChild(this.inputElement);
    }
    this.inputElement = element;
    this.inputParent = element?.parentNode ?? this.inputParent;
  };
  protected renderElement(): React.JSX.Element {
    return (
      <input
        ref={this.setInputRef}
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