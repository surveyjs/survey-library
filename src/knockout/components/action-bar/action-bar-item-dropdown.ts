import * as ko from "knockout";

const template = require("./action-bar-item-dropdown.html");

export var ActionBarItemDropdownViewModel: any;

ko.components.register("sv-action-bar-item-dropdown", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      var isVisible = ko.observable(false);
      return {
        id: params.item.id,
        title: params.item.title,
        icon: params.item.icon,
        action: () => {
          isVisible(!isVisible());
        },
        model: {
          onItemSelect: (item: any) => {
            params.item.action(item);
          },
          items: params.item.items,
          selectedItem: params.item.selectedItem
        },
        isVisible: isVisible,
        name: "sv-list",
        verticalPosition: params.item.verticalPosition || "middle",
        horizontalPosition: params.item.horizontalPosition || "right",
        showPointer: true
      };
    },
  },
  template: template,
});
