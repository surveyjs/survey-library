import * as React from "react";
import { Question, KeyboardHintItem } from "survey-core";

export class QuestionHint extends React.Component<{ question: Question }, any> {
  private renderHint(hint: KeyboardHintItem, index: number, itemCss: string): React.JSX.Element {
    return (
      <span className={itemCss} key={index}>
        {hint.parts.map((part, partIndex) => (
          <span key={partIndex} className={part.className}>{part.text}</span>
        ))}
      </span>
    );
  }
  render(): React.JSX.Element | null {
    const keyboardHintModel = this.props.question.getKeyboardHintModel();
    if (!keyboardHintModel.hasItems()) return null;
    return (
      <div className={keyboardHintModel.cssClasses.keyboardHintContainer} aria-hidden="true">
        {keyboardHintModel.items.map((hint, index) => this.renderHint(hint, index, keyboardHintModel.cssClasses.keyboardHintItem))}
      </div>
    );
  }
}
