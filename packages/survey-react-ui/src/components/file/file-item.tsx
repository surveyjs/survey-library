import * as React from "react";
import { SurveyElementBase } from "../../reactquestion_element";
import { QuestionFileModel } from "survey-core";
import { SvgIcon } from "../svg-icon/svg-icon";
import { ReactElementFactory } from "../../element-factory";
import { SurveyAction } from "../action-bar/action-bar-item";

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
          target="_blank"
          rel="noreferrer"
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
            <SurveyAction item={this.question.getRemoveFileButton(val)}></SurveyAction>
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

ReactElementFactory.Instance.registerElement("sv-file-item", (props) => {
  return React.createElement(SurveyFileItem, props);
});