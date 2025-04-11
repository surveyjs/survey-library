import * as React from "react";
import { SurveyElementBase } from "../../reactquestion_element";
import { QuestionFileModel } from "survey-core";
import { SvgIcon } from "../svg-icon/svg-icon";

export class SurveyFileItem extends SurveyElementBase<{ question: QuestionFileModel, item: any }, {}> {

  protected get question(): QuestionFileModel {
    return this.props.question;
  }

  protected get item(): any {
    return this.props.item;
  }

  protected renderFileSign(className: string, val: any): React.JSX.Element | null {
    if (!className || !val.name) return null;
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

  protected renderElement(): React.JSX.Element | null {
    const val = this.item;
    return (
      <span
        className={this.question.cssClasses.previewItem}
        onClick={(event) => this.question.doDownloadFileFromContainer(event as any)}
      >
        {this.renderFileSign(this.question.cssClasses.fileSign, val)}
        <div className={this.question.getImageWrapperCss(val)}>
          {this.question.canPreviewImage(val) ? (
            <img
              src={val.content}
              style={{ height: this.question.imageHeight, width: this.question.imageWidth }}
              alt="File preview"
            />
          ) : (this.question.cssClasses.defaultImage ? (
            <SvgIcon iconName={this.question.cssClasses.defaultImageIconId} size={"auto"} className={this.question.cssClasses.defaultImage}></SvgIcon>
          ) : null)}
          {val.name && !this.question.isReadOnly ? (
            <div className={this.question.getRemoveButtonCss()} onClick={(event) => this.question.doRemoveFile(val, event)}>
              <span
                className={this.question.cssClasses.removeFile}
              >
                {this.question.removeFileCaption}
              </span>
              {(this.question.cssClasses.removeFileSvgIconId) ?
                (<SvgIcon title={this.question.removeFileCaption} iconName={this.question.cssClasses.removeFileSvgIconId} size={"auto"} className={this.question.cssClasses.removeFileSvg}></SvgIcon>) : null}
            </div>
          ) : null}
        </div>
        {this.renderFileSign(this.question.cssClasses.fileSignBottom, val)}
      </span>
    );
  }
  protected canRender(): boolean {
    return this.question.showPreviewContainer;
  }
}