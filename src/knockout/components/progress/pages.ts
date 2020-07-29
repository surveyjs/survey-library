import * as ko from "knockout";
var template = require("html-loader?interpolate!val-loader!./pages.html");
export var progressPagesComponent: any;

ko.components.register("survey-progress-pages", {
    viewModel: function (params: any) {
      this.survey = params.model;
      return { model: this.survey };
    },
    template: template
  });