import { describe, test, expect } from "vitest";
import { createFilter, createSurvey, onCombinedExpressionChanged } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterConditionsEditor } from "../../src/filter/filter-conditions-editor";
import { Question } from "../../src/question";

const presets = [
  { name: "adults", expression: "{age} > 18 and {country} = 'de'" },
  { name: "edges", expression: "{age} < 18 or {age} > 35" },
  { name: "kids", expression: "{age} <= 18" }
];
function createControl(over: any = {}): QuestionFilterModel {
  return <QuestionFilterModel>createSurvey(Object.assign({ presets: presets }, over)).getQuestionByName("f1");
}
// Counts what a call changes: combinedExpression, and onUIStateChanged for this control only.
function trackEvents(q: QuestionFilterModel): { filter: number, uiState: number } {
  const survey = <SurveyModel>q.survey;
  const res = { filter: 0, uiState: 0 };
  onCombinedExpressionChanged(q, () => { res.filter++; });
  survey.onUIStateChanged.add((_, o) => { if (o.changedProperty === "filter") res.uiState++; });
  return res;
}
// The editor's questions for a field, found by the field's position: the panels are named by index.
function panelIndex(editor: FilterConditionsEditor, name: string): number {
  return editor.fieldNames.indexOf(name);
}
function operatorQ(editor: FilterConditionsEditor, name: string): Question {
  return editor.survey.getQuestionByName("f" + panelIndex(editor, name) + "_operator");
}
function valueQ(editor: FilterConditionsEditor, name: string): Question {
  return editor.survey.getQuestionByName("f" + panelIndex(editor, name) + "_value");
}
function searchQ(editor: FilterConditionsEditor): Question {
  return editor.survey.getQuestionByName("search");
}

describe("The Filters dialog's editor: the editor survey", () => {
  test("every field, prefilled from the active preset, and a search question on top", () => {
    const q = createControl();
    const editor = q.createAllFiltersEditor();
    expect(editor.fieldNames, "#1").toEqual(["name", "country", "age"]);
    const search = searchQ(editor);
    expect(!!search, "#2").toBe(true);
    expect(search.getType(), "#3").toBe("text");
    expect((<any>search).textUpdateMode, "#4").toBe("onTyping");
    expect(editor.survey.pages[0].elements[0].name, "#5: on top").toBe("search");
    expect(operatorQ(editor, "age").value, "#6").toBe("greater");
    expect(valueQ(editor, "age").value, "#7").toBe(18);
    expect(valueQ(editor, "country").value, "#8").toBe("de");
    expect(editor.isReadOnly, "#9").toBe(false);
    editor.dispose();
  });
  test("every field's panel is titled by the field, in the control's locale; the search box has the control's placeholder", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearchBar: true, fields: [
      { name: "country", title: { default: "Country", de: "Land" }, fieldType: "dropdown", choices: ["de"] }, { name: "age" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    let editor = q.createAllFiltersEditor();
    expect(editor.survey.getPanelByName("f0").title, "#1").toBe("Country");
    expect(editor.survey.getPanelByName("f1").title, "#2: a field with no title is named by its name").toBe("age");
    expect(searchQ(editor).placeholder, "#3").toBe("Search by Country or age");
    editor.dispose();
    survey.locale = "de";
    editor = q.createAllFiltersEditor();
    expect(editor.survey.getPanelByName("f0").title, "#4").toBe("Land");
    editor.dispose();
    survey.locale = "";
  });
  test("the search question is prefilled with searchString", () => {
    const q = createControl();
    q.searchString = "an";
    const editor = q.createAllFiltersEditor();
    expect(searchQ(editor).value, "#1").toBe("an");
    editor.dispose();
  });
  test("showSearchBar false: no search question", () => {
    const q = createControl({ showSearchBar: false });
    const editor = q.createAllFiltersEditor();
    expect(!!searchQ(editor), "#1").toBe(false);
    expect(editor.survey.pages[0].elements.length, "#2: one panel per field only").toBe(3);
    editor.dispose();
  });
  test("a duplicate valueName is shown once, by its first field", () => {
    const q = createFilter({ fields: [{ name: "country" }, { name: "country2", valueName: "country" }, { name: "age" }] });
    const editor = q.createAllFiltersEditor();
    expect(editor.fieldNames, "#1").toEqual(["country", "age"]);
    editor.dispose();
  });
  test("a field hidden from the quick filters is in the Filters dialog", () => {
    const q = createFilter({ fields: [{ name: "name" }, { name: "country", showInQuickFilters: false }] });
    const editor = q.createAllFiltersEditor();
    expect(editor.fieldNames, "#1").toEqual(["name", "country"]);
    editor.dispose();
  });
  test("a field whose valueName is another field's name is reached by its own name", () => {
    const q = createFilter({ fields: [{ name: "a", valueName: "b" }, { name: "b", valueName: "c" }] });
    const editor = q.createAllFiltersEditor();
    expect(editor.fieldNames, "#1").toEqual(["a", "b"]);
    operatorQ(editor, "a").value = "equal";
    valueQ(editor, "a").value = "x";
    editor.apply();
    expect(q.ownConditions, "#2").toEqual([{ field: "b", operator: "equal", value: "x" }]);
    editor.dispose();
  });
  test("two bound nested fields with the same leaf name are both edited, each as itself", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p", panelCount: 2, templateElements: [
        { type: "multipletext", name: "mt", items: [{ name: "city" }] },
        { type: "multipletext", name: "mt2", items: [{ name: "city" }] }] },
      { type: "filter", name: "f1", targetQuestion: "p", presets: [] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const editor = q.createAllFiltersEditor();
    expect(editor.fieldNames, "#1").toEqual(["city", "mt2.city"]);
    operatorQ(editor, "mt2.city").value = "equal";
    valueQ(editor, "mt2.city").value = "Paris";
    editor.apply();
    expect(q.ownConditions, "#2").toEqual([{ field: "mt2.city", operator: "equal", value: "Paris" }]);
    editor.dispose();
  });
  test("an editor is given even when the All Filters button is hidden", () => {
    const q = createControl({ showAllFiltersButton: false });
    expect(q.showAllFiltersButton, "#1").toBe(false);
    const editor = q.createAllFiltersEditor();
    expect(!!editor, "#2").toBe(true);
    editor.dispose();
  });
});

