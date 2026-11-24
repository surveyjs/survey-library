import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { Serializer } from "../../src/jsonobject";
import { createFilter, createBound } from "./filter-test-helpers";

describe("Filter release API: the three expressions", () => {
  test("filterExpression is the filter alone, searchExpression the search, combinedExpression both", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"], defaultPreset: "adults" });
    q.searchString = "an";
    expect(q.filterExpression, "#1").toBe("{age} > 18");
    expect(q.searchExpression, "#2").toBe("{name} contains 'an'");
    expect(q.combinedExpression, "#3").toBe("({age} > 18) and ({name} contains 'an')");
  });
  test("an empty part is left out of combinedExpression", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"] });
    q.searchString = "an";
    expect(q.filterExpression, "#1").toBe("");
    expect(q.combinedExpression, "#2").toBe("{name} contains 'an'");
    q.searchString = "";
    expect(q.combinedExpression, "#3").toBe("");
  });
  test("the target is filtered by combinedExpression", () => {
    const survey = createBound();
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    (<any>q).togglePreset("de");
    const matrix: any = survey.getQuestionByName("m");
    expect(matrix.getControlFilter("filterControl:" + q.uniqueId)).toBe(q.combinedExpression);
  });
  test("the survey has no onFilterChanged", () => {
    const survey = new SurveyModel({});
    expect((<any>survey).onFilterChanged, "#1").toBeUndefined();
    expect(typeof (<any>survey).filterChanged, "#2").toBe("undefined");
  });
});

describe("Filter release API: selection and the own filter", () => {
  test("defaultPreset is the initial selection; an unknown one selects nothing", () => {
    expect(createFilter({ defaultPreset: "adults" }).selectedPreset, "#1").toBe("adults");
    expect(createFilter({ defaultPreset: "nope" }).selectedPreset, "#2").toBe("");
    expect(createFilter({ defaultPreset: "adults", showPresets: false }).selectedPreset, "#3: hidden presets still start selected").toBe("adults");
    expect(createFilter({ showPresets: false }).filterExpression, "#4: no first preset by default").toBe("");
  });
  test("selectedPreset cannot be assigned", () => {
    const q = createFilter();
    expect(() => { (<any>q).selectedPreset = "adults"; }).toThrow();
  });
  test("applyPreset selects the preset and applies its text; an unknown name changes nothing", () => {
    const q = createFilter();
    q.applyPreset("kids");
    expect(q.selectedPreset, "#1").toBe("kids");
    expect(q.filterExpression, "#2").toBe("{age} <= 18");
    q.applyPreset("nope");
    expect(q.selectedPreset, "#3").toBe("kids");
  });
  test("applyFilter replaces the filter and clears the selection", () => {
    const q = createFilter({ defaultPreset: "adults" });
    q.applyFilter("{country} = 'de'");
    expect(q.selectedPreset, "#1").toBe("");
    expect(q.filterExpression, "#2").toBe("{country} = 'de'");
    expect((<any>q).getFieldCondition("country"), "#3: shown in the chip").toEqual({ field: "country", operator: "equal", value: "de" });
  });
  test("applyFilter takes a text the fields cannot show; the first chip edit starts from nothing", () => {
    const q = createFilter();
    q.applyFilter("{age} > 18 or {country} = 'de'");
    expect(q.filterExpression, "#1").toBe("{age} > 18 or {country} = 'de'");
    expect((<any>q).getFieldCondition("age"), "#2").toBeUndefined();
    (<any>q).setFieldCondition("country", "equal", "fr");
    expect(q.filterExpression, "#3").toBe("{country} = 'fr'");
  });
  test("applyFilter ignores a text that does not parse", () => {
    const q = createFilter({ defaultPreset: "adults" });
    q.applyFilter("{age} >");
    expect([q.selectedPreset, q.filterExpression]).toEqual(["adults", "{age} > 18"]);
  });
  test("applyPreset, applyFilter and clearFilter do nothing in the designer", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", presets: [{ name: "a", expression: "{x} = 1" }] }] });
    const d = <QuestionFilterModel>survey.getQuestionByName("f1");
    d.applyFilter("{x} = 2");
    d.applyPreset("a");
    expect([d.selectedPreset, d.filterExpression]).toEqual(["", ""]);
  });
  test("clearFilter clears the filter and the selection, not the search", () => {
    const q = createFilter({ defaultPreset: "adults", showSearchBar: true, searchFields: ["name"] });
    q.searchString = "an";
    q.clearFilter();
    expect(q.selectedPreset, "#1").toBe("");
    expect(q.filterExpression, "#2").toBe("");
    expect(q.searchString, "#3").toBe("an");
  });
  test("an edit over the selected preset clears the selection and keeps its conditions", () => {
    const q = createFilter({ defaultPreset: "adults", showPresets: false });
    (<any>q).setFieldCondition("country", "equal", "de");
    expect(q.selectedPreset, "#1").toBe("");
    expect(q.filterExpression, "#2").toBe("{age} > 18 and {country} = 'de'");
    q.clearFilter();
    expect(q.filterExpression, "#3: nothing brings the hidden preset back").toBe("");
  });
  test("a filter restored before the target exists lands in one write once it appears", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", targetQuestion: "m" }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    survey.uiState = { questions: { f1: { filter: { selectedPreset: "", expression: "{country} = 'de'" } } } };
    const matrix = new QuestionMatrixDynamicModel("m");
    matrix.addColumn("country");
    const writes: Array<string> = [];
    const original = matrix.setControlFilter.bind(matrix);
    matrix.setControlFilter = (key: string, expression: string): void => { writes.push(expression); original(key, expression); };
    survey.pages[0].addElement(matrix);
    survey.setValue("somethingelse", 1);
    expect(q.combinedExpression, "#1").toBe("{country} = 'de'");
    expect(writes, "#2").toEqual(["{country} = 'de'"]);
  });
});

