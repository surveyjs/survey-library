import {Base} from "./base";
import {SurveyValidator, IValidatorOwner, ValidatorRunner} from "./validator";
import {Question} from "./question";
import {JsonObject} from "./jsonobject";
import {QuestionFactory} from "./questionfactory";
import {SurveyError} from "./base";
import {AnswerRequiredError} from "./error";
import {ILocalizableOwner, LocalizableString} from "./localizablestring";

export interface IMultipleTextData {
    getMultipleTextValue(name: string): any;
    setMultipleTextValue(name: string, value: any);
    getIsRequiredText(): string;
    getLocale(): string;
    getMarkdownHtml(text: string): string;
}

export class MultipleTextItemModel extends Base implements IValidatorOwner, ILocalizableOwner {
    private static itemCounter = 100;
    private static getItemId(): string {
        return "sp_" + MultipleTextItemModel.itemCounter++;
    }
    private data: IMultipleTextData;
    private idValue: string = MultipleTextItemModel.getItemId();

    valueChangedCallback: (newValue: any)=>void;
    validators: Array<SurveyValidator> = new Array<SurveyValidator>();

    constructor(name: any = null, title: string = null) {
        super();
        var self = this;
        this.name = name;
        var locTitleValue = this.createLocalizableString("title", this, true);
        locTitleValue.onRenderedHtmlCallback = function(text) {return self.getFullTitle(text); };
        this.title = title;
        this.createLocalizableString("placeHolder", this);
    }
    public getType(): string {
        return "multipletextitem";
    }
    public get id(): string { return this.idValue; }
    /**
     * The item name. 
     */
    public get name(): string { return this.getPropertyValue("name"); }
    public set name(val: string) {
        this.setPropertyValue("name", val);
        if(this.locTitle) {
            this.locTitle.onChanged();
        }
    }
    setData(data: IMultipleTextData) {
        this.data = data;
    }
    /** 
     * Set this property to true, to make the item a required. If a user doesn't fill the item then a validation error will be generated.
     */
    public get isRequired(): boolean { return this.getPropertyValue("isRequired", false); }
    public set isRequired(val: boolean) { this.setPropertyValue("isRequired", val); }
    /**
     * Use this property to change the default input type.
     */
    public get inputType(): string { return this.getPropertyValue("inputType", "text"); }
    public set inputType(val: string) {
      this.setPropertyValue("inputType", val.toLowerCase());
    }
    /**
     * Item title. If it is empty, the item name is rendered as title. This property supports markdown.
     * @see name
     */
    public get title() { return this.getLocalizableStringText("title", this.name); }
    public set title(val: string) { this.setLocalizableStringText("title", val); }
    get locTitle() { return this.getLocalizableString("title"); }
    /**
     * Returns the text or html for rendering the title.
     */
    public get fullTitle(): string { return this.getFullTitle(this.locTitle.textOrHtml); }
    protected getFullTitle(str: string): string {
        if(!str) str = this.name;
        if(this.isRequired && this.data) str = this.data.getIsRequiredText() + ' ' + str;
        return str;
    }
    /**
     * The input place holder.
     */
    public get placeHolder(): string { return this.getLocalizableStringText("placeHolder"); }
    public set placeHolder(val: string) { this.setLocalizableStringText("placeHolder", val); }
    get locPlaceHolder(): LocalizableString { return this.getLocalizableString("placeHolder"); }
    /** 
     * The item value.
     */
    public get value() {
        return this.data ? this.data.getMultipleTextValue(this.name) : null;
    }
    public set value(value: any) {
        if (this.data != null) {
            this.data.setMultipleTextValue(this.name, value);
        }
    }
    public onValueChanged(newValue: any) {
        if(this.valueChangedCallback) this.valueChangedCallback(newValue);
    }
    //IValidatorOwner
    getValidatorTitle(): string { return this.title; }
    //ILocalizableOwner
    getLocale() { return this.data ? this.data.getLocale() : "";}
    getMarkdownHtml(text: string)  { return this.data ? this.data.getMarkdownHtml(text) : null; }
}

/**
 * A Model for a multiple text question.
 */
