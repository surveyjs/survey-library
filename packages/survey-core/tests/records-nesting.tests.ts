import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { PanelModel, PanelModelBase } from "../src/panel";
import { Serializer } from "../src/jsonobject";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { MatrixDropdownRowModelBase } from "../src/question_matrixdropdownbase";
import { PanelDataScope } from "../src/nested-data/panel-data-scope";
import { ValueGetter } from "../src/conditions/conditionProcessValue";
import { ComponentCollection } from "../src/question_custom";
import { afterEach, describe, test, expect } from "vitest";

// A panel with valueName inside a dynamic panel's template or a matrix's detail panel keeps its
// questions' values in an object inside the record (decisions RN1-RN7).

const pdJson = (extra?: any, inner?: Array<any>): any => Object.assign({ dataNesting: "auto", elements: [
  { type: "paneldynamic", name: "items", templateElements: [
    { type: "text", name: "title" },
    { type: "panel", name: "p1", valueName: "address", elements: inner || [{ type: "text", name: "street" }] }
  ] }
] }, extra || {});
const matrixJson = (extra?: any, type: string = "matrixdynamic"): any => Object.assign({ dataNesting: "auto", elements: [
  Object.assign({ type: type, name: "rows", detailPanelMode: "underRow", columns: [{ name: "col1", cellType: "text" }],
    detailElements: [{ type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street" }] }] },
  type === "matrixdropdown" ? { rows: ["r1", "r2"] } : { rowCount: 0 })
] }, extra || {});
// By its name wherever it is: in a nesting mode the survey finds a question inside a container that holds data by
// its path.
const pdOf = (survey: SurveyModel): QuestionPanelDynamicModel => <QuestionPanelDynamicModel>survey.getAllQuestions(false, true).filter(q => q.name === "items")[0];
const matrixOf = (survey: SurveyModel): QuestionMatrixDynamicModel => <QuestionMatrixDynamicModel>survey.getQuestionByName("rows");
const inPanel = (panel: PanelModel, name: string): Question => <Question>panel.getQuestionByName(name);
const detailOf = (row: MatrixDropdownRowModelBase, name: string): Question => {
  row.showDetailPanel();
  return <Question>row.detailPanel.getQuestionByName(name);
};

describe("records nesting: a dynamic panel", () => {
  test("typing, question.value, survey.setValue, survey.data and mergeData give the nested record", () => {
    const survey = new SurveyModel(pdJson());
    const pd = pdOf(survey);
    pd.addPanel();
    inPanel(pd.panels[0], "title").value = "A";
    inPanel(pd.panels[0], "street").value = "Main St";
    expect(survey.data, "#1 typing").toEqual({ items: [{ title: "A", address: { street: "Main St" } }] });
    expect(pd.value, "#2").toEqual([{ title: "A", address: { street: "Main St" } }]);

    pd.value = [{ title: "B", address: { street: "S2" } }, { address: { street: "S3" } }];
    expect(inPanel(pd.panels[0], "street").value, "#3 question.value").toBe("S2");
    expect(inPanel(pd.panels[1], "street").value, "#4").toBe("S3");
    expect(inPanel(pd.panels[1], "title").isEmpty(), "#5").toBe(true);

    survey.setValue("items", [{ title: "C", address: { street: "S4" } }]);
    expect(pd.panels.length, "#6 survey.setValue").toBe(1);
    expect(inPanel(pd.panels[0], "street").value, "#7").toBe("S4");

    survey.data = { items: [{ title: "D", address: { street: "S5" } }] };
    expect(inPanel(pd.panels[0], "street").value, "#8 survey.data").toBe("S5");
    expect(inPanel(pd.panels[0], "title").value, "#9").toBe("D");

    survey.mergeData({ items: [{ title: "E", address: { street: "S6" } }] });
    expect(inPanel(pd.panels[0], "street").value, "#10 mergeData").toBe("S6");

    inPanel(pd.panels[0], "street").clearValue();
    expect(survey.data, "#11 the empty object is removed").toEqual({ items: [{ title: "E" }] });
  });
  test("the inner question's scope, its value scope and its data path (RN4)", () => {
    const survey = new SurveyModel(pdJson());
    survey.data = { items: [{ title: "A", address: { street: "x" } }] };
    const panel = pdOf(survey).panels[0];
    const p1 = <PanelModel>panel.getElementByName("p1");
    const street = inPanel(panel, "street");
    const title = inPanel(panel, "title");
    expect(p1.isDataNesting, "#1").toBe(true);
    expect(street.data instanceof PanelDataScope, "#2").toBe(true);
    expect(street.getValueScope(), "#3 the panel's scope").toBe(p1.getDataScope());
    expect(street.getDataPath(), "#4 relative to the record").toEqual(["address", "street"]);
    expect(p1.getDataPath(), "#5").toEqual(["address"]);
    expect(title.getValueScope(), "#6 a question directly in a record answers the survey").toBe(survey);
    expect(pdOf(survey).template.getDataScope(), "#7 the record panel itself never nests (RN6)").toBeFalsy();
    expect(panel.getDataScope(), "#8").toBeFalsy();
  });
  test("a panel without valueName stays transparent, and two levels nest", () => {
    const survey = new SurveyModel(pdJson(undefined, [
      { type: "panel", name: "plain", elements: [{ type: "text", name: "zip" }] },
      { type: "panel", name: "p2", valueName: "b", elements: [{ type: "text", name: "street" }] }
    ]));
    const pd = pdOf(survey);
    pd.addPanel();
    inPanel(pd.panels[0], "zip").value = "z";
    inPanel(pd.panels[0], "street").value = "s";
    expect(survey.data).toEqual({ items: [{ address: { zip: "z", b: { street: "s" } } }] });
    expect(inPanel(pd.panels[0], "street").getDataPath()).toEqual(["address", "b", "street"]);
    survey.data = { items: [{ address: { zip: "z2", b: { street: "s2" } } }] };
    expect(inPanel(pd.panels[0], "zip").value).toBe("z2");
    expect(inPanel(pd.panels[0], "street").value).toBe("s2");
  });
  test("dataNesting modes follow RN3: only valueName nests in a record, \"none\" switches it off", () => {
    const json = (mode: string): any => pdJson({ dataNesting: mode }, [
      { type: "text", name: "street" },
      { type: "panel", name: "plain", elements: [{ type: "text", name: "zip" }] }
    ]);
    ["auto", "panel", "page", "panelAndPage"].forEach(mode => {
      const survey = new SurveyModel(json(mode));
      const pd = pdOf(survey);
      pd.addPanel();
      inPanel(pd.panels[0], "street").value = "s";
      inPanel(pd.panels[0], "zip").value = "z";
      const value = survey.getValue("items") || (survey.data.page1 || {}).items;
      expect(value, mode).toEqual([{ address: { street: "s", zip: "z" } }]);
    });
    const none = new SurveyModel(json("none"));
    const pd = pdOf(none);
    pd.addPanel();
    inPanel(pd.panels[0], "street").value = "s";
    expect(none.data, "none").toEqual({ items: [{ street: "s" }] });
  });
  test("records added, removed, sorted and paged keep each record's nested object", () => {
    const survey = new SurveyModel(pdJson());
    const pd = pdOf(survey);
    survey.data = { items: [{ title: "b", address: { street: "B" } }, { title: "a", address: { street: "A" } }, { title: "c", address: { street: "C" } }] };
    pd.addPanel();
    inPanel(pd.panels[3], "street").value = "D";
    expect(pd.value[3], "#1 added").toEqual({ address: { street: "D" } });
    pd.removePanel(0);
    expect(pd.value.map((r: any) => r.address.street), "#2 removed").toEqual(["A", "C", "D"]);
    expect(pd.panels.map(p => inPanel(p, "street").value), "#3").toEqual(["A", "C", "D"]);
    pd.sortCriteria = [{ field: "title", direction: "desc" }];
    expect(pd.panels.map(p => inPanel(p, "street").value), "#4 sorted").toEqual(["C", "A", "D"]);
    inPanel(pd.panels[0], "street").value = "C2";
    expect(pd.value.map((r: any) => r.address.street), "#5 a sorted panel writes into its record").toEqual(["A", "C2", "D"]);
    pd.sortCriteria = [];
    pd.pageSize = 2;
    pd.pageIndex = 1;
    expect(pd.panels.map(p => inPanel(p, "street").value), "#6 paged").toEqual(["D"]);
  });
  test("display value, isEmpty, clearIncorrectValues keeps the container key, removes an unknown key inside it", () => {
    const survey = new SurveyModel(pdJson(undefined, [{ type: "dropdown", name: "kind", choices: [{ value: 1, text: "One" }] }]));
    const pd = pdOf(survey);
    survey.data = { items: [{ title: "A", address: { kind: 1, foo: 2 }, bar: 3 }] };
    expect(pd.isEmpty(), "#1").toBe(false);
    expect(pd.getDisplayValue(false), "#2 the nested object is formatted by its questions").toEqual([{ title: "A", address: { kind: "One", foo: 2 }, bar: 3 }]);
    pd.clearIncorrectValues();
    expect(survey.data, "#3").toEqual({ items: [{ title: "A", address: { kind: 1 } }] });
  });
  test("setData() reports unknown keys inside a record's object with the path (D6)", () => {
    const survey = new SurveyModel(pdJson());
    const issues = survey.setData({ items: [{ title: "A", address: { street: "s", foo: 1 }, bar: 2 }] });
    expect(issues.map(issue => issue.type + ":" + issue.path).sort()).toEqual(["unknownProperty:items[0].address.foo", "unknownProperty:items[0].bar"]);
  });
  test("setData() reports an unknown key inside a record's object with its value", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "paneldynamic", name: "items", panelCount: 1, templateElements: [
      { type: "text", name: "title" },
      { type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street" }] }] }] });
    const issues = survey.setData({ items: [{ title: "t", address: { street: "s", foo: { a: 1 } }, bar: 2 }] });
    expect(issues.map(issue => issue.path + "=" + JSON.stringify((<any>issue).value)).sort())
      .toEqual(["items[0].address.foo={\"a\":1}", "items[0].bar=2"]);
  });
  test("a nesting panel's object in the display value: keys as text rename inside it too", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "paneldynamic", name: "items", templateElements: [
      { type: "text", name: "title", title: "Title" },
      { type: "panel", name: "p1", valueName: "address", elements: [
        { type: "dropdown", name: "kind", title: "Kind", choices: [{ value: 1, text: "One" }] },
        { type: "panel", name: "p2", valueName: "geo", elements: [{ type: "text", name: "lat", title: "Latitude" }] }] }] }] });
    survey.data = { items: [{ title: "A", address: { kind: 1, geo: { lat: "5" }, foo: 2 } }] };
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("items");
    expect(pd.getDisplayValue(true)).toEqual([{ Title: "A", address: { Kind: "One", geo: { Latitude: "5" }, foo: 2 } }]);
    expect(pd.getDisplayValue(false)).toEqual([{ title: "A", address: { kind: "One", geo: { lat: "5" }, foo: 2 } }]);
  });
  test("defaults inside the object land in the object", () => {
    const survey = new SurveyModel(pdJson(undefined, [{ type: "text", name: "street", defaultValue: "def" }]));
    const pd = pdOf(survey);
    pd.addPanel();
    expect(survey.data).toEqual({ items: [{ address: { street: "def" } }] });
  });
  test("events: one onValueChanged and one onDynamicPanelValueChanged per inner write", () => {
    const survey = new SurveyModel(pdJson());
    const pd = pdOf(survey);
    pd.addPanel();
    const changed: Array<string> = [];
    const panelChanged: Array<string> = [];
    survey.onValueChanged.add((_, o) => changed.push(o.name + "=" + JSON.stringify(o.value)));
    survey.onDynamicPanelValueChanged.add((_, o) => panelChanged.push(o.name + "=" + JSON.stringify(o.value)));
    inPanel(pd.panels[0], "street").value = "x";
    expect(changed).toEqual(["items=[{\"address\":{\"street\":\"x\"}}]"]);
    expect(panelChanged, "the inner question's name and value, as for a question directly in the panel").toEqual(["street=\"x\""]);
  });
  test("expressions: {panel.address.street}, {panel.address}, {street} and {title} inside the nesting panel, {prevPanel.address.street}", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "paneldynamic", name: "items", templateElements: [
        { type: "text", name: "title" },
        { type: "panel", name: "p1", valueName: "address", elements: [
          { type: "text", name: "street" },
          { type: "expression", name: "inner1", expression: "{street} + '-' + {panel.title}" },
          { type: "expression", name: "inner2", expression: "{title}" }
        ] },
        { type: "expression", name: "direct2", expression: "{title}" },
        { type: "expression", name: "e1", expression: "{panel.address.street}" },
        { type: "expression", name: "e2", expression: "{prevPanel.address.street}" },
        { type: "text", name: "vis", visibleIf: "{panel.address.street} = 'show'" },
        { type: "text", name: "t1", title: "Street: {panel.address.street}" }
      ] }
    ] });
    const pd = pdOf(survey);
    survey.data = { items: [{ title: "A", address: { street: "S1" } }, { title: "B", address: { street: "show" } }] };
    const p0 = pd.panels[0];
    const p1 = pd.panels[1];
    expect(inPanel(p0, "e1").value, "#1").toBe("S1");
    expect(inPanel(p0, "inner1").value, "#2").toBe("S1-A");
    expect(inPanel(p0, "inner2").value, "#2a {title} resolves as for a question directly in the panel").toBe(inPanel(p0, "direct2").value);
    expect(inPanel(p1, "e2").value, "#3").toBe("S1");
    expect(inPanel(p0, "vis").isVisible, "#4").toBe(false);
    expect(inPanel(p1, "vis").isVisible, "#5").toBe(true);
    inPanel(p0, "street").value = "show";
    expect(inPanel(p0, "e1").value, "#6 a dependency re-runs").toBe("show");
    expect(inPanel(p0, "vis").isVisible, "#7").toBe(true);
    expect(inPanel(p0, "inner1").value, "#8").toBe("show-A");
    expect(inPanel(p1, "e2").value, "#9 the next panel re-runs").toBe("show");
    expect(inPanel(p0, "t1").locTitle.renderedHtml, "#10 text piping").toBe("Street: show");
    const ctx = (<any>p0.data).getValueGetterContext();
    expect(new ValueGetter().getValue("panel.address", ctx), "#11 the object").toEqual({ street: "show", inner1: "show-A" });
  });
  test("a trigger in the record writes into an inner question; a calculated value over a record's nested field", () => {
    const survey = new SurveyModel({ dataNesting: "auto",
      calculatedValues: [{ name: "firstStreet", expression: "{items[0].address.street}" }],
      elements: [
        { type: "paneldynamic", name: "items", templateElements: [
          { type: "text", name: "title", setValueIf: "{panel.address.street} = 'x'", setValueExpression: "'set'" },
          { type: "panel", name: "p1", valueName: "address", elements: [
            { type: "text", name: "street" },
            { type: "text", name: "city", setValueIf: "{panel.title} = 'go'", setValueExpression: "'Oslo'" }
          ] }
        ] },
        { type: "expression", name: "calc", expression: "{firstStreet}" }
      ] });
    const pd = pdOf(survey);
    pd.addPanel();
    inPanel(pd.panels[0], "street").value = "x";
    expect(inPanel(pd.panels[0], "title").value, "#1").toBe("set");
    inPanel(pd.panels[0], "title").value = "go";
    expect(inPanel(pd.panels[0], "city").value, "#2").toBe("Oslo");
    expect(pd.value, "#3").toEqual([{ title: "go", address: { street: "x", city: "Oslo" } }]);
    expect(survey.getQuestionByName("calc").value, "#4").toBe("x");
  });
  test("clearInvisibleValues / clearIfInvisible: a hidden nesting panel inside a record is cleared as a plain one is", () => {
    // Inside a record a hidden panel's questions are cleared on completion; a question's clearIfInvisible
    // "onHidden" does not clear them when their panel hides. Both as for a panel without valueName.
    const create = (valueName: string, clearInvisibleValues: string, clearIfInvisible: string): SurveyModel => {
      const survey = new SurveyModel({ dataNesting: "auto", clearInvisibleValues: clearInvisibleValues, elements: [
        { type: "paneldynamic", name: "items", templateElements: [
          { type: "text", name: "title" },
          { type: "panel", name: "p1", valueName: valueName, visibleIf: "{panel.title} != 'hide'", elements: [
            { type: "text", name: "street", clearIfInvisible: clearIfInvisible }, { type: "text", name: "city" }] }
        ] }
      ] });
      const pd = pdOf(survey);
      pd.addPanel();
      inPanel(pd.panels[0], "street").value = "s";
      inPanel(pd.panels[0], "city").value = "c";
      inPanel(pd.panels[0], "title").value = "hide";
      return survey;
    };
    const completed = create("address", "onComplete", "default");
    completed.doComplete();
    expect(completed.data, "#1 the empty object is removed").toEqual({ items: [{ title: "hide" }] });
    const flatCompleted = create(undefined, "onComplete", "default");
    flatCompleted.doComplete();
    expect(flatCompleted.data, "#2 flat").toEqual({ items: [{ title: "hide" }] });
    expect(create("address", "none", "onHidden").data, "#3").toEqual({ items: [{ title: "hide", address: { street: "s", city: "c" } }] });
    expect(create(undefined, "none", "onHidden").data, "#4 flat").toEqual({ items: [{ title: "hide", street: "s", city: "c" }] });
  });
  test("checkErrorsMode \"onValueChanging\": an invalid inner value is not written", () => {
    const survey = new SurveyModel(pdJson({ checkErrorsMode: "onValueChanging" },
      [{ type: "text", name: "street", validators: [{ type: "numeric", minValue: 10 }] }]));
    const pd = pdOf(survey);
    pd.addPanel();
    const street = inPanel(pd.panels[0], "street");
    street.value = 5;
    expect(street.errors.length, "#1").toBe(1);
    expect(survey.data, "#2 the panel's empty record only").toEqual({ items: [{}] });
    street.value = 20;
    expect(street.errors.length, "#3").toBe(0);
    expect(survey.data, "#4").toEqual({ items: [{ address: { street: 20 } }] });
  });
  test("survey.clearEmptyValues() inside a record's object", () => {
    const survey = new SurveyModel(pdJson(undefined, [{ type: "text", name: "street" }, { type: "text", name: "city" }]));
    survey.data = { items: [{ title: "A", address: { street: "", city: "c" } }] };
    survey.clearEmptyValues();
    expect(survey.data).toEqual({ items: [{ title: "A", address: { city: "c" } }] });
    expect(inPanel(pdOf(survey).panels[0], "city").value).toBe("c");
  });
  test("runtime: valueName set and cleared on a panel inside a template's panel, dataNesting switched to \"none\" (D8)", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "paneldynamic", name: "items", panelCount: 1, templateElements: [
        { type: "panel", name: "p1", elements: [{ type: "text", name: "street" }] }
      ] }
    ] });
    survey.data = { items: [{ street: "flat" }] };
    const pd = pdOf(survey);
    const p1 = <PanelModel>pd.panels[0].getElementByName("p1");
    p1.valueName = "address";
    expect(p1.isDataNesting, "#1").toBe(true);
    expect(inPanel(pd.panels[0], "street").isEmpty(), "#2 reads from the new place").toBe(true);
    inPanel(pd.panels[0], "street").value = "nested";
    expect(survey.data, "#3 the old key stays").toEqual({ items: [{ street: "flat", address: { street: "nested" } }] });
    p1.valueName = "";
    expect(inPanel(pd.panels[0], "street").value, "#4 reads the flat key again").toBe("flat");

    p1.valueName = "address";
    expect(inPanel(pd.panels[0], "street").value, "#5").toBe("nested");
    survey.dataNesting = "none";
    expect(p1.isDataNesting, "#6").toBe(false);
    expect(inPanel(pd.panels[0], "street").value, "#7").toBe("flat");
    survey.dataNesting = "auto";
    expect(inPanel(pd.panels[0], "street").value, "#8").toBe("nested");
  });
  test("a template valueName change reaches the panels built after it", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "paneldynamic", name: "items", templateElements: [
        { type: "panel", name: "p1", elements: [{ type: "text", name: "street" }] }
      ] }
    ] });
    const pd = pdOf(survey);
    (<PanelModel>pd.template.getElementByName("p1")).valueName = "address";
    pd.addPanel();
    inPanel(pd.panels[0], "street").value = "s";
    expect(survey.data).toEqual({ items: [{ address: { street: "s" } }] });
  });
  test("sort fields: a question inside a nesting panel is not offered (RN5)", () => {
    const survey = new SurveyModel(pdJson({}, [{ type: "text", name: "street" }]));
    const pd = pdOf(survey);
    pd.allowSort = true;
    const fields = pd.getDesignSortFields().map(f => f.field);
    expect(fields).toEqual(["title"]);
    survey.data = { items: [{ title: "b", address: { street: "1" } }, { title: "a", address: { street: "2" } }] };
    pd.sortCriteria = [{ field: "street", direction: "asc" }];
    expect(pd.panels.map(p => inPanel(p, "title").value), "an unknown field is ignored").toEqual(["b", "a"]);
  });
});

