import * as ko from "knockout";
import { SurveyModel } from "../survey";
import { Survey } from "../knockout/kosurvey";
import { SurveyWindow } from "../knockout/koSurveyWindow";
import jQuery from "jquery";
import { updateSurveyProps } from "../utils/updateSurveyProps";

jQuery["fn"].extend({
  Survey: function(props: any) {
    return this.each(function() {
      var model = props.model;
      updateSurveyProps(model, props);
      model.render(this);
    });
  },

  SurveyWindow: function(props: any) {
    return this.each(function() {
      var model = props.model;
      updateSurveyProps(model, props);
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
  }
});

SurveyModel.platform = "jquery";

export * from "./knockout";