describe("Filter release API: presets as a live list", () => {
  const data = (name: string, expression: string): any =>
    ({ name: name, title: name.toUpperCase(), expression: expression, allowEdit: true, allowDelete: true, allowCopy: true });
  test("addPreset appends to presets and returns the preset", () => {
    const q = createFilter();
    const p = q.addPreset(data("de", "{country} = 'de'"));
    expect(q.presets.map(x => x.name), "#1").toEqual(["adults", "kids", "de"]);
    expect(p.title, "#2").toBe("DE");
    expect(q.addPreset(data("de", "{age} > 1")), "#3: a taken name").toBeUndefined();
    expect(q.addPreset(data("", "{age} > 1")), "#4: no name").toBeUndefined();
    expect(q.addPreset(data("x", "{age} >")), "#5: does not parse").toBeUndefined();
    expect(q.addPreset(data("y", "")), "#6: filters by nothing").toBeUndefined();
  });
  test("the API is not checked against the respondent's permissions", () => {
    const q = createFilter({ allowAddPresets: false, allowEditPresets: false, allowDeletePresets: false });
    expect(q.addPreset(data("de", "{country} = 'de'")), "#1").toBeTruthy();
    expect(q.updatePreset(data("adults", "{age} > 21")).expression, "#2").toBe("{age} > 21");
    q.deletePreset("kids");
    expect(q.presets.map(x => x.name), "#3").toEqual(["adults", "de"]);
  });
  test("updatePreset finds the preset by name; the selected one refilters", () => {
    const q = createFilter({ defaultPreset: "adults" });
    const p = q.updatePreset({ name: "adults", title: "Grown-ups", expression: "{age} > 21", allowEdit: false, allowDelete: false, allowCopy: false });
    expect([p.title, p.expression, p.allowEdit, p.allowDelete, p.allowCopy], "#1").toEqual(["Grown-ups", "{age} > 21", false, false, false]);
    expect(q.filterExpression, "#2").toBe("{age} > 21");
    expect(q.updatePreset(data("nope", "{age} > 1")), "#3").toBeUndefined();
    expect(q.updatePreset(data("kids", "{age} >")), "#4").toBeUndefined();
  });
  test("deletePreset removes the preset; the selected one takes the filter with it", () => {
    const q = createFilter({ defaultPreset: "adults" });
    q.deletePreset("adults");
    expect(q.presets.map(x => x.name), "#1").toEqual(["kids"]);
    expect([q.selectedPreset, q.filterExpression], "#2").toEqual(["", ""]);
  });
  test("a deleted authored preset's name stays taken", () => {
    const q = createFilter();
    q.deletePreset("kids");
    expect(q.addPreset(data("kids", "{age} < 5"))).toBeUndefined();
  });
  test("uiState keeps what differs from the JSON and restores it", () => {
    const json = { elements: [{ type: "filter", name: "f1", fields: [{ name: "age", fieldType: "text", inputType: "number" }],
      presets: [{ name: "adults", expression: "{age} > 18" }, { name: "kids", expression: "{age} <= 18" }] }] };
    const s1 = new SurveyModel(json);
    const q1 = <QuestionFilterModel>s1.getQuestionByName("f1");
    q1.addPreset(data("teens", "{age} >= 13 and {age} <= 19"));
    q1.updatePreset({ name: "adults", title: "Grown-ups", expression: "{age} > 21", allowEdit: true, allowDelete: false, allowCopy: true });
    q1.deletePreset("kids");
    q1.applyPreset("teens");
    const state = s1.uiState;
    expect(state.questions.f1.filter, "#1: only what differs from the JSON").toEqual({
      selectedPreset: "teens",
      presets: { adults: { title: "Grown-ups", expression: "{age} > 21", allowDelete: false } },
      userPresets: [{ name: "teens", title: "TEENS", expression: "{age} >= 13 and {age} <= 19", allowEdit: true, allowDelete: true, allowCopy: true }],
      deletedPresets: ["kids"]
    });
    const s2 = new SurveyModel(json);
    s2.uiState = state;
    const q2 = <QuestionFilterModel>s2.getQuestionByName("f1");
    expect(q2.presets.map(x => x.name), "#2").toEqual(["adults", "teens"]);
    expect([q2.presets[0].title, q2.presets[0].expression, q2.presets[0].allowDelete], "#3").toEqual(["Grown-ups", "{age} > 21", false]);
    expect(q2.selectedPreset, "#4").toBe("teens");
  });
  test("uiState saved by v3.2.6 is ignored", () => {
    const s = new SurveyModel({ elements: [{ type: "filter", name: "f1", presets: [{ name: "a", expression: "{x} = 1" }] }] });
    s.uiState = { questions: { f1: { filter: <any>{ activeItemName: "a", items: { a: { expression: "{x} = 2" } }, userItems: [{ name: "u", title: "", expression: "{x} = 3" }], deletedItems: ["a"] } } } };
    const q = <QuestionFilterModel>s.getQuestionByName("f1");
    expect([q.selectedPreset, q.presets.length, q.presets[0].expression]).toEqual(["", 1, "{x} = 1"]);
  });
  test("a presets array the host assigns replaces the respondent's presets and changes", () => {
    const s = new SurveyModel({ elements: [{ type: "filter", name: "f1", presets: [{ name: "a", expression: "{x} = 1" }] }] });
    const q = <QuestionFilterModel>s.getQuestionByName("f1");
    q.addPreset(data("u", "{x} = 3"));
    q.updatePreset(data("a", "{x} = 2"));
    q.presets = <any>[{ name: "b", expression: "{x} = 4" }];
    expect(q.presets.map(x => x.name), "#1").toEqual(["b"]);
    expect((s.uiState.questions || {}).f1, "#2").toBeUndefined();
  });
});

