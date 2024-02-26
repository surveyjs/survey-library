import * as React from "react";
import { QuestionFileModel } from "survey-core";
import { SurveyActionBar } from "./components/action-bar/action-bar";
import { SvgIcon } from "./components/svg-icon/svg-icon";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { attachKey2click } from "./reactSurvey";
import { LoadingIndicatorComponent } from "./components/loading-indicator";
import { SurveyAction } from "./components/action-bar/action-bar-item";
import { ReactElementFactory, SurveyFileChooseButton } from "../entries/react-ui-model";

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
            aria-required={this.question.ariaRequired}
            aria-label={this.question.ariaLabel}
            aria-invalid={this.question.ariaInvalid}
            aria-errormessage={this.question.ariaErrormessage}
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
        <span className={this.question.cssClasses.dragAreaPlaceholder}>{this.renderLocString(this.question.locRenderedPlaceholder)}</span>
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
  protected renderPreview(): JSX.Element {
    return ReactElementFactory.Instance.createElement("sv-file-preview", { question: this.question });
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
}

ReactQuestionFactory.Instance.registerQuestion("file", props => {
  return React.createElement(SurveyQuestionFile, props);
});
