import * as ko from "knockout";

const template = require("./paneldynamic-v2.html");
import { RendererFactory } from "survey-core";
export { PanelDynamicV2NavigatorViewModel } from "./paneldynamic-v2-navigator";
export var PanelDynamicV2ViewModel: any;

ko.components.register("sv-paneldynamic-v2", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return { };
    },
  },
  template: template,
});

RendererFactory.Instance.registerRenderer(
  "paneldynamic",
  "paneldynamicV2",
  "sv-paneldynamic-v2"
);
