import { Action, IAction } from "./actions/action";
import { DropdownListModel } from "./dropdownListModel";
import { ItemValue } from "./itemvalue";
import { MultiSelectListModel } from "./multiSelectListModel";
import { Question } from "./question";

export class DropdownMultiSelectListModel extends DropdownListModel {

  private getSelectedActions(visibleItems?: Array<Action>) {
    return (visibleItems || this.listModel.actions).filter(item => (this.question.isAllSelected && item.id === "selectall") || !!ItemValue.getItemByValue(this.question.selectedItems, item.id));
  }
  private syncSelectedItemsFromQuestion() {
    (<MultiSelectListModel>this.listModel).setSelectedItems(this.getSelectedActions());
  }

  protected override createListModel(): MultiSelectListModel {
    const visibleItems = this.getAvailableItems();
    let _onSelectionChanged = this.onSelectionChanged;
    if(!_onSelectionChanged) {
      _onSelectionChanged = (item: IAction, status: string) => {
        this.resetFilterString();
        if(item.id === "selectall") {
          this.selectAllItems();
        } else if(status === "added" && item.id == "none") {
          this.selectNoneItem();
        } else if(status === "added") {
          this.selectItem(item.id);
        } else if(status === "removed") {
          this.deselectItem(item.id);
        }
      };
    }
    return new MultiSelectListModel(visibleItems, _onSelectionChanged, true, this.getSelectedActions(visibleItems));
  }

  protected onHidePopup() {
    this.resetFilterString();
  }

  public selectAllItems(): void {
    this.question.toggleSelectAll();
    this.syncSelectedItemsFromQuestion();
  }
  public selectNoneItem(): void {
    this.question.renderedValue = ["none"];
    this.syncSelectedItemsFromQuestion();
  }
  public selectItem(id: string): void {
    let newValue = [].concat(this.question.renderedValue || []);
    newValue.push(id);
    this.question.renderedValue = newValue;
    this.syncSelectedItemsFromQuestion();
  }
  public deselectItem(id: string): void {
    let newValue = [].concat(this.question.renderedValue || []);
    newValue.splice(newValue.indexOf(id), 1);
    this.question.renderedValue = newValue;
    this.syncSelectedItemsFromQuestion();
  }
  public onClear(event: any): void {
    super.onClear(event);
    this.syncSelectedItemsFromQuestion();
  }
  public setHideSelectedItems(newValue: boolean) {
    (<MultiSelectListModel>this.listModel).hideSelectedItems = newValue;
    this.syncSelectedItemsFromQuestion();
  }

  constructor(question: Question, onSelectionChanged?: (item: IAction, ...params: any[]) => void) {
    super(question, onSelectionChanged);
    this.setHideSelectedItems(question.hideSelectedItems);
  }
}