import { property } from "./jsonobject";
import { Action, BaseAction, IAction } from "./actions/action";
import { IListModel, ListModel } from "./list";

export interface IMultiSelectListModel extends IListModel {
  selectedItems?: Array<IAction>;
}
export class MultiSelectListModel<T extends BaseAction = Action> extends ListModel<T> {
  public selectedItems: Array<IAction>;
  @property() hideSelectedItems: boolean;

  private updateItemState() {
    this.actions.forEach(action => {
      const isSelected = this.isItemSelected(action);
      action.visible = this.hideSelectedItems ? !isSelected : true;
    });
  }

  constructor(options: IMultiSelectListModel) {
    super(options as any);
    this.setSelectedItems(options.selectedItems || []);
  }

  public onItemClick = (item: T) => {
    if(this.isItemDisabled(item)) return;

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
    return !!this.allowSelection && this.selectedItems.filter(item => this.areSameItems(item, itemValue)).length > 0;
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