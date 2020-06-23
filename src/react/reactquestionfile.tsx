import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestionelement";
import { QuestionFileModel } from "../question_file";
import { ReactQuestionFactory } from "./reactquestionfactory";
import {
  confirmAction,
  detectIEOrEdge,
  loadFileFromBase64
} from "../utils/utils";
export class SurveyQuestionFile extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = {
      fileLoaded: 0,
      state: "empty",
      rootClass: this.question.cssClasses.root
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.question.onStateChanged.add((state: any) =>
      this.setState({ fileLoaded: this.state.fileLoaded + 1, state: state })
    );
  }
  protected get question(): QuestionFileModel {
    return this.questionBase as QuestionFileModel;
  }
  handleOnDragOver = (event: any) => {
    event.preventDefault();
  };
  handleOnDrop = (event: any) => {
    event.preventDefault();
    let src = event.dataTransfer;
    this.onChange(src);
  };
  handleOnChange = (event: any) => {
    var src = event.target || event.srcElement;
    this.onChange(src);
  };
  handleOnClean = (event: any) => {
    var question = this.question;
    var src = event.target || event.srcElement;
    if (question.needConfirmRemoveFile) {
      var isConfirmed = confirmAction(question.confirmRemoveAllMessage);
      if (!isConfirmed) return;
    }
    question.clear();
    src.parentElement.querySelectorAll("input")[0].value = "";
    this.setState({ fileLoaded: this.state.fileLoaded + 1 });
  };
  handleOnRemoveFile = (event: any) => {
    var question = this.question;
    if (question.needConfirmRemoveFile) {
      var isConfirmed = confirmAction(
        question.getConfirmRemoveMessage(event.name)
      );
      if (!isConfirmed) return;
    }
    question.removeFile(event);
    this.setState({ fileLoaded: this.state.fileLoaded + 1 });
  };
  handleOnDownloadFile = (event: any, data: any) => {
    if (detectIEOrEdge()) {
      event.preventDefault();
      loadFileFromBase64(data.content, data.name);
    }
  };
  private onChange = (src: any) => {
    if (!(window as any)["FileReader"]) return;
    if (!src || !src.files || src.files.length < 1) return;
    let files = [];
    let allowCount = this.question.allowMultiple ? src.files.length : 1;
    for (let i = 0; i < allowCount; i++) {
      files.push(src.files[i]);
    }
    src.value = "";
    this.question.loadFiles(files);
    this.setState({ fileLoaded: this.state.fileLoaded + 1 });
  };
  render(): JSX.Element {
    if (!this.question) return null;
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
        disabled={this.isDisplayMode}
        className={this.question.cssClasses.fileInput}
        id={this.question.inputId}
        ref={input => (this.control = input)}
        type="file"
        onChange={!this.isDisplayMode ? this.handleOnChange : null}
        aria-required={this.question.isRequired}
        aria-label={this.question.locTitle.renderedHtml}
        aria-invalid={this.question.errors.length > 0}
        aria-describedby={this.question.errors.length > 0 ? this.question.id + '_errors' : null}
        multiple={this.question.allowMultiple}
        title={this.question.inputTitle}
        accept={this.question.acceptedTypes}
      />
    );
    return (
      <div className={this.state.rootClass}>
        {fileInput}
        {fileDecorator}
        {clearButton}
        {preview}
        {clearButtonBottom}
      </div>
    );
  }
  protected renderFileDecorator(): JSX.Element {
    let noFileChosen = null;
    let chooseFile = null;
    let chooseFileCss =
      this.question.cssClasses.chooseFile +
      (this.isDisplayMode ? " " + this.question.cssClasses.disabled : "");
    chooseFile = (
      <label
        role="button"
        className={chooseFileCss}
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
        onDrop={this.handleOnDrop}
        onDragOver={this.handleOnDragOver}
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
      <button type="button" onClick={this.handleOnClean} className={className}>
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
            this.handleOnDownloadFile(event, val);
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
                onClick={event => this.handleOnRemoveFile(val)}
              >
                {this.question.removeFileCaption}
              </span>
              <svg
                className={this.question.cssClasses.removeFileSvg}
                onClick={event => this.handleOnRemoveFile(val)}
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
