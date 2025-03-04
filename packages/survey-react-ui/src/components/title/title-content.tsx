import * as React from "react";
import { SurveyElementCore, ITitleOwner } from "survey-core";
import { SurveyElementBase } from "../../reactquestion_element";

export class TitleContent extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  private get cssClasses() {
    return this.props.cssClasses;
  }

  private get element(): SurveyElementCore {
    return this.props.element;
  }
  render(): React.JSX.Element {
    if (this.element.isTitleRenderedAsString)
      return SurveyElementBase.renderLocString(this.element.locTitle);
    var spans = this.renderTitleSpans(this.element.getTitleOwner(), this.cssClasses);
    return <>{spans}</>;
  }
  protected renderTitleSpans(element: ITitleOwner, cssClasses: any): Array<React.JSX.Element> {
    var getSpaceSpan = (key: any) => {
      return (
        <span data-key={key} key={key}>
          &nbsp;
        </span>
      );
    };
    var spans: Array<React.JSX.Element> = [];
    if (element.isRequireTextOnStart) {
      spans.push(this.renderRequireText(element));
      spans.push(getSpaceSpan("req-sp"));
    }
    var questionNumber = element.no;
    if (questionNumber) {
      spans.push(
        <span
          data-key={"q_num"}
          key={"q_num"}
          className={element.cssTitleNumber}
          style={{ position: "static" }}
          aria-hidden={true}
        >
          {questionNumber}
        </span>
      );
      spans.push(getSpaceSpan("num-sp"));
    }
    if (element.isRequireTextBeforeTitle) {
      spans.push(this.renderRequireText(element));
      spans.push(getSpaceSpan("req-sp"));
    }
    spans.push(
      SurveyElementBase.renderLocString(element.locTitle, null, "q_title")
    );
    if (element.isRequireTextAfterTitle) {
      spans.push(getSpaceSpan("req-sp"));
      spans.push(this.renderRequireText(element));
    }
    return spans;
  }

  private renderRequireText(element: ITitleOwner): React.JSX.Element {
    return (
      <span
        data-key={"req-text"}
        key={"req-text"}
        className={element.cssRequiredMark}
        aria-hidden={true}
      >
        {element.requiredMark}
      </span>
    );
  }
}
