// A compile-time fixture, not a unit test: vitest does not type-check and nothing else in the package
// type-checks the tests, so `npm run test:types` compiles this file on its own.
// It guards the public surface of the records questions: QuestionRecordsModel is the common ancestor
// of the dropdown matrices and the dynamic panel, an application subclass that overrides the
// released setQuestionValue / dispose / updateValueFromSurvey keeps compiling, and the members the
// record list coordination needs (the hooks, the paging owner) are not public on any question. Every
// records question shares the paging, sorting and filtering API; the fixed matrix exposes no data source.
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

  // The hooks are not public on the fixed matrix, and it has no data source.
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
  // @ts-expect-error the fixed matrix has no data source
  const dd16: DeclaredKeys<QuestionMatrixDropdownModel> = "dataSource";
  res.push(dd1, dd2, dd3, dd4, dd5, dd6, dd16);
  // @ts-expect-error the paging state is protected
  const dd26: DeclaredKeys<QuestionMatrixDropdownModel> = "isPagingActive";
  // @ts-expect-error the paging state is protected
  const dd27: DeclaredKeys<QuestionMatrixDropdownModel> = "pageStartVisibleIndex";
  // @ts-expect-error the fixed matrix has no data source
  const dd29: DeclaredKeys<QuestionMatrixDropdownModel> = "isRowCountKnown";
  res.push(dd26, dd27, dd29);
  // Every records question shares the paging, sorting and filtering API, the fixed matrix included.
  const ddApi: Array<DeclaredKeys<QuestionMatrixDropdownModel>> = ["pageIndex", "pageCount", "isCountKnown", "sortBy",
    "filterExpression", "sortOrder", "toggleSort", "clearSort", "refreshView", "canGoNextPage", "canGoPrevPage", "goToPage",
    "nextPage", "prevPage", "isPageMovePending", "pagerActions", "syncPageSizeWithMode", "pageSize"];
  res.push(ddApi);
  // The record list is not public on any records question: refreshDataSource() reads a source again.
  // @ts-expect-error the record list
  const ddList: DeclaredKeys<QuestionMatrixDropdownModel> = "getDataList";
  // @ts-expect-error the record list
  const mdList: DeclaredKeys<QuestionMatrixDynamicModel> = "getDataList";
  // @ts-expect-error the record list
  const pdList: DeclaredKeys<QuestionPanelDynamicModel> = "getDataList";
  // @ts-expect-error the fixed matrix has no data source
  const ddRefresh: DeclaredKeys<QuestionMatrixDropdownModel> = "refreshDataSource";
  res.push(ddList, mdList, pdList, ddRefresh);
  // rows: the records of the fixed matrix; the dynamic matrix keeps the released (empty) property.
  const ddRows: DeclaredKeys<QuestionMatrixDropdownModel> = "rows";
  const mdRows: DeclaredKeys<QuestionMatrixDynamicModel> = "rows";
  const dbRows: DeclaredKeys<QuestionMatrixDropdownModelBase> = "rows";
  res.push(ddRows, mdRows, dbRows);

  // The feature's public API stays public on the dynamic questions.
  const mdApi: Array<DeclaredKeys<QuestionMatrixDynamicModel>> = ["dataSource", "pageIndex", "pageCount", "pageSize",
    "isCountKnown", "canGoNextPage", "canGoPrevPage", "goToPage", "nextPage", "prevPage", "sortOrder", "sortBy", "toggleSort",
    "clearSort", "filterExpression", "refreshView", "isDataLoading", "isPageMovePending", "isRowCountKnown", "getRecordNumberOffset",
    "refreshDataSource"];
  const pdApi: Array<DeclaredKeys<QuestionPanelDynamicModel>> = ["dataSource", "pageIndex", "pageCount", "pageSize",
    "isCountKnown", "canGoNextPage", "canGoPrevPage", "goToPage", "nextPage", "prevPage", "sortOrder", "sortBy", "toggleSort",
    "clearSort", "filterExpression", "refreshView", "isDataLoading", "isPageMovePending", "isPanelCountKnown", "getRecordNumberOffset",
    "refreshDataSource"];
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
  const ddCoord2: DeclaredKeys<QuestionMatrixDropdownModel> = "setDataSource";
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
  const mdCoord2: DeclaredKeys<QuestionMatrixDynamicModel> = "setDataSource";
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
  const pdCoord2: DeclaredKeys<QuestionPanelDynamicModel> = "setDataSource";
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

  // The shared helpers of the records questions are protected on every one of them.
  // @ts-expect-error protected
  const ddShared1: DeclaredKeys<QuestionMatrixDropdownModel> = "getDataSource";
  // @ts-expect-error protected
  const ddShared2: DeclaredKeys<QuestionMatrixDropdownModel> = "formatRecordDisplayValue";
  // @ts-expect-error protected
  const ddShared3: DeclaredKeys<QuestionMatrixDropdownModel> = "getRecordCountLimit";
  // @ts-expect-error protected
  const ddShared4: DeclaredKeys<QuestionMatrixDropdownModel> = "isRecordCountLimitedByPageMax";
  // @ts-expect-error protected
  const ddShared5: DeclaredKeys<QuestionMatrixDropdownModel> = "getPageSizePropertyName";
  // @ts-expect-error protected
  const ddShared6: DeclaredKeys<QuestionMatrixDropdownModel> = "onPageSizeAssigned";
  // @ts-expect-error a hook
  const ddShared7: DeclaredKeys<QuestionMatrixDropdownModel> = "getRecordVisibleIfPropertyName";
  // @ts-expect-error private
  const ddShared8: DeclaredKeys<QuestionMatrixDropdownModel> = "getRowsVisibleIfForRows";
  // @ts-expect-error protected
  const mdShared1: DeclaredKeys<QuestionMatrixDynamicModel> = "getDataSource";
  // @ts-expect-error protected
  const mdShared2: DeclaredKeys<QuestionMatrixDynamicModel> = "formatRecordDisplayValue";
  // @ts-expect-error protected
  const mdShared3: DeclaredKeys<QuestionMatrixDynamicModel> = "getRecordCountLimit";
  // @ts-expect-error protected
  const mdShared4: DeclaredKeys<QuestionMatrixDynamicModel> = "isRecordCountLimitedByPageMax";
  // @ts-expect-error protected
  const mdShared5: DeclaredKeys<QuestionMatrixDynamicModel> = "getPageSizePropertyName";
  // @ts-expect-error protected
  const mdShared6: DeclaredKeys<QuestionMatrixDynamicModel> = "onPageSizeAssigned";
  // @ts-expect-error a hook
  const mdShared7: DeclaredKeys<QuestionMatrixDynamicModel> = "getRecordVisibleIfPropertyName";
  // @ts-expect-error private
  const mdShared8: DeclaredKeys<QuestionMatrixDynamicModel> = "getRowsVisibleIfForRows";
  // @ts-expect-error protected
  const pdShared1: DeclaredKeys<QuestionPanelDynamicModel> = "getDataSource";
  // @ts-expect-error protected
  const pdShared2: DeclaredKeys<QuestionPanelDynamicModel> = "formatRecordDisplayValue";
  // @ts-expect-error protected
  const pdShared3: DeclaredKeys<QuestionPanelDynamicModel> = "getRecordCountLimit";
  // @ts-expect-error protected
  const pdShared4: DeclaredKeys<QuestionPanelDynamicModel> = "isRecordCountLimitedByPageMax";
  // @ts-expect-error protected
  const pdShared5: DeclaredKeys<QuestionPanelDynamicModel> = "getPageSizePropertyName";
  // @ts-expect-error protected
  const pdShared6: DeclaredKeys<QuestionPanelDynamicModel> = "onPageSizeAssigned";
  // @ts-expect-error a hook
  const pdShared7: DeclaredKeys<QuestionPanelDynamicModel> = "getRecordVisibleIfPropertyName";
  res.push(ddShared1, ddShared2, ddShared3, ddShared4, ddShared5, ddShared6, ddShared7, ddShared8, mdShared1, mdShared2, mdShared3, mdShared4, mdShared5,
    mdShared6, mdShared7, mdShared8, pdShared1, pdShared2, pdShared3, pdShared4, pdShared5, pdShared6, pdShared7);

  // The helpers the rows and panels share, and the record item the question creates, are not public either.
  // @ts-expect-error protected
  const ddItems1: DeclaredKeys<QuestionMatrixDropdownModel> = "collectNestedQuestionsOfItems";
  // @ts-expect-error protected
  const ddItems2: DeclaredKeys<QuestionMatrixDropdownModel> = "runTriggersOnItems";
  // @ts-expect-error protected
  const ddItems3: DeclaredKeys<QuestionMatrixDropdownModel> = "getRecordCountByExpressionValue";
  // @ts-expect-error protected
  const ddItems4: DeclaredKeys<QuestionMatrixDropdownModel> = "setDefaultRecordValues";
  // @ts-expect-error a hook
  const ddItems5: DeclaredKeys<QuestionMatrixDropdownModel> = "getRecordItemVariableName";
  // @ts-expect-error a hook
  const ddItems6: DeclaredKeys<QuestionMatrixDropdownModel> = "createRecordItemContext";
  // @ts-expect-error private
  const ddItems7: DeclaredKeys<QuestionMatrixDropdownModel> = "createRecordItem";
  // @ts-expect-error protected
  const mdItems1: DeclaredKeys<QuestionMatrixDynamicModel> = "collectNestedQuestionsOfItems";
  // @ts-expect-error protected
  const mdItems2: DeclaredKeys<QuestionMatrixDynamicModel> = "runTriggersOnItems";
  // @ts-expect-error protected
  const mdItems3: DeclaredKeys<QuestionMatrixDynamicModel> = "getRecordCountByExpressionValue";
  // @ts-expect-error protected
  const mdItems4: DeclaredKeys<QuestionMatrixDynamicModel> = "setDefaultRecordValues";
  // @ts-expect-error a hook
  const mdItems5: DeclaredKeys<QuestionMatrixDynamicModel> = "getRecordItemVariableName";
  // @ts-expect-error a hook
  const mdItems6: DeclaredKeys<QuestionMatrixDynamicModel> = "createRecordItemContext";
  // @ts-expect-error private
  const mdItems7: DeclaredKeys<QuestionMatrixDynamicModel> = "createRecordItem";
  // @ts-expect-error protected
  const pdItems1: DeclaredKeys<QuestionPanelDynamicModel> = "collectNestedQuestionsOfItems";
  // @ts-expect-error protected
  const pdItems2: DeclaredKeys<QuestionPanelDynamicModel> = "runTriggersOnItems";
  // @ts-expect-error protected
  const pdItems3: DeclaredKeys<QuestionPanelDynamicModel> = "getRecordCountByExpressionValue";
  // @ts-expect-error protected
  const pdItems4: DeclaredKeys<QuestionPanelDynamicModel> = "setDefaultRecordValues";
  // @ts-expect-error a hook
  const pdItems5: DeclaredKeys<QuestionPanelDynamicModel> = "getRecordItemVariableName";
  // @ts-expect-error a hook
  const pdItems6: DeclaredKeys<QuestionPanelDynamicModel> = "createRecordItemContext";
  // @ts-expect-error private
  const pdItems7: DeclaredKeys<QuestionPanelDynamicModel> = "createRecordItem";
  res.push(ddItems1, ddItems2, ddItems3, ddItems4, ddItems5, ddItems6, ddItems7, mdItems1, mdItems2, mdItems3, mdItems4, mdItems5, mdItems6,
    mdItems7, pdItems1, pdItems2, pdItems3, pdItems4, pdItems5, pdItems6, pdItems7);
  // The fixed matrix answers the visible-index and expression-item lookups the matrix rows ask for.
  const ddItemLookups: Array<DeclaredKeys<QuestionMatrixDropdownModel>> = ["getItemVisibleIndex", "getItemByVisibleIndex", "getExpressionItem"];
  res.push(ddItemLookups);
  return res;
}
