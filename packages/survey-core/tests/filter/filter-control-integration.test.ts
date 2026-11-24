import { describe, test, expect, afterEach } from "vitest";
import { createBound, countTargetWrites, onCombinedExpressionChanged } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { FunctionFactory } from "../../src/functionsfactory";

// The keys live on the paging controller: the question's public surface for control filters is
// setControlFilter/getControlFilter and nothing else, so the observation reaches past it.
function controlFilterKeys(question: any): Array<string> {
  return question.paging.getControlFilterKeys();
}

describe("Filter control: bound mode", () => {
  test("the control writes its expression into the matrix as a filter part", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }], filterExpression: "{country} notempty" },
      { type: "filter", name: "f1", targetQuestion: "m", presets: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    matrix.value = [{ country: "de" }, { country: "fr" }, { country: "" }];
    control.togglePreset("de");
    expect(matrix.visibleRows.length, "#1").toBe(1);
    expect(matrix.filterExpression, "#2: the authored part is untouched").toBe("{country} notempty");
  });
  test("the control takes its fields from the target's columns", () => {
    const survey = createBound();
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(control.getFilterFields().map((f: any) => f.name)).toEqual(["country", "price"]);
  });
  test("a change is one write of combinedExpression into the target, and the rows follow it", () => {
    const survey = createBound();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const writes = countTargetWrites(matrix);
    (<QuestionFilterModel>survey.getQuestionByName("f1")).togglePreset("de");
    expect(writes, "#1").toEqual(["{country} = 'de'"]);
    expect(matrix.visibleRows.length, "#2").toBe(1);
  });
  test("a control with no target composes combinedExpression for the application to read", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1",
      fields: [{ name: "age" }], presets: [{ name: "adults", expression: "{age} > 18" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const changes: Array<string> = [];
    onCombinedExpressionChanged(q, (expression: string) => { changes.push(expression); });
    q.togglePreset("adults");
    expect(changes, "#1: one change").toEqual(["{age} > 18"]);
    expect(q.combinedExpression, "#2").toBe("{age} > 18");
  });
  test("a target that is not a matrix or a panel does nothing", () => {
    // The control declares fields of its own, so "no source fields" and "the standalone list" are
    // two different answers here: an empty result would have been indistinguishable from either.
    const survey = new SurveyModel({ elements: [{ type: "text", name: "t" },
      { type: "filter", name: "f1", targetQuestion: "t", fields: [{ name: "x" }, { name: "y" }],
        presets: [{ name: "a", expression: "{x} = 1" }] }] });
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.togglePreset("a");
    expect(control.getFilterFields().map((f: any) => f.name),
      "#1: a source that cannot be filtered is no source, so the own fields answer").toEqual(["x", "y"]);
    expect(control.combinedExpression, "#2: it still composes its own").toBe("{x} = 1");
  });
  test("two controls filter the same matrix without overwriting each other", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }, { name: "price" }] },
      { type: "filter", name: "f1", targetQuestion: "m", presets: [{ name: "de", expression: "{country} = 'de'" }] },
      { type: "filter", name: "f2", targetQuestion: "m", presets: [{ name: "cheap", expression: "{price} < 100" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ country: "de", price: 50 }, { country: "de", price: 500 }, { country: "fr", price: 50 }];
    const f1 = <QuestionFilterModel>survey.getQuestionByName("f1");
    const f2 = <QuestionFilterModel>survey.getQuestionByName("f2");
    f1.togglePreset("de");
    expect(matrix.visibleRows.length, "#1").toBe(2);
    f2.togglePreset("cheap");
    expect(matrix.visibleRows.length, "#2: both parts apply").toBe(1);
    f1.togglePreset("de");
    expect(matrix.visibleRows.length, "#3: clearing one leaves the other").toBe(2);
  });
  test("a disposed control clears its part", () => {
    const survey = createBound();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.togglePreset("de");
    const key = (<any>control).controlFilterKey;
    expect(matrix.getControlFilter(key), "#1").toBe("{country} = 'de'");
    control.dispose();
    expect(matrix.getControlFilter(key), "#2").toBe("");
    expect(matrix.visibleRows.length, "#3: and the rows came back").toBe(3);
  });
  test("re-pointing targetQuestion detaches the old question and attaches the new one", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m1", columns: [{ name: "country" }] },
      { type: "matrixdynamic", name: "m2", columns: [{ name: "country" }] },
      { type: "filter", name: "f1", targetQuestion: "m1", presets: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const m1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m1");
    const m2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m2");
    m1.value = [{ country: "de" }, { country: "fr" }];
    m2.value = [{ country: "de" }, { country: "fr" }];
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    const key = (<any>control).controlFilterKey;
    control.togglePreset("de");
    expect(m1.visibleRows.length, "#1").toBe(1);
    control.targetQuestion = "m2";
    expect(m1.getControlFilter(key), "#2: the old question keeps no ghost filter").toBe("");
    expect(m1.visibleRows.length, "#3").toBe(2);
    expect(m2.visibleRows.length, "#4: and the new one is filtered").toBe(1);
  });
  test("re-pointing targetQuestion recomposes the expression before it is written anywhere", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m1", columns: [{ name: "country" }] },
      { type: "matrixdynamic", name: "m2", columns: [{ name: "city" }] },
      { type: "filter", name: "f1", targetQuestion: "m1", showSearchBar: true,
        presets: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const m2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m2");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.togglePreset("de");
    control.searchString = "xx";
    const writes = countTargetWrites(m2);
    control.targetQuestion = "m2";
    const expected = "({country} = 'de') and ({city} contains 'xx')";
    expect(writes, "#1: one move, one write, and the search quotes the fields of the target it moved to")
      .toEqual([expected]);
    expect(m2.getControlFilter((<any>control).controlFilterKey), "#4: and that is what was written")
      .toBe(expected);
  });
  test("an applicable defaultPreset filters the target from the load on", () => {
    const survey = new SurveyModel();
    survey.fromJSON({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }] },
      { type: "filter", name: "f1", targetQuestion: "m", defaultPreset: "de",
        presets: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(matrix.getControlFilter((<any>control).controlFilterKey), "#4: and the matrix carries it")
      .toBe("{country} = 'de'");
  });
  test("a field is found by its own name before another field's value path", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", presets: [],
      fields: [{ name: "x", valueName: "y" }, { name: "y" }] }] });
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(control.getFieldByName("y").name, "#1: the name wins over another field's valueName")
      .toBe("y");
    expect(control.getFieldByName("x").valueName, "#2: and the other one is still reachable")
      .toBe("y");
  });
  test("a control on a later page filters a matrix on the first one", () => {
    const survey = new SurveyModel({ pages: [
      { name: "p1", elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "country" }] }] },
      { name: "p2", elements: [{ type: "filter", name: "f1", targetQuestion: "m",
        presets: [{ name: "de", expression: "{country} = 'de'" }], defaultPreset: "de" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ country: "de" }, { country: "fr" }];
    expect(matrix.visibleRows.length, "#1: resolved by name across pages, not by the visible page").toBe(1);
  });
  test("a control on the first page filters a matrix on a later one", () => {
    const survey = new SurveyModel({ pages: [
      { name: "p1", elements: [{ type: "filter", name: "f1", targetQuestion: "m",
        presets: [{ name: "de", expression: "{country} = 'de'" }], defaultPreset: "de" }] },
      { name: "p2", elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "country" }] }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ country: "de" }, { country: "fr" }];
    expect(matrix.visibleRows.length, "#1: the control loads before the matrix and is not lost").toBe(1);
  });
  test("renaming the control does not leave a ghost filter", () => {
    const survey = createBound();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.togglePreset("de");
    const before = matrix.visibleRows.length;
    control.name = "renamed";
    expect(controlFilterKeys(matrix), "#1: the key is not the name, so the rename changes nothing")
      .toEqual([(<any>control).controlFilterKey]);
    expect(matrix.visibleRows.length, "#2").toBe(before);
  });
  test("a control bound to a dynamic panel filters its panels", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p", panelCount: 3,
        templateElements: [{ type: "text", name: "country" }] },
      { type: "filter", name: "f1", targetQuestion: "p", presets: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    panel.value = [{ country: "de" }, { country: "fr" }, { country: "de" }];
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(control.getFilterFields().map((f: any) => f.valueName), "#1").toEqual(["country"]);
    control.togglePreset("de");
    expect(panel.visiblePanels.length, "#2").toBe(2);
    expect(panel.getControlFilter((<any>control).controlFilterKey), "#3")
      .toBe("{country} = 'de'");
  });
  test("design mode never reaches the target", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }] },
      { type: "filter", name: "f1", targetQuestion: "m", defaultPreset: "de",
        presets: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(controlFilterKeys(matrix), "#1").toEqual([]);
    control.togglePreset("de");
    expect(controlFilterKeys(matrix), "#2: a click in the designer filters nothing").toEqual([]);
    expect(control.combinedExpression, "#3").toBe("");
  });
  test("deleting the target question leaves no filter on it", () => {
    const survey = createBound();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    const key = (<any>control).controlFilterKey;
    control.togglePreset("de");
    expect(matrix.visibleRows.length, "#1").toBe(1);
    survey.pages[0].removeElement(matrix);
    // Pinned as it is and not as it would ideally be: the removal itself is not reported to the
    // control, so the filter is still on the question that was taken out. The control re-resolves
    // its source on the next runCondition, which is the next change of a survey value, and that is
    // when the question it left is cleared.
    expect(matrix.getControlFilter(key), "#2: the removal alone does not reach the control")
      .toBe("{country} = 'de'");
    survey.setValue("somethingelse", 1);
    expect(matrix.getControlFilter(key), "#3: the next runCondition detaches it").toBe("");
    expect(controlFilterKeys(matrix), "#4: and nothing is left behind").toEqual([]);
    expect(control.combinedExpression, "#5: the control keeps composing its own expression")
      .toBe("{country} = 'de'");
    control.togglePreset("de");
    expect(control.combinedExpression, "#6: and it still answers, with nothing to write into")
      .toBe("");
  });
  test("a control whose targetQuestion names nothing keeps composing its own expression", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }] },
      { type: "filter", name: "f1", targetQuestion: "nosuchquestion",
        presets: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.togglePreset("de");
    expect(control.combinedExpression, "#1").toBe("{country} = 'de'");
    expect(controlFilterKeys(matrix), "#2: nothing was written anywhere").toEqual([]);
  });
  test("the whole scenario: a bound control, its search, its writes and its saved state", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "orders", filterExpression: "{price} notempty", columns: [
        { name: "country", cellType: "dropdown",
          choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }] },
        { name: "price", cellType: "text", inputType: "number" }] },
      { type: "filter", name: "f", targetQuestion: "orders", showSearchBar: true,
        presets: [{ name: "cheap", expression: "{price} < 100" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("orders");
    const raised = countTargetWrites(matrix);
    matrix.value = [{ country: "de", price: 50 }, { country: "fr", price: 500 }, { country: "de", price: null }];
    const control = <QuestionFilterModel>survey.getQuestionByName("f");
    expect(control.getFilterFields().map((f: any) => f.name), "#1: the source columns").toEqual(["country", "price"]);
    expect(matrix.visibleRows.length, "#2: the authored filter alone").toBe(2);
    control.togglePreset("cheap");
    expect(matrix.visibleRows.length, "#3: and the control on top of it").toBe(1);
    control.searchString = "Germ";
    expect(control.combinedExpression, "#4: the item and the search over every field")
      .toBe("({price} < 100) and ({country} anyof ['de'] or {price} contains 'Germ')");
    expect(matrix.filterExpression, "#5: the authored expression is untouched").toBe("{price} notempty");
    expect(survey.uiState.questions["f"], "#6: what the respondent did is saved state")
      .toEqual({ filter: { selectedPreset: "cheap", searchString: "Germ" } });
    expect(raised, "#7: one write per change, and none before the first one - this control has no defaultPreset")
      .toEqual(["{price} < 100", "({price} < 100) and ({country} anyof ['de'] or {price} contains 'Germ')"]);
  });
  test("searchFields name a bound nested field by its dotted value path", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p", panelCount: 2, templateElements: [
        { type: "multipletext", name: "mt", items: [{ name: "city" }] }] },
      { type: "filter", name: "f1", targetQuestion: "p", showSearchBar: true, searchFields: ["mt.city"],
        presets: [] }] });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    panel.value = [{ mt: { city: "Berlin" } }, { mt: { city: "Paris" } }];
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.searchString = "Ber";
    expect(control.combinedExpression, "#1").toBe("{mt.city} contains 'Ber'");
    expect(panel.visiblePanels.length, "#2").toBe(1);
  });
  test("a control taken off its page clears its part and brings it back when it is put back", () => {
    const survey = createBound();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.togglePreset("de");
    expect(matrix.visibleRows.length, "#1").toBe(1);
    survey.pages[0].removeElement(control);
    expect(controlFilterKeys(matrix), "#2: the removal alone detaches it").toEqual([]);
    expect(matrix.visibleRows.length, "#3").toBe(3);
    survey.pages[0].addElement(control);
    expect(controlFilterKeys(matrix), "#4").toEqual([(<any>control).controlFilterKey]);
    expect(matrix.visibleRows.length, "#5").toBe(1);
  });
  test("a control that is off its page does not attach to a target it is re-pointed to", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m1", columns: [{ name: "country" }] },
      { type: "matrixdynamic", name: "m2", columns: [{ name: "country" }] },
      { type: "filter", name: "f1", targetQuestion: "m1", defaultPreset: "de",
        presets: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const m2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m2");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    survey.pages[0].removeElement(control);
    control.targetQuestion = "m2";
    expect(controlFilterKeys(m2), "#1: a removed control still reaches the survey, but filters nothing")
      .toEqual([]);
  });
  test("a control whose page is removed clears its part", () => {
    const survey = new SurveyModel({ pages: [
      { name: "p1", elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "country" }] }] },
      { name: "p2", elements: [{ type: "filter", name: "f1", targetQuestion: "m", defaultPreset: "de",
        presets: [{ name: "de", expression: "{country} = 'de'" }] }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ country: "de" }, { country: "fr" }];
    expect(matrix.visibleRows.length, "#1").toBe(1);
    survey.removePage(survey.pages[1]);
    expect(controlFilterKeys(matrix), "#2").toEqual([]);
    expect(matrix.visibleRows.length, "#3").toBe(2);
  });
  test("changing the id does not orphan the part the control has written", () => {
    const survey = createBound();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.togglePreset("de");
    control.id = "customId";
    control.togglePreset("de");
    expect(controlFilterKeys(matrix), "#1: the key does not follow the id").toEqual([]);
    expect(matrix.visibleRows.length, "#2").toBe(3);
  });
  test("re-pointing the target to one where the expression becomes empty writes the change", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m1", columns: [{ name: "city" }] },
      { type: "matrixdynamic", name: "m2", columns: [{ name: "doc", cellType: "file" }] },
      { type: "filter", name: "f1", targetQuestion: "m1", showSearchBar: true, presets: [] }] });
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.searchString = "Ber";
    expect(control.combinedExpression, "#1").toBe("{city} contains 'Ber'");
    const writes = countTargetWrites(survey.getQuestionByName("m2"));
    control.targetQuestion = "m2";
    expect(control.combinedExpression, "#2: nothing on m2 can be searched").toBe("");
    expect(writes, "#3: the target hears the change").toEqual([""]);
  });
  test("a column that shows the matrix choices is searched by their display text", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m",
        choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }],
        columns: [{ name: "country" }] },
      { type: "filter", name: "f1", targetQuestion: "m", showSearchBar: true, presets: [] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ country: "de" }, { country: "fr" }];
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.searchString = "Germ";
    expect(control.combinedExpression, "#1: the cells show the matrix choices").toBe("{country} anyof ['de']");
    expect(matrix.visibleRows.length, "#2").toBe(1);
  });
});

