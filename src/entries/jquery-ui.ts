import * as React from "react";
import * as ReactDOM from "react-dom";
import jQuery from "jquery";

import { Survey, PopupSurvey } from "./react-ui-model";
export { Survey } from "./react-ui-model";
export * from "./core-wo-model";

// themes settings
export * from "./plugins";

// localization
import "./chunks/localization";

import { SurveyModel } from "./core";

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
    const survey = React.createElement(Survey, { ...props });
    ReactDOM.render(survey, this);

    var popupSurvey = props.popupModel || new PopupSurvey(model);

    if (props.expanded !== undefined) {
      popupSurvey.isExpanded = props.expanded;
    }
    if (props.isExpanded !== undefined) {
      popupSurvey.isExpanded = props.isExpanded;
    }
    if (props.allowClose !== undefined) {
      popupSurvey.allowClose = props.allowClose;
    }
    if (props.allowFullScreen !== undefined) {
      popupSurvey.allowFullScreen = props.allowFullScreen;
    }
    if (props.closeOnCompleteTimeout !== undefined) {
      popupSurvey.closeOnCompleteTimeout = props.closeOnCompleteTimeout;
    }
    popupSurvey.show();
  });
}

SurveyModel.platform = "jquery";

export * from "./react";
