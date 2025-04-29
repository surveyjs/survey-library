import { IAction } from "./actions/action";
import { Base } from "./base";
import { IDropdownMenuOptions } from "./base-interfaces";
import { DomDocumentHelper, DomWindowHelper } from "./global_variables_utils";
import { Helpers } from "./helpers";
import { ItemValue } from "./itemvalue";
import { property } from "./jsonobject";
import { IListModel, ListModel } from "./list";
import { IPopupOptionsBase, PopupModel } from "./popup";
import { Question } from "./question";
import { QuestionSelectBase } from "./question_baseselect";
import { QuestionDropdownModel } from "./question_dropdown";
import { settings } from "./settings";
import { SurveyModel } from "./survey";
import { CreateCustomChoiceItemEvent } from "./survey-events-api";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { IsTouch, calculateIsTablet } from "./utils/devices";
import { doKey2ClickBlur, doKey2ClickUp } from "./utils/utils";

export class DropdownListModel extends Base {
  readonly minPageSize = 25;
  readonly loadingItemHeight = 40;
  timer: any = undefined;
  private htmlCleanerElement: HTMLDivElement;

  private _markdownMode = false;
  private _popupModel: PopupModel;
  private filteredItems: Array<ItemValue> = undefined;
  @property({ defaultValue: false }) focused: boolean;
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
  protected listModel: ListModel<ItemValue>;
  protected listModelFilterStringChanged = (newValue: string) => {
    if (this.filterString !== newValue) {
      this.filterString = newValue;
      if (!this.choicesLazyLoadEnabled) {
        this.processCustomValue();
      }
    }
  };

  private resetItemsSettings() {
    this.itemsSettings.skip = 0;
    this.itemsSettings.take = Math.max(this.minPageSize, this.question.choicesLazyLoadPageSize);
    this.itemsSettings.totalCount = 0;
    this.itemsSettings.items = [];
  }
  private setItems(items: Array<any>, totalCount: number) {
    this.itemsSettings.items = [].concat(this.itemsSettings.items, items);
    this.itemsSettings.totalCount = totalCount;
    this.listModel.isAllDataLoaded = this.choicesLazyLoadEnabled && this.itemsSettings.items.length == this.itemsSettings.totalCount;
    this.question.choices = this.itemsSettings.items;
  }
  private loadQuestionChoices(callbackAfterItemsLoaded?: () => void) {
    const _filterString = this.filterString;
    this.question.survey.loadQuestionChoices({
      question: this.question,
      filter: this.filterString,
      skip: this.itemsSettings.skip,
      take: this.itemsSettings.take,
      setItems: (items: Array<any>, totalCount: number) => {
        this.setItems(items || [], totalCount || 0);
        this.popupRecalculatePosition(this.itemsSettings.skip === this.itemsSettings.take);
        if (!!callbackAfterItemsLoaded) {
          callbackAfterItemsLoaded();
        }
        this.processCustomValue(_filterString);
      }
    });
    this.itemsSettings.skip += this.itemsSettings.take;
  }
  private processCustomValue(newValue?: string) {
    if (!this.allowCustomChoices) return;

    const value = newValue || this.filterString;
    const item = this.listModel.visibleActions.filter(action => Helpers.isTwoValueEquals(action.text, value, false, false))[0];
    if (!!item) {
      this.customValue = undefined;
    } else {
      this.customValue = value;
      this.updateItems();
      this.listModel.focusFirstVisibleItem();
    }
  }
  private updateQuestionChoices(callbackAfterItemsLoaded?: () => void): void {
    const isUpdate = (this.itemsSettings.skip + 1) < this.itemsSettings.totalCount;
    if (!this.itemsSettings.skip || isUpdate) {

      this.resetTimer();
      if (!!this.filterString && settings.dropdownSearchDelay > 0) {
        this.timer = setTimeout(() => {
          this.loadQuestionChoices(callbackAfterItemsLoaded);
        }, settings.dropdownSearchDelay);
      } else {
        this.loadQuestionChoices(callbackAfterItemsLoaded);
      }
    }
  }

