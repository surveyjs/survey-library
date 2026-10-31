import { describe, test, expect, vi, afterEach } from "vitest";
import { createBound, createFilter, createSurvey } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterModal, filterModalCountDelay } from "../../src/filter/filter-modal";
import { Action } from "../../src/actions/action";

const presets = [
  { name: "adults", expression: "{age} > 18 and {country} = 'de'" },
  { name: "edges", expression: "{age} < 18 or {age} > 35" },
  { name: "smart", type: "ai", expression: "{age} > 60" }];
function control(over: any = {}): QuestionFilterModel {
  return <QuestionFilterModel>createSurvey(Object.assign({ items: presets, defaultItem: undefined }, over)).getQuestionByName("f1");
}
function trackEvents(q: QuestionFilterModel): { filter: number, uiState: number } {
  const survey = <SurveyModel>q.survey;
  const res = { filter: 0, uiState: 0 };
  survey.onFilterChanged.add(() => { res.filter++; });
  survey.onUIStateChanged.add((_, o) => { if (o.changedProperty === "filter") res.uiState++; });
  return res;
}
function chip(modal: FilterModal, name: string): Action {
  return <Action>modal.presetsToolbar.getActionById("sv-filter-modal-item-" + name);
}
// The editor question of a field, found by the field's position: the panels are named by index.
function fieldQ(modal: FilterModal, name: string): any {
  return modal.editor.survey.getQuestionByName("f" + modal.editor.fieldNames.indexOf(name) + "_value");
}
function operatorQ(modal: FilterModal, name: string): any {
  return modal.editor.survey.getQuestionByName("f" + modal.editor.fieldNames.indexOf(name) + "_operator");
}
afterEach(() => { vi.useRealTimers(); });

describe("FilterModal: the buffer", () => {
  test("opens with the control's state: the preset, its conditions in the fields, the search", () => {
    const q = control();
    q.toggleItem("adults");
    q.searchString = "an";
    const modal = q.createFilterModal();
    expect([modal.activeItemName, modal.searchString], "#1").toEqual(["adults", "an"]);
    expect(modal.editor.getConditions(), "#2").toEqual([
      { field: "country", operator: "equal", value: "de" }, { field: "age", operator: "greater", value: 18 }]);
    expect([chip(modal, "adults").active, chip(modal, "edges").active], "#3").toEqual([true, false]);
    expect(chip(modal, "smart").iconName, "#4").toBe("icon-sparkle-16x16");
    modal.dispose();
  });
  test("nothing is written until apply(); apply() writes everything with one event of each", () => {
    const q = control();
    q.toggleItem("adults");
    const events = trackEvents(q);
    const modal = q.createFilterModal();
    operatorQ(modal, "age").value = "less";
    modal.searchString = "an";
    expect([q.activeItemName, q.searchString, events.filter], "#1").toEqual(["adults", "", 0]);
    modal.apply();
    expect([q.activeItemName, q.searchString], "#2").toEqual(["", "an"]);
    expect(q.ownConditions, "#3").toEqual([{ field: "age", operator: "less", value: 18 }, { field: "country", operator: "equal", value: "de" }]);
    expect(events, "#4").toEqual({ filter: 1, uiState: 1 });
    modal.dispose();
  });
  test("apply() of a dialog that is already closed writes nothing", () => {
    const q = control();
    const modal = q.createFilterModal();
    modal.togglePreset(q.getItemByName("adults"));
    modal.dispose();
    expect(() => modal.apply(), "#1").not.toThrow();
    expect(q.activeItemName, "#2").toBe("");
  });
  test("closed without apply() writes nothing", () => {
    const q = control();
    const events = trackEvents(q);
    const modal = q.createFilterModal();
    operatorQ(modal, "age").value = "less";
    fieldQ(modal, "age").value = 5;
    modal.dispose();
    expect([q.filterExpression, events.filter]).toEqual(["", 0]);
  });
  test("a field edit turns the buffer's preset off and keeps its conditions with the edit", () => {
    const q = control();
    q.toggleItem("adults");
    const modal = q.createFilterModal();
    fieldQ(modal, "age").value = 30;
    expect([modal.activeItemName, chip(modal, "adults").active], "#1").toEqual(["", false]);
    expect(modal.state.conditions, "#2").toEqual([
      { field: "country", operator: "equal", value: "de" }, { field: "age", operator: "greater", value: 30 }]);
    modal.dispose();
  });
  test("a chip turns its preset on in the buffer and shows its conditions; again turns it off", () => {
    const q = control();
    const modal = q.createFilterModal();
    chip(modal, "adults").action();
    expect([modal.activeItemName, modal.state.conditions], "#1").toEqual(["adults", undefined]);
    expect(modal.editor.getConditions().length, "#2").toBe(2);
    chip(modal, "adults").action();
    expect([modal.activeItemName, modal.state.conditions, modal.editor.getConditions()], "#3").toEqual(["", [], []]);
    expect(q.activeItemName, "#4: nothing applied").toBe("");
    modal.dispose();
  });
  test("a preset that does not decompose: empty fields, and an edit replaces it", () => {
    const q = control();
    const modal = q.createFilterModal();
    chip(modal, "edges").action();
    expect([modal.editor.getConditions(), modal.state.conditions], "#1").toEqual([[], undefined]);
    fieldQ(modal, "age").value = 30;
    expect(modal.state, "#2: the field's default operator").toEqual({ activeItemName: "", conditions: [{ field: "age", operator: "equal", value: 30 }], searchString: "" });
    modal.dispose();
  });
  test("Clear All empties the buffer and keeps the search", () => {
    const q = control();
    q.toggleItem("adults");
    q.searchString = "an";
    const modal = q.createFilterModal();
    modal.clearAll();
    expect(modal.state, "#1").toEqual({ activeItemName: "", conditions: [], searchString: "an" });
    expect(modal.editor.getConditions(), "#2").toEqual([]);
    modal.apply();
    expect([q.activeItemName, q.filterExpression === q.composeFilterExpression({ activeItemName: "", conditions: [], searchString: "an" })], "#3")
      .toEqual(["", true]);
    modal.dispose();
  });
  test("single mode: no presets to pick; the fields go over its preset", () => {
    const q = control({ allowMultipleItems: false, defaultItem: "adults" });
    const modal = q.createFilterModal();
    expect(modal.presetsToolbar.actions.length, "#1").toBe(0);
    fieldQ(modal, "age").value = 30;
    modal.apply();
    expect([q.activeItem.name, q.isActiveItemModified], "#2").toEqual(["adults", true]);
    modal.dispose();
  });
  test("in the designer: read-only, the chips do nothing and apply() writes nothing", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }], items: presets }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const modal = q.createFilterModal();
    expect([modal.isReadOnly, chip(modal, "adults").enabled], "#1").toEqual([true, false]);
    modal.apply();
    expect(q.activeItemName, "#2").toBe("");
    modal.dispose();
  });
});