describe("The Filters dialog's editor: nothing is written until apply()", () => {
  test("editing writes nothing; apply() writes it all with one change of the filter and one onUIStateChanged", () => {
    const q = createControl();
    const events = trackEvents(q);
    const editor = q.createAllFiltersEditor();
    valueQ(editor, "age").value = 21;
    operatorQ(editor, "country").value = "notequal";
    valueQ(editor, "country").value = "fr";
    searchQ(editor).value = "an";
    expect(q.ownConditions, "#1").toBe(undefined);
    expect(q.searchString, "#2").toBe("");
    expect(q.combinedExpression, "#3").toBe("{age} > 18 and {country} = 'de'");
    expect(events, "#4").toEqual({ filter: 0, uiState: 0 });
    editor.apply();
    expect(q.ownConditions, "#5").toEqual([
      { field: "age", operator: "greater", value: 21 }, { field: "country", operator: "notequal", value: "fr" }]);
    expect(q.searchString, "#6").toBe("an");
    expect(q.combinedExpression, "#7").toBe("({age} > 21 and {country} <> 'fr') and ({name} contains 'an' or {country} anyof ['de', 'fr'] or {age} contains 'an')");
    expect(events, "#8: one of each for conditions and search together").toEqual({ filter: 1, uiState: 1 });
    expect(editor.isDisposed, "#9: apply does not close the editor").toBe(false);
    editor.dispose();
  });
  test("search alone is applied with one event of each", () => {
    const q = createControl();
    const events = trackEvents(q);
    const editor = q.createAllFiltersEditor();
    searchQ(editor).value = "an";
    editor.apply();
    expect(q.searchString, "#1").toBe("an");
    expect(q.ownConditions, "#2: the preset's conditions were not touched").toBe(undefined);
    expect(events, "#3").toEqual({ filter: 1, uiState: 1 });
    editor.dispose();
  });
  test("clearing a field's value removes its condition on apply", () => {
    const q = createControl();
    const editor = q.createAllFiltersEditor();
    valueQ(editor, "country").clearValue();
    expect(q.getFieldCondition("country"), "#1: not yet").toEqual({ field: "country", operator: "equal", value: "de" });
    editor.apply();
    expect(q.getFieldCondition("country"), "#2").toBe(undefined);
    expect(q.ownConditions, "#3").toEqual([{ field: "age", operator: "greater", value: 18 }]);
    expect(q.combinedExpression, "#4").toBe("{age} > 18");
    editor.dispose();
  });
  test("apply() replaces all own conditions with what the editor holds", () => {
    const q = createControl();
    q.setFieldCondition("name", "equal", "Bob");
    const editor = q.createAllFiltersEditor();
    expect(valueQ(editor, "name").value, "#1: prefilled from the own conditions").toBe("Bob");
    valueQ(editor, "name").clearValue();
    valueQ(editor, "age").clearValue();
    editor.apply();
    expect(q.ownConditions, "#2").toEqual([{ field: "country", operator: "equal", value: "de" }]);
    editor.dispose();
  });
  test("apply() with nothing changed writes and raises nothing", () => {
    const q = createControl();
    q.setFieldCondition("age", "greater", 30);
    q.searchString = "an";
    const events = trackEvents(q);
    const editor = q.createAllFiltersEditor();
    const before = q.ownConditions;
    editor.apply();
    expect(q.ownConditions === before, "#1: the same array").toBe(true);
    expect(events, "#2").toEqual({ filter: 0, uiState: 0 });
    editor.dispose();
  });
  test("an existing condition keeps its place, a new one goes to the end", () => {
    const q = createControl();
    const editor = q.createAllFiltersEditor();
    // The preset gives age then country; the editor lists name first.
    valueQ(editor, "name").value = "Bob";
    valueQ(editor, "country").value = "fr";
    editor.apply();
    expect(q.ownConditions.map((c) => c.field), "#1").toEqual(["age", "country", "name"]);
    editor.dispose();
  });
  test("cancel() writes nothing and disposes the editor", () => {
    const q = createControl();
    const events = trackEvents(q);
    const editor = q.createAllFiltersEditor();
    const survey = editor.survey;
    valueQ(editor, "age").value = 5;
    searchQ(editor).value = "an";
    editor.cancel();
    expect(editor.isDisposed, "#1").toBe(true);
    expect(survey.isDisposed, "#2").toBe(true);
    expect(q.ownConditions, "#3").toBe(undefined);
    expect(q.searchString, "#4").toBe("");
    expect(q.combinedExpression, "#5").toBe("{age} > 18 and {country} = 'de'");
    editor.apply();
    expect(q.ownConditions, "#6: a cancelled editor applies nothing").toBe(undefined);
    expect(events, "#7").toEqual({ filter: 0, uiState: 0 });
  });
  test("a bound matrix gets one setControlFilter write", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }, { name: "price", cellType: "text", inputType: "number" }] },
      { type: "filter", name: "f1", targetQuestion: "m", showSearchBar: true, presets: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const matrix: any = survey.getQuestionByName("m");
    matrix.value = [{ country: "de", price: 50 }, { country: "fr", price: 500 }, { country: "gb", price: 5 }];
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const writes: Array<string> = [];
    const original = matrix.setControlFilter.bind(matrix);
    matrix.setControlFilter = (key: string, expression: string): void => {
      writes.push(expression);
      original(key, expression);
    };
    const editor = q.createAllFiltersEditor();
    operatorQ(editor, "country").value = "equal";
    valueQ(editor, "country").value = "fr";
    operatorQ(editor, "price").value = "equal";
    valueQ(editor, "price").value = "500";
    searchQ(editor).value = "f";
    expect(writes.length, "#1: nothing while editing").toBe(0);
    editor.apply();
    expect(writes.length, "#2").toBe(1);
    expect(writes[0], "#3").toBe(q.combinedExpression);
    expect(matrix.visibleRows.length, "#4").toBe(1);
    editor.dispose();
  });
});

