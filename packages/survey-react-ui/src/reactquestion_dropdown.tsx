import * as React from "react";
import { Question } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyQuestionDropdownBase } from "./dropdown-base";

export class SurveyQuestionDropdown extends SurveyQuestionDropdownBase<Question> {
  constructor(props: any) {
    super(props);
  }

  protected renderElement(): React.JSX.Element {
    const cssClasses = this.question.cssClasses;
    const comment = this.renderOther(this.question.selectedItem, cssClasses);
    const select = this.renderSelect(cssClasses);
    return (
      <div className={this.question.renderCssRoot}>
        {select}
        {comment}
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("dropdown", (props) => {
  return React.createElement(SurveyQuestionDropdown, props);
});