describe("Filter release API: searchPlaceholder", () => {
  test("an authored placeholder wins; an empty one falls back to the computed text", () => {
    const q = createFilter({ showSearchBar: true, searchFields: ["name"] });
    expect(q.searchPlaceholder, "#1").toBe("Search by name");
    q.searchPlaceholder = "Find a person";
    expect(q.searchPlaceholder, "#2").toBe("Find a person");
    expect(q.toJSON().searchPlaceholder, "#3").toBe("Find a person");
    q.searchPlaceholder = "";
    expect(q.searchPlaceholder, "#4").toBe("Search by name");
    expect(q.toJSON().searchPlaceholder, "#5").toBeUndefined();
  });
  test("the placeholder is localizable", () => {
    const json = { type: "filter", name: "f1", showSearchBar: true, searchPlaceholder: { default: "Find", de: "Suchen" } };
    const en = <QuestionFilterModel>new SurveyModel({ elements: [json] }).getQuestionByName("f1");
    const de = <QuestionFilterModel>new SurveyModel({ locale: "de", elements: [json] }).getQuestionByName("f1");
    expect([en.searchPlaceholder, de.searchPlaceholder]).toEqual(["Find", "Suchen"]);
  });
  test("a renderer hears an assigned placeholder, and the All Filters editor shows it", () => {
    const q = createFilter({ showSearchBar: true });
    let changes = 0;
    q.registerPropertyChangedHandlers(["searchPlaceholder"], (): void => { changes++; });
    q.searchPlaceholder = "Find";
    expect(changes, "#1").toBe(1);
    const editor: any = q.createAllFiltersEditor();
    expect(editor.options.searchPlaceholder, "#2").toBe("Find");
    editor.dispose();
  });
  test("the property shows only with the search bar", () => {
    const prop = Serializer.findProperty("filter", "searchPlaceholder");
    expect(prop.isVisible("", createFilter({ showSearchBar: true })), "#1").toBe(true);
    expect(prop.isVisible("", createFilter()), "#2").toBe(false);
  });
});

