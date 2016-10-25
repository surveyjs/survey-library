import {QuestionFactory} from "./questionfactory";
import {JsonObject} from "./jsonobject";
import {Question} from "./question";

export class QuestionTextModel extends Question {
    public size: number = 25;
    constructor(public name: string) {
        super(name);
    }
    public getType(): string {
        return "text";
    }
    isEmpty(): boolean {  return super.isEmpty() || this.value == ""; }
    supportGoNextPageAutomatic() { return true; }
}

JsonObject.metaData.addClass("text", [{ name: "size:number", default: 25 }], function () { return new QuestionTextModel(""); }, "question");

QuestionFactory.Instance.registerQuestion("text", (name) => { return new QuestionTextModel(name); });