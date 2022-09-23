import { Action, IAction } from "./actions/action";
import { Base, ComputedUpdater } from "./base";
import { ItemValue } from "./itemvalue";
import { property } from "./jsonobject";
import { defaultListCss, ListModel } from "./list";
import { PopupModel } from "./popup";
import { Question } from "./question";
import { doKey2ClickBlur, doKey2ClickUp } from "./utils/utils";

export class DropdownListModel extends Base {
  private _popupModel: PopupModel;
  private focusFirstInputSelector = ".sv-list__item--selected";
  protected listModel: ListModel;
  protected popupCssClasses = "sv-single-select-list";

  private updatePopupFocusFirstInputSelector() {
    this._popupModel.focusFirstInputSelector = (!this.listModel.showFilter && !!this.question.value) ? this.focusFirstInputSelector : "";
  }

  private createPopup() {
    this._popupModel = new PopupModel("sv-list", { model: this.listModel, }, "bottom", "center", false);
    this._popupModel.positionMode = "fixed";
    this._popupModel.isFocusedContent = false;
    this._popupModel.setWidthByTarget = true;
    this.updatePopupFocusFirstInputSelector();
    this.listModel.registerFunctionOnPropertyValueChanged("showFilter", () => {
      this.updatePopupFocusFirstInputSelector();
    });
    this._popupModel.cssClass = this.popupCssClasses;
    this._popupModel.onVisibilityChanged.add((_, option: { isVisible: boolean }) => {
      if (option.isVisible && !!this.question.onOpenedCallBack) {
        this.updatePopupFocusFirstInputSelector();
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
    this.setInputHasValue(!!newValue);
  }

  protected onHidePopup(): void {
    this.resetFilterString();
    this.listModel.refresh();
  }

  protected getAvailableItems(): Array<Action> {
    return this.question.visibleChoices.map((choice: ItemValue) => new Action({
      id: choice.value,
      data: choice,
      locTitle: choice.locText,
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
    if(!!this.filterString) {
      this.filterString = undefined;
    }
  }
  protected onSetFilterString(): void {
    if(!!this.filterString && !this.popupModel.isVisible) {
      this.popupModel.isVisible = true;
    }
    this.setFilter(this.filterString);
  }

  setInputHasValue(newValue: boolean): void {
    this.question.inputHasValue = newValue;
  }

  @property({ defaultValue: true }) searchEnabled: boolean;
  @property({
    defaultValue: "",
    onSet: (_, target: DropdownListModel) => {
      target.onSetFilterString();
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
  public get inputReadOnly(): boolean {
    return this.question.isInputReadOnly || this.searchEnabled;
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
    this._popupModel.toggleVisibility();
    this.listModel.focusNextVisibleItem();

    if (this.searchEnabled && !!event && !!event.target) {
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

  keyHandler(event: any): void {
    const char: number = event.which || event.keyCode;
    if(this.popupModel.isVisible && event.keyCode === 38) {
      this.listModel.focusPrevVisibleItem();
      this.scrollToFocusedItem();
      event.preventDefault();
      event.stopPropagation();
    } else if(event.keyCode === 40) {
      if(!this.popupModel.isVisible) {
        this.popupModel.toggleVisibility();
      }
      this.listModel.focusNextVisibleItem();
      this.scrollToFocusedItem();
      event.preventDefault();
      event.stopPropagation();
    } else if(this.popupModel.isVisible && (event.keyCode === 13 || event.keyCode === 32)) {
      this.listModel.selectFocusedItem();
      event.preventDefault();
      event.stopPropagation();
    } else if (char === 46) {
      this.onClear(event);
    } else if(event.keyCode === 27) {
      this.popupModel.isVisible = false;
    } else {
      if(event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 32) {
        event.preventDefault();
        event.stopPropagation();
      }
      doKey2ClickUp(event, { processEsc: false, disableTabStop: this.question.isInputReadOnly });
    }
  }

  onBlur(event: any): void {
    this.resetFilterString();
    this._popupModel.isVisible = false;
    this.setInputHasValue(false);
    doKey2ClickBlur(event);
  }
  scrollToFocusedItem(): void {
    setTimeout(() => {
      let visiblePopup: Element = undefined;
      document.querySelectorAll(".sv-popup").forEach((el) => {
        const style = window.getComputedStyle(el);
        if((style.display !== "none") && (style.visibility !== "hidden")) {
          visiblePopup = el;
        }
      });

      if(!visiblePopup) return;

      const item = visiblePopup.querySelector("." + defaultListCss.itemFocused);
      if(item) {
        item.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      }
    }, 0);
  }
}
