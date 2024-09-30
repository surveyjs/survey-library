import React from "react";
import { SurveyError } from "survey-core";
import { ReactElementFactory } from "../element-factory";
import { SurveyLocStringViewer } from "../string-viewer";

export interface IQuestionErrorComponentProps {
  error: SurveyError;
  cssClasses: any;
  element: any;
}

export class QuestionErrorComponent extends React.Component<IQuestionErrorComponentProps, any> {
  render(): JSX.Element | null {
    return (
      <div>
        <span className={this.props.cssClasses.error.icon || undefined} aria-hidden="true" />
        <span className={this.props.cssClasses.error.item || undefined}>
          <SurveyLocStringViewer locStr={this.props.error.locText} />
        </span>
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-question-error", (props) => {
  return React.createElement(QuestionErrorComponent, props);
});