describe("records nesting: a matrix detail panel", () => {
  ["matrixdynamic", "matrixdropdown"].forEach(type => {
    test(type + ": typing, question.value and survey.data give the nested record", () => {
      const survey = new SurveyModel(matrixJson(undefined, type));
      const matrix = matrixOf(survey);
      if (type === "matrixdynamic") matrix.addRow();
      const row = matrix.visibleRows[0];
      row.getQuestionByColumnName("col1").value = 1;
      detailOf(row, "street").value = "Main St";
      const expected = [{ col1: 1, address: { street: "Main St" } }];
      const value = type === "matrixdynamic" ? expected : { r1: expected[0] };
      expect(survey.data, "#1").toEqual({ rows: value });
      expect(row.value, "#2 the row value").toEqual(expected[0]);
      expect(row.isEmpty, "#3").toBe(false);

      const newValue = type === "matrixdynamic" ? [{ col1: 2, address: { street: "S2" } }] : { r1: { col1: 2, address: { street: "S2" } } };
      matrix.value = newValue;
      const row2 = matrix.visibleRows[0];
      expect(row2.getQuestionByColumnName("col1").value, "#4").toBe(2);
      expect(detailOf(row2, "street").value, "#5 a detail panel created after the record is set reads it").toBe("S2");

      survey.data = { rows: type === "matrixdynamic" ? [{ address: { street: "S3" } }] : { r1: { address: { street: "S3" } } } };
      expect(detailOf(matrix.visibleRows[0], "street").value, "#6").toBe("S3");
      detailOf(matrix.visibleRows[0], "street").clearValue();
      // A dynamic matrix keeps its empty records (Bug#12147); a dropdown matrix drops an empty row.
      expect(survey.data, "#7 the empty object is removed").toEqual(type === "matrixdynamic" ? { rows: [{}] } : {});
    });
  });
  test("the detail question's data path is relative to the row (RN4); a cell keeps the survey", () => {
    const survey = new SurveyModel(matrixJson());
    const matrix = matrixOf(survey);
    matrix.addRow();
    const row = matrix.visibleRows[0];
    const street = detailOf(row, "street");
    expect(street.getDataPath()).toEqual(["address", "street"]);
    expect(row.getQuestionByColumnName("col1").getValueScope()).toBe(survey);
    expect(row.detailPanel.getDataScope(), "the detail panel itself never nests (RN6)").toBeFalsy();
  });
  test("events: one onMatrixCellValueChanged and one onValueChanged per inner write", () => {
    const survey = new SurveyModel(matrixJson());
    const matrix = matrixOf(survey);
    matrix.addRow();
    const row = matrix.visibleRows[0];
    const street = detailOf(row, "street");
    const cells: Array<string> = [];
    const changing: Array<string> = [];
    const changed: Array<string> = [];
    survey.onMatrixCellValueChanged.add((_, o) => cells.push(o.columnName + "=" + JSON.stringify(o.value)));
    survey.onMatrixCellValueChanging.add((_, o) => changing.push(o.columnName + "=" + JSON.stringify(o.value)));
    survey.onValueChanged.add((_, o) => changed.push(o.name));
    street.value = "x";
    expect(changing, "#1 the container key and the object").toEqual(["address={\"street\":\"x\"}"]);
    expect(cells, "#2").toEqual(["address={\"street\":\"x\"}"]);
    expect(changed, "#3").toEqual(["rows"]);
  });
  test("onMatrixCellValueChanging changes the object: the inner question follows", () => {
    const survey = new SurveyModel(matrixJson());
    survey.onMatrixCellValueChanging.add((_, o) => {
      if (o.columnName === "address") o.value = { street: o.value.street.toUpperCase() };
    });
    const matrix = matrixOf(survey);
    matrix.addRow();
    const street = detailOf(matrix.visibleRows[0], "street");
    street.value = "abc";
    expect(survey.data).toEqual({ rows: [{ address: { street: "ABC" } }] });
    expect(street.value).toBe("ABC");
  });
  test("expressions: {row.address.street} and {row.address}; a calculated value over a row's nested field", () => {
    const survey = new SurveyModel({ dataNesting: "auto",
      calculatedValues: [{ name: "firstStreet", expression: "{rows[0].address.street}" }],
      elements: [
        { type: "matrixdynamic", name: "rows", rowCount: 1, detailPanelMode: "underRow",
          columns: [{ name: "col1", cellType: "expression", expression: "{row.address.street}" }],
          detailElements: [
            { type: "panel", name: "p1", valueName: "address", elements: [
              { type: "text", name: "street" }, { type: "expression", name: "inner1", expression: "{street} + '!'" }] },
            { type: "expression", name: "d1", expression: "{row.address.street}" }
          ] },
        { type: "expression", name: "calc", expression: "{firstStreet}" }
      ] });
    const matrix = matrixOf(survey);
    const row = matrix.visibleRows[0];
    detailOf(row, "street").value = "S";
    expect(row.getQuestionByColumnName("col1").value, "#1").toBe("S");
    expect(detailOf(row, "d1").value, "#2").toBe("S");
    expect(detailOf(row, "inner1").value, "#3").toBe("S!");
    expect(survey.getQuestionByName("calc").value, "#4").toBe("S");
    expect(new ValueGetter().getValue("row.address", row.getValueGetterContext()), "#5").toEqual({ street: "S", inner1: "S!" });
  });
  test("clearIncorrectValues keeps the container key; setData() reports an unknown key inside it", () => {
    const survey = new SurveyModel(matrixJson());
    const issues = survey.setData({ rows: [{ col1: "1", address: { street: "s", foo: 1 } }] });
    expect(issues.map(issue => issue.type + ":" + issue.path).sort()).toEqual(["unknownProperty:rows[0].address.foo"]);
    const matrix = matrixOf(survey);
    matrix.clearIncorrectValues();
    expect(survey.data).toEqual({ rows: [{ col1: "1", address: { street: "s" } }] });
    expect(matrix.getDisplayValue(false)).toEqual([{ col1: "1", address: { street: "s" } }]);
  });
  test("checkErrorsMode \"onValueChanging\": an invalid detail value is not written", () => {
    const survey = new SurveyModel({ dataNesting: "auto", checkErrorsMode: "onValueChanging", elements: [
      { type: "matrixdynamic", name: "rows", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "col1" }],
        detailElements: [{ type: "panel", name: "p1", valueName: "address", elements: [
          { type: "text", name: "street", validators: [{ type: "numeric", minValue: 10 }] }] }] }
    ] });
    const street = detailOf(matrixOf(survey).visibleRows[0], "street");
    street.value = 5;
    expect(street.errors.length, "#1").toBe(1);
    expect(survey.data, "#2 the matrix's empty record only").toEqual({ rows: [{}] });
    street.value = 20;
    expect(survey.data, "#3").toEqual({ rows: [{ address: { street: 20 } }] });
  });
  test("defaults inside the detail panel's object", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "matrixdynamic", name: "rows", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "col1" }],
        detailElements: [{ type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street", defaultValue: "def" }] }] }
    ] });
    const row = matrixOf(survey).visibleRows[0];
    expect(detailOf(row, "street").value).toBe("def");
    expect(row.value).toEqual({ address: { street: "def" } });
  });
  test("the paths of a row's default values: the cells, then the detail questions", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow",
      columns: [{ name: "c1", cellType: "text" }, { name: "c2", cellType: "text", defaultValue: "dc" }],
      detailElements: [{ type: "text", name: "d1" }, { type: "panel", name: "p", elements: [{ type: "text", name: "d2", defaultValue: "dd" }] },
        { type: "panel", name: "p2", valueName: "obj", elements: [{ type: "text", name: "d3", defaultValue: "do" }] }] }] });
    const row = (<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).visibleRows[0];
    row.showDetailPanel();
    expect(row.getDefaultValuePaths()).toEqual([["c2"], ["d2"], ["obj", "d3"]]);
  });
  test("a new row's value without its defaults: an emptied object goes, an array is skipped", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdropdown", name: "m", rows: ["r1"], columns: [{ name: "col1", cellType: "text" }] }] });
    const matrix: any = survey.getQuestionByName("m");
    // Private: the public API reaches this only through a row built again over a stored array where a nesting
    // panel's object is, and the stored object it must not change is not reachable from outside.
    matrix.defaultValuesInRows = { r1: [["address", "street"]] };
    const stored = { street: "dflt" };
    expect(matrix.getRowValueForCreation({ r1: { address: stored, col1: "c" } }, "r1"), "#1").toEqual({ col1: "c" });
    expect(stored, "#2 the stored object is not changed").toEqual({ street: "dflt" });
    expect(matrix.getRowValueForCreation({ r1: { address: { street: "dflt", zip: "z" } } }, "r1"), "#3").toEqual({ address: { zip: "z" } });
    expect(matrix.getRowValueForCreation({ r1: { address: ["a"] } }, "r1"), "#4").toEqual({ address: ["a"] });
  });
  test("rows sorted keep each record's nested object", () => {
    const survey = new SurveyModel(matrixJson());
    const matrix = matrixOf(survey);
    survey.data = { rows: [{ col1: "b", address: { street: "B" } }, { col1: "a", address: { street: "A" } }] };
    matrix.sortCriteria = [{ field: "col1", direction: "asc" }];
    expect(matrix.visibleRows.map(r => detailOf(r, "street").value)).toEqual(["A", "B"]);
    detailOf(matrix.visibleRows[0], "street").value = "A2";
    expect(survey.data).toEqual({ rows: [{ col1: "b", address: { street: "B" } }, { col1: "a", address: { street: "A2" } }] });
  });
  test("sort fields: a question inside a nesting detail panel is not offered (RN5)", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "matrixdynamic", name: "rows", allowSort: true, detailPanelMode: "underRow", columns: [{ name: "col1" }],
        detailElements: [{ type: "text", name: "flat" }, { type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street" }] }] }
    ] });
    expect(matrixOf(survey).getDesignSortFields().map(f => f.field)).toEqual(["col1", "flat"]);
    survey.dataNesting = "none";
    expect(matrixOf(survey).getDesignSortFields().map(f => f.field), "#2 none: the panel does not nest").toEqual(["col1", "flat", "street"]);
  });
  test("runtime: valueName set and cleared on a detail panel's inner panel, dataNesting \"none\" (D8)", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "matrixdynamic", name: "rows", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "col1" }],
        detailElements: [{ type: "panel", name: "p1", elements: [{ type: "text", name: "street" }] }] }
    ] });
    survey.data = { rows: [{ street: "flat" }] };
    const row = matrixOf(survey).visibleRows[0];
    const street = detailOf(row, "street");
    const p1 = <PanelModel>row.detailPanel.getElementByName("p1");
    p1.valueName = "address";
    expect(street.isEmpty(), "#1").toBe(true);
    street.value = "nested";
    expect(survey.data, "#2 the old key stays").toEqual({ rows: [{ street: "flat", address: { street: "nested" } }] });
    p1.valueName = "";
    expect(street.value, "#3").toBe("flat");
    p1.valueName = "address";
    survey.dataNesting = "none";
    expect(detailOf(matrixOf(survey).visibleRows[0], "street").value, "#4").toBe("flat");
  });
  test("getRecordDataNestingKey of a panel in the detail panel template follows the survey's dataNesting", () => {
    // The template is attached to no survey: the key reads the mode through the matrix (Creator prompt 04).
    const survey = new SurveyModel(matrixJson({ dataNesting: "none" }));
    const p1 = <PanelModel>matrixOf(survey).detailPanel.getElementByName("p1");
    expect(p1.getRecordDataNestingKey(), "#1 none").toBe("");
    survey.dataNesting = "auto";
    expect(p1.getRecordDataNestingKey(), "#2 auto").toBe("address");
    const pd = new SurveyModel(pdJson({ dataNesting: "none" }));
    const pdPanel = <PanelModel>(<QuestionPanelDynamicModel>pd.getQuestionByName("items")).template.getElementByName("p1");
    expect(pdPanel.getRecordDataNestingKey(), "#3 a dynamic panel's template, none").toBe("");
    const nested = new SurveyModel({ dataNesting: "none", elements: [{ type: "matrixdynamic", name: "rows", detailPanelMode: "underRow", columns: [{ name: "col1" }],
      detailElements: [{ type: "paneldynamic", name: "items", templateElements: [
        { type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street" }] }, { type: "text", name: "top" }] }] }] });
    const innerPd = <QuestionPanelDynamicModel>matrixOf(nested).detailPanel.getQuestionByName("items");
    const innerP1 = <PanelModel>innerPd.template.getElementByName("p1");
    expect(innerP1.getRecordDataNestingKey(), "#4 a dynamic panel in the detail panel template, none").toBe("");
    expect(innerPd.getDesignSortFields().map(f => f.field), "#5").toEqual(["street", "top"]);
    nested.dataNesting = "auto";
    expect(innerP1.getRecordDataNestingKey(), "#6 auto").toBe("address");
    expect(innerPd.getDesignSortFields().map(f => f.field), "#7").toEqual(["top"]);
  });
});

describe("records nesting: more records", () => {
  test("records filtered keep each record's nested object", () => {
    const survey = new SurveyModel(pdJson());
    const pd = pdOf(survey);
    survey.data = { items: [{ title: "a", address: { street: "A" } }, { title: "b", address: { street: "B" } }] };
    pd.filterExpression = "{title} = 'b'";
    expect(pd.panels.map(p => inPanel(p, "street").value), "#1").toEqual(["B"]);
    inPanel(pd.panels[0], "street").value = "B2";
    expect(survey.data, "#2").toEqual({ items: [{ title: "a", address: { street: "A" } }, { title: "b", address: { street: "B2" } }] });
    pd.filterExpression = "";
    expect(pd.panels.map(p => inPanel(p, "street").value), "#3").toEqual(["A", "B2"]);
  });
  test("clearIncorrectValues reaches a record that has no panel (paged)", () => {
    const survey = new SurveyModel(pdJson({}, [{ type: "dropdown", name: "kind", choices: [1, 2] }]));
    const pd = pdOf(survey);
    pd.pageSize = 1;
    survey.data = { items: [{ address: { kind: 1, foo: 1 } }, { address: { kind: 5, bar: 2 }, baz: 3 }] };
    expect(pd.panels.length, "#1 one panel on the page").toBe(1);
    pd.clearIncorrectValues();
    expect(survey.data, "#2").toEqual({ items: [{ address: { kind: 1 } }, {}] });
  });
  test("two nesting panels on one key in a record share its object (D4)", () => {
    const survey = new SurveyModel(pdJson({}, [{ type: "text", name: "street" }]));
    const pd = pdOf(survey);
    pd.template.addNewQuestion("text", "zip");
    const p2 = new PanelModel("p2");
    p2.valueName = "address";
    p2.addNewQuestion("text", "street2").valueName = "street";
    pd.template.addElement(p2);
    pd.addPanel();
    inPanel(pd.panels[0], "street").value = "s";
    expect(inPanel(pd.panels[0], "street2").value, "#1 the other panel's question follows").toBe("s");
    inPanel(pd.panels[0], "street2").value = "s2";
    expect(inPanel(pd.panels[0], "street").value, "#2").toBe("s2");
    expect(survey.data, "#3").toEqual({ items: [{ address: { street: "s2" } }] });
  });
  test("a question named like the container key inside the panel (D4: allowed)", () => {
    const survey = new SurveyModel(matrixJson());
    const matrix = matrixOf(survey);
    (<PanelModel>matrix.detailPanel.getElementByName("p1")).addNewQuestion("text", "address");
    matrix.addRow();
    const row = matrix.visibleRows[0];
    detailOf(row, "address").value = "inner";
    expect(survey.data).toEqual({ rows: [{ address: { address: "inner" } }] });
  });
  test("auto-advance: a question inside a record's nesting panel answers as one directly in the record (RN4)", () => {
    const create = (valueName: string): SurveyModel => new SurveyModel({ dataNesting: "auto", autoAdvanceEnabled: true, pages: [
      { elements: [{ type: "paneldynamic", name: "items", panelCount: 1, templateElements: [
        { type: "panel", name: "p1", valueName: valueName, elements: [{ type: "rating", name: "rate" }] }] }] },
      { elements: [{ type: "text", name: "q2" }] }
    ] });
    [undefined, "address"].forEach(valueName => {
      const survey = create(valueName);
      const rate = inPanel(pdOf(survey).panels[0], "rate");
      expect(rate["isAutoAdvanceOwner"], String(valueName)).toBe(false);
      rate.value = 3;
      expect(survey.currentPageNo, String(valueName)).toBe(0);
    });
  });
  test("dataNesting \"none\" switched to \"auto\" at runtime nests the existing panels too (D8)", () => {
    const survey = new SurveyModel(pdJson({ dataNesting: "none" }));
    survey.data = { items: [{ title: "A", street: "flat" }] };
    const pd = pdOf(survey);
    expect(inPanel(pd.panels[0], "street").value, "#1").toBe("flat");
    survey.dataNesting = "auto";
    expect((<PanelModel>pd.panels[0].getElementByName("p1")).isDataNesting, "#2").toBe(true);
    expect(inPanel(pd.panels[0], "street").isEmpty(), "#3 reads from the new place").toBe(true);
    inPanel(pd.panels[0], "street").value = "typed";
    expect(survey.data, "#4").toEqual({ items: [{ title: "A", street: "flat", address: { street: "typed" } }] });
    survey.dataNesting = "none";
    expect(inPanel(pd.panels[0], "street").value, "#5").toBe("flat");
  });
  test("a valueName set on a built panel keeps its object through clearIncorrectValues", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "paneldynamic", name: "items", panelCount: 1, templateElements: [
      { type: "panel", name: "p1", elements: [{ type: "text", name: "street" }] }] }] });
    const pd = pdOf(survey);
    (<PanelModel>pd.panels[0].getElementByName("p1")).valueName = "address";
    inPanel(pd.panels[0], "street").value = "s";
    pd.clearIncorrectValues();
    expect(survey.data).toEqual({ items: [{ address: { street: "s" } }] });
  });
  test("a column named like an inner question does not hide the writer from onValueChanging validation", () => {
    const survey = new SurveyModel({ dataNesting: "auto", checkErrorsMode: "onValueChanging", elements: [
      { type: "matrixdynamic", name: "rows", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "street" }],
        detailElements: [{ type: "panel", name: "p1", valueName: "address", elements: [
          { type: "text", name: "street", validators: [{ type: "numeric", minValue: 10 }] }] }] }
    ] });
    const row = matrixOf(survey).visibleRows[0];
    row.showDetailPanel();
    const inner = <Question>(<PanelModel>row.detailPanel.getElementByName("p1")).getQuestionByName("street");
    inner.value = 5;
    expect(inner.errors.length, "#1").toBe(1);
    expect(survey.data, "#2").toEqual({ rows: [{}] });
  });
  test("records without a nesting panel keep the released key rules", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "items", templateElements: [
      { type: "panel", name: "plain", elements: [{ type: "text", name: "street" }] }] }] });
    const issues = survey.setData({ items: [{ street: "s", foo: 1 }] });
    expect(issues.map(issue => issue.type + ":" + issue.path)).toEqual(["unknownProperty:items[0].foo"]);
    expect(pdOf(survey).getDisplayValue(false)).toEqual([{ street: "s", foo: 1 }]);
  });
});

