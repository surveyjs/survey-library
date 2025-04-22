import * as React from "react";
import { QuestionFileModel } from "survey-core";
import { SurveyActionBar } from "./components/action-bar/action-bar";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { LoadingIndicatorComponent } from "./components/loading-indicator";
import { SurveyAction } from "./components/action-bar/action-bar-item";
import { ReactElementFactory } from "./element-factory";

export class SurveyQuestionFile extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionFileModel {
    return this.questionBase as QuestionFileModel;
  }
  protected renderElement(): React.JSX.Element {
    const preview = this.question.allowShowPreview ? this.renderPreview() : null;
    const loadingIndicator = this.question.showLoadingIndicator ? this.renderLoadingIndicator() : null;
    const video = this.question.isPlayingVideo ? this.renderVideo() : null;
    const fileDecorator = this.question.showFileDecorator ? this.renderFileDecorator() : null;
    const fileNavigator = this.question.fileNavigatorVisible ? (<SurveyActionBar model={this.question.fileNavigator}></SurveyActionBar>) : null;
    let fileInput;
    if (this.question.isReadOnlyAttr) {
      fileInput = <input
        readOnly
        type="file"
        className={!this.isDisplayMode ? this.question.cssClasses.fileInput : this.question.getReadOnlyFileCss()}
        id={this.question.inputId}
        ref={input => (this.setControl(input))}
        style={!this.isDisplayMode ? {} : { color: "transparent" }}
        multiple={this.question.allowMultiple}
        placeholder={this.question.title}
        accept={this.question.acceptedTypes}
      />;
    } else if (this.question.isDisabledAttr) {
      fileInput = <input
        disabled
        type="file"
        className={!this.isDisplayMode ? this.question.cssClasses.fileInput : this.question.getReadOnlyFileCss()}
        id={this.question.inputId}
        ref={input => (this.setControl(input))}
        style={!this.isDisplayMode ? {} : { color: "transparent" }}
        multiple={this.question.allowMultiple}
        placeholder={this.question.title}
        accept={this.question.acceptedTypes}
      />;
    } else if (this.question.hasFileUI) {
      fileInput = <input
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
        capture={this.question.renderCapture as "user" | "environment"}
      />;
    } else {
      fileInput = null;
    }

    return (
      <div className={this.question.fileRootCss} ref={el => (this.setContent(el))}>
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
          {preview}
          {fileNavigator}
        </div>
      </div>
    );
  }
  protected renderFileDecorator(): React.JSX.Element {
    const actionsContainer = this.question.actionsContainerVisible ? <SurveyActionBar model={this.question.actionsContainer}></SurveyActionBar> : null;
    return (
      <div
        className={this.question.getFileDecoratorCss()}
      >
        {this.question.showDragAreaPlaceholder ? <span className={this.question.cssClasses.dragAreaPlaceholder}>{this.renderLocString(this.question.locRenderedPlaceholder)}</span> : false }
        <div className={this.question.cssClasses.wrapper}>
          {actionsContainer}
        </div>
      </div>
    );
  }
  protected renderPreview(): React.JSX.Element {
    return ReactElementFactory.Instance.createElement("sv-file-preview", { question: this.question });
  }
  protected renderLoadingIndicator(): React.JSX.Element {
    return <div className={this.question.cssClasses.loadingIndicator}><LoadingIndicatorComponent></LoadingIndicatorComponent></div>;
  }
  protected renderVideo(): React.JSX.Element {
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
