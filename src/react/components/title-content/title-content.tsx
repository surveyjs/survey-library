import React from "react";
import { Question } from "survey-core";
import { SurveyElementBase } from "../../reactquestion_element";
import { ITitleOwner } from "survey-core";

export class TitleContent extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  private get cssClasses() {
    return this.props.cssClasses;
  }

  private get element(): Question {
    return this.props.element;
  }

  private titleKeyIndex = 0;
  private titleKeyPrefix = "-titleKey-";
  render() {
    var spans = this.renderTitleSpans(this.element, this.cssClasses);
    return <>{spans}</>;
  }

  protected renderTitleSpans(element: ITitleOwner, cssClasses: any) {
    var getSpaceSpan = (key: any) => {
      return (
        <span data-key={key} key={key}>
          &nbsp;
        </span>
      );
    };
    var spans = [];
    if (element.isRequireTextOnStart) {
      spans.push(this.renderRequireText(element, cssClasses));
      spans.push(getSpaceSpan("req-sp"));
    }
    var questionNumber = element.no;
    if (questionNumber) {
      spans.push(
        <span
          data-key={"q_num"}
          key={"q_num"}
          className={cssClasses.number}
          style={{ position: "static" }}
          aria-hidden={true}
        >
          {questionNumber}
        </span>
      );
      spans.push(getSpaceSpan("num-sp"));
    }
    if (element.isRequireTextBeforeTitle) {
      spans.push(this.renderRequireText(element, cssClasses));
      spans.push(getSpaceSpan("req-sp"));
    }
    spans.push(
      SurveyElementBase.renderLocString(element.locTitle, null, "q_title")
    );
    if (element.isRequireTextAfterTitle) {
      spans.push(getSpaceSpan("req-sp"));
      spans.push(this.renderRequireText(element, cssClasses));
    }
    return spans;
  }

  private renderRequireText(
    element: ITitleOwner,
    cssClasses: any
  ): JSX.Element {
    return (
      <span
        data-key={"req-text"}
        key={"req-text"}
        className={cssClasses.requiredText || cssClasses.panel.requiredText}
        aria-hidden={true}
      >
        {element.requiredText}
      </span>
    );
  }

  // private getTitleKey = (element: ITitleOwner) => {
  //   this.titleKeyIndex++;
  //   return element.name + this.titleKeyPrefix + this.titleKeyIndex;
  // };
}
