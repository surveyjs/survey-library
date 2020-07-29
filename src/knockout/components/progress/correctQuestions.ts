import * as ko from "knockout";
var template = require("html-loader?interpolate!val-loader!./correctquestions.html");
export var progressCorrectQuestionsComponent: any;

ko.components.register("survey-progress-correctquestions", {
    viewModel: function (params: any) {
      this.survey = params.model;
      return { model: this.survey };
    },
    template: template
  });