import { Action, IAction } from "./actions/action";
import { ActionContainer } from "./actions/container";
import { Base, ComputedUpdater } from "./base";
import { IDropdownMenuOptions } from "./base-interfaces";
import { DomDocumentHelper, DomWindowHelper } from "./global_variables_utils";
import { Helpers } from "./helpers";
import { ItemValue } from "./itemvalue";
import { property } from "./jsonobject";
import { IListModel, ListModel } from "./list";
import { LocalizableString } from "./localizablestring";
import { IPopupOptionsBase, PopupModel } from "./popup";
import { Question } from "./question";
import { QuestionSelectBase } from "./question_baseselect";
import { QuestionDropdownModel } from "./question_dropdown";
import { settings } from "./settings";
import { SurveyModel } from "./survey";
import { CreateCustomChoiceItemEvent } from "./survey-events-api";
import { CssClassBuilder } from "./utils/cssClassBuilder";
import { IsTouch, calculateIsTablet } from "./utils/devices";
import { classesToSelector, doKey2ClickBlur, doKey2ClickUp } from "./utils/utils";

export class DropdownListModel extends Base {
  readonly minPageSize = 25;
  readonly loadingItemHeight = 40;
  timer: any = undefined;
  private htmlCleanerElement: HTMLDivElement;

