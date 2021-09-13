import * as React from "react";
import { QuestionFileModel, confirmAction, detectIEOrEdge, loadFileFromBase64, Base } from "survey-core";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionFile extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionFileModel {
    return this.questionBase as QuestionFileModel;
  }
  protected renderElement(): JSX.Element {
    var preview = this.renderPreview();
    var fileInput = null;
    var fileDecorator = this.renderFileDecorator();
    var clearButton = this.renderClearButton(
      this.question.cssClasses.removeButton
    );
    var clearButtonBottom = this.renderClearButton(
      this.question.cssClasses.removeButtonBottom
    );
    fileInput = (
      <input
        type="file"
        disabled={this.isDisplayMode}
        className={!this.isDisplayMode ? this.question.cssClasses.fileInput : this.question.getReadOnlyFileCss()}
        id={this.question.inputId}
        ref={input => (this.control = input)}
        style={!this.isDisplayMode ? {} : { color: "transparent" }}
        onChange={!this.isDisplayMode ? this.question.doChange : null}
        aria-required={this.question.ariaRequired}
        aria-label={this.question.ariaLabel}
        aria-invalid={this.question.ariaInvalid}
        aria-describedby={this.question.ariaDescribedBy}
        multiple={this.question.allowMultiple}
        title={this.question.inputTitle}
        accept={this.question.acceptedTypes}
      />
    );
    return (
      <div className={this.question.cssClasses.root}>
        {fileInput}
        {fileDecorator}
        {clearButton}
        {preview}
        {clearButtonBottom}
      </div>
    );
  }
  protected renderFileDecorator(): JSX.Element {
    const questionCss = this.question.cssClasses;
    let noFileChosen = null;
    let chooseFile = null;
    chooseFile = (
      <label
        role="button"
        className={this.question.getChooseFileCss()}
        htmlFor={this.question.inputId}
        aria-label={this.question.chooseButtonCaption}
      >
        {this.question.chooseButtonCaption}
      </label>
    );
    if (this.question.isEmpty()) {
      noFileChosen = (
        <span className={this.question.cssClasses.noFileChosen}>
          {this.question.noFileChosenCaption}
        </span>
      );
    }
    return (
      <div
        className={this.question.cssClasses.fileDecorator}
        onDrop={this.question.onDrop}
        onDragOver={this.question.onDragOver}
      >
        <div className={this.question.cssClasses.wrapper}>
          {chooseFile}
          {noFileChosen}
        </div>
      </div>
    );
  }
  protected renderClearButton(className: string): JSX.Element {
    return !this.question.isEmpty() && !this.isDisplayMode ? (
      <button type="button" onClick={this.question.doClean} className={className}>
        {this.question.cleanButtonCaption}
      </button>
    ) : null;
  }
  protected renderPreview(): JSX.Element {
    if (!this.question.previewValue) return null;
    var previews = this.question.previewValue.map((val, index) => {
      if (!val) return null;
      var fileSign = (
        <a
          href={val.content}
          onClick={event => {
            this.question.doDownloadFile(event, val);
          }}
          title={val.name}
          download={val.name}
          style={{ width: this.question.imageWidth + "px" }}
        >
          {val.name}
        </a>
      );
      return (
        <span
          key={this.question.inputId + "_" + index}
          className={this.question.cssClasses.preview}
        >
          {val.name ? (
            <div className={this.question.cssClasses.fileSign}>{fileSign}</div>
          ) : null}
          {this.question.canPreviewImage(val) ? (
            <img
              src={val.content}
              height={this.question.imageHeight}
              width={this.question.imageWidth}
              alt="File preview"
            />
          ) : null}
          {val.name && !this.question.isReadOnly ? (
            <div>
              <span
                className={this.question.cssClasses.removeFile}
                onClick={event => this.question.doRemoveFile(val)}
              >
                {this.question.removeFileCaption}
              </span>
              <svg
                className={this.question.cssClasses.removeFileSvg}
                onClick={event => this.question.doRemoveFile(val)}
                viewBox="0 0 16 16"
              >
                <path d="M8,2C4.7,2,2,4.7,2,8s2.7,6,6,6s6-2.7,6-6S11.3,2,8,2z M11,10l-1,1L8,9l-2,2l-1-1l2-2L5,6l1-1l2,2l2-2l1,1L9,8 L11,10z" />
              </svg>
            </div>
          ) : null}
          <div className={this.question.cssClasses.fileSignBottom}>
            {fileSign}
          </div>
        </span>
      );
    });
    return <div>{previews}</div>;
  }
}

ReactQuestionFactory.Instance.registerQuestion("file", props => {
  return React.createElement(SurveyQuestionFile, props);
});
