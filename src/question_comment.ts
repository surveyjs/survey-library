import {Question} from "./question";
import {JsonObject} from "./jsonobject";
import {QuestionFactory} from "./questionfactory";
import {LocalizableString} from "./localizablestring";

/**
 * A Model for a comment question
 */
export class QuestionCommentModel extends Question {
    public rows: number = 4;
    public cols: number = 50;
    private locPlaceHolderValue: LocalizableString;
    constructor(public name: string) {
        super(name);
        this.locPlaceHolderValue = new LocalizableString(this);
    }
    public get placeHolder(): string { return this.locPlaceHolder.text; }
    public set placeHolder(value: string) { this.locPlaceHolder.text = value; }
    public get locPlaceHolder(): LocalizableString {return this.locPlaceHolderValue; }
    public getType(): string {
        return "comment";
    }
    isEmpty(): boolean {
        return super.isEmpty() || this.value === "";
    }
}
JsonObject.metaData.addClass("comment", [{ name: "cols:number", default: 50 }, { name: "rows:number", default: 4 },
    {name: "placeHolder", serializationProperty: "locPlaceHolder"}], function () { return new QuestionCommentModel(""); }, "question");
QuestionFactory.Instance.registerQuestion("comment", (name) => { return new QuestionCommentModel(name); });