describe("Filter release API: a selected preset that leaves the list", () => {
  const own = { name: "u", title: "U", expression: "{age} > 3", allowEdit: true, allowDelete: true, allowCopy: true };
  test("a respondent's selected preset gone with a new presets array leaves no selection, shown or saved", () => {
    const q = createFilter();
    q.addPreset(own);
    q.applyPreset("u");
    q.presets = <any>[{ name: "b", expression: "{age} > 4" }];
    expect([q.selectedPreset, q.filterExpression], "#1").toEqual(["", ""]);
    expect(JSON.stringify((<any>q.survey).uiState), "#2").not.toContain("\"u\"");
  });
  test("the default preset taken away by the host leaves no selection", () => {
    const q = createFilter({ defaultPreset: "adults" });
    q.presets = <any>[{ name: "b", expression: "{age} > 4" }];
    expect(q.selectedPreset).toBe("");
  });
  test("a selected preset the host splices out leaves no selection", () => {
    const q = createFilter({ defaultPreset: "adults" });
    q.presets.splice(0, 1);
    expect([q.selectedPreset, q.filterExpression]).toEqual(["", ""]);
  });
  test("a restored selection no preset answers to is no selection, and is not saved again", () => {
    const q = createFilter();
    (<any>q.survey).uiState = { questions: { f1: { filter: { selectedPreset: "gone" } } } };
    expect(q.selectedPreset, "#1").toBe("");
    expect(JSON.stringify((<any>q.survey).uiState), "#2").not.toContain("gone");
  });
  test("a restored selection of the respondent's own preset waits for the target with the preset", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", targetQuestion: "m" }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    survey.uiState = { questions: { f1: { filter: { selectedPreset: "u",
      userPresets: [{ name: "u", title: "U", expression: "{country} = 'de'", allowEdit: true, allowDelete: true, allowCopy: true }] } } } };
    const matrix = new QuestionMatrixDynamicModel("m");
    matrix.addColumn("country");
    survey.pages[0].addElement(matrix);
    survey.setValue("somethingelse", 1);
    expect([q.selectedPreset, q.combinedExpression]).toEqual(["u", "{country} = 'de'"]);
  });
  test("a respondent's preset the host splices out is gone from uiState, and a later restore removes only the respondent's", () => {
    const q = createFilter();
    const u = q.addPreset(own);
    q.presets.splice(q.presets.indexOf(u), 1);
    expect(JSON.stringify((<any>q.survey).uiState), "#1").not.toContain("\"u\"");
    (<any>q.survey).uiState = { questions: { f1: { filter: { userPresets: [Object.assign({}, own, { name: "v" })] } } } };
    expect(q.presets.map(p => p.name), "#2").toEqual(["adults", "kids", "v"]);
  });
});

describe("Filter release API: a filter applied before the target exists", () => {
  test("is shown in the chips once the target brings its fields, in the one write", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", targetQuestion: "m" }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.applyFilter("{country} = 'de'");
    expect(q.filterExpression, "#1: it filters by the text meanwhile").toBe("{country} = 'de'");
    const matrix = new QuestionMatrixDynamicModel("m");
    matrix.addColumn("country");
    const writes: Array<string> = [];
    const original = matrix.setControlFilter.bind(matrix);
    matrix.setControlFilter = (key: string, expression: string): void => { writes.push(expression); original(key, expression); };
    survey.pages[0].addElement(matrix);
    survey.setValue("somethingelse", 1);
    expect(writes, "#2").toEqual(["{country} = 'de'"]);
    expect((<any>q).getFieldCondition("country"), "#3").toEqual({ field: "country", operator: "equal", value: "de" });
  });
  test("a text the target's fields cannot show stays a text", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", targetQuestion: "m" }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.applyFilter("{country} = 'de' or {country} = 'fr'");
    const matrix = new QuestionMatrixDynamicModel("m");
    matrix.addColumn("country");
    survey.pages[0].addElement(matrix);
    survey.setValue("somethingelse", 1);
    expect([q.combinedExpression, (<any>q).getFieldCondition("country")]).toEqual(["{country} = 'de' or {country} = 'fr'", undefined]);
  });
});

