import * as React from "react";
import { Helpers } from "../helpers";
import { Base } from "../base";
import { SurveyQuestionElementBase } from "./reactquestionelement";
import { QuestionSignaturePadModel } from "../question_signaturepad";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionSignaturePad extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = { value: this.question.value };
  }
  protected get question(): QuestionSignaturePadModel {
    return this.questionBase as QuestionSignaturePadModel;
  }
  render(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    return (
      <div className={cssClasses.root} ref={root => (this.control = root)}>
        <div>
          <canvas tabIndex={0}></canvas>
        </div>
        <div className={cssClasses.controls}>
          <button type="button" className={cssClasses.clearButton} title={this.question.clearButtonCaption}>✖</button>
        </div>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("signaturepad", props => {
  return React.createElement(SurveyQuestionSignaturePad, props);
});
