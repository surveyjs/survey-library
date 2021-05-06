import { Serializer } from "./jsonobject";
import { Question } from "./question";
import { Base, SurveyError, ISurveyImpl, ISurvey } from "./base";
import { ItemValue } from "./itemvalue";
import { Helpers, HashTable } from "./helpers";
import { surveyLocalization } from "./surveyStrings";
import { OtherEmptyError } from "./error";
import { ChoicesRestful } from "./choicesRestful";
import { LocalizableString } from "./localizablestring";
import { ConditionRunner } from "./conditions";
import { settings } from "./settings";
import { SurveyModel } from "survey-core";

/**
 * It is a base class for checkbox, dropdown and radiogroup questions.
 */
export class QuestionSelectBase extends Question {
  public visibleChoicesChangedCallback: () => void;
  private filteredChoicesValue: Array<ItemValue>;
  private conditionChoicesVisibleIfRunner: ConditionRunner;
  private conditionChoicesEnableIfRunner: ConditionRunner;
  private commentValue: string;
  private prevCommentValue: string;
  private otherItemValue: ItemValue = new ItemValue("other");
  private choicesFromUrl: Array<ItemValue>;
  private cachedValueForUrlRequests: any;
  private isChoicesLoaded: boolean;
  private enableOnLoadingChoices: boolean;
  private dependedQuestions: Array<QuestionSelectBase> = [];
  private noneItemValue: ItemValue = new ItemValue("none");
  private newItemValue: ItemValue;
  constructor(name: string) {
    super(name);
    var noneItemText = this.createLocalizableString("noneText", this, true);
    noneItemText.onGetTextCallback = function(text) {
      return !!text ? text : surveyLocalization.getString("noneItemText");
    };
    this.noneItemValue.locOwner = this;
    this.noneItemValue.setLocText(noneItemText);

    this.createItemValues("choices");
    this.registerFunctionOnPropertyValueChanged("choices", () => {
      if (!this.filterItems()) {
        this.onVisibleChoicesChanged();
      }
    });
    this.registerFunctionOnPropertiesValueChanged(
      ["choicesFromQuestion", "choicesFromQuestionMode", "hasNone"],
      () => {
        this.onVisibleChoicesChanged();
      }
    );
    this.registerFunctionOnPropertyValueChanged("hideIfChoicesEmpty", () => {
      this.updateVisibilityBasedOnChoices();
    });
    this.createNewArray("visibleChoices");
    this.setNewRestfulProperty();
    var locOtherText = this.createLocalizableString("otherText", this, true);
    this.createLocalizableString("otherErrorText", this, true);
    this.otherItemValue.locOwner = this;
    this.otherItemValue.setLocText(locOtherText);
    locOtherText.onGetTextCallback = function(text) {
      return !!text ? text : surveyLocalization.getString("otherItemText");
    };
    this.choicesByUrl.beforeSendRequestCallback = (): void => {
      this.onBeforeSendRequest();
    };
    this.choicesByUrl.getResultCallback = (items: Array<ItemValue>): void => {
      this.onLoadChoicesFromUrl(items);
    };
    this.choicesByUrl.updateResultCallback = (
      items: Array<ItemValue>,
      serverResult: any
    ): Array<ItemValue> => {
      if (this.survey) {
        return this.survey.updateChoicesFromServer(this, items, serverResult);
      }
      return items;
    };
    this.createLocalizableString("otherPlaceHolder", this);
  }
  public getType(): string {
    return "selectbase";
  }
  public dispose() {
    super.dispose();
    for (var i = 0; i < this.dependedQuestions.length; i++) {
      this.dependedQuestions[i].choicesFromQuestion = "";
    }
    this.removeFromDependedQuestion(this.getQuestionWithChoices());
  }
  public supportGoNextPageError() {
    return !this.isOtherSelected || !!this.comment;
  }
  isLayoutTypeSupported(layoutType: string): boolean {
    return true;
  }
  public localeChanged() {
    super.localeChanged();
    if (this.choicesOrder !== "none") {
      this.updateVisibleChoices();
    }
  }
  public locStrsChanged() {
    super.locStrsChanged();
    if (!!this.choicesFromUrl) {
      ItemValue.locStrsChanged(this.choicesFromUrl);
      ItemValue.locStrsChanged(this.visibleChoices);
    }
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
   * Set this property to true, to show the "None" item on the bottom. If end-user checks this item, all other items would be unchecked.
   */
  public get hasNone(): boolean {
    return this.getPropertyValue("hasNone", false);
  }
  public set hasNone(val: boolean) {
    this.setPropertyValue("hasNone", val);
  }
  /**
   * Returns the none item. By using this property, you may change programmatically it's value and text.
   * @see hasNone
   */
  public get noneItem(): ItemValue {
    return this.noneItemValue;
  }
  /**
   * Use this property to set the different text for none item.
   */
  public get noneText(): string {
    return this.getLocalizableStringText(
      "noneText",
      surveyLocalization.getString("noneItemText")
    );
  }
  public set noneText(val: string) {
    this.setLocalizableStringText("noneText", val);
  }
  get locNoneText(): LocalizableString {
    return this.getLocalizableString("noneText");
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
    this.prevCommentValue = undefined;
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
      this.filteredChoicesValue = undefined;
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
      this.getFilteredChoices(),
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
  protected createRestful(): ChoicesRestful {
    return new ChoicesRestful();
  }
  private setNewRestfulProperty() {
    this.setPropertyValue("choicesByUrl", this.createRestful());
    this.choicesByUrl.owner = this;
    this.choicesByUrl.loadingOwner = this;
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
  public clearValue() {
    super.clearValue();
    this.prevCommentValue = undefined;
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
      this.prevCommentValue = undefined;
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
    if (!this.hasUnknownValue(val, true, false)) return this.valueFromData(val);
    this.comment = val;
    return this.otherItem.value;
  }
  protected rendredValueToDataCore(val: any): any {
    if (val == this.otherItem.value && this.getQuestionComment()) {
      val = this.getQuestionComment();
    }
    return val;
  }
  protected hasUnknownValue(
    val: any,
    includeOther: boolean = false,
    isFilteredChoices: boolean = true
  ): boolean {
    if (this.isValueEmpty(val)) return false;
    if (includeOther && val == this.otherItem.value) return false;
    if (this.hasNone && val == this.noneItem.value) return false;
    var choices = isFilteredChoices
      ? this.getFilteredChoices()
      : this.activeChoices;
    return ItemValue.getItemByValue(choices, val) == null;
  }
  protected isValueDisabled(val: any): boolean {
    var itemValue = ItemValue.getItemByValue(this.getFilteredChoices(), val);
    return !!itemValue && !itemValue.isEnabled;
  }
  /**
   * If the clearIncorrectValuesCallback is set, it is used to clear incorrect values instead of default behaviour.
   */
  public clearIncorrectValuesCallback: () => void;
  /**
   * Use this property to fill the choices from a RESTful service.
   * @see choices
   * @see ChoicesRestful
   * @see [Example: RESTful Dropdown](https://surveyjs.io/Examples/Library/?id=questiontype-dropdownrestfull)
   * @see [Docs: Fill Choices from a RESTful Service](https://surveyjs.io/Documentation/Library/?id=LibraryOverview#fill-the-choices-from-a-restful-service)
   */
  public get choicesByUrl(): ChoicesRestful {
    return this.getPropertyValue("choicesByUrl");
  }
  public set choicesByUrl(val: ChoicesRestful) {
    if (!val) return;
    this.setNewRestfulProperty();
    this.choicesByUrl.fromJSON(val.toJSON());
  }
  /**
   * The list of items. Every item has value and text. If text is empty, the value is rendered. The item text supports markdown.
   * @see choicesByUrl
   * @see choicesFromQuestion
   */
  public get choices(): Array<any> {
    return this.getPropertyValue("choices");
  }
  public set choices(newValue: Array<any>) {
    this.setPropertyValue("choices", newValue);
  }
  /**
   * Set this property to get choices from the specified question instead of defining them in the current question. This avoids duplication of choices declaration in your survey definition.
   * By setting this property, the "choices", "choicesVisibleIf", "choicesEnableIf" and "choicesOrder" properties become invisible, because these question characteristics depend on actions in another (specified) question.
   * Use the `choicesFromQuestionMode` property to filter choices obtained from the specified question.
   * @see choices
   * @see choicesFromQuestionMode
   */
  public get choicesFromQuestion(): string {
    return this.getPropertyValue("choicesFromQuestion");
  }
  public set choicesFromQuestion(val: string) {
    var question = this.getQuestionWithChoices();
    if (!!question) {
      question.removeFromDependedQuestion(this);
    }
    this.setPropertyValue("choicesFromQuestion", val);
  }
  private addIntoDependedQuestion(question: QuestionSelectBase) {
    if (!question || question.dependedQuestions.indexOf(this) > -1) return;
    question.dependedQuestions.push(this);
  }
  private removeFromDependedQuestion(question: QuestionSelectBase) {
    if (!question) return;
    var index = question.dependedQuestions.indexOf(this);
    if (index > -1) {
      question.dependedQuestions.splice(index, 1);
    }
  }
  /**
   * This property becomes visible when the `choicesFromQuestion` property is selected. The default value is "all" (all visible choices from another question are displayed as they are).
   * You can set this property to "selected" or "unselected" to display only selected or unselected choices from the specified question.
   * @see choicesFromQuestion
   */
  public get choicesFromQuestionMode(): string {
    return this.getPropertyValue("choicesFromQuestionMode");
  }
  public set choicesFromQuestionMode(val: string) {
    this.setPropertyValue("choicesFromQuestionMode", val);
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
    if (this.canUseFilteredChoices()) return this.getFilteredChoices();
    var res = this.sortVisibleChoices(this.getFilteredChoices().slice());
    this.addToVisibleChoices(res, this.isAddDefaultItems);
    return res;
  }
  protected canUseFilteredChoices(): boolean {
    return (
      !this.isAddDefaultItems &&
      !this.hasNone &&
      !this.hasOther &&
      this.choicesOrder == "none"
    );
  }
  protected addToVisibleChoices(items: Array<ItemValue>, isAddAll: boolean) {
    if (isAddAll) {
      if (!this.newItemValue) {
        this.newItemValue = new ItemValue("newitem"); //TODO
      }
      items.push(this.newItemValue);
    }
    if (this.supportOther() && (isAddAll || this.hasOther)) {
      items.push(this.otherItem);
    }
    if (this.supportNone() && (isAddAll || this.hasNone)) {
      items.push(this.noneItem);
    }
  }
  /**
   * For internal use in SurveyJS Creator V2.
   */
  public isItemInList(item: ItemValue): boolean {
    if (item === this.otherItem) return this.hasOther;
    if (item === this.noneItem) return this.hasNone;
    if (item === this.newItemValue) return false;
    return true;
  }
  protected get isAddDefaultItems() {
    return settings.supportCreatorV2 && this.isDesignMode;
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
            (options.calculations || []).forEach(calculation => {
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
  private getFilteredChoices(): Array<ItemValue> {
    return this.filteredChoicesValue
      ? this.filteredChoicesValue
      : this.activeChoices;
  }
  protected get activeChoices(): Array<ItemValue> {
    var question = this.getQuestionWithChoices();
    if (!!question) {
      this.addIntoDependedQuestion(question);
      return this.getChoicesFromQuestion(question);
    }
    return this.choicesFromUrl ? this.choicesFromUrl : this.getChoices();
  }
  private getQuestionWithChoices(): QuestionSelectBase {
    if (!this.choicesFromQuestion || !this.survey) return null;
    var res: any = this.survey.getQuestionByName(this.choicesFromQuestion);
    return !!res && !!res.visibleChoices && res !== this ? res : null;
  }
  protected getChoicesFromQuestion(
    question: QuestionSelectBase
  ): Array<ItemValue> {
    var res: Array<ItemValue> = [];
    var isSelected =
      this.choicesFromQuestionMode == "selected"
        ? true
        : this.choicesFromQuestionMode == "unselected"
        ? false
        : undefined;
    var choices = question.visibleChoices;
    for (var i = 0; i < choices.length; i++) {
      if (this.isBuiltInChoice(choices[i], question)) continue;
      if (isSelected === undefined) {
        res.push(choices[i]);
        continue;
      }
      var itemsSelected = question.isItemSelected(choices[i]);
      if ((itemsSelected && isSelected) || (!itemsSelected && !isSelected)) {
        res.push(choices[i]);
      }
    }
    return res;
  }
  protected isBuiltInChoice(
    item: ItemValue,
    question: QuestionSelectBase
  ): boolean {
    return (
      item === question.noneItem ||
      item === question.otherItem ||
      item === question.newItemValue
    );
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
  public supportNone(): boolean {
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
    if (this.isAddDefaultItems) {
      this.updateVisibleChoices();
    }
  }
  protected setSurveyCore(value: ISurvey) {
    super.setSurveyCore(value);
    if (!!value && !!this.choicesFromQuestion) {
      this.onVisibleChoicesChanged();
    }
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
    if (!!name && name == this.choicesFromQuestion) {
      this.onVisibleChoicesChanged();
    }
  }
  updateValueFromSurvey(newValue: any) {
    var newComment = "";
    if (this.hasOther && this.getStoreOthersAsComment()) {
      if (this.hasUnknownValue(newValue) && !this.getHasOther(newValue)) {
        newComment = this.getCommentFromValue(newValue);
        newValue = this.setOtherValueIntoValue(newValue);
      } else {
        newComment = this.data.getComment(this.getValueName());
      }
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
    if (!!newChoices) {
      for (var i = 0; i < newChoices.length; i++) {
        newChoices[i].locOwner = this;
      }
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
          if (!this.isValueEmpty(newValue.value)) {
            this.allowNotifyValueChanged = false;
            this.setQuestionValue(undefined);
          }
          this.allowNotifyValueChanged = hasChanged;
          if (hasChanged) {
            this.value = newValue.value;
          } else {
            this.setQuestionValue(newValue.value);
          }
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
  private isUpdatingChoicesDependedQuestions = false;
  protected updateChoicesDependedQuestions() {
    if (this.isUpdatingChoicesDependedQuestions) return;
    this.isUpdatingChoicesDependedQuestions = true;
    for (var i = 0; i < this.dependedQuestions.length; i++) {
      this.dependedQuestions[i].onVisibleChoicesChanged();
      this.dependedQuestions[i].updateChoicesDependedQuestions();
    }
    this.isUpdatingChoicesDependedQuestions = false;
  }
  onSurveyValueChanged(newValue: any) {
    super.onSurveyValueChanged(newValue);
    if (this.isLoadingFromJson) return;
    this.updateChoicesDependedQuestions();
  }
  protected onVisibleChoicesChanged() {
    if (this.isLoadingFromJson) return;
    this.updateVisibleChoices();
    this.updateVisibilityBasedOnChoices();
    if (!!this.visibleChoicesChangedCallback) {
      this.visibleChoicesChangedCallback();
    }
    this.updateChoicesDependedQuestions();
  }
  private updateVisibilityBasedOnChoices() {
    if (this.hideIfChoicesEmpty) {
      var filteredChoices = this.getFilteredChoices();
      this.visible = !filteredChoices || filteredChoices.length > 0;
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
    return array.sort(function(a, b) {
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
    if (
      !!this.choicesByUrl &&
      !this.choicesByUrl.isEmpty &&
      (!this.choicesFromUrl || this.choicesFromUrl.length == 0)
    )
      return;
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
  public getItemValueWrapperComponentName(item: ItemValue): string {
    const survey: SurveyModel = this.survey as SurveyModel;
    if (survey) {
      return survey.getItemValueWrapperComponentName(item, this);
    }
    return "survey-item-value-component";
  }
  public getItemValueWrapperComponentData(item: ItemValue): any {
    const survey: SurveyModel = this.survey as SurveyModel;
    if (survey) {
      return survey.getItemValueWrapperComponentData(item, this);
    }
    return item;
  }
}
/**
 * A base class for checkbox and radiogroup questions. It introduced a colCount property.
 */
export class QuestionCheckboxBase extends QuestionSelectBase {
  colCountChangedCallback: () => void;
  constructor(name: string) {
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
  protected getSearchableItemValueKeys(keys: Array<string>) {
    keys.push("choices");
  }
}
Serializer.addClass(
  "selectbase",
  [
    { name: "hasComment:switch", layout: "row" },
    {
      name: "commentText",
      dependsOn: "hasComment",
      visibleIf: function(obj: any) {
        return obj.hasComment;
      },
      serializationProperty: "locCommentText",
      layout: "row",
    },
    "choicesFromQuestion:question_selectbase",
    {
      name: "choices:itemvalue[]",
      baseValue: function() {
        return surveyLocalization.getString("choices_Item");
      },
      dependsOn: "choicesFromQuestion",
      visibleIf: (obj: any) => {
        return !obj.choicesFromQuestion;
      },
    },
    {
      name: "choicesFromQuestionMode",
      default: "all",
      choices: ["all", "selected", "unselected"],
      dependsOn: "choicesFromQuestion",
      visibleIf: (obj: any) => {
        return !!obj.choicesFromQuestion;
      },
    },
    {
      name: "choicesOrder",
      default: "none",
      choices: ["none", "asc", "desc", "random"],
      dependsOn: "choicesFromQuestion",
      visibleIf: (obj: any) => {
        return !obj.choicesFromQuestion;
      },
    },
    {
      name: "choicesByUrl:restfull",
      className: "ChoicesRestful",
      onGetValue: function(obj: any) {
        return obj.choicesByUrl.getData();
      },
      onSetValue: function(obj: any, value: any) {
        obj.choicesByUrl.setData(value);
      },
    },
    "hideIfChoicesEmpty:boolean",
    {
      name: "choicesVisibleIf:condition",
      dependsOn: "choicesFromQuestion",
      visibleIf: (obj: any) => {
        return !obj.choicesFromQuestion;
      },
    },
    {
      name: "choicesEnableIf:condition",
      dependsOn: "choicesFromQuestion",
      visibleIf: (obj: any) => {
        return !obj.choicesFromQuestion;
      },
    },
    "hasOther:boolean",
    "hasNone:boolean",
    {
      name: "otherPlaceHolder",
      serializationProperty: "locOtherPlaceHolder",
      dependsOn: "hasOther",
      visibleIf: function(obj: any) {
        return obj.hasOther;
      },
    },
    {
      name: "noneText",
      serializationProperty: "locNoneText",
      dependsOn: "hasNone",
      visibleIf: function(obj: any) {
        return obj.hasNone;
      },
    },
    {
      name: "otherText",
      serializationProperty: "locOtherText",
      dependsOn: "hasOther",
      visibleIf: function(obj: any) {
        return obj.hasOther;
      },
    },
    {
      name: "otherErrorText",
      serializationProperty: "locOtherErrorText",
      dependsOn: "hasOther",
      visibleIf: function(obj: any) {
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
