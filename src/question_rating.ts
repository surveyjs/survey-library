import {ItemValue} from "./base";
import {Question} from "./question";
import {JsonObject} from "./jsonobject";
import {QuestionFactory} from "./questionfactory";

export class QuestionRatingModel extends Question {
    static defaultRateValues: ItemValue[] = [];
    private rates: ItemValue[] = [];
    public minRateDescription: string = null;
    public maxRateDescription: string = null;

    rateValuesChangedCallback: () => void;

    constructor(public name: string) {
        super(name);
    }
    get rateValues(): Array<any> { return this.rates; }
    set rateValues(newValue: Array<any>) {
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
    public supportComment(): boolean { return true; }
    public supportOther(): boolean { return true; }
    supportGoNextPageAutomatic() { return true; }
}
ItemValue.setData(QuestionRatingModel.defaultRateValues, [1, 2, 3, 4, 5]);
JsonObject.metaData.addClass("rating", ["hasComment:boolean", { name: "rateValues:itemvalues", onGetValue: function (obj: any) { return ItemValue.getData(obj.rateValues); }, onSetValue: function (obj: any, value: any) { obj.rateValues = value; }},
    {name: "minRateDescription", alternativeName: "mininumRateDescription"}, {name: "maxRateDescription", alternativeName: "maximumRateDescription"}], function () { return new QuestionRatingModel(""); }, "question");
QuestionFactory.Instance.registerQuestion("rating", (name) => { return new QuestionRatingModel(name); });