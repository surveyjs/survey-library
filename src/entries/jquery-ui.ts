import * as React from "react";
import * as ReactDOM from "react-dom";
import jQuery from "jquery";

// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey, PopupSurvey } from "../../packages/survey-react-ui/entries/react-ui-model";

import { SurveyModel, checkLibraryVersion } from "survey-core";

jQuery["fn"].extend({
  Survey: function (props: any) {
    return this.each(function () {
      const survey = React.createElement(Survey, { ...props });
      ReactDOM.render(survey, this);
    } as any);
  },
  PopupSurvey: doPopupSurvey,
  SurveyWindow: doPopupSurvey
});

function doPopupSurvey(props: any): void {
  return this.each(function () {
    var model: Survey = props.model;
    const survey = React.createElement(PopupSurvey, { ...props });
    ReactDOM.render(survey, this);
  });
}

SurveyModel.platform = "jquery";
SurveyModel.prototype["render"] = function (element: any = null) {
  if (this.renderCallback) {
    this.renderCallback();
  } else {
    const survey = React.createElement(Survey, { model: this });
    ReactDOM.render(survey, element);
  }
};

export const preact: any = React;

export * from "../../packages/survey-react-ui/entries/react-ui-model";
export * from "./core-export";

export { SurveyModel as Model } from "survey-core";

checkLibraryVersion(`${process.env.VERSION}`, "survey-jquery-ui");