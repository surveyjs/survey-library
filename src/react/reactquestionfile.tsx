import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestionelement";
import { QuestionFileModel } from "../question_file";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionFile extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = { fileLoaded: 0, state: "empty" };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.question.onStateChanged.add((state: any) =>
      this.setState({ fileLoaded: this.state.fileLoaded + 1, state: state })
    );
  }
  protected get question(): QuestionFileModel {
    return this.questionBase as QuestionFileModel;
  }
  handleOnChange(event: any) {
    var src = event.target || event.srcElement;
    if (!(window as any)["FileReader"]) return;
    if (!src || !src.files || src.files.length < 1) return;
    let files = [];
    for (let i = 0; i < src.files.length; i++) {
      files.push(src.files[i]);
    }
    src.value = "";
    this.question.loadFiles(files);
    this.setState({ fileLoaded: this.state.fileLoaded + 1 });
  }
  handleOnClean = (event: any) => {
    var src = event.target || event.srcElement;
    this.question.clear();
    src.parentElement.querySelectorAll("input")[0].value = "";
    this.setState({ fileLoaded: this.state.fileLoaded + 1 });
  };
  handleOnRemoveFile = (event: any) => {
    this.question.removeFile(event);
    this.setState({ fileLoaded: this.state.fileLoaded + 1 });
  };
  render(): JSX.Element {
    if (!this.question) return null;
    var preview = this.renderPreview();
    var fileInput = null;
    var fileDecorator = null;
    var clearButton = null;
    fileInput = (
      <input
        disabled={this.isDisplayMode}
        className={this.question.cssClasses.fileInput}
        id={this.question.inputId}
        type="file"
        onChange={!this.isDisplayMode ? this.handleOnChange : null}
        aria-required={this.question.isRequired}
        aria-label={this.question.locTitle.renderedHtml}
        multiple={this.question.allowMultiple}
        title={this.question.inputTitle}
        accept={this.question.acceptedTypes}
      />
    );
    fileDecorator = (
      <div className={this.question.cssClasses.fileDecorator}>
        <label
          className={
            this.question.cssClasses.chooseFile +
            (this.isDisplayMode ? " " + this.question.cssClasses.disabled : "")
          }
          htmlFor={this.question.inputId}
        >
          {this.question.chooseButtonCaption}
        </label>
        {this.question.isDisplayMode || !this.question.isEmpty() || (
          <span className={this.question.cssClasses.noFileChosen}>
            {this.question.noFileChosenCaption}
          </span>
        )}
      </div>
    );
    if (!this.question.isEmpty() && !this.isDisplayMode) {
      clearButton = (
        <button
          type="button"
          onClick={this.handleOnClean}
          className={this.question.cssClasses.removeButton}
        >
          {this.question.cleanButtonCaption}
        </button>
      );
    }
    return (
      <div className={this.question.cssClasses.root}>
        {fileInput}
        {fileDecorator}
        {clearButton}
        {preview}
      </div>
    );
  }
  protected renderPreview(): JSX.Element {
    if (!this.question.previewValue) return null;
    var previews = this.question.previewValue.map((val, index) => {
      if (!val) return null;
      return (
        <span
          key={this.question.inputId + "_" + index}
          className={this.question.cssClasses.preview}
        >
          {val.name ? (
            <div>
              <a
                href={val.content}
                title={val.name}
                download={val.name}
                style={{ width: this.question.imageWidth + "px" }}
              >
                {val.name}
              </a>
            </div>
          ) : null}
          {this.question.canPreviewImage(val) ? (
            <img
              src={val.content}
              height={this.question.imageHeight}
              width={this.question.imageWidth}
              alt="File preview"
            />
          ) : null}
          {val.name ? (
            <div>
              {!this.question.isReadOnly ? (
                <span
                  className={this.question.cssClasses.removeFile}
                  onClick={event => this.handleOnRemoveFile(val)}
                >
                  {this.question.removeFileCaption}
                </span>
              ) : null}
            </div>
          ) : null}
        </span>
      );
    });
    return <div>{previews}</div>;
  }
}

ReactQuestionFactory.Instance.registerQuestion("file", props => {
  return React.createElement(SurveyQuestionFile, props);
});
