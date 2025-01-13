import { Action, IAction } from "./actions/action";
import { ComputedUpdater } from "./base";
import { DropdownListModel } from "./dropdownListModel";
import { ItemValue } from "./itemvalue";
import { property } from "./jsonobject";
import { IMultiSelectListModel, MultiSelectListModel } from "./multiSelectListModel";
import { Question } from "./question";
import { settings } from "./settings";
import { IsTouch } from "./utils/devices";

export class DropdownMultiSelectListModel extends DropdownListModel {
  @property({ defaultValue: "" }) filterStringPlaceholder: string;
  @property({ defaultValue: true }) closeOnSelect: boolean;

  public locStrsChanged(): void {
    super.locStrsChanged();
    this.syncFilterStringPlaceholder();
  }
  private updateListState() {
    (<MultiSelectListModel<ItemValue>>this.listModel).updateState();
    this.syncFilterStringPlaceholder();
  }

  private syncFilterStringPlaceholder() {
    const selectedActions = this.getSelectedActions();
    if (selectedActions.length || this.question.selectedItems.length || this.listModel.focusedItem) {
      this.filterStringPlaceholder = undefined;
    } else {
      this.filterStringPlaceholder = this.question.placeholder;
    }
  }
  private getSelectedActions() {
    return this.listModel.actions.filter(item => item.selected);
  }
  protected getFocusFirstInputSelector(): string {
    if ((<MultiSelectListModel<ItemValue>>this.listModel).hideSelectedItems && IsTouch && !this.isValueEmpty(this.question.value)) {
      return this.itemSelector;
    } else {
      return super.getFocusFirstInputSelector();
    }
  }
  protected getPopupCssClasses(): string { return "sv-multi-select-list"; }
  protected createListModel(): MultiSelectListModel<ItemValue> {
    const visibleItems = this.getAvailableItems();
    let _onSelectionChanged = this.onSelectionChanged;
    if (!_onSelectionChanged) {
      _onSelectionChanged = (item: ItemValue, status: string) => {
        this.resetFilterString();
        if (item.id === "selectall") {
          this.selectAllItems();
        } else if (status === "added" && item.value === settings.noneItemValue) {
          this.selectNoneItem();
        } else if (status === "added") {
          this.selectItem(item.value);
        } else if (status === "removed") {
          this.deselectItem(item.value);
        }
        this.popupRecalculatePosition(false);
        if (this.closeOnSelect) {
          this.popupModel.isVisible = false;
        }
      };
    }
    const listOptions: IMultiSelectListModel = {
      items: visibleItems,
      onSelectionChanged: _onSelectionChanged,
      allowSelection: false,
      locOwner: this.question,
      elementId: this.listElementId
    };
    const res = new MultiSelectListModel<ItemValue>(listOptions);
    this.setOnTextSearchCallbackForListModel(res);
    res.forceShowFilter = true;
    return res;
  }
  protected resetFilterString(): void {
    super.resetFilterString();
    this.inputString = null;
    this.hintString = "";
  }
  @property() previousValue: any;
  @property({ localizable: { defaultStr: "tagboxDoneButtonCaption" } }) doneButtonCaption: string;
  private get shouldResetAfterCancel() {
    return IsTouch && !this.closeOnSelect;
  }
  protected createPopup(): void {
    super.createPopup();
    this.popupModel.onFooterActionsCreated.add((_, opt) => {
      if (this.shouldResetAfterCancel) {
        opt.actions.push(<IAction>{
          id: "sv-dropdown-done-button",
          title: this.doneButtonCaption,
          innerCss: "sv-popup__button--done",
          needSpace: true,
          action: () => { this.popupModel.isVisible = false; },
          enabled: <boolean>(<any>new ComputedUpdater(() => !this.isTwoValueEquals(this.question.renderedValue, this.previousValue)))
        });
      }
    });
    this.popupModel.onVisibilityChanged.add((_, opt: { isVisible: boolean }) => {
      if (this.shouldResetAfterCancel && opt.isVisible) {
        this.previousValue = [].concat(this.question.renderedValue || []);
      }
    });
    this.popupModel.onCancel = () => {
      if (this.shouldResetAfterCancel) {
        this.question.renderedValue = this.previousValue;
        this.updateListState();
      }
    };
  }

  public selectAllItems(): void {
    this.question.toggleSelectAll();
    if (this.question.isAllSelected && this.question.hideSelectedItems) {
      this.popupModel.hide();
    }
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
    this.applyHintString(this.listModel.focusedItem);
    this.updateListState();
  }
  public clear(): void {
    super.clear();
    this.syncFilterStringPlaceholder();
  }
  public onClear(event: any): void {
    super.onClear(event);
    this.updateListState();
  }
  public setHideSelectedItems(newValue: boolean) {
    (<MultiSelectListModel<ItemValue>>this.listModel).hideSelectedItems = newValue;
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

  public setInputStringFromSelectedItem(newValue: any): void {
    if (this.question.searchEnabled) {
      this.inputString = null;
    }
  }

  protected focusItemOnClickAndPopup() {
    return;
  }
  protected onEscape() {
    return;
  }
  protected beforeScrollToFocusedItem(focusedItem: ItemValue) {
    return;
  }

  protected afterScrollToFocusedItem() {
    if (!this.listModel.focusedItem?.selected) {
      this.applyHintString(this.listModel.focusedItem || this.question.selectedItem);
    } else {
      this.hintString = "";
    }
    this.syncFilterStringPlaceholder();
  }

  protected onPropertyChangedHandler(sender: any, options: any) {
    super.onPropertyChangedHandler(sender, options);
    if (options.name === "value" || options.name === "renderedValue" || options.name === "placeholder") {
      this.syncFilterStringPlaceholder();
    }
  }
}