describe("The Filters dialog's editor: presets", () => {
  test("applying a change over the active preset turns it off", () => {
    const q = createControl();
    const editor = q.createAllFiltersEditor();
    valueQ(editor, "age").value = 30;
    editor.apply();
    expect(q.selectedPreset, "#1").toBe("");
    expect(q.combinedExpression, "#2").toBe("{age} > 30 and {country} = 'de'");
    editor.dispose();
  });
  test("hidden presets: applying the default preset's own conditions keeps it selected", () => {
    const q = createControl({ showPresets: false });
    const editor = q.createAllFiltersEditor();
    editor.apply();
    expect(q.ownConditions, "#1: untouched preset - no edit").toBe(undefined);
    expect(q.selectedPreset, "#2").toBe("adults");
    editor.dispose();
    const editor2 = q.createAllFiltersEditor();
    valueQ(editor2, "age").value = 30;
    editor2.apply();
    expect(q.selectedPreset, "#3: an edit unselects it").toBe("");
    editor2.dispose();
  });
  test("applying over a preset that does not decompose replaces it with the editor's conditions", () => {
    const q = createControl({ defaultPreset: "edges" });
    const editor = q.createAllFiltersEditor();
    expect(editor.isRawExpression, "#1").toBe(true);
    operatorQ(editor, "age").value = "greater";
    valueQ(editor, "age").value = 40;
    editor.apply();
    expect(q.ownConditions, "#2").toEqual([{ field: "age", operator: "greater", value: 40 }]);
    expect(q.combinedExpression, "#3").toBe("{age} > 40");
    expect(q.selectedPreset, "#4: the preset is off").toBe("");
    editor.dispose();
  });
  test("no active preset: applying no conditions writes nothing", () => {
    const q = createControl({ defaultPreset: "" });
    const events = trackEvents(q);
    const editor = q.createAllFiltersEditor();
    editor.apply();
    expect(q.ownConditions, "#1").toBe(undefined);
    expect(events, "#2").toEqual({ filter: 0, uiState: 0 });
    editor.dispose();
  });
});

