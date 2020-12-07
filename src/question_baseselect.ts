import { Serializer } from "./jsonobject";
import { Question } from "./question";
import { Base, SurveyError, ISurveyImpl } from "./base";
import { ItemValue } from "./itemvalue";
import { Helpers, HashTable } from "./helpers";
import { surveyLocalization } from "./surveyStrings";
import { OtherEmptyError } from "./error";
import { ChoicesRestfull } from "./choicesRestfull";
import { LocalizableString } from "./localizablestring";
import { ConditionRunner } from "./conditions";
import { settings } from "./settings";

/**
 * It is a base class for checkbox, dropdown and radiogroup questions.
 */
export class QuestionSelectBase extends Question {
  public visibleChoicesChangedCallback: () => void;
  private filteredChoicesValue: Array<ItemValue> = null;
  private conditionChoicesVisibleIfRunner: ConditionRunner;
  private conditionChoicesEnableIfRunner: ConditionRunner;
  private commentValue: string;
  private prevCommentValue: string;
  private otherItemValue: ItemValue = new ItemValue("other");
  private choicesFromUrl: Array<ItemValue> = null;
  private cachedValueForUrlRequests: any = null;
  private isChoicesLoaded: boolean = false;
  private enableOnLoadingChoices: boolean = false;
  constructor(name: string) {
    super(name);
    var self = this;
    this.createItemValues("choices");
    this.registerFunctionOnPropertyValueChanged("choices", function () {
      if (!self.filterItems()) {
        self.onVisibleChoicesChanged();
      }
    });
    this.registerFunctionOnPropertyValueChanged(
      "hideIfChoicesEmpty",
      function () {
        self.updateVisibilityBasedOnChoices();
      }
    );
    this.createNewArray("visibleChoices");
    this.setPropertyValue("choicesByUrl", this.createRestfull());
    this.choicesByUrl.owner = this;
    this.choicesByUrl.loadingOwner = this;
    var locOtherText = this.createLocalizableString("otherText", this, true);
    this.createLocalizableString("otherErrorText", this, true);
    this.otherItemValue.locOwner = this;
    this.otherItemValue.setLocText(locOtherText);
    locOtherText.onGetTextCallback = function (text) {
      return !!text ? text : surveyLocalization.getString("otherItemText");
    };
    this.choicesByUrl.beforeSendRequestCallback = function () {
      self.onBeforeSendRequest();
    };
    this.choicesByUrl.getResultCallback = function (items: Array<ItemValue>) {
      self.onLoadChoicesFromUrl(items);
    };
    this.choicesByUrl.updateResultCallback = function (
      items: Array<ItemValue>,
      serverResult: any
    ): Array<ItemValue> {
      if (self.survey) {
        return self.survey.updateChoicesFromServer(self, items, serverResult);
      }
      return items;
    };
    this.createLocalizableString("otherPlaceHolder", this);
  }
  public getType(): string {
    return "selectbase";
  }
  public supportGoNextPageError() {
    return !this.isOtherSelected || !!this.comment;
  }
  isLayoutTypeSupported(layoutType: string): boolean {
    return true;
  }
  /**
   * Returns the other item. By using this property, you may change programmatically it's value and text.
   * @see hasOther
   */
  public get otherItem(): ItemValue {
    return this.otherItemValue;
  }
  /**
   * Returns true if a user select the 'other' item.
   */
  public get isOtherSelected(): boolean {
    return this.hasOther && this.getHasOther(this.renderedValue);
  }
  /**
   * An expression that returns true or false. It runs against each choices item and if for this item it returns true, then the item is visible otherwise the item becomes invisible. Please use {item} to get the current item value in the expression.
   * @see visibleIf
   * @see choicesEnableIf
   */
  public get choicesVisibleIf(): string {
    return this.getPropertyValue("choicesVisibleIf", "");
  }
  public set choicesVisibleIf(val: string) {
    this.setPropertyValue("choicesVisibleIf", val);
    this.filterItems();
  }
  /**
   * An expression that returns true or false. It runs against each choices item and if for this item it returns true, then the item is enabled otherwise the item becomes disabled. Please use {item} to get the current item value in the expression.
   * @see choicesVisibleIf
   */
  public get choicesEnableIf(): string {
    return this.getPropertyValue("choicesEnableIf", "");
  }
  public set choicesEnableIf(val: string) {
    this.setPropertyValue("choicesEnableIf", val);
    this.filterItems();
  }
  public runCondition(values: HashTable<any>, properties: HashTable<any>) {
    super.runCondition(values, properties);
    this.runItemsEnableCondition(values, properties);
    this.runItemsCondition(values, properties);
  }
  protected isTextValue(): boolean {
    return true; //for comments and others
  }
  private isSettingDefaultValue: boolean = false;
  protected setDefaultValue() {
    this.isSettingDefaultValue =
      !this.isValueEmpty(this.defaultValue) &&
      this.hasUnknownValue(this.defaultValue);
    super.setDefaultValue();
    this.isSettingDefaultValue = false;
  }
  protected getIsMultipleValue(): boolean {
    return false;
  }
  protected convertDefaultValue(val: any): any {
    if (val == null || val == undefined) return val;
    if (this.getIsMultipleValue()) {
      if (!Array.isArray(val)) return [val];
    } else {
      if (Array.isArray(val) && val.length > 0) return val[0];
    }
    return val;
  }
  protected filterItems(): boolean {
    if (
      this.isLoadingFromJson ||
      !this.data ||
      this.areInvisibleElementsShowing
    )
      return false;
    var values = this.getDataFilteredValues();
    var properties = this.getDataFilteredProperties();
    this.runItemsEnableCondition(values, properties);
    return this.runItemsCondition(values, properties);
  }
  protected runItemsCondition(
    values: HashTable<any>,
    properties: HashTable<any>
  ): boolean {
    this.setConditionalChoicesRunner();
    var hasChanges = this.runConditionsForItems(values, properties);
    if (
      !!this.filteredChoicesValue &&
      this.filteredChoicesValue.length === this.activeChoices.length
    ) {
      this.filteredChoicesValue = null;
    }
    if (hasChanges) {
      this.onVisibleChoicesChanged();
      this.clearIncorrectValues();
    }
    return hasChanges;
  }
  protected runItemsEnableCondition(
    values: HashTable<any>,
    properties: HashTable<any>
  ): any {
    this.setConditionalEnableChoicesRunner();
    var hasChanged = ItemValue.runEnabledConditionsForItems(
      this.activeChoices,
      this.conditionChoicesEnableIfRunner,
      values,
      properties,
      (item: ItemValue): boolean => {
        return this.onEnableItemCallBack(item);
      }
    );
    if (hasChanged) {
      this.clearDisabledValues();
    }
    this.onAfterRunItemsEnableCondition();
  }
  protected onAfterRunItemsEnableCondition() {}
  protected onEnableItemCallBack(item: ItemValue): boolean {
    return true;
  }
  private setConditionalChoicesRunner() {
    if (this.choicesVisibleIf) {
      if (!this.conditionChoicesVisibleIfRunner) {
        this.conditionChoicesVisibleIfRunner = new ConditionRunner(
          this.choicesVisibleIf
        );
      }
      this.conditionChoicesVisibleIfRunner.expression = this.choicesVisibleIf;
    } else {
      this.conditionChoicesVisibleIfRunner = null;
    }
  }
  private setConditionalEnableChoicesRunner() {
    if (this.choicesEnableIf) {
      if (!this.conditionChoicesEnableIfRunner) {
        this.conditionChoicesEnableIfRunner = new ConditionRunner(
          this.choicesEnableIf
        );
      }
      this.conditionChoicesEnableIfRunner.expression = this.choicesEnableIf;
    } else {
      this.conditionChoicesEnableIfRunner = null;
    }
  }
  private runConditionsForItems(
    values: HashTable<any>,
    properties: HashTable<any>
  ): boolean {
    this.filteredChoicesValue = [];
    return ItemValue.runConditionsForItems(
      this.activeChoices,
      this.filteredChoices,
      this.areInvisibleElementsShowing
        ? null
        : this.conditionChoicesVisibleIfRunner,
      values,
      properties,
      !this.survey || !this.survey.areInvisibleElementsShowing
    );
  }
  protected getHasOther(val: any): boolean {
    return val === this.otherItem.value;
  }
  get validatedValue(): any {
    return this.rendredValueToDataCore(this.value);
  }
  protected createRestfull(): ChoicesRestfull {
    return new ChoicesRestfull();
  }
  protected getQuestionComment(): string {
    if (!!this.commentValue) return this.commentValue;
    if (this.hasComment || this.getStoreOthersAsComment())
      return super.getQuestionComment();
    return this.commentValue;
  }
  private isSettingComment: boolean = false;
  protected setQuestionComment(newValue: string) {
    if (this.hasComment || this.getStoreOthersAsComment())
      super.setQuestionComment(newValue);
    else {
      if (!this.isSettingComment && newValue != this.commentValue) {
        this.isSettingComment = true;
        this.commentValue = newValue;
        if (this.isOtherSelected && !this.isRenderedValueSetting) {
          this.value = this.rendredValueToData(this.renderedValue);
        }
        this.isSettingComment = false;
      }
    }
  }
  public get renderedValue(): any {
    return this.getPropertyValue("renderedValue", null);
  }
  public set renderedValue(val: any) {
    this.setPropertyValue("renderedValue", val);
    this.value = this.rendredValueToData(val);
  }
  protected setQuestionValue(newValue: any, updateIsAnswered: boolean = true) {
    if (
      this.isLoadingFromJson ||
      Helpers.isTwoValueEquals(this.value, newValue)
    )
      return;
    super.setQuestionValue(newValue, updateIsAnswered);
    this.setPropertyValue("renderedValue", this.rendredValueFromData(newValue));
    if (this.hasComment) return;
    var isOtherSel = this.isOtherSelected;
    if (isOtherSel && !!this.prevCommentValue) {
      var oldComment = this.prevCommentValue;
      this.prevCommentValue = "";
      this.comment = oldComment;
    }
    if (!isOtherSel && !!this.comment) {
      if (this.getStoreOthersAsComment()) {
        this.prevCommentValue = this.comment;
      }
      this.comment = "";
    }
  }
  protected setNewValue(newValue: any) {
    newValue = this.valueFromData(newValue);
    if (
      (!this.choicesByUrl.isRunning &&
        !this.choicesByUrl.isWaitingForParameters) ||
      !this.isValueEmpty(newValue)
    ) {
      this.cachedValueForUrlRequests = newValue;
    }
    super.setNewValue(newValue);
  }
  protected valueFromData(val: any): any {
    let choiceitem = ItemValue.getItemByValue(this.activeChoices, val);
    if (!!choiceitem) {
      return choiceitem.value;
    }
    return super.valueFromData(val);
  }
  protected rendredValueFromData(val: any): any {
    if (this.getStoreOthersAsComment()) return val;
    return this.renderedValueFromDataCore(val);
  }
  protected rendredValueToData(val: any): any {
    if (this.getStoreOthersAsComment()) return val;
    return this.rendredValueToDataCore(val);
  }
  protected renderedValueFromDataCore(val: any): any {
    if (!this.hasUnknownValue(val, true)) return this.valueFromData(val);
    this.comment = val;
    return this.otherItem.value;
  }
  protected rendredValueToDataCore(val: any): any {
    if (val == this.otherItem.value && this.getQuestionComment()) {
      val = this.getQuestionComment();
    }
    return val;
  }
  protected hasUnknownValue(val: any, includeOther: boolean = false): boolean {
    if (Helpers.isValueEmpty(val)) return false;
    if (includeOther && val == this.otherItem.value) return false;
    return ItemValue.getItemByValue(this.filteredChoices, val) == null;
  }
  protected isValueDisabled(val: any): boolean {
    var itemValue = ItemValue.getItemByValue(this.filteredChoices, val);
    return !!itemValue && !itemValue.isEnabled;
  }
  /**
   * If the clearIncorrectValuesCallback is set, it is used to clear incorrect values instead of default behaviour.
   */
  public clearIncorrectValuesCallback: () => void;
  /**
   * Use this property to fill the choices from a restful service.
   * @see choices
   */
  public get choicesByUrl(): ChoicesRestfull {
    return this.getPropertyValue("choicesByUrl");
  }
  /**
   * The list of items. Every item has value and text. If text is empty, the value is rendered. The item text supports markdown.
   * @see choicesByUrl
   */
  public get choices(): Array<any> {
    return this.getPropertyValue("choices");
  }
  public set choices(newValue: Array<any>) {
    this.setPropertyValue("choices", newValue);
  }
  /**
   * Set this property to true to hide the question if there is no visible choices.
   */
  public get hideIfChoicesEmpty(): boolean {
    return this.getPropertyValue("hideIfChoicesEmpty", false);
  }
  public set hideIfChoicesEmpty(val: boolean) {
    this.setPropertyValue("hideIfChoicesEmpty", val);
  }
  public get keepIncorrectValues(): boolean {
    return this.getPropertyValue("keepIncorrectValues", false);
  }
  public set keepIncorrectValues(val: boolean) {
    this.setPropertyValue("keepIncorrectValues", val);
  }

