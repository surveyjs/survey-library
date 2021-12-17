import * as React from "react";
import { QuestionFileModel } from "survey-core";
import { SvgIcon } from "./components/svg-icon/svg-icon";
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
      <div className={this.question.getFileRootCss()}>
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
        <span>{this.question.chooseButtonCaption}</span>
        {(!!this.question.cssClasses.chooseFileIconId) ? <SvgIcon iconName={this.question.cssClasses.chooseFileIconId} size={"auto"}></SvgIcon>: null }
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
        className={this.question.getFileDecoratorCss()}
        onDrop={this.question.onDrop}
        onDragOver={this.question.onDragOver}
        onDragLeave={this.question.onDragLeave}
      >
        <span className={this.question.cssClasses.dragAreaPlaceholder}>{this.question.dragAreaPlaceholder}</span>
        <div className={this.question.cssClasses.wrapper}>
          {chooseFile}
          {noFileChosen}
        </div>
      </div>
    );
  }
  protected renderClearButton(className: string): JSX.Element {
    return !this.question.isEmpty() && !this.isDisplayMode && !!className? (
      <button type="button" onClick={this.question.doClean} className={className}>
        <span>{this.question.cleanButtonCaption}</span>
        {(!!this.question.cssClasses.removeButtonIconId) ? <SvgIcon iconName={this.question.cssClasses.removeButtonIconId} size={"auto"}></SvgIcon>: null }
      </button>
    ) : null;
  }
  protected renderFileSign(className: string, val: any): JSX.Element {
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
          style={{ width: this.question.imageWidth + "px" }}
        >
          {val.name}
        </a>
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
          {this.renderFileSign(this.question.cssClasses.fileSign, val)}
          <div className={this.question.cssClasses.imageWrapper}>
            {this.question.canPreviewImage(val) ? (
              <img
                src={val.content}
                height={this.question.imageHeight}
                width={this.question.imageWidth}
                alt="File preview"
              />
            ) : (<img className={this.question.cssClasses.defaultImage} height={this.question.imageHeight} width={this.question.imageWidth}/>)}
            {val.name && !this.question.isReadOnly ? (
              <div className={this.question.cssClasses.removeFileButton} onClick={() => this.question.doRemoveFile(val)}>
                <span
                  className={this.question.cssClasses.removeFile}
                >
                  {this.question.removeFileCaption}
                </span>
                {(this.question.cssClasses.removeFileSvgIconId) ?
                  (<SvgIcon iconName={this.question.cssClasses.removeFileSvgIconId} size={"auto"} className={this.question.cssClasses.removeFileSvg}></SvgIcon>): null }
              </div>
            ) : null}
          </div>
          {this.renderFileSign(this.question.cssClasses.fileSignBottom, val)}
        </span>
      );
    });
    return <div className={this.question.cssClasses.fileList}>{previews}</div>;
  }
}

ReactQuestionFactory.Instance.registerQuestion("file", props => {
  return React.createElement(SurveyQuestionFile, props);
});