describe("The Filters dialog's editor: an untouched editor applies nothing", () => {
  test("a preset that does not decompose survives an untouched apply", () => {
    const q = createControl({ defaultPreset: "edges" });
    const events = trackEvents(q);
    const editor = q.createAllFiltersEditor();
    expect(editor.isModified, "#1").toBe(false);
    editor.apply();
    expect(q.ownConditions, "#2").toBe(undefined);
    expect(q.combinedExpression, "#3").toBe("{age} < 18 or {age} > 35");
    expect(events, "#4").toEqual({ filter: 0, uiState: 0 });
    editor.dispose();
  });
  test("an anyof preset in another order than the choices is not modified by an untouched apply", () => {
    const q = createControl({ presets: [{ name: "eu", expression: "{country} anyof ['fr', 'de']" }], defaultPreset: "eu" });
    const editor = q.createAllFiltersEditor();
    editor.apply();
    expect(q.ownConditions, "#1").toBe(undefined);
    expect(q.selectedPreset, "#2: the preset stays selected").toBe("eu");
    editor.dispose();
  });
  test("a stale editor does not undo a preset and a search changed while it was open", () => {
    const q = createControl();
    const editor = q.createAllFiltersEditor();
    q.togglePreset("kids");
    q.searchString = "zz";
    const expression = q.combinedExpression;
    editor.apply();
    expect(q.selectedPreset, "#1").toBe("kids");
    expect(q.ownConditions, "#2").toBe(undefined);
    expect(q.searchString, "#3").toBe("zz");
    expect(q.combinedExpression, "#4").toBe(expression);
    editor.dispose();
  });
  test("a change of the search box alone makes the editor modified; apply() resets it", () => {
    const q = createControl();
    const events = trackEvents(q);
    const editor = q.createAllFiltersEditor();
    searchQ(editor).value = "an";
    expect(editor.isModified, "#1").toBe(true);
    editor.apply();
    expect(editor.isModified, "#2").toBe(false);
    expect(events, "#3").toEqual({ filter: 1, uiState: 1 });
    q.searchString = "zz";
    editor.apply();
    expect(q.searchString, "#4: a second untouched apply writes nothing").toBe("zz");
    editor.dispose();
  });
  test("a value question rebuilt for a new operator is the respondent's change, not the editor's own", () => {
    const q = createControl();
    const editor = q.createAllFiltersEditor();
    operatorQ(editor, "country").value = "empty";
    expect(editor.isModified, "#1").toBe(true);
    editor.apply();
    expect(q.getFieldCondition("country"), "#2").toEqual({ field: "country", operator: "empty", value: undefined });
    editor.dispose();
  });
});

