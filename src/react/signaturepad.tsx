import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { QuestionSignaturePadModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SvgIcon } from "./components/svg-icon/svg-icon";
import { LoadingIndicatorComponent } from "./components/loading-indicator";

export class SurveyQuestionSignaturePad extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = { value: this.question.value };
  }
  protected get question(): QuestionSignaturePadModel {
    return this.questionBase as QuestionSignaturePadModel;
  }
  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    const loadingIndicator = this.question.showLoadingIndicator ? this.renderLoadingIndicator() : null;
    var clearButton = this.renderCleanButton();
    return (
      <div className={cssClasses.root} ref={(root) => (this.setControl(root))} style={{ width: this.question.renderedCanvasWidth }}>
        <div
          className={cssClasses.placeholder}
          style={{ display: this.question.needShowPlaceholder() ? "" : "none" }}
        >
          {this.renderLocString(this.question.locRenderedPlaceholder)}
        </div>
        <div>
          {this.renderBackgroundImage()}
          <canvas tabIndex={-1} className={this.question.cssClasses.canvas} onBlur={this.question.onBlur}></canvas>
        </div>
        {clearButton}
        {loadingIndicator}
      </div>
    );
  }

  renderBackgroundImage(): JSX.Element | null {
    if(!this.question.backgroundImage) return null;

    return <img className={this.question.cssClasses.backgroundImage} src={this.question.backgroundImage} style={{ width: this.question.renderedCanvasWidth }}></img>;
  }
  protected renderLoadingIndicator(): JSX.Element {
    return <div className={this.question.cssClasses.loadingIndicator}><LoadingIndicatorComponent></LoadingIndicatorComponent></div>;
  }

  renderCleanButton(): JSX.Element | null {
    if(!this.question.canShowClearButton) return null;

    var cssClasses = this.question.cssClasses;
    return <div className={cssClasses.controls}>
      <button
        type="button"
        className={cssClasses.clearButton}
        title={this.question.clearButtonCaption}
        onClick={() => this.question.clearValue()}
      >
        {this.question.cssClasses.clearButtonIconId ? <SvgIcon iconName={this.question.cssClasses.clearButtonIconId} size={"auto"}></SvgIcon> : <span>✖</span>}
      </button>
    </div>;
  }
}

ReactQuestionFactory.Instance.registerQuestion("signaturepad", (props) => {
  return React.createElement(SurveyQuestionSignaturePad, props);
});
