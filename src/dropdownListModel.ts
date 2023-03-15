import { IAction } from "./actions/action";
import { Base, ComputedUpdater } from "./base";
import { ItemValue } from "./itemvalue";
import { property } from "./jsonobject";
import { ListModel } from "./list";
import { PopupModel } from "./popup";
import { Question } from "./question";
import { QuestionDropdownModel } from "./question_dropdown";
import { QuestionTagboxModel } from "./question_tagbox";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { IsTouch } from "./utils/devices";
import { doKey2ClickBlur, doKey2ClickUp } from "./utils/utils";

export class DropdownListModel extends Base {
  readonly minPageSize = 25;
  readonly loadingItemHeight = 40;

  private _markdownMode = false;
  private _popupModel: PopupModel;
  private get focusFirstInputSelector(): string {
    return this.getFocusFirstInputSelector();
  }
  protected readonly selectedItemSelector = ".sv-list__item--selected";
  protected readonly itemSelector = ".sv-list__item";
  protected getFocusFirstInputSelector(): string {
    if (IsTouch) {
      return this.isValueEmpty(this.question.value) ? this.itemSelector : this.selectedItemSelector;
    } else {
      return (!this.listModel.showFilter && !!this.question.value) ? this.selectedItemSelector : "";
    }
  }
  private itemsSettings: { skip: number, take: number, totalCount: number, items: any[] } = { skip: 0, take: 0, totalCount: 0, items: [] };
  private isRunningLoadQuestionChoices = false;
  protected listModel: ListModel<ItemValue>;
  protected popupCssClasses = "sv-single-select-list";

  private resetItemsSettings() {
    this.itemsSettings.skip = 0;
    this.itemsSettings.take = Math.max(this.minPageSize, this.question.choicesLazyLoadPageSize);
    this.itemsSettings.totalCount = 0;
    this.itemsSettings.items = [];
  }
  private setItems(items: Array<any>, totalCount: number) {
    this.itemsSettings.items = [].concat(this.itemsSettings.items, items);
    this.itemsSettings.totalCount = totalCount;
    this.listModel.isAllDataLoaded = this.question.choicesLazyLoadEnabled && this.itemsSettings.items.length == this.itemsSettings.totalCount;
    this.question.choices = this.itemsSettings.items;
  }

  private updateQuestionChoices(callbackAfterItemsLoaded?: () => void): void {
    if (this.isRunningLoadQuestionChoices) return;

    const isUpdate = (this.itemsSettings.skip + 1) < this.itemsSettings.totalCount;
    if (!this.itemsSettings.skip || isUpdate) {
      this.isRunningLoadQuestionChoices = true;
      this.question.survey.loadQuestionChoices({
        question: this.question,
        filter: this.filterString,
        skip: this.itemsSettings.skip,
        take: this.itemsSettings.take,
        setItems: (items: Array<any>, totalCount: number) => {
          this.isRunningLoadQuestionChoices = false;
          this.setItems(items || [], totalCount || 0);
          this.popupRecalculatePosition(this.itemsSettings.skip === this.itemsSettings.take);
          if (!!callbackAfterItemsLoaded) {
            callbackAfterItemsLoaded();
          }
        }
      });
      this.itemsSettings.skip += this.itemsSettings.take;
    }
  }

  private updatePopupFocusFirstInputSelector() {
    this._popupModel.focusFirstInputSelector = this.focusFirstInputSelector;
  }

  protected createPopup(): void {
    this._popupModel = new PopupModel("sv-list", { model: this.listModel }, "bottom", "center", false);
    this._popupModel.displayMode = IsTouch ? "overlay" : "popup";
    this._popupModel.positionMode = "fixed";
    this._popupModel.isFocusedContent = IsTouch;
    this._popupModel.setWidthByTarget = !IsTouch;
    this.updatePopupFocusFirstInputSelector();
    this.listModel.registerPropertyChangedHandlers(["showFilter"], () => {
      this.updatePopupFocusFirstInputSelector();
    });
    this._popupModel.cssClass = this.popupCssClasses;
    this._popupModel.onVisibilityChanged.add((_, option: { isVisible: boolean }) => {
      if(option.isVisible) {
        this.listModel.renderElements = true;
      }
      if (option.isVisible && this.question.choicesLazyLoadEnabled) {
        this.listModel.actions = [];
        this.updateQuestionChoices();
      }

      if (option.isVisible && !!this.question.onOpenedCallBack) {
        this.updatePopupFocusFirstInputSelector();
        this.question.onOpenedCallBack();
      }
      if (!option.isVisible) {
        this.onHidePopup();

        if (this.question.choicesLazyLoadEnabled) {
          this.resetItemsSettings();
        }
      }
    });
  }

  private setFilterStringToListModel(newValue: string): void {
    this.listModel.filterString = newValue;
    this.listModel.resetFocusedItem();
    if (this.question.selectedItem && this.question.selectedItem.text.indexOf(newValue) >= 0) {
      this.listModel.focusedItem = <any>this.getAvailableItems().filter(item => item.id == this.question.selectedItem.value)[0];
      return;
    }
    if (!this.listModel.focusedItem || !this.listModel.isItemVisible(this.listModel.focusedItem)) {
      this.listModel.focusFirstVisibleItem();
    }
  }

