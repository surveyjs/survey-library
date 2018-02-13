import { JsonObject } from "./jsonobject";
import { Question } from "./question";
import { SurveyError, ISurveyImpl } from "./base";
import { ItemValue } from "./itemvalue";
import { Helpers } from "./helpers";
import { surveyLocalization } from "./surveyStrings";
import { CustomError } from "./error";
import { ChoicesRestfull } from "./choicesRestfull";
import { LocalizableString } from "./localizablestring";

/**
 * It is a base class for checkbox, dropdown and radiogroup questions.
 */
export class QuestionSelectBase extends Question {
  private visibleChoicesCache: Array<ItemValue> = null;
  private commentValue: string;
  private otherItemValue: ItemValue = new ItemValue(
    "other",
    surveyLocalization.getString("otherItemText")
  );
  protected cachedValue: any;
  private choicesFromUrl: Array<ItemValue> = null;
  private cachedValueForUrlRequests: any = null;
  private choicesValues: Array<ItemValue>;
  /**
   * Use this property to fill the choices from a restful service.
   * @see choices
   */
  public choicesByUrl: ChoicesRestfull;
  choicesChangedCallback: () => void;
  constructor(name: string) {
    super(name);
    var self = this;
    this.choicesValues = this.createItemValues("choices");
    this.choicesByUrl = this.createRestfull();
    this.choicesByUrl.owner = this;
    this.createLocalizableString("otherText", this, true);
    this.createLocalizableString("otherErrorText", this, true);
    this.otherItemValue.locOwner = this;

    this.choicesByUrl.getResultCallback = function(items: Array<ItemValue>) {
      self.onLoadChoicesFromUrl(items);
    };
  }
  /**
   * Returns the other item. By using this property, you may change programmatically it's value and text.
   */
  public get otherItem(): ItemValue {
    this.otherItemValue.text = this.otherText;
    return this.otherItemValue;
  }
  /**
   * Returns true if a user select the 'other' item.
   */
  public get isOtherSelected(): boolean {
    return this.getStoreOthersAsComment()
      ? this.getHasOther(this.value)
      : this.getHasOther(this.cachedValue);
  }
  protected getHasOther(val: any): boolean {
    return val == this.otherItem.value;
  }
  get validatedValue(): any {
    return this.valueToDataCore(this.value);
  }
  protected createRestfull(): ChoicesRestfull {
    return new ChoicesRestfull();
  }
  protected getComment(): string {
    if (this.getStoreOthersAsComment()) return super.getComment();
    return this.commentValue;
  }
  private isSettingComment: boolean = false;
  protected setComment(newValue: string) {
    if (this.getStoreOthersAsComment()) super.setComment(newValue);
    else {
      if (!this.isSettingComment && newValue != this.commentValue) {
        this.isSettingComment = true;
        this.commentValue = newValue;
        if (this.isOtherSelected) {
          this.setNewValueInData(this.cachedValue);
        }
        this.isSettingComment = false;
      }
    }
  }
  protected setNewValue(newValue: any) {
    this.cachedValueForUrlRequests = newValue;
    super.setNewValue(newValue);
  }
  protected valueFromData(val: any): any {
    if (this.getStoreOthersAsComment()) return super.valueFromData(val);
    this.cachedValue = this.valueFromDataCore(val);
    return this.cachedValue;
  }
  protected valueToData(val: any): any {
    if (this.getStoreOthersAsComment()) return super.valueToData(val);
    this.cachedValue = val;
    return this.valueToDataCore(val);
  }
  protected valueFromDataCore(val: any): any {
    if (!this.hasUnknownValue(val)) return val;
    if (val == this.otherItem.value) return val;
    this.comment = val;
    return this.otherItem.value;
  }
  protected valueToDataCore(val: any): any {
    if (val == this.otherItem.value && this.getComment()) {
      val = this.getComment();
    }
    return val;
  }
  protected hasUnknownValue(val: any): boolean {
    if (!val) return false;
    var items = this.activeChoices;
    for (var i = 0; i < items.length; i++) {
      if (items[i].value == val) return false;
    }
    return true;
  }
  /**
   * The list of items. Every item has value and text. If text is empty, the value is rendered. The item text supports markdown.
   * @see choicesByUrl
   */
  public get choices(): Array<any> {
    return this.choicesValues;
  }
  public set choices(newValue: Array<any>) {
    this.setPropertyValue("choices", newValue);
    this.onVisibleChoicesChanged();
  }
  /**
   * By default the entered text in the others input in the checkbox/radiogroup/dropdown are stored as "question name " + "-Comment". The value itself is "question name": "others". Set this property to false, to store the entered text directly in the "question name" key.
   * @see SurveyModel.storeOthersAsComment
   */
  public get storeOthersAsComment(): boolean {
    return this.getPropertyValue("storeOthersAsComment", true);
  }
  public set storeOthersAsComment(val: boolean) {
    this.setPropertyValue("storeOthersAsComment", val);
  }
  protected hasOtherChanged() {
    this.onVisibleChoicesChanged();
  }
  /**
   * Use this property to render items in a specific order.
   */
  public get choicesOrder(): string {
    return this.getPropertyValue("choicesOrder", "none");
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
   */
  public get visibleChoices(): Array<ItemValue> {
    if (!this.hasOther && this.choicesOrder == "none")
      return this.activeChoices;
    if (!this.visibleChoicesCache) {
      this.visibleChoicesCache = this.sortVisibleChoices(
        this.activeChoices.slice()
      );
      if (this.hasOther) {
        this.visibleChoicesCache.push(this.otherItem);
      }
    }
    return this.visibleChoicesCache;
  }
  /**
   * Returns the text for the current value. If the value is null then returns empty string. If 'other' is selected then returns the text for other value.
   */
  public get displayValue(): any {
    if (this.isEmpty()) return "";
    return this.getDisplayValue(this.visibleChoices, this.value);
  }
  protected getDisplayValue(items: ItemValue[], val: any): any {
    if (val == this.otherItemValue.value)
      return this.comment ? this.comment : "";
    var str = ItemValue.getTextOrHtmlByValue(items, val);
    return str == "" && val ? val : str;
  }
  private get activeChoices(): Array<ItemValue> {
    return this.choicesFromUrl ? this.choicesFromUrl : this.choices;
  }
  public supportComment(): boolean {
    return true;
  }
  public supportOther(): boolean {
    return true;
  }
  protected onCheckForErrors(errors: Array<SurveyError>) {
    super.onCheckForErrors(errors);
    if (!this.hasOther || !this.isOtherSelected || this.comment) return;
    errors.push(new CustomError(this.otherErrorText));
  }
  public setSurveyImpl(value: ISurveyImpl) {
    super.setSurveyImpl(value);
    this.runChoicesByUrl();
  }
  public onLocaleChanged() {
    super.onLocaleChanged();
    this.onVisibleChoicesChanged();
  }
  protected getStoreOthersAsComment() {
    return (
      this.storeOthersAsComment &&
      (this.survey != null ? this.survey.storeOthersAsComment : true)
    );
  }
  onSurveyLoad() {
    super.onSurveyLoad();
    this.runChoicesByUrl();
    this.onVisibleChoicesChanged();
  }
  onAnyValueChanged(name: string) {
    super.onAnyValueChanged(name);
    this.runChoicesByUrl();
  }
  private runChoicesByUrl() {
    if (!this.choicesByUrl || this.isLoadingFromJson) return;
    var processor = this.surveyImpl
      ? this.surveyImpl.getTextProcessor()
      : this.textProcessor;
    if (!processor) processor = this.survey;
    if (!processor) return;
    this.choicesByUrl.run(processor);
  }
  private onLoadChoicesFromUrl(array: Array<ItemValue>) {
    var errorCount = this.errors.length;
    this.errors = [];
    if (this.choicesByUrl && this.choicesByUrl.error) {
      this.errors.push(this.choicesByUrl.error);
    }
    if (errorCount > 0 || this.errors.length > 0) {
      this.fireCallback(this.errorsChangedCallback);
    }
    var newChoices = null;
    var cachedValues = this.createCachedValueForUrlRequests(
      this.cachedValueForUrlRequests
    );
    if (array && array.length > 0) {
      newChoices = new Array<ItemValue>();
      ItemValue.setData(newChoices, array);
    }
    this.choicesFromUrl = newChoices;
    if (newChoices) {
      var newValue = this.updateCachedValueForUrlRequests(cachedValues);
      if (newValue) {
        this.value = newValue.value;
      }
    }
    this.onVisibleChoicesChanged();
  }
  private createCachedValueForUrlRequests(val: any): any {
    if (this.isValueEmpty(val)) return null;
    if (Array.isArray(val)) {
      var res = [];
      for (var i = 0; i < val.length; i++) {
        res.push(this.createCachedValueForUrlRequests(val[i]));
      }
      return res;
    }
    return { value: val, isExists: !this.hasUnknownValue(val) };
  }
  private updateCachedValueForUrlRequests(val: any): any {
    if (this.isValueEmpty(val)) return null;
    if (Array.isArray(val)) {
      var res = [];
      for (var i = 0; i < val.length; i++) {
        var updatedValue = this.updateCachedValueForUrlRequests(val[i]);
        if (updatedValue && !this.isValueEmpty(updatedValue.value)) {
          res.push(updatedValue.value);
        }
      }
      return { value: res };
    }
    var value =
      val.isExists && this.hasUnknownValue(val.value) ? null : val.value;
    return { value: value };
  }
  private onVisibleChoicesChanged() {
    if (this.isLoadingFromJson) return;
    this.visibleChoicesCache = null;
    this.fireCallback(this.choicesChangedCallback);
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
      if (a.text < b.text) return -1 * mult;
      if (a.text > b.text) return 1 * mult;
      return 0;
    });
  }
  private randomizeArray(array: Array<ItemValue>): Array<ItemValue> {
    return Helpers.randomizeArray<ItemValue>(array);
  }
  clearUnusedValues() {
    super.clearUnusedValues();
    if (!this.isOtherSelected && !this.hasComment) {
      this.comment = null;
    }
  }
}
/**
 * A base class for checkbox and radiogroup questions. It introduced a colCount property.
 */
