import * as React from "react";
import { ReactSurveyElement } from "./reactquestion_element";
import { Base } from "../base";
import { ItemValue } from "../itemvalue";

export class SurveyQuestionOptionItem extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
    this.state = { changed: 0 };

    if (!this.item.locText) return;
    const self = this;
    this.item.locText.onChanged = () => {
      self.setState({ changed: self.state.changed + 1 });
    };
  }
  protected getStateElement(): Base {
    return this.item;
  }
  private get item(): ItemValue {
    return this.props.item;
  }
  protected canRender(): boolean {
    return !!this.item;
  }
  protected renderElement(): JSX.Element {
    return (
      <option value={this.item.value} disabled={!this.item.isEnabled}>
        {this.item.text}
      </option>
    );
  }
}