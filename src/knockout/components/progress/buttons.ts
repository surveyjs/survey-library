import * as ko from "knockout";
var template = require("html-loader?interpolate!val-loader!./buttons.html");
export var progressButtonsComponent: any;

ko.components.register("survey-progress-buttons", {
    viewModel: function (params: any) {
      this.survey = params.model;
      var getListElementCss = function(index: any): string {
        return (params.model.currentPageNo === index() ?
          params.model.css.progressButtonsListElementCurrent : "") ||
          (params.model.visiblePages[index()].passed ?
            params.model.css.progressButtonsListElementPassed : "");
      }
      return { model: this.survey, getListElementCss: getListElementCss };
      //nodeDOMremoval чтобы отключать таймер
    },
    template: template
  });