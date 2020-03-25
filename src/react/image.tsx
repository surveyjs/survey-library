import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestionelement";
import { QuestionImageModel } from "../question_image";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionImage extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionImageModel {
    return this.questionBase as QuestionImageModel;
  }
  render(): JSX.Element {
    if (!this.question || !this.question.imageLink) return null;
    var cssClasses = this.question.cssClasses;
    var style: any = { objectFit: this.question.imageFit };
    var control = null;
    if (this.question.contentMode === "image") {
      control = (
        <img
          className={cssClasses.image}
          src={this.question.imageLink}
          width={
            this.question.imageWidth
              ? this.question.imageWidth + "px"
              : undefined
          }
          height={
            this.question.imageHeight
              ? this.question.imageHeight + "px"
              : undefined
          }
          //alt={item.text || item.value}
          style={style}
        />
      );
    }
    if (this.question.contentMode === "video") {
      control = (
        <embed
          className={cssClasses.image}
          src={this.question.imageLink}
          width={
            this.question.imageWidth
              ? this.question.imageWidth + "px"
              : undefined
          }
          height={
            this.question.imageHeight
              ? this.question.imageHeight + "px"
              : undefined
          }
          style={style}
        />
      );
    }
    return <div className={this.question.cssClasses.root}>{control}</div>;
  }
}

ReactQuestionFactory.Instance.registerQuestion("image", props => {
  return React.createElement(SurveyQuestionImage, props);
});
