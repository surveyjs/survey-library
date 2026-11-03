import * as React from "react";
import { Question, KeyboardHintItem } from "survey-core";

export class QuestionHint extends React.Component<{ question: Question }, any> {
  private renderHint(hint: KeyboardHintItem, index: number): React.JSX.Element {
    if (hint.alternatives.length > 0) {
      return (
        <span className={hint.className} key={index}>
          {hint.alternatives.map((alternative, alternativeIndex) => this.renderHint(alternative, alternativeIndex))}
        </span>
      );
    }
    return (
      <span className={hint.className} key={index}>
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
        {keyboardHintModel.items.map((hint, index) => this.renderHint(hint, index))}
      </div>
    );
  }
}
