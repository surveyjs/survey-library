import { describe, test, expect } from "vitest";
import { FakeServerSource, serverRecords, createMatrix, createPanel, flush } from "./remote-source-integration-helpers";

describe("Records loading: the controls that would start a read or change the data", () => {
  test("matrix: Add Row is disabled while a page loads", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source);
    const addRow = question.toolbar.getActionById("sv-md-add-btn");
    expect(addRow.enabled, "#1").toBe(true);
    source.auto = false;
    question.nextPage();
    expect(addRow.enabled, "#2").toBe(false);
    source.settleAll();
    await flush();
    expect(addRow.enabled, "#3").toBe(true);
  });
  test("panel: Add, Previous and Next are disabled while a page loads", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createPanel(source, { displayMode: "carousel" });
    const ids = ["sv-pd-prev-btn", "sv-pd-next-btn", "sv-pd-add-btn"];
    const enabled = (): Array<boolean> => ids.map(id => question.footerToolbar.getActionById(id).enabled);
    expect(enabled(), "#1").toEqual([true, true, true]);
    source.auto = false;
    question.refreshDataSource();
    expect(enabled(), "#2").toEqual([false, false, false]);
    source.settleAll();
    await flush();
    expect(enabled(), "#3").toEqual([true, true, true]);
  });
  test("panel: Add follows the loading even when enableAddPanel was false on its first run", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createPanel(source);
    question.enableAddPanel = false;
    const add = question.footerToolbar.getActionById("sv-pd-add-btn");
    expect(add.enabled, "#1").toBe(false);
    question.enableAddPanel = true;
    expect(add.enabled, "#2").toBe(true);
    source.auto = false;
    question.refreshDataSource();
    expect(add.enabled, "#3: the loading was observed from the start").toBe(false);
  });
  test("panel: the tabs are disabled while a page loads", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createPanel(source, { displayMode: "tab" });
    const tabs = (): Array<boolean> => question.tabbedMenu.actions.map(action => action.enabled);
    expect(tabs().length > 0 && tabs().every(e => e === true), "#1").toBe(true);
    source.auto = false;
    question.refreshDataSource();
    expect(tabs().every(e => e === false), "#2").toBe(true);
    source.settleAll();
    await flush();
    expect(tabs().every(e => e === true), "#3").toBe(true);
  });
  test("the sort bar's '...' is disabled while a page loads", async () => {
    const source = new FakeServerSource(serverRecords(12));
    const { question } = await createMatrix(source, { allowSort: true, maxSortLevel: 2 });
    const more = question.recordsBar.sortActions.getActionById("sv-sort-more");
    expect(more.enabled, "#1").toBe(true);
    source.auto = false;
    question.refreshDataSource();
    expect(more.enabled, "#2").toBe(false);
    source.settleAll();
    await flush();
    expect(more.enabled, "#3").toBe(true);
  });
});