  /**
   * Please use survey.storeOthersAsComment to change the behavior on the survey level. This property is depricated and invisible in Survey Creator.
   * By default the entered text in the others input in the checkbox/radiogroup/dropdown are stored as "question name " + "-Comment". The value itself is "question name": "others". Set this property to false, to store the entered text directly in the "question name" key.
   * Possible values are: "default", true, false
   * @see SurveyModel.storeOthersAsComment
   */
  public get storeOthersAsComment(): any {
    return this.getPropertyValue("storeOthersAsComment", "default");
  }
  public set storeOthersAsComment(val: any) {
    this.setPropertyValue("storeOthersAsComment", val);
  }
  protected hasOtherChanged() {
    this.onVisibleChoicesChanged();
  }
  /**
   * Use this property to render items in a specific order: "asc", "desc", "random". Default value is "none".
   */
  public get choicesOrder(): string {
    return this.getPropertyValue("choicesOrder");
  }
  public set choicesOrder(val: string) {
    val = val.toLowerCase();
    if (val == this.choicesOrder) return;
    this.setPropertyValue("choicesOrder", val);
    this.onVisibleChoicesChanged();
  }
  /**
   * Use this property to set the different text for other item.
   */
  public get otherText(): string {
    return this.getLocalizableStringText(
      "otherText",
      surveyLocalization.getString("otherItemText")
    );
  }
  public set otherText(val: string) {
    this.setLocalizableStringText("otherText", val);
    this.onVisibleChoicesChanged();
  }
  get locOtherText(): LocalizableString {
    return this.getLocalizableString("otherText");
  }
  /**
   *  Use this property to set the place holder text for other or comment field  .
   */
  public get otherPlaceHolder(): string {
    return this.getLocalizableStringText("otherPlaceHolder");
  }
  public set otherPlaceHolder(val: string) {
    this.setLocalizableStringText("otherPlaceHolder", val);
  }
  get locOtherPlaceHolder(): LocalizableString {
    return this.getLocalizableString("otherPlaceHolder");
  }
  /**
   * The text that shows when the other item is choosed by the other input is empty.
   */
  public get otherErrorText(): string {
    return this.getLocalizableStringText(
      "otherErrorText",
      surveyLocalization.getString("otherRequiredError")
    );
  }
  public set otherErrorText(val: string) {
    this.setLocalizableStringText("otherErrorText", val);
  }
  get locOtherErrorText(): LocalizableString {
    return this.getLocalizableString("otherErrorText");
  }
  /**
   * The list of items as they will be rendered. If needed items are sorted and the other item is added.
   * @see hasOther
   * @see choicesOrder
   * @see enabledChoices
   */
  public get visibleChoices(): Array<ItemValue> {
    return this.getPropertyValue("visibleChoices", []);
  }
  /**
   * The list of enabled items as they will be rendered. The disabled items are not included
   * @see hasOther
   * @see choicesOrder
   * @see visibleChoices
   */
  public get enabledChoices(): Array<ItemValue> {
    var res = [];
    var items = this.visibleChoices;
    for (var i = 0; i < items.length; i++) {
      if (items[i].isEnabled) res.push(items[i]);
    }
    return res;
  }
  protected updateVisibleChoices() {
    if (this.isLoadingFromJson) return;
    var newValue = new Array<ItemValue>();
    var calcValue = this.calcVisibleChoices();
    if (!calcValue) calcValue = [];
    for (var i = 0; i < calcValue.length; i++) {
      newValue.push(calcValue[i]);
    }
    this.setPropertyValue("visibleChoices", newValue);
  }
  private calcVisibleChoices(): Array<ItemValue> {
    if (this.canUseFilteredChoices()) return this.filteredChoices;
    var res = this.sortVisibleChoices(this.filteredChoices.slice());
    this.addToVisibleChoices(res);
    return res;
  }
  protected canUseFilteredChoices(): boolean {
    return !this.hasOther && this.choicesOrder == "none";
  }
  protected addToVisibleChoices(items: Array<ItemValue>) {
    if (this.hasOther) {
      items.push(this.otherItem);
    }
  }
  public getPlainData(
    options: {
      includeEmpty?: boolean;
      includeQuestionTypes?: boolean;
      calculations?: Array<{
        propertyName: string;
      }>;
    } = {
      includeEmpty: true,
      includeQuestionTypes: false,
    }
  ) {
    var questionPlainData = super.getPlainData(options);
    if (!!questionPlainData) {
      var values = Array.isArray(this.value) ? this.value : [this.value];
      questionPlainData.isNode = true;
      questionPlainData.data = (questionPlainData.data || []).concat(
        values.map((dataValue, index) => {
          var choice = ItemValue.getItemByValue(this.visibleChoices, dataValue);
          var choiceDataItem = <any>{
            name: index,
            title: "Choice",
            value: dataValue,
            displayValue: this.getChoicesDisplayValue(
              this.visibleChoices,
              dataValue
            ),
            getString: (val: any) =>
              typeof val === "object" ? JSON.stringify(val) : val,
            isNode: false,
          };
          if (!!choice) {
            (options.calculations || []).forEach((calculation) => {
              choiceDataItem[calculation.propertyName] =
                choice[calculation.propertyName];
            });
          }
          if (this.isOtherSelected && this.otherItemValue === choice) {
            choiceDataItem.isOther = true;
            choiceDataItem.displayValue = this.comment;
          }
          return choiceDataItem;
        })
      );
    }
    return questionPlainData;
  }

