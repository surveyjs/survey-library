import * as ko from "knockout";
import jQuery from "jquery";

// model
export * from "./chunks/model";

// localization
import "./chunks/localization";

// helpers
export * from "./chunks/helpers";

// css standard
export { defaultStandardCss } from "../defaultCss/cssstandard";
// css bootstrap
export { defaultBootstrapCss } from "../defaultCss/cssbootstrap";
// css bootstrap + material
export { defaultBootstrapMaterialCss } from "../defaultCss/cssbootstrapmaterial";
export { modernCss } from "../defaultCss/cssmodern";

import { Survey, SurveyWindow } from "./knockout";
export { Survey as Model };

import { SurveyModel } from "../survey";
import { registerTemplateEngine } from "../knockout/kosurvey";

jQuery["fn"].extend({
  Survey: function (props: any) {
    return this.each(function () {
      var model: Survey = props.model;
      model.updateSurvey(props);
      model.render(this);
    });
  },

  SurveyWindow: function (props: any) {
    return this.each(function () {
      var model: Survey = props.model;
      model.updateSurvey(props);
      var survey = new SurveyWindow(null, model);
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
  },
});

SurveyModel.platform = "jquery";

registerTemplateEngine(ko, SurveyModel.platform);
