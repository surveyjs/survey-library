import * as ko from "knockout";
const template = require("./svg-icon.html");
// import template from "./svg-icon.html";

export var SvgIconViewModel: any;

ko.components.register("sv-svg-icon", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      ko.computed(() => {
        var size = ko.unwrap(params.size);
        var width = ko.unwrap(params.width);
        var height = ko.unwrap(params.height);
        var svgElem: any = componentInfo.element.childNodes[0];
        svgElem.style.width = (size || width || 16) + "px";
        svgElem.style.height = (size || height || 16) + "px";
        var node: any = svgElem.childNodes[0];
        node.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          "#" + ko.unwrap(params.iconName)
        );
      });
    },
  },
  template: template,
});
