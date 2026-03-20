import * as React from "react";
import { Base, CharacterCounter } from "survey-core";
import { ICharacterCounterAction } from "survey-core";
import { ReactElementFactory } from "../element-factory";
import { SurveyElementBase } from "../reactquestion_element";

export type ICharacterCounterComponentProps = {
  counter?: CharacterCounter,
  remainingCharacterCounter?: string,
  item?: ICharacterCounterAction,
}

export class CharacterCounterComponent extends SurveyElementBase<ICharacterCounterComponentProps, any> {
  protected get counter() {
    if (!!this.props.item) {
      return this.props.item.data.counter;
    } else {
      return this.props.counter;
    }
  }
  protected get remainingCharacterCounter() {
    if (!!this.props.item) {
      return this.props.item.data.remainingCharacterCounter;
    } else {
      return this.props.remainingCharacterCounter;
    }
  }
  protected getStateElement(): Base {
    return this.counter;
  }

  renderElement(): React.JSX.Element | null {
    if (!this.counter) return null;
    return (<div className={this.remainingCharacterCounter}>{this.counter.remainingCharacterCounter}</div>);
  }
}

ReactElementFactory.Instance.registerElement("sv-character-counter", (props) => {
  return React.createElement(CharacterCounterComponent, props);
});