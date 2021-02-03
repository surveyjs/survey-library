import * as ko from "knockout";

const template = require("./list.html");

export class ListViewModel {
  public isExpanded: any /*ko.Observable<boolean>*/ = ko.observable(false);
  public selectedItem: any /*ko.Observable<ListItem>*/ = ko.observable();

  constructor(
    private _items: any, // ko.MaybeObservableArray<ListItem>,
    public onItemSelect: (item: ListItem) => void,
    public allowSelection: any, // ko.MaybeObservable<boolean>,
    selectedItem?: any // ko.Observable<ListItem>
  ) {
    if (selectedItem !== undefined) {
      if (ko.isObservable(selectedItem)) this.selectedItem = selectedItem;
      else this.selectedItem(selectedItem);
    }
  }

  public get items(): ListItem[] {
    if (typeof this._items === "function") return this._items();
    else return this._items;
  }

  public selectItem = (itemValue: ListItem) => {
    this.isExpanded(false);
    if (ko.unwrap(this.allowSelection)) {
      this.selectedItem(itemValue);
    }
    if (!!this.onItemSelect) {
      this.onItemSelect(itemValue);
    }
  };

  public isItemDisabled = (itemValue: ListItem) => {
    return itemValue.isEnabled !== undefined && !ko.unwrap(itemValue.isEnabled);
  };
}

export interface ListItem {
  title: any; // ko.MaybeObservable<string>;
  iconName: any; // ko.MaybeObservable<string>;
  isEnabled?: boolean;
}

ko.components.register("sv-list", {
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
