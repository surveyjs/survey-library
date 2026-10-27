import * as React from "react";
import { Question, IKeyboardHint } from "survey-core";

export class QuestionHint extends React.Component<{ question: Question }, any> {
  private renderHint(hint: IKeyboardHint, index: number): React.JSX.Element {
    const orText = this.props.question.keyboardHintOrText;
    const className = "sd-question__keyboard-hint" + (hint.visible ? "" : " sd-question__keyboard-hint--hidden");
    return (
      <span className={className} key={index}>
        {hint.keys.map((key, keyIndex) => (
          <React.Fragment key={keyIndex}>
            {keyIndex > 0 && <span className="sd-question__keyboard-hint-or">{orText}</span>}
            <span className="sd-item__shortcut-key">{key}</span>
          </React.Fragment>
        ))}
        <span className="sd-question__keyboard-hint-text">{hint.text}</span>
      </span>
    );
  }
  render(): React.JSX.Element | null {
    const hints = this.props.question.getKeyboardHints();
    if (hints.length === 0) return null;
    return (
      <div className="sd-question__keyboard-hints" aria-hidden="true">
        {hints.map((hint, index) => this.renderHint(hint, index))}
      </div>
    );
  }
}
