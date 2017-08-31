import {Base} from "./base";
import {QuestionFactory} from "./questionfactory";
import {JsonObject} from "./jsonobject";
import {Question} from "./question";
import {LocalizableString} from "./localizablestring";

/**
 * A Model for a boolean question.
 */
export class QuestionBooleanModel extends Question {
    private locCheckCaptionValue: LocalizableString;
    
    constructor(public name: string) {
        super(name);
        this.locCheckCaptionValue = new LocalizableString(this, true);
    }
    public getType(): string {
        return "boolean";
    }
    public get isIndeterminate(): boolean { return this.isEmpty(); }
    public get hasTitle(): boolean { return this.showTitle; }
    supportGoNextPageAutomatic() { return true; }
    protected onSetData() {
        super.onSetData();
        this.updateValueWithDefaults();
    }
    public get checkedValue() : any {
        if(this.isEmpty()) return null;
        return this.value == this.getValueTrue();
    }
    public set checkedValue(val: any) {
        if(Base.isValueEmpty(val)) {
            this.value = null;
        } else {
            this.value = val == true ? this.getValueTrue() : this.getValueFalse();
        }
    }
    public get defaultValue(): string { return this.getPropertyValue("defaultValue", "indeterminate");}
    public set defaultValue(val: string) {
        this.setPropertyValue("defaultValue", val);
        this.updateValueWithDefaults();
    }
    public get checkCaption(): string { return this.locCheckCaption.text ? this.locCheckCaption.text : ""; }
    public set checkCaption(newValue:  string) { this.locCheckCaption.text = newValue; }
    get locCheckCaption(): LocalizableString { return this.locCheckCaptionValue; }
    get locDisplayCheckCaption(): LocalizableString { 
        if(this.locCheckCaption.text) return this.locCheckCaption;
        return this.showTitle ? this.locCheckCaption : this.locTitle;
     }
    public get showTitle(): boolean { return this.getPropertyValue("showTitle"); }
    public set showTitle(val: boolean) { this.setPropertyValue("showTitle", val); }
    public get valueTrue(): any { return this.getPropertyValue("valueTrue");}
    public set valueTrue(val: any) { this.setPropertyValue("valueTrue", val);}
    public get valueFalse(): any { return this.getPropertyValue("valueFalse");}
    public set valueFalse(val: any) { this.setPropertyValue("valueFalse", val);}
    private getValueTrue(): any { return this.valueTrue ? this.valueTrue : true; }
    private getValueFalse(): any { return this.valueFalse ? this.valueFalse : false; }
    private updateValueWithDefaults() {
        if(!this.isEmpty()) return;
        if(this.defaultValue == "true") this.value = this.getValueTrue();
        else if(this.defaultValue == "false") this.value = this.getValueFalse();
    }
}

JsonObject.metaData.addClass("boolean", [{ name: "defaultValue", default: "indeterminate", choices: ["indeterminate", "false", "true"] },
    { name: "checkCaption:text", serializationProperty: "locCheckCaption" }, 
    "showTitle:boolean", "valueTrue", "valueFalse"], function () { return new QuestionBooleanModel(""); }, "question");

QuestionFactory.Instance.registerQuestion("boolean", (name) => { return new QuestionBooleanModel(name); });
