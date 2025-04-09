import * as React from "react";
import { QuestionButtonGroupModel, RendererFactory } from "survey-core";
import { SurveyQuestionDropdownBase } from "./dropdown-base";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionButtonGroupDropdown extends SurveyQuestionDropdownBase<QuestionButtonGroupModel> {
  constructor(props: any) {
    super(props);
  }
  protected renderElement(): React.JSX.Element {
    const cssClasses = this.question.cssClasses;
    const select = this.renderSelect(cssClasses);
    return (
      <div className={this.question.cssClasses.rootDropdown}>
        {select}
      </div>
    );
  }
}
ReactQuestionFactory.Instance.registerQuestion(
  "sv-buttongroup-dropdown",
  (props) => {
    return React.createElement(SurveyQuestionButtonGroupDropdown, props);
  }
);

RendererFactory.Instance.registerRenderer(
  "buttongroup",
  "dropdown",
  "sv-buttongroup-dropdown"
);
