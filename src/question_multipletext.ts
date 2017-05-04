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
    private data: IMultipleTextData;
    private locTitleValue: LocalizableString;
    private locPlaceHolderValue: LocalizableString;
    public isRequired: boolean = false;
    private inputTypeValue: string = "text";
    validators: Array<SurveyValidator> = new Array<SurveyValidator>();

    constructor(public name: any = null, title: string = null) {
        super();
        this.locTitleValue = new LocalizableString(this, true);
        var self = this;
        this.locTitleValue.onRenderedHtmlCallback = function(text) {return self.getFullTitle(text); };
        this.title = title;
        this.locPlaceHolderValue = new LocalizableString(this);
    }
    public getType(): string {
        return "multipletextitem";
    }
    setData(data: IMultipleTextData) {
        this.data = data;
    }

    public get inputType(): string { return this.inputTypeValue; }
    public set inputType(newValue: string) {
      this.inputTypeValue = newValue.toLowerCase();
    }
    public get title() { return this.locTitle.text ? this.locTitle.text : this.name; }
    public set title(value: string) { this.locTitle.text = value; }
    public get locTitle() { return this.locTitleValue; }
    public get fullTitle(): string { return this.getFullTitle(this.locTitle.textOrHtml); }
    protected getFullTitle(str: string): string {
        if(!str) str = this.name;
        if(this.isRequired && this.data) str = this.data.getIsRequiredText() + ' ' + str;
        return str;
    }
    public get placeHolder(): string { return this.locPlaceHolder.text; }
    public set placeHolder(value: string) { this.locPlaceHolder.text = value; }
    public get locPlaceHolder(): LocalizableString { return this.locPlaceHolderValue; }
    public onLocaleChanged() {
        this.locTitle.onChanged();
    }
    public get value() {
        return this.data ? this.data.getMultipleTextValue(this.name) : null;
    }
    public set value(value: any) {
        if (this.data != null) {
            this.data.setMultipleTextValue(this.name, value);
        }
    }
    public onValueChanged(newValue: any) {
    }
    //IValidatorOwner
    public getValidatorTitle(): string { return this.title; }
    //ILocalizableOwner
    public getLocale() { return this.data ? this.data.getLocale() : "";}
    public getMarkdownHtml(text: string)  { return this.data ? this.data.getMarkdownHtml(text) : null; }
}

export class QuestionMultipleTextModel extends Question implements IMultipleTextData {
    private colCountValue: number = 1;
    colCountChangedCallback: () => void;
    public itemSize: number = 25;
    private itemsValues: Array<MultipleTextItemModel> = new Array<MultipleTextItemModel>();
    constructor(public name: string) {
        super(name);
        this.setItemsOverriddenMethods();
    }
    public getType(): string {
        return "multipletext";
    }
    public get items(): Array<MultipleTextItemModel> { return this.itemsValues; }
    public set items(value: Array<MultipleTextItemModel>) {
        this.itemsValues = value;
        this.setItemsOverriddenMethods();
        this.fireCallback(this.colCountChangedCallback);
    }
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
    private setItemsOverriddenMethods() {
        var self = this;
        this.itemsValues.push = function (value) {
            value.setData(self);
            var result = Array.prototype.push.call(this, value);
            self.fireCallback(self.colCountChangedCallback);
            return result;
        };
        this.itemsValues.splice = function (start?: number, deleteCount?: number, ...items: MultipleTextItemModel[]): MultipleTextItemModel[] {
            if(!start) start = 0;
            if(!deleteCount) deleteCount = 0;
            var result = Array.prototype.splice.call(self.itemsValues, start, deleteCount, ... items);
            if(!items) items = [];
            for(var i = 0; i < items.length; i ++) {
                items[i].setData(self);
            }
            self.fireCallback(self.colCountChangedCallback);
            return result;
        };
    }
    supportGoNextPageAutomatic() {
        for (var i = 0; i < this.items.length; i++) {
            if (!this.items[i].value) return false;
        }
        return true;
    }
    public get colCount(): number { return this.colCountValue; }
    public set colCount(value: number) {
        if (value < 1 || value > 4) return;
        this.colCountValue = value;
        this.fireCallback(this.colCountChangedCallback);
    }
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
    public hasErrors(fireCallback: boolean = true): boolean {
        var res = super.hasErrors(fireCallback);
        if(!res) res = this.hasErrorInItems(fireCallback);
        return res;
    }
    protected hasErrorInItems(fireCallback: boolean): boolean {
        for(var i = 0; i < this.items.length; i ++) {
            var item = this.items[i];
            if(item.isRequired && !item.value) {
                this.errors.push(new AnswerRequiredError());
                if(fireCallback) {
                    this.fireCallback(this.errorsChangedCallback);
                }
                return true;
            }
        }
        return false;
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
