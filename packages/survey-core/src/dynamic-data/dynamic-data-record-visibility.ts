import { ConditionRunner } from "../conditions/conditionRunner";
import { IValueGetterContext } from "../conditions/conditionProcessValue";
import { HashTable } from "../helpers";

// The record read as a value (DynamicRecordItem), typed by shape: this module does not load dynamicItemModelBase.ts.
export interface IDynamicDataRecordScope {
  item: { reset(recordIndex: number, record: any): void, getValueGetterContext(): IValueGetterContext };
  properties: HashTable<any>;
}

/* rowsVisibleIf / templateVisibleIf under paging: the list's hidden flags are written from an expression
   evaluated over every record, without an object. An empty expression - none, or invisible elements
   are shown - makes every record visible, and the flags are cleared once. createScope is called only
   when the expression runs. Returns whether a flag changed. */
export class DynamicDataRecordVisibility {
  private hasFlags: boolean;
  private runner: ConditionRunner;
  public update(list: { setRecordsVisible(isVisible: (index: number) => boolean): boolean }, expression: string, readRecord: (index: number) => any, createScope: () => IDynamicDataRecordScope): boolean {
    if (!expression) {
      if (!this.hasFlags) return false;
      this.hasFlags = false;
      return list.setRecordsVisible((): boolean => true);
    }
    this.hasFlags = true;
    if (!this.runner || this.runner.expression !== expression) {
      this.runner = new ConditionRunner(expression);
    }
    const runner = this.runner;
    const scope = createScope();
    return list.setRecordsVisible((index: number): boolean => {
      scope.item.reset(index, readRecord(index));
      return runner.runContext(scope.item.getValueGetterContext(), scope.properties) === true;
    });
  }
}
