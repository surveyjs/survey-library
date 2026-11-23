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
  /* inert is set on the element, not passed as a prop: React 17 passes an unknown attribute through only with a
     string value, React 19 takes it as a boolean (an empty string is false, with a warning), and preact assigns
     the DOM property. The attribute itself means the same everywhere. */
  const setInert = (el: HTMLElement | null): void => {
    if (!!el) {
      el.toggleAttribute("inert", isLoading);
    }
  };
  return (
    <div className={question.getRecordsContentCss()}>
      <div className={question.cssClasses.recordsBody} aria-busy={isLoading ? "true" : undefined} ref={setInert}>{content}</div>
      {isLoading ? ReactElementFactory.Instance.createElement("sv-records-loading-overlay", { question: question }) : null}
    </div>
  );
}