export class QuestionCheckboxBase extends QuestionSelectBase {
  private colCountValue: number = 1;
  colCountChangedCallback: () => void;
  constructor(public name: string) {
    super(name);
  }
  /**
   * The number of columns for radiogroup and checkbox questions. Items are rendred in one line if the value is 0.
   */
  public get colCount(): number {
    return this.colCountValue;
  }
  public set colCount(value: number) {
    if (value < 0 || value > 5) return;
    this.colCountValue = value;
    this.fireCallback(this.colCountChangedCallback);
  }
}
JsonObject.metaData.addClass(
  "selectbase",
  [
    "hasComment:boolean",
    "hasOther:boolean",
    {
      name: "choices:itemvalues",
      onGetValue: function(obj: any) {
        return ItemValue.getData(obj.choices);
      },
      onSetValue: function(obj: any, value: any) {
        obj.choices = value;
      }
    },
    {
      name: "choicesOrder",
      default: "none",
      choices: ["none", "asc", "desc", "random"]
    },
    {
      name: "choicesByUrl:restfull",
      className: "ChoicesRestfull",
      onGetValue: function(obj: any) {
        return obj.choicesByUrl.getData();
      },
      onSetValue: function(obj: any, value: any) {
        obj.choicesByUrl.setData(value);
      }
    },
    { name: "otherText", serializationProperty: "locOtherText" },
    { name: "otherErrorText", serializationProperty: "locOtherErrorText" },
    { name: "storeOthersAsComment:boolean", default: true }
  ],
  null,
  "question"
);

JsonObject.metaData.addClass(
  "checkboxbase",
  [{ name: "colCount:number", default: 1, choices: [0, 1, 2, 3, 4, 5] }],
  null,
  "selectbase"
);