describe("The Filters dialog's editor: multi-value values compare as sets", () => {
  test("changing an anyof preset's selection unselects it and writes the choices' order", () => {
    const q = createControl({ presets: [{ name: "eu", expression: "{country} anyof ['fr', 'de']" }], defaultPreset: "eu" });
    const editor = q.createAllFiltersEditor();
    expect(valueQ(editor, "country").value, "#1").toEqual(["fr", "de"]);
    valueQ(editor, "country").value = ["de"];
    editor.apply();
    expect(q.selectedPreset, "#2").toBe("");
    valueQ(editor, "country").value = ["de", "fr"];
    editor.apply();
    expect(q.ownConditions, "#3: written in the choices' order").toEqual([{ field: "country", operator: "anyof", value: ["de", "fr"] }]);
    editor.dispose();
  });
  test("changing and restoring the selection on an untouched preset writes nothing", () => {
    const q = createControl({ presets: [{ name: "eu", expression: "{country} anyof ['fr', 'de']" }], defaultPreset: "eu" });
    const editor = q.createAllFiltersEditor();
    valueQ(editor, "country").value = ["de"];
    valueQ(editor, "country").value = ["de", "fr"];
    editor.apply();
    expect(q.ownConditions, "#1: the same set as the preset is no edit").toBe(undefined);
    expect(q.selectedPreset, "#2: the preset stays selected").toBe("eu");
    editor.dispose();
  });
  test("noneof and allof compare as sets too; the elements and everything else stay exact", () => {
    const eu = (): QuestionFilterModel => createControl({ presets: [{ name: "eu", expression: "{country} noneof ['fr', 'de']" }], defaultPreset: "eu" });
    let q = eu();
    q.setFieldCondition("country", "noneof", ["de", "fr"]);
    expect(q.selectedPreset, "#1: the same set is no edit").toBe("eu");
    q = eu();
    q.setFieldCondition("country", "noneof", ["de", "FR"]);
    expect(q.selectedPreset, "#2: element comparison is case-sensitive").toBe("");
    q = eu();
    q.setFieldCondition("country", "noneof", ["de"]);
    expect(q.selectedPreset, "#3: a subset is a change").toBe("");
    q = eu();
    q.setFieldCondition("country", "anyof", ["de", "fr"]);
    expect(q.selectedPreset, "#4: the operator still counts").toBe("");
    const q2 = createControl({ fields: [{ name: "tags", fieldType: "checkbox", choices: ["a", "b"] }],
      presets: [{ name: "all", expression: "{tags} allof ['b', 'a']" }], defaultPreset: "all" });
    expect(q2.getFieldCondition("tags"), "#5a: the preset decomposes").toEqual({ field: "tags", operator: "allof", value: ["b", "a"] });
    q2.setFieldCondition("tags", "allof", ["a", "b"]);
    expect(q2.selectedPreset, "#5").toBe("all");
    const q3 = createControl({ presets: [{ name: "n", expression: "{name} = 'Bob'" }], defaultPreset: "n" });
    q3.setFieldCondition("name", "equal", "bob");
    expect(q3.selectedPreset, "#6: a single value is still exact").toBe("");
  });
});

describe("The Filters dialog's editor: read-only", () => {
  test("a quick filter's editor has nothing to apply", () => {
    const q = createControl();
    const editor = q.createQuickFilterEditor("age");
    const before = q.combinedExpression;
    editor.apply();
    expect(q.combinedExpression, "#1").toBe(before);
    expect(q.ownConditions, "#2").toBe(undefined);
    editor.dispose();
  });
});

describe("The Filters dialog's editor: a search-only change leaves the conditions alone", () => {
  test("a preset that does not decompose keeps its text under a search-only apply", () => {
    const q = createControl({ defaultPreset: "edges", searchFields: ["name"] });
    const events = trackEvents(q);
    const editor = q.createAllFiltersEditor();
    searchQ(editor).value = "bo";
    editor.apply();
    expect(q.ownConditions === undefined, "#1: no edit").toBe(true);
    expect(q.searchString, "#2").toBe("bo");
    expect(q.combinedExpression, "#3").toBe("({age} < 18 or {age} > 35) and ({name} contains 'bo')");
    expect(q.selectedPreset, "#4: the preset stays selected").toBe("edges");
    expect(events, "#6").toEqual({ filter: 1, uiState: 1 });
    editor.dispose();
  });
  test("onApply is given no conditions when no field was changed, and the conditions once one was", () => {
    const q = createControl({ defaultPreset: "edges" });
    const calls: Array<any> = [];
    const editor = new FilterConditionsEditor(q, ["age"], { showSearch: true,
      onApply: (conditions, searchString) => { calls.push({ conditions, searchString }); } });
    searchQ(editor).value = "bo";
    editor.apply();
    expect(calls.length, "#1").toBe(1);
    expect(calls[0].conditions === undefined, "#2: no field was touched").toBe(true);
    expect(calls[0].searchString, "#3").toBe("bo");
    operatorQ(editor, "age").value = "less";
    valueQ(editor, "age").value = 5;
    editor.apply();
    expect(calls[1].conditions, "#4").toEqual([{ field: "age", operator: "less", value: 5 }]);
    searchQ(editor).value = "b";
    editor.apply();
    expect(calls[2].conditions === undefined, "#5: touched fields were applied already").toBe(true);
    editor.dispose();
  });
});