describe("FilterModal: Show N items", () => {
  test("the records are counted at once on open, and again after the edits stop", async () => {
    vi.useFakeTimers();
    const q = <QuestionFilterModel>createBound().getQuestionByName("f1");
    const spy = vi.spyOn(q, "countFilterResults");
    const modal = q.createFilterModal();
    expect(spy.mock.calls.length, "#1: at once").toBe(1);
    await vi.runAllTimersAsync();
    expect([modal.resultCount, modal.showResultsText], "#2").toEqual([3, "Show 3 items"]);
    chip(modal, "de").action();
    expect([modal.isCounting, modal.showResultsText], "#3: while counting").toEqual([true, "Show results"]);
    vi.advanceTimersByTime(filterModalCountDelay - 1);
    expect(spy.mock.calls.length, "#4: not yet").toBe(1);
    await vi.advanceTimersByTimeAsync(1);
    expect([spy.mock.calls.length, spy.mock.calls[1][0]], "#5").toEqual([2, "{country} = 'de'"]);
    expect(modal.showResultsText, "#6").toBe("Show 1 item");
    modal.dispose();
  });
  test("an answer to an older count is dropped", async () => {
    vi.useFakeTimers();
    const q = control();
    const answers: Array<(n: number) => void> = [];
    vi.spyOn(q, "countFilterResults").mockImplementation((): Promise<number> => new Promise((resolve) => { answers.push(resolve); }));
    const modal = q.createFilterModal();
    modal.searchString = "an";
    await vi.advanceTimersByTimeAsync(filterModalCountDelay);
    answers[1](5);
    answers[0](9);
    await Promise.resolve();
    expect(modal.resultCount).toBe(5);
    modal.dispose();
  });
  test("an answer that arrives after the dialog is closed changes nothing", async () => {
    const q = control();
    let answer: (n: number) => void;
    vi.spyOn(q, "countFilterResults").mockImplementation((): Promise<number> => new Promise((resolve) => { answer = resolve; }));
    const modal = q.createFilterModal();
    modal.dispose();
    answer(4);
    await Promise.resolve();
    expect(modal.resultCount).toBe(undefined);
  });
  test("a control that cannot count: Show results", async () => {
    const modal = createFilter().createFilterModal();
    await Promise.resolve();
    expect([modal.resultCount, modal.showResultsText]).toEqual([undefined, "Show results"]);
    modal.dispose();
  });
});
