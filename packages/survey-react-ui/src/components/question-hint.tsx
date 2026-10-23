import * as React from "react";
import { Question } from "survey-core";

export class QuestionHint extends React.Component<{ question: Question }, any> {
  render(): React.JSX.Element | null {
    const question = this.props.question;
    const keyboardHints = question.getKeyboardHints();
    if (keyboardHints.length === 0) return null;
    const nodes: React.ReactNode[] = [];
    for (let hintIndex = 0; hintIndex < keyboardHints.length; hintIndex++) {
      const hint = keyboardHints[hintIndex];
      const parts: React.ReactNode[] = [];
      for (let keyIndex = 0; keyIndex < hint.keys.length; keyIndex++) {
        const key = hint.keys[keyIndex];
        if (keyIndex > 0) {
          parts.push(
            <span key={"or" + keyIndex} className="sd-question__keyboard-hint-or">
              {question.getLocalizationString("keyboardHintOrText")}
            </span>
          );
        }
        parts.push(
          <span key={"key" + keyIndex} className="sd-item__shortcut-key">
            {key.label}
          </span>
        );
      }
      parts.push(<span key="text" className="sd-question__keyboard-hint-text">{hint.text}</span>);
      nodes.push(<span className="sd-question__keyboard-hint" key={hintIndex}>{parts}</span>);
    }
    return <div className="sd-question__keyboard-hints" aria-hidden="true">{nodes}</div>;
  }
}
