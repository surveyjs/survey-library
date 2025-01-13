import * as React from "react";
import { SurveyQuestionMatrixDropdownBase } from "./reactquestion_matrixdropdownbase";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionMatrixDropdown extends SurveyQuestionMatrixDropdownBase {
  constructor(props: any) {
    super(props);
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrixdropdown", props => {
  return React.createElement(SurveyQuestionMatrixDropdown, props);
});
