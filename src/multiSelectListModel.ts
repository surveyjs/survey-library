import { property } from "./jsonobject";
import { Action, IAction } from "./actions/action";
import { ListModel } from "./list";

export class MultiSelectListModel extends ListModel {
  public selectedItems: Array<IAction>;
  @property() hideSelectedItems: boolean;

  private updateItemState() {
    this.actions.forEach(action => {
      const isSelected = this.isItemSelected(action);
      action.active = isSelected;
      action.visible = this.hideSelectedItems ? !isSelected : true;
    });
  }

  constructor(items: Array<IAction>, onSelectionChanged: (item: Action, status: string) => void, allowSelection: boolean, selectedItems?: Array<IAction>, onFilterStringChangedCallback?: (text: string) => void) {
    super(items, onSelectionChanged, allowSelection, undefined, onFilterStringChangedCallback);
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
    this.updateItemState();
    this.isEmpty = this.renderedActions.filter(action => this.isItemVisible(action)).length === 0;
  }

  public initFocusedItem() {
    if(this.hideSelectedItems || !this.selectedItems.length) {
      this.focusFirstVisibleItem();
    } else if(!!this.selectedItems.length) {
      this.focusedItem = this.visibleItems.filter(item => item.id === this.selectedItems[0].id)[0];
    }
  }

  public selectFocusedItem(): void {
    super.selectFocusedItem();
    if(this.hideSelectedItems) {
      this.focusNextVisibleItem();
    }
  }
}