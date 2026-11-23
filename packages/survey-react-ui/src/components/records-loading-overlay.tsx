import * as React from "react";
import { QuestionRecordsModel } from "survey-core";
import { ReactElementFactory } from "../element-factory";
import { LoadingIndicatorComponent } from "./loading-indicator";

interface IRecordsLoadingOverlayProps {
  question: QuestionRecordsModel;
}

// Covers the records of a question while its data source reads a page (QuestionRecordsModel.isDataLoading).
export class RecordsLoadingOverlay extends React.Component<IRecordsLoadingOverlayProps, any> {
  render(): React.JSX.Element {
    const question = this.props.question;
    return (
      <div className={question.cssClasses.recordsLoadingOverlay} role="status" aria-label={question.loadingIndicatorAriaLabel}>
        <LoadingIndicatorComponent />
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-records-loading-overlay", (props) => {
  return React.createElement(RecordsLoadingOverlay, props);
});

/* The records of a question with a data source go into the loading container: a body that is busy and inert
   while a page is read, and the overlay next to it - outside the inert body, so assistive technologies still
   read its status. Without a source the content is returned as it is. */
export function renderRecordsContent(question: QuestionRecordsModel, content: React.ReactNode): React.ReactNode {
  if (!question.isDataSourceAssigned) return content;
  const isLoading = question.isDataLoading;
  // React 17 knows neither attribute: an unknown attribute is passed through with a string value.
  const busyAttributes: any = isLoading ? { "aria-busy": "true", inert: "" } : {};
  return (
    <div className={question.getRecordsContentCss()}>
      <div className={question.cssClasses.recordsBody} {...busyAttributes}>{content}</div>
      {isLoading ? ReactElementFactory.Instance.createElement("sv-records-loading-overlay", { question: question }) : null}
    </div>
  );
}
