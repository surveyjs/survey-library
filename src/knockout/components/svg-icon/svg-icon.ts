import * as ko from "knockout";
import { createSvg } from "survey-core";
const template = require("./svg-icon.html");

export var SvgIconViewModel: any;

ko.components.register("sv-svg-icon", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      ko.computed(() => {
        const iconName = ko.unwrap(params.iconName);
        if(iconName) {
          createSvg(
            ko.unwrap(params.size),
            ko.unwrap(params.width),
            ko.unwrap(params.height),
            iconName,
            componentInfo.element.querySelector("svg")
          );
        }
      });
      return {
        hasIcon: params.iconName
      };
    },
  },
  template: template,
});