  /**
   * Returns the text for the current value. If the value is null then returns empty string. If 'other' is selected then returns the text for other value.
   */
  protected getDisplayValueCore(keysAsText: boolean, value: any): any {
    return this.getChoicesDisplayValue(this.visibleChoices, value);
  }
  protected getChoicesDisplayValue(items: ItemValue[], val: any): any {
    if (val == this.otherItemValue.value)
      return this.comment ? this.comment : this.locOtherText.textOrHtml;
    var str = ItemValue.getTextOrHtmlByValue(items, val);
    return str == "" && val ? val : str;
  }
  private get filteredChoices(): Array<ItemValue> {
    return this.filteredChoicesValue
      ? this.filteredChoicesValue
      : this.activeChoices;
  }
  protected get activeChoices(): Array<ItemValue> {
    return this.choicesFromUrl ? this.choicesFromUrl : this.getChoices();
  }
  protected getChoices(): Array<ItemValue> {
    return this.choices;
  }
  public supportComment(): boolean {
    return true;
  }
  public supportOther(): boolean {
    return true;
  }
  protected onCheckForErrors(
    errors: Array<SurveyError>,
    isOnValueChanged: boolean
  ) {
    super.onCheckForErrors(errors, isOnValueChanged);
    if (!this.hasOther || !this.isOtherSelected || this.comment) return;
    errors.push(new OtherEmptyError(this.otherErrorText, this));
  }
  public setSurveyImpl(value: ISurveyImpl) {
    super.setSurveyImpl(value);
    this.runChoicesByUrl();
  }
  protected getStoreOthersAsComment() {
    if (this.isSettingDefaultValue) return false;
    return (
      this.storeOthersAsComment === true ||
      (this.storeOthersAsComment == "default" &&
        (this.survey != null ? this.survey.storeOthersAsComment : true)) ||
      (!this.choicesByUrl.isEmpty && !this.choicesFromUrl)
    );
  }
  onSurveyLoad() {
    super.onSurveyLoad();
    this.runChoicesByUrl();
    this.onVisibleChoicesChanged();
  }
  onAnyValueChanged(name: string) {
    super.onAnyValueChanged(name);
    if (name != this.getValueName()) {
      this.runChoicesByUrl();
    }
  }
  updateValueFromSurvey(newValue: any) {
    var newComment = "";
    if (
      this.hasOther &&
      this.getStoreOthersAsComment() &&
      this.hasUnknownValue(newValue) &&
      !this.getHasOther(newValue)
    ) {
      newComment = this.getCommentFromValue(newValue);
      newValue = this.setOtherValueIntoValue(newValue);
    }
    super.updateValueFromSurvey(newValue);
    if (!!newComment) {
      this.setNewComment(newComment);
    }
  }
  protected getCommentFromValue(newValue: any): string {
    return newValue;
  }
  protected setOtherValueIntoValue(newValue: any): any {
    return this.otherItem.value;
  }
  private isRunningChoices: boolean = false;
  private runChoicesByUrl() {
    if (!this.choicesByUrl || this.isLoadingFromJson || this.isRunningChoices)
      return;
    var processor = this.surveyImpl
      ? this.surveyImpl.getTextProcessor()
      : this.textProcessor;
    if (!processor) processor = this.survey;
    if (!processor) return;
    this.isReadyValue = this.isChoicesLoaded || this.choicesByUrl.isEmpty;
    this.isRunningChoices = true;
    this.choicesByUrl.run(processor);
    this.isRunningChoices = false;
  }
  private isFirstLoadChoicesFromUrl = true;
  protected onBeforeSendRequest() {
    if (settings.disableOnGettingChoicesFromWeb === true && !this.isReadOnly) {
      this.enableOnLoadingChoices = true;
      this.readOnly = true;
    }
  }
  protected onLoadChoicesFromUrl(array: Array<ItemValue>) {
    if (this.enableOnLoadingChoices) {
      this.readOnly = false;
    }
    if (!this.isReadOnly) {
      var errors = [];
      if (this.choicesByUrl && this.choicesByUrl.error) {
        errors.push(this.choicesByUrl.error);
      }
      this.errors = errors;
    }
    var newChoices = null;
    var checkCachedValuesOnExisting = true;
    if (
      this.isFirstLoadChoicesFromUrl &&
      !this.cachedValueForUrlRequests &&
      this.defaultValue
    ) {
      this.cachedValueForUrlRequests = this.defaultValue;
      checkCachedValuesOnExisting = false;
    }
    if (this.isValueEmpty(this.cachedValueForUrlRequests)) {
      this.cachedValueForUrlRequests = this.value;
    }
    this.isFirstLoadChoicesFromUrl = false;
    var cachedValues = this.createCachedValueForUrlRequests(
      this.cachedValueForUrlRequests,
      checkCachedValuesOnExisting
    );
    if (array && array.length > 0) {
      newChoices = new Array<ItemValue>();
      ItemValue.setData(newChoices, array);
    }
    this.choicesFromUrl = newChoices;
    this.filterItems();
    this.onVisibleChoicesChanged();
    if (newChoices) {
      var newValue = this.updateCachedValueForUrlRequests(
        cachedValues,
        newChoices
      );
      if (!!newValue && !this.isReadOnly) {
        var hasChanged = !Helpers.isTwoValueEquals(this.value, newValue.value);
        try {
          if (!Helpers.isValueEmpty(newValue.value)) {
            this.allowNotifyValueChanged = false;
            this.locNotificationInData = true;
            this.value = undefined;
            this.locNotificationInData = false;
          }
          this.allowNotifyValueChanged = hasChanged;
          this.value = newValue.value;
        } finally {
          this.allowNotifyValueChanged = true;
        }
      }
    }
    this.choicesLoaded();
  }
  private createCachedValueForUrlRequests(
    val: any,
    checkOnExisting: boolean
  ): any {
    if (this.isValueEmpty(val)) return null;
    if (Array.isArray(val)) {
      var res = [];
      for (var i = 0; i < val.length; i++) {
        res.push(this.createCachedValueForUrlRequests(val[i], true));
      }
      return res;
    }
    var isExists = checkOnExisting ? !this.hasUnknownValue(val) : true;
    return { value: val, isExists: isExists };
  }
  private updateCachedValueForUrlRequests(
    val: any,
    newChoices: Array<ItemValue>
  ): any {
    if (this.isValueEmpty(val)) return null;
    if (Array.isArray(val)) {
      var res = [];
      for (var i = 0; i < val.length; i++) {
        var updatedValue = this.updateCachedValueForUrlRequests(
          val[i],
          newChoices
        );
        if (updatedValue && !this.isValueEmpty(updatedValue.value)) {
          var newValue = updatedValue.value;
          var item = ItemValue.getItemByValue(newChoices, updatedValue.value);
          if (!!item) {
            newValue = item.value;
          }
          res.push(newValue);
        }
      }
      return { value: res };
    }
    var value =
      val.isExists && this.hasUnknownValue(val.value) ? null : val.value;
    var item = ItemValue.getItemByValue(newChoices, value);
    if (!!item) {
      value = item.value;
    }
    return { value: value };
  }
  protected onVisibleChoicesChanged() {
    if (this.isLoadingFromJson) return;
    this.updateVisibleChoices();
    this.updateVisibilityBasedOnChoices();
    if (!!this.visibleChoicesChangedCallback)
      this.visibleChoicesChangedCallback();
  }
  private updateVisibilityBasedOnChoices() {
    if (this.hideIfChoicesEmpty) {
      this.visible = !this.filteredChoices || this.filteredChoices.length > 0;
    }
  }
  private sortVisibleChoices(array: Array<ItemValue>): Array<ItemValue> {
    var order = this.choicesOrder.toLowerCase();
    if (order == "asc") return this.sortArray(array, 1);
    if (order == "desc") return this.sortArray(array, -1);
    if (order == "random") return this.randomizeArray(array);
    return array;
  }
  private sortArray(array: Array<ItemValue>, mult: number): Array<ItemValue> {
    return array.sort(function (a, b) {
      if (a.calculatedText < b.calculatedText) return -1 * mult;
      if (a.calculatedText > b.calculatedText) return 1 * mult;
      return 0;
    });
  }
  private randomizeArray(array: Array<ItemValue>): Array<ItemValue> {
    return Helpers.randomizeArray<ItemValue>(array);
  }
  public clearIncorrectValues() {
    if (this.keepIncorrectValues) return;
    if (
      !!this.survey &&
      this.survey.questionCountByValueName(this.getValueName()) > 1
    )
      return;
    if (!!this.choicesByUrl && !this.choicesByUrl.isEmpty) return;
    if (this.clearIncorrectValuesCallback) {
      this.clearIncorrectValuesCallback();
    } else {
      this.clearIncorrectValuesCore();
    }
  }
  public clearValueIfInvisible() {
    super.clearValueIfInvisible();
    this.clearIncorrectValues();
  }
  /**
   * Returns true if item is selected
   * @param item checkbox or radio item value
   */
  public isItemSelected(item: ItemValue): boolean {
    return item.value === this.value;
  }
  private clearDisabledValues() {
    if (!this.survey || !this.survey.clearValueOnDisableItems) return;
    this.clearDisabledValuesCore();
  }
  protected clearIncorrectValuesCore() {
    var val = this.value;
    if (this.canClearValueAnUnknow(val)) {
      this.clearValue();
    }
  }
  protected canClearValueAnUnknow(val: any): boolean {
    if (!this.getStoreOthersAsComment() && this.isOtherSelected) return false;
    return this.hasUnknownValue(val, true);
  }
  protected clearDisabledValuesCore() {
    if (this.isValueDisabled(this.value)) {
      this.clearValue();
    }
  }
  clearUnusedValues() {
    super.clearUnusedValues();
    if (!this.isOtherSelected && !this.hasComment) {
      this.comment = "";
    }
  }
  getColumnClass() {
    var columnClass = this.cssClasses.column;
    if (this.hasColumns) {
      columnClass += " sv-q-column-" + this.colCount;
    }
    return columnClass;
  }
  getLabelClass(item: ItemValue) {
    var labelClass = this.cssClasses.label;
    if (this.isItemSelected(item)) {
      labelClass += " " + this.cssClasses.labelChecked;
    }
    return labelClass;
  }
  getControlLabelClass(item: ItemValue) {
    var controlLabelClass = this.cssClasses.controlLabel;
    if (this.isItemSelected(item)) {
      controlLabelClass += " " + this.cssClasses.controlLabelChecked;
    }
    return controlLabelClass;
  }
  get columns() {
    var columns = [];
    var colCount = this.colCount;
    if (this.hasColumns && this.visibleChoices.length > 0) {
      if (settings.showItemsInOrder == "column") {
        var prevIndex = 0;
        var leftElementsCount = this.visibleChoices.length % colCount;
        for (var i = 0; i < colCount; i++) {
          var column = [];
          for (
            var j = prevIndex;
            j < prevIndex + Math.floor(this.visibleChoices.length / colCount);
            j++
          ) {
            column.push(this.visibleChoices[j]);
          }
          if (leftElementsCount > 0) {
            leftElementsCount--;
            column.push(this.visibleChoices[j]);
            j++;
          }
          prevIndex = j;
          columns.push(column);
        }
      } else {
        for (var i = 0; i < colCount; i++) {
          var column = [];
          for (var j = i; j < this.visibleChoices.length; j += colCount) {
            column.push(this.visibleChoices[j]);
          }
          columns.push(column);
        }
      }
    }
    return columns;
  }
  get hasColumns() {
    return this.colCount > 1;
  }
  public choicesLoaded(): void {
    this.isChoicesLoaded = true;
    let oldIsReady: boolean = this.isReadyValue;
    this.isReadyValue = true;
    this.onReadyChanged &&
      this.onReadyChanged.fire(this, {
        question: this,
        isReady: true,
        oldIsReady: oldIsReady,
      });
  }
}
/**
 * A base class for checkbox and radiogroup questions. It introduced a colCount property.
 */