  private resetTimer(): void {
    if (!!this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  private updatePopupFocusFirstInputSelector() {
    this._popupModel.focusFirstInputSelector = this.focusFirstInputSelector;
  }

  private getDropdownMenuOptions(): IDropdownMenuOptions {
    const windowWidth = DomWindowHelper.getInnerWidth();
    const windowHeight = DomWindowHelper.getInnerHeight();
    const isTablet = calculateIsTablet(windowWidth, windowHeight);

    let menuType: "overlay" | "popup" | "dropdown" = "dropdown";
    let deviceType: "mobile" | "tablet" | "desktop" = "desktop";
    if (IsTouch) {
      menuType = "popup";
      deviceType = isTablet ? "tablet" : "mobile";
    }

    return <IDropdownMenuOptions>{
      menuType: menuType,
      deviceType: deviceType,
      hasTouchScreen: IsTouch,
      screenHeight: windowHeight,
      screenWidth: windowWidth
    };
  }

  protected createPopup(): void {
    const popupOptions: IPopupOptionsBase = { verticalPosition: "bottom", horizontalPosition: "center", showPointer: false };
    this._popupModel = new PopupModel("sv-list", { model: this.listModel }, popupOptions);
    this._popupModel.displayMode = IsTouch ? "overlay" : "popup";
    this._popupModel.positionMode = "fixed";
    this._popupModel.isFocusedContainer = false;
    this._popupModel.isFocusedContent = IsTouch;
    this._popupModel.setWidthByTarget = !IsTouch;
    this._popupModel.locale = this.question.getLocale();
    this.updatePopupFocusFirstInputSelector();
    this.listModel.registerPropertyChangedHandlers(["showFilter"], () => {
      this.updatePopupFocusFirstInputSelector();
    });
    this._popupModel.onVisibilityChanged.add((_, option: { isVisible: boolean }) => {
      this.popupVisibilityChanged(option.isVisible);
    });
  }

  private popupVisibilityChanged(isVisible: boolean) {
    if (isVisible) {
      this.listModel.renderElements = true;
    }
    if (isVisible && this.choicesLazyLoadEnabled) {
      this.listModel.actions = [];
      this.resetItemsSettings();
      this.updateQuestionChoices();
    }

    if (isVisible) {
      this.updatePopupFocusFirstInputSelector();

      const dropdownMenuOptions = this.getDropdownMenuOptions();
      const prevMenuType = dropdownMenuOptions.menuType;
      this.question.processOpenDropdownMenu(dropdownMenuOptions);
      if (prevMenuType !== dropdownMenuOptions.menuType) {
        this._popupModel.updateDisplayMode(dropdownMenuOptions.menuType);
        this.listModel.setSearchEnabled(this.inputAvailable && dropdownMenuOptions.menuType !== "dropdown");
      }

      if (!!this.question.onOpenedCallBack) {
        this.question.onOpenedCallBack();
      }
    }
    if (!isVisible) {
      this.onHidePopup();
    }
    this.question.ariaExpanded = isVisible ? "true" : "false";
    this.question.processPopupVisiblilityChanged(this.popupModel, isVisible);
  }

  private setFilterStringToListModel(newValue: string): void {
    this.listModel.filterString = newValue;
    this.listModel.resetFocusedItem();
    if (this.question.selectedItem && this.question.selectedItem.text.indexOf(newValue) >= 0) {
      this.listModel.focusedItem = <any>this.getAvailableItems().filter(item => item.id == this.question.selectedItem.value)[0];
      if (this.listModel.filterString) {
        this.listModel.actions.map(a => a.selectedValue = false);
      }

      return;
    }
    if (!this.listModel.focusedItem || !this.listModel.isItemVisible(this.listModel.focusedItem)) {
      this.listModel.focusFirstVisibleItem();
    }
  }

  private setTextWrapEnabled(newValue: boolean): void {
    this.listModel.textWrapEnabled = newValue;
  }

  protected popupRecalculatePosition(isResetHeight: boolean): void {
    setTimeout(() => {
      this.popupModel.recalculatePosition(isResetHeight);
    }, 1);
  }

  protected onHidePopup(): void {
    this.resetFilterString();
    this.question.suggestedItem = null;
    if (this.choicesLazyLoadEnabled) {
      this.resetItemsSettings();
    }
    this.customValue = undefined;
    this.resetCustomItemValue();
  }

  protected getAvailableItems(): Array<ItemValue> {
    if (this.allowCustomChoices) {
      return [].concat(this.question.visibleChoices, [this.customItemValue]);
    }
    return this.question.visibleChoices;
  }
  protected setOnTextSearchCallbackForListModel(listModel: ListModel<ItemValue>) {
    listModel.setOnTextSearchCallback((item: ItemValue, textToSearch: string) => {
      if (item.id === this.customItemValue.id) return item.visible;
      if (this.filteredItems) return this.filteredItems.indexOf(item) >= 0;
      let textInLow = item.text.toLocaleLowerCase();
      textInLow = settings.comparator.normalizeTextCallback(textInLow, "filter");
      const index = textInLow.indexOf(textToSearch.toLocaleLowerCase());
      return this.question.searchMode == "startsWith" ? index == 0 : index > -1;
    });
  }
  protected createListModel(): ListModel<ItemValue> {
    const visibleItems = this.getAvailableItems();
    let _onSelectionChanged = this.onSelectionChanged;
    if (!_onSelectionChanged) {
      _onSelectionChanged = (item: IAction) => {
        this.setQuestionValue(item);
        this.popupModel.hide();
      };
    }
    const listOptions: IListModel = {
      items: visibleItems,
      onSelectionChanged: _onSelectionChanged,
      allowSelection: false,
      locOwner: this.question,
      elementId: this.listElementId
    };
    const res = new ListModel<ItemValue>(listOptions as any);
    this.setOnTextSearchCallbackForListModel(res);
    res.renderElements = false;
    res.forceShowFilter = this.question.choicesLazyLoadEnabled;
    res.areSameItemsCallback = (item1: IAction, item2: IAction): boolean => {
      return item1 === item2;
    };
    return res;
  }

  private setQuestionValue(item: IAction) {
    if (this.allowCustomChoices && item.id === this.customItemValue.id) {
      const newChoice = this.createCustomItem();
      if (!!newChoice) {
        this.question.value = newChoice.id;
        this.hintString = "";
      }
    } else {
      this.question.value = item.id;
      if (this.searchEnabled)this.applyInputString(item as ItemValue);
    }
  }

  protected createCustomItem(): ItemValue {
    const newChoice = new ItemValue(this.customValue);
    const options: CreateCustomChoiceItemEvent = {
      item: newChoice,
      question: this.question as QuestionSelectBase,
      allow: true
    };
    this.question.survey.createCustomChoiceItem(options);
    if (!options.allow) {
      this.clear();
      return null;
    }

    this.question.customChoices.push(newChoice);
    this.customValue = undefined;
    this.updateItems();
    return newChoice;
  }

  protected updateAfterListModelCreated(model: ListModel<ItemValue>): void {
    model.isItemSelected = (action: ItemValue) => !!action.selected;
    model.onPropertyChanged.add((sender: any, options: any) => {
      if (options.name == "hasVerticalScroller") {
        this.hasScroll = options.newValue;
      }
    });
    model.isAllDataLoaded = !this.choicesLazyLoadEnabled;
    model.actions.forEach(a => a.disableTabStop = true);
    model.setOnFilterStringChangedCallback(this.listModelFilterStringChanged);
  }
  protected getPopupCssClasses(): string { return "sv-single-select-list"; }
  public updateCssClasses(popupCssClass: string, listCssClasses: any): void {
    this.popupModel.cssClass = new CssClassBuilder().append(popupCssClass).append(this.getPopupCssClasses()).toString();
    this.listModel.cssClasses = listCssClasses;
  }
  protected resetFilterString(): void {
    if (!!this.filterString) {
      this.filterString = undefined;
    }
  }
  public clear(): void {
    this.customValue = undefined;
    this.inputString = null;
    this.hintString = "";
    this.resetFilterString();
  }
  protected onSetFilterString(): void {
    this.filteredItems = undefined;
    if (!this.filterString && !this.popupModel.isVisible) return;
    const options = { question: this.question, choices: this.getAvailableItems(), filter: this.filterString, filteredChoices: undefined as Array<ItemValue> };
    (this.question.survey as SurveyModel).onChoicesSearch.fire(this.question.survey as SurveyModel, options);
    this.filteredItems = options.filteredChoices;

    if (!!this.filterString && !this.popupModel.isVisible) {
      this.popupModel.show();
    }
    const updateAfterFilterStringChanged = () => {
      this.setFilterStringToListModel(this.filterString);
      if (this.filterString)this.applyHintString();
      this.popupRecalculatePosition(true);
    };

    if (this.choicesLazyLoadEnabled) {
      this.resetItemsSettings();
      this.updateQuestionChoices(updateAfterFilterStringChanged);
    } else {
      updateAfterFilterStringChanged();
    }
  }
  public get isAllDataLoaded(): boolean {
    return !!this.itemsSettings.totalCount && this.itemsSettings.items.length == this.itemsSettings.totalCount;
  }

  public get canShowSelectedItem(): boolean {
    return !this.focused || this._markdownMode || !this.searchEnabled;
  }

  public updateCustomItemValue(): void {
    if (this.customValue) {
      this.customItemValue.text = this.getLocalizationFormatString("createCustomItem", this.customValue);
      this.customItemValue.visible = true;
    } else {
      this.resetCustomItemValue();
    }
  }

  private resetCustomItemValue(): void {
    this.customItemValue.text = "";
    this.customItemValue.visible = false;
  }

  private _customItemValue: ItemValue;
  public get customItemValue(): ItemValue {
    if (!this._customItemValue) {
      this._customItemValue = new ItemValue("newCustomItem", this.getLocalizationFormatString("createCustomItem", this.customValue));
      this._customItemValue.css = "sv-list-item--custom-value";
    }
    return this._customItemValue;
  }

  @property({ defaultValue: false }) allowCustomChoices: boolean;
  @property({
    onSet: (newValue: string, target: DropdownListModel) => {
      target.updateCustomItemValue();
    }
  }) customValue: string;

  @property({ defaultValue: true }) searchEnabled: boolean;
  @property() choicesLazyLoadEnabled: boolean;
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

  @property({}) showInputFieldComponent: boolean;
  @property() ariaActivedescendant: string;

  private applyInputString(item: ItemValue) {
    const hasHtml = item?.locText.hasHtml;
    if (hasHtml || this.question.inputFieldComponentName) {
      this._markdownMode = true;
      this.inputString = this.cleanHtml(item?.locText.getHtmlValue());
      this.hintString = "";
    } else {
      this.inputString = item?.title;
      this.hintString = item?.title;
    }
  }

  private cleanHtml(html: string): string {
    if (!this.htmlCleanerElement) return "";
    this.htmlCleanerElement.innerHTML = html;
    return this.htmlCleanerElement.textContent;
  }

  protected fixInputCase() {
    const hintStringMiddle = this.hintStringMiddle;
    if (hintStringMiddle && this.inputString != hintStringMiddle)this.inputString = hintStringMiddle;
  }

  protected applyHintString() {
    const item: ItemValue = this.listModel.focusedItem || this.question.selectedItem;
    const hasHtml = item?.locText.hasHtml;
    if (hasHtml || this.question.inputFieldComponentName) {
      this._markdownMode = true;
      this.hintString = "";
    } else if (item === this.customItemValue) {
      this.hintString = "";
    } else {
      this.hintString = item?.title;
    }
  }

  public get inputStringRendered() {
    return this.inputString || "";
  }

  public set inputStringRendered(val: string) {
    this.inputString = val;
    this.filterString = val;

    if (!this.choicesLazyLoadEnabled) {
      this.processCustomValue();
    }
    if (!val || !this.searchEnabled || this.listModel.focusedItem?.id === this.customItemValue.id) {
      this.hintString = "";
    }
  }

  @property() inputPlaceholder: string;
  public get placeholderRendered() {
    return (this.hintString || this.question.readOnly || !this.question.isEmpty()) ? "" : this.inputPlaceholder;
  }

  public get listElementId(): string {
    return this.question.inputId + "_list";
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
    return !!this.searchEnabled && !!(this.hintStringLC || this.inputStringLC) ||
      !this.searchEnabled && this.hintStringLC && this.question.isEmpty();
  }
  public get hintStringSuffix(): string {
    return this.hintStringLC.indexOf(this.inputStringLC) >= 0 ? this.hintString.substring(this.hintStringLC.indexOf(this.inputStringLC) + this.inputStringLC.length) : "";
  }
  public get hintStringMiddle(): string {
    const start = this.hintStringLC.indexOf(this.inputStringLC);
    if (start == -1) return null;
    return this.hintString.substring(start, start + this.inputStringLC.length);
  }
  private questionPropertyChangedHandler = (sender: any, options: any) => {
    this.onPropertyChangedHandler(sender, options);
  };
  constructor(protected question: Question, protected onSelectionChanged?: (item: IAction, ...params: any[]) => void) {
    super();
    this.htmlCleanerElement = DomDocumentHelper.createElement("div") as HTMLDivElement;
    question.onPropertyChanged.add(this.questionPropertyChangedHandler);
    this.showInputFieldComponent = this.question.showInputFieldComponent;

    this.listModel = this.createListModel();
    this.setChoicesLazyLoadEnabled(this.question.choicesLazyLoadEnabled);
    this.setInputPlaceholder(this.question.placeholder);
    this.updateAfterListModelCreated(this.listModel);
    this.setSearchEnabled(this.question.searchEnabled);
    this.setAllowCustomChoices(this.question.allowCustomChoices);
    this.setTextWrapEnabled(this.question.textWrapEnabled);
    this.createPopup();
    this.resetItemsSettings();
    const classes = question.cssClasses;
    this.updateCssClasses(classes.popup, classes.list);
  }

  get popupModel(): PopupModel {
    return this._popupModel;
  }
  public get inputAvailable(): boolean {
    return this.searchEnabled || this.allowCustomChoices;
  }
  public get noTabIndex(): boolean {
    return this.question.isInputReadOnly || this.inputAvailable;
  }
  public get filterReadOnly(): boolean {
    return !this.filterStringEnabled || !this.focused;
  }
  public get filterStringEnabled(): boolean {
    return !this.question.isInputReadOnly && this.inputAvailable;
  }
  public get inputMode(): "none" | "text" {
    return IsTouch ? "none" : "text";
  }

  public setSearchEnabled(newValue: boolean): void {
    this.listModel.setSearchEnabled(IsTouch && (newValue || this.question.allowCustomChoices));
    this.searchEnabled = newValue;
  }

  public setAllowCustomChoices(newValue: boolean): void {
    this.allowCustomChoices = newValue;
    if (newValue) {
      this.searchEnabled = newValue;
    }
  }

  public setChoicesLazyLoadEnabled(newValue: boolean): void {
    this.choicesLazyLoadEnabled = newValue;
  }

  public setInputPlaceholder(newValue: string): void {
    this.inputPlaceholder = newValue;
  }

  public updateItems(): void {
    this.listModel.setItems(this.getAvailableItems());
  }

  public onClick(event: any): void {
    if (this.question.readOnly || this.question.isDesignMode || this.question.isPreviewStyle || this.question.isReadOnlyAttr) return;
    this._popupModel.toggleVisibility();
    this.focusItemOnClickAndPopup();
    this.question.focusInputElement(false);
  }
  public chevronPointerDown(event: any): void {
    if (this._popupModel.isVisible) {
      event.preventDefault();
    }
  }

  protected onPropertyChangedHandler(sender: any, options: any) {
    if (options.name == "value") {
      this.showInputFieldComponent = this.question.showInputFieldComponent;
    }
    if (options.name == "textWrapEnabled") {
      this.setTextWrapEnabled(options.newValue);
    }
  }
  protected focusItemOnClickAndPopup() {
    if (this._popupModel.isVisible && this.question.value)
      this.changeSelectionWithKeyboard(false);
  }

  public onClear(event: any): void {
    this.question.clearValue(true);
    this._popupModel.hide();
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  public getSelectedAction(): ItemValue {
    return this.question.selectedItem || null;
  }

  changeSelectionWithKeyboard(reverse: boolean): void {
    let focusedItem = this.listModel.focusedItem;
    if (!focusedItem && this.question.selectedItem) {
      if (ItemValue.getItemByValue(this.question.visibleChoices, this.question.value)) {
        this.listModel.focusedItem = this.question.selectedItem;
      }
    } else {
      if (reverse) {
        this.listModel.focusPrevVisibleItem();
      } else {
        this.listModel.focusNextVisibleItem();
      }
    }

    this.beforeScrollToFocusedItem(focusedItem);
    this.scrollToFocusedItem();
    this.afterScrollToFocusedItem();

    this.ariaActivedescendant = this.listModel.focusedItem?.elementId;
  }

  protected beforeScrollToFocusedItem(focusedItem: ItemValue) {
    if (this.question.value && focusedItem) {
      focusedItem.selectedValue = false;
      this.listModel.focusedItem.selectedValue = !this.listModel.filterString;
      this.question.suggestedItem = this.listModel.focusedItem;
    }
  }

  protected afterScrollToFocusedItem() {
    if (this.question.value && !this.listModel.filterString && this.searchEnabled) {
      this.applyInputString(this.listModel.focusedItem || this.question.selectedItem);
    } else {
      this.applyHintString();
    }

    this.fixInputCase();
    this.ariaActivedescendant = this.listModel.focusedItem?.elementId;
  }

  keyHandler(event: any): void {
    let isStopPropagation = false;
    const char: number = event.which || event.keyCode;
    if (this.popupModel.isVisible && event.keyCode === 38) {
      this.changeSelectionWithKeyboard(true);
      isStopPropagation = true;
    } else if (event.keyCode === 40) {
      this.popupModel.show();
      this.changeSelectionWithKeyboard(false);
      isStopPropagation = true;
    } else if (event.keyCode === 9) {
      this.popupModel.hide();
    } else if (!this.popupModel.isVisible && event.keyCode === 32) {
      this.popupModel.show();
      this.changeSelectionWithKeyboard(false);
      isStopPropagation = true;
    } else if (!this.popupModel.isVisible && event.keyCode === 13) {
      (this.question.survey as SurveyModel).questionEditFinishCallback(this.question, event);
      isStopPropagation = true;
    } else if (this.popupModel.isVisible && (event.keyCode === 13 || event.keyCode === 32 && (!this.searchEnabled || !this.inputString))) {
      if (event.keyCode === 13 && this.searchEnabled && !this.inputString && this.question instanceof QuestionDropdownModel && !this._markdownMode && this.question.value) {
        this._popupModel.hide();
        this.onClear(event);
      } else {
        this.listModel.selectFocusedItem();
        this.onFocus(event);
      }
      isStopPropagation = true;
    } else if (char === 46 || char === 8) {
      if (!this.inputAvailable) {
        this.onClear(event);
      }
    } else if (event.keyCode === 27) {
      this._popupModel.hide();
      this.hintString = "";
      this.onEscape();
    } else {
      if (event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 32 && !this.searchEnabled) {
        isStopPropagation = true;
      }
      if (event.keyCode === 32 && this.searchEnabled) {
        return;
      }
      doKey2ClickUp(event, { processEsc: false, disableTabStop: this.question.isInputReadOnly });
    }

    if (isStopPropagation) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  protected onEscape() {
    if (this.searchEnabled)
      this.applyInputString(this.question.selectedItem);
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    if ((target.scrollHeight - (target.scrollTop + target.offsetHeight)) <= this.loadingItemHeight) {
      this.updateQuestionChoices();
    }
  }
  onBlur(event: any): void {
    this.focused = false;
    if (this.popupModel.isVisible && this.popupModel.displayMode == "overlay") {
      return;
    }
    doKey2ClickBlur(event);
    this._popupModel.hide();
    this.resetFilterString();
    this.inputString = null;
    this.hintString = "";
    event.stopPropagation();
  }
  onFocus(event: any): void {
    this.focused = true;
    this.setInputStringFromSelectedItem(this.question.selectedItem);
  }

  public setInputStringFromSelectedItem(newValue: any): void {
    if (!this.focused) return;
    if (this.searchEnabled && !!newValue) {
      this.applyInputString(newValue);
    } else {
      this.inputString = null;
    }
  }

  public dispose(): void {
    super.dispose();
    this.question && this.question.onPropertyChanged.remove(this.questionPropertyChangedHandler);
    this.questionPropertyChangedHandler = undefined;
    if (!!this.listModel) {
      this.listModel.dispose();
    }
    if (!!this.popupModel) {
      this.popupModel.dispose();
    }
    this.htmlCleanerElement = undefined;
  }

  scrollToFocusedItem(): void {
    this.listModel.scrollToFocusedItem();
  }
}