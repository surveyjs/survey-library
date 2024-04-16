import React from "react";
import { SurveyElementBase } from "../../reactquestion_element";
import { QuestionFileModel } from "survey-core";
import { SvgIcon } from "../svg-icon/svg-icon";
import { ReactElementFactory } from "../../element-factory";

export class SurveyFilePreview extends SurveyElementBase<{ question: QuestionFileModel }, {}> {

  protected get question(): QuestionFileModel {
    return this.props.question;
  }

  protected renderFileSign(className: string, val: any): JSX.Element | null {
    if(!className || !val.name) return null;
    return (
      <div className={className}>
        <a
          href={val.content}
          onClick={event => {
            this.question.doDownloadFile(event, val);
          }}
          title={val.name}
          download={val.name}
          style={{ width: this.question.imageWidth }}
        >
          {val.name}
        </a>
      </div>
    );
  }

  protected renderElement(): JSX.Element | null {
    var previews = this.question.previewValue.map((val, index) => {
      if (!val) return null;
      return (
        <span
          key={this.question.inputId + "_" + index}
          className={this.question.cssClasses.previewItem}
          style={{ display: this.question.isPreviewVisible(index) ? undefined : "none" }}
        >
          {this.renderFileSign(this.question.cssClasses.fileSign, val)}
          <div className={this.question.getImageWrapperCss(val)}>
            {this.question.canPreviewImage(val) ? (
              <img
                src={val.content}
                style={{ height: this.question.imageHeight, width: this.question.imageWidth }}
                alt="File preview"
              />
            ) : (this.question.cssClasses.defaultImage?(
              <SvgIcon iconName={this.question.cssClasses.defaultImageIconId} size={"auto"} className={this.question.cssClasses.defaultImage}></SvgIcon>
            ):null)}
            {val.name && !this.question.isReadOnly ? (
              <div className={this.question.getRemoveButtonCss()} onClick={() => this.question.doRemoveFile(val)}>
                <span
                  className={this.question.cssClasses.removeFile}
                >
                  {this.question.removeFileCaption}
                </span>
                {(this.question.cssClasses.removeFileSvgIconId) ?
                  (<SvgIcon title={this.question.removeFileCaption} iconName={this.question.cssClasses.removeFileSvgIconId} size={"auto"} className={this.question.cssClasses.removeFileSvg}></SvgIcon>): null }
              </div>
            ) : null}
          </div>
          {this.renderFileSign(this.question.cssClasses.fileSignBottom, val)}
        </span>
      );
    });
    return <div className={this.question.cssClasses.fileList || undefined}>{previews}</div>;
  }
  protected canRender(): boolean {
    return this.question.showPreviewContainer;
  }
}
ReactElementFactory.Instance.registerElement(
  "sv-file-preview",
  (props) => {
    return React.createElement(SurveyFilePreview, props);
  }
);