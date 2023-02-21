import React from "react";
import { Base, CharacterCounter } from "survey-core";
import { ReactElementFactory } from "../element-factory";
import { SurveyElementBase } from "../reactquestion_element";

export interface ICharacterCounterComponentProps {
  counter: CharacterCounter;
  remainingCharacterCounter: string;
}

export class CharacterCounterComponent extends SurveyElementBase<ICharacterCounterComponentProps, any> {
  protected getStateElement(): Base {
    return this.props.counter;
  }

  renderElement(): JSX.Element | null {
    return (<div className={this.props.remainingCharacterCounter}>{this.props.counter.remainingCharacterCounter}</div>);
  }
}

ReactElementFactory.Instance.registerElement("sv-character-counter", (props) => {
  return React.createElement(CharacterCounterComponent, props);
});