import * as React from "react";
import * as ReactDOM from "react-dom";
import jQuery from "jquery";

import { Survey, PopupSurvey } from "./jquery-ui-model";

import { SurveyModel } from "survey-core";

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

    // var popupSurvey = props.popupModel || new PopupSurvey(model);

    // if (props.expanded !== undefined) {
    //   popupSurvey.isExpanded = props.expanded;
    // }
    // if (props.isExpanded !== undefined) {
    //   popupSurvey.isExpanded = props.isExpanded;
    // }
    // if (props.allowClose !== undefined) {
    //   popupSurvey.allowClose = props.allowClose;
    // }
    // if (props.allowFullScreen !== undefined) {
    //   popupSurvey.allowFullScreen = props.allowFullScreen;
    // }
    // if (props.closeOnCompleteTimeout !== undefined) {
    //   popupSurvey.closeOnCompleteTimeout = props.closeOnCompleteTimeout;
    // }
    // popupSurvey.show();
  });
}

SurveyModel.platform = "jquery";

export const preact: any = React;

export * from "./jquery-ui-model";
export * from "./core-export";

export { SurveyModel as Model } from "survey-core";

import { checkLibraryVersion } from "survey-core";

checkLibraryVersion(`${process.env.VERSION}`, "survey-jquery-ui");