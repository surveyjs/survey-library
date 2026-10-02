// A compile-time fixture, not a unit test: vitest does not type-check and nothing else in the package
// type-checks the tests, so `npm run test:types` compiles this file on its own.
// It guards the public surface of the records questions: QuestionRecordsModel is the common ancestor
// of the dropdown matrices and the dynamic panel, an application subclass that overrides the
// released setQuestionValue / dispose / updateValueFromSurvey keeps compiling, and the members the
// record list coordination needs (the hooks, the paging owner) are not public on any question. The
// fixed matrix does not offer paging, sorting, filtering or a data source.
import { Question } from "../../src/question";
import { QuestionRecordsModel } from "../../src/question_records";
import { QuestionMatrixDropdownModelBase } from "../../src/question_matrixdropdownbase";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";

// The released override surface of the matrix base.
export class MatrixWithOverrides extends QuestionMatrixDropdownModelBase {
  protected setQuestionValue(newValue: any): void {
    super.setQuestionValue(newValue);
  }
  public dispose(): void {
    super.dispose();
  }
}
export class PanelWithOverrides extends QuestionPanelDynamicModel {
  public setQuestionValue(newValue: any): void {
    super.setQuestionValue(newValue);
  }
  public updateValueFromSurvey(newValue: any, clearData: boolean = false): void {
    super.updateValueFromSurvey(newValue, clearData);
  }
  public dispose(): void {
    super.dispose();
  }
}

// The keys of T without its index signature: the members the class really declares.
type DeclaredKeys<T> = keyof { [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K] };

export function checkRecordsQuestionSurface(question: Question): Array<any> {
  const res: Array<any> = [];
  if (question instanceof QuestionRecordsModel) {
    const records: QuestionRecordsModel = question;
    res.push(records.isDataLoading, records.isDynamicDataRunning);
  }
  const dd = new QuestionMatrixDropdownModel("dd");
  const md = new QuestionMatrixDynamicModel("md");
  const pd = new QuestionPanelDynamicModel("pd");
  const asRecords: Array<QuestionRecordsModel> = [dd, md, pd, new MatrixWithOverrides("m")];
  res.push(asRecords);

  // PD's public setQuestionValue is released and stays public.
  const pdSetQuestionValue: DeclaredKeys<QuestionPanelDynamicModel> = "setQuestionValue";
  res.push(pdSetQuestionValue);

  // The dynamic questions keep their public paging and loading state.
  const mdKeys: Array<DeclaredKeys<QuestionMatrixDynamicModel>> = ["pageIndex", "pageCount", "isCountKnown", "pageSize", "isDataLoading", "isDynamicDataRunning"];
  const pdKeys: Array<DeclaredKeys<QuestionPanelDynamicModel>> = ["pageIndex", "pageCount", "isCountKnown", "pageSize", "isDataLoading", "isDynamicDataRunning"];
  res.push(mdKeys, pdKeys);

  // The fixed matrix does not offer paging, sorting, filtering or a data source, and the hooks are not public.
  // @ts-expect-error a hook
  const dd1: DeclaredKeys<QuestionMatrixDropdownModel> = "getListRecords";
  // @ts-expect-error a hook
  const dd2: DeclaredKeys<QuestionMatrixDropdownModel> = "rebuildFromDataList";
  // @ts-expect-error a hook
  const dd3: DeclaredKeys<QuestionMatrixDropdownModel> = "syncPagingState";
  // @ts-expect-error a page move of the paging owner
  const dd4: DeclaredKeys<QuestionMatrixDropdownModel> = "leavePage";
  // @ts-expect-error a page move of the paging owner
  const dd5: DeclaredKeys<QuestionMatrixDropdownModel> = "cancelPendingPageMove";
  // @ts-expect-error a hook
  const dd6: DeclaredKeys<QuestionMatrixDropdownModel> = "raiseSortByChanged";
  // @ts-expect-error the fixed matrix does not page
  const dd7: DeclaredKeys<QuestionMatrixDropdownModel> = "pageIndex";
  // @ts-expect-error the fixed matrix does not page
  const dd8: DeclaredKeys<QuestionMatrixDropdownModel> = "pageCount";
  // @ts-expect-error the fixed matrix does not page
  const dd9: DeclaredKeys<QuestionMatrixDropdownModel> = "isCountKnown";
  // @ts-expect-error the fixed matrix does not sort
  const dd10: DeclaredKeys<QuestionMatrixDropdownModel> = "sortBy";
  // @ts-expect-error the fixed matrix does not filter
  const dd11: DeclaredKeys<QuestionMatrixDropdownModel> = "filterExpression";
  // @ts-expect-error the fixed matrix does not sort
  const dd12: DeclaredKeys<QuestionMatrixDropdownModel> = "sortOrder";
  // @ts-expect-error the fixed matrix does not sort
  const dd13: DeclaredKeys<QuestionMatrixDropdownModel> = "toggleSort";
  // @ts-expect-error the fixed matrix does not sort
  const dd14: DeclaredKeys<QuestionMatrixDropdownModel> = "clearSort";
  // @ts-expect-error the fixed matrix has no view to refresh
  const dd15: DeclaredKeys<QuestionMatrixDropdownModel> = "refreshView";
  // @ts-expect-error the fixed matrix has no data source
  const dd16: DeclaredKeys<QuestionMatrixDropdownModel> = "dataSource";
  res.push(dd1, dd2, dd3, dd4, dd5, dd6, dd7, dd8, dd9, dd10, dd11, dd12, dd13, dd14, dd15, dd16);

  // The dynamic questions do not expose the hooks or the paging owner's page moves either.
  // @ts-expect-error a hook
  const md1: DeclaredKeys<QuestionMatrixDynamicModel> = "getListRecords";
  // @ts-expect-error a hook
  const md2: DeclaredKeys<QuestionMatrixDynamicModel> = "syncPagingState";
  // @ts-expect-error a page move of the paging owner
  const md3: DeclaredKeys<QuestionMatrixDynamicModel> = "leavePage";
  // @ts-expect-error a page move of the paging owner
  const md4: DeclaredKeys<QuestionMatrixDynamicModel> = "cancelPendingPageMove";
  // @ts-expect-error a hook
  const md5: DeclaredKeys<QuestionMatrixDynamicModel> = "raiseSortByChanged";
  // @ts-expect-error a hook
  const md6: DeclaredKeys<QuestionMatrixDynamicModel> = "getFields";
  // @ts-expect-error a hook
  const pd1: DeclaredKeys<QuestionPanelDynamicModel> = "getListRecords";
  // @ts-expect-error a hook
  const pd2: DeclaredKeys<QuestionPanelDynamicModel> = "syncPagingState";
  // @ts-expect-error a page move of the paging owner
  const pd3: DeclaredKeys<QuestionPanelDynamicModel> = "leavePage";
  // @ts-expect-error a page move of the paging owner
  const pd4: DeclaredKeys<QuestionPanelDynamicModel> = "cancelPendingPageMove";
  // @ts-expect-error a hook
  const pd5: DeclaredKeys<QuestionPanelDynamicModel> = "raiseSortByChanged";
  // @ts-expect-error a hook
  const pd6: DeclaredKeys<QuestionPanelDynamicModel> = "getFields";
  res.push(md1, md2, md3, md4, md5, md6, pd1, pd2, pd3, pd4, pd5, pd6);
  return res;
}
