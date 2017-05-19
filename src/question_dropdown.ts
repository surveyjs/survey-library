import {JsonObject} from "./jsonobject";
import {QuestionFactory} from "./questionfactory";
import {QuestionSelectBase} from "./question_baseselect";
import {surveyLocalization} from "./surveyStrings";
import {LocalizableString} from "./localizablestring";

/**
 * A Model for a dropdown question
 */
export class QuestionDropdownModel extends QuestionSelectBase {
    private locOptionsCaptionValue: LocalizableString;
    constructor(public name: string) {
        super(name);
        this.locOptionsCaptionValue = new LocalizableString(this);
    }
    /**
     * Use this property to set the options caption different from the default value. The default value is taken from localization strings.
     */
    public get optionsCaption() { return this.locOptionsCaption.text ? this.locOptionsCaption.text : surveyLocalization.getString("optionsCaption"); }
    public set optionsCaption(newValue: string) { this.locOptionsCaption.text = newValue; }
    get locOptionsCaption(): LocalizableString { return this.locOptionsCaptionValue;}
    public getType(): string {
        return "dropdown";
    }
    public onLocaleChanged() {
        super.onLocaleChanged();
        this.locOptionsCaption.onChanged();
    }
    supportGoNextPageAutomatic() { return true; }
}
JsonObject.metaData.addClass("dropdown", [{ name: "optionsCaption", serializationProperty: "locOptionsCaption"}],
    function () { return new QuestionDropdownModel(""); }, "selectbase");
QuestionFactory.Instance.registerQuestion("dropdown", (name) => { var q = new QuestionDropdownModel(name); q.choices = QuestionFactory.DefaultChoices; return q; });
