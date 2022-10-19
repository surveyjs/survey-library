import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { QuestionImageModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionImage extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  componentDidMount() {
    super.componentDidMount();
    this.question.locImageLink.onChanged = () => {
      this.forceUpdate();
    };
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    this.question.locImageLink.onChanged = () => { };
  }

  protected get question(): QuestionImageModel {
    return this.questionBase as QuestionImageModel;
  }
  protected canRender(): boolean {
    return super.canRender() && !!this.question.imageLink;
  }
  protected renderElement(): JSX.Element {
    var cssClasses = this.question.getImageCss();
    var style: any = { objectFit: this.question.imageFit };
    var control = null;
    if (this.question.renderedMode === "image") {
      control = (
        <img
          className={cssClasses}
          src={this.question.locImageLink.renderedHtml}
          alt={this.question.altText || this.question.title}
          width={this.question.renderedWidth}
          height={this.question.renderedHeight}
          //alt={item.text || item.value}
          style={style}
        />
      );
    }
    if (this.question.renderedMode === "video") {
      control = (
        <video controls
          className={cssClasses}
          src={this.question.locImageLink.renderedHtml}
          width={this.question.renderedWidth}
          height={this.question.renderedHeight}
          style={style}
        ></video>
      );
    }
    if (this.question.renderedMode === "youtube") {
      control = (
        <iframe
          className={cssClasses}
          src={this.question.locImageLink.renderedHtml}
          width={this.question.renderedWidth}
          height={this.question.renderedHeight}
          style={style}
        ></iframe>
      );
    }
    return <div className={this.question.cssClasses.root}>{control}</div>;
  }
}

ReactQuestionFactory.Instance.registerQuestion("image", (props) => {
  return React.createElement(SurveyQuestionImage, props);
});
