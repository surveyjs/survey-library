import { Action, IAction } from "./actions/action";
import { Base, ComputedUpdater } from "./base";
import { ItemValue } from "./itemvalue";
import { ListModel } from "./list";
import { PopupModel } from "./popup";
import { Question } from "./question";
import { PopupUtils } from "./utils/popup";
import { findParentByClassNames, doKey2ClickBlur, doKey2ClickUp } from "./utils/utils";

export class DropdownListModel extends Base {
  private _popupModel: PopupModel;

  protected getVisibleListItems(): Array<Action> {
    return this.question.visibleChoices.map((choice: ItemValue) => new Action({
      id: choice.value,
      title: <any>new ComputedUpdater<string>(() => choice.text),
      component: <any>new ComputedUpdater<string>(() => this.question.itemComponent),
      visible: <any>new ComputedUpdater<boolean>(() => choice.isVisible),
      enabled: <any>new ComputedUpdater<boolean>(() => choice.isEnabled),
    }));
  }
  protected createListModel(): ListModel {
    const visibleItems = this.getVisibleListItems();
    return new ListModel(visibleItems, this.onSelectionChanged, true, this.question.selectedItem);
  }
  constructor(protected question: Question, protected onSelectionChanged: (item: IAction, ...params: any[]) => void) {
    super();
    if(!onSelectionChanged) {
      onSelectionChanged = (item: IAction) => {
        this.question.value = item.id;
        this._popupModel.toggleVisibility();
      };
    }

    let listModel = this.createListModel();
    listModel.denySearch = this.question.denySearch;

    this._popupModel = new PopupModel("sv-list", { model: listModel, }, "bottom", "center", false);
    this._popupModel.positionMode = "fixed";
    this._popupModel.onVisibilityChanged.add((_, option: { isVisible: boolean }) => {
      if (option.isVisible && !!this.question.onOpenedCallBack) {
        this.question.onOpenedCallBack();
      }
    });
  }

  get popupModel(): PopupModel {
    return this._popupModel;
  }

  public updateItems() {
    this._popupModel.contentComponentData.model.setItems(this.getVisibleListItems());
  }

  public onClick(event: any): void {
    if (this.question.visibleChoices.length === 0) return;

    if (!!event && !!event.target) {
      const target = findParentByClassNames(event.target, this.question.cssClasses.control.split(" "));
      if (!!target) {
        PopupUtils.updatePopupWidthBeforeShow(this._popupModel, target);
      }
    }
  }

  onClear(event: any): void {
    this.question.clearValue();
    event.preventDefault();
    event.stopPropagation();
  }

  onKeyUp(event: any): void {
    const char: number = event.which || event.keyCode;
    if (char === 46) {
      this.onClear(event);
    } else {
      event.preventDefault();
      event.stopPropagation();
      doKey2ClickUp(event, { processEsc: false, disableTabStop: this.question.isInputReadOnly });
    }
  }

  onBlur(event: any): void {
    doKey2ClickBlur(event);
  }
}