import { Action, IAction } from "./actions/action";
import { ListModel } from "./list";
// import { Base, ComputedUpdater } from "./base";
// import { DropdownListModel } from "./dropdownListModel";
// import { ItemValue } from "./itemvalue";
// import { Question } from "./question";
// import { findParentByClassNames, doKey2ClickBlur, doKey2ClickUp } from "./utils/utils";

export class MultiSelectListModel extends ListModel {

  constructor(items: Array<IAction>, onSelectionChanged: (item: Action, status: string) => void, allowSelection: boolean, public selectedItems?: Array<IAction>, onFilteredTextChangedCallback?: (text: string) => void) {
    super(items, onSelectionChanged, allowSelection, undefined, onFilteredTextChangedCallback);
    if(!this.selectedItems) {
      this.selectedItems = [];
    }
  }

  public onItemClick = (item: Action) => {
    this.isExpanded = false;
    if (this.isItemSelected(item)) {
      const removedItem = this.selectedItems.splice(this.selectedItems.indexOf(item), 1)[0];
      !!this.onSelectionChanged && (this.onSelectionChanged(<Action>removedItem, "removed"));
    } else {
      this.selectedItems.push(item);
      !!this.onSelectionChanged && (this.onSelectionChanged(item, "added"));
    }
  };

  public isItemDisabled: (itemValue: Action) => boolean = (itemValue: Action) => {
    return itemValue.enabled !== undefined && !itemValue.enabled;
  };

  public isItemSelected: (itemValue: Action) => boolean = (itemValue: Action) => {
    return !!this.allowSelection && !!this.selectedItems && this.selectedItems.filter(item => item.id == itemValue.id).length > 0;
  };
}
