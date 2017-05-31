import {JsonObject} from "./jsonobject";
import {Question} from "./question";
import {SurveyError} from "./base";
import {ItemValue} from "./itemvalue";
import {surveyLocalization} from "./surveyStrings";
import {CustomError} from "./error";
import {ChoicesRestfull} from "./choicesRestfull";
import {LocalizableString} from "./localizablestring";

/**
 * It is a base class for checkbox, dropdown and radiogroup questions.
 */
export class QuestionSelectBase extends Question {
    private visibleChoicesCache: Array<ItemValue> = null;
    private commentValue: string;
    private otherItemValue: ItemValue = new ItemValue("other", surveyLocalization.getString("otherItemText"));
    private locOtherTextValue: LocalizableString;
    private locOtherErrorTextValue: LocalizableString;
    protected cachedValue: any;
    private choicesFromUrl: Array<ItemValue> = null;
    private cachedValueForUrlRequestion: any = null;
    private choicesValues: Array<ItemValue>;
    /**
     * Use this property to fill the choices from a restful service.
     * @see choices
     */
    public choicesByUrl: ChoicesRestfull;
    /**
     * By default the entered text in the others input in the checkbox/radiogroup/dropdown are stored as "question name " + "-Comment". The value itself is "question name": "others". Set this property to false, to store the entered text directly in the "question name" key.
     * @see SurveyModel.storeOthersAsComment
     */
    public storeOthersAsComment: boolean = true;
    private choicesOrderValue: string = "none";
    choicesChangedCallback: () => void;
    constructor(name: string) {
        super(name);
        this.choicesValues = ItemValue.createArray(this);
        this.choicesByUrl = this.createRestfull();
        this.locOtherTextValue = new LocalizableString(this, true);
        this.locOtherErrorTextValue = new LocalizableString(this, true);
        this.otherItemValue.locOwner = this;
        var self = this;
        this.choicesByUrl.getResultCallback = function (items: Array<ItemValue>) { self.onLoadChoicesFromUrl(items) };
    }
    /**
     * Returns the other item. By using this property, you may change programmatically it's value and text.
     */
    public get otherItem(): ItemValue {
        this.otherItemValue.text = this.otherText ? this.otherText : surveyLocalization.getString("otherItemText");
        return this.otherItemValue;
    }
    /**
     * Returns true if a user select the 'other' item.
     */
    public get isOtherSelected(): boolean {
        return this.getStoreOthersAsComment() ? this.getHasOther(this.value) : this.getHasOther(this.cachedValue);
    }
    protected getHasOther(val: any): boolean {
        return val == this.otherItem.value;
    }
    protected createRestfull(): ChoicesRestfull { return new ChoicesRestfull(); }
    protected getComment(): string {
        if (this.getStoreOthersAsComment()) return super.getComment();
        return this.commentValue;
    }
    private isSettingComment: boolean = false;
    protected setComment(newValue: string) {
        if (this.getStoreOthersAsComment())
            super.setComment(newValue);
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
        if (newValue) this.cachedValueForUrlRequestion = newValue;
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
    public get choices(): Array<any> { return this.choicesValues; }
    public set choices(newValue: Array<any>) {
        ItemValue.setData(this.choicesValues, newValue);
        this.onVisibleChoicesChanged();
    }
    protected hasOtherChanged() {
        this.onVisibleChoicesChanged();
    }
    /**
     * Use this property to render items in a specific order.
     */
    public get choicesOrder(): string { return this.choicesOrderValue; }
    public set choicesOrder(newValue: string) {
        newValue = newValue.toLowerCase();
        if (newValue == this.choicesOrderValue) return;
        this.choicesOrderValue = newValue;
        this.onVisibleChoicesChanged();
    }
    /**
     * Use this property to set the different text for other item.
     */
    public get otherText(): string { return this.locOtherText.text; }
    public set otherText(value: string) {
        this.locOtherText.text = value;
        this.onVisibleChoicesChanged();
    }
    /**
     * The text that shows when the other item is choosed by the other input is empty.
     */
    public get otherErrorText(): string { return this.locOtherErrorText.text; }
    public set otherErrorText(value: string) { this.locOtherErrorText.text = value;  }
    get locOtherText(): LocalizableString { return this.locOtherTextValue; }
    get locOtherErrorText(): LocalizableString { return this.locOtherErrorTextValue; }

    /**
     * The list of items as they will be rendered. If needed items are sorted and the other item is added.
     * @see hasOther
     * @see choicesOrder
     */
    public get visibleChoices(): Array<ItemValue> {
        if (!this.hasOther && this.choicesOrder == "none") return this.activeChoices;
        if(!this.visibleChoicesCache) {
            this.visibleChoicesCache = this.sortVisibleChoices(this.activeChoices.slice());
            if (this.hasOther) {
                this.visibleChoicesCache.push(this.otherItem);
            }
        }
        return this.visibleChoicesCache;
    }
    private get activeChoices(): Array<ItemValue> { return this.choicesFromUrl ? this.choicesFromUrl : this.choices; }
    public supportComment(): boolean { return true; }
    public supportOther(): boolean { return true; }
    protected onCheckForErrors(errors: Array<SurveyError>) {
        super.onCheckForErrors(errors);
        if (!this.isOtherSelected || this.comment) return;
        var text = this.otherErrorText;
        if (!text) {
            text = surveyLocalization.getString("otherRequiredError");
        }
        errors.push(new CustomError(text));
    }
    public onLocaleChanged() {
        super.onLocaleChanged();
        this.onVisibleChoicesChanged();
        ItemValue.NotifyArrayOnLocaleChanged(this.visibleChoices);
    }
    protected getStoreOthersAsComment() { return this.storeOthersAsComment && (this.survey != null ? this.survey.storeOthersAsComment : true); }
    onSurveyLoad() {
        super.onSurveyLoad();
        this.runChoicesByUrl();
        this.onVisibleChoicesChanged();
    }
    onAnyValueChanged(){
        this.runChoicesByUrl();
    }
    private runChoicesByUrl() {
        if (this.choicesByUrl) this.choicesByUrl.run(this.survey);
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
        if (array && array.length > 0) {
            newChoices = new Array<ItemValue>();
            ItemValue.setData(newChoices, array);
        }
        this.choicesFromUrl = newChoices;
        this.onVisibleChoicesChanged();
        if (this.cachedValueForUrlRequestion) {
            this.value = this.cachedValueForUrlRequestion;
        }
    }
    private onVisibleChoicesChanged() {
        if(this.isLoadingFromJson) return;
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
        return array.sort(function (a, b) {
            if (a.text < b.text) return -1 * mult;
            if (a.text > b.text) return 1 * mult;
            return 0;
        });
    }
    private randomizeArray(array: Array<ItemValue>): Array<ItemValue> {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    clearUnusedValues() {
        super.clearUnusedValues();
        if(!this.isOtherSelected && !this.hasComment) {
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
    public get colCount(): number { return this.colCountValue; }
    public set colCount(value: number) {
        if (value < 0 || value > 4) return;
        this.colCountValue = value;
        this.fireCallback(this.colCountChangedCallback);
    }
}
JsonObject.metaData.addClass("selectbase", ["hasComment:boolean", "hasOther:boolean",
    { name: "choices:itemvalues", onGetValue: function (obj: any) { return ItemValue.getData(obj.choices); }, onSetValue: function (obj: any, value: any) { obj.choices = value; }},
    { name: "choicesOrder", default: "none", choices: ["none", "asc", "desc", "random"] },
    { name: "choicesByUrl:restfull", className: "ChoicesRestfull", onGetValue: function (obj: any) { return obj.choicesByUrl.isEmpty ? null : obj.choicesByUrl; }, onSetValue: function (obj: any, value: any) { obj.choicesByUrl.setData(value); } },
    { name: "otherText", serializationProperty: "locOtherText" }, {name: "otherErrorText", serializationProperty: "locOtherErrorText"},
    { name: "storeOthersAsComment:boolean", default: true}], null, "question");

JsonObject.metaData.addClass("checkboxbase", [{ name: "colCount:number", default: 1, choices: [0, 1, 2, 3, 4] }], null, "selectbase");
