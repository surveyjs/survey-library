import {JsonObject} from "./jsonobject";
import {Question} from "./question";
import {ItemValue, SurveyError} from "./base";
import {surveyLocalization} from "./surveyStrings";
import {CustomError} from "./error";
import {ChoicesRestfull} from "./choicesRestfull";

export class QuestionSelectBase extends Question {
    private visibleChoicesCache: Array<ItemValue> = null;
    private commentValue: string;
    protected cachedValue: any;
    otherItem: ItemValue = new ItemValue("other", surveyLocalization.getString("otherItemText"));
    private choicesFromUrl: Array<ItemValue> = null;
    private choicesValues: Array<ItemValue> = new Array<ItemValue>();
    public choicesByUrl: ChoicesRestfull;
    public otherErrorText: string = null;
    public storeOthersAsComment: boolean = true;
    choicesOrderValue: string = "none";
    choicesChangedCallback: () => void;
    constructor(name: string) {
        super(name);
        this.choicesByUrl = this.createRestfull();
        var self = this;
        this.choicesByUrl.getResultCallback = function (items: Array<ItemValue>) { self.onLoadChoicesFromUrl(items) };
    }
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
    get choices(): Array<any> { return this.choicesValues; }
    set choices(newValue: Array<any>) {
        ItemValue.setData(this.choicesValues, newValue);
        this.onVisibleChoicesChanged();
    }
    protected hasOtherChanged() {
        this.onVisibleChoicesChanged();
    }
    get choicesOrder(): string { return this.choicesOrderValue; }
    set choicesOrder(newValue: string) {
        if (newValue == this.choicesOrderValue) return;
        this.choicesOrderValue = newValue;
        this.onVisibleChoicesChanged();
    }
    get otherText(): string { return this.otherItem.text; }
    set otherText(value: string) { this.otherItem.text = value; }
    get visibleChoices(): Array<ItemValue> {
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
    protected getStoreOthersAsComment() { return this.storeOthersAsComment && (this.survey != null ? this.survey.storeOthersAsComment : true); }
    onSurveyLoad() {
        if (this.choicesByUrl) this.choicesByUrl.run();
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
    }
    private onVisibleChoicesChanged() {
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
}

export class QuestionCheckboxBase extends QuestionSelectBase {
    private colCountValue: number = 1;
    colCountChangedCallback: () => void;
    constructor(public name: string) {
        super(name);
    }
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
    { name: "otherText", default: surveyLocalization.getString("otherItemText") }, "otherErrorText",
    { name: "storeOthersAsComment:boolean", default: true}], null, "question");

JsonObject.metaData.addClass("checkboxbase", [{ name: "colCount:number", default: 1, choices: [0, 1, 2, 3, 4] }], null, "selectbase");