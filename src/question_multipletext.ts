import {Base} from "./base";
import {SurveyValidator, IValidatorOwner, ValidatorRunner} from "./validator";
import {Question} from "./question";
import {JsonObject} from "./jsonobject";
import {QuestionFactory} from "./questionfactory";
import {SurveyError} from "./base";

export interface IMultipleTextData {
    getMultipleTextValue(name: string): any;
    setMultipleTextValue(name: string, value: any);
}

export class MultipleTextItemModel extends Base implements IValidatorOwner {
    private data: IMultipleTextData;
    private titleValue: string;
    public placeHolder: string;
    validators: Array<SurveyValidator> = new Array<SurveyValidator>();

    constructor(public name: any = null, title: string = null) {
        super();
        this.title = title;
    }
    public getType(): string {
        return "multipletextitem";
    }
    setData(data: IMultipleTextData) {
        this.data = data;
    }
    public get title() { return this.titleValue ? this.titleValue : this.name; }
    public set title(newText: string) { this.titleValue = newText; }
    public get value() {
        return this.data ? this.data.getMultipleTextValue(this.name) : null;
    }
    public set value(value: any) {
        if (this.data != null) {
            this.data.setMultipleTextValue(this.name, value);
        }
    }
    onValueChanged(newValue: any) {
    }
    //IValidatorOwner
    getValidatorTitle(): string { return this.title; }
}

export class QuestionMultipleTextModel extends Question implements IMultipleTextData {
    private colCountValue: number = 1;
    colCountChangedCallback: () => void;
    public itemSize: number = 25;
    private itemsValues: Array<MultipleTextItemModel> = new Array<MultipleTextItemModel>();
    constructor(public name: string) {
        super(name);
        var self = this;
        this.items.push = function (value) {
            value.setData(self);
            var result = Array.prototype.push.call(this, value);
            self.fireCallback(self.colCountChangedCallback);
            return result;
        };
    }
    public getType(): string {
        return "multipletext";
    }
    public get items(): Array<MultipleTextItemModel> { return this.itemsValues; }
    public set items(value: Array<MultipleTextItemModel>) {
        this.itemsValues = value;
        this.fireCallback(this.colCountChangedCallback);
    }
    public addItem(name: string, title: string = null): MultipleTextItemModel {
        var item = this.createTextItem(name, title);
        this.items.push(item);
        return item;
    }
    //TODO-remove later. Delay removing in case somebody use this function.
    private AddItem(name: string, title: string = null): MultipleTextItemModel { return this.addItem(name, title); }
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
}

JsonObject.metaData.addClass("multipletextitem", ["name", "placeHolder", { name: "title", onGetValue: function (obj: any) { return obj.titleValue; } },
    { name: "validators:validators", baseClassName: "surveyvalidator", classNamePart: "validator" }], function () { return new MultipleTextItemModel(""); });

JsonObject.metaData.addClass("multipletext", [{ name: "!items:textitems", className: "multipletextitem" },
        { name: "itemSize:number", default: 25 }, { name: "colCount:number", default: 1, choices: [1, 2, 3, 4] }],
    function () { return new QuestionMultipleTextModel(""); }, "question");

QuestionFactory.Instance.registerQuestion("multipletext", (name) => { var q = new QuestionMultipleTextModel(name); q.addItem("text1"); q.addItem("text2"); return q; });