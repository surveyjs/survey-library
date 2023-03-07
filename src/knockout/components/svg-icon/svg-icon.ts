import * as ko from "knockout";
import { createSvg } from "survey-core";
const template = require("./svg-icon.html");

export var SvgIconViewModel: any;

ko.components.register("sv-svg-icon", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      ko.computed(() => {
        const iconName = ko.unwrap(params.iconName);
        const element = componentInfo.element.querySelector && componentInfo.element.querySelector("svg") || componentInfo.element.nextElementSibling;
        if(iconName) {
          createSvg(
            ko.unwrap(params.size),
            ko.unwrap(params.width),
            ko.unwrap(params.height),
            iconName,
            element,
            ko.unwrap(params.title),
          );
        }
      });
      return {
        hasIcon: params.iconName,
        css: params.css,
        title: params.title
      };
    },
  },
  template: template,
});
