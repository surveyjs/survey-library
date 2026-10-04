import { ConditionRunner } from "../conditions/conditionRunner";
import { IValueGetterContext } from "../conditions/conditionProcessValue";
import { HashTable } from "../helpers";

// The record read as a value (RecordValueItem), typed by shape: this module does not load question_records.ts.
export interface IDynamicDataRecordScope {
  item: { reset(recordIndex: number, record: any): void, getValueGetterContext(): IValueGetterContext };
  properties: HashTable<any>;
}
// What one record adds to the expression every record runs: visible false hides it whatever the
// expressions say, and expression is a condition of its own, run in the same scope.
export interface IDynamicDataRecordCondition {
  visible?: boolean;
  expression?: string;
}

/* rowsVisibleIf / templateVisibleIf under paging: the list's hidden flags are written from an expression
   evaluated over every record, without an object. An empty expression - none, or invisible elements
   are shown - makes every record visible, and the flags are cleared once. readCondition, when the
   owner has one, gives the condition of a record of its own (see IDynamicDataRecordCondition): a record
   is visible when the expression and its own condition both pass. createScope is called only when an
   expression runs, and one runner is kept per expression text. Returns whether a flag changed. */
export class DynamicDataRecordVisibility {
  private hasFlags: boolean;
  private runners: Map<string, ConditionRunner> = new Map<string, ConditionRunner>();
  public update(list: { setRecordsVisible(isVisible: (index: number) => boolean): boolean }, expression: string, readRecord: (index: number) => any,
    createScope: () => IDynamicDataRecordScope, readCondition?: (index: number) => IDynamicDataRecordCondition): boolean {
    if (!expression && !readCondition) {
      if (!this.hasFlags) return false;
      this.hasFlags = false;
      return list.setRecordsVisible((): boolean => true);
    }
    this.hasFlags = true;
    const usedRunners = new Map<string, ConditionRunner>();
    const getRunner = (text: string): ConditionRunner => {
      let runner = usedRunners.get(text) || this.runners.get(text);
      if (!runner) {
        runner = new ConditionRunner(text);
      }
      usedRunners.set(text, runner);
      return runner;
    };
    const mainRunner = !!expression ? getRunner(expression) : undefined;
    let scope: IDynamicDataRecordScope;
    const isChanged = list.setRecordsVisible((index: number): boolean => {
      const condition = !!readCondition ? readCondition(index) : undefined;
      if (!!condition && condition.visible === false) return false;
      const ownRunner = !!condition && !!condition.expression ? getRunner(condition.expression) : undefined;
      if (!mainRunner && !ownRunner) return true;
      if (!scope) scope = createScope();
      scope.item.reset(index, readRecord(index));
      if (!!mainRunner && mainRunner.runContext(scope.item.getValueGetterContext(), scope.properties) !== true) return false;
      return !ownRunner || ownRunner.runContext(scope.item.getValueGetterContext(), scope.properties) === true;
    });
    this.runners = usedRunners;
    return isChanged;
  }
}