  protected popupRecalculatePosition(isResetHeight: boolean): void {
    setTimeout(() => {
      this.popupModel.recalculatePosition(isResetHeight);
    }, 1);
  }

  protected onHidePopup(): void {
    this.resetFilterString();
    this.listModel.refresh();
  }

  protected getAvailableItems(): Array<ItemValue> {
    this._markdownMode = (this.question.visibleChoices as Array<ItemValue>).some(item => item?.locText.hasHtml);
    return this.question.visibleChoices;
  }
  protected createListModel(): ListModel<ItemValue> {
    const visibleItems = this.getAvailableItems();
    let _onSelectionChanged = this.onSelectionChanged;
    if (!_onSelectionChanged) {
      _onSelectionChanged = (item: IAction) => {
        this.question.value = item.id;
        if (this.question.searchEnabled) this.applyInputString(item as ItemValue);
        this._popupModel.toggleVisibility();
      };
    }
    const res = new ListModel<ItemValue>(visibleItems, _onSelectionChanged, false);
    res.renderElements = false;
    res.areSameItemsCallback = (item1: IAction, item2: IAction): boolean => {
      return item1 === item2;
    };
    return res;
  }
  protected updateAfterListModelCreated(model: ListModel<ItemValue>): void {
    model.isItemSelected = (action: ItemValue) => !!action.selected;
    model.locOwner = this.question;
    model.onPropertyChanged.add((sender: any, options: any) => {
      if (options.name == "hasVerticalScroller") {
        this.hasScroll = options.newValue;
      }
    });
    model.isAllDataLoaded = !this.question.choicesLazyLoadEnabled;
  }
  public updateCssClasses(popupCssClass: string, listCssClasses: any): void {
    this.popupModel.cssClass = new CssClassBuilder().append(popupCssClass).append(this.popupCssClasses).toString();
    this.listModel.cssClasses = listCssClasses;
  }
  protected resetFilterString(): void {
    if (!!this.filterString) {
      this.filterString = undefined;
    }
  }
  protected onSetFilterString(): void {
    if (!!this.filterString && !this.popupModel.isVisible) {
      this.popupModel.isVisible = true;
    }
    const updateAfterFilterStringChanged = () => {
      this.setFilterStringToListModel(this.filterString);
      this.popupRecalculatePosition(true);
    };

    if (this.question.choicesLazyLoadEnabled) {
      this.resetItemsSettings();
      this.updateQuestionChoices(updateAfterFilterStringChanged);
    } else {
      updateAfterFilterStringChanged();
    }
  }

  @property({ defaultValue: true }) searchEnabled: boolean;
  @property({
    defaultValue: "",
    onSet: (_, target: DropdownListModel) => {
      target.onSetFilterString();
    }
  }) filterString: string;

  @property({
    defaultValue: "",
    onSet: (newValue, target: DropdownListModel) => {
      target.question.inputHasValue = !!newValue;
    }
  }) inputString: string;

  private applyInputString(item: ItemValue) {
    const hasHtml = item?.locText.hasHtml;
    if (hasHtml) {
      this._markdownMode = true;
      this.inputString = "";
    } else {
      this.inputString = item?.title;
    }
  }

  private applyHintString(item: ItemValue) {
    const hasHtml = item?.locText.hasHtml;
    if (hasHtml) {
      this._markdownMode = true;
      this.inputString = "";
    } else {
      this.hintString = item?.title;
    }
  }

  public get inputStringRendered() {
    return this.getPropertyValue("inputString");
  }

  public set inputStringRendered(val: string) {
    this.setPropertyValue("inputString", val);
    this.filterString = val;
    this.applyHintString(this.listModel.focusedItem);
    //if (!val) this.onClear(null);
  }

  public get placeholderRendered() {
    return this.hintString ? "" : this.question.readOnlyText;
  }

  @property({
    defaultValue: false,
    onSet: (newVal: boolean, target: DropdownListModel) => {
      if (newVal) {
        target.listModel.addScrollEventListener((e: any) => { target.onScroll(e); });
      } else {
        target.listModel.removeScrollEventListener();
      }
    }
  }) hasScroll: boolean;

  @property({ defaultValue: "" }) hintString: string;

  private get hintStringLC(): string {
    return this.hintString?.toLowerCase() || "";
  }
  private get inputStringLC(): string {
    return this.inputString?.toLowerCase() || "";
  }

