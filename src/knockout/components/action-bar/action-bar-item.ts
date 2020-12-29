import * as ko from "knockout";

const template = require("./action-bar-item.html");

export class ActionBarItemViewModel {
  constructor(item: any) {
    Object.getOwnPropertyNames(item).forEach((propertyName) => {
      Object.defineProperty(this, propertyName, {
        get: () => {
          const propertyValue = item[propertyName];
          if (typeof propertyValue === "function" && propertyName != "action") {
            return propertyValue();
          } else {
            return propertyValue;
          }
        },
      });
    });
  }
}

ko.components.register("sv-action-bar-item", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return new ActionBarItemViewModel(params.item);
    },
  },
  template: template,
});
