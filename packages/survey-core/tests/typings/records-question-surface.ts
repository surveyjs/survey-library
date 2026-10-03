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
  // @ts-expect-error the fixed matrix does not page
  const dd17: DeclaredKeys<QuestionMatrixDropdownModel> = "canGoNextPage";
  // @ts-expect-error the fixed matrix does not page
  const dd18: DeclaredKeys<QuestionMatrixDropdownModel> = "canGoPrevPage";
  // @ts-expect-error the fixed matrix does not page
  const dd19: DeclaredKeys<QuestionMatrixDropdownModel> = "goToPage";
  // @ts-expect-error the fixed matrix does not page
  const dd20: DeclaredKeys<QuestionMatrixDropdownModel> = "nextPage";
  // @ts-expect-error the fixed matrix does not page
  const dd21: DeclaredKeys<QuestionMatrixDropdownModel> = "prevPage";
  // @ts-expect-error the fixed matrix does not page
  const dd22: DeclaredKeys<QuestionMatrixDropdownModel> = "isPageMovePending";
  // @ts-expect-error the fixed matrix does not page
  const dd23: DeclaredKeys<QuestionMatrixDropdownModel> = "pagerActions";
  // @ts-expect-error the fixed matrix has no record list
  const dd24: DeclaredKeys<QuestionMatrixDropdownModel> = "getDataList";
  // @ts-expect-error the fixed matrix does not page
  const dd25: DeclaredKeys<QuestionMatrixDropdownModel> = "syncPageSizeWithMode";
  // @ts-expect-error the paging state is protected
  const dd26: DeclaredKeys<QuestionMatrixDropdownModel> = "isPagingActive";
  // @ts-expect-error the paging state is protected
  const dd27: DeclaredKeys<QuestionMatrixDropdownModel> = "pageStartVisibleIndex";
  // @ts-expect-error the fixed matrix does not page
  const dd28: DeclaredKeys<QuestionMatrixDropdownModel> = "pageSize";
  // @ts-expect-error the fixed matrix has no data source
  const dd29: DeclaredKeys<QuestionMatrixDropdownModel> = "isRowCountKnown";
  res.push(dd17, dd18, dd19, dd20, dd21, dd22, dd23, dd24, dd25, dd26, dd27, dd28, dd29);

  // The feature's public API stays public on the dynamic questions.
  const mdApi: Array<DeclaredKeys<QuestionMatrixDynamicModel>> = ["dataSource", "pageIndex", "pageCount", "pageSize",
    "isCountKnown", "canGoNextPage", "canGoPrevPage", "goToPage", "nextPage", "prevPage", "sortOrder", "sortBy", "toggleSort",
    "clearSort", "filterExpression", "refreshView", "isDataLoading", "isPageMovePending", "isRowCountKnown", "getRecordNumberOffset"];
  const pdApi: Array<DeclaredKeys<QuestionPanelDynamicModel>> = ["dataSource", "pageIndex", "pageCount", "pageSize",
    "isCountKnown", "canGoNextPage", "canGoPrevPage", "goToPage", "nextPage", "prevPage", "sortOrder", "sortBy", "toggleSort",
    "clearSort", "filterExpression", "refreshView", "isDataLoading", "isPageMovePending", "isPanelCountKnown", "getRecordNumberOffset"];
  res.push(mdApi, pdApi);
  // The paging state shared by the records questions is protected on every one of them.
  // @ts-expect-error protected
  const md7: DeclaredKeys<QuestionMatrixDynamicModel> = "isPagingActive";
  // @ts-expect-error protected
  const md8: DeclaredKeys<QuestionMatrixDynamicModel> = "isPagedByList";
  // @ts-expect-error protected
  const md9: DeclaredKeys<QuestionMatrixDynamicModel> = "pageStartVisibleIndex";
  // @ts-expect-error protected
  const pd7: DeclaredKeys<QuestionPanelDynamicModel> = "hasDataListView";
  // @ts-expect-error protected
  const pd8: DeclaredKeys<QuestionPanelDynamicModel> = "rebuildStalePage";
  // @ts-expect-error protected
  const pd9: DeclaredKeys<QuestionPanelDynamicModel> = "getViewExpressionItem";
  res.push(md7, md8, md9, pd7, pd8, pd9);

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

  // The coordination between a question and its record list is not public on any of them.
  // @ts-expect-error the record list coordination
  const ddCoord1: DeclaredKeys<QuestionMatrixDropdownModel> = "onDataListChanged";
  // @ts-expect-error the record list coordination
  const ddCoord2: DeclaredKeys<QuestionMatrixDropdownModel> = "assignDataSource";
  // @ts-expect-error the record list coordination
  const ddCoord3: DeclaredKeys<QuestionMatrixDropdownModel> = "canWriteRecords";
  // @ts-expect-error the record list coordination
  const ddCoord4: DeclaredKeys<QuestionMatrixDropdownModel> = "validateOffPage";
  // @ts-expect-error the record list coordination
  const ddCoord5: DeclaredKeys<QuestionMatrixDropdownModel> = "isPageStale";
  // @ts-expect-error the record list coordination
  const ddCoord6: DeclaredKeys<QuestionMatrixDropdownModel> = "beginValueAssignment";
  // @ts-expect-error the record list coordination
  const ddCoord7: DeclaredKeys<QuestionMatrixDropdownModel> = "helperOwner";
  // @ts-expect-error the record list coordination
  const mdCoord1: DeclaredKeys<QuestionMatrixDynamicModel> = "onDataListChanged";
  // @ts-expect-error the record list coordination
  const mdCoord2: DeclaredKeys<QuestionMatrixDynamicModel> = "assignDataSource";
  // @ts-expect-error the record list coordination
  const mdCoord3: DeclaredKeys<QuestionMatrixDynamicModel> = "canWriteRecords";
  // @ts-expect-error the record list coordination
  const mdCoord4: DeclaredKeys<QuestionMatrixDynamicModel> = "validateOffPage";
  // @ts-expect-error the record list coordination
  const mdCoord5: DeclaredKeys<QuestionMatrixDynamicModel> = "isPageStale";
  // @ts-expect-error the record list coordination
  const mdCoord6: DeclaredKeys<QuestionMatrixDynamicModel> = "beginValueAssignment";
  // @ts-expect-error the record list coordination
  const mdCoord7: DeclaredKeys<QuestionMatrixDynamicModel> = "helperOwner";
  // @ts-expect-error the record list coordination
  const pdCoord1: DeclaredKeys<QuestionPanelDynamicModel> = "onDataListChanged";
  // @ts-expect-error the record list coordination
  const pdCoord2: DeclaredKeys<QuestionPanelDynamicModel> = "assignDataSource";
  // @ts-expect-error the record list coordination
  const pdCoord3: DeclaredKeys<QuestionPanelDynamicModel> = "canWriteRecords";
  // @ts-expect-error the record list coordination
  const pdCoord4: DeclaredKeys<QuestionPanelDynamicModel> = "validateOffPage";
  // @ts-expect-error the record list coordination
  const pdCoord5: DeclaredKeys<QuestionPanelDynamicModel> = "isPageStale";
  // @ts-expect-error the record list coordination
  const pdCoord6: DeclaredKeys<QuestionPanelDynamicModel> = "beginValueAssignment";
  // @ts-expect-error the record list coordination
  const pdCoord7: DeclaredKeys<QuestionPanelDynamicModel> = "helperOwner";
  res.push(ddCoord1, ddCoord2, ddCoord3, ddCoord4, ddCoord5, ddCoord6, ddCoord7, mdCoord1, mdCoord2, mdCoord3, mdCoord4, mdCoord5, mdCoord6, mdCoord7, pdCoord1, pdCoord2, pdCoord3, pdCoord4, pdCoord5, pdCoord6, pdCoord7);
  return res;
}