  public get showHintPrefix(): boolean {
    return !!this.inputString && this.hintStringLC.indexOf(this.inputStringLC) > 0;
  }
  public get hintStringPrefix(): string {
    if (!this.inputString) return null;
    return this.hintString.substring(0, this.hintStringLC.indexOf(this.inputStringLC));
  }
  public get showHintString(): boolean {
    return this.hintStringLC != this.inputStringLC && this.hintStringLC.indexOf(this.inputStringLC) >= 0;
  }
  public get hintStringSuffix(): string {
    return this.hintString.substring(this.hintStringLC.indexOf(this.inputStringLC) + this.inputStringLC.length);
  }
  constructor(protected question: Question, protected onSelectionChanged?: (item: IAction, ...params: any[]) => void) {
    super();
    this.listModel = this.createListModel();
    this.updateAfterListModelCreated(this.listModel);
    this.setSearchEnabled(this.question.searchEnabled);
    this.createPopup();
    this.resetItemsSettings();
  }

  get popupModel(): PopupModel {
    return this._popupModel;
  }
  public get inputReadOnly(): boolean {
    return this.question.isInputReadOnly || this.searchEnabled;
  }
  public get filterStringEnabled(): boolean {
    return !this.question.isInputReadOnly && this.searchEnabled;
  }
  public get inputMode(): "none" | "text" {
    return IsTouch ? "none" : "text";
  }

  public setSearchEnabled(newValue: boolean) {
    this.listModel.searchEnabled = IsTouch;
    this.listModel.showSearchClearButton = IsTouch;
    this.searchEnabled = newValue;
  }

  public updateItems(): void {
    this.listModel.setItems(this.getAvailableItems());
  }

  public onClick(event: any): void {
    this._popupModel.toggleVisibility();

    if (this.searchEnabled && !!event && !!event.target) {
      const input = event.target.querySelector("input");
      if (!!input) {
        input.focus();
      }
    }
  }

  public onClear(event: any): void {
    this.question.clearValue();
    this.inputString = null;
    this.hintString = "";
    this.resetFilterString();
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  public getSelectedAction(): ItemValue {
    return this.question.selectedItem || null;
  }

  changeSelectionWithKeyboard(reverse: boolean): void {
    // if (this.listModel.focusedItem && this.inputString == this.listModel.focusedItem.title) {
    //   this.inputString = "";
    // }
    if (reverse) {
      this.listModel.focusPrevVisibleItem();
    }
    else {
      this.listModel.focusNextVisibleItem();
    }
    this.scrollToFocusedItem();
    if (this.question.value && this.question.searchEnabled && this.question instanceof QuestionDropdownModel) {
      this.applyInputString(this.listModel.focusedItem);
      this.hintString = "";
    }
    else {
      this.applyHintString(this.listModel.focusedItem);
    }
  }


  keyHandler(event: any): void {
    const char: number = event.which || event.keyCode;
    if (this.popupModel.isVisible && event.keyCode === 38) {
      this.changeSelectionWithKeyboard(true);
      event.preventDefault();
      event.stopPropagation();
    } else if (event.keyCode === 40) {
      if (!this.popupModel.isVisible) {
        this.popupModel.toggleVisibility();
      }
      this.changeSelectionWithKeyboard(false);
      event.preventDefault();
      event.stopPropagation();
    } else if (!this.popupModel.isVisible && (event.keyCode === 13 || event.keyCode === 32)) {
      this.popupModel.toggleVisibility();
      this.changeSelectionWithKeyboard(false);
      event.preventDefault();
      event.stopPropagation();
    } else if (this.popupModel.isVisible && (event.keyCode === 13 || event.keyCode === 32 && !this.question.searchEnabled)) {
      if (event.keyCode === 13 && this.question.searchEnabled && !this.inputString && !this._markdownMode && this.question.value) {
        this._popupModel.isVisible = false;
        this.onClear(event);
      }
      else {
        this.listModel.selectFocusedItem();
        this.onFocus(event);
      }
      event.preventDefault();
      event.stopPropagation();
    } else if (char === 46 || char === 8) {
      if (!this.searchEnabled) {
        this.onClear(event);
      }
    } else if (event.keyCode === 27) {
      this._popupModel.isVisible = false;
      this.hintString = "";
      if (this.question.searchEnabled && this.question instanceof QuestionDropdownModel) this.inputString = this.question.value;
    } else {
      if (event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 32) {
        event.preventDefault();
        event.stopPropagation();
      }
      doKey2ClickUp(event, { processEsc: false, disableTabStop: this.question.isInputReadOnly });
    }
  }
  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    if ((target.scrollHeight - (target.scrollTop + target.offsetHeight)) <= this.loadingItemHeight) {
      this.updateQuestionChoices();
    }
  }
  onBlur(event: any): void {
    if (this.popupModel.isVisible && IsTouch) {
      this._popupModel.isVisible = true;
      return;
    }
    if (this.popupModel.isVisible && !!this.filterString) {
      this.listModel.selectFocusedItem();
    }
    this.resetFilterString();
    this.inputString = null;
    this.hintString = "";
    doKey2ClickBlur(event);
    this._popupModel.isVisible = false;
  }
  onFocus(event: any): void {
    if (this.question.searchEnabled) {
      if (this.question instanceof QuestionDropdownModel) {
        this.applyInputString(this.question.selectedItem);
      }
      else {
        this.inputString = null;
      }
    }
  }
  scrollToFocusedItem(): void {
    this.listModel.scrollToFocusedItem();
  }
}