export class QuestionMultipleTextModel extends Question implements IMultipleTextData {
    colCountChangedCallback: () => void;
    private itemsValues: Array<MultipleTextItemModel> = new Array<MultipleTextItemModel>();
    constructor(public name: string) {
        super(name);
        var self = this;
        this.itemsValues = this.createNewArray("items", function(item) { item.setData(self); });
        this.registerFunctionOnPropertyValueChanged("items", function() {self.fireCallback(self.colCountChangedCallback);});
        this.registerFunctionOnPropertyValueChanged("colCount", function() {self.fireCallback(self.colCountChangedCallback);});
    }
    public getType(): string {
        return "multipletext";
    }
    endLoadingFromJson() {
        super.endLoadingFromJson();
        this.fireCallback(this.colCountChangedCallback);
    }
    /**
     * The list of input items.
     */
    public get items(): Array<MultipleTextItemModel> { return this.itemsValues; }
    public set items(val: Array<MultipleTextItemModel>) { this.setPropertyValue("items", val); }
    /**
     * Add a new text item.
     * @param name a item name
     * @param title a item title (optional)
     */
    public addItem(name: string, title: string = null): MultipleTextItemModel {
        var item = this.createTextItem(name, title);
        this.items.push(item);
        return item;
    }
    public onLocaleChanged() {
        super.onLocaleChanged();
        for(var i = 0; i < this.items.length; i ++) {
            this.items[i].onLocaleChanged();
        }
    }
    supportGoNextPageAutomatic() {
        for (var i = 0; i < this.items.length; i++) {
            if (!this.items[i].value) return false;
        }
        return true;
    }
    /**
     * The number of columns. Items are rendred in one line if the value is 0.
     */
    public get colCount(): number { return this.getPropertyValue("colCount", 1); }
    public set colCount(val: number) {
        if (val < 1 || val > 4) return;
        this.setPropertyValue("colCount", val);
    }
    /**
     * The default text input size.
     */
    public get itemSize(): number { return this.getPropertyValue("itemSize", 25) } 
    public set itemSize(val: number) { this.setPropertyValue("itemSize", val); } 
    /**
     * Returns the list of rendered rows.
     */
    public getRows(): Array<any> {
        var colCount = this.colCount;
        var items = this.items;
        var rows = [];
        var index = 0;
        for (var i = 0; i < items.length; i++) {
            if (index == 0) {
                rows.push([]);
            }
            rows[rows.length - 1].push(items[i]);
            index++;
            if (index >= colCount) {
                index = 0;
            }
        }
        return rows;
    }
    private isMultipleItemValueChanging = false;
    protected onValueChanged() {
        super.onValueChanged();
        this.onItemValueChanged();
    }
    protected createTextItem(name: string, title: string): MultipleTextItemModel {
        return new MultipleTextItemModel(name, title);
    }
    protected onItemValueChanged() {
        if (this.isMultipleItemValueChanging) return;
        for (var i = 0; i < this.items.length; i++) {
            var itemValue = null;
            if (this.value && (this.items[i].name in this.value)) {
                itemValue = this.value[this.items[i].name];
            }
            this.items[i].onValueChanged(itemValue);
        }
    }
    protected runValidators(): SurveyError {
        var error = super.runValidators();
        if (error != null) return error;
        for (var i = 0; i < this.items.length; i++) {
            error = new ValidatorRunner().run(this.items[i]);
            if (error != null) return error;
        }
        return null;
    }
    protected onCheckForErrors(errors: Array<SurveyError>) {
        super.onCheckForErrors(errors);
        for(var i = 0; i < this.items.length; i ++) {
            var item = this.items[i];
            if(item.isRequired && !item.value) {
                errors.push(new AnswerRequiredError());
            }
        }
    }
    //IMultipleTextData
    getMultipleTextValue(name: string) {
        if (!this.value) return null;
        return this.value[name];
    }
    setMultipleTextValue(name: string, value: any) {
        this.isMultipleItemValueChanging = true;
        var newValue = this.value;
        if (!newValue) {
            newValue = {};
        }
        newValue[name] = value;
        this.setNewValue(newValue);
        this.isMultipleItemValueChanging = false;
    }
    getIsRequiredText(): string {
        return this.survey ? this.survey.requiredText : "";
    }
}

JsonObject.metaData.addClass("multipletextitem", ["name", "isRequired:boolean", { name: "placeHolder", serializationProperty: "locPlaceHolder"},
    { name: "inputType", default: "text", choices: ["color", "date", "datetime", "datetime-local", "email", "month", "number", "password", "range", "tel", "text", "time", "url", "week"] },
    { name: "title", serializationProperty: "locTitle" }, { name: "validators:validators", baseClassName: "surveyvalidator", classNamePart: "validator" }],
    function () { return new MultipleTextItemModel(""); });

JsonObject.metaData.addClass("multipletext", [{ name: "!items:textitems", className: "multipletextitem" },
        { name: "itemSize:number", default: 25 }, { name: "colCount:number", default: 1, choices: [1, 2, 3, 4] }],
    function () { return new QuestionMultipleTextModel(""); }, "question");

QuestionFactory.Instance.registerQuestion("multipletext", (name) => { var q = new QuestionMultipleTextModel(name); q.addItem("text1"); q.addItem("text2"); return q; });
