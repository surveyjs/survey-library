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
}
JsonObject.metaData.addClass("expression", ["expression:expression", {name:"format", serializationProperty: "locFormat"}], function () { return new QuestionExpressionModel(""); }, "question");
QuestionFactory.Instance.registerQuestion("expression", (name) => { return new QuestionExpressionModel(name); });