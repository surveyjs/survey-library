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
    return (
      <div>
        <span className={error.getCssIcon(classes)} aria-hidden="true" />
        <span className={this.props.cssClasses.error.item || undefined}>
          <SurveyLocStringViewer model={error.locText} />
        </span>
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-question-error", (props) => {
  return React.createElement(QuestionErrorComponent, props);
});