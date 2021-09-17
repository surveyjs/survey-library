import * as ko from "knockout";
import { SurveyElementCore } from "survey-core";

export var TitleElementViewModel: any;

ko.components.register("survey-element-title", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const element: SurveyElementCore = params.element;
      const rootEl = componentInfo.element;
      const titleEl = document.createElement(element.titleTagName);
      const ariaLabelAttr = element.getType() === "radiogroup" ? "" : "'aria-label': element.locTitle.renderedHtml,";
      titleEl.setAttribute("data-bind", `css: element.cssTitle, attr: { ${ariaLabelAttr} id: element.ariaTitleId, tabindex: element.titleTabIndex, 'aria-expanded': element.titleAriaExpanded }, click: function() { element.toggleState()}, key2click}`);
      titleEl.innerHTML = "<!-- ko component: { name: 'sv-title-actions', params: {element: element } } --><!-- /ko -->";
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

