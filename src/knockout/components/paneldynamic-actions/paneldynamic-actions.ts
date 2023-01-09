import * as ko from "knockout";

const addBtnTemplate = require("./paneldynamic-add-btn.html");
const nextBtnTemplate = require("./paneldynamic-next-btn.html");
const prevBtnTemplate = require("./paneldynamic-prev-btn.html");
const progressTextTemplate = require("./paneldynamic-progress-text.html");
const removeBtnTemplate = require("./paneldynamic-remove-btn.html");

export var SurveyQuestionPaneldynamicActioons: any;

function getPaneldynamicActionViewModel() {
  return {
    createViewModel: (params: any, componentInfo: any) => {
      return (!!params.item && params.item.data) || params;
    },
  };
}

ko.components.register("sv-paneldynamic-add-btn", {
  viewModel: getPaneldynamicActionViewModel(),
  template: addBtnTemplate,
});
ko.components.register("sv-paneldynamic-next-btn", {
  viewModel: getPaneldynamicActionViewModel(),
  template: nextBtnTemplate,
});
ko.components.register("sv-paneldynamic-prev-btn", {
  viewModel: getPaneldynamicActionViewModel(),
  template: prevBtnTemplate,
});
ko.components.register("sv-paneldynamic-progress-text", {
  viewModel: getPaneldynamicActionViewModel(),
  template: progressTextTemplate,
});
ko.components.register("sv-paneldynamic-remove-btn", {
  viewModel: getPaneldynamicActionViewModel(),
  template: removeBtnTemplate,
});