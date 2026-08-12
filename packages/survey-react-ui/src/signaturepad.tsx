import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { QuestionSignaturePadModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { LoadingIndicatorComponent } from "./components/loading-indicator";
import { SurveyActionBar } from "./components/action-bar/action-bar";

export class SurveyQuestionSignaturePad extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = { value: this.question.value };
  }
  protected get question(): QuestionSignaturePadModel {
    return this.questionBase as QuestionSignaturePadModel;
  }
  protected renderElement(): React.JSX.Element {
    var cssClasses = this.question.cssClasses;
    const loadingIndicator = this.question.showLoadingIndicator ? this.renderLoadingIndicator() : null;
    var toolbar = this.renderToolbar();
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
          <canvas tabIndex={-1} className={this.question.cssClasses.canvas} onBlur={(event) => { this.question.onBlur(event); }}></canvas>
        </div>
        {toolbar}
        {loadingIndicator}
      </div>
    );
  }

  renderBackgroundImage(): React.JSX.Element | null {
    if (!this.question.backgroundImage) return null;

    return <img className={this.question.cssClasses.backgroundImage} src={this.question.backgroundImage} style={{ width: this.question.renderedCanvasWidth }} role="presentation"></img>;
  }
  protected renderLoadingIndicator(): React.JSX.Element {
    return <div className={this.question.cssClasses.loadingIndicator}><LoadingIndicatorComponent></LoadingIndicatorComponent></div>;
  }

  renderToolbar(): React.JSX.Element | null {
    return <SurveyActionBar model={this.question.toolbar}></SurveyActionBar>;
  }
}

ReactQuestionFactory.Instance.registerQuestion("signaturepad", (props) => {
  return React.createElement(SurveyQuestionSignaturePad, props);
});
