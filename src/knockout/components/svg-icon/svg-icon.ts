import * as ko from "knockout";
import { createSvg } from "survey-core";
const template = require("./svg-icon.html");

export var SvgIconViewModel: any;

ko.components.register("sv-svg-icon", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      let iconName = ko.unwrap(params.iconName);
      ko.computed(() => {
        if(iconName) {
          createSvg(
            ko.unwrap(params.size),
            ko.unwrap(params.width),
            ko.unwrap(params.height),
            iconName,
            componentInfo.element.childNodes[0]
          );
        }
      });
      return {
        hasIcon: iconName
      };
    },
  },
  template: template,
});
