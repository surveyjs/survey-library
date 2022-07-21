import { Action, IAction } from "./actions/action";
import { ListModel } from "./list";

export class MultiSelectListModel extends ListModel {
  public selectedItems: Array<IAction>;

  private updateItemActiveState() {
    this.actions.forEach(action => action.active = this.isItemSelected(action));
  }

  constructor(items: Array<IAction>, onSelectionChanged: (item: Action, status: string) => void, allowSelection: boolean, selectedItems?: Array<IAction>, onFilteredTextChangedCallback?: (text: string) => void) {
    super(items, onSelectionChanged, allowSelection, undefined, onFilteredTextChangedCallback);
    this.setSelectedItems(selectedItems || []);
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
    return !!this.allowSelection && this.selectedItems.filter(item => item.id == itemValue.id).length > 0;
  };

  public setSelectedItems(newItems: Array<IAction>) : void {
    this.selectedItems = newItems;
    this.updateItemActiveState();
  }
}
