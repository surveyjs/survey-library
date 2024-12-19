import React from "react";
import { SurveyElementBase } from "../../reactquestion_element";
import { QuestionFileModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyFileItem } from "./file-item";
import { SurveyFilePage } from "./file-page";

export class SurveyFilePreview extends SurveyElementBase<{ question: QuestionFileModel }, {}> {

  protected get question(): QuestionFileModel {
    return this.props.question;
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
    const content = this.question.supportFileNavigator ? this.question.renderedPages.map((page: any, index: number) => { return (<SurveyFilePage page={page} question={this.question} key={page.id}></SurveyFilePage>); })
      : this.question.previewValue.map((item: any, index: number) => { return (<SurveyFileItem item={item} question={this.question} key={index}></SurveyFileItem>); });
    return <div className={this.question.cssClasses.fileList || undefined}>{content}</div>;
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