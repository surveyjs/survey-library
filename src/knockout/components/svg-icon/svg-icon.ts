import * as ko from "knockout";
import { createSvg } from "../../../utils/utils";
const template = require("./svg-icon.html");

export var SvgIconViewModel: any;

ko.components.register("sv-svg-icon", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      ko.computed(() => {
        createSvg(
          ko.unwrap(params.size),
          ko.unwrap(params.width),
          ko.unwrap(params.height),
          ko.unwrap(params.iconName),
          componentInfo.element.childNodes[0]
        );
      });
    },
  },
  template: template,
});
