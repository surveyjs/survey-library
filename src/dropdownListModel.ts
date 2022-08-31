import { Action, IAction } from "./actions/action";
import { Base, ComputedUpdater } from "./base";
import { ItemValue } from "./itemvalue";
import { property } from "./jsonobject";
import { ListModel } from "./list";
import { PopupModel } from "./popup";
import { Question } from "./question";
import { PopupUtils } from "./utils/popup";
import { findParentByClassNames, doKey2ClickBlur, doKey2ClickUp } from "./utils/utils";

export class DropdownListModel extends Base {
  private _popupModel: PopupModel;
  private focusFirstInputSelector = ".sv-list__item--selected";
  protected listModel: ListModel;
  protected popupCssClasses = "sv-single-select-list";

  private updatePopupFocusFirstInputSelector() { // TODO remove
    this._popupModel.focusFirstInputSelector = (!this.listModel.showFilter && !!this.question.value) ? this.focusFirstInputSelector : "";
  }

  private createPopup() {
    this._popupModel = new PopupModel("sv-list", { model: this.listModel, }, "bottom", "center", false);
    this._popupModel.positionMode = "fixed";
    this._popupModel.isFocusedContent = false;
    this.updatePopupFocusFirstInputSelector();
    this.listModel.registerFunctionOnPropertyValueChanged("showFilter", () => {
      this.updatePopupFocusFirstInputSelector();
    });
    this._popupModel.cssClass = this.popupCssClasses;
    this._popupModel.onVisibilityChanged.add((_, option: { isVisible: boolean }) => {
      if (option.isVisible && !!this.question.onOpenedCallBack) {
        this.updatePopupFocusFirstInputSelector();
        this.listModel.focusFirstVisibleItem();
        this.question.onOpenedCallBack();
      }
      if(!option.isVisible) {
        this.onHidePopup();
      }
    });
  }

  private setFilter(newValue: string):void {
    this.listModel.filterString = newValue;
    if(!this.listModel.focusedItem || !this.listModel.isItemVisible(this.listModel.focusedItem)) {
      this.listModel.focusFirstVisibleItem();
    }
  }

  protected onHidePopup() {
  }

  protected getAvailableItems(): Array<Action> {
    return this.question.visibleChoices.map((choice: ItemValue) => new Action({
      id: choice.value,
      data: choice,
      title: <any>new ComputedUpdater<string>(() => choice.text),
      component: <any>new ComputedUpdater<string>(() => this.question.itemComponent),
      visible: <any>new ComputedUpdater<boolean>(() => choice.isVisible),
      enabled: <any>new ComputedUpdater<boolean>(() => choice.isEnabled),
    }));
  }
  protected createListModel(): ListModel {
    const visibleItems = this.getAvailableItems();
    let _onSelectionChanged = this.onSelectionChanged;
    if(!_onSelectionChanged) {
      _onSelectionChanged = (item: IAction) => {
        this.question.value = item.id;
        this.filterString = item.id.toString();
        this._popupModel.toggleVisibility();
      };
    }
    const res = new ListModel(visibleItems, _onSelectionChanged, true, this.question.selectedItem);
    res.locOwner = this.question;
    return res;
  }
  protected resetFilterString(): void {
    this.filterString = undefined;
  }

  @property({ defaultValue: true }) searchEnabled: boolean;
  @property({
    defaultValue: "",
    onSet: (_, target: DropdownListModel) => {
      if(!!target.filterString && !target.popupModel.isVisible) {
        target.popupModel.isVisible = true;
      }
      target.setFilter(target.filterString);
    }
  }) filterString: string;

  constructor(protected question: Question, protected onSelectionChanged?: (item: IAction, ...params: any[]) => void) {
    super();
    this.listModel = this.createListModel();
    this.listModel.cssClasses = question.survey?.getCss().list;
    this.setSearchEnabled(this.question.searchEnabled);
    this.createPopup();
  }

  get popupModel(): PopupModel {
    return this._popupModel;
  }

  public setSearchEnabled(newValue: boolean) {
    this.listModel.searchEnabled = false;
    this.searchEnabled = newValue;
  }
  public updateItems() {
    this._popupModel.contentComponentData.model.setItems(this.getAvailableItems());
  }

  public onClick(event: any): void {
    if (this.question.visibleChoices.length === 0) return;

    if (!!event && !!event.target) {
      const target = findParentByClassNames(event.target, this.question.cssClasses.control.split(" "));
      if (!!target) {
        PopupUtils.updatePopupWidthBeforeShow(this._popupModel, target);
      }
      const input = event.target.querySelector("input");
      if(!!input) {
        input.focus();
      }
    }
  }

  public onClear(event: any): void {
    this.question.clearValue();
    this.resetFilterString();
    this.listModel.selectedItem = undefined;
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
    this.resetFilterString();
    this._popupModel.isVisible = false;
    doKey2ClickBlur(event);
  }

  public inputKeyUpHandler(event: any): void {
    if(event.keyCode === 38) {
      this.listModel.focusPrevVisibleItem();
      event.preventDefault();
      event.stopPropagation();
    } else if(event.keyCode === 40) {
      if(!this.popupModel.isVisible) {
        this.popupModel.toggleVisibility();
      }
      this.listModel.focusNextVisibleItem();
      event.preventDefault();
      event.stopPropagation();
    } else if(event.keyCode === 27 || event.keyCode === 9) {
      if(this.popupModel.isVisible) {
        this.popupModel.toggleVisibility();
      }
    } else if(this.popupModel.isVisible && event.keyCode === 13) {
      this.listModel.selectFocusedItem();
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
