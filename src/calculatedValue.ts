import { HashTable, Helpers } from "./helpers";
import { Base, ISurveyData } from "./base";
import { ExpressionRunner } from "./conditions";
import { Serializer } from "./jsonobject";

/**
 * The calculated value is a way to define the variable in Survey Creator.
 * It has two main properties: name and expression. Based on expression the value read-only property is automatically calculated.
 * The name property should be unique though all calcualted values.
 * It uses survey.getVariable/seruvey.setVariable functions to get/set its value. The class do not store its value internally.
 * You may set includeIntoResult property to true to store this calculated value into survey result.
 */
export class CalculatedValue extends Base {
  private data: ISurveyData;
  private expressionIsRunning: boolean = false;
  private expressionRunner: ExpressionRunner;
  constructor(name: string = null, expression: string = null) {
    super();
    if (!!name) {
      this.name = name;
    }
    if (!!expression) {
      this.expression = expression;
    }
  }
  public setOwner(data: ISurveyData) {
    this.data = data;
    this.rerunExpression();
  }
  public getType(): string {
    return "calculatedvalue";
  }
  /**
   * The calculated value name. It should be non empty and unique.
   */
  public get name(): string {
    return this.getPropertyValue("name", "");
  }
  public set name(val: string) {
    this.setPropertyValue("name", val);
  }
  /**
   * Set this property to true to include the non-empty calculated value into survey result, survey.data property.
   */
  public get includeIntoResult(): boolean {
    return this.getPropertyValue("includeIntoResult", false);
  }
  public set includeIntoResult(val: boolean) {
    this.setPropertyValue("includeIntoResult", val);
  }
  /**
   * The Expression that used to calculate the value. You may use standard operators like +, -, * and /, squares (). Here is the example of accessing the question value {questionname}.
   * <br/>Example: "({quantity} * {price}) * (100 - {discount}) / 100"
   */
  public get expression(): string {
    return this.getPropertyValue("expression", "");
  }
  public set expression(val: string) {
    this.setPropertyValue("expression", val);
    this.rerunExpression();
  }
  public locCalculation() {
    this.expressionIsRunning = true;
  }
  public unlocCalculation() {
    this.expressionIsRunning = false;
  }
  public runExpression(values: HashTable<any>, properties: HashTable<any>) {
    if (!this.canRunExpression) return;
    this.locCalculation();
    if (!this.expressionRunner) {
      this.expressionRunner = new ExpressionRunner(this.expression);
    }
    this.expressionRunner.onRunComplete = newValue => {
      if (!Helpers.isTwoValueEquals(newValue, this.value)) {
        this.setValue(newValue);
      }
      this.unlocCalculation();
    };
    this.expressionRunner.run(values, properties);
  }
  public get value(): any {
    if (!this.data) return undefined;
    return this.data.getVariable(this.name);
  }
  protected setValue(val: any) {
    if (!this.data) return;
    this.data.setVariable(this.name, val);
  }
  private get canRunExpression(): boolean {
    return (
      !!this.data &&
      !this.isLoadingFromJson &&
      !!this.expression &&
      !this.expressionIsRunning &&
      !!this.name
    );
  }
  private rerunExpression() {
    if (!this.canRunExpression) return;
    this.runExpression(
      this.data.getFilteredValues(),
      this.data.getFilteredProperties()
    );
  }
}

Serializer.addClass(
  "calculatedvalue",
  ["!name", "expression:expression", "includeIntoResult:boolean"],
  function() {
    return new CalculatedValue();
  },
  "base"
);
