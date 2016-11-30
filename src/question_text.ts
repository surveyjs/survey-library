import {QuestionFactory} from "./questionfactory";
import {JsonObject} from "./jsonobject";
import {Question} from "./question";

export class QuestionTextModel extends Question {
    public size: number = 25;
    public inputType: string = "text";
    constructor(public name: string) {
        super(name);
    }
    public getType(): string {
        return "text";
    }
    isEmpty(): boolean {  return super.isEmpty() || this.value == ""; }
    supportGoNextPageAutomatic() { return true; }
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

JsonObject.metaData.addClass("text", [{ name: "inputType", default: "text", choices: ["color", "date", "datetime", "datetime-local", "email", "month", "password", "range", "tel", "text", "time", "url", "week"] },
    { name: "size:number", default: 25 }], function () { return new QuestionTextModel(""); }, "question");

QuestionFactory.Instance.registerQuestion("text", (name) => { return new QuestionTextModel(name); });