import * as ko from "knockout";
import { SurveyElementCore } from "survey-core";

export var TitleElementViewModel: any;

ko.components.register("survey-element-title", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const element: SurveyElementCore = params.element;
      const rootEl = componentInfo.element;
      const titleEl = document.createElement(element.titleTagName);
      titleEl.setAttribute("data-bind", "css: cssTitle, attr: { 'aria-label': $data.locTitle.renderedHtml, id: ariaTitleId, tabindex: $data.titleTabIndex, 'aria-expanded': $data.titleAriaExpanded }, click: function() { $data.toggleState()}, key2click");
      titleEl.innerHTML = "<!-- ko component: { name: 'sv-title-actions', params: {element: $data } } --><!-- /ko -->";
      titleEl.className = element.cssTitle;
      const dummyNode = rootEl.nextSibling;
      rootEl.parentNode.insertBefore(titleEl, dummyNode);
      rootEl.parentNode.removeChild(dummyNode);
      return element;
    },
  },
  template: "<span></span>",
});

