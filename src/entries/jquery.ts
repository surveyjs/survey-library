import * as ko from "knockout";
import { SurveyModel } from "../survey";
import { Survey } from "../knockout/kosurvey";
import { SurveyWindow } from "../knockout/koSurveyWindow";
import jQuery from "jquery";

jQuery["fn"].extend({
  Survey: function(props) {
    this.each(function() {
      props.model.render(this);
    });
  },

  SurveyWindow: function(props) {
    this.each(function() {
      var survey = new SurveyWindow(...props);
      survey.show();
    });
  }
});

SurveyModel.platform = "jquery";

export * from "./knockout";
