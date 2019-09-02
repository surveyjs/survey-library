import { HashTable, Helpers } from "./helpers";
import { Base, ISurveyData } from "./base";
import { ExpressionRunner } from "./conditions";

export class CalculatedValue extends Base {
  private data: ISurveyData;
  private expressionIsRunning: boolean = false;
  private expressionRunner: ExpressionRunner;
  constructor(name: string, expression: string) {
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
  public get name(): string {
    return this.getPropertyValue("name", "");
  }
  public set name(val: string) {
    var oldValue = this.name;
    this.setPropertyValue("name", val);
    if (!this.isLoadingFromJson && !!oldValue) {
      this.onNameChanged(oldValue);
    }
  }
  protected onNameChanged(oldValue: string) {}
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
        this.value = newValue;
      }
      this.unlocCalculation();
    };
    this.expressionRunner.run(values, properties);
  }
  public get value(): any {
    if (!this.data) return undefined;
    return this.data.getVariable(this.name);
  }
  public set value(val: any) {
    if (!this.data) return;
    this.data.setVariable(this.name, val);
  }
  private get canRunExpression(): boolean {
    return (
      !!this.data &&
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
