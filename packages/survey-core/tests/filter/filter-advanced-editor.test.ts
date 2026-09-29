import { describe, test, expect } from "vitest";
import { createFilter, createSurvey } from "./filter-test-helpers";
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
  return <QuestionFilterModel>createSurvey(Object.assign({ items: presets }, over)).getQuestionByName("f1");
}
// Counts what a call raises: onFilterChanged, and onUIStateChanged for this control only.
function trackEvents(q: QuestionFilterModel): { filter: number, uiState: number } {
  const survey = <SurveyModel>q.survey;
  const res = { filter: 0, uiState: 0 };
  survey.onFilterChanged.add(() => { res.filter++; });
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

describe("Advanced mode editor: the editor survey", () => {
  test("every field, prefilled from the active preset, and a search question on top", () => {
    const q = createControl();
    const editor = q.createAdvancedModeEditor();
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
  test("the search question is prefilled with searchString", () => {
    const q = createControl();
    q.searchString = "an";
    const editor = q.createAdvancedModeEditor();
    expect(searchQ(editor).value, "#1").toBe("an");
    editor.dispose();
  });
  test("showSearch false: no search question", () => {
    const q = createControl({ showSearch: false });
    const editor = q.createAdvancedModeEditor();
    expect(!!searchQ(editor), "#1").toBe(false);
    expect(editor.survey.pages[0].elements.length, "#2: one panel per field only").toBe(3);
    editor.dispose();
  });
  test("a duplicate valueName is shown once, by its first field", () => {
    const q = createFilter({ fields: [{ name: "country" }, { name: "country2", valueName: "country" }, { name: "age" }] });
    const editor = q.createAdvancedModeEditor();
    expect(editor.fieldNames, "#1").toEqual(["country", "age"]);
    editor.dispose();
  });
  test("a field hidden from fast mode is in the advanced editor", () => {
    const q = createFilter({ fields: [{ name: "name" }, { name: "country", showInFastMode: false }] });
    const editor = q.createAdvancedModeEditor();
    expect(editor.fieldNames, "#1").toEqual(["name", "country"]);
    editor.dispose();
  });
  test("a field whose valueName is another field's name is reached by its own name", () => {
    const q = createFilter({ fields: [{ name: "a", valueName: "b" }, { name: "b", valueName: "c" }] });
    const editor = q.createAdvancedModeEditor();
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
      { type: "filter", name: "f1", source: "p", items: [] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const editor = q.createAdvancedModeEditor();
    expect(editor.fieldNames, "#1").toEqual(["city", "mt2.city"]);
    operatorQ(editor, "mt2.city").value = "equal";
    valueQ(editor, "mt2.city").value = "Paris";
    editor.apply();
    expect(q.ownConditions, "#2").toEqual([{ field: "mt2.city", operator: "equal", value: "Paris" }]);
    editor.dispose();
  });
  test("an editor is given even when advanced mode is not available", () => {
    const q = createControl({ allowAdvancedMode: false });
    expect(q.isAdvancedModeAvailable, "#1").toBe(false);
    const editor = q.createAdvancedModeEditor();
    expect(!!editor, "#2").toBe(true);
    editor.dispose();
  });
});

describe("Advanced mode editor: nothing is written until apply()", () => {
  test("editing writes nothing; apply() writes it all with one onFilterChanged and one onUIStateChanged", () => {
    const q = createControl();
    const events = trackEvents(q);
    const editor = q.createAdvancedModeEditor();
    valueQ(editor, "age").value = 21;
    operatorQ(editor, "country").value = "notequal";
    valueQ(editor, "country").value = "fr";
    searchQ(editor).value = "an";
    expect(q.ownConditions, "#1").toBe(undefined);
    expect(q.searchString, "#2").toBe("");
    expect(q.filterExpression, "#3").toBe("{age} > 18 and {country} = 'de'");
    expect(events, "#4").toEqual({ filter: 0, uiState: 0 });
    editor.apply();
    expect(q.ownConditions, "#5").toEqual([
      { field: "age", operator: "greater", value: 21 }, { field: "country", operator: "notequal", value: "fr" }]);
    expect(q.searchString, "#6").toBe("an");
    expect(q.filterExpression, "#7").toBe("({age} > 21 and {country} <> 'fr') and ({name} contains 'an' or {country} anyof ['de', 'fr'] or {age} contains 'an')");
    expect(events, "#8: one of each for conditions and search together").toEqual({ filter: 1, uiState: 1 });
    expect(editor.isDisposed, "#9: apply does not close the editor").toBe(false);
    editor.dispose();
  });
  test("search alone is applied with one event of each", () => {
    const q = createControl();
    const events = trackEvents(q);
    const editor = q.createAdvancedModeEditor();
    searchQ(editor).value = "an";
    editor.apply();
    expect(q.searchString, "#1").toBe("an");
    expect(q.ownConditions, "#2: the preset's conditions were not touched").toBe(undefined);
    expect(events, "#3").toEqual({ filter: 1, uiState: 1 });
    editor.dispose();
  });
  test("clearing a field's value removes its condition on apply", () => {
    const q = createControl();
    const editor = q.createAdvancedModeEditor();
    valueQ(editor, "country").clearValue();
    expect(q.getFieldCondition("country"), "#1: not yet").toEqual({ field: "country", operator: "equal", value: "de" });
    editor.apply();
    expect(q.getFieldCondition("country"), "#2").toBe(undefined);
    expect(q.ownConditions, "#3").toEqual([{ field: "age", operator: "greater", value: 18 }]);
    expect(q.filterExpression, "#4").toBe("{age} > 18");
    editor.dispose();
  });
  test("apply() replaces all own conditions with what the editor holds", () => {
    const q = createControl();
    q.setFieldCondition("name", "equal", "Bob");
    const editor = q.createAdvancedModeEditor();
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
    const editor = q.createAdvancedModeEditor();
    const before = q.ownConditions;
    editor.apply();
    expect(q.ownConditions === before, "#1: the same array").toBe(true);
    expect(events, "#2").toEqual({ filter: 0, uiState: 0 });
    editor.dispose();
  });
  test("an existing condition keeps its place, a new one goes to the end", () => {
    const q = createControl();
    const editor = q.createAdvancedModeEditor();
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
    const editor = q.createAdvancedModeEditor();
    const survey = editor.survey;
    valueQ(editor, "age").value = 5;
    searchQ(editor).value = "an";
    editor.cancel();
    expect(editor.isDisposed, "#1").toBe(true);
    expect(survey.isDisposed, "#2").toBe(true);
    expect(q.ownConditions, "#3").toBe(undefined);
    expect(q.searchString, "#4").toBe("");
    expect(q.filterExpression, "#5").toBe("{age} > 18 and {country} = 'de'");
    editor.apply();
    expect(q.ownConditions, "#6: a cancelled editor applies nothing").toBe(undefined);
    expect(events, "#7").toEqual({ filter: 0, uiState: 0 });
  });
  test("a bound matrix gets one setControlFilter write", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }, { name: "price", cellType: "text", inputType: "number" }] },
      { type: "filter", name: "f1", source: "m", showSearch: true, items: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const matrix: any = survey.getQuestionByName("m");
    matrix.value = [{ country: "de", price: 50 }, { country: "fr", price: 500 }, { country: "gb", price: 5 }];
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const writes: Array<string> = [];
    const original = matrix.setControlFilter.bind(matrix);
    matrix.setControlFilter = (key: string, expression: string): void => {
      writes.push(expression);
      original(key, expression);
    };
    const editor = q.createAdvancedModeEditor();
    operatorQ(editor, "country").value = "equal";
    valueQ(editor, "country").value = "fr";
    operatorQ(editor, "price").value = "equal";
    valueQ(editor, "price").value = "500";
    searchQ(editor).value = "f";
    expect(writes.length, "#1: nothing while editing").toBe(0);
    editor.apply();
    expect(writes.length, "#2").toBe(1);
    expect(writes[0], "#3").toBe(q.filterExpression);
    expect(matrix.visibleRows.length, "#4").toBe(1);
    editor.dispose();
  });
});

describe("Advanced mode editor: presets", () => {
  test("applying the preset's own conditions leaves isActiveItemModified false", () => {
    const q = createControl();
    const editor = q.createAdvancedModeEditor();
    editor.apply();
    expect(q.ownConditions, "#1: untouched preset - no edit").toBe(undefined);
    expect(q.isActiveItemModified, "#2").toBe(false);
    editor.dispose();
    const editor2 = q.createAdvancedModeEditor();
    valueQ(editor2, "age").value = 30;
    editor2.apply();
    expect(q.isActiveItemModified, "#3").toBe(true);
    valueQ(editor2, "age").value = 18;
    editor2.apply();
    expect(q.isActiveItemModified, "#4: back to the preset's set").toBe(false);
    expect(q.canSaveActiveItem, "#5").toBe(false);
    editor2.dispose();
  });
  test("applying over a preset that does not decompose replaces it with the editor's conditions", () => {
    const q = createControl({ defaultItem: "edges" });
    const editor = q.createAdvancedModeEditor();
    expect(editor.isRawExpression, "#1").toBe(true);
    operatorQ(editor, "age").value = "greater";
    valueQ(editor, "age").value = 40;
    editor.apply();
    expect(q.ownConditions, "#2").toEqual([{ field: "age", operator: "greater", value: 40 }]);
    expect(q.filterExpression, "#3").toBe("{age} > 40");
    expect(q.isActiveItemModified, "#4").toBe(true);
    editor.dispose();
  });
  test("no active preset: applying no conditions writes nothing", () => {
    const q = createControl({ defaultItem: "" });
    const events = trackEvents(q);
    const editor = q.createAdvancedModeEditor();
    editor.apply();
    expect(q.ownConditions, "#1").toBe(undefined);
    expect(events, "#2").toEqual({ filter: 0, uiState: 0 });
    editor.dispose();
  });
});

describe("Advanced mode editor: an untouched editor applies nothing", () => {
  test("a preset that does not decompose survives an untouched apply", () => {
    const q = createControl({ defaultItem: "edges" });
    const events = trackEvents(q);
    const editor = q.createAdvancedModeEditor();
    expect(editor.isModified, "#1").toBe(false);
    editor.apply();
    expect(q.ownConditions, "#2").toBe(undefined);
    expect(q.filterExpression, "#3").toBe("{age} < 18 or {age} > 35");
    expect(events, "#4").toEqual({ filter: 0, uiState: 0 });
    editor.dispose();
  });
  test("an anyof preset in another order than the choices is not modified by an untouched apply", () => {
    const q = createControl({ items: [{ name: "eu", expression: "{country} anyof ['fr', 'de']" }], defaultItem: "eu" });
    const editor = q.createAdvancedModeEditor();
    editor.apply();
    expect(q.ownConditions, "#1").toBe(undefined);
    expect(q.isActiveItemModified, "#2").toBe(false);
    editor.dispose();
  });
  test("a stale editor does not undo a preset and a search changed while it was open", () => {
    const q = createControl();
    const editor = q.createAdvancedModeEditor();
    q.toggleItem("kids");
    q.searchString = "zz";
    const expression = q.filterExpression;
    editor.apply();
    expect(q.activeItemName, "#1").toBe("kids");
    expect(q.ownConditions, "#2").toBe(undefined);
    expect(q.searchString, "#3").toBe("zz");
    expect(q.filterExpression, "#4").toBe(expression);
    editor.dispose();
  });
  test("a change of the search box alone makes the editor modified; apply() resets it", () => {
    const q = createControl();
    const events = trackEvents(q);
    const editor = q.createAdvancedModeEditor();
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
    const editor = q.createAdvancedModeEditor();
    operatorQ(editor, "country").value = "empty";
    expect(editor.isModified, "#1").toBe(true);
    editor.apply();
    expect(q.getFieldCondition("country"), "#2").toEqual({ field: "country", operator: "empty", value: undefined });
    editor.dispose();
  });
});

describe("Advanced mode editor: multi-value values compare as sets", () => {
  test("changing and restoring an anyof preset's selection leaves it not modified", () => {
    const q = createControl({ items: [{ name: "eu", expression: "{country} anyof ['fr', 'de']" }], defaultItem: "eu" });
    const editor = q.createAdvancedModeEditor();
    expect(valueQ(editor, "country").value, "#1").toEqual(["fr", "de"]);
    valueQ(editor, "country").value = ["de"];
    editor.apply();
    expect(q.isActiveItemModified, "#2").toBe(true);
    valueQ(editor, "country").value = ["de", "fr"];
    editor.apply();
    expect(q.ownConditions, "#3: written in the choices' order").toEqual([{ field: "country", operator: "anyof", value: ["de", "fr"] }]);
    expect(q.isActiveItemModified, "#4").toBe(false);
    expect(q.canSaveActiveItem, "#5").toBe(false);
    editor.dispose();
  });
  test("changing and restoring the selection on an untouched preset writes nothing", () => {
    const q = createControl({ items: [{ name: "eu", expression: "{country} anyof ['fr', 'de']" }], defaultItem: "eu" });
    const editor = q.createAdvancedModeEditor();
    valueQ(editor, "country").value = ["de"];
    valueQ(editor, "country").value = ["de", "fr"];
    editor.apply();
    expect(q.ownConditions, "#1: the same set as the preset is no edit").toBe(undefined);
    expect(q.isActiveItemModified, "#2").toBe(false);
    editor.dispose();
  });
  test("noneof and allof compare as sets too; the elements and everything else stay exact", () => {
    const q = createControl({ items: [{ name: "eu", expression: "{country} noneof ['fr', 'de']" }], defaultItem: "eu" });
    q.setFieldCondition("country", "noneof", ["de", "fr"]);
    expect(q.isActiveItemModified, "#1").toBe(false);
    q.setFieldCondition("country", "noneof", ["de", "FR"]);
    expect(q.isActiveItemModified, "#2: element comparison is case-sensitive").toBe(true);
    q.setFieldCondition("country", "noneof", ["de"]);
    expect(q.isActiveItemModified, "#3: a subset is a change").toBe(true);
    q.setFieldCondition("country", "anyof", ["de", "fr"]);
    expect(q.isActiveItemModified, "#4: the operator still counts").toBe(true);
    const q2 = createControl({ fields: [{ name: "tags", fieldType: "checkbox", choices: ["a", "b"] }],
      items: [{ name: "all", expression: "{tags} allof ['b', 'a']" }], defaultItem: "all" });
    expect(q2.getFieldCondition("tags"), "#5a: the preset decomposes").toEqual({ field: "tags", operator: "allof", value: ["b", "a"] });
    q2.setFieldCondition("tags", "allof", ["a", "b"]);
    expect(q2.isActiveItemModified, "#5").toBe(false);
    const q3 = createControl({ items: [{ name: "n", expression: "{name} = 'Bob'" }], defaultItem: "n" });
    q3.setFieldCondition("name", "equal", "bob");
    expect(q3.isActiveItemModified, "#6: a single value is still exact").toBe(true);
  });
});

describe("Advanced mode editor: read-only", () => {
  test("an ai preset: display-only, and apply() writes nothing", () => {
    const q = createControl({ items: [{ name: "smart", type: "ai", expression: "{age} > 18" }], defaultItem: "smart" });
    const events = trackEvents(q);
    const editor = q.createAdvancedModeEditor();
    expect(editor.isReadOnly, "#1").toBe(true);
    expect(editor.survey.mode, "#2").toBe("display");
    valueQ(editor, "age").value = 5;
    searchQ(editor).value = "an";
    editor.apply();
    expect(q.ownConditions, "#3").toBe(undefined);
    expect(q.searchString, "#4").toBe("");
    expect(q.filterExpression, "#5").toBe("{age} > 18");
    expect(events, "#6").toEqual({ filter: 0, uiState: 0 });
    editor.dispose();
  });
  test("a fast mode editor has nothing to apply", () => {
    const q = createControl();
    const editor = q.createFastModeEditor("age");
    const before = q.filterExpression;
    editor.apply();
    expect(q.filterExpression, "#1").toBe(before);
    expect(q.ownConditions, "#2").toBe(undefined);
    editor.dispose();
  });
});

describe("Advanced mode editor: a search-only change leaves the conditions alone", () => {
  test("a preset that does not decompose keeps its text under a search-only apply", () => {
    const q = createControl({ defaultItem: "edges", searchFields: ["name"] });
    const events = trackEvents(q);
    const editor = q.createAdvancedModeEditor();
    searchQ(editor).value = "bo";
    editor.apply();
    expect(q.ownConditions === undefined, "#1: no edit").toBe(true);
    expect(q.searchString, "#2").toBe("bo");
    expect(q.filterExpression, "#3").toBe("({age} < 18 or {age} > 35) and ({name} contains 'bo')");
    expect(q.isActiveItemModified, "#4").toBe(false);
    expect(q.canSaveActiveItem, "#5").toBe(false);
    expect(events, "#6").toEqual({ filter: 1, uiState: 1 });
    editor.dispose();
  });
  test("onApply is given no conditions when no field was changed, and the conditions once one was", () => {
    const q = createControl({ defaultItem: "edges" });
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
