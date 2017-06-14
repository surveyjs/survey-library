import {QuestionFactory} from "./questionfactory";
import {JsonObject} from "./jsonobject";
import {Question} from "./question";
import {LocalizableString} from "./localizablestring";

/**
 * A Model for an input text question.
 */
export class QuestionTextModel extends Question {
    /**
     * The text input size
     */
    public size: number = 25;
    private inputTypeValue: string = "text";
    private locPlaceHolderValue: LocalizableString;
    constructor(public name: string) {
        super(name);
        this.locPlaceHolderValue = new LocalizableString(this);
    }
    public getType(): string {
        return "text";
    }
    /**
     * Use this property to change the default input type.
     */
    public get inputType(): string { return this.inputTypeValue; }
    public set inputType(type: string) {
      var value = type.toLowerCase();
      this.inputTypeValue = (value === "datetime_local") ? "datetime-local" : value;
    }
    isEmpty(): boolean {  return super.isEmpty() || this.value === ""; }
    supportGoNextPageAutomatic() { return true; }
    /**
     * The input place holder.
     */
    public get placeHolder(): string { return this.locPlaceHolder.text; }
    public set placeHolder(value: string) { this.locPlaceHolder.text = value; }
    get locPlaceHolder(): LocalizableString {return this.locPlaceHolderValue; }
    protected setNewValue(newValue: any) {
        newValue = this.correctValueType(newValue);
        super.setNewValue(newValue);
    }
    protected correctValueType(newValue: any): any {
        if (!newValue) return newValue;
        if (this.inputType == "number" || this.inputType == "range") {
            return this.isNumber(newValue) ? parseFloat(newValue) : "";
        }
        return newValue;
    }
    private isNumber(value): boolean {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
}

JsonObject.metaData.addClass("text", [{ name: "inputType", default: "text", choices: ["color", "date", "datetime", "datetime-local", "email", "month", "number", "password", "range", "tel", "text", "time", "url", "week"] },
    { name: "size:number", default: 25 }, {name: "placeHolder", serializationProperty: "locPlaceHolder"}], function () { return new QuestionTextModel(""); }, "question");

QuestionFactory.Instance.registerQuestion("text", (name) => { return new QuestionTextModel(name); });
