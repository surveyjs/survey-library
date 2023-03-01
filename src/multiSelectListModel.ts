import { property } from "./jsonobject";
import { Action, BaseAction, IAction } from "./actions/action";
import { ListModel } from "./list";

export class MultiSelectListModel<T extends BaseAction = Action> extends ListModel<T> {
  public selectedItems: Array<IAction>;
  @property() hideSelectedItems: boolean;

  private updateItemState() {
    this.actions.forEach(action => {
      const isSelected = this.isItemSelected(action);
      action.visible = this.hideSelectedItems ? !isSelected : true;
    });
  }

  constructor(items: Array<IAction>, onSelectionChanged: (item: T, status: string) => void, allowSelection: boolean, selectedItems?: Array<IAction>, onFilterStringChangedCallback?: (text: string) => void) {
    super(items, onSelectionChanged, allowSelection, undefined, onFilterStringChangedCallback);
    this.setSelectedItems(selectedItems || []);
  }

  public onItemClick = (item: T) => {
    this.isExpanded = false;
    if (this.isItemSelected(item)) {
      this.selectedItems.splice(this.selectedItems.indexOf(item), 1)[0];
      !!this.onSelectionChanged && (this.onSelectionChanged(<T>item, "removed"));
    } else {
      this.selectedItems.push(item);
      !!this.onSelectionChanged && (this.onSelectionChanged(item, "added"));
    }
  };

  public isItemDisabled: (itemValue: T) => boolean = (itemValue: T) => {
    return itemValue.enabled !== undefined && !itemValue.enabled;
  };

  public isItemSelected: (itemValue: T) => boolean = (itemValue: T) => {
    return !!this.allowSelection && this.selectedItems.filter(item => item.id == itemValue.id).length > 0;
  };
  public updateState(): void {
    this.updateItemState();
    this.isEmpty = this.renderedActions.filter(action => this.isItemVisible(action)).length === 0;
  }

  public setSelectedItems(newItems: Array<IAction>): void {
    this.selectedItems = newItems;
    this.updateState();
  }

  public selectFocusedItem(): void {
    super.selectFocusedItem();
    if (this.hideSelectedItems) {
      this.focusNextVisibleItem();
    }
  }
}