describe("Filter release API: the names of v3.2.6 and v3.2.7", () => {
  test("are not properties any more, and their JSON is not read", () => {
    ["source", "items", "defaultItem", "allowMultipleItems", "allowAddItems", "showSearch", "allowFastMode", "allowAdvancedMode"].forEach((name: string) => {
      expect(!!Serializer.findProperty("filter", name), name).toBe(false);
    });
    ["showInFastMode", "filterOperators"].forEach((name: string) => {
      expect(!!Serializer.findProperty("filterfield", name), name).toBe(false);
    });
    expect(Serializer.findClass("filteritem"), "filteritem").toBeFalsy();
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "country" }] },
      { type: "filter", name: "f1", source: "m", items: [{ name: "a", expression: "{country} = 'de'" }], defaultItem: "a",
        allowFastMode: false, allowAdvancedMode: false, showSearch: true, allowMultipleItems: false }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect([!!q.targetQuestion, q.presets.length, !!q.defaultPreset, q.showQuickFilters, q.showAllFiltersButton, q.showSearchBar, q.showPresets, q.combinedExpression])
      .toEqual([false, 0, false, true, true, false, true, ""]);
  });
});

describe("Filter release API: a restored text comes back as it was saved", () => {
  const reload = (q: QuestionFilterModel, over: any = {}): QuestionFilterModel => {
    const state = (<any>q.survey).uiState;
    const next = createFilter(over);
    (<any>next.survey).uiState = state;
    return next;
  };
  test("the control's own text that names a record key outside the fields", () => {
    const q = createFilter();
    q.applyFilter("{country} = 'de' and {total} > 10");
    const next = reload(q);
    expect([next.filterExpression, (<any>next).getFieldCondition("country")]).toEqual(["{country} = 'de' and {total} > 10", undefined]);
  });
  test("a preset's text that names a record key outside the fields", () => {
    const q = createFilter();
    q.updatePreset({ name: "adults", title: "Adults", expression: "{age} > 18 and {total} > 10", allowEdit: true, allowDelete: true, allowCopy: true });
    expect(reload(q).getPresetByName("adults").expression).toBe("{age} > 18 and {total} > 10");
  });
  test("conditions on a field the author removed since stay in the text", () => {
    const q = createFilter();
    q.applyFilter("{country} = 'de' and {age} > 18");
    const fields = [{ name: "country", fieldType: "dropdown", choices: ["de", "fr"] }];
    expect(reload(q, { fields: fields }).filterExpression).toBe("{country} = 'de' and {age} > 18");
  });
});

describe("Filter release API: a preset the author locked keeps the JSON on restore", () => {
  const presets = [{ name: "locked", title: "Locked", expression: "{age} > 1", allowEdit: false },
    { name: "kept", expression: "{age} > 2", allowDelete: false }, { name: "free", expression: "{age} > 3" }];
  test("a saved change of a preset with allowEdit false is not restored; of another one it is", () => {
    const q = createFilter({ presets: presets });
    (<any>q.survey).uiState = { questions: { f1: { filter: { presets: {
      locked: { title: "Mine", expression: "{age} > 5" }, free: { expression: "{age} > 6" } } } } } };
    const locked = q.getPresetByName("locked");
    expect([locked.title, locked.expression], "#1").toEqual(["Locked", "{age} > 1"]);
    expect(q.getPresetByName("free").expression, "#2").toBe("{age} > 6");
  });
  test("a saved deletion of a preset with allowDelete false is not restored; of another one it is", () => {
    const q = createFilter({ presets: presets });
    (<any>q.survey).uiState = { questions: { f1: { filter: { deletedPresets: ["kept", "free"] } } } };
    expect(q.presets.map(x => x.name)).toEqual(["locked", "kept"]);
  });
});
