import * as ko from "knockout";
import { SvgRegistry } from "survey-core";

ko.components.register("sv-svg-bundle", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const element = componentInfo.element.querySelector && componentInfo.element.querySelector("svg") || componentInfo.element.nextElementSibling;
      element.innerHTML = SvgRegistry.iconsRenderedHtml();
      return params;
    }
  },
  template: "<svg id='sv-icon-holder-global-container' style=\"display:none\"></svg>"
});