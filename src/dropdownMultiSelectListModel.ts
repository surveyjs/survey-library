import { Action, IAction } from "./actions/action";
import { DropdownListModel } from "./dropdownListModel";
import { ItemValue } from "./itemvalue";
import { property } from "./jsonobject";
import { MultiSelectListModel } from "./multiSelectListModel";
import { Question } from "./question";
import { settings } from "./settings";

export class DropdownMultiSelectListModel extends DropdownListModel {

  @property({ defaultValue: "" }) filterStringPlaceholder: string;
  @property({ defaultValue: true }) closeOnSelect: boolean;

  private updateListState() {
    (<MultiSelectListModel>this.listModel).updateState();
    this.syncFilterStringPlaceholder();
  }

  private syncFilterStringPlaceholder(actions?: Array<Action>) {
    const selectedActions = actions || this.getSelectedActions();
    if (selectedActions.length || this.question.selectedItems.length) {
      this.filterStringPlaceholder = undefined;
    } else {
      this.filterStringPlaceholder = this.question.placeholder;
    }
  }
  private getSelectedActions(visibleItems?: Array<Action>) {
    return (visibleItems || this.listModel.actions).filter(item => (this.question.isAllSelected && item.id === "selectall") || !!ItemValue.getItemByValue(this.question.selectedItems, item.id));
  }

  protected override createListModel(): MultiSelectListModel {
    const visibleItems = this.getAvailableItems();
    let _onSelectionChanged = this.onSelectionChanged;
    if (!_onSelectionChanged) {
      _onSelectionChanged = (item: IAction, status: string) => {
        this.resetFilterString();
        if (item.id === "selectall") {
          this.selectAllItems();
        } else if (status === "added" && item.id === settings.noneItemValue) {
          this.selectNoneItem();
        } else if (status === "added") {
          this.selectItem(item.id);
        } else if (status === "removed") {
          this.deselectItem(item.id);
        }
        this.popupRecalculatePosition(false);
        if (this.closeOnSelect) {
          this.popupModel.isVisible = false;
        }
      };
    }
    return new MultiSelectListModel(visibleItems, _onSelectionChanged, false);
  }

  public selectAllItems(): void {
    this.question.toggleSelectAll();
    this.updateListState();
  }
  public selectNoneItem(): void {
    this.question.renderedValue = [settings.noneItemValue];
    this.updateListState();
  }
  public selectItem(id: string): void {
    let newValue = [].concat(this.question.renderedValue || []);
    newValue.push(id);
    this.question.renderedValue = newValue;
    this.updateListState();
  }
  public deselectItem(id: string): void {
    let newValue = [].concat(this.question.renderedValue || []);
    newValue.splice(newValue.indexOf(id), 1);
    this.question.renderedValue = newValue;
    this.updateListState();
  }
  public onClear(event: any): void {
    super.onClear(event);
    this.updateListState();
  }
  public setHideSelectedItems(newValue: boolean) {
    (<MultiSelectListModel>this.listModel).hideSelectedItems = newValue;
    this.updateListState();
  }
  public removeLastSelectedItem() {
    this.deselectItem(this.question.renderedValue[this.question.renderedValue.length - 1]);
    this.popupRecalculatePosition(false);
  }

  constructor(question: Question, onSelectionChanged?: (item: IAction, ...params: any[]) => void) {
    super(question, onSelectionChanged);
    this.setHideSelectedItems(question.hideSelectedItems);
    this.syncFilterStringPlaceholder();
    this.closeOnSelect = question.closeOnSelect;
  }

  public inputKeyHandler(event: any): void {
    if (event.keyCode === 8 && !this.filterString) {
      this.removeLastSelectedItem();
      event.preventDefault();
      event.stopPropagation();
    }
  }
}