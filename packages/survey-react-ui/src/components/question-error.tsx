import * as React from "react";
import { SurveyError } from "survey-core";
import { ReactElementFactory } from "../element-factory";
import { SurveyLocStringViewer } from "../string-viewer";

export interface IQuestionErrorComponentProps {
  error: SurveyError;
  cssClasses: any;
  element: any;
}

export class QuestionErrorComponent extends React.Component<IQuestionErrorComponentProps, any> {
  render(): React.JSX.Element | null {
    const error = this.props.error;
    const classes = this.props.cssClasses;
    const cssError = classes.error;
    return (
      <div>
        <span className={cssError.icon || undefined} aria-hidden="true" />
        <span className={cssError.item || undefined}>
          <SurveyLocStringViewer locStr={error.locText} />
        </span>
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-question-error", (props) => {
  return React.createElement(QuestionErrorComponent, props);
});