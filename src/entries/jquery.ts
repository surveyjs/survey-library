import * as ko from "knockout";
import jQuery from "jquery";

import { Survey, PopupSurvey } from "./knockout-ui-model";
export { Model } from "./knockout-ui-model";
export * from "./core-wo-model";

// localization
import "./chunks/localization";

const innerKo: any = ko;
export { innerKo as ko };
import { SurveyModel } from "./core";
import { registerTemplateEngine } from "../knockout/kosurvey";

jQuery["fn"].extend({
  Survey: function (props: any) {
    return this.each(function () {
      var model: Survey = props.model;
      model.updateSurvey(props);
      model.render(this);
    });
  },
  PopupSurvey: doPopupSurvey,
  SurveyWindow: doPopupSurvey
});

function doPopupSurvey(props: any): void {
  return this.each(function () {
    var model: Survey = props.model;
    model.updateSurvey(props);
    var survey = new PopupSurvey(null, model);
    if (props.expanded !== undefined) {
      survey.isExpanded = props.expanded;
    }
    if (props.isExpanded !== undefined) {
      survey.isExpanded = props.isExpanded;
    }
    if (props.closeOnCompleteTimeout !== undefined) {
      survey.closeOnCompleteTimeout = props.closeOnCompleteTimeout;
    }
    survey.show();
  });
}

SurveyModel.platform = "jquery";

registerTemplateEngine(ko, SurveyModel.platform);
