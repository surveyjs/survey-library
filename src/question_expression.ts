import {HashTable} from "./helpers";
import {Question} from "./question";
import {JsonObject} from "./jsonobject";
import {QuestionFactory} from "./questionfactory";
import {LocalizableString} from "./localizablestring";
import {ExpressionRunner} from './conditions';

/**
 * A Model for expression question. It is a read-only question. It calculates value based on epxression property.
 */
export class QuestionExpressionModel extends Question {
    private expressionIsRunning: boolean;
    private expressionRunner: ExpressionRunner;
    constructor(public name: string) {
        super(name);
        this.createLocalizableString("format", this);
        var self = this;
        this.registerFunctionOnPropertyValueChanged("expression", 
            function() { 
                if(self.expressionRunner) { 
                    self.expressionRunner = new ExpressionRunner(self.expression);
                } 
            }
        );
    }
    public getType(): string {  return "expression";  }
    public get format(): string { return this.getLocalizableStringText("format", ""); }
    public set format(val: string) { this.setLocalizableStringText("format", val); }
    get locFormat(): LocalizableString { return this.getLocalizableString("format"); }
    public get expression(): string { return this.getPropertyValue("expression", ""); }
    public set expression(val: string) { this.setPropertyValue("expression", val); }
    public runCondition(values: HashTable<any>) {
        super.runCondition(values);
        if(!this.expression || this.expressionIsRunning) return;
        this.expressionIsRunning = true;
        if (!this.expressionRunner) this.expressionRunner = new ExpressionRunner(this.expression);
        this.value = this.expressionRunner.run(values);
        this.expressionIsRunning = false;
    }
    public get displayValue(): any {
        var val = this.isValueEmpty(this.value) ? this.defaultValue : this.value;
        if(this.isValueEmpty(val)) return "";
        var str = this.getValueAsStr(val);
        if(!this.format) return str;
        return this.format["format"](str);
    }
    public get displayStyle(): string { return this.getPropertyValue("displayStyle", "none"); }
    public set displayStyle(val: string) {this.setPropertyValue("displayStyle", val);}
    public get currency(): string { return this.getPropertyValue("currency", ""); }
    public set currency(val: string) { this.setPropertyValue("currency", val); }
    public get useGrouping(): boolean { return this.getPropertyValue("useGrouping", true); }
    public set useGrouping(val: boolean) { this.setPropertyValue("useGrouping", val); }
    protected getValueAsStr(val: any): string {
        if(this.displayStyle != "none" && !isNaN(parseFloat(val)) && isFinite(val)) {
            var locale = this.getLocale();
            if(!locale) locale = "en";
            var options = {style: this.displayStyle, currency: this.currency, useGrouping: this.useGrouping};
            if(!options.currency) options.currency = "USD";
            return val.toLocaleString(locale, options);
        }
        return val.toString();
    }
}
JsonObject.metaData.addClass("expression", ["expression:expression", {name:"format", serializationProperty: "locFormat"},
    {name: "displayStyle", default: "decimal", choices: ["none", "decimal", "currency", "percent"]},
    {name: "currency"}, {name: "useGrouping:boolean", default: true}], function () { return new QuestionExpressionModel(""); }, "question");
QuestionFactory.Instance.registerQuestion("expression", (name) => { return new QuestionExpressionModel(name); });