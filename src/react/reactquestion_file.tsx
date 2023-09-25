import * as React from "react";
import { QuestionFileModel } from "survey-core";
import { SurveyActionBar } from "./components/action-bar/action-bar";
import { SvgIcon } from "./components/svg-icon/svg-icon";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { attachKey2click } from "./reactSurvey";
import { LoadingIndicatorComponent } from "./components/loading-indicator";
import { SurveyAction } from "./components/action-bar/action-bar-item";
import { SurveyFileChooseButton } from "../entries/react-ui-model";

export class SurveyQuestionFile extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionFileModel {
    return this.questionBase as QuestionFileModel;
  }
  protected renderElement(): JSX.Element {
    const preview = this.question.allowShowPreview ? this.renderPreview() : null;
    const loadingIndicator = this.question.showLoadingIndicator ? this.renderLoadingIndicator() : null;
    const video = this.question.isPlayingVideo ? this.renderVideo() : null;
    const fileDecorator = this.question.showFileDecorator ? this.renderFileDecorator() : null;
    const clearButton = this.question.showRemoveButton ? this.renderClearButton(
      this.question.cssClasses.removeButton
    ) : null;
    const clearButtonBottom = this.question.showRemoveButtonBottom ? this.renderClearButton(
      this.question.cssClasses.removeButtonBottom
    ): null;
    const fileNavigator = this.question.fileNavigatorVisible?(<SurveyActionBar model = {this.question.fileNavigator}></SurveyActionBar>) : null;
    const fileInput = (
      this.isDisplayMode ?
        <input
          type="file"
          disabled={this.isDisplayMode}
          className={!this.isDisplayMode ? this.question.cssClasses.fileInput : this.question.getReadOnlyFileCss()}
          id={this.question.inputId}
          ref={input => (this.setControl(input))}
          style={!this.isDisplayMode ? {} : { color: "transparent" }}
          onChange={!this.isDisplayMode ? this.question.doChange : (() => {})}
          multiple={this.question.allowMultiple}
          placeholder={this.question.title}
          accept={this.question.acceptedTypes}
        /> : this.question.hasFileUI ?
          <input
            type="file"
            disabled={this.isDisplayMode}
            tabIndex={-1}
            className={!this.isDisplayMode ? this.question.cssClasses.fileInput : this.question.getReadOnlyFileCss()}
            id={this.question.inputId}
            ref={input => (this.setControl(input))}
            style={!this.isDisplayMode ? {} : { color: "transparent" }}
            onChange={!this.isDisplayMode ? this.question.doChange : (() => {})}
            aria-required={this.question.ariaRequired}
            aria-label={this.question.ariaLabel}
            aria-invalid={this.question.ariaInvalid}
            aria-describedby={this.question.ariaDescribedBy}
            multiple={this.question.allowMultiple}
            title={this.question.inputTitle}
            accept={this.question.acceptedTypes}
            capture={this.question.renderCapture}
          /> : null);
    return (
      <div className={this.question.fileRootCss}>
        {fileInput}
        <div
          className={this.question.cssClasses.dragArea}
          onDrop={this.question.onDrop}
          onDragOver={this.question.onDragOver}
          onDragLeave={this.question.onDragLeave}
          onDragEnter={this.question.onDragEnter}
        >
          {fileDecorator}
          {loadingIndicator}
          {video}
          {clearButton}
          {preview}
          {clearButtonBottom}
          {fileNavigator}
        </div>
      </div>
    );
  }
  protected renderFileDecorator(): JSX.Element {
    const chooseButton = this.question.showChooseButton ? this.renderChooseButton() : null;
    const actionsContainer = this.question.actionsContainerVisible ? <SurveyActionBar model={this.question.actionsContainer}></SurveyActionBar> : null;
    const noFileChosen = this.question.isEmpty() ? (
      <span className={this.question.cssClasses.noFileChosen}>
        {this.question.noFileChosenCaption}
      </span>) : null;
    return (
      <div
        className={this.question.getFileDecoratorCss()}
      >
        <span className={this.question.cssClasses.dragAreaPlaceholder}>{this.question.renderedPlaceholder}</span>
        <div className={this.question.cssClasses.wrapper}>
          {chooseButton}
          {actionsContainer}
          {noFileChosen}
        </div>
      </div>
    );
  }
  protected renderChooseButton(): JSX.Element {
    return <SurveyFileChooseButton data={{ question: this.question }}></SurveyFileChooseButton>;
  }
  protected renderClearButton(className: string): JSX.Element | null {
    return !this.question.isUploading ? (
      <button type="button" onClick={this.question.doClean} className={className}>
        <span>{this.question.clearButtonCaption}</span>
        {(!!this.question.cssClasses.removeButtonIconId) ? <SvgIcon iconName={this.question.cssClasses.removeButtonIconId} size={"auto"} title={this.question.clearButtonCaption}></SvgIcon>: null }
      </button>
    ) : null;
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
  protected renderLoadingIndicator(): JSX.Element {
    return <div className={this.question.cssClasses.loadingIndicator}><LoadingIndicatorComponent></LoadingIndicatorComponent></div>;
  }
  protected renderVideo(): JSX.Element {
    return (<div className={this.question.cssClasses.videoContainer}>
      <SurveyAction item={this.question.changeCameraAction}></SurveyAction>
      <SurveyAction item={this.question.closeCameraAction}></SurveyAction>
      <video autoPlay playsInline id={this.question.videoId} className={this.question.cssClasses.video}></video>
      <SurveyAction item={this.question.takePictureAction}></SurveyAction>
    </div>);
  }
  protected renderPreview(): JSX.Element {
    var previews = this.question.previewValue.map((val, index) => {
      if (!val) return null;
      return (
        <span
          key={this.question.inputId + "_" + index}
          className={this.question.cssClasses.preview}
          style={{ display: this.question.isPreviewVisible(index) ? undefined : "none" }}
        >
          {this.renderFileSign(this.question.cssClasses.fileSign, val)}
          <div className={this.question.cssClasses.imageWrapper}>
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
}

ReactQuestionFactory.Instance.registerQuestion("file", props => {
  return React.createElement(SurveyQuestionFile, props);
});
