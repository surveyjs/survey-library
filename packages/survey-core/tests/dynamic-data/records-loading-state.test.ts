import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { FakeServerSource, serverRecords, flush } from "./remote-source-integration-helpers";

function createMatrixWith(source: FakeServerSource, json?: any): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({
    type: "matrixdynamic", name: "matrix", rowCount: 0, pageSize: 5, columns: [{ name: "col1" }] }, json)] });
  const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
  question.dataSource = source;
  return question;
}
function createPanelWith(source: FakeServerSource, json?: any): QuestionPanelDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({
    type: "paneldynamic", name: "panel", panelCount: 0, pageSize: 5,
    templateElements: [{ type: "text", name: "col1" }] }, json)] });
  const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
  question.dataSource = source;
  return question;
}
// A server that answers when the test says so.
function deferred(records: Array<any>): FakeServerSource {
  const source = new FakeServerSource(records);
  source.auto = false;
  return source;
}

describe("Records loading: what the renderers read", () => {
  test("isDataSourceAssigned follows the assigned source and is reactive", async () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0, columns: [{ name: "col1" }] }] });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const changes: Array<boolean> = [];
    question.registerPropertyChangedHandlers(["isDataSourceAssigned"], () => { changes.push(question.isDataSourceAssigned); });
    expect(question.isDataSourceAssigned, "#1").toBe(false);
    question.dataSource = new FakeServerSource(serverRecords(3));
    await flush();
    expect(question.isDataSourceAssigned, "#2").toBe(true);
    question.dataSource = undefined;
    expect(question.isDataSourceAssigned, "#3").toBe(false);
    expect(changes, "#4").toEqual([true, false]);
  });
  test("removing the source while it loads leaves neither the container nor the loading state", () => {
    const question = createMatrixWith(deferred(serverRecords(10)));
    expect([question.isDataSourceAssigned, question.isDataLoading], "#1").toEqual([true, true]);
    question.dataSource = undefined;
    expect([question.isDataSourceAssigned, question.isDataLoading], "#2").toEqual([false, false]);
  });
  test("matrix: the container css, its parts and the label follow the read", async () => {
    const source = deferred(serverRecords(10));
    const question = createMatrixWith(source);
    expect(question.getRecordsContentCss(), "#1: the first read").toBe("sd-records__content sd-records__content--loading sd-records__content--first-loading");
    expect(question.cssClasses.recordsBody, "#2").toBe("sd-records__body");
    expect(question.cssClasses.recordsLoadingOverlay, "#3").toBe("sd-records__loading-overlay");
    expect(question.loadingIndicatorAriaLabel, "#4").toBe("Loading...");
    source.settleAll();
    await flush();
    expect(question.getRecordsContentCss(), "#5").toBe("sd-records__content");
    question.refreshDataSource();
    expect(question.getRecordsContentCss(), "#6: a reload keeps the height of what it shows").toBe("sd-records__content sd-records__content--loading");
  });
  test("panel: the container css follows the read", async () => {
    const source = deferred(serverRecords(10));
    const question = createPanelWith(source);
    expect(question.getRecordsContentCss(), "#1").toBe("sd-records__content sd-records__content--loading sd-records__content--first-loading");
    source.settleAll();
    await flush();
    expect(question.getRecordsContentCss(), "#2").toBe("sd-records__content");
  });
  test("panel: no 'No entries' placeholder while the first page loads, and no empty root", async () => {
    const source = deferred([]);
    const question = createPanelWith(source);
    expect(question.getShowNoEntriesPlaceholder(), "#1").toBe(false);
    expect(question.getRootCss().indexOf("sd-question--empty"), "#2").toBe(-1);
    source.settleAll();
    await flush();
    expect(question.getShowNoEntriesPlaceholder(), "#3: nothing came").toBe(true);
  });
  test("panel: the Add button stops pointing at the placeholder while loading, and again after", async () => {
    const source = deferred([]);
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "panel", panelCount: 0, pageSize: 5,
      templateElements: [{ type: "text", name: "col1" }] }] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const addButton = question.footerToolbar.getActionById("sv-pd-add-btn");
    expect(addButton.ariaDescribedBy, "#1: no source, the placeholder shows").toBe(question.noEntriesTextId);
    question.dataSource = source;
    expect(addButton.ariaDescribedBy, "#2: loading, no placeholder").toBeUndefined();
    source.settleAll();
    await flush();
    expect(addButton.ariaDescribedBy, "#3").toBe(question.noEntriesTextId);
  });
  test("matrix: no 'No rows' placeholder while the first page loads, and no empty root", async () => {
    const source = deferred([]);
    const question = createMatrixWith(source, { hideColumnsIfEmpty: true });
    expect(question.renderedTable.showTable, "#1").toBe(false);
    expect(question.showNoRowsPlaceholder, "#2: loading").toBe(false);
    expect(question.getRootCss().indexOf("sd-question--empty"), "#3").toBe(-1);
    source.settleAll();
    await flush();
    expect(question.showNoRowsPlaceholder, "#4: nothing came").toBe(true);
    expect(question.getRootCss().indexOf("sd-question--empty") > -1, "#5").toBe(true);
  });
  test("panel: a reload of an empty page keeps the 'No entries' placeholder: nothing flickers", async () => {
    const source = deferred([]);
    const question = createPanelWith(source);
    source.settleAll();
    await flush();
    expect(question.getShowNoEntriesPlaceholder(), "#1").toBe(true);
    question.refreshDataSource();
    expect(question.isDataLoading, "#2").toBe(true);
    expect(question.getShowNoEntriesPlaceholder(), "#3: the placeholder stays under the overlay").toBe(true);
  });
  test("matrix: a reload of an empty page keeps the 'No rows' placeholder and the empty root", async () => {
    const source = deferred([]);
    const question = createMatrixWith(source, { hideColumnsIfEmpty: true });
    source.settleAll();
    await flush();
    question.refreshDataSource();
    expect(question.isDataLoading, "#1").toBe(true);
    expect(question.showNoRowsPlaceholder, "#2").toBe(true);
    expect(question.getRootCss().indexOf("sd-question--empty") > -1, "#3").toBe(true);
  });
  test("matrix without a source: showNoRowsPlaceholder is the table's absence", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "matrix", rowCount: 0,
      hideColumnsIfEmpty: true, columns: [{ name: "col1" }] }] });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect([question.renderedTable.showTable, question.showNoRowsPlaceholder], "#1").toEqual([false, true]);
  });
});
