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
    return (
      <div className="sjs_sp_container" ref={root => (this.control = root)}>
        <div>
          <canvas tabIndex={0}></canvas>
        </div>
        <div className="sjs_sp_controls">
          <button type="button" className="sjs_sp_clear" title="Clear">✖</button>
        </div>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("signaturepad", props => {
  return React.createElement(SurveyQuestionSignaturePad, props);
});
