import { HashTable, Helpers } from "./helpers";
import { Base } from "./base";
import { ISurvey, ISurveyVariables } from "./base-interfaces";
import { Serializer } from "./jsonobject";
import { property } from "./decorators";
import { ExpressionRunner } from "./expressions/expressionRunner";
import { FunctionFactory } from "./functionsfactory";
import { settings } from "./settings";

// "b" of "b", "b.x" and "b[0]"; a scan, not a split: it runs for every variable of every calculated value
function getFirstPathSegment(name: string): string {
  for (let i = 0; i < name.length; i++) {
    const ch = name[i];
    if (ch === "." || ch === "[") return name.substring(0, i);
  }
  return name;
}

export class CalculatedValue extends Base {
  private data: ISurveyVariables;
  private expressionIsRunning: boolean = false;
  private expressionRunner: ExpressionRunner;
  // The name and the result of the last completed run, whatever started it
  private lastRun: { name: string, value: any };
  // The runner's variables as a set, to find the calculated values this one uses
  private dependentNames: Set<string>;
  private dependentNamesSource: Array<string>;
  private dependentNamesLength: number;
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
    // The runner keeps its variables array until the expression changes, then returns a new one.
    // The array is shared and may grow in place (CopyValueTrigger pushes into its runner's array),
    // so the set is rebuilt when the array or its length changes
    if (this.dependentNamesSource !== variables || this.dependentNamesLength !== variables.length) {
      this.dependentNames = new Set(variables);
      this.dependentNamesSource = variables;
      this.dependentNamesLength = variables.length;
    }
    for (var i = 0; i < calculatedValues.length; i++) {
      var calcItem = calculatedValues[i];
      if (calcItem === this || !this.dependentNames.has(calcItem.name)) continue;
      calcItem.doCalculation(calculatedValues, properties);
    }
  }
  // At load, SurveyModel runs the calculated values once and then repeats only these, in their order,
  // while one of them changed in the previous loop: the members of a cycle (a value that reads itself
  // included), a value that reads one declared after it by a name runDependentExpressions does not
  // match ({B} for "b", {b[0]}, {b.x}), and every value that reads one of those, directly or through
  // others. "A reads B": the first segment of a variable of A is the name of B, in any letter case.
  // Returns undefined when an expression calls a function whose result may depend on element state
  // (resultDependsOn is "elements" or not set): such a load runs its whole passes as before.
  public static getRepeatedAtLoad(calculatedValues: Array<CalculatedValue>): Array<CalculatedValue> {
    const count = calculatedValues.length;
    const variables = new Array<Array<string>>(count);
    let safeFunctions: Map<string, boolean>;
    for (let i = 0; i < count; i++) {
      const item = calculatedValues[i];
      variables[i] = [];
      if (!item.canRunExpression || !item.ensureExpression()) continue;
      variables[i] = item.expressionRunner.getVariables() || [];
      if (!item.expressionRunner.hasFunction()) continue;
      const functionNames = item.expressionRunner.getFunctionNames();
      if (!functionNames) return undefined;
      if (!safeFunctions) {
        safeFunctions = new Map<string, boolean>();
        FunctionFactory.Instance.getRegistrations().forEach(reg => {
          safeFunctions.set(reg.name, reg.resultDependsOn === "parameters" || reg.resultDependsOn === "survey");
        });
      }
      for (let j = 0; j < functionNames.length; j++) {
        if (!safeFunctions.get(functionNames[j])) return undefined;
      }
    }
    const indexesByName = new Map<string, Array<number>>();
    for (let i = 0; i < count; i++) {
      const key = (calculatedValues[i].name || "").toLowerCase();
      if (!indexesByName.has(key)) indexesByName.set(key, []);
      indexesByName.get(key).push(i);
    }
    const reads = new Array<Array<number>>(count);
    const isRepeated = new Array<boolean>(count);
    for (let i = 0; i < count; i++) {
      const names = variables[i];
      reads[i] = [];
      for (let k = 0; k < names.length; k++) {
        const indexes = indexesByName.get(getFirstPathSegment(names[k]).toLowerCase());
        if (!indexes) continue;
        for (let n = 0; n < indexes.length; n++) {
          const j = indexes[n];
          if (reads[i].indexOf(j) > -1) continue;
          reads[i].push(j);
          // The value read is repeated too: its change is what starts the next loop, also when the reader's
          // first result did not change (undefined read as undefined)
          if (j > i && names.indexOf(calculatedValues[j].name) < 0) isRepeated[i] = isRepeated[j] = true;
        }
      }
    }
    CalculatedValue.markCycleMembers(reads, isRepeated);
    CalculatedValue.markReaders(reads, isRepeated);
    return calculatedValues.filter((_, index) => isRepeated[index]);
  }
  // Tarjan's strongly connected components, without recursion: a long chain must not exhaust the stack
  private static markCycleMembers(reads: Array<Array<number>>, marks: Array<boolean>): void {
    const count = reads.length;
    const order = new Array<number>(count);
    const low = new Array<number>(count);
    const isOnStack = new Array<boolean>(count);
    const stack = new Array<number>();
    let counter = 0;
    for (let root = 0; root < count; root++) {
      if (order[root] !== undefined) continue;
      const path = [{ node: root, next: 0 }];
      order[root] = low[root] = counter++;
      stack.push(root);
      isOnStack[root] = true;
      while(path.length > 0) {
        const frame = path[path.length - 1];
        const node = frame.node;
        if (frame.next < reads[node].length) {
          const target = reads[node][frame.next++];
          if (order[target] === undefined) {
            order[target] = low[target] = counter++;
            stack.push(target);
            isOnStack[target] = true;
            path.push({ node: target, next: 0 });
          } else if (isOnStack[target]) {
            low[node] = Math.min(low[node], order[target]);
          }
          continue;
        }
        path.pop();
        if (path.length > 0) {
          const parent = path[path.length - 1].node;
          low[parent] = Math.min(low[parent], low[node]);
        }
        if (low[node] !== order[node]) continue;
        const component = new Array<number>();
        let member: number;
        do {
          member = stack.pop();
          isOnStack[member] = false;
          component.push(member);
        } while(member !== node);
        if (component.length > 1 || reads[node].indexOf(node) > -1) {
          component.forEach(index => marks[index] = true);
        }
      }
    }
  }
  // Marks every value that reads a marked one, directly or through others
  private static markReaders(reads: Array<Array<number>>, marks: Array<boolean>): void {
    const readers = reads.map(() => new Array<number>());
    reads.forEach((targets, reader) => targets.forEach(target => readers[target].push(reader)));
    const queue = new Array<number>();
    marks.forEach((isMarked, index) => { if (isMarked) queue.push(index); });
    while(queue.length > 0) {
      const list = readers[queue.pop()];
      for (let i = 0; i < list.length; i++) {
        if (marks[list[i]]) continue;
        marks[list[i]] = true;
        queue.push(list[i]);
      }
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
