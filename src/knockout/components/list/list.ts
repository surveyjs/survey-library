import * as ko from "knockout";

const template = require("./list.html");

export class ListViewModel {
  public isExpanded: ko.Observable<boolean> = ko.observable(false);
  public selectedItem: ko.Observable<ListItem> = ko.observable();

  constructor(
    public items: ko.MaybeObservableArray<ListItem>,
    public onItemSelect: (item: ListItem) => void,
    public allowSelection: ko.MaybeObservable<boolean>,
    selectedItem?: ko.Observable<ListItem>
  ) {
    if (selectedItem !== undefined) {
      this.selectedItem = selectedItem;
    }
  }

  public selectItem = (itemValue: ListItem) => {
    this.isExpanded(false);
    if (ko.unwrap(this.allowSelection)) this.selectedItem(itemValue);
    if (!!this.onItemSelect) {
      this.onItemSelect(itemValue);
    }
  };

  public isItemDisabled = (itemValue: ListItem) => {
    return itemValue.isEnabled !== undefined && !ko.unwrap(itemValue.isEnabled);
  };
}

export interface ListItem {
  title: ko.MaybeObservable<string>;
  iconName: ko.MaybeObservable<string>;
  isEnabled?: boolean;
}

ko.components.register("svc-list", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const viewModel = new ListViewModel(
        params.items,
        params.onItemSelect,
        params.allowSelection,
        params.selectedItem
      );
      return viewModel;
    },
  },
  template: template,
});