describe("records nesting: where a panel may nest", () => {
  test("the designer's templates never nest", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(Object.assign(pdJson(), { elements: pdJson().elements.concat(matrixJson().elements) }));
    const pd = pdOf(survey);
    expect((<PanelModel>pd.template.getElementByName("p1")).isDataNesting, "dynamic panel template").toBe(false);
    expect((<PanelModel>matrixOf(survey).detailPanel.getElementByName("p1")).isDataNesting, "detail panel template").toBe(false);
  });
  test("a nesting panel moved into a dynamic panel's template does not nest itself there", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "p1", valueName: "a", elements: [{ type: "text", name: "q1" }] },
      { type: "paneldynamic", name: "items" }] });
    const panel = <PanelModel>survey.getPanelByName("p1");
    const pd = pdOf(survey);
    survey.pages[0].removeElement(panel);
    pd.template.addElement(panel);
    expect(panel.getDataScope()).toBeNull();
  });
  test("the unknown paths of a record follow a template change", () => {
    const survey = new SurveyModel(pdJson());
    const pd = pdOf(survey);
    pd.template.addNewQuestion("text", "q2");
    (<PanelModel>pd.template.getElementByName("p1")).valueName = "addr";
    expect(pd.getRecordNestedUnknownPaths({ addr: { street: "s", foo: 1 } })).toEqual([["addr", "foo"]]);
  });
  test("the unknown paths of a row follow a detail panel template, which is on no survey", () => {
    const survey = new SurveyModel(matrixJson());
    const matrix = matrixOf(survey);
    expect(matrix.detailPanel.survey, "#1").toBeFalsy();
    (<PanelModel>matrix.detailPanel.getElementByName("p1")).addNewQuestion("text", "zip");
    expect(matrix.getRecordNestedUnknownPaths({ address: { street: "s", zip: "z" } }), "#2 an added question").toEqual([]);
    // A valueName loaded into a template element sends no notification.
    (<Question>matrix.detailPanel.getQuestionByName("street")).fromJSON({ valueName: "st" });
    expect(matrix.getRecordNestedUnknownPaths({ address: { st: "x", street: "y" } }), "#3").toEqual([["address", "street"]]);
    matrix.detailPanelMode = "none";
    expect(matrix.getRecordNestedUnknownPaths({ address: { st: "x", street: "y" } }), "#4 no detail panel").toEqual([]);
  });
  test("a dynamic panel's new panel has no records owner before its record is created", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "pd", templateElements: [{ type: "text", name: "q1" }] }] });
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    // The private factory: the public API gives a panel only once its record is created.
    const panel: PanelModelBase = pd["createAndSetupNewPanelObject"]();
    expect(panel.getRecordsOwner()).toBeNull();
  });
  test("a nesting panel inside a nesting panel at the survey level holds a dynamic panel whose records nest too", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [
      { type: "panel", name: "outer", valueName: "o", elements: [
        { type: "paneldynamic", name: "items", templateElements: [
          { type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street" }] }
        ] }
      ] }
    ] });
    const pd = pdOf(survey);
    pd.addPanel();
    inPanel(pd.panels[0], "street").value = "s";
    expect(survey.data).toEqual({ o: { items: [{ address: { street: "s" } }] } });
  });
});