export class QuestionCheckboxBase extends QuestionSelectBase {
  colCountChangedCallback: () => void;
  constructor(public name: string) {
    super(name);
  }
  /**
   * The number of columns for radiogroup and checkbox questions. Items are rendred in one line if the value is 0.
   */
  public get colCount(): number {
    return this.getPropertyValue("colCount", this.isFlowLayout ? 0 : 1);
  }
  public set colCount(value: number) {
    if (value < 0 || value > 5 || this.isFlowLayout) return;
    this.setPropertyValue("colCount", value);
    this.fireCallback(this.colCountChangedCallback);
  }
  getItemIndex(item: any) {
    return this.visibleChoices.indexOf(item);
  }
  protected onParentChanged() {
    super.onParentChanged();
    if (this.isFlowLayout) {
      this.setPropertyValue("colCount", null);
    }
  }
}
Serializer.addClass(
  "selectbase",
  [
    { name: "hasComment:switch", layout: "row" },
    {
      name: "commentText",
      dependsOn: "hasComment",
      visibleIf: function (obj: any) {
        return obj.hasComment;
      },
      serializationProperty: "locCommentText",
      layout: "row",
    },
    {
      name: "choices:itemvalue[]",
      baseValue: function () {
        return surveyLocalization.getString("choices_Item");
      },
    },
    {
      name: "choicesOrder",
      default: "none",
      choices: ["none", "asc", "desc", "random"],
    },
    {
      name: "choicesByUrl:restfull",
      className: "ChoicesRestfull",
      onGetValue: function (obj: any) {
        return obj.choicesByUrl.getData();
      },
      onSetValue: function (obj: any, value: any) {
        obj.choicesByUrl.setData(value);
      },
    },
    "hideIfChoicesEmpty:boolean",
    "choicesVisibleIf:condition",
    "choicesEnableIf:condition",
    "hasOther:boolean",
    {
      name: "otherPlaceHolder",
      serializationProperty: "locOtherPlaceHolder",
      dependsOn: "hasOther",
      visibleIf: function (obj: any) {
        return obj.hasOther;
      },
    },
    {
      name: "otherText",
      serializationProperty: "locOtherText",
      dependsOn: "hasOther",
      visibleIf: function (obj: any) {
        return obj.hasOther;
      },
    },
    {
      name: "otherErrorText",
      serializationProperty: "locOtherErrorText",
      dependsOn: "hasOther",
      visibleIf: function (obj: any) {
        return obj.hasOther;
      },
    },
    {
      name: "storeOthersAsComment",
      default: "default",
      choices: ["default", true, false],
      visible: false,
    },
  ],
  null,
  "question"
);

Serializer.addClass(
  "checkboxbase",
  [
    {
      name: "colCount:number",
      default: 1,
      choices: [0, 1, 2, 3, 4, 5],
      layout: "row",
    },
  ],
  null,
  "selectbase"
);