  private _markdownMode = false;
  private _popupModel: PopupModel;
  private chevronButton: Action;
  private clearButton: Action;
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
  public editorButtons: ActionContainer;

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
  private _loadQuestionChoices(callbackAfterItemsLoaded?: () => void) {
    const _filterString = this.filterString;
    this.setIsChoicesLoading(true);
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
        this.setIsChoicesLoading(false);
      }
    });
    this.itemsSettings.skip += this.itemsSettings.take;
  }

  private setIsChoicesLoading(newValue: boolean) {
    if (!!this.question.setIsChoicesLoading) {
      this.question.setIsChoicesLoading(newValue);
    }
  }

  private processCustomValue(newValue?: string) {
    if (!this.allowCustomChoices) return;

    const value = newValue || this.filterString;
    const item = this.listModel.getVisibleActions().filter(action => Helpers.isTwoValueEquals(action.text, value, false, false))[0];
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
          this._loadQuestionChoices(callbackAfterItemsLoaded);
        }, settings.dropdownSearchDelay);
      } else {
        this._loadQuestionChoices(callbackAfterItemsLoaded);
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

  private checkFocusRemainsWithinComponent(event: any): boolean {
    if (!this.question.cssClasses.root || !event?.target) return false;

    const rootElement = event.target.closest(classesToSelector(this.question.cssClasses.root));
    return (rootElement && rootElement.contains(event.relatedTarget));
  }

  protected createButtons(): void {
    this.editorButtons = new ActionContainer();
    this.editorButtons.containerCss = "sd-dropdown-action-bar";

    this.chevronButton = new Action({
      id: "chevron",
      css: "sd-editor-chevron-button",
      iconName: this.question.cssClasses.chevronButtonIconId || "icon-chevron",
      iconSize: "auto",
      showTitle: false,
      locTitle: this.locSelectCaption,
      disableTabStop: true,
      enabled: new ComputedUpdater(() => {
        return !this.question.isInputReadOnly;
      }),
      visible: new ComputedUpdater(() => {
        return !this.question.isPreviewStyle;
      }),
      action: (context: any) => {
        this.onClick();
      }
    });

    this.clearButton = new Action({
      id: "clear",
      css: "sd-editor-clean-button",
      iconName: this.question.cssClasses.cleanButtonIconId || "icon-cancel-24x24",
      iconSize: "auto",
      showTitle: false,
      locTitle: this.locClearCaption,
      disableTabStop: true,
      enabled: new ComputedUpdater(() => {
        return !this.question.isInputReadOnly;
      }),
      visible: new ComputedUpdater(() => {
        const isEmpty = this.question.isEmpty();
        const isReadOnly = this.question.isReadOnly;
        return this.question.allowClear && !isEmpty && !isReadOnly;
      }),
      action: (context: any) => {
        this.onClear();
      }
    });

    this.editorButtons.setItems([this.clearButton, this.chevronButton]);
    this.editorButtons.actions.forEach(action => action.cssClasses = {
      item: "sd-editor-button-item",
      itemIcon: "sv-editor-button-item__icon",
      itemPressed: "sd-editor-button-item--pressed",
    });
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
      this.chevronButton.pressed = option.isVisible;
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
      this.question.processOpenDropdownMenu(dropdownMenuOptions);
      const displayModeUpdated = this._popupModel.updateDisplayMode(dropdownMenuOptions.menuType);
      if (displayModeUpdated) {
        this.listModel.setSearchEnabled(this.inputAvailable && dropdownMenuOptions.menuType !== "dropdown");
      }

      if (!!this.question.onOpenedCallBack) {
        this.question.onOpenedCallBack();
      }
    }
    if (!isVisible) {
      this.onHidePopup();
    }
    this.ariaExpanded = isVisible ? "true" : "false";
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
    res.forceShowFilter = this.question.choicesLazyLoadEnabled || this.question.allowCustomChoices;
    res.areSameItemsCallback = (item1: IAction, item2: IAction): boolean => {
      return item1 === item2;
    };
    return res;
  }

  private setQuestionValue(item: IAction) {
    let selectedItem = item;
    if (this.allowCustomChoices && item.id === this.customItemValue.id) {
      const newChoice = this.createCustomItem();
      selectedItem = newChoice;
    }
    if (!!selectedItem) {
      this.resetFilterString();
      this.question.selectItem(selectedItem);
      if (this.searchEnabled) {
        this.applyInputString(selectedItem as ItemValue);
      }
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
    model.isAllDataLoaded = !this.choicesLazyLoadEnabled;
    model.disableSearch = this.choicesLazyLoadEnabled;
    model.actions.forEach(a => a.disableTabStop = true);
    model.setOnFilterStringChangedCallback(this.listModelFilterStringChanged);
    model.setLoadingIndicatorVisibilityObserver((isVisible: boolean) => {
      if (isVisible) {
        this.updateQuestionChoices();
      }
    });
  }
  protected getPopupCssClasses(): string { return "sv-single-select-list"; }
  public updateCssClasses(popupCssClass: string, listCssClasses: any): void {
    this.popupModel.cssClass = new CssClassBuilder().append(popupCssClass).append(this.getPopupCssClasses()).toString();
    this.listModel.cssClasses = listCssClasses;
  }
  protected resetFilterString(): void {
    if (!!this.filterString) {
      this.filterString = undefined;
      this.listModel.filterString = "";
    }
    this.inputString = null;
    this.hintString = "";
  }
  public clear(): void {
    this.customValue = undefined;
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

  public loadQuestionChoices(callbackAfterItemsLoaded?: () => void) {
    if (this.isAllDataLoaded) return;

    this._loadQuestionChoices(callbackAfterItemsLoaded);
  }

  public get canShowSelectedItem(): boolean {
    return !this.focused || this._markdownMode || !this.searchEnabled;
  }

  public get needRenderInput(): boolean {
    return !this.question.isInputReadOnly || !!this.placeholderRendered;
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
  @property() ariaExpanded : "true" | "false";

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
    this.ariaExpanded = "false";
    this.createLocalizableString("clearCaption", this.question, false, true);
    this.createLocalizableString("selectCaption", this.question, false, true);
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
    this.createButtons();
    this.resetItemsSettings();
    const classes = question.cssClasses;
    this.updateCssClasses(classes.popup, classes.list);
  }

  get popupModel(): PopupModel {
    return this._popupModel;
  }

  public get clearCaption(): string {
    return this.getLocalizableStringText("clearCaption");
  }
  public set clearCaption(value: string) {
    this.setLocalizableStringText("clearCaption", value);
  }
  get locClearCaption(): LocalizableString {
    return this.getLocalizableString("clearCaption");
  }

  public get selectCaption(): string {
    return this.getLocalizableStringText("selectCaption");
  }
  public set selectCaption(value: string) {
    this.setLocalizableStringText("selectCaption", value);
  }
  get locSelectCaption(): LocalizableString {
    return this.getLocalizableString("selectCaption");
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
  public get popupEnabled(): boolean {
    return !this.question.isInputReadOnly;
  }

  public get ariaQuestionRole(): string | undefined { return this.filterStringEnabled ? undefined : "combobox"; }
  public get ariaQuestionRequired(): "true" | "false" | undefined { return this.ariaQuestionRole ? this.question.a11y_input_ariaRequired : undefined; }
  public get ariaQuestionInvalid(): "true" | "false" | undefined { return this.ariaQuestionRole ? this.question.a11y_input_ariaInvalid : undefined; }
  public get ariaQuestionErrorMessage(): string | undefined { return this.ariaQuestionRole ? this.question.a11y_input_ariaErrormessage : undefined; }
  public get ariaQuestionLabel(): string | undefined { return this.ariaQuestionRole ? this.question.a11y_input_ariaLabel : undefined; }
  public get ariaQuestionLabelledby(): string | undefined { return this.ariaQuestionRole ? this.question.a11y_input_ariaLabelledBy : undefined; }
  public get ariaQuestionDescribedby(): string | undefined { return this.ariaQuestionRole ? this.question.a11y_input_ariaDescribedBy : undefined; }
  public get ariaQuestionControls(): string | undefined { return this.ariaQuestionRole && this.popupEnabled ? this.listElementId : undefined; }
  public get ariaQuestionExpanded(): "true" | "false" { return this.ariaQuestionRole ? (this.popupEnabled ? this.ariaExpanded : "false") : undefined; }
  public get ariaQuestionActivedescendant(): string | undefined { return this.ariaQuestionRole ? this.ariaActivedescendant : undefined; }

  public get ariaInputRole(): string { return this.filterStringEnabled ? "combobox" : undefined; }
  public get ariaInputRequired(): "true" | "false" { return this.ariaInputRole ? this.question.a11y_input_ariaRequired : undefined; }
  public get ariaInputInvalid(): "true" | "false" { return this.ariaInputRole ? this.question.a11y_input_ariaInvalid : undefined; }
  public get ariaInputErrorMessage(): string { return this.ariaInputRole ? this.question.a11y_input_ariaErrormessage : undefined; }
  public get ariaInputLabel(): string { return this.ariaInputRole ? this.question.a11y_input_ariaLabel : undefined; }
  public get ariaInputLabelledby(): string { return this.ariaInputRole ? this.question.a11y_input_ariaLabelledBy : undefined; }
  public get ariaInputDescribedby(): string { return this.ariaInputRole ? this.question.a11y_input_ariaDescribedBy : undefined; }
  public get ariaInputControls(): string { return this.ariaInputRole && this.popupEnabled ? this.listElementId : undefined; }
  public get ariaInputExpanded(): "true" | "false" { return this.ariaInputRole ? (this.popupEnabled ? this.ariaExpanded : "false") : undefined; }
  public get ariaInputActivedescendant(): string { return this.ariaInputRole ? this.ariaActivedescendant : undefined; }

  public setSearchEnabled(newValue: boolean): void {
    this.listModel.setSearchEnabled(IsTouch && (newValue || this.question.allowCustomChoices));
    this.searchEnabled = newValue;
  }

  public setAllowCustomChoices(newValue: boolean): void {
    this.allowCustomChoices = newValue;
    this.listModel.forceShowFilter = this.question.choicesLazyLoadEnabled || newValue;
    if (newValue) {
      this.searchEnabled = newValue;
    }
  }

  public setChoicesLazyLoadEnabled(newValue: boolean): void {
    this.choicesLazyLoadEnabled = newValue;
    this.listModel.disableSearch = newValue;
    this.listModel.isAllDataLoaded = !newValue;
    this.listModel.forceShowFilter = newValue || this.question.allowCustomChoices;
  }

  public setInputPlaceholder(newValue: string): void {
    this.inputPlaceholder = newValue;
  }

  public updateItems(): void {
    this.listModel.setItems(this.getAvailableItems());
  }

  public onClick(event?: any): void {
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

  public onClear(event?: any): void {
    this.question.clearValueFromUI();
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

  private static readonly KEY_UP = 38;
  private static readonly KEY_DOWN = 40;
  private static readonly KEY_TAB = 9;
  private static readonly KEY_ENTER = 13;
  private static readonly KEY_ESCAPE = 27;
  private static readonly KEY_SPACE = 32;
  private static readonly KEY_DELETE = 46;
  private static readonly KEY_BACKSPACE = 8;

  keyHandler(event: any): void {
    const keyCode = event.keyCode;
    const char = event.which || keyCode;

    const handled = this.handleKeyEvent(keyCode, char, event);
    if (handled.stopPropagation) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private handleKeyEvent(keyCode: number, char: number, event: any): { stopPropagation: boolean } {
    if (keyCode === DropdownListModel.KEY_UP) return this.handleArrowUp(event);
    if (keyCode === DropdownListModel.KEY_DOWN) return this.handleArrowDown();
    if (keyCode === DropdownListModel.KEY_TAB) return this.handleTab();
    if (keyCode === DropdownListModel.KEY_SPACE) return this.handleSpace(event);
    if (keyCode === DropdownListModel.KEY_ENTER) return this.handleEnter(event);
    if (char === DropdownListModel.KEY_DELETE || char === DropdownListModel.KEY_BACKSPACE) return this.handleDelete(event);
    if (keyCode === DropdownListModel.KEY_ESCAPE) return this.handleEscape();

    return this.handleOtherKeys(event);
  }

  private handleArrowUp(event: any): { stopPropagation: boolean } {
    if (this.popupModel.isVisible) {
      this.changeSelectionWithKeyboard(true);
      return { stopPropagation: true };
    }
    doKey2ClickUp(event, { processEsc: false, disableTabStop: this.question.isInputReadOnly });
    return { stopPropagation: true };
  }

  private handleArrowDown(): { stopPropagation: boolean } {
    this.popupModel.show();
    this.changeSelectionWithKeyboard(false);
    return { stopPropagation: true };
  }

  private handleTab(): { stopPropagation: boolean } {
    this.popupModel.hide();
    return { stopPropagation: false };
  }

  private handleSpace(event: any): { stopPropagation: boolean } {
    if (!this.popupModel.isVisible) {
      this.popupModel.show();
      this.changeSelectionWithKeyboard(false);
      return { stopPropagation: true };
    }
    if (!this.searchEnabled || !this.inputString) {
      this.listModel.selectFocusedItem();
      this.onFocus(event);
      return { stopPropagation: true };
    }
    return { stopPropagation: false };
  }

  private handleEnter(event: any): { stopPropagation: boolean } {
    if (!this.popupModel.isVisible) {
      (this.question.survey as SurveyModel).questionEditFinishCallback(this.question, event);
      return { stopPropagation: true };
    }
    const shouldClearOnEnter = this.searchEnabled && !this.inputString &&
      this.question instanceof QuestionDropdownModel && !this._markdownMode && !!this.question.value;

    if (shouldClearOnEnter) {
      this._popupModel.hide();
      this.onClear(event);
    } else {
      this.listModel.selectFocusedItem();
      this.onFocus(event);
    }
    return { stopPropagation: true };
  }

  private handleDelete(event: any): { stopPropagation: boolean } {
    if (!this.inputAvailable) {
      this.onClear(event);
    }
    return { stopPropagation: false };
  }

  private handleEscape(): { stopPropagation: boolean } {
    this._popupModel.hide();
    this.hintString = "";
    this.onEscape();
    return { stopPropagation: false };
  }

  private handleOtherKeys(event: any): { stopPropagation: boolean } {
    doKey2ClickUp(event, { processEsc: false, disableTabStop: this.question.isInputReadOnly });
    return { stopPropagation: false };
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
    if (this.checkFocusRemainsWithinComponent(event)) return;

    this.focused = false;
    if (this.popupModel.isVisible && this.popupModel.displayMode == "overlay") {
      return;
    }
    doKey2ClickBlur(event);
    this._popupModel.hide();
    this.resetFilterString();
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