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
        showTitle: params.item.showTitle,
        innerCss: params.item.innerCss,
        css: params.item.css,
        iconName: params.item.iconName,
        action: () => {
          isVisible(!isVisible());
        },
        model: {
          onItemSelect: (item: any) => {
            params.item.action(item);
            if (params.item.closeOnAction) {
              isVisible(false);
            }
          },
          items: params.item.items,
          selectedItem: params.item.selectedItem,
        },
        isVisible: isVisible,
        name: "sv-list",
        verticalPosition: params.item.verticalPosition || "middle",
        horizontalPosition: params.item.horizontalPosition || "right",
        showPointer: true,
      };
    },
  },
  template: template,
});
