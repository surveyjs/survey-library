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
  private popupTargetModified() {
    setTimeout(() => {
      this.popupModel.targetModified();
    }, 1);
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
        this.popupTargetModified();
      };
    }
    return new MultiSelectListModel(visibleItems, _onSelectionChanged, true, this.getSelectedActions(visibleItems));
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
  public removeLastSelectedItem() {
    this.deselectItem(this.question.renderedValue[this.question.renderedValue.length - 1]);
  }

  constructor(question: Question, onSelectionChanged?: (item: IAction, ...params: any[]) => void) {
    super(question, onSelectionChanged);
    this.setHideSelectedItems(question.hideSelectedItems);
  }

  public inputKeyUpHandler(event: any): void {
    if(event.keyCode === 8) {
      this.removeLastSelectedItem();
      event.preventDefault();
      event.stopPropagation();
    } else {
      super.inputKeyUpHandler(event);
    }
  }
}