describe("records nesting: the filter settings of a dynamic panel's template", () => {
  // A question inside a record's nesting panel is no filter field (getRecordTemplateFieldQuestions), so the
  // property grid must not offer it allowFiltering or filterOperators.
  // Each question's own class: text registers filterOperators again.
  const allow = (q: any): boolean => Serializer.findProperty(q.getType(), "allowFiltering").isVisible("", q);
  const operators = (q: any): boolean => Serializer.findProperty(q.getType(), "filterOperators").isVisible("", q);
  const settingsOf = (q: any): Array<boolean> => [allow(q), operators(q)];
  const cityJson = (dataNesting: string, valueName?: string): any => ({ dataNesting: dataNesting, elements: [
    { type: "paneldynamic", name: "pd", templateElements: [
      { type: "text", name: "a" },
      Object.assign({ type: "panel", name: "inner", elements: [{ type: "text", name: "city" }] }, valueName ? { valueName: valueName } : {})
    ] }] });
  const surveyOf = (json: any, isDesign: boolean): SurveyModel => {
    const survey = new SurveyModel();
    if (isDesign) survey.setDesignMode(true);
    survey.fromJSON(json);
    return survey;
  };
  const templateOf = (survey: SurveyModel): PanelModel => <PanelModel>(<QuestionPanelDynamicModel>survey.getQuestionByName("pd")).template;
  afterEach(() => { ComponentCollection.Instance.clear(); });

  test("a question in a nesting panel: hidden in \"auto\" with a valueName and in \"panel\"", () => {
    [false, true].forEach(isDesign => {
      ["auto", "panel"].forEach(mode => {
        const label = (isDesign ? "design, " : "runtime, ") + mode + ": ";
        const template = templateOf(surveyOf(cityJson(mode, "info"), isDesign));
        expect(settingsOf(template.getQuestionByName("city")), label + "city").toEqual([false, false]);
        expect(settingsOf(template.getQuestionByName("a")), label + "a, in the record").toEqual([true, true]);
      });
    });
  });
  test("the same panel where it does not nest: shown, as on master", () => {
    [false, true].forEach(isDesign => {
      const label = isDesign ? "design: " : "runtime: ";
      expect(settingsOf(templateOf(surveyOf(cityJson("none", "info"), isDesign)).getQuestionByName("city")), label + "\"none\"").toEqual([true, true]);
      expect(settingsOf(templateOf(surveyOf(cityJson("auto"), isDesign)).getQuestionByName("city")), label + "\"auto\", no valueName").toEqual([true, true]);
    });
  });
  test("a composite and a Multiple Textboxes in a nesting panel: hidden on the question and on its items", () => {
    ComponentCollection.Instance.add({ name: "filtercomp", elementsJSON: [{ type: "text", name: "first" }] });
    const survey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "paneldynamic", name: "pd", templateElements: [
      { type: "filtercomp", name: "c0" }, { type: "multipletext", name: "mt0", items: [{ name: "i1" }] },
      { type: "panel", name: "inner", valueName: "info", elements: [
        { type: "filtercomp", name: "c1" }, { type: "multipletext", name: "mt1", items: [{ name: "i1" }] }] }] }] });
    const template = templateOf(survey);
    const itemOf = (name: string): Question => (<Question>template.getQuestionByName(name)).getNestedQuestions(false, false)[0];
    expect(allow(template.getQuestionByName("c0")), "#1: a composite in the record").toBe(true);
    expect(settingsOf(itemOf("c0")), "#2: its item").toEqual([true, true]);
    expect(allow(template.getQuestionByName("mt0")), "#3: a Multiple Textboxes in the record").toBe(true);
    expect(settingsOf(itemOf("mt0")), "#4: its item").toEqual([true, true]);
    expect(allow(template.getQuestionByName("c1")), "#5: a composite in the nesting panel").toBe(false);
    expect(settingsOf(itemOf("c1")), "#6: its item").toEqual([false, false]);
    expect(allow(template.getQuestionByName("mt1")), "#7: a Multiple Textboxes in the nesting panel").toBe(false);
    expect(settingsOf(itemOf("mt1")), "#8: its item").toEqual([false, false]);
  });
  test("a nesting panel inside a plain panel, and a plain panel inside a nesting panel: hidden", () => {
    const survey = new SurveyModel({ dataNesting: "auto", elements: [{ type: "paneldynamic", name: "pd", templateElements: [
      { type: "panel", name: "plain", elements: [
        { type: "text", name: "p" },
        { type: "panel", name: "nest1", valueName: "n1", elements: [{ type: "text", name: "x" }] }] },
      { type: "panel", name: "nest2", valueName: "n2", elements: [
        { type: "panel", name: "plain2", elements: [{ type: "text", name: "y" }] }] }] }] });
    const template = templateOf(survey);
    expect(settingsOf(template.getQuestionByName("p")), "#1: in a plain panel").toEqual([true, true]);
    expect(settingsOf(template.getQuestionByName("x")), "#2: a nesting panel in a plain one").toEqual([false, false]);
    expect(settingsOf(template.getQuestionByName("y")), "#3: a plain panel in a nesting one").toEqual([false, false]);
  });
  test("dataNesting changed at runtime: the answer follows", () => {
    const survey = new SurveyModel(cityJson("none", "info"));
    const city = templateOf(survey).getQuestionByName("city");
    expect(settingsOf(city), "#1: \"none\"").toEqual([true, true]);
    survey.dataNesting = "auto";
    expect(settingsOf(city), "#2: \"auto\"").toEqual([false, false]);
    survey.dataNesting = "none";
    expect(settingsOf(city), "#3: \"none\" again").toEqual([true, true]);
  });
  // This test keeps the property rule (isFilterFieldInReach) and the field list (getFilterFields) from drifting apart.
  test("the two rules agree: a template question offers allowFiltering exactly when it, or an item of it, is a filter field", () => {
    ComponentCollection.Instance.add({ name: "filtercomp", elementsJSON: [{ type: "text", name: "first" }, { type: "text", name: "last" }] });
    const templateElements = [
      { type: "text", name: "a" },
      { type: "file", name: "f" },
      { type: "filtercomp", name: "c0" },
      { type: "multipletext", name: "mt0", items: [{ name: "i1" }, { name: "i2" }] },
      { type: "panel", name: "plain", elements: [
        { type: "text", name: "p" },
        { type: "panel", name: "nest1", valueName: "n1", elements: [{ type: "text", name: "x" }, { type: "multipletext", name: "mt1", items: [{ name: "i1" }] }] }] },
      { type: "panel", name: "nest2", valueName: "n2", elements: [
        { type: "text", name: "z" }, { type: "filtercomp", name: "c1" },
        { type: "panel", name: "plain2", elements: [{ type: "text", name: "y" }] }] },
      { type: "panel", name: "noKey", elements: [{ type: "text", name: "w" }] }];
    ["auto", "panel", "none"].forEach(mode => {
      [false, true].forEach(isDesign => {
        const label = (isDesign ? "design, " : "runtime, ") + mode + ": ";
        const survey = surveyOf({ dataNesting: mode, elements: [{ type: "paneldynamic", name: "pd", templateElements: templateElements }] }, isDesign);
        const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
        const fields = pd.getFilterFields().map(f => f.templateQuestion);
        const isField = (q: Question): boolean => fields.indexOf(q) > -1;
        pd.template.questions.forEach((q: Question) => {
          const items = q.hasNestedFilterFields ? q.getNestedQuestions(false, false) : [];
          expect(allow(q), label + q.name).toBe(isField(q) || items.some(isField));
          expect(operators(q), label + q.name + ", filterOperators").toBe(isField(q));
          items.forEach(item => {
            expect(settingsOf(item), label + q.name + "." + item.name).toEqual([isField(item), isField(item)]);
          });
        });
        const expected = mode === "none" ? ["a", "first", "last", "i1", "i2", "p", "x", "i1", "z", "first", "last", "y", "w"] : ["a", "first", "last", "i1", "i2", "p", "w"];
        expect(fields.map(q => q.name), label + "the fields").toEqual(expected);
      });
    });
  });
});
