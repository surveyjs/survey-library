import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { QuestionImageModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SvgIcon } from "./components/svg-icon/svg-icon";

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

  protected renderElement(): React.JSX.Element {
    var cssClasses = this.question.getImageCss();
    var style: any = { objectFit: this.question.imageFit, width: this.question.renderedStyleWidth, height: this.question.renderedStyleHeight };
    if (!this.question.imageLink || this.question.contentNotLoaded) {
      style["display"] = "none";
    }
    var control: React.JSX.Element | null = null;
    if (this.question.renderedMode === "image") {
      control = (
        <img
          className={cssClasses}
          src={this.question.locImageLink.renderedHtml || null}
          alt={this.question.renderedAltText}
          width={this.question.renderedWidth}
          height={this.question.renderedHeight}
          style={style}
          onLoad={(event: any) => { this.question.onLoadHandler(); }}
          onError={(event: any) => { this.question.onErrorHandler(); }}
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
          onLoadedMetadata={(event: any) => { this.question.onLoadHandler(); }}
          onError={(event: any) => { this.question.onErrorHandler(); }}
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
          title={this.question.renderedAltText}
        ></iframe>
      );
    }
    var noImage: React.JSX.Element | null = null;
    if (!this.question.imageLink || this.question.contentNotLoaded) {
      noImage = (
        <div className={this.question.cssClasses.noImage}>
          <SvgIcon
            iconName={this.question.cssClasses.noImageSvgIconId}
            size={48}
          >
          </SvgIcon>
        </div>
      );
    }
    return <div className={this.question.cssClasses.root}>{control}{noImage}</div>;
  }
}

ReactQuestionFactory.Instance.registerQuestion("image", (props) => {
  return React.createElement(SurveyQuestionImage, props);
});
