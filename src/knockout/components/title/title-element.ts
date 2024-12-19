/* eslint-disable no-restricted-globals */
import * as ko from "knockout";
import { SurveyElement, SurveyElementCore } from "survey-core";

export var TitleElementViewModel: any;

ko.components.register("survey-element-title", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const element: SurveyElement = params.element;
      const rootEl = componentInfo.element;
      const titleEl = document.createElement(element.titleTagName);
      const ariaLabelAttr = !element.titleAriaLabel ? "" : "'aria-label': element.titleAriaLabel,";
      let bindings = `css: element.cssTitle, attr: { ${ariaLabelAttr} id: element.ariaTitleId, tabindex: element.titleTabIndex, 'aria-expanded': element.titleAriaExpanded, role: element.titleAriaRole }`;
      if (element.hasTitleEvents) {
        bindings += ", key2click";
      }
      titleEl.setAttribute("data-bind", bindings);

      let innerHTML = "<!-- ko component: { name: 'sv-title-actions', params: {element: element } } --><!-- /ko -->";

      let iconExpandSvg, iconCollapseSvg;
      if (element.getCssTitleExpandableSvg()) {
        const getSvgComponentString = (iconName: string)=>`<!-- ko component: { name: 'sv-svg-icon', params: { css: element.getCssTitleExpandableSvg(), iconName: '${iconName}', size: 'auto' } } --><!-- /ko -->`;
        iconExpandSvg = `<!-- ko ifnot: element.isExpanded -->${getSvgComponentString("icon-expand-16x16")}<!-- /ko -->`;
        iconCollapseSvg = `<!-- ko if: element.isExpanded -->${getSvgComponentString("icon-collapse-16x16")}<!-- /ko -->`;
        innerHTML = iconExpandSvg + iconCollapseSvg + innerHTML;
      }

      titleEl.innerHTML = innerHTML;
      const dummyNode = rootEl.nextSibling;
      rootEl.parentNode.insertBefore(document.createComment(" ko if: element.hasTitle "), dummyNode);
      rootEl.parentNode.insertBefore(titleEl, dummyNode);
      rootEl.parentNode.insertBefore(document.createComment(" /ko "), dummyNode);
      rootEl.parentNode.removeChild(dummyNode);
      return { element: element };
    },
  },
  template: "<span></span>",
});