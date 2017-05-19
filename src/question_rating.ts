import {ItemValue} from "./itemvalue";
import {Question} from "./question";
import {JsonObject} from "./jsonobject";
import {QuestionFactory} from "./questionfactory";
import {LocalizableString} from "./localizablestring";

/**
 * A Model for a rating question.
 */
export class QuestionRatingModel extends Question {
    static defaultRateValues: ItemValue[] = [];
    private rates: Array<ItemValue>;
    private locMinRateDescriptionValue: LocalizableString;
    private locMaxRateDescriptionValue: LocalizableString;

    rateValuesChangedCallback: () => void;

    constructor(public name: string) {
        super(name);
        this.rates = ItemValue.createArray(this);
        this.locMinRateDescriptionValue = new LocalizableString(this, true);
        this.locMaxRateDescriptionValue = new LocalizableString(this, true);
        this.locMinRateDescriptionValue.onRenderedHtmlCallback = function(text) { return text ? text + " " : text; }
        this.locMaxRateDescriptionValue.onRenderedHtmlCallback = function(text) { return text ? " " + text : text; }
    }
    /**
     * The list of rate items. Every item has value and text. If text is empty, the value is rendered. The item text supports markdown. If it is empty the default array [1, 2, 3, 4, 5] is used.
     */
    public get rateValues(): Array<any> { return this.rates; }
    public set rateValues(newValue: Array<any>) {
        ItemValue.setData(this.rates, newValue);
        this.fireCallback(this.rateValuesChangedCallback);
    }
    get visibleRateValues(): ItemValue[] {
        if (this.rateValues.length > 0) return this.rateValues;
        return QuestionRatingModel.defaultRateValues;
    }
    public getType(): string {
        return "rating";
    }
    supportGoNextPageAutomatic() { return true; }
    public supportComment(): boolean { return true; }
    public supportOther(): boolean { return true; }
    /**
     * The description of minimum (first) item.
     */
    public get minRateDescription(): string { return this.locMinRateDescription.text;}
    public set minRateDescription(value: string) { this.locMinRateDescription.text = value;}
    get locMinRateDescription(): LocalizableString {return this.locMinRateDescriptionValue;};
    /**
     * The description of maximum (last) item.
     */
    public get maxRateDescription(): string { return this.locMaxRateDescription.text;}
    public set maxRateDescription(value: string) { this.locMaxRateDescription.text = value;}
    get locMaxRateDescription(): LocalizableString {return this.locMaxRateDescriptionValue;};
}
ItemValue.setData(QuestionRatingModel.defaultRateValues, [1, 2, 3, 4, 5]);
JsonObject.metaData.addClass("rating", ["hasComment:boolean", { name: "rateValues:itemvalues", onGetValue: function (obj: any) { return ItemValue.getData(obj.rateValues); }, onSetValue: function (obj: any, value: any) { obj.rateValues = value; }},
    {name: "minRateDescription", alternativeName: "mininumRateDescription", serializationProperty: "locMinRateDescription"},
    {name: "maxRateDescription", alternativeName: "maximumRateDescription", serializationProperty: "locMaxRateDescription"}], function () { return new QuestionRatingModel(""); }, "question");
QuestionFactory.Instance.registerQuestion("rating", (name) => { return new QuestionRatingModel(name); });