/* The control filter entrance of the records questions, as a question exposes it. These tests lived
   in the matrix, panel and page-window test files; they are kept here, next to the control that
   writes through the entrance, so that the records questions' own test files stay upstream's. */
describe("Filter control: the control filter entrance of the records questions", () => {
  test("a control filter applies next to the authored one and is not serialized", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 3,
      columns: [{ name: "c1" }], filterExpression: "{c1} != 'z'" }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ c1: "a" }, { c1: "b" }, { c1: "z" }];
    expect(matrix.visibleRows.length, "#1: the authored filter alone").toBe(2);
    matrix.setControlFilter("control", "{c1} = 'a'");
    expect(matrix.visibleRows.length, "#2: both").toBe(1);
    expect(matrix.filterExpression, "#3: the authored expression is untouched").toBe("{c1} != 'z'");
    expect(matrix.toJSON().filterExpression, "#4: and it is the only one emitted").toBe("{c1} != 'z'");
  });
  test("a broken control filter is reported and does not touch the authored one", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 3,
      columns: [{ name: "c1" }], filterExpression: "{c1} != 'z'" }] });
    const errors: Array<string> = [];
    survey.onDynamicDataError.add((_, options) => { errors.push(options.operation); });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ c1: "a" }, { c1: "b" }, { c1: "z" }];
    matrix.setControlFilter("control", "{c1} = ");
    // "read": it is the read of the view that the filter made impossible.
    expect(errors, "#1").toEqual(["read"]);
    expect(matrix.filterExpression, "#2: the author is not punished for it").toBe("{c1} != 'z'");
    expect(matrix.visibleRows.length, "#3: and the authored filter still runs").toBe(2);
  });
  test("a control filter survives a change of the authored filter", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", panelCount: 3,
      templateElements: [{ type: "text", name: "q1" }] }] });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    panel.value = [{ q1: "a" }, { q1: "b" }, { q1: "c" }];
    panel.setControlFilter("control", "{q1} = 'a'");
    expect(panel.visiblePanels.length, "#1").toBe(1);
    panel.filterExpression = "{q1} != 'c'";
    expect(panel.getControlFilter("control"), "#2: the control filter is still there").toBe("{q1} = 'a'");
    panel.setControlFilter("control", "");
    expect(panel.visiblePanels.length, "#3: back to the authored expression alone").toBe(2);
  });
  // Every records question shares the filtering API, the fixed matrix included: its rows are records
  // the list filters, and its columns are the fields, as they are for the dynamic matrix.
  test("a control bound to a fixed matrix offers its columns and filters its rows", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdropdown", name: "m", rows: ["r1", "r2", "r3"], columns: [{ name: "country" }, { name: "price" }] },
      { type: "filter", name: "f1", targetQuestion: "m", presets: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    matrix.value = { r1: { country: "de", price: 50 }, r2: { country: "fr", price: 500 }, r3: { country: "gb", price: 5 } };
    expect(control.getFilterFields().map((f: any) => f.name), "#1: the columns are the fields").toEqual(["country", "price"]);
    control.togglePreset("de");
    expect(matrix.visibleRows.map(row => row.rowName), "#2: the rows the control lets through").toEqual(["r1"]);
    expect(matrix.filterExpression, "#3: the authored expression is untouched").toBe("");
    expect(matrix.toJSON().filterExpression, "#4: and nothing is serialized").toBeUndefined();
    control.togglePreset("de");
    expect(matrix.visibleRows.length, "#5: clearing the item gives every row back").toBe(3);
  });
  /* The fixed matrix answers item, rowName, rowValue and rowTitle from the row itself, and a column of
     the same value name loses to them (see its getFields): a filter by it would read the row, not the
     cell. Such a column is not offered as a field. */
  test("a fixed matrix does not offer a column named like one of its row fields", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdropdown", name: "m", rows: ["r1", "r2"], columns: [{ name: "item" }, { name: "rowTitle" }, { name: "price" }] },
      { type: "filter", name: "f1", targetQuestion: "m" }] });
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(control.getFilterFields().map((f: any) => f.name)).toEqual(["price"]);
  });
  describe("a page move that waits for asynchronous validators", () => {
    const results: Array<(res: any) => void> = [];
    function asyncPageFunc(params: any): any {
      results.push(this.returnResult);
      return false;
    }
    afterEach(() => {
      FunctionFactory.Instance.unregister("asyncPageFunc");
    });
    test("a control filter drops the pending move as the authored one does", () => {
      results.length = 0;
      FunctionFactory.Instance.register("asyncPageFunc", asyncPageFunc, true);
      const records = new Array<any>();
      for (let i = 0; i < 20; i++) records.push({ id: i, name: "n" + i });
      const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "pd", pageSize: 5,
        templateElements: [{ type: "text", name: "id" },
          { type: "text", name: "name", validators: [{ type: "expression", expression: "asyncPageFunc({panel.id}) = 1" }] }] }] });
      survey.data = { pd: records };
      const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
      question.nextPage();
      expect(question.isPageMovePending, "#1").toBe(true);
      question.setControlFilter("control", "{id} >= 5");
      expect(question.isPageMovePending, "#2: a control filter drops it").toBe(false);
      expect(question.pageIndex, "#3: the new view starts on its first page").toBe(0);
      results.forEach(setResult => setResult(1));
      expect(question.pageIndex, "#4: the dropped move did not happen").toBe(0);
      expect(question.panels[0].getQuestionByName("id").value, "#5: and the page is the filtered one").toBe(5);
    });
  });
});
