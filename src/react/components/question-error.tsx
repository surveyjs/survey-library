import React from "react";
import { ReactElementFactory } from "../element-factory";
import { SurveyError } from "survey-core";
import { SurveyLocStringViewer } from "../string-viewer";

export interface IQuestionErrorComponentProps {
  key: string;
  error: SurveyError;
  cssClasses: any;
}

export class QuestionErrorComponent extends React.Component<IQuestionErrorComponentProps, any> {
  render(): JSX.Element | null {
    return (
      <div key={this.props.key}>
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