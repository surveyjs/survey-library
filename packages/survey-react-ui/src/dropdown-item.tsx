import * as React from "react";
import { ReactSurveyElement } from "./reactquestion_element";
import { Base, ItemValue } from "survey-core";

export class SurveyQuestionOptionItem extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
    this.state = { changed: 0 };
    this.setupModel();
  }
  componentDidUpdate(prevProps: any, prevState: any): void {
    super.componentDidUpdate(prevProps, prevState);
    this.setupModel();
  }
  componentWillUnmount(): void {
    super.componentWillUnmount();
    if (!!this.item) {
      this.item.locText.onChanged = () => { };
    }
  }
  private setupModel(): void {
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