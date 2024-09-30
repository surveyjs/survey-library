import * as ko from "knockout";
const template = require("./action-bar-item.html");
export let ActionBarItemViewModel: any;

ko.components.register("sv-action-bar-item", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      let el = componentInfo.element;
      el = !!el.nextElementSibling ? el.nextElementSibling : el.parentElement.firstElementChild;
      if(!!el) {
        const item = params.item;
        el.onfocus = function (args: any) { item.doFocus(args); };
        el.onmousedown = function (args: any) { item.doMouseDown(args); };
      }
      return params;
    },
  },
  template: template
});
