import * as React from "react";
import { ReactSurveyElement } from "./reactquestion_element";
import { Base, ItemValue } from "survey-core";

export class SurveyQuestionOptionItem extends ReactSurveyElement {
  protected getStateElement(): Base {
    return this.item;
  }
  private get item(): ItemValue {
    return this.props.item;
  }
  protected canRender(): boolean {
    return !!this.item;
  }
  protected renderElement(): React.JSX.Element {
    return (
      <option value={this.item.value} disabled={!this.item.isEnabled}>
        {this.item.renderedText}
      </option>
    );
  }
}