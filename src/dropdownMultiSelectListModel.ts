import { Action, IAction } from "./actions/action";
import { Base, ComputedUpdater } from "./base";
import { DropdownListModel } from "./dropdownListModel";
import { ItemValue } from "./itemvalue";
import { ListModel } from "./list";
import { MultiSelectListModel } from "./multiSelectListModel";
import { PopupModel } from "./popup";
import { Question } from "./question";
import { PopupUtils } from "./utils/popup";
import { findParentByClassNames, doKey2ClickBlur, doKey2ClickUp } from "./utils/utils";

export class DropdownMultiSelectListModel extends DropdownListModel {
  protected override createListModel(): ListModel {
    const visibleItems = this.getVisibleListItems();
    return new MultiSelectListModel(visibleItems, this.onSelectionChanged, true, visibleItems.filter(item => !!ItemValue.getItemByValue(this.question.selectedItems, item.id)));
  }
  constructor(protected question: Question, protected onSelectionChanged: (item: IAction, ...params: any[]) => void) {
    super(question, onSelectionChanged);
    if(!onSelectionChanged) {
      onSelectionChanged = (item: IAction) => {
        this.question.value = item.id;
        this._popupModel.toggleVisibility();
      };
    }
  }
}