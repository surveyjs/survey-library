import * as ko from "knockout";
import jQuery from "jquery";

import { Survey, PopupSurvey } from "./knockout-ui-model";
export { Model } from "./knockout-ui-model";
export * from "./core-wo-model";

// themes settings
export * from "./plugins";

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
    } as any);
  },
  PopupSurvey: doPopupSurvey,
  SurveyWindow: doPopupSurvey
});

function doPopupSurvey(props: any): void {
  return this.each(function () {
    var model: Survey = props.model;
    model.updateSurvey(props);

    var popupSurvey = props.popupModel || new PopupSurvey(null, model);

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

registerTemplateEngine(ko, SurveyModel.platform);
