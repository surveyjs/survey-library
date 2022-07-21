import { Action, IAction } from "./actions/action";
import { DropdownListModel } from "./dropdownListModel";
import { ItemValue } from "./itemvalue";
import { MultiSelectListModel } from "./multiSelectListModel";
import { QuestionTagboxModel } from "./question_tagbox";

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
        if(item.id === "selectall") {
          this.question.toggleSelectAll();
          this.syncSelectedItemsFromQuestion();
          return;
        }
        let newValue = [].concat(this.question.renderedValue || []);
        if(status === "added" && item.id == "none") {
          newValue = ["none"];
        } else if(status === "added") {
          newValue.push(item.id);
        } else {
          newValue.splice(newValue.indexOf(item.id), 1);
        }
        this.question.renderedValue = newValue;
        this.syncSelectedItemsFromQuestion();
      };
    }
    return new MultiSelectListModel(visibleItems, _onSelectionChanged, true, this.getSelectedActions(visibleItems));
  }

  protected onClear(event: any): void {
    super.onClear(event);
    this.syncSelectedItemsFromQuestion();
  }

  constructor(question: QuestionTagboxModel, onSelectionChanged?: (item: IAction, ...params: any[]) => void) {
    super(question, onSelectionChanged);
  }
}