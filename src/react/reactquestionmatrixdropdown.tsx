import * as React from "react";
import { SurveyQuestionMatrixDropdownBase } from "./reactquestionmatrixdropdownbase";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionMatrixDropdown extends SurveyQuestionMatrixDropdownBase {
  constructor(props: any) {
    super(props);
  }
}

ReactQuestionFactory.Instance.registerQuestion("matrixdropdown", props => {
  return React.createElement(SurveyQuestionMatrixDropdown, props);
});
