import * as React from "react";
import { Question } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionDropdownBase } from "./dropdown-base";
import { SurveyQuestionCommentItem } from "./reactquestion_comment";

export class SurveyQuestionTagbox extends SurveyQuestionDropdownBase<Question> {
  constructor(props: any) {
    super(props);
  }

  protected renderElement(): JSX.Element {
    const cssClasses = this.question.cssClasses;
    const comment = this.question.isOtherSelected ? this.renderOther(cssClasses) : null;
    const select = this.renderSelect(cssClasses);
    return (
      <div className={this.question.renderCssRoot}>
        {select}
        {comment}
      </div>
    );
  }
  protected renderOther(cssClasses: any): JSX.Element {
    return (
      <div className="form-group">
        <SurveyQuestionCommentItem
          question={this.question}
          otherCss={cssClasses.other}
          cssClasses={cssClasses}
          isDisplayMode={this.isDisplayMode}
        />
      </div>
    );
  }
}

// ReactQuestionFactory.Instance.registerQuestion("tagbox", (props) => {
//   return React.createElement(SurveyQuestionTagbox, props);
// });