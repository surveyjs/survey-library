import { HashTable, Helpers } from "./helpers";
import { Base } from "./base";
import { ISurvey, ISurveyVariables } from "./base-interfaces";
import { Serializer } from "./jsonobject";
import { property } from "./decorators";
import { ExpressionRunner } from "./expressions/expressionRunner";
import { settings } from "./settings";

export class CalculatedValue extends Base {
  private data: ISurveyVariables;
  private expressionIsRunning: boolean = false;
  private expressionRunner: ExpressionRunner;
  // The name and the result of the last completed run, whatever started it
  private lastRun: { name: string, value: any };
  constructor(name: string = null, expression: string = null) {
    super();
    if (!!name) {
      this.name = name;
    }
    if (!!expression) {
      this.expression = expression;
    }
  }
  protected override onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "expression") {
      this.lastRun = undefined;
      this.rerunExpression();
    }
  }
  public setOwner(data: ISurveyVariables) {
    this.data = data;
    this.rerunExpression();
  }
  public getOwner() {
    return this.data;
  }
  public getType(): string {
    return "calculatedvalue";
  }
  public getSurvey(live: boolean = false): ISurvey {
    return !!this.data && !!(<any>this.data)["getSurvey"]
      ? (<any>this.data).getSurvey()
      : null;
  }
  public get owner(): ISurveyVariables {
    return this.data;
  }
  /**
   * The calculated value name. It should be non empty and unique.
   */
  @property() name: string;
  /**
   * Set this property to true to include the non-empty calculated value into survey result, survey.data property.
   */
  @property() includeIntoResult: boolean;
  /**
   * The Expression that used to calculate the value. You may use standard operators like +, -, * and /, squares (). Here is the example of accessing the question value {questionname}.
   * Example: "({quantity} * {price}) * (100 - {discount}) / 100"
   */
  @property() expression: string;
  public locCalculation() {
    this.expressionIsRunning = true;
  }
  public unlocCalculation() {
    this.expressionIsRunning = false;
  }
  private isCalculated = false;
  public resetCalculation() {
    this.isCalculated = false;
  }
  public doCalculation(calculatedValues: Array<CalculatedValue>, properties: HashTable<any>
  ) {
    if (this.isCalculated) return;
    this.runExpressionCore(calculatedValues, properties, true);
    this.isCalculated = true;
  }
  public runExpression(properties: HashTable<any>) {
    this.runExpressionCore(null, properties);
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
    this.runExpression({ survey: this.getSurvey() });
  }
  protected override onDependencyValueChanged(obj: Base, propertyName: string): void {
    this.rerunExpression();
  }
  private runExpressionCore(calculatedValues: Array<CalculatedValue>, properties: HashTable<any>, canSkip?: boolean) {
    if (!this.canRunExpression || !this.ensureExpression()) return;
    this.locCalculation();
    if (!!calculatedValues) {
      this.runDependentExpressions(calculatedValues, properties);
    }
    // Decided after the dependents ran: a calculated value this one uses and that changed in
    // this pass is in the survey's changed keys by now
    if (canSkip && this.canSkipCalculation()) {
      this.unlocCalculation();
      return;
    }
    this.expressionRunner.runContext(this.getValueGetterContext(), this.getPropertiesCopy(properties, "expression"));
  }
  // A run in the survey's conditions pass is skipped, the way a strict-dependency visibleIf is,
  // when no variable the expression uses changed. The value's own state must also be what the
  // last run left: a rename, or a variable cleared or overwritten from outside, runs it again.
  private canSkipCalculation(): boolean {
    if (!settings.calculatedValueTrackDependencies || !this.lastRun) return false;
    if (this.lastRun.name !== this.name) return false;
    if (!Helpers.isTwoValueEquals(this.lastRun.value, this.value, false, true, false)) return false;
    const survey: any = this.getSurvey();
    const keys = !!survey && typeof survey.getValueChangedKeys === "function" ? survey.getValueChangedKeys() : undefined;
    // A calculated value reads a path under a cleared value ({m.row1} once m is cleared) again
    return this.canSkipExpressionByKeys(this.expressionRunner, keys, undefined, true);
  }
  private runDependentExpressions(calculatedValues: Array<CalculatedValue>, properties: HashTable<any>) {
    var variables = this.expressionRunner.getVariables();
    if (!variables) return;
    for (var i = 0; i < calculatedValues.length; i++) {
      var calcItem = calculatedValues[i];
      if (calcItem === this || variables.indexOf(calcItem.name) < 0) continue;
      calcItem.doCalculation(calculatedValues, properties);
    }
  }
  private ensureExpression(): boolean {
    const expression = this.getExpressionFromSurvey("expression");
    if (!expression) return false;
    if (!!this.expressionRunner) {
      this.expressionRunner.expression = expression;
    } else {
      this.expressionRunner = this.createExpressionRunner(expression);
      this.expressionRunner.onRunComplete = newValue => {
        if (!Helpers.isTwoValueEquals(newValue, this.value, false, true, false)) {
          this.setValue(newValue);
        }
        this.lastRun = { name: this.name, value: newValue };
        this.unlocCalculation();
      };
    }
    return true;
  }
}

Serializer.addClass(
  "calculatedvalue",
  [
    { name: "!name", isUnique: true },
    "expression:expression",
    "includeIntoResult:boolean",
  ],
  function() {
    return new CalculatedValue();
  },
  "base"
);
