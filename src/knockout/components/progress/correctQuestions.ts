import * as ko from "knockout";
var template = require("html-loader?interpolate!val-loader!./correctquestions.html");
export var progressCorrectQuestionsViewModel: any = function(params: any) {
  this.survey = params.model;
  return { model: this.survey };
};

ko.components.register("survey-progress-correctquestions", {
  viewModel: progressCorrectQuestionsViewModel,
  template: template
});